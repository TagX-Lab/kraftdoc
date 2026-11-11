import React, { useState } from "react";
import {
  Layers,
  Scissors,
  Download,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Archive,
  FileCheck2,
} from "lucide-react";
import ToolLayout from "../components/layout/ToolLayout";
import Dropzone from "../components/common/Dropzone";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import DownloadAdModal from "../components/ads/DownloadAdModal";
import {
  mergePdfs,
  getPdfPageCount,
  extractPdfPages,
  splitAllPdfPages,
} from "../services/pdfService";
import { formatBytes, parsePageRanges, readFileAsArrayBuffer } from "../utils/fileHelpers";
import { downloadBlob, downloadMultipleAsZip } from "../utils/downloadHelpers";
import { useToast } from "../context/ToastContext";

export default function PdfMergeSplitPage({ onBack }) {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState("merge"); // 'merge' | 'split'

  // --- Merge State ---
  const [mergeFiles, setMergeFiles] = useState([]);
  const [isMerging, setIsMerging] = useState(false);
  const [mergedBlob, setMergedBlob] = useState(null);

  // --- Split State ---
  const [splitFile, setSplitFile] = useState(null);
  const [splitPageCount, setSplitPageCount] = useState(0);
  const [splitMode, setSplitMode] = useState("range"); // 'range' | 'all'
  const [pageRangeInput, setPageRangeInput] = useState("1-3");
  const [isSplitting, setIsSplitting] = useState(false);
  const [splitResultBlob, setSplitResultBlob] = useState(null);
  const [splitZipFiles, setSplitZipFiles] = useState(null);

  // --- Ad Modal State ---
  const [pendingDownload, setPendingDownload] = useState(null);
  const [showAdModal, setShowAdModal] = useState(false);

  // --- Merge Handlers ---
  const handleMergeFilesAdded = async (files) => {
    const valid = files.filter(
      (f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")
    );
    if (valid.length === 0) {
      showToast("Please upload PDF files.", "error");
      return;
    }

    const items = [];
    for (const file of valid) {
      try {
        const buffer = await readFileAsArrayBuffer(file);
        const pageCount = await getPdfPageCount(buffer);
        items.push({
          id: Math.random().toString(36).substring(2, 9),
          file,
          buffer,
          name: file.name,
          size: file.size,
          pages: pageCount,
        });
      } catch (err) {
        showToast(`Could not read ${file.name}. It may be encrypted.`, "error");
      }
    }

    setMergeFiles((prev) => [...prev, ...items]);
    setMergedBlob(null);
    showToast(`Added ${items.length} PDF file(s).`, "success");
  };

  const removeMergeFile = (id) => {
    setMergeFiles((prev) => prev.filter((item) => item.id !== id));
    setMergedBlob(null);
  };

  const moveMergeUp = (index) => {
    if (index === 0) return;
    const copy = [...mergeFiles];
    const [moved] = copy.splice(index, 1);
    copy.splice(index - 1, 0, moved);
    setMergeFiles(copy);
  };

  const moveMergeDown = (index) => {
    if (index === mergeFiles.length - 1) return;
    const copy = [...mergeFiles];
    const [moved] = copy.splice(index, 1);
    copy.splice(index + 1, 0, moved);
    setMergeFiles(copy);
  };

  const handleMergeAction = async () => {
    if (mergeFiles.length < 2) {
      showToast("Please add at least 2 PDF files to merge.", "error");
      return;
    }

    setIsMerging(true);
    try {
      const buffers = mergeFiles.map((m) => m.buffer);
      const blob = await mergePdfs(buffers);
      setMergedBlob(blob);
      showToast("PDFs merged successfully!", "success");
    } catch (err) {
      showToast("Merge failed: " + err.message, "error");
    } finally {
      setIsMerging(false);
    }
  };

  // --- Split Handlers ---
  const handleSplitFileAdded = async (files) => {
    const file = files[0];
    if (!file || (!file.type.includes("pdf") && !file.name.endsWith(".pdf"))) {
      showToast("Please upload a valid PDF document.", "error");
      return;
    }

    try {
      const buffer = await readFileAsArrayBuffer(file);
      const count = await getPdfPageCount(buffer);
      setSplitFile({ file, buffer, name: file.name, size: file.size });
      setSplitPageCount(count);
      setPageRangeInput(count >= 3 ? "1-3" : `1-${count}`);
      setSplitResultBlob(null);
      setSplitZipFiles(null);
      showToast(`Loaded ${file.name} with ${count} pages.`, "success");
    } catch (err) {
      showToast("Could not read PDF. It might be password protected.", "error");
    }
  };

  const handleSplitAction = async () => {
    if (!splitFile) {
      showToast("Please upload a PDF first.", "error");
      return;
    }

    setIsSplitting(true);
    try {
      if (splitMode === "range") {
        const pages = parsePageRanges(pageRangeInput, splitPageCount);
        if (pages.length === 0) {
          throw new Error("No pages specified.");
        }
        const blob = await extractPdfPages(splitFile.buffer, pages);
        setSplitResultBlob(blob);
        setSplitZipFiles(null);
        showToast(`Extracted ${pages.length} pages successfully!`, "success");
      } else {
        // split each page into a ZIP
        const baseName = splitFile.name.replace(/\.[^/.]+$/, "");
        const results = await splitAllPdfPages(splitFile.buffer, baseName);
        setSplitZipFiles(results);
        setSplitResultBlob(null);
        showToast(`Split into ${results.length} individual pages!`, "success");
      }
    } catch (err) {
      showToast("Split error: " + err.message, "error");
    } finally {
      setIsSplitting(false);
    }
  };

  // --- Common Download Confirmation ---
  const triggerDownloadPrompt = (type, data) => {
    setPendingDownload({ type, ...data });
    setShowAdModal(true);
  };

  const handleConfirmDownload = () => {
    if (!pendingDownload) return;

    if (pendingDownload.type === "blob") {
      downloadBlob(pendingDownload.blob, pendingDownload.filename);
      showToast(`Downloaded ${pendingDownload.filename}`, "success");
    } else if (pendingDownload.type === "zip") {
      downloadMultipleAsZip(pendingDownload.files, pendingDownload.filename);
      showToast("ZIP download started!", "success");
    }
  };

  const totalMergePages = mergeFiles.reduce((acc, f) => acc + f.pages, 0);

  return (
    <ToolLayout
      title="PDF Merge & Splitter"
      description="Combine multiple PDF files into one clean document, or extract and split pages without sending files over the internet."
      badgeText="Private & Fast"
      badgeColor="violet"
      onBack={onBack}
    >
      <div className="space-y-8">
        {/* Tab Switcher */}
        <div className="flex border-b border-slate-700/60 pb-1 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("merge")}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
              activeTab === "merge"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                : "text-slate-400 hover:text-white hover:bg-slate-800/40"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Merge Multiple PDFs</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("split")}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
              activeTab === "split"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                : "text-slate-400 hover:text-white hover:bg-slate-800/40"
            }`}
          >
            <Scissors className="w-4 h-4" />
            <span>Split / Extract Pages</span>
          </button>
        </div>

        {/* TAB 1: MERGE PDFs */}
        {activeTab === "merge" && (
          <div className="space-y-6 animate-fade-in">
            <Dropzone
              onFilesSelected={handleMergeFilesAdded}
              accept="application/pdf"
              multiple={true}
              title="Upload PDFs to Merge"
              subtitle="Drop 2 or more PDF documents here"
            />

            {mergeFiles.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white text-sm">
                      {mergeFiles.length} PDF Files
                    </span>
                    <Badge color="violet">Total {totalMergePages} Pages</Badge>
                  </div>

                  <Button
                    onClick={handleMergeAction}
                    loading={isMerging}
                    disabled={mergeFiles.length < 2}
                    variant="primary"
                    size="md"
                    icon={Sparkles}
                  >
                    Merge {mergeFiles.length} PDFs
                  </Button>
                </div>

                <div className="space-y-2">
                  {mergeFiles.map((item, idx) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4 p-3.5 rounded-xl bg-slate-800/30 border border-slate-700/50"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                          #{idx + 1}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate max-w-sm sm:max-w-md">
                            {item.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            {item.pages} pages &bull; {formatBytes(item.size)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => moveMergeUp(idx)}
                          disabled={idx === 0}
                          className="p-1.5 text-slate-400 hover:text-white disabled:opacity-20"
                          title="Move Up"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveMergeDown(idx)}
                          disabled={idx === mergeFiles.length - 1}
                          className="p-1.5 text-slate-400 hover:text-white disabled:opacity-20"
                          title="Move Down"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeMergeFile(item.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {mergedBlob && (
              <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 animate-slide-up">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <FileCheck2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">
                      Merged PDF is Ready!
                    </h4>
                    <p className="text-xs text-slate-300">
                      Consolidated {totalMergePages} pages &bull; {formatBytes(mergedBlob.size)}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() =>
                    triggerDownloadPrompt("blob", {
                      blob: mergedBlob,
                      filename: "docupix_merged_document.pdf",
                      sizeText: formatBytes(mergedBlob.size),
                    })
                  }
                  variant="emerald"
                  size="lg"
                  icon={Download}
                >
                  Download Merged PDF
                </Button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SPLIT PDFs */}
        {activeTab === "split" && (
          <div className="space-y-6 animate-fade-in">
            {!splitFile ? (
              <Dropzone
                onFilesSelected={handleSplitFileAdded}
                accept="application/pdf"
                multiple={false}
                title="Upload PDF to Split"
                subtitle="Select the PDF document you want to extract pages from"
              />
            ) : (
              <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-sm">
                      PDF
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">
                        {splitFile.name}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {splitPageCount} total pages &bull; {formatBytes(splitFile.size)}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSplitFile(null);
                      setSplitResultBlob(null);
                      setSplitZipFiles(null);
                    }}
                    className="text-xs text-rose-400 hover:text-rose-300"
                  >
                    Change PDF
                  </button>
                </div>

                {/* Modes */}
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-xs text-slate-300">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="splitMode"
                        value="range"
                        checked={splitMode === "range"}
                        onChange={() => setSplitMode("range")}
                        className="text-indigo-600 focus:ring-0"
                      />
                      <span>Extract Specific Page Range</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="splitMode"
                        value="all"
                        checked={splitMode === "all"}
                        onChange={() => setSplitMode("all")}
                        className="text-indigo-600 focus:ring-0"
                      />
                      <span>Split Every Page into Separate Files (ZIP)</span>
                    </label>
                  </div>

                  {splitMode === "range" && (
                    <div className="max-w-md pt-2 space-y-1">
                      <label className="block text-xs font-semibold text-slate-300">
                        Page Ranges (e.g., "1-3, 5, 8-10")
                      </label>
                      <input
                        type="text"
                        value={pageRangeInput}
                        onChange={(e) => setPageRangeInput(e.target.value)}
                        placeholder={`e.g. 1-${Math.min(splitPageCount, 3)}`}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                      <p className="text-[11px] text-slate-400">
                        Valid range: 1 to {splitPageCount}
                      </p>
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleSplitAction}
                  loading={isSplitting}
                  variant="primary"
                  size="md"
                  icon={Scissors}
                >
                  {splitMode === "range" ? "Extract Pages" : "Split All Pages"}
                </Button>
              </div>
            )}

            {/* Split Results */}
            {splitResultBlob && (
              <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 animate-slide-up">
                <div>
                  <h4 className="font-bold text-white text-base">
                    Pages Extracted!
                  </h4>
                  <p className="text-xs text-slate-300">
                    Selected pages saved into new document &bull; {formatBytes(splitResultBlob.size)}
                  </p>
                </div>

                <Button
                  onClick={() =>
                    triggerDownloadPrompt("blob", {
                      blob: splitResultBlob,
                      filename: `extracted_${pageRangeInput.replace(/[^a-zA-Z0-9-]/g, "_")}.pdf`,
                      sizeText: formatBytes(splitResultBlob.size),
                    })
                  }
                  variant="emerald"
                  size="lg"
                  icon={Download}
                >
                  Download Extracted PDF
                </Button>
              </div>
            )}

            {splitZipFiles && (
              <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 animate-slide-up">
                <div>
                  <h4 className="font-bold text-white text-base">
                    {splitZipFiles.length} Pages Ready in ZIP!
                  </h4>
                  <p className="text-xs text-slate-300">
                    Each page saved as an individual PDF.
                  </p>
                </div>

                <Button
                  onClick={() =>
                    triggerDownloadPrompt("zip", {
                      files: splitZipFiles,
                      filename: "docupix_split_pages.zip",
                      sizeText: `${splitZipFiles.length} pages`,
                    })
                  }
                  variant="emerald"
                  size="lg"
                  icon={Archive}
                >
                  Download Pages ZIP
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Ad Modal */}
      <DownloadAdModal
        isOpen={showAdModal}
        onClose={() => setShowAdModal(false)}
        onConfirmDownload={handleConfirmDownload}
        fileName={pendingDownload?.filename || "pdf_file"}
        fileSizeText={pendingDownload?.sizeText || ""}
      />
    </ToolLayout>
  );
}

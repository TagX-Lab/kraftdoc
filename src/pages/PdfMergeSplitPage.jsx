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
import { formatBytes, parsePageRanges, readFileAsArrayBuffer, validateFileSize } from "../utils/fileHelpers";
import { downloadBlob, downloadMultipleAsZip } from "../utils/downloadHelpers";
import { useToast } from "../hooks/useToast";

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
      const check = validateFileSize(file, 50);
      if (!check.valid) {
        showToast(`${file.name}: ${check.error}`, "error");
        continue;
      }
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
      } catch {
        showToast(`Could not read ${file.name}. It may be encrypted or corrupted.`, "error");
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

    const check = validateFileSize(file, 50);
    if (!check.valid) {
      showToast(check.error, "error");
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
    } catch {
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
      onBack={onBack}
    >
      <div className="space-y-8">
        {/* Tab Switcher */}
        <div className="flex border-b-2 border-[#E5DCB8] pb-1 gap-3">
          <button
            type="button"
            onClick={() => setActiveTab("merge")}
            className={`px-5 py-3 rounded-2xl font-black text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "merge"
                ? "bg-[#1400C3] text-white shadow-lg shadow-[#1400C3]/25"
                : "text-[#3B3355] hover:text-[#1400C3] hover:bg-white"
            }`}
          >
            <Layers className="w-4 h-4 stroke-[2.2]" />
            <span>Merge Multiple PDFs</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("split")}
            className={`px-5 py-3 rounded-2xl font-black text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "split"
                ? "bg-[#FF4E02] text-white shadow-lg shadow-[#FF4E02]/25"
                : "text-[#3B3355] hover:text-[#FF4E02] hover:bg-white"
            }`}
          >
            <Scissors className="w-4 h-4 stroke-[2.2]" />
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
                <div className="flex items-center justify-between p-5 rounded-2xl bg-white border border-[#E5DCB8] shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="font-black text-[#1400C3] text-base">
                      {mergeFiles.length} PDF Files
                    </span>
                    <Badge color="orange">Total {totalMergePages} Pages</Badge>
                  </div>

                  <Button
                    onClick={handleMergeAction}
                    loading={isMerging}
                    disabled={mergeFiles.length < 2}
                    variant="orange"
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
                      className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#E5DCB8] hover:border-[#1400C3] transition-all shadow-sm"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-[#1400C3]/10 text-[#1400C3] flex items-center justify-center font-black text-xs shrink-0">
                          #{idx + 1}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-[#1400C3] truncate max-w-sm sm:max-w-md">
                            {item.name}
                          </p>
                          <p className="text-xs text-[#6B627F] font-semibold">
                            {item.pages} pages &bull; {formatBytes(item.size)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => moveMergeUp(idx)}
                          disabled={idx === 0}
                          className="p-1.5 text-[#1400C3] hover:text-[#FF4E02] hover:bg-[#F8F2D8] rounded-lg disabled:opacity-20 cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp className="w-4 h-4 stroke-[2.2]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveMergeDown(idx)}
                          disabled={idx === mergeFiles.length - 1}
                          className="p-1.5 text-[#1400C3] hover:text-[#FF4E02] hover:bg-[#F8F2D8] rounded-lg disabled:opacity-20 cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown className="w-4 h-4 stroke-[2.2]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeMergeFile(item.id)}
                          className="p-1.5 text-[#6B627F] hover:text-rose-600 cursor-pointer"
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
              <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#FF4E02] flex flex-col sm:flex-row items-center justify-between gap-4 animate-slide-up shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#FF4E02]/15 text-[#FF4E02] flex items-center justify-center">
                    <FileCheck2 className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <div>
                    <h4 className="font-black text-[#1400C3] text-lg">
                      Merged PDF is Ready!
                    </h4>
                    <p className="text-xs text-[#3B3355] font-semibold">
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
                  variant="orange"
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
              <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#E5DCB8] space-y-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#1400C3]/10 text-[#1400C3] flex items-center justify-center font-black text-sm">
                      PDF
                    </div>
                    <div>
                      <h4 className="font-black text-[#1400C3] text-base">
                        {splitFile.name}
                      </h4>
                      <p className="text-xs text-[#6B627F] font-semibold">
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
                    className="text-xs text-rose-600 hover:text-rose-700 font-bold cursor-pointer"
                  >
                    Change PDF
                  </button>
                </div>

                {/* Modes */}
                <div className="space-y-3">
                  <div className="flex items-center gap-5 text-xs text-[#3B3355] font-bold">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="splitMode"
                        value="range"
                        checked={splitMode === "range"}
                        onChange={() => setSplitMode("range")}
                        className="text-[#FF4E02] focus:ring-0 accent-[#FF4E02]"
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
                        className="text-[#FF4E02] focus:ring-0 accent-[#FF4E02]"
                      />
                      <span>Split Every Page into Separate Files (ZIP)</span>
                    </label>
                  </div>

                  {splitMode === "range" && (
                    <div className="max-w-md pt-2 space-y-1">
                      <label className="block text-xs font-black text-[#1400C3]">
                        Page Ranges (e.g., "1-3, 5, 8-10")
                      </label>
                      <input
                        type="text"
                        value={pageRangeInput}
                        onChange={(e) => setPageRangeInput(e.target.value)}
                        placeholder={`e.g. 1-${Math.min(splitPageCount, 3)}`}
                        className="w-full bg-[#F8F2D8]/60 border-2 border-[#E5DCB8] rounded-xl px-3.5 py-2.5 text-sm text-[#1400C3] font-bold focus:outline-none focus:border-[#FF4E02]"
                      />
                      <p className="text-[11px] text-[#6B627F] font-semibold">
                        Valid range: 1 to {splitPageCount}
                      </p>
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleSplitAction}
                  loading={isSplitting}
                  variant="orange"
                  size="md"
                  icon={Scissors}
                >
                  {splitMode === "range" ? "Extract Pages" : "Split All Pages"}
                </Button>
              </div>
            )}

            {/* Split Results */}
            {splitResultBlob && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#FF4E02] flex flex-col sm:flex-row items-center justify-between gap-4 animate-slide-up shadow-xl">
                <div>
                  <h4 className="font-black text-[#1400C3] text-lg">
                    Pages Extracted!
                  </h4>
                  <p className="text-xs text-[#3B3355] font-semibold">
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
                  variant="orange"
                  size="lg"
                  icon={Download}
                >
                  Download Extracted PDF
                </Button>
              </div>
            )}

            {splitZipFiles && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#FF4E02] flex flex-col sm:flex-row items-center justify-between gap-4 animate-slide-up shadow-xl">
                <div>
                  <h4 className="font-black text-[#1400C3] text-lg">
                    {splitZipFiles.length} Pages Ready in ZIP!
                  </h4>
                  <p className="text-xs text-[#3B3355] font-semibold">
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
                  variant="orange"
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

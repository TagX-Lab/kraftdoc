import React, { useState } from "react";
import {
  FileCode,
  Download,
  Undo2,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Save,
} from "lucide-react";
import ToolLayout from "../components/layout/ToolLayout";
import Dropzone from "../components/common/Dropzone";
import Button from "../components/common/Button";
import DownloadAdModal from "../components/ads/DownloadAdModal";
import {
  getPdfPageCount,
  readPdfMetadata,
  writePdfMetadata,
} from "../services/pdfService";
import {
  formatBytes,
  readFileAsArrayBuffer,
  validateFileSize,
} from "../utils/fileHelpers";
import { downloadBlob } from "../utils/downloadHelpers";
import { useToast } from "../hooks/useToast";

export default function EditPdfMetadataPage({ onBack }) {
  const { showToast } = useToast();

  const [pdfData, setPdfData] = useState(null); // { file, buffer, pageCount }
  const [metadata, setMetadata] = useState({
    title: "",
    author: "",
    subject: "",
    keywords: "",
    creator: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState(null);
  const [showAdModal, setShowAdModal] = useState(false);

  const handlePdfLoaded = async (files) => {
    const file = files[0];
    if (!file || (!file.type.includes("pdf") && !file.name.endsWith(".pdf"))) {
      showToast("Please select a valid PDF file.", "error");
      return;
    }

    const check = validateFileSize(file, 60);
    if (!check.valid) {
      showToast(check.error, "error");
      return;
    }

    try {
      const buffer = await readFileAsArrayBuffer(file);
      const pageCount = await getPdfPageCount(buffer);
      const meta = await readPdfMetadata(buffer);
      setPdfData({ file, buffer, pageCount });
      setMetadata({
        title: meta.title || "",
        author: meta.author || "",
        subject: meta.subject || "",
        keywords: meta.keywords || "",
        creator: meta.creator || "",
      });
      setResultBlob(null);
      showToast(`Loaded "${file.name}" with metadata.`, "success");
    } catch {
      showToast("Could not read PDF metadata.", "error");
    }
  };

  const handleSaveMetadata = async () => {
    if (!pdfData) return;
    setIsProcessing(true);
    try {
      const blob = await writePdfMetadata(pdfData.buffer, metadata, false);
      setResultBlob(blob);
      showToast("PDF metadata updated successfully!", "success");
    } catch (err) {
      showToast(err.message || "Failed to update metadata.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSanitizeMetadata = async () => {
    if (!pdfData) return;
    setIsProcessing(true);
    try {
      const blob = await writePdfMetadata(pdfData.buffer, {}, true);
      setResultBlob(blob);
      setMetadata({
        title: "",
        author: "",
        subject: "",
        keywords: "",
        creator: "",
      });
      showToast("All metadata stripped & sanitized!", "success");
    } catch (err) {
      showToast(err.message || "Failed to sanitize metadata.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob) return;
    const baseName = pdfData.file.name.replace(/\.[^/.]+$/, "");
    downloadBlob(resultBlob, `${baseName}_metadata.pdf`);
  };

  return (
    <ToolLayout
      title="Edit & Sanitize PDF Metadata"
      description="View, edit, or permanently wipe author names, document title, subject, and hidden tracking properties from any PDF document."
      badge="PDF Metadata & Privacy"
      onBack={onBack}
    >
      <div className="space-y-8">
        {!pdfData ? (
          <div className="max-w-2xl mx-auto">
            <Dropzone
              accept={{ "application/pdf": [".pdf"] }}
              maxFiles={1}
              onFilesDrop={handlePdfLoaded}
              title="Drop PDF to view and edit metadata"
              subtitle="Inspect Title, Author, Subject & clean tracking tags"
              badgeText="100% Client-Side Privacy"
            />
          </div>
        ) : (
          <div className="space-y-8 max-w-4xl mx-auto">
            {/* File Info Bar */}
            <div className="rounded-3xl bg-white border-2 border-[#1400C3]/15 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-[#EAF2FD] text-[#1400C3] flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-sm sm:text-base text-[#1400C3] truncate">
                    {pdfData.file.name}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#6B627F] mt-0.5">
                    <span>{pdfData.pageCount} pages</span>
                    <span>•</span>
                    <span>{formatBytes(pdfData.file.size)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPdfData(null);
                    setResultBlob(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#FF4E02] bg-[#FF4E02]/10 hover:bg-[#FF4E02]/20 transition-colors cursor-pointer"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                  <span>Change PDF</span>
                </button>
              </div>
            </div>

            {/* Metadata Fields Form */}
            <div className="rounded-3xl bg-white border-2 border-[#1400C3]/15 p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-black/5 pb-4">
                <div className="flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-[#FF4E02]" />
                  <h3 className="font-display text-base uppercase tracking-wide text-[#1400C3]">
                    Document Metadata Properties
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleSanitizeMetadata}
                  disabled={isProcessing}
                  className="px-3.5 py-1.5 rounded-xl border border-[#F8C8BD] text-xs font-bold text-[#FF4E02] hover:bg-[#FFEBE5] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Wipe All Metadata (Sanitize)</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#1400C3] mb-1.5">
                    Document Title
                  </label>
                  <input
                    type="text"
                    value={metadata.title}
                    onChange={(e) => {
                      setMetadata({ ...metadata, title: e.target.value });
                      setResultBlob(null);
                    }}
                    placeholder="e.g. Q4 Financial Report"
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#E5DCB8] focus:border-[#1400C3] focus:outline-none font-bold text-sm text-[#1400C3]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1400C3] mb-1.5">
                    Author / Creator Name
                  </label>
                  <input
                    type="text"
                    value={metadata.author}
                    onChange={(e) => {
                      setMetadata({ ...metadata, author: e.target.value });
                      setResultBlob(null);
                    }}
                    placeholder="e.g. John Doe / Company"
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#E5DCB8] focus:border-[#1400C3] focus:outline-none font-bold text-sm text-[#1400C3]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1400C3] mb-1.5">
                    Subject / Description
                  </label>
                  <input
                    type="text"
                    value={metadata.subject}
                    onChange={(e) => {
                      setMetadata({ ...metadata, subject: e.target.value });
                      setResultBlob(null);
                    }}
                    placeholder="e.g. Official Contract Draft"
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#E5DCB8] focus:border-[#1400C3] focus:outline-none font-bold text-sm text-[#1400C3]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1400C3] mb-1.5">
                    Software / Application Creator
                  </label>
                  <input
                    type="text"
                    value={metadata.creator}
                    onChange={(e) => {
                      setMetadata({ ...metadata, creator: e.target.value });
                      setResultBlob(null);
                    }}
                    placeholder="e.g. DocuPix Suite"
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#E5DCB8] focus:border-[#1400C3] focus:outline-none font-bold text-sm text-[#1400C3]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#1400C3] mb-1.5">
                    Keywords (comma separated)
                  </label>
                  <input
                    type="text"
                    value={metadata.keywords}
                    onChange={(e) => {
                      setMetadata({ ...metadata, keywords: e.target.value });
                      setResultBlob(null);
                    }}
                    placeholder="e.g. invoice, report, confidential, 2026"
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#E5DCB8] focus:border-[#1400C3] focus:outline-none font-bold text-sm text-[#1400C3]"
                  />
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="rounded-3xl bg-white border-2 border-[#1400C3]/15 p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1400C3]">
                <ShieldCheck className="w-4 h-4 text-[#FF4E02]" />
                <span>Zero uploads. Original document vectors remain untouched.</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {!resultBlob ? (
                  <Button
                    onClick={handleSaveMetadata}
                    disabled={isProcessing}
                    isLoading={isProcessing}
                    variant="primary"
                    className="w-full sm:w-auto"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    <span>Save &amp; Apply Metadata</span>
                  </Button>
                ) : (
                  <Button
                    onClick={() => setShowAdModal(true)}
                    variant="primary"
                    className="w-full sm:w-auto bg-[#FF4E02] hover:bg-[#e04502] text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    <span>Download Updated PDF</span>
                  </Button>
                )}
              </div>
            </div>

            {/* Success Download Card */}
            {resultBlob && (
              <div className="rounded-3xl bg-[#EBF7ED] border-2 border-[#C2E7C9] p-6 text-center space-y-3 animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-white text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="font-bold text-sm text-[#1400C3]">
                  Metadata Saved Successfully!
                </div>
                <p className="text-xs text-[#6B627F]">
                  Processed size: {formatBytes(resultBlob.size)} • PDF properties are updated.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {showAdModal && (
        <DownloadAdModal
          isOpen={showAdModal}
          onClose={() => setShowAdModal(false)}
          onDownload={() => {
            setShowAdModal(false);
            handleDownload();
          }}
          fileName={`${pdfData?.file?.name?.replace(/\.[^/.]+$/, "")}_metadata.pdf`}
          fileSize={resultBlob?.size}
        />
      )}
    </ToolLayout>
  );
}

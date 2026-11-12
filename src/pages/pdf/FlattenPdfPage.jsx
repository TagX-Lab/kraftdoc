import React, { useState } from "react";
import {
  Layers,
  Download,
  Undo2,
  FileText,
  Lock,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import ToolLayout from "../../components/layout/ToolLayout";
import Dropzone from "../../components/common/Dropzone";
import Button from "../../components/common/Button";
import DownloadAdModal from "../../components/ads/DownloadAdModal";
import { getPdfPageCount, flattenPdf } from "../../services/pdfService";
import {
  formatBytes,
  readFileAsArrayBuffer,
  validateFileSize,
} from "../../utils/fileHelpers";
import { downloadBlob } from "../../utils/downloadHelpers";
import { useToast } from "../../hooks/useToast";

export default function FlattenPdfPage({ onBack }) {
  const { showToast } = useToast();

  const [pdfData, setPdfData] = useState(null); // { file, buffer, pageCount }
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
      setPdfData({ file, buffer, pageCount });
      setResultBlob(null);
      showToast(`Loaded "${file.name}" (${pageCount} pages).`, "success");
    } catch {
      showToast("Could not read PDF.", "error");
    }
  };

  const handleFlatten = async () => {
    if (!pdfData) return;

    setIsProcessing(true);
    try {
      const blob = await flattenPdf(pdfData.buffer);
      setResultBlob(blob);
      showToast("PDF successfully flattened and locked!", "success");
    } catch (err) {
      showToast(err.message || "Failed to flatten PDF.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob) return;
    const baseName = pdfData.file.name.replace(/\.[^/.]+$/, "");
    downloadBlob(resultBlob, `${baseName}_flattened.pdf`);
  };

  return (
    <ToolLayout
      title="Flatten PDF Document"
      description="Lock fillable form fields, checkboxes, and annotations permanently into the document to prevent unwanted edits and ensure universal printing compatibility."
      badge="1-Click PDF Security"
      onBack={onBack}
    >
      <div className="space-y-8">
        {!pdfData ? (
          <div className="max-w-2xl mx-auto">
            <Dropzone
              accept={{ "application/pdf": [".pdf"] }}
              maxFiles={1}
              onFilesDrop={handlePdfLoaded}
              title="Drop PDF to flatten form fields"
              subtitle="Turns interactive elements into non-editable static content"
              badgeText="100% Client-Side Locking"
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

            {/* Explanation / Features Bento Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-3xl bg-white border-2 border-[#1400C3]/15 p-5 shadow-sm space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#FFF4D4] text-[#FF4E02] flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-xs text-[#1400C3]">Prevents Tampering</h4>
                <p className="text-[11px] text-[#6B627F] leading-relaxed">
                  Converts dynamic input fields and dropdowns into static graphics so values cannot be edited.
                </p>
              </div>

              <div className="rounded-3xl bg-white border-2 border-[#1400C3]/15 p-5 shadow-sm space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#EAF2FD] text-[#1400C3] flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-xs text-[#1400C3]">Universal Compatibility</h4>
                <p className="text-[11px] text-[#6B627F] leading-relaxed">
                  Ensures all form data renders identically across macOS Preview, Adobe Acrobat, Edge, and iOS.
                </p>
              </div>

              <div className="rounded-3xl bg-white border-2 border-[#1400C3]/15 p-5 shadow-sm space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#EBF7ED] text-emerald-600 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-xs text-[#1400C3]">Zero Server Exposure</h4>
                <p className="text-[11px] text-[#6B627F] leading-relaxed">
                  Operates entirely in your browser's private WebAssembly memory sandbox.
                </p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="rounded-3xl bg-white border-2 border-[#1400C3]/15 p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1400C3]">
                <Sparkles className="w-4 h-4 text-[#FF4E02]" />
                <span>Ready to flatten all {pdfData.pageCount} pages.</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {!resultBlob ? (
                  <Button
                    onClick={handleFlatten}
                    disabled={isProcessing}
                    isLoading={isProcessing}
                    variant="primary"
                    className="w-full sm:w-auto"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    <span>Flatten PDF Now</span>
                  </Button>
                ) : (
                  <Button
                    onClick={() => setShowAdModal(true)}
                    variant="primary"
                    className="w-full sm:w-auto bg-[#FF4E02] hover:bg-[#e04502] text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    <span>Download Flattened PDF</span>
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
                  PDF Form Fields Flattened!
                </div>
                <p className="text-xs text-[#6B627F]">
                  Final size: {formatBytes(resultBlob.size)} • Document form layers are now locked.
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
          fileName={`${pdfData?.file?.name?.replace(/\.[^/.]+$/, "")}_flattened.pdf`}
          fileSize={resultBlob?.size}
        />
      )}
    </ToolLayout>
  );
}

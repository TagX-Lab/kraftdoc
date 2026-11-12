import React, { useState } from "react";
import {
  Scaling,
  Download,
  Undo2,
  FileText,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import ToolLayout from "../../components/layout/ToolLayout";
import Dropzone from "../../components/common/Dropzone";
import Button from "../../components/common/Button";
import DownloadAdModal from "../../components/ads/DownloadAdModal";
import {
  getPdfPageCount,
  resizePdfDocument,
} from "../../services/pdfService";
import {
  formatBytes,
  readFileAsArrayBuffer,
  validateFileSize,
} from "../../utils/fileHelpers";
import { downloadBlob } from "../../utils/downloadHelpers";
import { useToast } from "../../hooks/useToast";

export default function ResizePdfPage({ onBack }) {
  const { showToast } = useToast();

  const [pdfData, setPdfData] = useState(null); // { file, buffer, pageCount }
  const [targetSize, setTargetSize] = useState("A4");
  const [orientation, setOrientation] = useState("portrait");

  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState(null);
  const [showAdModal, setShowAdModal] = useState(false);

  const pageOptions = [
    { id: "A4", label: "A4 Standard", desc: "210 × 297 mm • Universal office format" },
    { id: "LETTER", label: "US Letter", desc: "8.5 × 11 in • US/Canada standard" },
    { id: "A3", label: "A3 Poster", desc: "297 × 420 mm • Double A4 size" },
    { id: "A5", label: "A5 Booklet", desc: "148 × 210 mm • Compact pocket size" },
    { id: "LEGAL", label: "US Legal", desc: "8.5 × 14 in • Contracts & legal forms" },
  ];

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

  const handleResize = async () => {
    if (!pdfData) return;
    setIsProcessing(true);
    try {
      const blob = await resizePdfDocument(pdfData.buffer, targetSize, orientation);
      setResultBlob(blob);
      showToast(`PDF pages resized to ${targetSize} (${orientation})!`, "success");
    } catch (err) {
      showToast(err.message || "Failed to resize PDF.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob) return;
    const baseName = pdfData.file.name.replace(/\.[^/.]+$/, "");
    downloadBlob(resultBlob, `${baseName}_resized_${targetSize.toLowerCase()}.pdf`);
  };

  return (
    <ToolLayout
      title="Change PDF Page Size"
      description="Rescale and fit document pages to international standards (A4, US Letter, A3, A5, Legal) with customized orientation."
      badge="PDF Page Rescaler"
      onBack={onBack}
    >
      <div className="space-y-8">
        {!pdfData ? (
          <div className="max-w-2xl mx-auto">
            <Dropzone
              accept={{ "application/pdf": [".pdf"] }}
              maxFiles={1}
              onFilesDrop={handlePdfLoaded}
              title="Drop PDF to change page dimensions"
              subtitle="Convert document to standard A4, Letter, A3, Legal"
              badgeText="100% Client-Side Rescaling"
            />
          </div>
        ) : (
          <div className="space-y-8 max-w-4xl mx-auto">
            {/* File Info Bar */}
            <div className="rounded-3xl bg-white border-2 border-[#1400C3]/15 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-[#FFEBE5] text-[#FF4E02] flex items-center justify-center shrink-0">
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

            {/* Target Size Selection Grid */}
            <div className="rounded-3xl bg-white border-2 border-[#1400C3]/15 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h3 className="font-display text-sm uppercase tracking-wide text-[#1400C3] mb-3">
                  1. Select Target Paper Format
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {pageOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setTargetSize(opt.id);
                        setResultBlob(null);
                      }}
                      className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                        targetSize === opt.id
                          ? "border-[#1400C3] bg-[#F8F2D8] shadow-sm"
                          : "border-[#E5DCB8] hover:border-[#1400C3]/50 bg-white"
                      }`}
                    >
                      <div className="font-display text-sm text-[#1400C3]">{opt.label}</div>
                      <div className="text-[11px] font-semibold text-[#6B627F] mt-0.5">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Orientation Selection */}
              <div>
                <h3 className="font-display text-sm uppercase tracking-wide text-[#1400C3] mb-3">
                  2. Page Orientation
                </h3>
                <div className="flex items-center gap-3">
                  {["portrait", "landscape"].map((orient) => (
                    <button
                      key={orient}
                      type="button"
                      onClick={() => {
                        setOrientation(orient);
                        setResultBlob(null);
                      }}
                      className={`px-6 py-2.5 rounded-xl border-2 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                        orientation === orient
                          ? "border-[#FF4E02] bg-[#FF4E02] text-white shadow-xs"
                          : "border-[#E5DCB8] text-[#3B3355] hover:border-[#1400C3]"
                      }`}
                    >
                      {orient}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="rounded-3xl bg-white border-2 border-[#1400C3]/15 p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1400C3]">
                <ShieldCheck className="w-4 h-4 text-[#FF4E02]" />
                <span>All {pdfData.pageCount} pages will be scaled and centered.</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {!resultBlob ? (
                  <Button
                    onClick={handleResize}
                    disabled={isProcessing}
                    isLoading={isProcessing}
                    variant="primary"
                    className="w-full sm:w-auto"
                  >
                    <Scaling className="w-4 h-4 mr-2" />
                    <span>Apply {targetSize} Size</span>
                  </Button>
                ) : (
                  <Button
                    onClick={() => setShowAdModal(true)}
                    variant="primary"
                    className="w-full sm:w-auto bg-[#FF4E02] hover:bg-[#e04502] text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    <span>Download Resized PDF</span>
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
                  Document Rescaled to {targetSize}!
                </div>
                <p className="text-xs text-[#6B627F]">
                  Processed size: {formatBytes(resultBlob.size)} • Standard dimensions applied.
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
          fileName={`${pdfData?.file?.name?.replace(/\.[^/.]+$/, "")}_${targetSize.toLowerCase()}.pdf`}
          fileSize={resultBlob?.size}
        />
      )}
    </ToolLayout>
  );
}

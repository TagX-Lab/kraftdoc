import React, { useState } from "react";
import {
  LayoutGrid,
  Download,
  Undo2,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import ToolLayout from "../components/layout/ToolLayout";
import Dropzone from "../components/common/Dropzone";
import Button from "../components/common/Button";
import DownloadAdModal from "../components/ads/DownloadAdModal";
import {
  getPdfPageCount,
  convertPagesPerSheet,
} from "../services/pdfService";
import {
  formatBytes,
  readFileAsArrayBuffer,
  validateFileSize,
} from "../utils/fileHelpers";
import { downloadBlob } from "../utils/downloadHelpers";
import { useToast } from "../hooks/useToast";

export default function PagesPerSheetPage({ onBack }) {
  const { showToast } = useToast();

  const [pdfData, setPdfData] = useState(null); // { file, buffer, pageCount }
  const [mode, setMode] = useState(2); // 2 or 4

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

  const handleConvert = async () => {
    if (!pdfData) return;
    setIsProcessing(true);
    try {
      const blob = await convertPagesPerSheet(pdfData.buffer, mode);
      setResultBlob(blob);
      showToast(`${mode}-on-1 sheet layout generated!`, "success");
    } catch (err) {
      showToast(err.message || "Failed to convert sheets.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob) return;
    const baseName = pdfData.file.name.replace(/\.[^/.]+$/, "");
    downloadBlob(resultBlob, `${baseName}_${mode}_per_sheet.pdf`);
  };

  const outputSheets = pdfData ? Math.ceil(pdfData.pageCount / mode) : 0;
  const paperSaved = pdfData ? Math.round((1 - outputSheets / pdfData.pageCount) * 100) : 0;

  return (
    <ToolLayout
      title="Pages Per Sheet (N-Up Print Layout)"
      description="Save paper and printing costs by fitting 2 or 4 PDF pages side-by-side onto a single printed sheet."
      badge="Paper Saver Tool"
      onBack={onBack}
    >
      <div className="space-y-8">
        {!pdfData ? (
          <div className="max-w-2xl mx-auto">
            <Dropzone
              accept={{ "application/pdf": [".pdf"] }}
              maxFiles={1}
              onFilesDrop={handlePdfLoaded}
              title="Drop PDF here for multi-page sheets"
              subtitle="Combine 2 or 4 pages onto single sheets"
              badgeText="100% Client-Side Layout"
            />
          </div>
        ) : (
          <div className="space-y-8 max-w-4xl mx-auto">
            {/* File Info Bar */}
            <div className="rounded-3xl bg-white border-2 border-[#1400C3]/15 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF4D4] text-[#FF4E02] flex items-center justify-center shrink-0">
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

            {/* Layout Mode Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Option 1: 2 Pages Per Sheet */}
              <div
                onClick={() => {
                  setMode(2);
                  setResultBlob(null);
                }}
                className={`rounded-3xl p-6 border-2 transition-all cursor-pointer ${
                  mode === 2
                    ? "bg-[#FFF4D4] border-[#1400C3] shadow-md"
                    : "bg-white border-[#E5DCB8] hover:border-[#1400C3]/40"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-display text-lg text-[#1400C3]">2 Pages Per Sheet</span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#1400C3] text-white">
                    Landscape A4
                  </span>
                </div>

                <div className="h-28 rounded-xl bg-white border border-black/10 flex items-center justify-center gap-3 p-3">
                  <div className="w-16 h-20 rounded border-2 border-dashed border-[#1400C3] bg-[#EAF2FD] flex items-center justify-center font-bold text-xs text-[#1400C3]">
                    Page 1
                  </div>
                  <div className="w-16 h-20 rounded border-2 border-dashed border-[#1400C3] bg-[#EAF2FD] flex items-center justify-center font-bold text-xs text-[#1400C3]">
                    Page 2
                  </div>
                </div>

                <p className="text-xs text-[#6B627F] font-semibold mt-3">
                  Best for lecture slides, notes, and study handouts. Saves 50% paper.
                </p>
              </div>

              {/* Option 2: 4 Pages Per Sheet */}
              <div
                onClick={() => {
                  setMode(4);
                  setResultBlob(null);
                }}
                className={`rounded-3xl p-6 border-2 transition-all cursor-pointer ${
                  mode === 4
                    ? "bg-[#FFEBE5] border-[#FF4E02] shadow-md"
                    : "bg-white border-[#E5DCB8] hover:border-[#1400C3]/40"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-display text-lg text-[#1400C3]">4 Pages Per Sheet</span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#FF4E02] text-white">
                    2×2 Grid A4
                  </span>
                </div>

                <div className="h-28 rounded-xl bg-white border border-black/10 grid grid-cols-2 gap-2 p-2.5 max-w-[140px] mx-auto">
                  <div className="rounded border border-dashed border-[#FF4E02] bg-[#FFEBE5] flex items-center justify-center text-[10px] font-bold text-[#FF4E02]">
                    1
                  </div>
                  <div className="rounded border border-dashed border-[#FF4E02] bg-[#FFEBE5] flex items-center justify-center text-[10px] font-bold text-[#FF4E02]">
                    2
                  </div>
                  <div className="rounded border border-dashed border-[#FF4E02] bg-[#FFEBE5] flex items-center justify-center text-[10px] font-bold text-[#FF4E02]">
                    3
                  </div>
                  <div className="rounded border border-dashed border-[#FF4E02] bg-[#FFEBE5] flex items-center justify-center text-[10px] font-bold text-[#FF4E02]">
                    4
                  </div>
                </div>

                <p className="text-xs text-[#6B627F] font-semibold mt-3">
                  Maximum paper economy. 4 miniature pages on 1 sheet. Saves 75% paper.
                </p>
              </div>
            </div>

            {/* Savings Plaque */}
            <div className="rounded-3xl bg-white border-2 border-[#1400C3]/15 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FF4E02]" />
                <div className="text-xs font-bold text-[#1400C3]">
                  Original: <span className="font-mono">{pdfData.pageCount} pages</span> &rarr; Printout:{" "}
                  <span className="text-[#FF4E02] font-mono">{outputSheets} physical sheets</span>
                </div>
              </div>
              <span className="text-xs font-black text-emerald-700 bg-[#EBF7ED] px-3 py-1 rounded-full">
                Saves ~{paperSaved}% Paper
              </span>
            </div>

            {/* Action Bar */}
            <div className="rounded-3xl bg-white border-2 border-[#1400C3]/15 p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1400C3]">
                <ShieldCheck className="w-4 h-4 text-[#FF4E02]" />
                <span>Zero uploads. Original vector content preserved without blurring.</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {!resultBlob ? (
                  <Button
                    onClick={handleConvert}
                    disabled={isProcessing}
                    isLoading={isProcessing}
                    variant="primary"
                    className="w-full sm:w-auto"
                  >
                    <LayoutGrid className="w-4 h-4 mr-2" />
                    <span>Generate {mode}-on-1 PDF</span>
                  </Button>
                ) : (
                  <Button
                    onClick={() => setShowAdModal(true)}
                    variant="primary"
                    className="w-full sm:w-auto bg-[#FF4E02] hover:bg-[#e04502] text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    <span>Download Multi-Page PDF</span>
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
                  {mode}-on-1 Sheet Document Ready!
                </div>
                <p className="text-xs text-[#6B627F]">
                  Processed size: {formatBytes(resultBlob.size)} • Reduced to {outputSheets} sheets.
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
          fileName={`${pdfData?.file?.name?.replace(/\.[^/.]+$/, "")}_${mode}_per_sheet.pdf`}
          fileSize={resultBlob?.size}
        />
      )}
    </ToolLayout>
  );
}

import React, { useState } from "react";
import {
  Crop,
  Download,
  Undo2,
  FileText,
  Sliders,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import ToolLayout from "../../components/layout/ToolLayout";
import Dropzone from "../../components/common/Dropzone";
import Button from "../../components/common/Button";
import DownloadAdModal from "../../components/ads/DownloadAdModal";
import { getPdfPageCount, cropPdfPages } from "../../services/pdfService";
import {
  formatBytes,
  readFileAsArrayBuffer,
  validateFileSize,
} from "../../utils/fileHelpers";
import { downloadBlob } from "../../utils/downloadHelpers";
import { useToast } from "../../hooks/useToast";

export default function CropPdfPage({ onBack }) {
  const { showToast } = useToast();

  const [pdfData, setPdfData] = useState(null); // { file, buffer, pageCount }
  const [margins, setMargins] = useState({
    top: 24,
    bottom: 24,
    left: 24,
    right: 24,
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState(null);
  const [showAdModal, setShowAdModal] = useState(false);

  const presets = [
    { label: "Standard Trim (10 pt)", top: 10, bottom: 10, left: 10, right: 10 },
    { label: "Medium Margin (25 pt)", top: 25, bottom: 25, left: 25, right: 25 },
    { label: "Trim Header & Footer (40 pt)", top: 40, bottom: 40, left: 15, right: 15 },
    { label: "Heavy Crop (60 pt)", top: 60, bottom: 60, left: 35, right: 35 },
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

  const handleApplyPreset = (p) => {
    setMargins({
      top: p.top,
      bottom: p.bottom,
      left: p.left,
      right: p.right,
    });
    setResultBlob(null);
  };

  const handleCrop = async () => {
    if (!pdfData) return;

    setIsProcessing(true);
    try {
      const blob = await cropPdfPages(pdfData.buffer, margins);
      setResultBlob(blob);
      showToast("PDF cropped successfully!", "success");
    } catch (err) {
      showToast(err.message || "Failed to crop PDF.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob) return;
    const baseName = pdfData.file.name.replace(/\.[^/.]+$/, "");
    downloadBlob(resultBlob, `${baseName}_cropped.pdf`);
  };

  return (
    <ToolLayout
      title="Crop PDF Pages"
      description="Trim borders, whitespace, or unwanted header/footer margins from every page. 100% private in-browser processing."
      badge="Client-Side PDF Crop"
      onBack={onBack}
    >
      <div className="space-y-8">
        {!pdfData ? (
          <div className="max-w-2xl mx-auto">
            <Dropzone
              accept={{ "application/pdf": [".pdf"] }}
              maxFiles={1}
              onFilesDrop={handlePdfLoaded}
              title="Drop your PDF here to crop"
              subtitle="Trim margins and unwanted margins from all pages"
              badgeText="100% Client-Side Trimming"
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

            {/* Presets and Margins Config */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Column: Preset shortcuts */}
              <div className="md:col-span-5 rounded-3xl bg-white border-2 border-[#1400C3]/15 p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#FF4E02]" />
                  <h3 className="font-display text-sm uppercase tracking-wide text-[#1400C3]">
                    Quick Margin Presets
                  </h3>
                </div>
                <div className="space-y-2">
                  {presets.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyPreset(p)}
                      className="w-full text-left px-4 py-3 rounded-2xl border border-[#E5DCB8] hover:border-[#1400C3] hover:bg-[#F8F2D8]/60 transition-all cursor-pointer font-bold text-xs text-[#1400C3] flex items-center justify-between"
                    >
                      <span>{p.label}</span>
                      <span className="text-[10px] text-[#6B627F] font-mono">
                        {p.top}pt
                      </span>
                    </button>
                  ))}
                </div>
                <div className="pt-2">
                  <p className="text-[11px] text-[#6B627F] leading-relaxed">
                    1 point = 1/72 inch (~0.35 mm). Margins are removed symmetrically or individually from the edges of each page.
                  </p>
                </div>
              </div>

              {/* Right Column: Custom Point Inputs */}
              <div className="md:col-span-7 rounded-3xl bg-white border-2 border-[#1400C3]/15 p-6 shadow-sm space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-sm uppercase tracking-wide text-[#1400C3]">
                    Custom Margins (Points)
                  </h3>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#EBF7ED] text-[#1400C3]">
                    All Pages
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1400C3] mb-1.5">
                      Top Margin (pt)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="300"
                      value={margins.top}
                      onChange={(e) => {
                        setMargins({ ...margins, top: Math.max(0, parseInt(e.target.value) || 0) });
                        setResultBlob(null);
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#E5DCB8] focus:border-[#1400C3] focus:outline-none font-bold text-sm text-[#1400C3]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1400C3] mb-1.5">
                      Bottom Margin (pt)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="300"
                      value={margins.bottom}
                      onChange={(e) => {
                        setMargins({ ...margins, bottom: Math.max(0, parseInt(e.target.value) || 0) });
                        setResultBlob(null);
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#E5DCB8] focus:border-[#1400C3] focus:outline-none font-bold text-sm text-[#1400C3]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1400C3] mb-1.5">
                      Left Margin (pt)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="300"
                      value={margins.left}
                      onChange={(e) => {
                        setMargins({ ...margins, left: Math.max(0, parseInt(e.target.value) || 0) });
                        setResultBlob(null);
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#E5DCB8] focus:border-[#1400C3] focus:outline-none font-bold text-sm text-[#1400C3]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1400C3] mb-1.5">
                      Right Margin (pt)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="300"
                      value={margins.right}
                      onChange={(e) => {
                        setMargins({ ...margins, right: Math.max(0, parseInt(e.target.value) || 0) });
                        setResultBlob(null);
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#E5DCB8] focus:border-[#1400C3] focus:outline-none font-bold text-sm text-[#1400C3]"
                    />
                  </div>
                </div>

                {/* Visual schematic diagram of page crop */}
                <div className="pt-2 border-t border-black/5 flex items-center justify-center">
                  <div className="w-36 h-44 rounded-lg border-2 border-dashed border-[#1400C3]/40 bg-[#F8F2D8]/50 relative flex items-center justify-center p-2 text-[10px] font-bold text-[#6B627F]">
                    <div
                      className="rounded border border-[#FF4E02] bg-[#FF4E02]/10 flex items-center justify-center text-[10px] font-black text-[#FF4E02] transition-all"
                      style={{
                        width: `${Math.max(40, 100 - (margins.left + margins.right) * 0.4)}%`,
                        height: `${Math.max(40, 100 - (margins.top + margins.bottom) * 0.4)}%`,
                      }}
                    >
                      Active Area
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="rounded-3xl bg-white border-2 border-[#1400C3]/15 p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1400C3]">
                <ShieldCheck className="w-4 h-4 text-[#FF4E02]" />
                <span>Zero uploads. Original document retains full vector clarity.</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {!resultBlob ? (
                  <Button
                    onClick={handleCrop}
                    disabled={isProcessing}
                    isLoading={isProcessing}
                    variant="primary"
                    className="w-full sm:w-auto"
                  >
                    <Crop className="w-4 h-4 mr-2" />
                    <span>Apply Margins & Crop</span>
                  </Button>
                ) : (
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button
                      onClick={handleCrop}
                      variant="outline"
                      className="w-1/2 sm:w-auto text-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-1 text-[#FF4E02]" />
                      <span>Re-Apply</span>
                    </Button>
                    <Button
                      onClick={() => setShowAdModal(true)}
                      variant="primary"
                      className="w-1/2 sm:w-auto bg-[#FF4E02] hover:bg-[#e04502] text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      <span>Download Cropped PDF</span>
                    </Button>
                  </div>
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
                  Your cropped PDF document is ready!
                </div>
                <p className="text-xs text-[#6B627F]">
                  Processed size: {formatBytes(resultBlob.size)} • Margins trimmed cleanly
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
          fileName={`${pdfData?.file?.name?.replace(/\.[^/.]+$/, "")}_cropped.pdf`}
          fileSize={resultBlob?.size}
        />
      )}
    </ToolLayout>
  );
}

import React, { useState } from "react";
import {
  Stamp,
  Download,
  Undo2,
  FileText,
  Sliders,
} from "lucide-react";
import ToolLayout from "../components/layout/ToolLayout";
import Dropzone from "../components/common/Dropzone";
import Button from "../components/common/Button";
import DownloadAdModal from "../components/ads/DownloadAdModal";
import { getPdfPageCount, watermarkPdf } from "../services/pdfService";
import { formatBytes, readFileAsArrayBuffer, validateFileSize } from "../utils/fileHelpers";
import { downloadBlob } from "../utils/downloadHelpers";
import { useToast } from "../hooks/useToast";

export default function WatermarkPdfPage({ onBack }) {
  const { showToast } = useToast();

  const [pdfData, setPdfData] = useState(null); // { file, buffer, pageCount }
  const [text, setText] = useState("CONFIDENTIAL");
  const [fontSize, setFontSize] = useState(48);
  const [opacity, setOpacity] = useState(25);
  const [rotation, setRotation] = useState(45);
  const [color, setColor] = useState("#FF4E02");
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState(null);

  const [showAdModal, setShowAdModal] = useState(false);

  const quickPresets = ["CONFIDENTIAL", "DRAFT", "SAMPLE", "COPY", "APPROVED", "PRIVATE"];
  const colorPresets = [
    { label: "Blaze Orange", hex: "#FF4E02" },
    { label: "Bluebonnet", hex: "#1400C3" },
    { label: "Crimson Red", hex: "#DC2626" },
    { label: "Neutral Gray", hex: "#6B7280" },
    { label: "Charcoal", hex: "#1F2937" },
  ];

  const handlePdfLoaded = async (files) => {
    const file = files[0];
    if (!file || (!file.type.includes("pdf") && !file.name.endsWith(".pdf"))) {
      showToast("Please select a valid PDF file.", "error");
      return;
    }

    const check = validateFileSize(file, 50);
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
      showToast("Could not read PDF. Make sure it isn't password protected.", "error");
    }
  };

  const handleApplyWatermark = async () => {
    if (!pdfData) return;
    if (!text.trim()) {
      showToast("Please enter a watermark text.", "error");
      return;
    }

    setIsProcessing(true);
    try {
      const blob = await watermarkPdf(pdfData.buffer, {
        text: text.trim(),
        fontSize: Number(fontSize),
        opacity: Number(opacity) / 100,
        rotation: Number(rotation),
        color,
      });

      setResultBlob(blob);
      showToast("Watermark applied across all pages successfully!", "success");
    } catch {
      showToast("Failed to apply watermark. Please try again.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const executeDownload = () => {
    if (!resultBlob || !pdfData) return;
    const base = pdfData.file.name.replace(/\.[^/.]+$/, "");
    downloadBlob(resultBlob, `${base}_watermarked.pdf`);
    showToast("Downloaded watermarked PDF!", "success");
  };

  const handleDownloadClick = () => {
    setShowAdModal(true);
  };

  return (
    <ToolLayout
      title="Add PDF Watermark"
      description="Stamp text watermarks across every page of your PDF with custom text, angle, opacity, and color."
      onBack={onBack}
    >
      <div className="space-y-6">
        {!pdfData ? (
          <Dropzone
            accept={{ "application/pdf": [".pdf"] }}
            multiple={false}
            onFilesSelected={handlePdfLoaded}
            title="Drop your PDF here"
            subtitle="Stamp custom watermark across all pages in 1-click (Max 50MB)"
          />
        ) : (
          <div className="space-y-6">
            {/* Loaded Document Info */}
            <div className="p-4 rounded-2xl bg-white border-2 border-[#1400C3]/20 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFF4D4] border border-[#F2DE9F] text-[#FF4E02] flex items-center justify-center">
                  <FileText className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#1400C3] truncate max-w-xs sm:max-w-md">
                    {pdfData.file.name}
                  </h4>
                  <p className="text-xs text-[#6B627F] font-semibold">
                    {pdfData.pageCount} pages &bull; {formatBytes(pdfData.file.size)}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPdfData(null);
                  setResultBlob(null);
                }}
              >
                <Undo2 className="w-3.5 h-3.5 mr-1" />
                Change File
              </Button>
            </div>

            {/* Customization Controls Card */}
            <div className="p-6 rounded-3xl bg-white border-2 border-[#E5DCB8] shadow-sm space-y-5">
              <div className="flex items-center gap-2 text-[#1400C3] font-bold text-sm uppercase tracking-wider">
                <Sliders className="w-4 h-4 text-[#FF4E02]" />
                <span>Watermark Configuration</span>
              </div>

              {/* Text Input */}
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-wider text-[#1400C3]">
                  Watermark Text
                </label>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    setResultBlob(null);
                  }}
                  placeholder="e.g. CONFIDENTIAL, DRAFT, SAMPLE"
                  maxLength={60}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-[#E5DCB8] focus:border-[#1400C3] focus:outline-hidden font-bold text-sm text-[#1400C3]"
                />

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] font-bold text-[#6B627F]">Presets:</span>
                  {quickPresets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setText(preset);
                        setResultBlob(null);
                      }}
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
                        text === preset
                          ? "bg-[#1400C3] text-white border-[#1400C3]"
                          : "bg-[#F8F2D8] text-[#1400C3] border-[#E5DCB8] hover:border-[#1400C3]"
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Presets */}
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-wider text-[#1400C3]">
                  Color
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {colorPresets.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => {
                        setColor(c.hex);
                        setResultBlob(null);
                      }}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                        color === c.hex
                          ? "border-[#1400C3] bg-[#F8F2D8] shadow-xs"
                          : "border-[#E5DCB8] bg-white hover:border-[#1400C3]"
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-2xs"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sliders Grid: Size, Opacity, Rotation */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {/* Font Size */}
                <div className="space-y-1.5 p-3 rounded-2xl bg-[#F8F2D8]/50 border border-[#E5DCB8]">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-[#1400C3]">Font Size</span>
                    <span className="text-[#FF4E02]">{fontSize} pt</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="72"
                    step="2"
                    value={fontSize}
                    onChange={(e) => {
                      setFontSize(e.target.value);
                      setResultBlob(null);
                    }}
                    className="w-full accent-[#FF4E02] cursor-pointer"
                  />
                </div>

                {/* Opacity */}
                <div className="space-y-1.5 p-3 rounded-2xl bg-[#F8F2D8]/50 border border-[#E5DCB8]">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-[#1400C3]">Opacity</span>
                    <span className="text-[#FF4E02]">{opacity}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="80"
                    step="5"
                    value={opacity}
                    onChange={(e) => {
                      setOpacity(e.target.value);
                      setResultBlob(null);
                    }}
                    className="w-full accent-[#FF4E02] cursor-pointer"
                  />
                </div>

                {/* Rotation Angle */}
                <div className="space-y-1.5 p-3 rounded-2xl bg-[#F8F2D8]/50 border border-[#E5DCB8]">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-[#1400C3]">Angle</span>
                    <span className="text-[#FF4E02]">{rotation}&deg;</span>
                  </div>
                  <input
                    type="range"
                    min="-90"
                    max="90"
                    step="5"
                    value={rotation}
                    onChange={(e) => {
                      setRotation(e.target.value);
                      setResultBlob(null);
                    }}
                    className="w-full accent-[#FF4E02] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#FFF4D4] border-2 border-[#F2DE9F]">
              <div>
                <h5 className="font-black text-sm text-[#1400C3]">
                  Ready to Stamp Watermark
                </h5>
                <p className="text-xs text-[#6B627F] font-semibold">
                  Will apply to all {pdfData.pageCount} pages using device RAM.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {!resultBlob ? (
                  <Button
                    variant="primary"
                    onClick={handleApplyWatermark}
                    isLoading={isProcessing}
                  >
                    <Stamp className="w-4 h-4 mr-2" />
                    <span>Apply Watermark</span>
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={handleDownloadClick}
                    className="bg-[#10B981] hover:bg-[#059669] text-white shadow-lg"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    <span>Download Watermarked PDF</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <DownloadAdModal
        isOpen={showAdModal}
        onClose={() => setShowAdModal(false)}
        onDownloadReady={executeDownload}
      />
    </ToolLayout>
  );
}

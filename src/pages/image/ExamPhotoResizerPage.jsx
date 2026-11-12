import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  Download,
  Sparkles,
  Sliders,
} from "lucide-react";
import ToolLayout from "../../components/layout/ToolLayout";
import Dropzone from "../../components/common/Dropzone";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import DownloadAdModal from "../../components/ads/DownloadAdModal";
import { EXAM_PRESETS } from "../../config/examPresets";
import { compressImageToTargetKb, loadImage } from "../../services/imageService";
import { formatBytes, validateFileSize, revokeUrlSafe } from "../../utils/fileHelpers";
import { downloadBlob } from "../../utils/downloadHelpers";
import { useToast } from "../../hooks/useToast";

export default function ExamPhotoResizerPage({ onBack }) {
  const { showToast } = useToast();

  const [selectedPresetId, setSelectedPresetId] = useState("tnpsc-photo");
  const [selectedPreset, setSelectedPreset] = useState(EXAM_PRESETS[0]);
  const [isCustomMode, setIsCustomMode] = useState(false);

  // Custom specifications state
  const [customWidth, setCustomWidth] = useState(200);
  const [customHeight, setCustomHeight] = useState(230);
  const [customMaxKb, setCustomMaxKb] = useState(50);
  const [fitMode, setFitMode] = useState("cover");

  // File state
  const [sourceFile, setSourceFile] = useState(null);
  const [sourcePreviewUrl, setSourcePreviewUrl] = useState(null);
  const [sourceMeta, setSourceMeta] = useState(null);

  // Processed state
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState(null);
  const [resultPreviewUrl, setResultPreviewUrl] = useState(null);
  const [resultMeta, setResultMeta] = useState(null);

  // Download Ad Modal
  const [showAdModal, setShowAdModal] = useState(false);

  // Sync preset change
  const handlePresetSelect = (presetId) => {
    setSelectedPresetId(presetId);
    if (presetId === "custom") {
      setIsCustomMode(true);
    } else {
      setIsCustomMode(false);
      const found = EXAM_PRESETS.find((p) => p.id === presetId);
      if (found) {
        setSelectedPreset(found);
        setCustomWidth(found.width);
        setCustomHeight(found.height);
        setCustomMaxKb(found.maxKb);
      }
    }
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      revokeUrlSafe(sourcePreviewUrl);
      revokeUrlSafe(resultPreviewUrl);
    };
  }, [sourcePreviewUrl, resultPreviewUrl]);

  // Handle incoming file
  const handleFileSelected = async (files) => {
    const file = files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please upload a valid image file (JPG, PNG, WebP).", "error");
      return;
    }

    const sizeCheck = validateFileSize(file, 50);
    if (!sizeCheck.valid) {
      showToast(sizeCheck.error, "error");
      return;
    }

    try {
      revokeUrlSafe(sourcePreviewUrl);
      revokeUrlSafe(resultPreviewUrl);

      const url = URL.createObjectURL(file);
      const img = await loadImage(url);

      setSourceFile(file);
      setSourcePreviewUrl(url);
      setSourceMeta({
        width: img.naturalWidth,
        height: img.naturalHeight,
        size: file.size,
      });

      // Reset previous results
      setResultBlob(null);
      setResultPreviewUrl(null);
      setResultMeta(null);

      showToast("Photo loaded successfully. Ready to process!", "success");
    } catch {
      showToast("Could not load image. Please try another file.", "error");
    }
  };

  // Run Compression
  const handleProcessImage = async () => {
    if (!sourceFile) {
      showToast("Please upload an image first.", "error");
      return;
    }

    setIsProcessing(true);
    try {
      const targetW = isCustomMode ? customWidth : selectedPreset.width;
      const targetH = isCustomMode ? customHeight : selectedPreset.height;
      const targetMaxKb = isCustomMode ? customMaxKb : selectedPreset.maxKb;

      const { blob, width, height, sizeBytes } = await compressImageToTargetKb(
        sourceFile,
        targetMaxKb,
        {
          targetWidth: targetW,
          targetHeight: targetH,
          fitMode: fitMode,
          mimeType: "image/jpeg",
        }
      );

      revokeUrlSafe(resultPreviewUrl);
      const previewUrl = URL.createObjectURL(blob);
      setResultBlob(blob);
      setResultPreviewUrl(previewUrl);
      setResultMeta({
        width,
        height,
        sizeBytes,
        targetMaxKb,
        meetsRequirements: sizeBytes <= targetMaxKb * 1024,
      });

      showToast("Photo resized and compressed perfectly!", "success");
    } catch (err) {
      showToast("Processing failed: " + err.message, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // Download Trigger (with Ad Modal)
  const handleDownloadClick = () => {
    if (!resultBlob) return;
    setShowAdModal(true);
  };

  const confirmDownload = () => {
    if (!resultBlob) return;
    const baseName = sourceFile?.name?.replace(/\.[^/.]+$/, "") || "exam_photo";
    const filename = `${baseName}_${isCustomMode ? "resized" : selectedPreset.id}.jpg`;
    downloadBlob(resultBlob, filename);
    showToast("Downloaded " + filename, "success");
  };

  return (
    <ToolLayout
      title="Photo & Signature Resizer"
      description="Resize and compress photos to exact pixel dimensions and maximum KB requirements with preset specifications or custom sizing."
      onBack={onBack}
    >
      <div className="space-y-8">
        {/* Step 1: Preset Selection */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#E5DCB8] shadow-sm">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="w-7 h-7 rounded-xl bg-[#1400C3] text-white text-xs font-black flex items-center justify-center">
              1
            </span>
            <h3 className="font-black text-[#1400C3] text-lg">
              Select Exam Specification Preset
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {EXAM_PRESETS.map((preset) => {
              const isSelected = selectedPresetId === preset.id && !isCustomMode;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handlePresetSelect(preset.id)}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#1400C3] border-[#1400C3] text-white shadow-lg shadow-[#1400C3]/20"
                      : "bg-[#F8F2D8]/40 border-[#E5DCB8] text-[#1400C3] hover:border-[#1400C3] hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-black mb-1">
                    <span>{preset.category}</span>
                    <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded ${
                      isSelected ? "bg-white/20 text-white" : "bg-[#FF4E02]/15 text-[#D93E00]"
                    }`}>
                      &lt;{preset.maxKb}KB
                    </span>
                  </div>
                  <div className={`text-xs font-bold truncate ${isSelected ? "text-white" : "text-[#3B3355]"}`}>
                    {preset.label}
                  </div>
                  <div className={`text-[11px] mt-1 font-semibold ${isSelected ? "text-white/80" : "text-[#6B627F]"}`}>
                    {preset.width}&times;{preset.height} px
                  </div>
                </button>
              );
            })}

            {/* Custom Specs button */}
            <button
              type="button"
              onClick={() => handlePresetSelect("custom")}
              className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                isCustomMode
                  ? "bg-[#FF4E02] border-[#FF4E02] text-white shadow-lg shadow-[#FF4E02]/25"
                  : "bg-[#F8F2D8]/40 border-[#E5DCB8] text-[#1400C3] hover:border-[#FF4E02] hover:bg-white"
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-black mb-1">
                <Sliders className="w-3.5 h-3.5" />
                <span>Custom</span>
              </div>
              <div className={`text-xs font-bold ${isCustomMode ? "text-white" : "text-[#3B3355]"}`}>
                Custom Size
              </div>
              <div className={`text-[11px] mt-1 font-semibold ${isCustomMode ? "text-white/80" : "text-[#6B627F]"}`}>
                Set custom px &amp; KB
              </div>
            </button>
          </div>

          {/* Custom Settings Drawer if active */}
          {isCustomMode && (
            <div className="mt-6 pt-6 border-t border-[#E5DCB8] grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1400C3] mb-1.5">
                  Target Width (pixels)
                </label>
                <input
                  type="number"
                  value={customWidth}
                  onChange={(e) => setCustomWidth(Math.max(10, parseInt(e.target.value) || 100))}
                  className="w-full bg-[#F8F2D8]/60 border-2 border-[#E5DCB8] rounded-xl px-3.5 py-2.5 text-sm text-[#1400C3] font-bold focus:outline-none focus:border-[#1400C3]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1400C3] mb-1.5">
                  Target Height (pixels)
                </label>
                <input
                  type="number"
                  value={customHeight}
                  onChange={(e) => setCustomHeight(Math.max(10, parseInt(e.target.value) || 100))}
                  className="w-full bg-[#F8F2D8]/60 border-2 border-[#E5DCB8] rounded-xl px-3.5 py-2.5 text-sm text-[#1400C3] font-bold focus:outline-none focus:border-[#1400C3]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1400C3] mb-1.5">
                  Max File Size (KB)
                </label>
                <input
                  type="number"
                  value={customMaxKb}
                  onChange={(e) => setCustomMaxKb(Math.max(5, parseInt(e.target.value) || 50))}
                  className="w-full bg-[#F8F2D8]/60 border-2 border-[#E5DCB8] rounded-xl px-3.5 py-2.5 text-sm text-[#1400C3] font-bold focus:outline-none focus:border-[#FF4E02]"
                />
              </div>
            </div>
          )}

          {/* Fit Mode selector */}
          <div className="mt-5 pt-4 border-t border-[#E5DCB8] flex flex-wrap items-center gap-3 sm:gap-5 text-xs text-[#3B3355] font-bold">
            <span className="text-[#1400C3]">Crop Mode:</span>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="fitMode"
                value="cover"
                checked={fitMode === "cover"}
                onChange={() => setFitMode("cover")}
                className="text-[#1400C3] focus:ring-0 accent-[#1400C3]"
              />
              <span>Smart Crop (Fill)</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="fitMode"
                value="contain"
                checked={fitMode === "contain"}
                onChange={() => setFitMode("contain")}
                className="text-[#1400C3] focus:ring-0 accent-[#1400C3]"
              />
              <span>Fit with White Border</span>
            </label>
          </div>
        </div>

        {/* Step 2: Upload or View Source */}
        <div className="p-4 sm:p-8 rounded-3xl bg-white border-2 border-[#E5DCB8] shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-[#1400C3] text-white text-xs font-black flex items-center justify-center">
                2
              </span>
              <h3 className="font-black text-[#1400C3] text-lg">
                Upload Photo / Signature
              </h3>
            </div>
            {sourceFile && (
              <button
                type="button"
                onClick={() => {
                  setSourceFile(null);
                  setSourcePreviewUrl(null);
                  setResultBlob(null);
                  setResultPreviewUrl(null);
                }}
                className="text-xs text-rose-600 hover:text-rose-700 font-bold cursor-pointer"
              >
                Clear Photo
              </button>
            )}
          </div>

          {!sourceFile ? (
            <Dropzone
              onFilesSelected={handleFileSelected}
              accept="image/jpeg,image/png,image/webp"
              title="Upload Photo or Signature"
              subtitle="Drag & drop your original image here or browse"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Original preview card */}
              <div className="p-5 rounded-2xl bg-[#F8F2D8]/50 border-2 border-[#E5DCB8] flex flex-col items-center">
                <span className="text-xs font-black text-[#6B627F] mb-3 uppercase tracking-wider">
                  Original Image
                </span>
                <div className="max-h-56 max-w-full overflow-hidden rounded-xl border border-[#D6CA9E] bg-white flex items-center justify-center p-2 shadow-sm">
                  <img
                    src={sourcePreviewUrl}
                    alt="Original"
                    className="max-h-52 object-contain rounded"
                  />
                </div>
                <div className="mt-3 flex items-center gap-3 text-xs text-[#3B3355] font-bold">
                  <span>{sourceMeta?.width} &times; {sourceMeta?.height} px</span>
                  <span>&bull;</span>
                  <span className="text-[#FF4E02] font-black">
                    {formatBytes(sourceMeta?.size)}
                  </span>
                </div>
              </div>

              {/* Action Column */}
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <div className="p-5 rounded-2xl bg-[#F8F2D8]/60 border border-[#E5DCB8] text-xs text-[#3B3355] text-left w-full space-y-1.5 font-semibold">
                  <p className="font-black text-[#1400C3] text-sm">Target Output Requirements:</p>
                  <p>&bull; Width: {isCustomMode ? customWidth : selectedPreset.width} px</p>
                  <p>&bull; Height: {isCustomMode ? customHeight : selectedPreset.height} px</p>
                  <p>&bull; Max Size: Strictly Under {isCustomMode ? customMaxKb : selectedPreset.maxKb} KB</p>
                </div>

                <Button
                  onClick={handleProcessImage}
                  loading={isProcessing}
                  variant="orange"
                  size="lg"
                  icon={Sparkles}
                  className="w-full"
                >
                  Resize &amp; Compress Now
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Step 3: Processed Result & Download */}
        {resultBlob && (
          <div className="p-4 sm:p-8 rounded-3xl bg-white border-2 border-[#FF4E02] shadow-xl animate-slide-up">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-[#FF4E02]" />
                <h3 className="font-black text-[#1400C3] text-lg">
                  Resized Result Ready
                </h3>
              </div>
              <Badge color="orange">Compliant for Exam</Badge>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Preview */}
              <div className="p-3 rounded-2xl bg-[#F8F2D8] border border-[#E5DCB8] flex items-center justify-center shadow-inner">
                <img
                  src={resultPreviewUrl}
                  alt="Resized Exam Ready"
                  style={{
                    maxWidth: "200px",
                    maxHeight: "230px",
                  }}
                  className="rounded-lg object-contain shadow"
                />
              </div>

              {/* Stats & Download */}
              <div className="flex-1 space-y-4 text-center sm:text-left">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-sm">
                    <span className="font-bold text-[#3B3355]">Final File Size:</span>
                    <span className="text-[#FF4E02] font-black text-lg">
                      {formatBytes(resultMeta?.sizeBytes)}
                    </span>
                    <span className="text-xs text-[#6B627F] font-semibold">
                      (Limit: {resultMeta?.targetMaxKb} KB)
                    </span>
                  </div>

                  <div className="text-xs text-[#6B627F] font-semibold">
                    Resolution: {resultMeta?.width} &times; {resultMeta?.height} px &bull; Format: JPG
                  </div>
                </div>

                <Button
                  onClick={handleDownloadClick}
                  variant="orange"
                  size="lg"
                  icon={Download}
                >
                  Download Exam Ready Photo
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interstitial Ad Download Modal */}
      <DownloadAdModal
        isOpen={showAdModal}
        onClose={() => setShowAdModal(false)}
        onConfirmDownload={confirmDownload}
        fileName={`${sourceFile?.name?.replace(/\.[^/.]+$/, "") || "exam_photo"}.jpg`}
        fileSizeText={formatBytes(resultMeta?.sizeBytes)}
      />
    </ToolLayout>
  );
}

import React, { useState, useEffect } from "react";
import {
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Download,
  Settings2,
  Sparkles,
  RefreshCw,
  Sliders,
} from "lucide-react";
import ToolLayout from "../components/layout/ToolLayout";
import Dropzone from "../components/common/Dropzone";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import DownloadAdModal from "../components/ads/DownloadAdModal";
import { EXAM_PRESETS } from "../config/examPresets";
import { compressImageToTargetKb, loadImage } from "../services/imageService";
import { formatBytes } from "../utils/fileHelpers";
import { downloadBlob } from "../utils/downloadHelpers";
import { useToast } from "../context/ToastContext";

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

  // Handle incoming file
  const handleFileSelected = async (files) => {
    const file = files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please upload a valid image file (JPG, PNG, WebP).", "error");
      return;
    }

    try {
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
    } catch (err) {
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
      title="Govt Exam Photo & Signature Resizer"
      description="Resize & compress photos to exact pixel dimensions and maximum KB requirements for TNPSC, SSC, UPSC, and IBPS."
      badgeText="TNPSC / SSC / UPSC Ready"
      badgeColor="emerald"
      onBack={onBack}
    >
      <div className="space-y-8">
        {/* Step 1: Preset Selection */}
        <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/60">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center">
              1
            </span>
            <h3 className="font-bold text-white text-base">
              Select Exam Specification Preset
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {EXAM_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handlePresetSelect(preset.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedPresetId === preset.id && !isCustomMode
                    ? "bg-emerald-500/10 border-emerald-500/80 text-white shadow-md shadow-emerald-500/10"
                    : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span>{preset.category}</span>
                  <span className="text-[10px] text-emerald-400 font-normal">
                    &lt;{preset.maxKb}KB
                  </span>
                </div>
                <div className="text-xs font-medium text-slate-200 truncate">
                  {preset.label}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {preset.width}x{preset.height} px
                </div>
              </button>
            ))}

            {/* Custom Specs button */}
            <button
              type="button"
              onClick={() => handlePresetSelect("custom")}
              className={`p-3 rounded-xl border text-left transition-all ${
                isCustomMode
                  ? "bg-indigo-500/10 border-indigo-500/80 text-white shadow-md shadow-indigo-500/10"
                  : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40"
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 mb-1">
                <Sliders className="w-3.5 h-3.5" />
                <span>Custom</span>
              </div>
              <div className="text-xs font-medium text-slate-200">
                Custom Size
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Set custom px & KB
              </div>
            </button>
          </div>

          {/* Custom Settings Drawer if active */}
          {isCustomMode && (
            <div className="mt-5 pt-5 border-t border-slate-700/60 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Target Width (pixels)
                </label>
                <input
                  type="number"
                  value={customWidth}
                  onChange={(e) => setCustomWidth(Math.max(10, parseInt(e.target.value) || 100))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Target Height (pixels)
                </label>
                <input
                  type="number"
                  value={customHeight}
                  onChange={(e) => setCustomHeight(Math.max(10, parseInt(e.target.value) || 100))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Max File Size (KB)
                </label>
                <input
                  type="number"
                  value={customMaxKb}
                  onChange={(e) => setCustomMaxKb(Math.max(5, parseInt(e.target.value) || 50))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {/* Fit Mode selector */}
          <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
            <span className="font-medium text-slate-300">Crop Mode:</span>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="fitMode"
                value="cover"
                checked={fitMode === "cover"}
                onChange={() => setFitMode("cover")}
                className="text-indigo-600 focus:ring-0"
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
                className="text-indigo-600 focus:ring-0"
              />
              <span>Fit with White Border</span>
            </label>
          </div>
        </div>

        {/* Step 2: Upload or View Source */}
        <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/60">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h3 className="font-bold text-white text-base">
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
                className="text-xs text-rose-400 hover:text-rose-300 cursor-pointer"
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
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 flex flex-col items-center">
                <span className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                  Original Image
                </span>
                <div className="max-h-56 max-w-full overflow-hidden rounded-lg border border-slate-700 bg-slate-950 flex items-center justify-center p-1">
                  <img
                    src={sourcePreviewUrl}
                    alt="Original"
                    className="max-h-52 object-contain"
                  />
                </div>
                <div className="mt-3 flex items-center gap-3 text-xs text-slate-300">
                  <span>{sourceMeta?.width} &times; {sourceMeta?.height} px</span>
                  <span>&bull;</span>
                  <span className="font-bold text-amber-400">
                    {formatBytes(sourceMeta?.size)}
                  </span>
                </div>
              </div>

              {/* Action Column */}
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 text-left w-full space-y-1.5">
                  <p className="font-semibold text-white">Target Output Requirements:</p>
                  <p>&bull; Width: {isCustomMode ? customWidth : selectedPreset.width} px</p>
                  <p>&bull; Height: {isCustomMode ? customHeight : selectedPreset.height} px</p>
                  <p>&bull; Max Size: Under {isCustomMode ? customMaxKb : selectedPreset.maxKb} KB</p>
                </div>

                <Button
                  onClick={handleProcessImage}
                  loading={isProcessing}
                  variant="emerald"
                  size="lg"
                  icon={Sparkles}
                  className="w-full"
                >
                  Resize & Compress Now
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Step 3: Processed Result & Download */}
        {resultBlob && (
          <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">
                  Resized Result Ready
                </h3>
              </div>
              <Badge color="emerald">Compliant for Exam</Badge>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Preview */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                <img
                  src={resultPreviewUrl}
                  alt="Resized Exam Ready"
                  style={{
                    maxWidth: "200px",
                    maxHeight: "230px",
                  }}
                  className="rounded object-contain shadow"
                />
              </div>

              {/* Stats & Download */}
              <div className="flex-1 space-y-4 text-center sm:text-left">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="font-semibold text-white">Final File Size:</span>
                    <span className="text-emerald-400 font-bold text-base">
                      {formatBytes(resultMeta?.sizeBytes)}
                    </span>
                    <span className="text-xs text-slate-400">
                      (Limit: {resultMeta?.targetMaxKb} KB)
                    </span>
                  </div>

                  <div className="text-xs text-slate-400">
                    Resolution: {resultMeta?.width} &times; {resultMeta?.height} px &bull; Format: JPG
                  </div>
                </div>

                <Button
                  onClick={handleDownloadClick}
                  variant="emerald"
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

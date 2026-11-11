import React, { useState, useEffect } from "react";
import {
  Download,
  Trash2,
  Sparkles,
  Archive,
  Sliders,
} from "lucide-react";
import ToolLayout from "../components/layout/ToolLayout";
import Dropzone from "../components/common/Dropzone";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import DownloadAdModal from "../components/ads/DownloadAdModal";
import { compressStandardImage } from "../services/imageService";
import { formatBytes, calculateSavings, changeFileExtension, validateFileSize, revokeUrlSafe } from "../utils/fileHelpers";
import { downloadBlob, downloadMultipleAsZip } from "../utils/downloadHelpers";
import { useToast } from "../hooks/useToast";

export default function ImageCompressorPage({ onBack }) {
  const { showToast } = useToast();

  const [files, setFiles] = useState([]);
  const [quality, setQuality] = useState(80);
  const [scale, setScale] = useState(1.0);
  const [format, setFormat] = useState("image/webp"); // WebP offers highest compression
  const [isCompressing, setIsCompressing] = useState(false);

  // Ad Download Modal
  const [pendingDownload, setPendingDownload] = useState(null);
  const [showAdModal, setShowAdModal] = useState(false);

  // Clean up previews on unmount
  useEffect(() => {
    return () => {
      files.forEach((f) => revokeUrlSafe(f.preview));
    };
  }, [files]);

  const handleFilesAdded = (newFiles) => {
    const validImageFiles = newFiles.filter((f) => f.type.startsWith("image/"));
    if (validImageFiles.length === 0) {
      showToast("Please upload valid image files.", "error");
      return;
    }

    const safeFiles = [];
    for (const file of validImageFiles) {
      const check = validateFileSize(file, 50);
      if (!check.valid) {
        showToast(`${file.name}: ${check.error}`, "error");
      } else {
        safeFiles.push(file);
      }
    }

    if (safeFiles.length === 0) return;

    const fileEntries = safeFiles.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      preview: URL.createObjectURL(file),
      originalSize: file.size,
      compressedBlob: null,
      compressedSize: null,
      savings: 0,
      status: "idle", // 'idle' | 'processing' | 'done'
    }));

    setFiles((prev) => [...prev, ...fileEntries]);
    showToast(`Added ${safeFiles.length} image(s). Ready to compress!`, "success");
  };

  const removeFile = (id) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target?.preview) revokeUrlSafe(target.preview);
      return prev.filter((f) => f.id !== id);
    });
  };

  const clearAll = () => {
    files.forEach((f) => revokeUrlSafe(f.preview));
    setFiles([]);
  };

  const handleCompressAll = async () => {
    if (files.length === 0) {
      showToast("Please upload images first.", "error");
      return;
    }

    setIsCompressing(true);
    try {
      const updatedFiles = [...files];

      for (let i = 0; i < updatedFiles.length; i++) {
        const item = updatedFiles[i];
        item.status = "processing";
        setFiles([...updatedFiles]);

        const result = await compressStandardImage(item.file, {
          quality: quality / 100,
          scale: scale,
          outputFormat: format,
        });

        item.compressedBlob = result.blob;
        item.compressedSize = result.compressedSize;
        item.savings = calculateSavings(item.originalSize, result.compressedSize);
        item.status = "done";
      }

      setFiles([...updatedFiles]);
      showToast("All images compressed successfully!", "success");
    } catch (err) {
      showToast("Compression error: " + err.message, "error");
    } finally {
      setIsCompressing(false);
    }
  };

  const getTargetExtension = () => {
    if (format === "image/webp") return "webp";
    if (format === "image/png") return "png";
    return "jpg";
  };

  const initiateSingleDownload = (item) => {
    if (!item.compressedBlob) return;
    const filename = changeFileExtension(item.file.name, getTargetExtension());
    setPendingDownload({
      type: "single",
      blob: item.compressedBlob,
      filename,
      sizeText: formatBytes(item.compressedSize),
    });
    setShowAdModal(true);
  };

  const initiateZipDownload = () => {
    const readyItems = files.filter((f) => f.compressedBlob);
    if (readyItems.length === 0) return;

    setPendingDownload({
      type: "zip",
      files: readyItems.map((item) => ({
        name: changeFileExtension(item.file.name, getTargetExtension()),
        blob: item.compressedBlob,
      })),
      filename: "docupix_compressed_images.zip",
      sizeText: `${readyItems.length} files`,
    });
    setShowAdModal(true);
  };

  const handleConfirmedDownload = () => {
    if (!pendingDownload) return;

    if (pendingDownload.type === "single") {
      downloadBlob(pendingDownload.blob, pendingDownload.filename);
      showToast(`Downloaded ${pendingDownload.filename}`, "success");
    } else if (pendingDownload.type === "zip") {
      downloadMultipleAsZip(pendingDownload.files, pendingDownload.filename);
      showToast("ZIP download started!", "success");
    }
  };

  const totalOriginalSize = files.reduce((acc, f) => acc + f.originalSize, 0);
  const totalCompressedSize = files.reduce((acc, f) => acc + (f.compressedSize || f.originalSize), 0);
  const overallSavings = calculateSavings(totalOriginalSize, totalCompressedSize);
  const anyDone = files.some((f) => f.status === "done");

  return (
    <ToolLayout
      title="Smart Image Compressor"
      description="Reduce image size up to 90% without losing visible quality. Convert to modern WebP, JPG, or PNG."
      onBack={onBack}
    >
      <div className="space-y-8">
        {/* Settings Panel */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#E5DCB8] shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Sliders className="w-5 h-5 text-[#FF4E02]" />
              <h3 className="font-black text-[#1400C3] text-lg">
                Compression Settings
              </h3>
            </div>
            <span className="text-xs text-[#6B627F] font-bold">
              Balanced presets recommended
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Quality Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-black">
                <span className="text-[#3B3355]">Image Quality</span>
                <span className="text-[#FF4E02] font-black text-sm">{quality}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-[#FF4E02] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#6B627F] font-semibold">
                <span>Smaller size (10%)</span>
                <span>Best quality (100%)</span>
              </div>
            </div>

            {/* Resolution Scaling */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-black">
                <span className="text-[#3B3355]">Scale Resolution</span>
                <span className="text-[#1400C3] font-black text-sm">{Math.round(scale * 100)}%</span>
              </div>
              <input
                type="range"
                min="25"
                max="100"
                step="25"
                value={Math.round(scale * 100)}
                onChange={(e) => setScale(Number(e.target.value) / 100)}
                className="w-full accent-[#1400C3] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#6B627F] font-semibold">
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100% (Original)</span>
              </div>
            </div>

            {/* Output Format */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-[#3B3355]">
                Output Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full bg-[#F8F2D8]/60 border-2 border-[#E5DCB8] rounded-xl px-3.5 py-2.5 text-sm text-[#1400C3] font-bold focus:outline-none focus:border-[#1400C3]"
              >
                <option value="image/webp">WebP (Recommended - Smallest)</option>
                <option value="image/jpeg">JPEG / JPG (Universal)</option>
                <option value="image/png">PNG (Lossless)</option>
              </select>
              <p className="text-[11px] text-[#6B627F] font-medium">
                WebP gives 30% smaller files than JPEG at equal quality.
              </p>
            </div>
          </div>
        </div>

        {/* Upload Zone */}
        <Dropzone
          onFilesSelected={handleFilesAdded}
          accept="image/*"
          multiple={true}
          title="Upload or Drop Images to Compress"
          subtitle="Supports JPG, PNG, WebP, GIF, BMP &bull; Multiple images allowed"
        />

        {/* File Queue & Results */}
        {files.length > 0 && (
          <div className="space-y-4">
            {/* Header / Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-[#E5DCB8] shadow-sm">
              <div className="flex items-center gap-3">
                <span className="font-black text-[#1400C3] text-base">
                  {files.length} Image{files.length > 1 ? "s" : ""}
                </span>
                <span className="text-xs text-[#6B627F] font-semibold">
                  Total Original: {formatBytes(totalOriginalSize)}
                </span>
                {anyDone && overallSavings > 0 && (
                  <Badge color="orange">
                    Saved {overallSavings}% ({formatBytes(totalOriginalSize - totalCompressedSize)})
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={clearAll}
                  variant="ghost"
                  size="sm"
                  icon={Trash2}
                >
                  Clear All
                </Button>

                <Button
                  onClick={handleCompressAll}
                  loading={isCompressing}
                  variant="orange"
                  size="md"
                  icon={Sparkles}
                >
                  Compress All
                </Button>

                {anyDone && (
                  <Button
                    onClick={initiateZipDownload}
                    variant="primary"
                    size="md"
                    icon={Archive}
                  >
                    Download ZIP
                  </Button>
                )}
              </div>
            </div>

            {/* List of files */}
            <div className="grid grid-cols-1 gap-3">
              {files.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#E5DCB8] hover:border-[#1400C3] transition-all shadow-sm"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.preview}
                      alt="Thumbnail"
                      className="w-14 h-14 rounded-xl object-cover bg-[#F8F2D8] border border-[#E5DCB8] shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-black text-[#1400C3] truncate max-w-xs sm:max-w-md">
                        {item.file.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-[#6B627F] mt-0.5 font-semibold">
                        <span>Original: {formatBytes(item.originalSize)}</span>
                        {item.compressedSize && (
                          <>
                            <span>&rarr;</span>
                            <span className="text-[#FF4E02] font-black text-sm">
                              {formatBytes(item.compressedSize)}
                            </span>
                            <Badge color="orange" className="text-[10px] py-0">
                              -{item.savings}%
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.status === "done" ? (
                      <button
                        type="button"
                        onClick={() => initiateSingleDownload(item)}
                        className="px-3.5 py-2 rounded-xl bg-[#FF4E02] hover:bg-[#E04200] text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#FF4E02]/25 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Download</span>
                      </button>
                    ) : (
                      <span className="text-xs text-[#6B627F] font-bold px-2 py-1">
                        {item.status === "processing" ? "Compressing..." : "Ready"}
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => removeFile(item.id)}
                      className="p-1.5 text-[#6B627F] hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Ad Modal */}
      <DownloadAdModal
        isOpen={showAdModal}
        onClose={() => setShowAdModal(false)}
        onConfirmDownload={handleConfirmedDownload}
        fileName={pendingDownload?.filename || "compressed_file"}
        fileSizeText={pendingDownload?.sizeText || ""}
      />
    </ToolLayout>
  );
}

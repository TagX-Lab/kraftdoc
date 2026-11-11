import React, { useState } from "react";
import {
  RefreshCw,
  Download,
  Trash2,
  Sparkles,
  Archive,
  Layers,
} from "lucide-react";
import ToolLayout from "../components/layout/ToolLayout";
import Dropzone from "../components/common/Dropzone";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import DownloadAdModal from "../components/ads/DownloadAdModal";
import { convertImageFormat } from "../services/imageService";
import { formatBytes, changeFileExtension, getFileExtension } from "../utils/fileHelpers";
import { downloadBlob, downloadMultipleAsZip } from "../utils/downloadHelpers";
import { useToast } from "../context/ToastContext";

export default function ImageConverterPage({ onBack }) {
  const { showToast } = useToast();

  const [files, setFiles] = useState([]);
  const [targetFormat, setTargetFormat] = useState("image/webp");
  const [quality, setQuality] = useState(90);
  const [isConverting, setIsConverting] = useState(false);

  // Ad Modal State
  const [pendingDownload, setPendingDownload] = useState(null);
  const [showAdModal, setShowAdModal] = useState(false);

  const handleFilesAdded = (newFiles) => {
    const valid = newFiles.filter((f) => f.type.startsWith("image/"));
    if (valid.length === 0) {
      showToast("Please upload valid image files.", "error");
      return;
    }

    const items = valid.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      preview: URL.createObjectURL(file),
      originalExt: getFileExtension(file.name),
      size: file.size,
      convertedBlob: null,
      status: "idle",
    }));

    setFiles((prev) => [...prev, ...items]);
    showToast(`Added ${items.length} images to convert.`, "success");
  };

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const getTargetExt = () => {
    if (targetFormat === "image/webp") return "webp";
    if (targetFormat === "image/png") return "png";
    return "jpg";
  };

  const handleConvertAll = async () => {
    if (files.length === 0) {
      showToast("Please add images first.", "error");
      return;
    }

    setIsConverting(true);
    try {
      const copy = [...files];
      for (const item of copy) {
        item.status = "converting";
        setFiles([...copy]);

        const blob = await convertImageFormat(item.file, targetFormat, quality / 100);
        item.convertedBlob = blob;
        item.status = "done";
      }

      setFiles([...copy]);
      showToast("All images converted successfully!", "success");
    } catch (err) {
      showToast("Conversion failed: " + err.message, "error");
    } finally {
      setIsConverting(false);
    }
  };

  const initiateSingleDownload = (item) => {
    if (!item.convertedBlob) return;
    const filename = changeFileExtension(item.file.name, getTargetExt());
    setPendingDownload({
      type: "single",
      blob: item.convertedBlob,
      filename,
      sizeText: formatBytes(item.convertedBlob.size),
    });
    setShowAdModal(true);
  };

  const initiateZipDownload = () => {
    const ready = files.filter((f) => f.convertedBlob);
    if (ready.length === 0) return;

    setPendingDownload({
      type: "zip",
      files: ready.map((item) => ({
        name: changeFileExtension(item.file.name, getTargetExt()),
        blob: item.convertedBlob,
      })),
      filename: "docupix_converted_images.zip",
      sizeText: `${ready.length} files`,
    });
    setShowAdModal(true);
  };

  const handleConfirmDownload = () => {
    if (!pendingDownload) return;
    if (pendingDownload.type === "single") {
      downloadBlob(pendingDownload.blob, pendingDownload.filename);
      showToast(`Downloaded ${pendingDownload.filename}`, "success");
    } else {
      downloadMultipleAsZip(pendingDownload.files, pendingDownload.filename);
      showToast("ZIP download started!", "success");
    }
  };

  const anyDone = files.some((f) => f.status === "done");

  return (
    <ToolLayout
      title="Image Format Converter"
      description="Convert JPG, PNG, and WebP images instantly in your browser with zero quality degradation."
      onBack={onBack}
    >
      <div className="space-y-8">
        {/* Settings Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#E5DCB8] grid grid-cols-1 md:grid-cols-2 gap-6 shadow-sm">
          <div>
            <label className="block text-xs font-black text-[#1400C3] mb-1.5">
              Target Output Format
            </label>
            <select
              value={targetFormat}
              onChange={(e) => setTargetFormat(e.target.value)}
              className="w-full bg-[#F8F2D8]/60 border-2 border-[#E5DCB8] rounded-xl px-3.5 py-2.5 text-sm text-[#1400C3] font-bold focus:outline-none focus:border-[#1400C3]"
            >
              <option value="image/webp">WebP (Modern, Smallest Size)</option>
              <option value="image/png">PNG (Lossless &amp; Transparent)</option>
              <option value="image/jpeg">JPG / JPEG (Universal Standard)</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between text-xs font-black mb-1.5">
              <span className="text-[#3B3355]">Conversion Quality</span>
              <span className="text-[#FF4E02] font-black text-sm">{quality}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              disabled={targetFormat === "image/png"}
              className="w-full accent-[#FF4E02] cursor-pointer disabled:opacity-50"
            />
            <p className="text-[11px] text-[#6B627F] font-semibold mt-1">
              {targetFormat === "image/png"
                ? "PNG is strictly lossless (quality slider disabled)."
                : "Higher quality preserves finer details."}
            </p>
          </div>
        </div>

        {/* Dropzone */}
        <Dropzone
          onFilesSelected={handleFilesAdded}
          accept="image/*"
          multiple={true}
          title="Upload Images to Convert"
          subtitle="Batch convert as many images as you want"
        />

        {/* Action Bar & Files */}
        {files.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-5 rounded-2xl bg-white border border-[#E5DCB8] shadow-sm">
              <span className="text-base font-black text-[#1400C3]">
                {files.length} Image{files.length > 1 ? "s" : ""} Selected
              </span>

              <div className="flex items-center gap-2">
                <Button
                  onClick={handleConvertAll}
                  loading={isConverting}
                  variant="orange"
                  size="md"
                  icon={Sparkles}
                >
                  Convert All to {getTargetExt().toUpperCase()}
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

            <div className="space-y-2">
              {files.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#E5DCB8] hover:border-[#1400C3] shadow-sm transition-all"
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
                      <div className="flex items-center gap-2 text-xs text-[#6B627F] font-semibold">
                        <span className="uppercase font-bold text-[#1400C3]">{item.originalExt}</span>
                        <span>&rarr;</span>
                        <span className="text-[#FF4E02] font-black uppercase">
                          {getTargetExt()}
                        </span>
                        <span>&bull;</span>
                        <span>{formatBytes(item.convertedBlob ? item.convertedBlob.size : item.size)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.status === "done" ? (
                      <button
                        type="button"
                        onClick={() => initiateSingleDownload(item)}
                        className="px-3.5 py-2 rounded-xl bg-[#FF4E02] hover:bg-[#E04200] text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#FF4E02]/25"
                      >
                        <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Download</span>
                      </button>
                    ) : (
                      <span className="text-xs text-[#6B627F] font-bold px-2 py-1">
                        {item.status === "converting" ? "Converting..." : "Ready"}
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => removeFile(item.id)}
                      className="p-1.5 text-[#6B627F] hover:text-rose-600 cursor-pointer"
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
        onConfirmDownload={handleConfirmDownload}
        fileName={pendingDownload?.filename || "converted_image"}
        fileSizeText={pendingDownload?.sizeText || ""}
      />
    </ToolLayout>
  );
}

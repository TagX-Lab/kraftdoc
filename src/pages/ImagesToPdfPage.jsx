import React, { useState, useEffect } from "react";
import {
  FileText,
  Download,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Settings,
} from "lucide-react";
import ToolLayout from "../components/layout/ToolLayout";
import Dropzone from "../components/common/Dropzone";
import Button from "../components/common/Button";
import DownloadAdModal from "../components/ads/DownloadAdModal";
import { imagesToPdf } from "../services/pdfService";
import { formatBytes, validateFileSize, revokeUrlSafe } from "../utils/fileHelpers";
import { downloadBlob } from "../utils/downloadHelpers";
import { useToast } from "../hooks/useToast";

export default function ImagesToPdfPage({ onBack }) {
  const { showToast } = useToast();

  const [images, setImages] = useState([]);
  const [pageSize, setPageSize] = useState("A4");
  const [orientation, setOrientation] = useState("portrait");
  const [margin, setMargin] = useState(20);
  const [fitMode, setFitMode] = useState("contain");
  const [outputFilename, setOutputFilename] = useState("docupix_converted.pdf");

  const [isGenerating, setIsGenerating] = useState(false);
  const [resultPdfBlob, setResultPdfBlob] = useState(null);
  const [showAdModal, setShowAdModal] = useState(false);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach((img) => revokeUrlSafe(img.preview));
    };
  }, [images]);

  const handleImagesAdded = (files) => {
    const valid = files.filter((f) => f.type.startsWith("image/"));
    if (valid.length === 0) {
      showToast("Please upload image files (JPG, PNG, WebP).", "error");
      return;
    }

    const safeFiles = [];
    for (const file of valid) {
      const check = validateFileSize(file, 50);
      if (!check.valid) {
        showToast(`${file.name}: ${check.error}`, "error");
      } else {
        safeFiles.push(file);
      }
    }

    if (safeFiles.length === 0) return;

    const newEntries = safeFiles.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    }));

    setImages((prev) => [...prev, ...newEntries]);
    setResultPdfBlob(null);
    showToast(`Added ${safeFiles.length} image(s).`, "success");
  };

  const removeImage = (id) => {
    setImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target?.preview) revokeUrlSafe(target.preview);
      return prev.filter((img) => img.id !== id);
    });
    setResultPdfBlob(null);
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const copy = [...images];
    const [moved] = copy.splice(index, 1);
    copy.splice(index - 1, 0, moved);
    setImages(copy);
  };

  const moveDown = (index) => {
    if (index === images.length - 1) return;
    const copy = [...images];
    const [moved] = copy.splice(index, 1);
    copy.splice(index + 1, 0, moved);
    setImages(copy);
  };

  const handleGeneratePdf = async () => {
    if (images.length === 0) {
      showToast("Please add at least one image.", "error");
      return;
    }

    setIsGenerating(true);
    try {
      const rawFiles = images.map((item) => item.file);
      const pdfBlob = await imagesToPdf(rawFiles, {
        pageSize,
        orientation,
        marginPt: margin,
        fitMode,
      });

      setResultPdfBlob(pdfBlob);
      showToast("PDF document generated successfully!", "success");
    } catch (err) {
      showToast("Failed to generate PDF: " + err.message, "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const confirmDownload = () => {
    if (!resultPdfBlob) return;
    const safeName = outputFilename.endsWith(".pdf")
      ? outputFilename
      : `${outputFilename}.pdf`;
    downloadBlob(resultPdfBlob, safeName);
    showToast(`Downloaded ${safeName}`, "success");
  };

  return (
    <ToolLayout
      title="Images to PDF Converter"
      description="Convert multiple JPG, PNG, and WebP images into a single professional PDF document. Reorder pages and customize layout."
      onBack={onBack}
    >
      <div className="space-y-8">
        {/* Page Setup Configuration */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#E5DCB8] shadow-sm space-y-6">
          <div className="flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-[#FF4E02]" />
            <h3 className="font-black text-[#1400C3] text-lg">
              PDF Page &amp; Layout Settings
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Page Size */}
            <div>
              <label className="block text-xs font-black text-[#3B3355] mb-1.5">
                Page Size
              </label>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value)}
                className="w-full bg-[#F8F2D8]/60 border-2 border-[#E5DCB8] rounded-xl px-3.5 py-2.5 text-sm text-[#1400C3] font-bold focus:outline-none focus:border-[#1400C3]"
              >
                <option value="A4">A4 (Standard 210 x 297 mm)</option>
                <option value="LETTER">US Letter (8.5 x 11 in)</option>
                <option value="FIT">Fit to Original Image Size</option>
              </select>
            </div>

            {/* Orientation */}
            <div>
              <label className="block text-xs font-black text-[#3B3355] mb-1.5">
                Orientation
              </label>
              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value)}
                disabled={pageSize === "FIT"}
                className="w-full bg-[#F8F2D8]/60 border-2 border-[#E5DCB8] rounded-xl px-3.5 py-2.5 text-sm text-[#1400C3] font-bold focus:outline-none focus:border-[#1400C3] disabled:opacity-50"
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
                <option value="auto">Auto (Match each image)</option>
              </select>
            </div>

            {/* Margins */}
            <div>
              <label className="block text-xs font-black text-[#3B3355] mb-1.5">
                Page Margins
              </label>
              <select
                value={margin}
                onChange={(e) => setMargin(Number(e.target.value))}
                className="w-full bg-[#F8F2D8]/60 border-2 border-[#E5DCB8] rounded-xl px-3.5 py-2.5 text-sm text-[#1400C3] font-bold focus:outline-none focus:border-[#1400C3]"
              >
                <option value={0}>No Margin (Edge-to-edge)</option>
                <option value={20}>Small Margin (20 pt)</option>
                <option value={36}>Normal Margin (36 pt)</option>
              </select>
            </div>

            {/* Fit mode */}
            <div>
              <label className="block text-xs font-black text-[#3B3355] mb-1.5">
                Image Placement
              </label>
              <select
                value={fitMode}
                onChange={(e) => setFitMode(e.target.value)}
                className="w-full bg-[#F8F2D8]/60 border-2 border-[#E5DCB8] rounded-xl px-3.5 py-2.5 text-sm text-[#1400C3] font-bold focus:outline-none focus:border-[#1400C3]"
              >
                <option value="contain">Fit on Page (No crop)</option>
                <option value="cover">Fill Page (Crop if needed)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-[#3B3355] mb-1.5">
              Output PDF Filename
            </label>
            <input
              type="text"
              value={outputFilename}
              onChange={(e) => setOutputFilename(e.target.value)}
              className="w-full max-w-md bg-[#F8F2D8]/60 border-2 border-[#E5DCB8] rounded-xl px-3.5 py-2.5 text-sm text-[#1400C3] font-bold focus:outline-none focus:border-[#1400C3]"
              placeholder="docupix_converted.pdf"
            />
          </div>
        </div>

        {/* Upload Zone */}
        <Dropzone
          onFilesSelected={handleImagesAdded}
          accept="image/*"
          multiple={true}
          title="Upload or Drag Images to Convert"
          subtitle="Add as many images as you need &bull; You can arrange order below"
        />

        {/* Reordering Gallery */}
        {images.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-5 rounded-2xl bg-white border border-[#E5DCB8] shadow-sm">
              <div className="flex items-center gap-2">
                <span className="font-black text-[#1400C3] text-base">
                  {images.length} Page{images.length > 1 ? "s" : ""} in PDF
                </span>
                <span className="text-xs text-[#6B627F] font-semibold">
                  Use arrows to reorder pages
                </span>
              </div>

              <Button
                onClick={handleGeneratePdf}
                loading={isGenerating}
                variant="orange"
                size="md"
                icon={Sparkles}
              >
                Generate PDF
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {images.map((img, idx) => (
                <div
                  key={img.id}
                  className="relative group rounded-2xl bg-white border-2 border-[#E5DCB8] hover:border-[#1400C3] overflow-hidden p-2.5 flex flex-col justify-between shadow-sm transition-all"
                >
                  <div className="relative aspect-[3/4] bg-[#F8F2D8] rounded-xl overflow-hidden flex items-center justify-center mb-2">
                    <img
                      src={img.preview}
                      alt={`Page ${idx + 1}`}
                      className="max-h-full max-w-full object-contain"
                    />
                    <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-lg bg-[#1400C3] text-white text-[11px] font-black">
                      #{idx + 1}
                    </span>
                  </div>

                  <p className="text-[11px] font-bold text-[#1400C3] truncate mb-2">
                    {img.name}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-[#E5DCB8] text-[#1400C3]">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveUp(idx)}
                        disabled={idx === 0}
                        className="p-1 rounded hover:bg-[#F8F2D8] disabled:opacity-20 cursor-pointer"
                        title="Move Earlier"
                      >
                        <ArrowUp className="w-4 h-4 stroke-[2.2]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveDown(idx)}
                        disabled={idx === images.length - 1}
                        className="p-1 rounded hover:bg-[#F8F2D8] disabled:opacity-20 cursor-pointer"
                        title="Move Later"
                      >
                        <ArrowDown className="w-4 h-4 stroke-[2.2]" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      className="p-1 text-[#6B627F] hover:text-rose-600 cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Success & Ready to Download Card */}
        {resultPdfBlob && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#FF4E02] flex flex-col sm:flex-row items-center justify-between gap-4 animate-slide-up shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FF4E02]/15 text-[#FF4E02] flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="font-black text-[#1400C3] text-lg">
                  PDF Generated Successfully!
                </h4>
                <p className="text-xs text-[#3B3355] font-semibold">
                  {images.length} pages &bull; {formatBytes(resultPdfBlob.size)}
                </p>
              </div>
            </div>

            <Button
              onClick={() => setShowAdModal(true)}
              variant="orange"
              size="lg"
              icon={Download}
            >
              Download PDF Document
            </Button>
          </div>
        )}
      </div>

      {/* Ad Download Modal */}
      <DownloadAdModal
        isOpen={showAdModal}
        onClose={() => setShowAdModal(false)}
        onConfirmDownload={confirmDownload}
        fileName={outputFilename}
        fileSizeText={formatBytes(resultPdfBlob?.size)}
      />
    </ToolLayout>
  );
}

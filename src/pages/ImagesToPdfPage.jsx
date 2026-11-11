import React, { useState } from "react";
import {
  FileText,
  Download,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Settings,
  Plus,
} from "lucide-react";
import ToolLayout from "../components/layout/ToolLayout";
import Dropzone from "../components/common/Dropzone";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import DownloadAdModal from "../components/ads/DownloadAdModal";
import { imagesToPdf } from "../services/pdfService";
import { formatBytes } from "../utils/fileHelpers";
import { downloadBlob } from "../utils/downloadHelpers";
import { useToast } from "../context/ToastContext";

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

  const handleImagesAdded = (files) => {
    const valid = files.filter((f) => f.type.startsWith("image/"));
    if (valid.length === 0) {
      showToast("Please upload image files (JPG, PNG, WebP).", "error");
      return;
    }

    const newEntries = valid.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    }));

    setImages((prev) => [...prev, ...newEntries]);
    setResultPdfBlob(null);
    showToast(`Added ${valid.length} image(s).`, "success");
  };

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
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
      badgeText="High Quality"
      badgeColor="indigo"
      onBack={onBack}
    >
      <div className="space-y-8">
        {/* Page Setup Configuration */}
        <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-6">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-base">
              PDF Page & Layout Settings
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Page Size */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Page Size
              </label>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="A4">A4 (Standard 210 x 297 mm)</option>
                <option value="LETTER">US Letter (8.5 x 11 in)</option>
                <option value="FIT">Fit to Original Image Size</option>
              </select>
            </div>

            {/* Orientation */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Orientation
              </label>
              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value)}
                disabled={pageSize === "FIT"}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 disabled:opacity-50"
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
                <option value="auto">Auto (Match each image)</option>
              </select>
            </div>

            {/* Margins */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Page Margins
              </label>
              <select
                value={margin}
                onChange={(e) => setMargin(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value={0}>No Margin (Edge-to-edge)</option>
                <option value={20}>Small Margin (20 pt)</option>
                <option value={36}>Normal Margin (36 pt)</option>
              </select>
            </div>

            {/* Fit mode */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Image Placement
              </label>
              <select
                value={fitMode}
                onChange={(e) => setFitMode(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="contain">Fit on Page (No crop)</option>
                <option value="cover">Fill Page (Crop if needed)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Output PDF Filename
            </label>
            <input
              type="text"
              value={outputFilename}
              onChange={(e) => setOutputFilename(e.target.value)}
              className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
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
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">
                  {images.length} Page{images.length > 1 ? "s" : ""} in PDF
                </span>
                <span className="text-xs text-slate-400">
                  Use arrows to reorder pages
                </span>
              </div>

              <Button
                onClick={handleGeneratePdf}
                loading={isGenerating}
                variant="primary"
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
                  className="relative group rounded-xl bg-slate-900 border border-slate-800 overflow-hidden p-2 flex flex-col justify-between"
                >
                  <div className="relative aspect-[3/4] bg-slate-950 rounded-lg overflow-hidden flex items-center justify-center mb-2">
                    <img
                      src={img.preview}
                      alt={`Page ${idx + 1}`}
                      className="max-h-full max-w-full object-contain"
                    />
                    <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white text-[11px] font-bold">
                      #{idx + 1}
                    </span>
                  </div>

                  <p className="text-[11px] font-medium text-slate-300 truncate mb-2">
                    {img.name}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-slate-400">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveUp(idx)}
                        disabled={idx === 0}
                        className="p-1 rounded hover:bg-slate-800 disabled:opacity-20"
                        title="Move Earlier"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveDown(idx)}
                        disabled={idx === images.length - 1}
                        className="p-1 rounded hover:bg-slate-800 disabled:opacity-20"
                        title="Move Later"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      className="p-1 text-slate-500 hover:text-rose-400"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Success & Ready to Download Card */}
        {resultPdfBlob && (
          <div className="p-6 rounded-2xl bg-indigo-950/30 border border-indigo-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 animate-slide-up">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">
                  PDF Generated Successfully!
                </h4>
                <p className="text-xs text-slate-300">
                  {images.length} pages &bull; {formatBytes(resultPdfBlob.size)}
                </p>
              </div>
            </div>

            <Button
              onClick={() => setShowAdModal(true)}
              variant="primary"
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

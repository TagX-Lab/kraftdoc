import React, { useState } from "react";
import {
  Download,
  CheckSquare,
  Square,
  Undo2,
  FileText,
  Sliders,
  Sparkles,
  Archive,
} from "lucide-react";
import ToolLayout from "../components/layout/ToolLayout";
import Dropzone from "../components/common/Dropzone";
import Button from "../components/common/Button";
import DownloadAdModal from "../components/ads/DownloadAdModal";
import {
  convertPdfPagesToImages,
  packageImagesAsZip,
} from "../services/pdfService";
import {
  formatBytes,
  readFileAsArrayBuffer,
  validateFileSize,
} from "../utils/fileHelpers";
import { downloadBlob } from "../utils/downloadHelpers";
import { useToast } from "../hooks/useToast";

export default function PdfToImagesPage({ onBack }) {
  const { showToast } = useToast();

  const [pdfFile, setPdfFile] = useState(null);
  const [renderedPages, setRenderedPages] = useState([]); // [{ pageNumber, blob, dataUrl, width, height }]
  const [selectedPages, setSelectedPages] = useState(new Set()); // Set of page numbers

  // Configuration settings
  const [format, setFormat] = useState("image/png"); // 'image/png' | 'image/jpeg'
  const [scale, setScale] = useState(2.0); // 1.5, 2.0, 1.0
  const [jpegQuality, setJpegQuality] = useState(90);

  // Status & Progress
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  // Ad modal
  const [showAdModal, setShowAdModal] = useState(false);
  const [pendingZipBlob, setPendingZipBlob] = useState(null);
  const [pendingZipName, setPendingZipName] = useState("");

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

    setPdfFile(file);
    setRenderedPages([]);
    setSelectedPages(new Set());
    startConversion(file, format, scale, jpegQuality);
  };

  const startConversion = async (file, imgFormat, imgScale, quality) => {
    setIsConverting(true);
    setProgress({ current: 0, total: 0 });

    try {
      const buffer = await readFileAsArrayBuffer(file);
      const pages = await convertPdfPagesToImages(buffer, {
        format: imgFormat,
        scale: Number(imgScale),
        quality: Number(quality) / 100,
        onProgress: (current, total) => {
          setProgress({ current, total });
        },
      });

      setRenderedPages(pages);
      // Select all pages by default
      const allNumbers = new Set(pages.map((p) => p.pageNumber));
      setSelectedPages(allNumbers);
      showToast(`Successfully extracted ${pages.length} pages!`, "success");
    } catch {
      showToast("Failed to render PDF. Please verify file is not corrupted.", "error");
    } finally {
      setIsConverting(false);
    }
  };

  const togglePageSelection = (pageNum) => {
    setSelectedPages((prev) => {
      const updated = new Set(prev);
      if (updated.has(pageNum)) {
        updated.delete(pageNum);
      } else {
        updated.add(pageNum);
      }
      return updated;
    });
  };

  const selectAll = () => {
    const all = new Set(renderedPages.map((p) => p.pageNumber));
    setSelectedPages(all);
  };

  const deselectAll = () => {
    setSelectedPages(new Set());
  };

  const downloadSinglePage = (page) => {
    const ext = format === "image/png" ? "png" : "jpg";
    const base = pdfFile.name.replace(/\.[^/.]+$/, "");
    downloadBlob(page.blob, `${base}_page_${page.pageNumber}.${ext}`);
    showToast(`Downloaded Page ${page.pageNumber}!`, "success");
  };

  const prepareZipDownload = async (pagesToDownload) => {
    if (!pagesToDownload || pagesToDownload.length === 0) {
      showToast("Please select at least 1 page to download.", "error");
      return;
    }

    try {
      showToast("Packaging ZIP archive...", "info");
      const ext = format === "image/png" ? "png" : "jpg";
      const base = pdfFile.name.replace(/\.[^/.]+$/, "");
      const zipBlob = await packageImagesAsZip(pagesToDownload, base, ext);

      setPendingZipBlob(zipBlob);
      setPendingZipName(`${base}_images.zip`);
      setShowAdModal(true);
    } catch {
      showToast("Failed to create ZIP package.", "error");
    }
  };

  const executeZipDownload = () => {
    if (pendingZipBlob && pendingZipName) {
      downloadBlob(pendingZipBlob, pendingZipName);
      showToast("ZIP download started!", "success");
      setPendingZipBlob(null);
    }
  };

  const reRenderWithOptions = (newFormat, newScale, newQuality) => {
    if (!pdfFile) return;
    startConversion(pdfFile, newFormat, newScale, newQuality);
  };

  return (
    <ToolLayout
      title="Convert PDF to Images"
      description="Convert every PDF page into crystal-clear PNG or high-quality JPG images directly in your browser. Download individually or as a single ZIP."
      onBack={onBack}
    >
      <div className="space-y-6">
        {!pdfFile ? (
          <Dropzone
            accept={{ "application/pdf": [".pdf"] }}
            multiple={false}
            onFilesSelected={handlePdfLoaded}
            title="Drop your PDF here to convert to images"
            subtitle="Extract high-res PNG or JPG pages instantly in your browser (Max 50MB)"
          />
        ) : (
          <div className="space-y-6">
            {/* Document Header Plaque */}
            <div className="p-4 rounded-2xl bg-white border-2 border-[#1400C3]/20 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFF0D9] border border-[#F7D8A8] text-[#FF4E02] flex items-center justify-center">
                  <FileText className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#1400C3] truncate max-w-xs sm:max-w-md">
                    {pdfFile.name}
                  </h4>
                  <p className="text-xs text-[#6B627F] font-semibold">
                    {formatBytes(pdfFile.size)} &bull; {renderedPages.length} pages rendered
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPdfFile(null);
                  setRenderedPages([]);
                  setSelectedPages(new Set());
                }}
              >
                <Undo2 className="w-3.5 h-3.5 mr-1" />
                Upload Different PDF
              </Button>
            </div>

            {/* Conversion Settings Toolbar */}
            <div className="p-5 rounded-3xl bg-white border-2 border-[#E5DCB8] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#1400C3] font-bold text-sm uppercase tracking-wider">
                  <Sliders className="w-4 h-4 text-[#FF4E02]" />
                  <span>Output Options</span>
                </div>
                {isConverting && (
                  <span className="text-xs font-bold text-[#FF4E02] flex items-center gap-1.5 animate-pulse">
                    <Sparkles className="w-3.5 h-3.5" />
                    Rendering page {progress.current} of {progress.total}...
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Format Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-[#1400C3] block">
                    Image Format
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      disabled={isConverting}
                      onClick={() => {
                        setFormat("image/png");
                        reRenderWithOptions("image/png", scale, jpegQuality);
                      }}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        format === "image/png"
                          ? "bg-[#1400C3] text-white border-[#1400C3] shadow-xs"
                          : "bg-white text-[#3B3355] border-[#E5DCB8] hover:border-[#1400C3]"
                      }`}
                    >
                      PNG (Lossless)
                    </button>
                    <button
                      type="button"
                      disabled={isConverting}
                      onClick={() => {
                        setFormat("image/jpeg");
                        reRenderWithOptions("image/jpeg", scale, jpegQuality);
                      }}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        format === "image/jpeg"
                          ? "bg-[#FF4E02] text-white border-[#FF4E02] shadow-xs"
                          : "bg-white text-[#3B3355] border-[#E5DCB8] hover:border-[#1400C3]"
                      }`}
                    >
                      JPG (Compact)
                    </button>
                  </div>
                </div>

                {/* Resolution Scale */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-[#1400C3] block">
                    Resolution / DPI
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { label: "1x (Web)", value: 1.0 },
                      { label: "1.5x (HD)", value: 1.5 },
                      { label: "2x (Ultra)", value: 2.0 },
                    ].map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        disabled={isConverting}
                        onClick={() => {
                          setScale(item.value);
                          reRenderWithOptions(format, item.value, jpegQuality);
                        }}
                        className={`py-2 px-2 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                          scale === item.value
                            ? "bg-[#1400C3] text-white border-[#1400C3] shadow-xs"
                            : "bg-white text-[#3B3355] border-[#E5DCB8] hover:border-[#1400C3]"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* JPG Quality (Only if JPEG) */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-[#1400C3]">
                      {format === "image/jpeg" ? "JPG Quality" : "Crisp Rendering"}
                    </span>
                    <span className="text-[#FF4E02]">
                      {format === "image/jpeg" ? `${jpegQuality}%` : "100% Crisp"}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    step="5"
                    disabled={isConverting || format !== "image/jpeg"}
                    value={jpegQuality}
                    onChange={(e) => {
                      setJpegQuality(e.target.value);
                    }}
                    onMouseUp={() => {
                      if (format === "image/jpeg") {
                        reRenderWithOptions(format, scale, jpegQuality);
                      }
                    }}
                    className={`w-full accent-[#FF4E02] ${
                      format === "image/jpeg" ? "cursor-pointer" : "opacity-40"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Converting Progress Bar */}
            {isConverting && (
              <div className="p-4 rounded-2xl bg-white border-2 border-[#1400C3] space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#1400C3]">
                    Extracting Page {progress.current} of {progress.total}
                  </span>
                  <span className="text-[#FF4E02]">
                    {progress.total > 0
                      ? Math.round((progress.current / progress.total) * 100)
                      : 0}
                    %
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-[#F8F2D8] overflow-hidden border border-[#E5DCB8]">
                  <div
                    className="h-full bg-linear-to-r from-[#1400C3] to-[#FF4E02] transition-all duration-300 rounded-full"
                    style={{
                      width: `${
                        progress.total > 0
                          ? (progress.current / progress.total) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Gallery Toolbar: Selection & Download Buttons */}
            {renderedPages.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#F8F2D8] border border-[#E5DCB8]">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={selectAll}
                    className="text-xs font-bold text-[#1400C3] hover:text-[#FF4E02] flex items-center gap-1 cursor-pointer"
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>Select All</span>
                  </button>
                  <span className="text-black/20">|</span>
                  <button
                    type="button"
                    onClick={deselectAll}
                    className="text-xs font-bold text-[#6B627F] hover:text-[#1400C3] flex items-center gap-1 cursor-pointer"
                  >
                    <Square className="w-3.5 h-3.5" />
                    <span>Deselect All</span>
                  </button>
                  <span className="text-xs font-bold text-[#FF4E02] ml-2">
                    ({selectedPages.size} of {renderedPages.length} selected)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      const selected = renderedPages.filter((p) =>
                        selectedPages.has(p.pageNumber)
                      );
                      prepareZipDownload(selected);
                    }}
                    disabled={selectedPages.size === 0}
                  >
                    <Archive className="w-3.5 h-3.5 mr-1.5" />
                    <span>Download Selected (ZIP)</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => prepareZipDownload(renderedPages)}
                  >
                    <Download className="w-3.5 h-3.5 mr-1.5" />
                    <span>Download All (ZIP)</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Rendered Page Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {renderedPages.map((page) => {
                const isSelected = selectedPages.has(page.pageNumber);
                return (
                  <div
                    key={page.pageNumber}
                    className={`rounded-2xl border-2 transition-all p-3 flex flex-col justify-between shadow-xs hover:shadow-md bg-white ${
                      isSelected
                        ? "border-[#1400C3] ring-2 ring-[#1400C3]/20"
                        : "border-[#E5DCB8] opacity-75"
                    }`}
                  >
                    <div>
                      {/* Top Header of Card */}
                      <div className="flex items-center justify-between mb-2">
                        <button
                          type="button"
                          onClick={() => togglePageSelection(page.pageNumber)}
                          className="flex items-center gap-1.5 text-xs font-bold text-[#1400C3] cursor-pointer"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-[#1400C3]" />
                          ) : (
                            <Square className="w-4 h-4 text-[#6B627F]" />
                          )}
                          <span>Page {page.pageNumber}</span>
                        </button>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#F8F2D8] text-[#6B627F]">
                          {page.width} &times; {page.height}
                        </span>
                      </div>

                      {/* Image Thumbnail Preview */}
                      <div
                        onClick={() => togglePageSelection(page.pageNumber)}
                        className="rounded-xl overflow-hidden border border-black/5 bg-[#F8F2D8]/50 flex items-center justify-center p-1.5 cursor-pointer hover:opacity-95 transition-opacity aspect-3/4"
                      >
                        <img
                          src={page.dataUrl}
                          alt={`Page ${page.pageNumber}`}
                          className="w-full h-full object-contain drop-shadow-xs"
                        />
                      </div>
                    </div>

                    {/* Single Image Download Button */}
                    <div className="mt-3 pt-2 border-t border-black/5 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#6B627F]">
                        {format === "image/png" ? "PNG" : "JPG"}
                      </span>
                      <button
                        type="button"
                        onClick={() => downloadSinglePage(page)}
                        className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#1400C3] hover:bg-[#FF4E02] text-white flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <DownloadAdModal
        isOpen={showAdModal}
        onClose={() => setShowAdModal(false)}
        onDownloadReady={executeZipDownload}
      />
    </ToolLayout>
  );
}

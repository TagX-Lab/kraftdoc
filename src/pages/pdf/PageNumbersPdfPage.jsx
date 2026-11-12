import React, { useState } from "react";
import {
  FileText,
  Download,
  Undo2,
  Sliders,
  Hash,
} from "lucide-react";
import ToolLayout from "../../components/layout/ToolLayout";
import Dropzone from "../../components/common/Dropzone";
import Button from "../../components/common/Button";
import DownloadAdModal from "../../components/ads/DownloadAdModal";
import { getPdfPageCount, addPageNumbersToPdf } from "../../services/pdfService";
import { formatBytes, readFileAsArrayBuffer, validateFileSize } from "../../utils/fileHelpers";
import { downloadBlob } from "../../utils/downloadHelpers";
import { useToast } from "../../hooks/useToast";

export default function PageNumbersPdfPage({ onBack }) {
  const { showToast } = useToast();

  const [pdfData, setPdfData] = useState(null); // { file, buffer, pageCount }
  const [format, setFormat] = useState("Page {n} of {total}");
  const [position, setPosition] = useState("bottom-center");
  const [fontSize, setFontSize] = useState(10);
  const [startNumber, setStartNumber] = useState(1);
  const [marginPt, setMarginPt] = useState(25);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState(null);

  const [showAdModal, setShowAdModal] = useState(false);

  const formatOptions = [
    { label: "Page 1 of 10", value: "Page {n} of {total}" },
    { label: "1 / 10", value: "{n} / {total}" },
    { label: "Page 1", value: "Page {n}" },
    { label: "1 (Only Number)", value: "{n}" },
  ];

  const positionOptions = [
    { label: "Bottom Center", value: "bottom-center" },
    { label: "Bottom Right", value: "bottom-right" },
    { label: "Bottom Left", value: "bottom-left" },
    { label: "Top Center", value: "top-center" },
    { label: "Top Right", value: "top-right" },
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

  const handleApplyNumbers = async () => {
    if (!pdfData) return;

    setIsProcessing(true);
    try {
      const blob = await addPageNumbersToPdf(pdfData.buffer, {
        format,
        position,
        fontSize: Number(fontSize),
        marginPt: Number(marginPt),
        startNumber: Number(startNumber) || 1,
      });

      setResultBlob(blob);
      showToast("Page numbers stamped successfully across all pages!", "success");
    } catch {
      showToast("Failed to stamp page numbers. Please try again.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const executeDownload = () => {
    if (!resultBlob || !pdfData) return;
    const base = pdfData.file.name.replace(/\.[^/.]+$/, "");
    downloadBlob(resultBlob, `${base}_numbered.pdf`);
    showToast("Downloaded numbered PDF!", "success");
  };

  const handleDownloadClick = () => {
    setShowAdModal(true);
  };

  return (
    <ToolLayout
      title="Add PDF Page Numbers"
      description="Insert custom page numbers (Page 1 of N, bottom/top placement) across your PDF pages directly in your browser."
      onBack={onBack}
    >
      <div className="space-y-6">
        {!pdfData ? (
          <Dropzone
            accept={{ "application/pdf": [".pdf"] }}
            multiple={false}
            onFilesSelected={handlePdfLoaded}
            title="Drop your PDF here"
            subtitle="Add clean page numbers across all pages in 1-click (Max 50MB)"
          />
        ) : (
          <div className="space-y-6">
            {/* Loaded Document Info */}
            <div className="p-4 rounded-2xl bg-white border-2 border-[#1400C3]/20 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EBF7ED] border border-[#C2E7C9] text-[#1400C3] flex items-center justify-center">
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

            {/* Customization Options */}
            <div className="p-6 rounded-3xl bg-white border-2 border-[#E5DCB8] shadow-sm space-y-5">
              <div className="flex items-center gap-2 text-[#1400C3] font-bold text-sm uppercase tracking-wider">
                <Sliders className="w-4 h-4 text-[#FF4E02]" />
                <span>Page Numbering Settings</span>
              </div>

              {/* Numbering Format */}
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-wider text-[#1400C3]">
                  Numbering Format
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {formatOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setFormat(opt.value);
                        setResultBlob(null);
                      }}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                        format === opt.value
                          ? "border-[#1400C3] bg-[#F8F2D8] text-[#1400C3] shadow-xs"
                          : "border-[#E5DCB8] bg-white text-[#3B3355] hover:border-[#1400C3]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Position */}
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-wider text-[#1400C3]">
                  Position on Page
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {positionOptions.map((pos) => (
                    <button
                      key={pos.value}
                      type="button"
                      onClick={() => {
                        setPosition(pos.value);
                        setResultBlob(null);
                      }}
                      className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        position === pos.value
                          ? "border-[#1400C3] bg-[#1400C3] text-white shadow-xs"
                          : "border-[#E5DCB8] bg-white text-[#3B3355] hover:border-[#1400C3]"
                      }`}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Options: Font Size, Margin, Starting Number */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {/* Starting Number */}
                <div className="space-y-1.5 p-3 rounded-2xl bg-[#F8F2D8]/50 border border-[#E5DCB8]">
                  <label className="text-xs font-bold text-[#1400C3] block">
                    Start Numbering At
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={startNumber}
                    onChange={(e) => {
                      setStartNumber(Math.max(1, parseInt(e.target.value, 10) || 1));
                      setResultBlob(null);
                    }}
                    className="w-full px-3 py-1.5 rounded-lg border border-[#E5DCB8] font-bold text-xs text-[#1400C3]"
                  />
                </div>

                {/* Font Size */}
                <div className="space-y-1.5 p-3 rounded-2xl bg-[#F8F2D8]/50 border border-[#E5DCB8]">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-[#1400C3]">Font Size</span>
                    <span className="text-[#FF4E02]">{fontSize} pt</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="18"
                    step="1"
                    value={fontSize}
                    onChange={(e) => {
                      setFontSize(e.target.value);
                      setResultBlob(null);
                    }}
                    className="w-full accent-[#FF4E02] cursor-pointer"
                  />
                </div>

                {/* Margin */}
                <div className="space-y-1.5 p-3 rounded-2xl bg-[#F8F2D8]/50 border border-[#E5DCB8]">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-[#1400C3]">Margin from Edge</span>
                    <span className="text-[#FF4E02]">{marginPt} pt</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="50"
                    step="5"
                    value={marginPt}
                    onChange={(e) => {
                      setMarginPt(e.target.value);
                      setResultBlob(null);
                    }}
                    className="w-full accent-[#FF4E02] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#EBF7ED] border-2 border-[#C2E7C9]">
              <div>
                <h5 className="font-black text-sm text-[#1400C3]">
                  Ready to Stamp Page Numbers
                </h5>
                <p className="text-xs text-[#6B627F] font-semibold">
                  Will number all {pdfData.pageCount} pages using local device RAM.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {!resultBlob ? (
                  <Button
                    variant="primary"
                    onClick={handleApplyNumbers}
                    isLoading={isProcessing}
                  >
                    <Hash className="w-4 h-4 mr-2" />
                    <span>Stamp Numbers</span>
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={handleDownloadClick}
                    className="bg-[#10B981] hover:bg-[#059669] text-white shadow-lg"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    <span>Download Numbered PDF</span>
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

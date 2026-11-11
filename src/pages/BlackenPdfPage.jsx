import React, { useState, useRef, useEffect } from "react";
import {
  Square,
  Download,
  Undo2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import ToolLayout from "../components/layout/ToolLayout";
import Dropzone from "../components/common/Dropzone";
import Button from "../components/common/Button";
import DownloadAdModal from "../components/ads/DownloadAdModal";
import {
  getPdfPageCount,
  redactPdf,
} from "../services/pdfService";
import {
  formatBytes,
  readFileAsArrayBuffer,
  validateFileSize,
} from "../utils/fileHelpers";
import { downloadBlob } from "../utils/downloadHelpers";
import { useToast } from "../hooks/useToast";
import * as pdfjsLib from "pdfjs-dist";

export default function BlackenPdfPage({ onBack }) {
  const { showToast } = useToast();

  const [pdfData, setPdfData] = useState(null); // { file, buffer, pageCount }
  const [currentPage, setCurrentPage] = useState(1);
  const [isRenderingPage, setIsRenderingPage] = useState(false);

  // Redaction boxes: array of { pageIndex, xPercent, yPercent, widthPercent, heightPercent }
  const [redactions, setRedactions] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState(null);
  const [currentBox, setCurrentBox] = useState(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState(null);
  const [showAdModal, setShowAdModal] = useState(false);

  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    let isCancelled = false;
    const renderPage = async () => {
      if (!pdfData?.buffer) return;
      setIsRenderingPage(true);
      try {
        const loadingTask = pdfjsLib.getDocument({
          data: new Uint8Array(pdfData.buffer),
          useSystemFonts: true,
        });
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(currentPage);

        const canvas = canvasRef.current;
        if (!canvas || isCancelled) return;

        const viewport = page.getViewport({ scale: 1.5 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        await page.render({
          canvasContext: ctx,
          viewport,
        }).promise;
      } catch {
        showToast("Error rendering page preview.", "error");
      } finally {
        if (!isCancelled) setIsRenderingPage(false);
      }
    };

    renderPage();
    return () => {
      isCancelled = true;
    };
  }, [pdfData, currentPage, showToast]);

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
      setCurrentPage(1);
      setRedactions([]);
      setResultBlob(null);
      showToast(`Loaded "${file.name}" (${pageCount} pages).`, "success");
    } catch {
      showToast("Could not read PDF.", "error");
    }
  };

  // Mouse event handlers for drawing censor boxes
  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setIsDrawing(true);
    setStartPos({ x, y });
    setCurrentBox({ x, y, w: 0, h: 0 });
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || !startPos) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const currX = ((e.clientX - rect.left) / rect.width) * 100;
    const currY = ((e.clientY - rect.top) / rect.height) * 100;

    const minX = Math.max(0, Math.min(startPos.x, currX));
    const minY = Math.max(0, Math.min(startPos.y, currY));
    const width = Math.min(100 - minX, Math.abs(currX - startPos.x));
    const height = Math.min(100 - minY, Math.abs(currY - startPos.y));

    setCurrentBox({ x: minX, y: minY, w: width, h: height });
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (currentBox && currentBox.w > 1.5 && currentBox.h > 1.5) {
      setRedactions((prev) => [
        ...prev,
        {
          pageIndex: currentPage - 1,
          xPercent: currentBox.x,
          yPercent: currentBox.y,
          widthPercent: currentBox.w,
          heightPercent: currentBox.h,
        },
      ]);
      setResultBlob(null);
    }
    setStartPos(null);
    setCurrentBox(null);
  };

  const handleUndoRedaction = () => {
    setRedactions((prev) => prev.slice(0, -1));
    setResultBlob(null);
  };

  const handleClearPageRedactions = () => {
    setRedactions((prev) => prev.filter((r) => r.pageIndex !== currentPage - 1));
    setResultBlob(null);
  };

  const handleApplyRedactions = async () => {
    if (!pdfData) return;
    if (redactions.length === 0) {
      showToast("Draw at least one black box over sensitive data first.", "warning");
      return;
    }

    setIsProcessing(true);
    try {
      const blob = await redactPdf(pdfData.buffer, redactions);
      setResultBlob(blob);
      showToast("PDF blackened and redacted permanently!", "success");
    } catch (err) {
      showToast(err.message || "Failed to redact PDF.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob) return;
    const baseName = pdfData.file.name.replace(/\.[^/.]+$/, "");
    downloadBlob(resultBlob, `${baseName}_blackened.pdf`);
  };

  const pageRedactions = redactions.filter((r) => r.pageIndex === currentPage - 1);

  return (
    <ToolLayout
      title="Blacken & Redact PDF"
      description="Censor confidential data, bank numbers, names, or passwords with permanent black bars. Runs 100% in-browser."
      badge="PDF Redaction Tool"
      onBack={onBack}
    >
      <div className="space-y-8">
        {!pdfData ? (
          <div className="max-w-2xl mx-auto">
            <Dropzone
              accept={{ "application/pdf": [".pdf"] }}
              maxFiles={1}
              onFilesDrop={handlePdfLoaded}
              title="Drop PDF here to blacken sensitive text"
              subtitle="Draw black censor rectangles over confidential information"
              badgeText="100% In-Browser Privacy"
            />
          </div>
        ) : (
          <div className="space-y-8 max-w-5xl mx-auto">
            {/* Header info bar */}
            <div className="rounded-3xl bg-white border-2 border-[#1400C3]/15 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-[#FFEBE5] text-[#FF4E02] flex items-center justify-center shrink-0">
                  <Square className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-sm sm:text-base text-[#1400C3] truncate">
                    {pdfData.file.name}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#6B627F] mt-0.5">
                    <span>{pdfData.pageCount} pages</span>
                    <span>•</span>
                    <span>{redactions.length} black boxes total</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPdfData(null);
                    setResultBlob(null);
                    setRedactions([]);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#FF4E02] bg-[#FF4E02]/10 hover:bg-[#FF4E02]/20 transition-colors cursor-pointer"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                  <span>Change PDF</span>
                </button>
              </div>
            </div>

            {/* Pagination and Drawing Controls Bar */}
            <div className="rounded-3xl bg-white border-2 border-[#1400C3]/15 p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
              {/* Pagination */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="w-9 h-9 rounded-xl border border-[#E5DCB8] flex items-center justify-center text-[#1400C3] hover:bg-[#F8F2D8] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-[#1400C3] px-2">
                  Page {currentPage} of {pdfData.pageCount}
                </span>
                <button
                  type="button"
                  disabled={currentPage >= pdfData.pageCount}
                  onClick={() => setCurrentPage((p) => Math.min(pdfData.pageCount, p + 1))}
                  className="w-9 h-9 rounded-xl border border-[#E5DCB8] flex items-center justify-center text-[#1400C3] hover:bg-[#F8F2D8] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Drawing instructions and actions */}
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-block text-xs font-medium text-[#6B627F]">
                  Click and drag on the page to draw black boxes
                </span>

                <button
                  type="button"
                  disabled={redactions.length === 0}
                  onClick={handleUndoRedaction}
                  className="px-3 py-1.5 rounded-xl border border-[#E5DCB8] text-xs font-bold text-[#1400C3] hover:bg-[#F8F2D8] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                  <span>Undo</span>
                </button>

                <button
                  type="button"
                  disabled={pageRedactions.length === 0}
                  onClick={handleClearPageRedactions}
                  className="px-3 py-1.5 rounded-xl border border-[#F8C8BD] text-xs font-bold text-[#FF4E02] hover:bg-[#FFEBE5] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Page</span>
                </button>
              </div>
            </div>

            {/* Interactive Preview Canvas Area */}
            <div className="flex justify-center">
              <div
                ref={containerRef}
                className="relative border-2 border-[#1400C3]/20 rounded-2xl shadow-xl overflow-hidden bg-white select-none max-w-full"
                style={{ cursor: "crosshair" }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              >
                {/* Background rendered PDF page */}
                <canvas ref={canvasRef} className="max-w-full h-auto block" />

                {/* Rendered Black Redaction Boxes for Current Page */}
                {pageRedactions.map((box, idx) => (
                  <div
                    key={idx}
                    className="absolute bg-black pointer-events-none transition-opacity"
                    style={{
                      left: `${box.xPercent}%`,
                      top: `${box.yPercent}%`,
                      width: `${box.widthPercent}%`,
                      height: `${box.heightPercent}%`,
                    }}
                  />
                ))}

                {/* Box being actively drawn */}
                {currentBox && isDrawing && (
                  <div
                    className="absolute bg-black/80 border-2 border-[#FF4E02] pointer-events-none"
                    style={{
                      left: `${currentBox.x}%`,
                      top: `${currentBox.y}%`,
                      width: `${currentBox.w}%`,
                      height: `${currentBox.h}%`,
                    }}
                  />
                )}

                {isRenderingPage && (
                  <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center">
                    <span className="text-xs font-bold text-[#1400C3]">Rendering page...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Bar */}
            <div className="rounded-3xl bg-white border-2 border-[#1400C3]/15 p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1400C3]">
                <ShieldAlert className="w-4 h-4 text-[#FF4E02]" />
                <span>
                  {redactions.length} redaction {redactions.length === 1 ? "box" : "boxes"} placed across pages.
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {!resultBlob ? (
                  <Button
                    onClick={handleApplyRedactions}
                    disabled={isProcessing || redactions.length === 0}
                    isLoading={isProcessing}
                    variant="primary"
                    className="w-full sm:w-auto"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    <span>Apply Blackout & Redact</span>
                  </Button>
                ) : (
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button
                      onClick={handleApplyRedactions}
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
                      <span>Download Redacted PDF</span>
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
                  Sensitive Data Redacted & Censors Burned In!
                </div>
                <p className="text-xs text-[#6B627F]">
                  Processed size: {formatBytes(resultBlob.size)} • Black boxes are permanently rasterized into document vectors.
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
          fileName={`${pdfData?.file?.name?.replace(/\.[^/.]+$/, "")}_blackened.pdf`}
          fileSize={resultBlob?.size}
        />
      )}
    </ToolLayout>
  );
}

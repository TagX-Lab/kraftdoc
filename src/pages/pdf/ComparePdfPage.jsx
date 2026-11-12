import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  CheckCircle2,
  AlertTriangle,
  Undo2,
} from "lucide-react";
import ToolLayout from "../../components/layout/ToolLayout";
import { getPdfPageCount } from "../../services/pdfService";
import { formatBytes, readFileAsArrayBuffer, validateFileSize } from "../../utils/fileHelpers";
import { useToast } from "../../hooks/useToast";
import * as pdfjsLib from "pdfjs-dist";

export default function ComparePdfPage({ onBack }) {
  const { showToast } = useToast();

  const [docA, setDocA] = useState(null); // { file, buffer, pageCount }
  const [docB, setDocB] = useState(null); // { file, buffer, pageCount }
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomScale, setZoomScale] = useState(1.2);
  const [isRendering, setIsRendering] = useState(false);

  const canvasRefA = useRef(null);
  const canvasRefB = useRef(null);

  const handleLoadDoc = async (file, setDoc) => {
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
      setDoc({ file, buffer, pageCount });
      showToast(`Loaded "${file.name}" (${pageCount} pages).`, "success");
    } catch {
      showToast("Could not read PDF.", "error");
    }
  };

  const renderSingleDocPage = useCallback(
    async (buffer, pageNum, canvasRef) => {
      if (!buffer || !canvasRef.current) return;
      try {
        const loadingTask = pdfjsLib.getDocument({
          data: new Uint8Array(buffer),
          useSystemFonts: true,
        });
        const pdf = await loadingTask.promise;
        if (pageNum > pdf.numPages) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
          canvas.width = 400;
          canvas.height = 300;
          ctx.fillStyle = "#f8f9fa";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.font = "14px sans-serif";
          ctx.fillStyle = "#888888";
          ctx.textAlign = "center";
          ctx.fillText(`(Page ${pageNum} does not exist in this document)`, 200, 150);
          return;
        }

        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: zoomScale });
        const canvas = canvasRef.current;
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        await page.render({
          canvasContext: ctx,
          viewport,
        }).promise;
      } catch (e) {
        console.error("Render comparison error:", e);
      }
    },
    [zoomScale]
  );

  useEffect(() => {
    let isCancelled = false;
    const renderBoth = async () => {
      if (!docA && !docB) return;
      setIsRendering(true);
      if (docA && !isCancelled) {
        await renderSingleDocPage(docA.buffer, currentPage, canvasRefA);
      }
      if (docB && !isCancelled) {
        await renderSingleDocPage(docB.buffer, currentPage, canvasRefB);
      }
      if (!isCancelled) setIsRendering(false);
    };

    renderBoth();
    return () => {
      isCancelled = true;
    };
  }, [docA, docB, currentPage, zoomScale, renderSingleDocPage]);

  const maxPages = Math.max(docA?.pageCount || 1, docB?.pageCount || 1);

  return (
    <ToolLayout
      title="Compare PDFs Side-by-Side"
      description="Compare two versions of an agreement, contract, or design document side-by-side with synchronized page scrolling."
      badge="Visual Document Diff"
      onBack={onBack}
    >
      <div className="space-y-8">
        {/* Upload Slot Cards for Document A and Document B */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Document A Upload Slot */}
          <div className="rounded-3xl bg-white border-2 border-[#1400C3]/15 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#1400C3] text-white flex items-center justify-center font-black text-xs">
                  A
                </span>
                <h3 className="font-display text-sm uppercase text-[#1400C3]">
                  First Document (Original)
                </h3>
              </div>
              {docA && (
                <button
                  type="button"
                  onClick={() => setDocA(null)}
                  className="text-xs font-bold text-[#FF4E02] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                  <span>Change</span>
                </button>
              )}
            </div>

            {!docA ? (
              <label className="border-2 border-dashed border-[#1400C3]/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#F8F2D8]/50 transition-colors">
                <FileText className="w-8 h-8 text-[#1400C3] mb-2" />
                <span className="font-bold text-xs text-[#1400C3]">Select or Drop Document A</span>
                <span className="text-[11px] text-[#6B627F] mt-1">PDF up to 60MB</span>
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleLoadDoc(e.target.files[0], setDocA)}
                />
              </label>
            ) : (
              <div className="p-4 rounded-2xl bg-[#F8F2D8]/60 border border-[#E5DCB8] flex items-center justify-between">
                <div className="min-w-0">
                  <div className="font-bold text-xs text-[#1400C3] truncate">{docA.file.name}</div>
                  <div className="text-[11px] text-[#6B627F] font-semibold mt-0.5">
                    {docA.pageCount} pages • {formatBytes(docA.file.size)}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Document B Upload Slot */}
          <div className="rounded-3xl bg-white border-2 border-[#1400C3]/15 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#FF4E02] text-white flex items-center justify-center font-black text-xs">
                  B
                </span>
                <h3 className="font-display text-sm uppercase text-[#1400C3]">
                  Second Document (Revised)
                </h3>
              </div>
              {docB && (
                <button
                  type="button"
                  onClick={() => setDocB(null)}
                  className="text-xs font-bold text-[#FF4E02] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                  <span>Change</span>
                </button>
              )}
            </div>

            {!docB ? (
              <label className="border-2 border-dashed border-[#FF4E02]/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#FFEBE5]/50 transition-colors">
                <FileText className="w-8 h-8 text-[#FF4E02] mb-2" />
                <span className="font-bold text-xs text-[#FF4E02]">Select or Drop Document B</span>
                <span className="text-[11px] text-[#6B627F] mt-1">PDF up to 60MB</span>
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleLoadDoc(e.target.files[0], setDocB)}
                />
              </label>
            ) : (
              <div className="p-4 rounded-2xl bg-[#FFEBE5]/60 border border-[#F8C8BD] flex items-center justify-between">
                <div className="min-w-0">
                  <div className="font-bold text-xs text-[#1400C3] truncate">{docB.file.name}</div>
                  <div className="text-[11px] text-[#6B627F] font-semibold mt-0.5">
                    {docB.pageCount} pages • {formatBytes(docB.file.size)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Toolbar & Comparison Status */}
        {(docA || docB) && (
          <div className="rounded-3xl bg-white border-2 border-[#1400C3]/15 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
            {/* Page Navigator */}
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
                Page {currentPage} of {maxPages}
              </span>
              <button
                type="button"
                disabled={currentPage >= maxPages}
                onClick={() => setCurrentPage((p) => Math.min(maxPages, p + 1))}
                className="w-9 h-9 rounded-xl border border-[#E5DCB8] flex items-center justify-center text-[#1400C3] hover:bg-[#F8F2D8] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Match Indicator */}
            {docA && docB && (
              <div className="flex items-center gap-2 text-xs font-bold">
                {docA.pageCount === docB.pageCount ? (
                  <span className="flex items-center gap-1.5 text-emerald-700 bg-[#EBF7ED] px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Equal page counts ({docA.pageCount} pages)</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Page count mismatch ({docA.pageCount} vs {docB.pageCount})</span>
                  </span>
                )}
              </div>
            )}

            {/* Zoom Controls */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={zoomScale <= 0.8}
                onClick={() => setZoomScale((s) => Math.max(0.6, s - 0.2))}
                className="w-9 h-9 rounded-xl border border-[#E5DCB8] flex items-center justify-center text-[#1400C3] hover:bg-[#F8F2D8] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-[#1400C3] px-1 font-mono">
                {Math.round(zoomScale * 100)}%
              </span>
              <button
                type="button"
                disabled={zoomScale >= 2.2}
                onClick={() => setZoomScale((s) => Math.min(2.2, s + 0.2))}
                className="w-9 h-9 rounded-xl border border-[#E5DCB8] flex items-center justify-center text-[#1400C3] hover:bg-[#F8F2D8] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Dual Side-by-Side Canvas Viewers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Canvas A Container */}
          <div className="rounded-3xl bg-white border-2 border-[#1400C3]/15 p-4 shadow-sm flex flex-col items-center min-h-[400px] overflow-auto">
            <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-black/5 text-xs font-bold text-[#1400C3]">
              <span>Document A • Page {currentPage}</span>
              <span className="text-[11px] text-[#6B627F]">{docA?.file?.name || "No file"}</span>
            </div>
            {docA ? (
              <canvas ref={canvasRefA} className="max-w-full h-auto shadow-md border rounded-lg" />
            ) : (
              <div className="my-auto text-center py-12 text-[#6B627F] text-xs font-semibold">
                Drop Document A above to compare
              </div>
            )}
          </div>

          {/* Canvas B Container */}
          <div className="rounded-3xl bg-white border-2 border-[#FF4E02]/20 p-4 shadow-sm flex flex-col items-center min-h-[400px] overflow-auto">
            <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-black/5 text-xs font-bold text-[#FF4E02]">
              <span>Document B • Page {currentPage}</span>
              <span className="text-[11px] text-[#6B627F]">{docB?.file?.name || "No file"}</span>
            </div>
            {docB ? (
              <canvas ref={canvasRefB} className="max-w-full h-auto shadow-md border rounded-lg" />
            ) : (
              <div className="my-auto text-center py-12 text-[#6B627F] text-xs font-semibold">
                Drop Document B above to compare
              </div>
            )}
          </div>
        </div>

        {isRendering && (
          <div className="text-center text-xs font-bold text-[#1400C3] animate-pulse">
            Rendering pages side-by-side...
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

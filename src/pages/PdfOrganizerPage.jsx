import React, { useState } from "react";
import {
  RotateCw,
  Trash2,
  Download,
  Sparkles,
  RotateCcw,
  Undo2,
  FileText,
} from "lucide-react";
import ToolLayout from "../components/layout/ToolLayout";
import Dropzone from "../components/common/Dropzone";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import DownloadAdModal from "../components/ads/DownloadAdModal";
import { getPdfPageCount, organizePdfPages } from "../services/pdfService";
import { formatBytes, readFileAsArrayBuffer } from "../utils/fileHelpers";
import { downloadBlob } from "../utils/downloadHelpers";
import { useToast } from "../context/ToastContext";

export default function PdfOrganizerPage({ onBack }) {
  const { showToast } = useToast();

  const [pdfData, setPdfData] = useState(null); // { file, buffer, pageCount }
  const [rotations, setRotations] = useState({}); // { [pageIdx]: degrees }
  const [excludedPages, setExcludedPages] = useState(new Set()); // Set of excluded 0-based page indices
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState(null);

  // Ad modal
  const [showAdModal, setShowAdModal] = useState(false);

  const handlePdfLoaded = async (files) => {
    const file = files[0];
    if (!file || (!file.type.includes("pdf") && !file.name.endsWith(".pdf"))) {
      showToast("Please select a valid PDF file.", "error");
      return;
    }

    try {
      const buffer = await readFileAsArrayBuffer(file);
      const pageCount = await getPdfPageCount(buffer);
      setPdfData({ file, buffer, pageCount });
      setRotations({});
      setExcludedPages(new Set());
      setResultBlob(null);
      showToast(`Loaded "${file.name}" (${pageCount} pages).`, "success");
    } catch (err) {
      showToast("Could not read PDF. Make sure it isn't password protected.", "error");
    }
  };

  const rotatePage = (pageIdx) => {
    setRotations((prev) => {
      const current = prev[pageIdx] || 0;
      return { ...prev, [pageIdx]: (current + 90) % 360 };
    });
    setResultBlob(null);
  };

  const rotateAll = () => {
    if (!pdfData) return;
    setRotations((prev) => {
      const next = {};
      for (let i = 0; i < pdfData.pageCount; i++) {
        const current = prev[i] || 0;
        next[i] = (current + 90) % 360;
      }
      return next;
    });
    setResultBlob(null);
  };

  const toggleExcludePage = (pageIdx) => {
    setExcludedPages((prev) => {
      const next = new Set(prev);
      if (next.has(pageIdx)) {
        next.delete(pageIdx);
      } else {
        if (next.size >= (pdfData?.pageCount || 0) - 1) {
          showToast("At least 1 page must remain in the PDF.", "error");
          return prev;
        }
        next.add(pageIdx);
      }
      return next;
    });
    setResultBlob(null);
  };

  const handleOrganizePdf = async () => {
    if (!pdfData) return;

    setIsProcessing(true);
    try {
      const blob = await organizePdfPages(pdfData.buffer, rotations, excludedPages);
      setResultBlob(blob);
      showToast("Organized PDF created successfully!", "success");
    } catch (err) {
      showToast("Error organizing PDF: " + err.message, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmDownload = () => {
    if (!resultBlob) return;
    const baseName = pdfData?.file?.name?.replace(/\.[^/.]+$/, "") || "organized";
    const filename = `${baseName}_organized.pdf`;
    downloadBlob(resultBlob, filename);
    showToast(`Downloaded ${filename}`, "success");
  };

  const remainingPagesCount = (pdfData?.pageCount || 0) - excludedPages.size;

  return (
    <ToolLayout
      title="PDF Page Organizer & Rotator"
      description="Rotate upside-down pages, reorient scanned files, and remove unnecessary pages from your PDF."
      badgeText="Page Manager"
      badgeColor="rose"
      onBack={onBack}
    >
      <div className="space-y-8">
        {!pdfData ? (
          <Dropzone
            onFilesSelected={handlePdfLoaded}
            accept="application/pdf"
            multiple={false}
            title="Upload PDF to Organize & Rotate"
            subtitle="Click or drag and drop your PDF here"
          />
        ) : (
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-white text-sm">
                  {pdfData.file.name}
                </h4>
                <p className="text-xs text-slate-400">
                  {remainingPagesCount} of {pdfData.pageCount} pages will be kept &bull; {formatBytes(pdfData.file.size)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={rotateAll}
                  variant="secondary"
                  size="sm"
                  icon={RotateCw}
                >
                  Rotate All 90&deg;
                </Button>

                <Button
                  onClick={handleOrganizePdf}
                  loading={isProcessing}
                  variant="primary"
                  size="md"
                  icon={Sparkles}
                >
                  Save Changes
                </Button>

                <button
                  type="button"
                  onClick={() => setPdfData(null)}
                  className="text-xs text-slate-400 hover:text-rose-400 px-2 py-1"
                >
                  Change PDF
                </button>
              </div>
            </div>

            {/* Visual Page Thumbnails Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: pdfData.pageCount }).map((_, idx) => {
                const rotation = rotations[idx] || 0;
                const isExcluded = excludedPages.has(idx);

                return (
                  <div
                    key={idx}
                    className={`relative rounded-xl border p-3 flex flex-col justify-between transition-all ${
                      isExcluded
                        ? "bg-slate-900/40 border-slate-800 opacity-40 line-through"
                        : "bg-slate-900 border-slate-700/80 shadow-md"
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold text-slate-300">
                        Page {idx + 1}
                      </span>
                      {rotation > 0 && !isExcluded && (
                        <span className="text-[10px] text-rose-400 font-semibold">
                          +{rotation}&deg;
                        </span>
                      )}
                    </div>

                    {/* Dummy Visual Representation of Page */}
                    <div className="aspect-[3/4] bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-center p-2 mb-3 overflow-hidden">
                      <div
                        style={{
                          transform: `rotate(${rotation}deg)`,
                          transition: "transform 0.2s ease-in-out",
                        }}
                        className="w-full h-full flex flex-col justify-center items-center text-slate-600"
                      >
                        <FileText className="w-8 h-8 opacity-40 mb-1" />
                        <span className="text-[10px] font-mono text-slate-400">
                          P.{idx + 1}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Page Controls */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                      <button
                        type="button"
                        onClick={() => rotatePage(idx)}
                        disabled={isExcluded}
                        className="p-1 rounded text-slate-300 hover:text-indigo-400 hover:bg-slate-800 transition-colors disabled:opacity-30"
                        title="Rotate 90 degrees clockwise"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleExcludePage(idx)}
                        className={`p-1 rounded transition-colors ${
                          isExcluded
                            ? "text-emerald-400 hover:bg-slate-800"
                            : "text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                        }`}
                        title={isExcluded ? "Keep this page" : "Delete this page"}
                      >
                        {isExcluded ? (
                          <Undo2 className="w-3.5 h-3.5" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Result Download Card */}
            {resultBlob && (
              <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 animate-slide-up">
                <div>
                  <h4 className="font-bold text-white text-base">
                    Organized PDF Ready!
                  </h4>
                  <p className="text-xs text-slate-300">
                    {remainingPagesCount} pages organized &bull; {formatBytes(resultBlob.size)}
                  </p>
                </div>

                <Button
                  onClick={() => setShowAdModal(true)}
                  variant="emerald"
                  size="lg"
                  icon={Download}
                >
                  Download Organized PDF
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Ad Download Modal */}
      <DownloadAdModal
        isOpen={showAdModal}
        onClose={() => setShowAdModal(false)}
        onConfirmDownload={confirmDownload}
        fileName="organized_document.pdf"
        fileSizeText={formatBytes(resultBlob?.size)}
      />
    </ToolLayout>
  );
}

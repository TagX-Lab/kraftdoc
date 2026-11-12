import React, { useState } from "react";
import {
  RotateCw,
  Trash2,
  Download,
  Sparkles,
  Undo2,
  FileText,
} from "lucide-react";
import ToolLayout from "../../components/layout/ToolLayout";
import Dropzone from "../../components/common/Dropzone";
import Button from "../../components/common/Button";
import DownloadAdModal from "../../components/ads/DownloadAdModal";
import { getPdfPageCount, organizePdfPages } from "../../services/pdfService";
import { formatBytes, readFileAsArrayBuffer, validateFileSize } from "../../utils/fileHelpers";
import { downloadBlob } from "../../utils/downloadHelpers";
import { useToast } from "../../hooks/useToast";

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

    const check = validateFileSize(file, 50);
    if (!check.valid) {
      showToast(check.error, "error");
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
    } catch {
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
            <div className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-[#E5DCB8] flex flex-wrap items-center justify-between gap-4 shadow-sm">
              <div>
                <h4 className="font-black text-[#1400C3] text-base">
                  {pdfData.file.name}
                </h4>
                <p className="text-xs text-[#3B3355] font-semibold">
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
                  variant="orange"
                  size="md"
                  icon={Sparkles}
                >
                  Save Changes
                </Button>

                <button
                  type="button"
                  onClick={() => setPdfData(null)}
                  className="text-xs text-rose-600 hover:text-rose-700 font-bold px-2 py-1 cursor-pointer"
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
                    className={`relative rounded-2xl border-2 p-3 flex flex-col justify-between transition-all ${
                      isExcluded
                        ? "bg-[#F8F2D8]/40 border-[#E5DCB8] opacity-40 line-through"
                        : "bg-white border-[#E5DCB8] hover:border-[#1400C3] shadow-sm"
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-black text-[#1400C3]">
                        Page {idx + 1}
                      </span>
                      {rotation > 0 && !isExcluded && (
                        <span className="text-[10px] text-[#FF4E02] font-black">
                          +{rotation}&deg;
                        </span>
                      )}
                    </div>

                    {/* Visual Representation of Page */}
                    <div className="aspect-[3/4] bg-[#F8F2D8] border border-[#E5DCB8] rounded-xl flex items-center justify-center p-2 mb-3 overflow-hidden">
                      <div
                        style={{
                          transform: `rotate(${rotation}deg)`,
                          transition: "transform 0.2s ease-in-out",
                        }}
                        className="w-full h-full flex flex-col justify-center items-center text-[#1400C3]"
                      >
                        <FileText className="w-8 h-8 opacity-40 mb-1" />
                        <span className="text-[10px] font-mono text-[#3B3355] font-bold">
                          P.{idx + 1}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Page Controls */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#E5DCB8] text-xs">
                      <button
                        type="button"
                        onClick={() => rotatePage(idx)}
                        disabled={isExcluded}
                        className="p-1 rounded text-[#1400C3] hover:text-[#FF4E02] hover:bg-[#F8F2D8] transition-colors disabled:opacity-30 cursor-pointer"
                        title="Rotate 90 degrees clockwise"
                      >
                        <RotateCw className="w-4 h-4 stroke-[2.2]" />
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleExcludePage(idx)}
                        className={`p-1 rounded transition-colors cursor-pointer ${
                          isExcluded
                            ? "text-[#FF4E02] hover:bg-[#F8F2D8]"
                            : "text-[#6B627F] hover:text-rose-600 hover:bg-[#F8F2D8]"
                        }`}
                        title={isExcluded ? "Keep this page" : "Delete this page"}
                      >
                        {isExcluded ? (
                          <Undo2 className="w-4 h-4 stroke-[2.2]" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Result Download Card */}
            {resultBlob && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#FF4E02] flex flex-col sm:flex-row items-center justify-between gap-4 animate-slide-up shadow-xl">
                <div>
                  <h4 className="font-black text-[#1400C3] text-lg">
                    Organized PDF Ready!
                  </h4>
                  <p className="text-xs text-[#3B3355] font-semibold">
                    {remainingPagesCount} pages organized &bull; {formatBytes(resultBlob.size)}
                  </p>
                </div>

                <Button
                  onClick={() => setShowAdModal(true)}
                  variant="orange"
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

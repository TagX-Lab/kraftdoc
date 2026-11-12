import React, { useState } from "react";
import {
  Monitor,
  Download,
  Trash2,
  Sparkles,
  CheckCircle2,
  Plus,
} from "lucide-react";
import ToolLayout from "../../components/layout/ToolLayout";
import Button from "../../components/common/Button";
import DownloadAdModal from "../../components/ads/DownloadAdModal";
import { imagesToPdf } from "../../services/pdfService";
import { downloadBlob } from "../../utils/downloadHelpers";
import { formatBytes } from "../../utils/fileHelpers";
import { useToast } from "../../hooks/useToast";

export default function CaptureScreenToPdfPage({ onBack }) {
  const { showToast } = useToast();

  const [snapshots, setSnapshots] = useState([]); // array of { id, dataUrl, blob }
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState(null);
  const [showAdModal, setShowAdModal] = useState(false);

  const handleCaptureScreen = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: "monitor" },
      });

      const video = document.createElement("video");
      video.srcObject = stream;
      video.play();

      await new Promise((resolve) => {
        video.onloadedmetadata = () => resolve();
      });

      // Allow 300ms for first frame
      setTimeout(() => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Stop stream track
        stream.getTracks().forEach((t) => t.stop());

        canvas.toBlob(
          (blob) => {
            const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
            setSnapshots((prev) => [
              ...prev,
              {
                id: Date.now(),
                dataUrl,
                blob,
              },
            ]);
            setResultBlob(null);
            showToast("Screen captured!", "success");
          },
          "image/jpeg",
          0.95
        );
      }, 300);
    } catch {
      showToast("Screen capture cancelled or not allowed.", "info");
    }
  };

  const handleDeleteSnapshot = (id) => {
    setSnapshots((prev) => prev.filter((s) => s.id !== id));
    setResultBlob(null);
  };

  const handleGeneratePdf = async () => {
    if (snapshots.length === 0) return;
    setIsProcessing(true);
    try {
      const blobs = snapshots.map((s) => s.blob);
      const pdfBlob = await imagesToPdf(blobs, {
        pageSize: "FIT",
        fitMode: "contain",
        marginPt: 10,
      });
      setResultBlob(pdfBlob);
      showToast("Screen captures assembled into PDF!", "success");
    } catch (err) {
      showToast(err.message || "Failed to generate PDF.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob) return;
    downloadBlob(resultBlob, `screen_capture_${Date.now()}.pdf`);
  };

  return (
    <ToolLayout
      title="Capture Screen to PDF"
      description="Record clean high-resolution snapshots of your entire desktop, browser tab, or software window and export as PDF."
      badge="Screen Snapshot Engine"
      onBack={onBack}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Trigger Banner Card */}
        <div className="rounded-3xl bg-white border-2 border-[#1400C3]/15 p-5 sm:p-8 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-[#EAF2FD] text-[#1400C3] mx-auto flex items-center justify-center">
            <Monitor className="w-8 h-8" />
          </div>

          <div>
            <h3 className="font-display text-xl text-[#1400C3]">
              Grab Screen Snapshot
            </h3>
            <p className="text-xs font-semibold text-[#6B627F] max-w-md mx-auto mt-1">
              Select any open window, presentation tab, or full display to snap directly into your document queue.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleCaptureScreen}
              className="px-6 py-3 rounded-full font-black text-xs uppercase tracking-wider bg-[#FF4E02] hover:bg-[#1400C3] text-white shadow-md shadow-[#FF4E02]/20 hover:shadow-xl transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Take New Screen Capture</span>
            </button>
          </div>
        </div>

        {/* Gallery of Screen Snapshots */}
        {snapshots.length > 0 && (
          <div className="rounded-3xl bg-white border-2 border-[#1400C3]/15 p-4 sm:p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/5 pb-3">
              <div className="font-display text-sm uppercase text-[#1400C3]">
                Captured Screens ({snapshots.length})
              </div>
              <button
                type="button"
                onClick={() => {
                  setSnapshots([]);
                  setResultBlob(null);
                }}
                className="text-xs font-bold text-[#FF4E02] hover:underline cursor-pointer"
              >
                Clear all
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {snapshots.map((snap, index) => (
                <div
                  key={snap.id}
                  className="rounded-2xl border-2 border-[#E5DCB8] overflow-hidden bg-black/5 relative group shadow-xs"
                >
                  <img
                    src={snap.dataUrl}
                    alt={`Screen ${index + 1}`}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-black/70 text-white text-[10px] font-black">
                    Page {index + 1}
                  </div>
                  <button
                    type="button"
                    aria-label={`Delete captured screen ${index + 1}`}
                    onClick={() => handleDeleteSnapshot(snap.id)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center opacity-95 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 transition-opacity shadow-sm cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Action Bar */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-black/5">
              <div className="text-xs font-bold text-[#1400C3]">
                {snapshots.length} screen {snapshots.length === 1 ? "page" : "pages"} ready for PDF assembly.
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {!resultBlob ? (
                  <Button
                    onClick={handleGeneratePdf}
                    disabled={isProcessing}
                    isLoading={isProcessing}
                    variant="primary"
                    className="w-full sm:w-auto"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    <span>Generate Screen PDF</span>
                  </Button>
                ) : (
                  <Button
                    onClick={() => setShowAdModal(true)}
                    variant="primary"
                    className="w-full sm:w-auto bg-[#FF4E02] hover:bg-[#e04502] text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    <span>Download PDF</span>
                  </Button>
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
                  Screen Capture Document Generated!
                </div>
                <p className="text-xs text-[#6B627F]">
                  Processed size: {formatBytes(resultBlob.size)} • High-resolution vector PDF.
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
          fileName="screen_capture.pdf"
          fileSize={resultBlob?.size}
        />
      )}
    </ToolLayout>
  );
}

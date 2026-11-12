import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Camera,
  Download,
  Trash2,
  Sparkles,
  CheckCircle2,
  StopCircle,
  Play,
  RotateCcw,
} from "lucide-react";
import ToolLayout from "../../components/layout/ToolLayout";
import Button from "../../components/common/Button";
import DownloadAdModal from "../../components/ads/DownloadAdModal";
import { imagesToPdf } from "../../services/pdfService";
import { downloadBlob } from "../../utils/downloadHelpers";
import { formatBytes } from "../../utils/fileHelpers";
import { useToast } from "../../hooks/useToast";

export default function CameraToPdfPage({ onBack }) {
  const { showToast } = useToast();

  const [streamActive, setStreamActive] = useState(false);
  const [capturedPages, setCapturedPages] = useState([]); // array of { id, dataUrl, blob }
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState(null);
  const [showAdModal, setShowAdModal] = useState(false);

  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setStreamActive(true);
      showToast("Camera scanner active!", "success");
    } catch {
      showToast("Could not access camera. Please check permissions.", "error");
    }
  }, [showToast]);

  const stopCamera = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setStreamActive(false);
  }, []);

  useEffect(() => {
    let active = true;
    navigator.mediaDevices
      ?.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      })
      .then((stream) => {
        if (!active) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setStreamActive(true);
      })
      .catch(() => {
        // Handled if user allows
      });

    return () => {
      active = false;
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
    };
  }, []);

  const handleCapturePage = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
        setCapturedPages((prev) => [
          ...prev,
          {
            id: Date.now(),
            dataUrl,
            blob,
          },
        ]);
        setResultBlob(null);
        showToast(`Page ${capturedPages.length + 1} captured!`, "success");
      },
      "image/jpeg",
      0.92
    );
  };

  const handleDeletePage = (id) => {
    setCapturedPages((prev) => prev.filter((p) => p.id !== id));
    setResultBlob(null);
  };

  const handleGeneratePdf = async () => {
    if (capturedPages.length === 0) return;
    setIsProcessing(true);
    try {
      const blobs = capturedPages.map((p) => p.blob);
      const pdfBlob = await imagesToPdf(blobs, {
        pageSize: "A4",
        orientation: "auto",
        fitMode: "contain",
      });
      setResultBlob(pdfBlob);
      showToast(`A4 PDF generated from ${capturedPages.length} captured pages!`, "success");
    } catch (err) {
      showToast(err.message || "Failed to generate PDF.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob) return;
    downloadBlob(resultBlob, `scanned_document_${Date.now()}.pdf`);
  };

  return (
    <ToolLayout
      title="Camera &amp; Scanner to PDF"
      description="Scan physical documents, papers, receipts, or notes using your webcam or mobile camera and export directly as clean A4 PDF."
      badge="Live Document Scanner"
      onBack={onBack}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Camera Viewfinder Card */}
        <div className="rounded-3xl bg-white border-2 border-[#1400C3]/15 p-4 sm:p-7 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-[#FF4E02]" />
              <h3 className="font-display text-sm uppercase text-[#1400C3]">
                Live Camera Scanner
              </h3>
            </div>

            <div className="flex items-center gap-2">
              {streamActive ? (
                <button
                  type="button"
                  onClick={stopCamera}
                  className="px-3 py-1.5 rounded-xl border border-[#F8C8BD] text-xs font-bold text-[#FF4E02] hover:bg-[#FFEBE5] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <StopCircle className="w-3.5 h-3.5" />
                  <span>Pause Camera</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startCamera}
                  className="px-3 py-1.5 rounded-xl border border-[#1400C3] text-xs font-bold text-[#1400C3] hover:bg-[#F8F2D8] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Start Camera</span>
                </button>
              )}
            </div>
          </div>

          {/* Viewfinder Video Element with Laser Scanner overlay */}
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-video max-h-[420px] flex items-center justify-center border-2 border-[#1400C3]/20">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-contain"
            />

            {/* Viewfinder Target Guidelines */}
            <div className="absolute inset-8 border-2 border-dashed border-white/40 rounded-xl pointer-events-none flex items-center justify-center">
              <span className="text-[10px] uppercase font-black tracking-widest text-white/60 bg-black/40 px-3 py-1 rounded-full">
                Align document inside frame
              </span>
            </div>

            {!streamActive && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white space-y-2">
                <Camera className="w-10 h-10 text-[#FF4E02]" />
                <span className="text-xs font-bold">Camera is currently paused.</span>
              </div>
            )}
          </div>

          {/* Capture Trigger Button */}
          <div className="pt-2 flex justify-center">
            <button
              type="button"
              disabled={!streamActive}
              onClick={handleCapturePage}
              className="px-8 py-3.5 rounded-full font-black text-sm uppercase tracking-wider bg-[#FF4E02] hover:bg-[#1400C3] text-white shadow-lg shadow-[#FF4E02]/25 hover:shadow-xl transition-all transform active:scale-95 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Camera className="w-5 h-5" />
              <span>Capture Page ({capturedPages.length})</span>
            </button>
          </div>
        </div>

        {/* Gallery of Captured Pages */}
        {capturedPages.length > 0 && (
          <div className="rounded-3xl bg-white border-2 border-[#1400C3]/15 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-black/5 pb-3">
              <div className="font-display text-sm uppercase text-[#1400C3]">
                Captured Pages ({capturedPages.length})
              </div>
              <button
                type="button"
                onClick={() => {
                  setCapturedPages([]);
                  setResultBlob(null);
                }}
                className="text-xs font-bold text-[#FF4E02] hover:underline cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {capturedPages.map((page, index) => (
                <div
                  key={page.id}
                  className="rounded-2xl border-2 border-[#E5DCB8] overflow-hidden bg-[#F8F2D8]/50 relative group shadow-xs"
                >
                  <img
                    src={page.dataUrl}
                    alt={`Page ${index + 1}`}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-black/70 text-white text-[10px] font-black">
                    #{index + 1}
                  </div>
                  <button
                    type="button"
                    aria-label={`Delete captured page ${index + 1}`}
                    onClick={() => handleDeletePage(page.id)}
                    className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center opacity-95 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 transition-opacity shadow-sm cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Action Bar */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-black/5">
              <div className="text-xs font-bold text-[#1400C3]">
                Ready to assemble {capturedPages.length} scanned {capturedPages.length === 1 ? "page" : "pages"} into A4 document.
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
                    <span>Generate A4 PDF</span>
                  </Button>
                ) : (
                  <Button
                    onClick={() => setShowAdModal(true)}
                    variant="primary"
                    className="w-full sm:w-auto bg-[#FF4E02] hover:bg-[#e04502] text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    <span>Download Scanned PDF</span>
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
                  Scanned PDF Assembled Successfully!
                </div>
                <p className="text-xs text-[#6B627F]">
                  Processed size: {formatBytes(resultBlob.size)} • Standard A4 pages.
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
          fileName="scanned_document.pdf"
          fileSize={resultBlob?.size}
        />
      )}
    </ToolLayout>
  );
}

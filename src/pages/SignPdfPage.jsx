import React, { useState, useRef, useEffect } from "react";
import {
  PenTool,
  Download,
  Undo2,
  FileText,
  Sliders,
  Eraser,
  Upload,
} from "lucide-react";
import ToolLayout from "../components/layout/ToolLayout";
import Dropzone from "../components/common/Dropzone";
import Button from "../components/common/Button";
import DownloadAdModal from "../components/ads/DownloadAdModal";
import { getPdfPageCount, signPdf } from "../services/pdfService";
import {
  formatBytes,
  readFileAsArrayBuffer,
  validateFileSize,
} from "../utils/fileHelpers";
import { downloadBlob } from "../utils/downloadHelpers";
import { useToast } from "../hooks/useToast";

export default function SignPdfPage({ onBack }) {
  const { showToast } = useToast();

  const [pdfData, setPdfData] = useState(null); // { file, buffer, pageCount }
  const [signatureMode, setSignatureMode] = useState("draw"); // 'draw' | 'upload'
  const [signatureDataUrl, setSignatureDataUrl] = useState(null);

  // Placement Settings
  const [targetPage, setTargetPage] = useState(1);
  const [xPercent, setXPercent] = useState(50);
  const [yPercent, setYPercent] = useState(20);
  const [widthPercent, setWidthPercent] = useState(28);

  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState(null);
  const [showAdModal, setShowAdModal] = useState(false);

  // Drawing Canvas Ref
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState("#1400C3"); // Bluebonnet or Black

  useEffect(() => {
    if (signatureMode === "draw" && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = penColor;
    }
  }, [signatureMode, penColor]);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      setSignatureDataUrl(canvas.toDataURL("image/png"));
      setResultBlob(null);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setSignatureDataUrl(null);
      setResultBlob(null);
    }
  };

  const handleSignatureUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSignatureDataUrl(reader.result);
      setResultBlob(null);
      showToast("Signature image loaded!", "success");
    };
    reader.readAsDataURL(file);
  };

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
      setTargetPage(pageCount); // Often signatures go on the last page!
      setResultBlob(null);
      showToast(`Loaded "${file.name}" (${pageCount} pages).`, "success");
    } catch {
      showToast("Could not read PDF.", "error");
    }
  };

  const handleApplySignature = async () => {
    if (!pdfData) return;
    if (!signatureDataUrl) {
      showToast("Please draw or upload your signature first.", "error");
      return;
    }

    setIsProcessing(true);
    try {
      const blob = await signPdf(pdfData.buffer, {
        signatureDataUrl,
        pageNumber: Number(targetPage),
        xPercent: Number(xPercent),
        yPercent: Number(yPercent),
        widthPercent: Number(widthPercent),
      });

      setResultBlob(blob);
      showToast("Signature stamped onto PDF successfully!", "success");
    } catch {
      showToast("Failed to stamp signature. Please try again.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const executeDownload = () => {
    if (!resultBlob || !pdfData) return;
    const base = pdfData.file.name.replace(/\.[^/.]+$/, "");
    downloadBlob(resultBlob, `${base}_signed.pdf`);
    showToast("Downloaded signed PDF!", "success");
  };

  return (
    <ToolLayout
      title="Sign PDF Online"
      description="Draw or upload your personal signature and stamp it onto any page of your PDF document. 100% private in-browser execution."
      onBack={onBack}
    >
      <div className="space-y-6">
        {!pdfData ? (
          <Dropzone
            accept={{ "application/pdf": [".pdf"] }}
            multiple={false}
            onFilesSelected={handlePdfLoaded}
            title="Drop PDF here to sign"
            subtitle="Upload document and place your signature in seconds (Max 50MB)"
          />
        ) : (
          <div className="space-y-6">
            {/* PDF File Header */}
            <div className="p-4 rounded-2xl bg-white border-2 border-[#1400C3]/20 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFF4D4] border border-[#F2DE9F] text-[#FF4E02] flex items-center justify-center">
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
                Change Document
              </Button>
            </div>

            {/* Signature Creation & Placement Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Signature Creation Pad */}
              <div className="lg:col-span-6 p-6 rounded-3xl bg-white border-2 border-[#E5DCB8] shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#1400C3] font-bold text-sm uppercase tracking-wider">
                    <PenTool className="w-4 h-4 text-[#FF4E02]" />
                    <span>Create Your Signature</span>
                  </div>

                  {/* Mode Toggle */}
                  <div className="flex items-center gap-1 bg-[#F8F2D8] p-1 rounded-xl border border-[#E5DCB8]">
                    <button
                      type="button"
                      onClick={() => setSignatureMode("draw")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        signatureMode === "draw"
                          ? "bg-[#1400C3] text-white shadow-xs"
                          : "text-[#3B3355]"
                      }`}
                    >
                      Draw
                    </button>
                    <button
                      type="button"
                      onClick={() => setSignatureMode("upload")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        signatureMode === "upload"
                          ? "bg-[#1400C3] text-white shadow-xs"
                          : "text-[#3B3355]"
                      }`}
                    >
                      Upload Image
                    </button>
                  </div>
                </div>

                {signatureMode === "draw" ? (
                  <div className="space-y-3">
                    <div className="relative border-2 border-dashed border-[#1400C3]/30 rounded-2xl bg-[#FFFDF7] p-1">
                      <canvas
                        ref={canvasRef}
                        width={460}
                        height={180}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        className="w-full h-44 rounded-xl cursor-crosshair touch-none bg-transparent"
                      />
                      <div className="absolute bottom-2 left-3 text-[10px] text-[#6B627F] font-bold pointer-events-none opacity-60">
                        Sign within the box &bull; 100% In-Browser
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#6B627F]">Ink:</span>
                        {["#1400C3", "#111827", "#DC2626"].map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setPenColor(c)}
                            className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                              penColor === c ? "scale-110 border-[#FF4E02]" : "border-transparent"
                            }`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>

                      <Button variant="outline" size="sm" onClick={clearCanvas}>
                        <Eraser className="w-3.5 h-3.5 mr-1" />
                        Clear Pad
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <label className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-[#1400C3]/30 bg-[#FFFDF7] cursor-pointer hover:bg-white transition-colors">
                      <Upload className="w-8 h-8 text-[#FF4E02] mb-2" />
                      <span className="text-xs font-bold text-[#1400C3]">
                        Upload Transparent PNG Signature
                      </span>
                      <span className="text-[10px] text-[#6B627F] mt-0.5">
                        PNG or JPG (Max 5MB)
                      </span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg"
                        onChange={handleSignatureUpload}
                        className="hidden"
                      />
                    </label>

                    {signatureDataUrl && (
                      <div className="p-3 rounded-xl bg-[#F8F2D8] border border-[#E5DCB8] flex items-center justify-between">
                        <img
                          src={signatureDataUrl}
                          alt="Signature Preview"
                          className="h-10 object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => setSignatureDataUrl(null)}
                          className="text-xs font-bold text-[#DC2626] hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column: Placement Settings */}
              <div className="lg:col-span-6 p-6 rounded-3xl bg-white border-2 border-[#E5DCB8] shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-[#1400C3] font-bold text-sm uppercase tracking-wider">
                  <Sliders className="w-4 h-4 text-[#FF4E02]" />
                  <span>Signature Position</span>
                </div>

                <div className="space-y-4">
                  {/* Target Page */}
                  <div className="space-y-1.5 p-3 rounded-2xl bg-[#F8F2D8]/50 border border-[#E5DCB8]">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-[#1400C3]">Target Page</span>
                      <span className="text-[#FF4E02]">
                        Page {targetPage} of {pdfData.pageCount}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max={pdfData.pageCount}
                      value={targetPage}
                      onChange={(e) => {
                        setTargetPage(e.target.value);
                        setResultBlob(null);
                      }}
                      className="w-full accent-[#1400C3] cursor-pointer"
                    />
                  </div>

                  {/* Horizontal Position */}
                  <div className="space-y-1.5 p-3 rounded-2xl bg-[#F8F2D8]/50 border border-[#E5DCB8]">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-[#1400C3]">Horizontal (X)</span>
                      <span className="text-[#FF4E02]">{xPercent}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="90"
                      value={xPercent}
                      onChange={(e) => {
                        setXPercent(e.target.value);
                        setResultBlob(null);
                      }}
                      className="w-full accent-[#FF4E02] cursor-pointer"
                    />
                  </div>

                  {/* Vertical Position */}
                  <div className="space-y-1.5 p-3 rounded-2xl bg-[#F8F2D8]/50 border border-[#E5DCB8]">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-[#1400C3]">Vertical from Bottom (Y)</span>
                      <span className="text-[#FF4E02]">{yPercent}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="90"
                      value={yPercent}
                      onChange={(e) => {
                        setYPercent(e.target.value);
                        setResultBlob(null);
                      }}
                      className="w-full accent-[#FF4E02] cursor-pointer"
                    />
                  </div>

                  {/* Signature Size */}
                  <div className="space-y-1.5 p-3 rounded-2xl bg-[#F8F2D8]/50 border border-[#E5DCB8]">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-[#1400C3]">Signature Size</span>
                      <span className="text-[#FF4E02]">{widthPercent}% Width</span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="60"
                      value={widthPercent}
                      onChange={(e) => {
                        setWidthPercent(e.target.value);
                        setResultBlob(null);
                      }}
                      className="w-full accent-[#FF4E02] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#FFF4D4] border-2 border-[#F2DE9F]">
              <div>
                <h5 className="font-black text-sm text-[#1400C3]">
                  Ready to Sign Document
                </h5>
                <p className="text-xs text-[#6B627F] font-semibold">
                  Will stamp signature permanently onto Page {targetPage}.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {!resultBlob ? (
                  <Button
                    variant="primary"
                    onClick={handleApplySignature}
                    isLoading={isProcessing}
                    disabled={!signatureDataUrl}
                  >
                    <PenTool className="w-4 h-4 mr-2" />
                    <span>Stamp Signature</span>
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={() => setShowAdModal(true)}
                    className="bg-[#10B981] hover:bg-[#059669] text-white shadow-lg"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    <span>Download Signed PDF</span>
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

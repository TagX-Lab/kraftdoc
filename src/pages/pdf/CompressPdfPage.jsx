import React, { useState } from "react";
import {
  Minimize2,
  Download,
  Undo2,
  FileText,
  Sparkles,
  Zap,
} from "lucide-react";
import ToolLayout from "../../components/layout/ToolLayout";
import Dropzone from "../../components/common/Dropzone";
import Button from "../../components/common/Button";
import DownloadAdModal from "../../components/ads/DownloadAdModal";
import {
  getPdfPageCount,
  compressPdfDocument,
} from "../../services/pdfService";
import {
  formatBytes,
  readFileAsArrayBuffer,
  validateFileSize,
} from "../../utils/fileHelpers";
import { downloadBlob } from "../../utils/downloadHelpers";
import { useToast } from "../../hooks/useToast";

export default function CompressPdfPage({ onBack }) {
  const { showToast } = useToast();

  const [pdfData, setPdfData] = useState(null); // { file, buffer, pageCount }
  const [level, setLevel] = useState("medium"); // 'low' | 'medium' | 'high'
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [resultBlob, setResultBlob] = useState(null);
  const [showAdModal, setShowAdModal] = useState(false);

  const levels = [
    {
      id: "low",
      label: "Light Compression",
      desc: "Best visual fidelity, moderate savings (~30%)",
      quality: 0.82,
      badge: "High Quality",
    },
    {
      id: "medium",
      label: "Balanced Compression",
      desc: "Recommended for email & job portals (~60% savings)",
      quality: 0.65,
      badge: "Recommended",
    },
    {
      id: "high",
      label: "Extreme Compression",
      desc: "Maximum reduction, lowest KB for strict limits (~80%)",
      quality: 0.45,
      badge: "Max Savings",
    },
  ];

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
      setResultBlob(null);
      showToast(`Loaded "${file.name}" (${pageCount} pages).`, "success");
    } catch {
      showToast("Could not read PDF.", "error");
    }
  };

  const handleCompress = async () => {
    if (!pdfData) return;

    const selectedCfg = levels.find((l) => l.id === level) || levels[1];
    setIsCompressing(true);
    setProgress({ current: 0, total: pdfData.pageCount });

    try {
      const blob = await compressPdfDocument(
        pdfData.buffer,
        selectedCfg.quality,
        (current, total) => {
          setProgress({ current, total });
        }
      );

      setResultBlob(blob);
      showToast("PDF compressed successfully in device RAM!", "success");
    } catch {
      showToast("Compression failed. Please try a different preset.", "error");
    } finally {
      setIsCompressing(false);
    }
  };

  const executeDownload = () => {
    if (!resultBlob || !pdfData) return;
    const base = pdfData.file.name.replace(/\.[^/.]+$/, "");
    downloadBlob(resultBlob, `${base}_compressed.pdf`);
    showToast("Downloaded compressed PDF!", "success");
  };

  const getSavingsPercent = () => {
    if (!resultBlob || !pdfData) return 0;
    const diff = pdfData.file.size - resultBlob.size;
    if (diff <= 0) return 0;
    return Math.round((diff / pdfData.file.size) * 100);
  };

  return (
    <ToolLayout
      title="Compress PDF File Size"
      description="Reduce PDF file size in your browser with smart stream optimization. Zero server upload, completely private."
      onBack={onBack}
    >
      <div className="space-y-6">
        {!pdfData ? (
          <Dropzone
            accept={{ "application/pdf": [".pdf"] }}
            multiple={false}
            onFilesSelected={handlePdfLoaded}
            title="Drop PDF file here to compress"
            subtitle="Shrink heavy PDFs to meet strict email or portal limits (Max 60MB)"
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
                    {pdfData.pageCount} pages &bull; Original Size: {formatBytes(pdfData.file.size)}
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

            {/* Compression Presets */}
            <div className="p-6 rounded-3xl bg-white border-2 border-[#E5DCB8] shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-[#1400C3] font-bold text-sm uppercase tracking-wider">
                <Zap className="w-4 h-4 text-[#FF4E02]" />
                <span>Select Compression Strength</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {levels.map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    disabled={isCompressing}
                    onClick={() => {
                      setLevel(lvl.id);
                      setResultBlob(null);
                    }}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                      level === lvl.id
                        ? "border-[#1400C3] bg-[#F8F2D8] ring-2 ring-[#1400C3]/15 shadow-sm"
                        : "border-[#E5DCB8] bg-white hover:border-[#1400C3]"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-sm text-[#1400C3]">
                          {lvl.label}
                        </span>
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                            level === lvl.id
                              ? "bg-[#FF4E02] text-white"
                              : "bg-[#F8F2D8] text-[#1400C3]"
                          }`}
                        >
                          {lvl.badge}
                        </span>
                      </div>
                      <p className="text-xs text-[#6B627F] leading-relaxed font-semibold">
                        {lvl.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Progress Bar */}
            {isCompressing && (
              <div className="p-5 rounded-2xl bg-white border-2 border-[#1400C3] space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#1400C3] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#FF4E02] animate-spin" />
                    Compressing Page {progress.current} of {progress.total}...
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

            {/* Results Comparison Card */}
            {resultBlob && (
              <div className="p-5 rounded-3xl bg-[#EBF7ED] border-2 border-[#C2E7C9] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#10B981] text-white flex items-center justify-center font-black text-lg shadow-sm">
                    -{getSavingsPercent()}%
                  </div>
                  <div>
                    <h5 className="font-black text-base text-[#1400C3]">
                      Compression Complete!
                    </h5>
                    <p className="text-xs text-[#3B3355] font-semibold mt-0.5">
                      Reduced from{" "}
                      <span className="line-through text-[#6B627F]">
                        {formatBytes(pdfData.file.size)}
                      </span>{" "}
                      to{" "}
                      <span className="text-[#10B981] font-black text-sm">
                        {formatBytes(resultBlob.size)}
                      </span>
                    </p>
                  </div>
                </div>

                <Button
                  variant="primary"
                  onClick={() => setShowAdModal(true)}
                  className="bg-[#10B981] hover:bg-[#059669] text-white shadow-lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  <span>Download Compressed PDF</span>
                </Button>
              </div>
            )}

            {/* Initial Action Bar */}
            {!resultBlob && !isCompressing && (
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#FFF4D4] border-2 border-[#F2DE9F]">
                <div>
                  <h5 className="font-black text-sm text-[#1400C3]">
                    Ready to Compress Document
                  </h5>
                  <p className="text-xs text-[#6B627F] font-semibold">
                    100% computed inside your device memory. Zero cloud transmission.
                  </p>
                </div>

                <Button
                  variant="primary"
                  onClick={handleCompress}
                  isLoading={isCompressing}
                >
                  <Minimize2 className="w-4 h-4 mr-2" />
                  <span>Compress PDF Now</span>
                </Button>
              </div>
            )}
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

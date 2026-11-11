import React, { useState } from "react";
import {
  Wrench,
  Download,
  Undo2,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import ToolLayout from "../components/layout/ToolLayout";
import Dropzone from "../components/common/Dropzone";
import Button from "../components/common/Button";
import DownloadAdModal from "../components/ads/DownloadAdModal";
import {
  repairPdfDocument,
} from "../services/pdfService";
import {
  formatBytes,
  readFileAsArrayBuffer,
  validateFileSize,
} from "../utils/fileHelpers";
import { downloadBlob } from "../utils/downloadHelpers";
import { useToast } from "../hooks/useToast";

export default function RepairPdfPage({ onBack }) {
  const { showToast } = useToast();

  const [fileData, setFileData] = useState(null); // { file, buffer }
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState(null);
  const [showAdModal, setShowAdModal] = useState(false);

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
      setFileData({ file, buffer });
      setResultBlob(null);
      showToast(`Loaded "${file.name}". Ready to analyze and repair.`, "info");
    } catch {
      showToast("Could not read file.", "error");
    }
  };

  const handleRepair = async () => {
    if (!fileData) return;
    setIsProcessing(true);
    try {
      const blob = await repairPdfDocument(fileData.buffer);
      setResultBlob(blob);
      showToast("Corrupted PDF streams repaired & rebuilt!", "success");
    } catch (err) {
      showToast(err.message || "Could not repair this document. The corruption may be too severe.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob) return;
    const baseName = fileData.file.name.replace(/\.[^/.]+$/, "");
    downloadBlob(resultBlob, `${baseName}_repaired.pdf`);
  };

  return (
    <ToolLayout
      title="Repair &amp; Rebuild Damaged PDF"
      description="Fix corrupted cross-reference tables, repair broken stream indexes, and rebuild malformed PDF documents in browser memory."
      badge="PDF Stream Rebuilder"
      onBack={onBack}
    >
      <div className="space-y-8">
        {!fileData ? (
          <div className="max-w-2xl mx-auto">
            <Dropzone
              accept={{ "application/pdf": [".pdf"] }}
              maxFiles={1}
              onFilesDrop={handlePdfLoaded}
              title="Drop damaged or corrupted PDF here"
              subtitle="Re-parses and cleans stream structures automatically"
              badgeText="100% In-Browser Stream Repair"
            />
          </div>
        ) : (
          <div className="space-y-8 max-w-4xl mx-auto">
            {/* File Info Bar */}
            <div className="rounded-3xl bg-white border-2 border-[#1400C3]/15 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-[#FFEBE5] text-[#FF4E02] flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-sm sm:text-base text-[#1400C3] truncate">
                    {fileData.file.name}
                  </div>
                  <div className="text-xs font-semibold text-[#6B627F] mt-0.5">
                    {formatBytes(fileData.file.size)}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setFileData(null);
                  setResultBlob(null);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#FF4E02] bg-[#FF4E02]/10 hover:bg-[#FF4E02]/20 transition-colors cursor-pointer"
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span>Change PDF</span>
              </button>
            </div>

            {/* Diagnostic Details */}
            <div className="rounded-3xl bg-white border-2 border-[#1400C3]/15 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-[#FF4E02]" />
                <h3 className="font-display text-sm uppercase text-[#1400C3]">
                  Stream Diagnostics &amp; Recovery Plan
                </h3>
              </div>

              <div className="space-y-2 text-xs text-[#3B3355] font-semibold">
                <div className="p-3 rounded-xl bg-[#F8F2D8]/60 border border-[#E5DCB8] flex items-center justify-between">
                  <span>1. Safe Mode Parsing</span>
                  <span className="text-[10px] font-black uppercase text-[#1400C3] bg-white px-2 py-0.5 rounded">
                    Active
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#F8F2D8]/60 border border-[#E5DCB8] flex items-center justify-between">
                  <span>2. Cross-Reference (XRef) Table Rebuilding</span>
                  <span className="text-[10px] font-black uppercase text-[#1400C3] bg-white px-2 py-0.5 rounded">
                    Queued
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#F8F2D8]/60 border border-[#E5DCB8] flex items-center justify-between">
                  <span>3. Clean Object Stream Reserialization</span>
                  <span className="text-[10px] font-black uppercase text-[#1400C3] bg-white px-2 py-0.5 rounded">
                    Queued
                  </span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="rounded-3xl bg-white border-2 border-[#1400C3]/15 p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1400C3]">
                <ShieldCheck className="w-4 h-4 text-[#FF4E02]" />
                <span>Zero server exposure. Recovery executes inside device RAM.</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {!resultBlob ? (
                  <Button
                    onClick={handleRepair}
                    disabled={isProcessing}
                    isLoading={isProcessing}
                    variant="primary"
                    className="w-full sm:w-auto"
                  >
                    <Wrench className="w-4 h-4 mr-2" />
                    <span>Rebuild &amp; Repair PDF</span>
                  </Button>
                ) : (
                  <Button
                    onClick={() => setShowAdModal(true)}
                    variant="primary"
                    className="w-full sm:w-auto bg-[#FF4E02] hover:bg-[#e04502] text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    <span>Download Repaired PDF</span>
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
                  PDF Rebuilt &amp; Streams Stabilized!
                </div>
                <p className="text-xs text-[#6B627F]">
                  Repaired size: {formatBytes(resultBlob.size)} • Standard vector structures regenerated.
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
          fileName={`${fileData?.file?.name?.replace(/\.[^/.]+$/, "")}_repaired.pdf`}
          fileSize={resultBlob?.size}
        />
      )}
    </ToolLayout>
  );
}

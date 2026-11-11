import React, { useState } from "react";
import {
  FileText,
  Copy,
  Download,
  Undo2,
  Check,
  Search,
  Sparkles,
} from "lucide-react";
import ToolLayout from "../components/layout/ToolLayout";
import Dropzone from "../components/common/Dropzone";
import Button from "../components/common/Button";
import {
  getPdfPageCount,
  extractTextFromPdfDocument,
} from "../services/pdfService";
import {
  formatBytes,
  readFileAsArrayBuffer,
  validateFileSize,
} from "../utils/fileHelpers";
import { downloadBlob } from "../utils/downloadHelpers";
import { useToast } from "../hooks/useToast";

export default function PdfExtractTextPage({ onBack }) {
  const { showToast } = useToast();

  const [pdfData, setPdfData] = useState(null); // { file, buffer, pageCount }
  const [extractedData, setExtractedData] = useState(null); // { fullText, pageTexts, totalPages }
  const [isExtracting, setIsExtracting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");

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
      setExtractedData(null);
      setIsExtracting(true);

      const result = await extractTextFromPdfDocument(buffer);
      setExtractedData(result);
      showToast(`Extracted text from all ${pageCount} pages!`, "success");
    } catch {
      showToast("Could not extract text from PDF.", "error");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!extractedData?.fullText) return;
    try {
      await navigator.clipboard.writeText(extractedData.fullText);
      setCopied(true);
      showToast("All text copied to clipboard!", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast("Failed to copy text.", "error");
    }
  };

  const handleDownloadTxt = () => {
    if (!extractedData?.fullText || !pdfData) return;
    const blob = new Blob([extractedData.fullText], { type: "text/plain;charset=utf-8" });
    const baseName = pdfData.file.name.replace(/\.[^/.]+$/, "");
    downloadBlob(blob, `${baseName}_extracted_text.txt`);
  };

  return (
    <ToolLayout
      title="Extract Plain Text from PDF"
      description="Extract pure readable text from any PDF document without formatting clutter. Copy to clipboard or export as .TXT file."
      badge="PDF to Plain Text"
      onBack={onBack}
    >
      <div className="space-y-8">
        {!pdfData ? (
          <div className="max-w-2xl mx-auto">
            <Dropzone
              accept={{ "application/pdf": [".pdf"] }}
              maxFiles={1}
              onFilesDrop={handlePdfLoaded}
              title="Drop PDF here to extract text"
              subtitle="Reads all selectable text characters page-by-page"
              badgeText="100% In-Browser OCR Extraction"
            />
          </div>
        ) : (
          <div className="space-y-8 max-w-4xl mx-auto">
            {/* File Info Bar */}
            <div className="rounded-3xl bg-white border-2 border-[#1400C3]/15 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-[#EAF2FD] text-[#1400C3] flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-sm sm:text-base text-[#1400C3] truncate">
                    {pdfData.file.name}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#6B627F] mt-0.5">
                    <span>{pdfData.pageCount} pages</span>
                    <span>•</span>
                    <span>{formatBytes(pdfData.file.size)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPdfData(null);
                    setExtractedData(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#FF4E02] bg-[#FF4E02]/10 hover:bg-[#FF4E02]/20 transition-colors cursor-pointer"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                  <span>Change PDF</span>
                </button>
              </div>
            </div>

            {/* Extraction Toolbar */}
            {extractedData && (
              <div className="rounded-3xl bg-white border-2 border-[#1400C3]/15 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 max-w-xs w-full relative">
                  <Search className="w-4 h-4 text-[#6B627F] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search inside extracted text..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E5DCB8] text-xs font-bold text-[#1400C3] focus:outline-none focus:border-[#1400C3]"
                  />
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Button
                    onClick={handleCopyToClipboard}
                    variant="outline"
                    className="w-1/2 sm:w-auto text-xs"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                    <span>{copied ? "Copied!" : "Copy All"}</span>
                  </Button>

                  <Button
                    onClick={handleDownloadTxt}
                    variant="primary"
                    className="w-1/2 sm:w-auto text-xs bg-[#FF4E02] hover:bg-[#e04502] text-white"
                  >
                    <Download className="w-3.5 h-3.5 mr-1.5" />
                    <span>Download .TXT</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Extracted Text Content Preview */}
            <div className="rounded-3xl bg-white border-2 border-[#1400C3]/15 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-sm uppercase text-[#1400C3] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#FF4E02]" />
                  <span>Extracted Document Characters</span>
                </h3>
                <span className="text-xs font-mono font-bold text-[#6B627F]">
                  {extractedData?.fullText ? `${extractedData.fullText.length.toLocaleString()} chars` : "Extracting..."}
                </span>
              </div>

              {isExtracting ? (
                <div className="py-20 text-center space-y-2">
                  <div className="text-sm font-bold text-[#1400C3] animate-pulse">
                    Parsing document text streams...
                  </div>
                </div>
              ) : (
                <textarea
                  readOnly
                  value={extractedData?.fullText || "No readable text stream found in this PDF (might be a scanned image)."}
                  className="w-full h-96 p-4 rounded-2xl bg-[#F8F2D8]/50 border border-[#E5DCB8] font-mono text-xs text-[#1400C3] leading-relaxed focus:outline-none resize-y"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

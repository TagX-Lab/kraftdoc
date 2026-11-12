import React, { useRef, useState } from "react";
import { UploadCloud, FileType, Plus } from "lucide-react";

function normalizeAccept(accept) {
  if (!accept) {
    return { inputAccept: undefined, label: "All files" };
  }
  if (typeof accept === "string") {
    const label = accept
      .split(",")
      .map((part) => part.trim().replace(/^image\//i, "").replace(/^application\//i, "").toUpperCase())
      .filter(Boolean)
      .join(", ");
    return { inputAccept: accept, label: label || accept };
  }
  if (typeof accept === "object") {
    const mimes = Object.keys(accept);
    const exts = Object.values(accept).flat().filter(Boolean);
    const inputTokens = [...new Set([...mimes, ...exts])];
    const displayTokens = (exts.length > 0 ? exts : mimes).map((t) =>
      String(t).replace(/^\./, "").replace(/^application\//i, "").toUpperCase()
    );
    return {
      inputAccept: inputTokens.join(","),
      label: [...new Set(displayTokens)].join(", ") || "Supported files",
    };
  }
  return { inputAccept: undefined, label: "All files" };
}

export default function Dropzone({
  onFilesSelected,
  onFilesDrop,
  accept = "image/*",
  multiple = false,
  maxFiles,
  title = "Drop your files here",
  subtitle = "or browse from your device",
  badgeText,
  compact = false,
  className = "",
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const allowMultiple = multiple || (typeof maxFiles === "number" && maxFiles > 1);
  const handleFilesCallback = onFilesSelected || onFilesDrop;
  const { inputAccept, label: acceptLabel } = normalizeAccept(accept);

  const dispatchFiles = (fileList) => {
    const files = Array.from(fileList || []);
    if (files.length === 0 || !handleFilesCallback) return;
    handleFilesCallback(allowMultiple ? files : [files[0]]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    dispatchFiles(e.dataTransfer.files);
  };

  const handleFileInputChange = (e) => {
    dispatchFiles(e.target.files);
    e.target.value = "";
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`relative group cursor-pointer border-2 border-dashed rounded-2xl transition-all duration-300 flex flex-col items-center justify-center text-center shadow-lg ${
        isDragOver
          ? "border-[#FF3E18] bg-[#FF3E18]/10 scale-[1.01]"
          : "border-white/20 hover:border-[#FF3E18] bg-[#141414] hover:bg-[#1A1A1A]"
      } ${compact ? "p-4 min-h-[120px]" : "p-5 sm:p-8 md:p-12 min-h-[180px] sm:min-h-[220px]"} ${className}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={inputAccept}
        multiple={allowMultiple}
        onChange={handleFileInputChange}
        className="hidden"
      />

      <div
        className={`rounded-xl bg-black border border-white/20 text-[#FF3E18] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#FF3E18] group-hover:text-white group-hover:border-[#FF3E18] transition-all shadow-md ${
          compact ? "w-10 h-10 mb-2" : "w-14 h-14 sm:w-16 sm:h-16 mb-3 sm:mb-4"
        }`}
      >
        {compact ? <Plus className="w-5 h-5" /> : <UploadCloud className="w-7 h-7 sm:w-8 sm:h-8" />}
      </div>

      <h4
        className={`font-comic uppercase tracking-wider text-white ${
          compact ? "text-lg" : "text-xl sm:text-2xl"
        }`}
      >
        {title}
      </h4>
      <p
        className={`text-gray-400 font-medium font-sans mt-1 max-w-md ${
          compact ? "text-xs" : "text-xs sm:text-sm"
        }`}
      >
        {subtitle}
      </p>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-gray-400 font-medium font-sans">
        <span className="inline-flex items-center gap-1.5">
          <FileType className="w-3.5 h-3.5 text-[#FF3E18] shrink-0" />
          <span>Supported: {acceptLabel}</span>
        </span>
        <span className="hidden sm:inline">&bull;</span>
        <span className="text-[#FF3E18] font-bold">
          {badgeText || "100% In-Browser • Safe"}
        </span>
      </div>
    </div>
  );
}

import React, { useRef, useState } from "react";
import { UploadCloud, FileType, Plus } from "lucide-react";

export default function Dropzone({
  onFilesSelected,
  accept = "image/*",
  multiple = false,
  title = "Drop your files here",
  subtitle = "or browse from your device",
  compact = false,
  className = "",
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

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

    const files = Array.from(e.dataTransfer.files || []);
    if (files.length > 0) {
      onFilesSelected(multiple ? files : [files[0]]);
    }
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFilesSelected(multiple ? files : [files[0]]);
    }
    // reset input so the same file can be re-selected if needed
    e.target.value = "";
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`relative group cursor-pointer border-2 border-dashed rounded-2xl transition-all duration-200 flex flex-col items-center justify-center text-center ${
        isDragOver
          ? "border-indigo-400 bg-indigo-500/10 scale-[1.01]"
          : "border-slate-700/80 hover:border-indigo-500/60 bg-slate-800/40 hover:bg-slate-800/70"
      } ${compact ? "p-4 min-h-[120px]" : "p-8 md:p-12 min-h-[220px]"} ${className}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileInputChange}
        className="hidden"
      />

      <div
        className={`rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform ${
          compact ? "w-10 h-10 mb-2" : "w-16 h-16 mb-4"
        }`}
      >
        {compact ? <Plus className="w-5 h-5" /> : <UploadCloud className="w-8 h-8" />}
      </div>

      <h4 className={`font-semibold text-slate-100 ${compact ? "text-sm" : "text-lg"}`}>
        {title}
      </h4>
      <p className={`text-slate-400 mt-1 ${compact ? "text-xs" : "text-sm"}`}>
        {subtitle}
      </p>

      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
        <FileType className="w-3.5 h-3.5" />
        <span>Supported: {accept}</span>
        <span>&bull;</span>
        <span className="text-emerald-400 font-medium">100% In-Browser & Private</span>
      </div>
    </div>
  );
}

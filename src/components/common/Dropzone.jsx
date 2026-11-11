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
    e.target.value = "";
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`relative group cursor-pointer border-2 border-dashed rounded-3xl transition-all duration-300 flex flex-col items-center justify-center text-center shadow-sm ${
        isDragOver
          ? "border-[#FF4E02] bg-[#FF4E02]/5 scale-[1.01]"
          : "border-[#D6CA9E] hover:border-[#1400C3] bg-white/95 hover:bg-white"
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
        className={`rounded-2xl bg-[#1400C3]/10 border border-[#1400C3]/20 text-[#1400C3] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#FF4E02]/10 group-hover:text-[#FF4E02] group-hover:border-[#FF4E02]/30 transition-all ${
          compact ? "w-10 h-10 mb-2" : "w-16 h-16 mb-4"
        }`}
      >
        {compact ? <Plus className="w-5 h-5" /> : <UploadCloud className="w-8 h-8" />}
      </div>

      <h4 className={`font-black text-[#1400C3] ${compact ? "text-sm" : "text-lg"}`}>
        {title}
      </h4>
      <p className={`text-[#6B627F] font-medium mt-1 ${compact ? "text-xs" : "text-sm"}`}>
        {subtitle}
      </p>

      <div className="mt-3 flex items-center gap-2 text-xs text-[#8A819E] font-medium">
        <FileType className="w-3.5 h-3.5 text-[#1400C3]" />
        <span>Supported: {accept}</span>
        <span>&bull;</span>
        <span className="text-[#FF4E02] font-bold">100% In-Browser &bull; Safe</span>
      </div>
    </div>
  );
}

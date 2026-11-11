import JSZip from "jszip";
import { sanitizeFilename } from "./fileHelpers";

/**
 * Triggers browser download for a Blob
 */
export function downloadBlob(blob, filename) {
  if (!blob) return;
  const safeName = sanitizeFilename(filename, "docupix_download");
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = safeName;
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/**
 * Triggers browser download for a Data URL (base64)
 */
export function downloadDataUrl(dataUrl, filename) {
  if (!dataUrl) return;
  const safeName = sanitizeFilename(filename, "docupix_download.jpg");
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = safeName;
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Packages multiple files into a ZIP and triggers download
 * @param {Array<{ name: string, blob: Blob }>} files
 * @param {string} zipFilename
 */
export async function downloadMultipleAsZip(files, zipFilename = "docupix_files.zip") {
  if (!files || files.length === 0) return;
  const zip = new JSZip();

  files.forEach((file, index) => {
    const rawName = file.name || `file_${index + 1}`;
    const safeName = sanitizeFilename(rawName, `file_${index + 1}`);
    zip.file(safeName, file.blob);
  });

  const content = await zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });

  downloadBlob(content, sanitizeFilename(zipFilename, "docupix_archive.zip"));
}

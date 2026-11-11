import JSZip from "jszip";

/**
 * Triggers browser download for a Blob
 */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || "download";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/**
 * Triggers browser download for a Data URL (base64)
 */
export function downloadDataUrl(dataUrl, filename) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename || "download.jpg";
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
    const safeName = file.name || `file_${index + 1}`;
    zip.file(safeName, file.blob);
  });

  const content = await zip.generateAsync({ type: "blob" });
  downloadBlob(content, zipFilename);
}

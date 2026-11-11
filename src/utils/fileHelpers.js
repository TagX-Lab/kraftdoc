/**
 * File & Format Helper Utilities with Security & Memory Safeguards
 */

/**
 * Sanitize filename to prevent directory traversal or invalid characters
 */
export function sanitizeFilename(filename, fallback = "file") {
  if (!filename || typeof filename !== "string") return fallback;

  // Strip path traversal and dangerous characters
  const clean = filename
    .replace(/^.*[\\/]/, "") // strip directories
    .replace(/[<>:"/\\|?*]/g, "_") // strip illegal chars
    .trim();

  return clean.slice(0, 100) || fallback;
}

/**
 * Validate that uploaded file does not exceed safe client memory threshold (Default 50 MB)
 */
export function validateFileSize(file, maxMb = 50) {
  if (!file) return { valid: false, error: "No file provided.", message: "No file provided." };
  const maxBytes = maxMb * 1024 * 1024;
  if (file.size > maxBytes) {
    const msg = `File exceeds ${maxMb} MB. Please upload files under ${maxMb} MB for smooth browser processing.`;
    return {
      valid: false,
      error: msg,
      message: msg,
    };
  }
  return { valid: true };
}

/**
 * Safely revoke Object URLs to prevent client-side memory leaks
 */
export function revokeUrlSafe(url) {
  if (url && typeof url === "string" && url.startsWith("blob:")) {
    try {
      URL.revokeObjectURL(url);
    } catch {
      // Ignore
    }
  }
}

/**
 * Format raw bytes into human readable KB / MB / GB
 */
export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes <= 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Extract clean file extension without dot
 */
export function getFileExtension(filename) {
  if (!filename) return "";
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase();
}

/**
 * Replace extension of a filename with a new one
 */
export function changeFileExtension(filename, newExt) {
  const safe = sanitizeFilename(filename, "file");
  const dotIndex = safe.lastIndexOf(".");
  const base = dotIndex > 0 ? safe.substring(0, dotIndex) : safe;
  const cleanExt = newExt.startsWith(".") ? newExt.slice(1) : newExt;
  return `${base}.${cleanExt}`;
}

/**
 * Calculate percentage savings between original and compressed
 */
export function calculateSavings(originalBytes, newBytes) {
  if (!originalBytes || originalBytes <= 0 || !newBytes) return 0;
  const diff = originalBytes - newBytes;
  if (diff <= 0) return 0;
  return Math.round((diff / originalBytes) * 100);
}

/**
 * Read File as Data URL (Base64)
 */
export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Unable to read file as data URL."));
    reader.readAsDataURL(file);
  });
}

/**
 * Read File as ArrayBuffer
 */
export function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Unable to read file buffer."));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Parse string like "1-3, 5, 8-10" against totalPages
 */
export function parsePageRanges(rangeString, totalPages) {
  if (!rangeString || !rangeString.trim()) {
    return [];
  }
  const pagesSet = new Set();
  const parts = rangeString.split(",").map((s) => s.trim()).filter(Boolean);

  for (const part of parts) {
    if (part.includes("-")) {
      const [startStr, endStr] = part.split("-").map((s) => s.trim());
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);

      if (isNaN(start) || isNaN(end) || start < 1 || end > totalPages || start > end) {
        throw new Error(`Invalid range: "${part}". Valid pages are 1 to ${totalPages}.`);
      }

      for (let i = start; i <= end; i++) {
        pagesSet.add(i);
      }
    } else {
      const pageNum = parseInt(part, 10);
      if (isNaN(pageNum) || pageNum < 1 || pageNum > totalPages) {
        throw new Error(`Invalid page: "${part}". Valid pages are 1 to ${totalPages}.`);
      }
      pagesSet.add(pageNum);
    }
  }

  return Array.from(pagesSet).sort((a, b) => a - b);
}

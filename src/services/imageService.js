/**
 * Core In-Browser Image Manipulation Service
 * Pure client-side Canvas processing. No data leaves the browser.
 */

/**
 * Load an Image element from a Blob / File or Data URL
 */
export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(new Error("Failed to load image. File may be corrupted or unsupported."));
    if (typeof src === "string") {
      img.src = src;
    } else if (src instanceof Blob) {
      img.src = URL.createObjectURL(src);
    } else {
      reject(new Error("Invalid image source provided."));
    }
  });
}

/**
 * Convert HTMLCanvasElement to Blob
 */
export function canvasToBlob(canvas, mimeType = "image/jpeg", quality = 0.85) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Canvas to Blob conversion failed."));
        }
      },
      mimeType,
      quality
    );
  });
}

/**
 * Resizes an image onto a new canvas based on width, height and fit mode.
 * @param {HTMLImageElement} img
 * @param {number} targetWidth
 * @param {number} targetHeight
 * @param {'stretch' | 'contain' | 'cover'} fitMode
 * @param {string} backgroundColor (for contain mode padding)
 */
export function renderResizedCanvas(
  img,
  targetWidth,
  targetHeight,
  fitMode = "cover",
  backgroundColor = "#ffffff"
) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(targetWidth);
  canvas.height = Math.round(targetHeight);
  const ctx = canvas.getContext("2d");

  // Fill background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Enable high-quality image smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const srcW = img.naturalWidth || img.width;
  const srcH = img.naturalHeight || img.height;

  if (fitMode === "stretch") {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  } else if (fitMode === "contain") {
    const scale = Math.min(canvas.width / srcW, canvas.height / srcH);
    const drawW = srcW * scale;
    const drawH = srcH * scale;
    const offsetX = (canvas.width - drawW) / 2;
    const offsetY = (canvas.height - drawH) / 2;
    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
  } else {
    // "cover" (crops edges to fill without distortion)
    const scale = Math.max(canvas.width / srcW, canvas.height / srcH);
    const drawW = srcW * scale;
    const drawH = srcH * scale;
    const offsetX = (canvas.width - drawW) / 2;
    const offsetY = (canvas.height - drawH) / 2;
    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
  }

  return canvas;
}

/**
 * Compress an image to fit strictly under maxKb using iterative binary search.
 * If even lowest quality exceeds maxKb, iteratively downscales dimensions.
 */
export async function compressImageToTargetKb(
  imageSource,
  maxKb,
  options = {}
) {
  const {
    targetWidth,
    targetHeight,
    fitMode = "cover",
    mimeType = "image/jpeg",
    bgColor = "#ffffff",
  } = options;

  const targetBytes = maxKb * 1024;
  const img = await loadImage(imageSource);

  let currentWidth = targetWidth || img.naturalWidth;
  let currentHeight = targetHeight || img.naturalHeight;

  let bestBlob = null;
  let attempts = 0;
  const maxAttempts = 15;

  while (attempts < maxAttempts) {
    attempts++;
    const canvas = renderResizedCanvas(img, currentWidth, currentHeight, fitMode, bgColor);

    // Binary search for optimal quality between 0.05 and 0.95
    let minQuality = 0.05;
    let maxQuality = 0.95;
    let localBestBlob = null;

    for (let i = 0; i < 7; i++) {
      const midQuality = (minQuality + maxQuality) / 2;
      const testBlob = await canvasToBlob(canvas, mimeType, midQuality);

      if (testBlob.size <= targetBytes) {
        localBestBlob = testBlob;
        minQuality = midQuality; // Try higher quality
      } else {
        maxQuality = midQuality; // File too large, decrease quality
      }
    }

    if (localBestBlob && localBestBlob.size <= targetBytes) {
      bestBlob = localBestBlob;
      break;
    }

    // If lowest quality was still too large, downscale dimensions by 15% and retry
    currentWidth = Math.round(currentWidth * 0.85);
    currentHeight = Math.round(currentHeight * 0.85);

    if (currentWidth < 80 || currentHeight < 80) {
      // Smallest reasonable size reached
      const lowestBlob = await canvasToBlob(canvas, mimeType, 0.1);
      bestBlob = lowestBlob;
      break;
    }
  }

  return {
    blob: bestBlob,
    width: currentWidth,
    height: currentHeight,
    sizeBytes: bestBlob ? bestBlob.size : 0,
  };
}

/**
 * Standard Image Compressor by quality and scale factor
 */
export async function compressStandardImage(file, options = {}) {
  const {
    quality = 0.8,
    scale = 1.0,
    outputFormat = "image/jpeg",
  } = options;

  const img = await loadImage(file);
  const targetWidth = Math.max(1, Math.round(img.naturalWidth * scale));
  const targetHeight = Math.max(1, Math.round(img.naturalHeight * scale));

  const canvas = renderResizedCanvas(img, targetWidth, targetHeight, "stretch", "#ffffff");
  const blob = await canvasToBlob(canvas, outputFormat, quality);

  return {
    blob,
    width: targetWidth,
    height: targetHeight,
    originalSize: file.size,
    compressedSize: blob.size,
    mimeType: outputFormat,
  };
}

/**
 * Convert an image file to another format (e.g. PNG to WebP)
 */
export async function convertImageFormat(file, targetMimeType = "image/webp", quality = 0.9) {
  const img = await loadImage(file);
  const canvas = renderResizedCanvas(
    img,
    img.naturalWidth,
    img.naturalHeight,
    "stretch",
    targetMimeType === "image/png" ? "transparent" : "#ffffff"
  );

  const blob = await canvasToBlob(canvas, targetMimeType, quality);
  return blob;
}

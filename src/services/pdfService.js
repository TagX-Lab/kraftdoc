import { PDFDocument, degrees, rgb, StandardFonts } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.mjs?url";
import JSZip from "jszip";
import { canvasToBlob, loadImage, renderResizedCanvas } from "./imageService";

if (typeof window !== "undefined" && pdfjsLib?.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
}

/**
 * Standard Page Dimensions in points (72 points = 1 inch)
 */
export const PAGE_SIZES = {
  A4: { width: 595.28, height: 841.89 },
  LETTER: { width: 612.0, height: 792.0 },
};

/**
 * Ensure an image file/blob is converted to JPEG bytes suitable for pdf-lib embedding
 */
async function getJpegBytesFromImage(fileOrBlob) {
  const img = await loadImage(fileOrBlob);
  const canvas = renderResizedCanvas(img, img.naturalWidth, img.naturalHeight, "stretch", "#ffffff");
  const blob = await canvasToBlob(canvas, "image/jpeg", 0.92);
  const arrayBuffer = await blob.arrayBuffer();
  return {
    bytes: new Uint8Array(arrayBuffer),
    width: img.naturalWidth,
    height: img.naturalHeight,
  };
}

/**
 * Convert an array of Image files into a single PDF Document Blob
 * @param {Array<File|Blob>} imageFiles
 * @param {Object} options
 */
export async function imagesToPdf(imageFiles, options = {}) {
  const {
    pageSize = "A4", // 'A4' | 'LETTER' | 'FIT'
    orientation = "portrait", // 'portrait' | 'landscape' | 'auto'
    marginPt = 20, // margin in points
    fitMode = "contain", // 'contain' | 'cover'
  } = options;

  const pdfDoc = await PDFDocument.create();

  for (const file of imageFiles) {
    const { bytes, width: imgW, height: imgH } = await getJpegBytesFromImage(file);
    const embeddedImg = await pdfDoc.embedJpg(bytes);

    let pageW;
    let pageH;

    if (pageSize === "FIT") {
      pageW = imgW + marginPt * 2;
      pageH = imgH + marginPt * 2;
    } else {
      const baseSize = PAGE_SIZES[pageSize] || PAGE_SIZES.A4;
      const isLandscape =
        orientation === "landscape" ||
        (orientation === "auto" && imgW > imgH);

      pageW = isLandscape ? baseSize.height : baseSize.width;
      pageH = isLandscape ? baseSize.width : baseSize.height;
    }

    const page = pdfDoc.addPage([pageW, pageH]);

    const usableW = Math.max(10, pageW - marginPt * 2);
    const usableH = Math.max(10, pageH - marginPt * 2);

    let drawW;
    let drawH;

    if (fitMode === "cover") {
      const scale = Math.max(usableW / imgW, usableH / imgH);
      drawW = imgW * scale;
      drawH = imgH * scale;
    } else {
      // contain
      const scale = Math.min(usableW / imgW, usableH / imgH);
      drawW = imgW * scale;
      drawH = imgH * scale;
    }

    const drawX = marginPt + (usableW - drawW) / 2;
    const drawY = marginPt + (usableH - drawH) / 2;

    page.drawImage(embeddedImg, {
      x: drawX,
      y: drawY,
      width: drawW,
      height: drawH,
    });
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
}

/**
 * Merge multiple PDF ArrayBuffers into a single PDF Blob
 * @param {Array<ArrayBuffer>} pdfArrayBuffers
 */
export async function mergePdfs(pdfArrayBuffers) {
  if (!pdfArrayBuffers || pdfArrayBuffers.length === 0) {
    throw new Error("No PDF files provided to merge.");
  }

  const mergedPdf = await PDFDocument.create();

  for (const buffer of pdfArrayBuffers) {
    const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
    const copiedPages = await mergedPdf.copyPages(srcDoc, srcDoc.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const mergedBytes = await mergedPdf.save();
  return new Blob([mergedBytes], { type: "application/pdf" });
}

/**
 * Get total page count of a PDF ArrayBuffer
 */
export async function getPdfPageCount(pdfArrayBuffer) {
  const pdfDoc = await PDFDocument.load(pdfArrayBuffer, { ignoreEncryption: true });
  return pdfDoc.getPageCount();
}

/**
 * Split / Extract selected 1-based page numbers from a PDF into a new PDF Blob
 * @param {ArrayBuffer} pdfArrayBuffer
 * @param {Array<number>} pageNumbers - e.g. [1, 2, 5]
 */
export async function extractPdfPages(pdfArrayBuffer, pageNumbers) {
  if (!pageNumbers || pageNumbers.length === 0) {
    throw new Error("No page numbers specified for extraction.");
  }

  const srcDoc = await PDFDocument.load(pdfArrayBuffer, { ignoreEncryption: true });
  const total = srcDoc.getPageCount();
  const newPdf = await PDFDocument.create();

  // Convert to 0-based index and filter valid
  const zeroIndices = pageNumbers
    .map((num) => num - 1)
    .filter((idx) => idx >= 0 && idx < total);

  if (zeroIndices.length === 0) {
    throw new Error("Specified pages are outside the PDF page range.");
  }

  const copiedPages = await newPdf.copyPages(srcDoc, zeroIndices);
  copiedPages.forEach((page) => newPdf.addPage(page));

  const resultBytes = await newPdf.save();
  return new Blob([resultBytes], { type: "application/pdf" });
}

/**
 * Split a PDF into individual 1-page PDF blobs
 * @param {ArrayBuffer} pdfArrayBuffer
 * @returns {Promise<Array<{ name: string, blob: Blob }>>}
 */
export async function splitAllPdfPages(pdfArrayBuffer, baseName = "page") {
  const srcDoc = await PDFDocument.load(pdfArrayBuffer, { ignoreEncryption: true });
  const count = srcDoc.getPageCount();
  const results = [];

  for (let i = 0; i < count; i++) {
    const singleDoc = await PDFDocument.create();
    const [page] = await singleDoc.copyPages(srcDoc, [i]);
    singleDoc.addPage(page);
    const bytes = await singleDoc.save();
    results.push({
      name: `${baseName}_page_${i + 1}.pdf`,
      blob: new Blob([bytes], { type: "application/pdf" }),
    });
  }

  return results;
}

/**
 * Reorganize PDF: Apply rotation and page exclusions
 * @param {ArrayBuffer} pdfArrayBuffer
 * @param {Object} rotations - map of 0-based page index to rotation degrees (e.g. { 0: 90, 2: 180 })
 * @param {Set<number>} excludedPages - set of 0-based page indices to remove
 */
export async function organizePdfPages(pdfArrayBuffer, rotations = {}, excludedPages = new Set()) {
  const srcDoc = await PDFDocument.load(pdfArrayBuffer, { ignoreEncryption: true });
  const total = srcDoc.getPageCount();
  const newDoc = await PDFDocument.create();

  const validIndices = [];
  for (let i = 0; i < total; i++) {
    if (!excludedPages.has(i)) {
      validIndices.push(i);
    }
  }

  if (validIndices.length === 0) {
    throw new Error("Cannot remove all pages from the PDF. At least 1 page must remain.");
  }

  const copiedPages = await newDoc.copyPages(srcDoc, validIndices);

  copiedPages.forEach((page, newIdx) => {
    const originalIdx = validIndices[newIdx];
    const addRotation = rotations[originalIdx] || 0;
    if (addRotation !== 0) {
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees((currentRotation + addRotation) % 360));
    }
    newDoc.addPage(page);
  });

  const bytes = await newDoc.save();
  return new Blob([bytes], { type: "application/pdf" });
}

/**
 * Add text watermark across all pages of a PDF
 * @param {ArrayBuffer} pdfArrayBuffer
 * @param {Object} options
 */
export async function watermarkPdf(pdfArrayBuffer, options = {}) {
  const {
    text = "CONFIDENTIAL",
    fontSize = 48,
    opacity = 0.25,
    rotation = 45,
    color = "#FF4E02",
  } = options;

  const pdfDoc = await PDFDocument.load(pdfArrayBuffer, { ignoreEncryption: true });
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const pages = pdfDoc.getPages();

  const hex = color.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16) / 255 || 0.8;
  const g = parseInt(hex.substring(2, 4), 16) / 255 || 0.2;
  const b = parseInt(hex.substring(4, 6), 16) / 255 || 0.1;

  for (const page of pages) {
    const { width, height } = page.getSize();
    const textWidth = helveticaFont.widthOfTextAtSize(text, fontSize);
    const textHeight = helveticaFont.heightAtSize(fontSize);

    const rad = (rotation * Math.PI) / 180;
    const x = width / 2 - (textWidth / 2) * Math.cos(rad) + (textHeight / 2) * Math.sin(rad);
    const y = height / 2 - (textWidth / 2) * Math.sin(rad) - (textHeight / 2) * Math.cos(rad);

    page.drawText(text, {
      x,
      y,
      size: fontSize,
      font: helveticaFont,
      color: rgb(r, g, b),
      opacity,
      rotate: degrees(rotation),
    });
  }

  const bytes = await pdfDoc.save();
  return new Blob([bytes], { type: "application/pdf" });
}

/**
 * Add Page Numbers to all pages of a PDF
 * @param {ArrayBuffer} pdfArrayBuffer
 * @param {Object} options
 */
export async function addPageNumbersToPdf(pdfArrayBuffer, options = {}) {
  const {
    format = "Page {n} of {total}",
    position = "bottom-center",
    fontSize = 10,
    marginPt = 25,
    startNumber = 1,
  } = options;

  const pdfDoc = await PDFDocument.load(pdfArrayBuffer, { ignoreEncryption: true });
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();
  const total = pages.length;

  pages.forEach((page, index) => {
    const currentNum = startNumber + index;
    const label = format
      .replace("{n}", String(currentNum))
      .replace("{total}", String(total));

    const { width, height } = page.getSize();
    const textWidth = helveticaFont.widthOfTextAtSize(label, fontSize);

    let x = marginPt;
    let y = marginPt;

    if (position === "bottom-center") {
      x = (width - textWidth) / 2;
      y = marginPt;
    } else if (position === "bottom-right") {
      x = width - textWidth - marginPt;
      y = marginPt;
    } else if (position === "bottom-left") {
      x = marginPt;
      y = marginPt;
    } else if (position === "top-center") {
      x = (width - textWidth) / 2;
      y = height - marginPt - fontSize;
    } else if (position === "top-right") {
      x = width - textWidth - marginPt;
      y = height - marginPt - fontSize;
    }

    page.drawText(label, {
      x,
      y,
      size: fontSize,
      font: helveticaFont,
      color: rgb(0.15, 0.15, 0.2),
    });
  });

  const bytes = await pdfDoc.save();
  return new Blob([bytes], { type: "application/pdf" });
}

/**
 * Render all or selected PDF pages to images using PDF.js
 * @param {ArrayBuffer} pdfArrayBuffer
 * @param {Object} options
 */
export async function convertPdfPagesToImages(pdfArrayBuffer, options = {}) {
  const {
    format = "image/png",
    scale = 2.0,
    quality = 0.92,
    onProgress = null,
  } = options;

  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(pdfArrayBuffer),
    useSystemFonts: true,
  });

  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;
  const pages = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    if (format === "image/jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const renderContext = {
      canvasContext: ctx,
      viewport,
    };

    await page.render(renderContext).promise;

    const blob = await new Promise((resolve) => {
      canvas.toBlob((b) => resolve(b), format, quality);
    });

    const dataUrl = canvas.toDataURL(format, quality);

    pages.push({
      pageNumber: i,
      blob,
      dataUrl,
      width: canvas.width,
      height: canvas.height,
    });

    if (onProgress) {
      onProgress(i, numPages);
    }
  }

  return pages;
}

/**
 * Package array of image objects into a downloadable ZIP file
 * @param {Array<{ pageNumber: number, blob: Blob }>} images
 * @param {string} baseName
 * @param {string} ext
 */
export async function packageImagesAsZip(images, baseName = "page", ext = "png") {
  const zip = new JSZip();
  images.forEach((img) => {
    zip.file(`${baseName}_page_${img.pageNumber}.${ext}`, img.blob);
  });
  return zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });
}

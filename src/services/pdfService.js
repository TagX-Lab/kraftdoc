import { PDFDocument, degrees } from "pdf-lib";
import { canvasToBlob, loadImage, renderResizedCanvas } from "./imageService";

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

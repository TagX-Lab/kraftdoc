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
  A3: { width: 841.89, height: 1190.55 },
  A4: { width: 595.28, height: 841.89 },
  A5: { width: 419.53, height: 595.28 },
  LETTER: { width: 612.0, height: 792.0 },
  LEGAL: { width: 612.0, height: 1008.0 },
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

/**
 * Stamp signature onto a specific page of a PDF
 * @param {ArrayBuffer} pdfArrayBuffer
 * @param {Object} options
 */
export async function signPdf(pdfArrayBuffer, options = {}) {
  const {
    signatureDataUrl,
    pageNumber = 1,
    xPercent = 50,
    yPercent = 20,
    widthPercent = 30,
  } = options;

  if (!signatureDataUrl) {
    throw new Error("No signature provided.");
  }

  const pdfDoc = await PDFDocument.load(pdfArrayBuffer, { ignoreEncryption: true });
  const total = pdfDoc.getPageCount();
  const pageIdx = Math.max(0, Math.min(pageNumber - 1, total - 1));
  const page = pdfDoc.getPage(pageIdx);
  const { width: pWidth, height: pHeight } = page.getSize();

  // Convert dataUrl to png bytes
  const base64Data = signatureDataUrl.split(",")[1];
  const binaryString = atob(base64Data);
  const sigBytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    sigBytes[i] = binaryString.charCodeAt(i);
  }

  const embeddedSig = await pdfDoc.embedPng(sigBytes);
  const sigDims = embeddedSig.scale(1);

  // Compute dimensions preserving aspect ratio
  const targetWidth = (pWidth * widthPercent) / 100;
  const targetHeight = (sigDims.height / sigDims.width) * targetWidth;

  const targetX = (pWidth * xPercent) / 100 - targetWidth / 2;
  const targetY = (pHeight * yPercent) / 100 - targetHeight / 2;

  page.drawImage(embeddedSig, {
    x: Math.max(0, Math.min(targetX, pWidth - targetWidth)),
    y: Math.max(0, Math.min(targetY, pHeight - targetHeight)),
    width: targetWidth,
    height: targetHeight,
  });

  const bytes = await pdfDoc.save();
  return new Blob([bytes], { type: "application/pdf" });
}

/**
 * Crop PDF pages by margins in points
 * @param {ArrayBuffer} pdfArrayBuffer
 * @param {Object} margins
 */
export async function cropPdfPages(pdfArrayBuffer, margins = {}) {
  const { top = 20, bottom = 20, left = 20, right = 20 } = margins;

  const pdfDoc = await PDFDocument.load(pdfArrayBuffer, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();

  for (const page of pages) {
    const { width, height } = page.getSize();
    const newX = left;
    const newY = bottom;
    const newW = Math.max(50, width - left - right);
    const newH = Math.max(50, height - top - bottom);

    page.setCropBox(newX, newY, newW, newH);
  }

  const bytes = await pdfDoc.save();
  return new Blob([bytes], { type: "application/pdf" });
}

/**
 * Flatten all form fields and annotations in a PDF
 * @param {ArrayBuffer} pdfArrayBuffer
 */
export async function flattenPdf(pdfArrayBuffer) {
  const pdfDoc = await PDFDocument.load(pdfArrayBuffer, { ignoreEncryption: true });

  try {
    const form = pdfDoc.getForm();
    form.flatten();
  } catch {
    // Form may not exist or already flat
  }

  const bytes = await pdfDoc.save();
  return new Blob([bytes], { type: "application/pdf" });
}

/**
 * Permanently blackout / redact sensitive rectangular areas on PDF pages
 * @param {ArrayBuffer} pdfArrayBuffer
 * @param {Array<{ pageIndex: number, xPercent: number, yPercent: number, widthPercent: number, heightPercent: number }>} redactions
 */
export async function redactPdf(pdfArrayBuffer, redactions = []) {
  const pdfDoc = await PDFDocument.load(pdfArrayBuffer, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();

  for (const item of redactions) {
    const page = pages[item.pageIndex];
    if (!page) continue;

    const { width, height } = page.getSize();
    const rX = (item.xPercent * width) / 100;
    const rY = height - (item.yPercent * height) / 100 - (item.heightPercent * height) / 100;
    const rW = (item.widthPercent * width) / 100;
    const rH = (item.heightPercent * height) / 100;

    page.drawRectangle({
      x: rX,
      y: rY,
      width: rW,
      height: rH,
      color: rgb(0, 0, 0),
    });
  }

  const bytes = await pdfDoc.save();
  return new Blob([bytes], { type: "application/pdf" });
}

/**
 * Compress PDF by downscaling embedded pages into optimized canvas JPEG streams
 * @param {ArrayBuffer} pdfArrayBuffer
 * @param {number} quality (0.5 to 0.85)
 */
export async function compressPdfDocument(pdfArrayBuffer, quality = 0.75, onProgress = null) {
  const renderedPages = await convertPdfPagesToImages(pdfArrayBuffer, {
    format: "image/jpeg",
    scale: 1.5,
    quality,
    onProgress,
  });

  const newDoc = await PDFDocument.create();

  for (const p of renderedPages) {
    const embeddedImg = await newDoc.embedJpg(await p.blob.arrayBuffer());
    const page = newDoc.addPage([p.width, p.height]);
    page.drawImage(embeddedImg, {
      x: 0,
      y: 0,
      width: p.width,
      height: p.height,
    });
  }

  const bytes = await newDoc.save({ useObjectStreams: true });
  return new Blob([bytes], { type: "application/pdf" });
}

/**
 * Read PDF document metadata fields
 * @param {ArrayBuffer} pdfArrayBuffer
 */
export async function readPdfMetadata(pdfArrayBuffer) {
  const pdfDoc = await PDFDocument.load(pdfArrayBuffer, { ignoreEncryption: true });
  return {
    title: pdfDoc.getTitle() || "",
    author: pdfDoc.getAuthor() || "",
    subject: pdfDoc.getSubject() || "",
    keywords: (pdfDoc.getKeywords() || []).join(", "),
    creator: pdfDoc.getCreator() || "",
    producer: pdfDoc.getProducer() || "",
    creationDate: pdfDoc.getCreationDate() ? pdfDoc.getCreationDate().toISOString() : "",
    modificationDate: pdfDoc.getModificationDate() ? pdfDoc.getModificationDate().toISOString() : "",
  };
}

/**
 * Update or sanitize PDF document metadata
 * @param {ArrayBuffer} pdfArrayBuffer
 * @param {Object} metadata
 * @param {boolean} sanitize
 */
export async function writePdfMetadata(pdfArrayBuffer, metadata = {}, sanitize = false) {
  const pdfDoc = await PDFDocument.load(pdfArrayBuffer, { ignoreEncryption: true });

  if (sanitize) {
    pdfDoc.setTitle("");
    pdfDoc.setAuthor("");
    pdfDoc.setSubject("");
    pdfDoc.setKeywords([]);
    pdfDoc.setCreator("");
    pdfDoc.setProducer("");
  } else {
    if (metadata.title !== undefined) pdfDoc.setTitle(metadata.title);
    if (metadata.author !== undefined) pdfDoc.setAuthor(metadata.author);
    if (metadata.subject !== undefined) pdfDoc.setSubject(metadata.subject);
    if (metadata.keywords !== undefined) {
      const kw = metadata.keywords.split(",").map((s) => s.trim()).filter(Boolean);
      pdfDoc.setKeywords(kw);
    }
    if (metadata.creator !== undefined) pdfDoc.setCreator(metadata.creator);
    if (metadata.producer !== undefined) pdfDoc.setProducer(metadata.producer);
  }

  const bytes = await pdfDoc.save();
  return new Blob([bytes], { type: "application/pdf" });
}

/**
 * Resize all pages of a PDF to a target standard size
 * @param {ArrayBuffer} pdfArrayBuffer
 * @param {string} targetSize - 'A4' | 'LETTER' | 'A3' | 'A5' | 'LEGAL'
 * @param {string} orientation - 'portrait' | 'landscape'
 */
export async function resizePdfDocument(pdfArrayBuffer, targetSize = "A4", orientation = "portrait") {
  const srcDoc = await PDFDocument.load(pdfArrayBuffer, { ignoreEncryption: true });
  const newDoc = await PDFDocument.create();

  const baseSize = PAGE_SIZES[targetSize] || PAGE_SIZES.A4;
  const isLandscape = orientation === "landscape";
  const targetW = isLandscape ? baseSize.height : baseSize.width;
  const targetH = isLandscape ? baseSize.width : baseSize.height;

  const pageCount = srcDoc.getPageCount();

  for (let i = 0; i < pageCount; i++) {
    const [embedded] = await newDoc.embedPdf(srcDoc, [i]);
    const { width: origW, height: origH } = embedded;

    const page = newDoc.addPage([targetW, targetH]);

    // Scale to fit target dimensions while preserving aspect ratio
    const scale = Math.min((targetW - 40) / origW, (targetH - 40) / origH);
    const drawW = origW * scale;
    const drawH = origH * scale;

    const drawX = (targetW - drawW) / 2;
    const drawY = (targetH - drawH) / 2;

    page.drawPage(embedded, {
      x: drawX,
      y: drawY,
      width: drawW,
      height: drawH,
    });
  }

  const bytes = await newDoc.save();
  return new Blob([bytes], { type: "application/pdf" });
}

/**
 * Convert PDF to N-Up Pages Per Sheet (2-on-1 or 4-on-1)
 * @param {ArrayBuffer} pdfArrayBuffer
 * @param {number} mode - 2 | 4
 */
export async function convertPagesPerSheet(pdfArrayBuffer, mode = 2) {
  const srcDoc = await PDFDocument.load(pdfArrayBuffer, { ignoreEncryption: true });
  const newDoc = await PDFDocument.create();
  const pageCount = srcDoc.getPageCount();

  if (mode === 2) {
    // 2-on-1: A4 Landscape sheet with 2 portrait pages side-by-side
    const sheetW = PAGE_SIZES.A4.height; // 841.89
    const sheetH = PAGE_SIZES.A4.width;  // 595.28
    const halfW = sheetW / 2;

    for (let i = 0; i < pageCount; i += 2) {
      const sheet = newDoc.addPage([sheetW, sheetH]);
      const [p1] = await newDoc.embedPdf(srcDoc, [i]);
      const scale1 = Math.min((halfW - 30) / p1.width, (sheetH - 40) / p1.height);
      const w1 = p1.width * scale1;
      const h1 = p1.height * scale1;
      sheet.drawPage(p1, {
        x: (halfW - w1) / 2 + 10,
        y: (sheetH - h1) / 2,
        width: w1,
        height: h1,
      });

      if (i + 1 < pageCount) {
        const [p2] = await newDoc.embedPdf(srcDoc, [i + 1]);
        const scale2 = Math.min((halfW - 30) / p2.width, (sheetH - 40) / p2.height);
        const w2 = p2.width * scale2;
        const h2 = p2.height * scale2;
        sheet.drawPage(p2, {
          x: halfW + (halfW - w2) / 2 - 10,
          y: (sheetH - h2) / 2,
          width: w2,
          height: h2,
        });
      }
    }
  } else {
    // 4-on-1: A4 Portrait sheet with 2x2 grid
    const sheetW = PAGE_SIZES.A4.width;  // 595.28
    const sheetH = PAGE_SIZES.A4.height; // 841.89
    const cellW = sheetW / 2;
    const cellH = sheetH / 2;

    for (let i = 0; i < pageCount; i += 4) {
      const sheet = newDoc.addPage([sheetW, sheetH]);

      for (let j = 0; j < 4 && i + j < pageCount; j++) {
        const [p] = await newDoc.embedPdf(srcDoc, [i + j]);
        const scale = Math.min((cellW - 24) / p.width, (cellH - 24) / p.height);
        const w = p.width * scale;
        const h = p.height * scale;

        const col = j % 2;
        const row = Math.floor(j / 2); // 0 = top, 1 = bottom

        const posX = col * cellW + (cellW - w) / 2;
        const posY = (1 - row) * cellH + (cellH - h) / 2;

        sheet.drawPage(p, {
          x: posX,
          y: posY,
          width: w,
          height: h,
        });
      }
    }
  }

  const bytes = await newDoc.save();
  return new Blob([bytes], { type: "application/pdf" });
}

/**
 * Extract plain text content from all pages of a PDF using PDF.js
 * @param {ArrayBuffer} pdfArrayBuffer
 * @param {Function} onProgress
 */
export async function extractTextFromPdfDocument(pdfArrayBuffer, onProgress = null) {
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(pdfArrayBuffer),
    useSystemFonts: true,
  });

  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  const pageTexts = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((item) => item.str);
    const text = strings.join(" ");

    pageTexts.push({
      pageNumber: i,
      text,
    });

    if (onProgress) {
      onProgress(i, numPages);
    }
  }

  const fullText = pageTexts
    .map((p) => `--- PAGE ${p.pageNumber} ---\n\n${p.text}\n`)
    .join("\n\n");

  return { fullText, pageTexts, totalPages: numPages };
}

/**
 * Repair and rebuild corrupted or malformed PDF streams
 * @param {ArrayBuffer} pdfArrayBuffer
 */
export async function repairPdfDocument(pdfArrayBuffer) {
  const srcDoc = await PDFDocument.load(pdfArrayBuffer, {
    ignoreEncryption: true,
    parseSpeed: 0,
  });

  const cleanDoc = await PDFDocument.create();
  const count = srcDoc.getPageCount();
  const indices = Array.from({ length: count }, (_, i) => i);

  const copied = await cleanDoc.copyPages(srcDoc, indices);
  copied.forEach((p) => cleanDoc.addPage(p));

  const bytes = await cleanDoc.save({ useObjectStreams: true });
  return new Blob([bytes], { type: "application/pdf" });
}

/**
 * Generate a visual professional invoice PDF directly in-browser
 * @param {Object} data
 */
export async function generateInvoicePdf(data = {}) {
  const {
    companyName = "My Business Ltd",
    companyEmail = "contact@business.com",
    clientName = "Client Name",
    clientEmail = "client@example.com",
    invoiceNumber = "INV-001",
    invoiceDate = new Date().toISOString().split("T")[0],
    dueDate = "",
    currency = "$",
    items = [{ description: "Service / Product Item", qty: 1, rate: 100 }],
    taxPercent = 10,
    notes = "Thank you for your business!",
  } = data;

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([PAGE_SIZES.A4.width, PAGE_SIZES.A4.height]);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const { width, height } = page.getSize();

  // Top Header Banner
  page.drawRectangle({
    x: 0,
    y: height - 120,
    width,
    height: 120,
    color: rgb(0.08, 0, 0.76), // Bluebonnet #1400C3
  });

  page.drawText("INVOICE", {
    x: 50,
    y: height - 60,
    size: 28,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  page.drawText(`#${invoiceNumber}`, {
    x: 50,
    y: height - 85,
    size: 13,
    font: fontRegular,
    color: rgb(1, 0.7, 0.5),
  });

  // Company lockup (right aligned)
  page.drawText(companyName, {
    x: width - 240,
    y: height - 55,
    size: 14,
    font: fontBold,
    color: rgb(1, 1, 1),
  });
  page.drawText(companyEmail, {
    x: width - 240,
    y: height - 75,
    size: 10,
    font: fontRegular,
    color: rgb(0.9, 0.9, 1),
  });

  // Client Details & Dates Row
  page.drawText("BILLED TO:", {
    x: 50,
    y: height - 160,
    size: 10,
    font: fontBold,
    color: rgb(1, 0.31, 0.01), // Blaze Orange
  });
  page.drawText(clientName, {
    x: 50,
    y: height - 180,
    size: 13,
    font: fontBold,
    color: rgb(0.08, 0, 0.76),
  });
  page.drawText(clientEmail, {
    x: 50,
    y: height - 198,
    size: 10,
    font: fontRegular,
    color: rgb(0.3, 0.3, 0.4),
  });

  page.drawText(`Issue Date: ${invoiceDate}`, {
    x: width - 200,
    y: height - 175,
    size: 10,
    font: fontRegular,
    color: rgb(0.2, 0.2, 0.3),
  });
  if (dueDate) {
    page.drawText(`Due Date: ${dueDate}`, {
      x: width - 200,
      y: height - 195,
      size: 10,
      font: fontBold,
      color: rgb(1, 0.31, 0.01),
    });
  }

  // Items Table Header
  const tableY = height - 240;
  page.drawRectangle({
    x: 45,
    y: tableY - 5,
    width: width - 90,
    height: 25,
    color: rgb(0.96, 0.94, 0.82), // Soft cream
  });

  page.drawText("ITEM DESCRIPTION", { x: 55, y: tableY + 3, size: 9, font: fontBold, color: rgb(0.08, 0, 0.76) });
  page.drawText("QTY", { x: width - 240, y: tableY + 3, size: 9, font: fontBold, color: rgb(0.08, 0, 0.76) });
  page.drawText("RATE", { x: width - 170, y: tableY + 3, size: 9, font: fontBold, color: rgb(0.08, 0, 0.76) });
  page.drawText("AMOUNT", { x: width - 100, y: tableY + 3, size: 9, font: fontBold, color: rgb(0.08, 0, 0.76) });

  let rowY = tableY - 30;
  let subtotal = 0;

  items.forEach((item) => {
    const qty = Number(item.qty) || 1;
    const rate = Number(item.rate) || 0;
    const lineTotal = qty * rate;
    subtotal += lineTotal;

    page.drawText(String(item.description || "Item"), { x: 55, y: rowY, size: 10, font: fontRegular, color: rgb(0.1, 0.1, 0.2) });
    page.drawText(String(qty), { x: width - 235, y: rowY, size: 10, font: fontRegular, color: rgb(0.1, 0.1, 0.2) });
    page.drawText(`${currency}${rate.toFixed(2)}`, { x: width - 175, y: rowY, size: 10, font: fontRegular, color: rgb(0.1, 0.1, 0.2) });
    page.drawText(`${currency}${lineTotal.toFixed(2)}`, { x: width - 105, y: rowY, size: 10, font: fontBold, color: rgb(0.08, 0, 0.76) });

    rowY -= 24;
  });

  const taxAmount = (subtotal * (Number(taxPercent) || 0)) / 100;
  const grandTotal = subtotal + taxAmount;

  // Divider Line
  rowY -= 10;
  page.drawLine({
    start: { x: width - 240, y: rowY + 15 },
    end: { x: width - 50, y: rowY + 15 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });

  page.drawText(`Subtotal:`, { x: width - 200, y: rowY, size: 10, font: fontRegular, color: rgb(0.3, 0.3, 0.4) });
  page.drawText(`${currency}${subtotal.toFixed(2)}`, { x: width - 105, y: rowY, size: 10, font: fontRegular, color: rgb(0.1, 0.1, 0.2) });

  rowY -= 20;
  page.drawText(`Tax (${taxPercent}%):`, { x: width - 200, y: rowY, size: 10, font: fontRegular, color: rgb(0.3, 0.3, 0.4) });
  page.drawText(`${currency}${taxAmount.toFixed(2)}`, { x: width - 105, y: rowY, size: 10, font: fontRegular, color: rgb(0.1, 0.1, 0.2) });

  rowY -= 25;
  page.drawRectangle({
    x: width - 220,
    y: rowY - 6,
    width: 170,
    height: 28,
    color: rgb(1, 0.31, 0.01), // Blaze Orange Total Badge
  });
  page.drawText(`TOTAL:`, { x: width - 210, y: rowY + 3, size: 11, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText(`${currency}${grandTotal.toFixed(2)}`, { x: width - 110, y: rowY + 3, size: 12, font: fontBold, color: rgb(1, 1, 1) });

  // Bottom Notes
  if (notes) {
    page.drawText("NOTES / PAYMENT INSTRUCTIONS", { x: 50, y: 100, size: 9, font: fontBold, color: rgb(0.08, 0, 0.76) });
    page.drawText(notes, { x: 50, y: 82, size: 9, font: fontRegular, color: rgb(0.3, 0.3, 0.4) });
  }

  // Footer Tagline
  page.drawText("Generated with DocuPix by TAGX Labs™ • 100% Client-Side", {
    x: 50,
    y: 35,
    size: 8,
    font: fontRegular,
    color: rgb(0.6, 0.6, 0.6),
  });

  const bytes = await pdfDoc.save();
  return new Blob([bytes], { type: "application/pdf" });
}

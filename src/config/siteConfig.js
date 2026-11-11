/**
 * Site Configuration
 * Production-ready metadata, branding, and feature definitions.
 */

export const siteConfig = {
  name: "DocuPix",
  tagline: "Free In-Browser Image & PDF Suite",
  description:
    "100% private, client-side tools to compress images, resize govt exam photos, convert images to PDF, and merge or split PDFs without uploading files to any server.",
  domain: "https://docupix.pages.dev",
  author: "DocuPix Team",
  keywords: [
    "image compressor",
    "govt exam photo resizer",
    "tnpsc photo compressor",
    "upsc photo signature resize",
    "jpg to pdf",
    "images to pdf",
    "merge pdf online",
    "split pdf",
    "client-side pdf tools",
    "webp converter",
  ],
  supportEmail: "support@docupix.tools",
  features: [
    {
      id: "exam-resizer",
      title: "Govt Exam Photo & Signature Resizer",
      badge: "Most Popular",
      badgeColor: "emerald",
      shortDesc: "Resize & compress photos to exact KB and dimensions for TNPSC, SSC, UPSC, and IBPS.",
      icon: "UserCheck",
      route: "exam-resizer",
    },
    {
      id: "compress-image",
      title: "Smart Image Compressor",
      badge: "Up to 90% savings",
      badgeColor: "blue",
      shortDesc: "Reduce image file size dramatically without noticeable quality loss.",
      icon: "Minimize2",
      route: "compress-image",
    },
    {
      id: "images-to-pdf",
      title: "Images to PDF Converter",
      badge: "Batch Convert",
      badgeColor: "indigo",
      shortDesc: "Convert multiple JPG, PNG, and WebP images into a single clean PDF document.",
      icon: "FileText",
      route: "images-to-pdf",
    },
    {
      id: "pdf-merge-split",
      title: "PDF Merge & Splitter",
      badge: "High Privacy",
      badgeColor: "violet",
      shortDesc: "Combine multiple PDFs into one or extract specific page ranges instantly.",
      icon: "Layers",
      route: "pdf-merge-split",
    },
    {
      id: "image-converter",
      title: "Image Format Converter",
      badge: "Fast & Batch",
      badgeColor: "amber",
      shortDesc: "Convert images freely between WebP, PNG, and JPG formats in seconds.",
      icon: "RefreshCw",
      route: "image-converter",
    },
    {
      id: "pdf-organizer",
      title: "PDF Page Organizer & Rotator",
      badge: "New",
      badgeColor: "rose",
      shortDesc: "Rotate upside-down pages, delete unwanted pages, and reorder your PDF.",
      icon: "RotateCw",
      route: "pdf-organizer",
    },
  ],
};

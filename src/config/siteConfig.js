/**
 * Site & Company Configuration
 * Official Product of TAGX Labs™
 */

export const siteConfig = {
  name: "KraftDoc",
  tagline: "Free In-Browser Image & PDF Suite",
  description:
    "100% private, client-side tools to compress images, resize photos, convert image formats, and merge or split PDFs without uploading files to any server.",
  domain: "https://kraftdoc.pages.dev",
  author: "TAGX Labs™",

  // Company Information
  company: {
    name: "TAGX Labs™",
    tagline: "Next-Gen Software Products & Bespoke Engineering",
    website: "https://tagx-lab.github.io/tagx-labs-website/",
    instagram: "https://www.instagram.com/tagx_lab",
    github: "https://github.com/tagx-lab",
    otherProducts: [
      {
        name: "MousePilot™",
        url: "https://tagx-lab.github.io/mousepilot-website/",
        desc: "Tactical Native Windows Software Utility",
      },
    ],
  },

  keywords: [
    "TAGX Labs",
    "KraftDoc",
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
  supportEmail: "tagxlabs@gmail.com",
  donate: {
    upiId: "",
    upiPayeeName: "TAGX Labs",
    buyMeACoffeeUrl: "",
    githubUrl: "https://github.com/tagx-lab",
  },
  features: [
    {
      id: "exam-resizer",
      title: "Photo & Image Resizer",
      badge: "Most Popular",
      badgeColor: "emerald",
      shortDesc: "Resize & compress photos to exact KB and pixel dimensions freely in your browser.",
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

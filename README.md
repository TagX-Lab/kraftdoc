# DocuPix — Free In-Browser Image & PDF Suite

> **100% Client-Side Image Compression & PDF Utilities with Google AdSense Monetization.**
> No backend, ₹0 server bills, 100% privacy (zero files uploaded to any server).

---

## 🚀 Key Features

1. **Govt Exam Photo & Signature Resizer:**
   - Pre-configured specifications for **TNPSC, SSC, UPSC, IBPS, GATE, and Passport photos**.
   - Custom dimension mode (Width &times; Height in px).
   - Strict target KB limiter (e.g., automatically scales and compresses to remain strictly under 50 KB or 20 KB).

2. **Smart Image Compressor:**
   - Compress multiple images simultaneously.
   - Quality slider (10% to 100%) and resolution scale slider (25% to 100%).
   - Direct WebP, JPG, or PNG output.
   - Batch download as a single ZIP archive.

3. **Images to PDF Converter:**
   - Convert JPG, PNG, and WebP images to a consolidated PDF document.
   - Reorder images, choose page size (A4, Letter, Fit to image), and customize margins.

4. **PDF Merge & Split Tool:**
   - **Merge:** Combine 2 or more PDFs with real-time page count extraction.
   - **Split:** Extract custom page ranges (e.g. `1-3, 5, 8-10`) or extract all pages as individual PDFs in a ZIP.

5. **Image Format Converter:**
   - Convert between WebP, PNG, and JPG in seconds.

6. **PDF Page Organizer & Rotator:**
   - Rotate upside-down scanned pages (90°, 180°, 270°) and delete unwanted pages.

7. **Monetization Architecture (Google AdSense Ready):**
   - Top and bottom responsive banner slots.
   - Vertical sticky sidebar ad container.
   - High-CTR 3-second download countdown modal.
   - Centralized `src/config/adConfig.js` to enable ads in 10 seconds.

8. **Google AdSense Approval Ready Pages:**
   - About Us, Privacy Policy (explicit zero-server and cookie disclosures), Terms of Service, and Contact Form.

---

## 📁 Architecture & File Structure

```
docupix/
├── public/
│   ├── favicon.svg              # Brand icon
│   └── robots.txt               # SEO Crawler directives
├── src/
│   ├── components/
│   │   ├── ads/                 # Monetization components
│   │   │   ├── AdBanner.jsx     # Responsive AdSense banner
│   │   │   ├── AdSidebar.jsx    # High-CTR sidebar skyscraper
│   │   │   └── DownloadAdModal.jsx # Interstitial countdown ad modal
│   │   ├── common/              # Atomic reusable UI components
│   │   │   ├── Badge.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Dropzone.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ToolHeader.jsx
│   │   └── layout/
│   │       └── ToolLayout.jsx   # Standard page wrapper with ad slots
│   ├── config/
│   │   ├── adConfig.js          # Google AdSense publisher & slot IDs
│   │   ├── examPresets.js       # Official exam dimension & KB limits
│   │   └── siteConfig.js        # Brand metadata and tool list
│   ├── context/
│   │   └── ToastContext.jsx     # Global toast feedback notifications
│   ├── pages/                   # Micro-pages (lazy-loaded for speed)
│   │   ├── AboutPage.jsx
│   │   ├── ContactPage.jsx
│   │   ├── ExamPhotoResizerPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── ImageCompressorPage.jsx
│   │   ├── ImageConverterPage.jsx
│   │   ├── ImagesToPdfPage.jsx
│   │   ├── PdfMergeSplitPage.jsx
│   │   ├── PdfOrganizerPage.jsx
│   │   ├── PrivacyPolicyPage.jsx
│   │   └── TermsPage.jsx
│   ├── services/                # Pure client-side processing services
│   │   ├── imageService.js      # Canvas resize, binary search KB compressor
│   │   └── pdfService.js        # pdf-lib integration (merge, split, images-to-pdf)
│   ├── utils/
│   │   ├── downloadHelpers.js   # Blob downloader & JSZip archiver
│   │   └── fileHelpers.js       # Byte formatting, extensions, range parsers
│   ├── App.jsx                  # Main router with code-splitting
│   ├── index.css                # Tailwind CSS v4 directives
│   └── main.jsx                 # React entry point
├── index.html                   # SEO & OpenGraph meta tags
├── package.json
└── vite.config.js               # Vite 8 + Tailwind configuration
```

---

## 🛠️ How to Run Locally

```bash
# Navigate to project
cd E:\Projects\docupix

# Start Vite development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 💰 How to Enable Google AdSense

Once your Google AdSense account is approved:

1. Open `src/config/adConfig.js`
2. Update the configuration:
   ```js
   export const adConfig = {
     enabled: true, // Switch to true
     publisherId: "ca-pub-YOUR_ACTUAL_PUBLISHER_ID",
     slots: {
       topBanner: "YOUR_TOP_SLOT_ID",
       bottomBanner: "YOUR_BOTTOM_SLOT_ID",
       sidebarSticky: "YOUR_SIDEBAR_SLOT_ID",
       downloadModal: "YOUR_MODAL_SLOT_ID",
     },
     downloadCountdownSeconds: 3,
     showDevPlaceholders: false,
   };
   ```
3. In `index.html`, uncomment the AdSense script tag and insert your publisher ID:
   ```html
   <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ACTUAL_PUBLISHER_ID" crossorigin="anonymous"></script>
   ```

---

## 🌐 Deploy for ₹0 (Free Hosting Forever)

Because DocuPix is 100% client-side React:
- **Cloudflare Pages:** Connect Git repo &rarr; Build command `npm run build` &rarr; Output directory `dist`.
- **Vercel:** Run `vercel` or connect GitHub &rarr; auto-detected Vite project.
- **Netlify:** Connect GitHub &rarr; Build command `npm run build` &rarr; Publish directory `dist`.

import React, { useState, useEffect, lazy, Suspense } from "react";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import ScrollProgress from "./components/common/ScrollProgress";
import OfflineBanner from "./components/common/OfflineBanner";
import ServerBusyModal from "./components/common/ServerBusyModal";
import { ToastProvider } from "./context/ToastContext";
import { useNetworkStatus } from "./hooks/useNetworkStatus";
import { Loader2 } from "lucide-react";

// Home is loaded eagerly for instant first-paint
import HomePage from "./pages/HomePage";

// Code-split tool pages on demand to reduce initial bundle size
const ExamPhotoResizerPage = lazy(() => import("./pages/image/ExamPhotoResizerPage"));
const ImageCompressorPage = lazy(() => import("./pages/image/ImageCompressorPage"));
const ImageConverterPage = lazy(() => import("./pages/image/ImageConverterPage"));

const ImagesToPdfPage = lazy(() => import("./pages/pdf/ImagesToPdfPage"));
const PdfToImagesPage = lazy(() => import("./pages/pdf/PdfToImagesPage"));
const PdfMergeSplitPage = lazy(() => import("./pages/pdf/PdfMergeSplitPage"));
const PdfOrganizerPage = lazy(() => import("./pages/pdf/PdfOrganizerPage"));
const WatermarkPdfPage = lazy(() => import("./pages/pdf/WatermarkPdfPage"));
const PageNumbersPdfPage = lazy(() => import("./pages/pdf/PageNumbersPdfPage"));
const CompressPdfPage = lazy(() => import("./pages/pdf/CompressPdfPage"));
const SignPdfPage = lazy(() => import("./pages/pdf/SignPdfPage"));
const CropPdfPage = lazy(() => import("./pages/pdf/CropPdfPage"));
const FlattenPdfPage = lazy(() => import("./pages/pdf/FlattenPdfPage"));
const BlackenPdfPage = lazy(() => import("./pages/pdf/BlackenPdfPage"));
const ComparePdfPage = lazy(() => import("./pages/pdf/ComparePdfPage"));
const EditPdfMetadataPage = lazy(() => import("./pages/pdf/EditPdfMetadataPage"));
const ResizePdfPage = lazy(() => import("./pages/pdf/ResizePdfPage"));
const PagesPerSheetPage = lazy(() => import("./pages/pdf/PagesPerSheetPage"));
const PdfExtractTextPage = lazy(() => import("./pages/pdf/PdfExtractTextPage"));
const CameraToPdfPage = lazy(() => import("./pages/pdf/CameraToPdfPage"));
const CaptureScreenToPdfPage = lazy(() => import("./pages/pdf/CaptureScreenToPdfPage"));
const RepairPdfPage = lazy(() => import("./pages/pdf/RepairPdfPage"));
const CreateInvoicePage = lazy(() => import("./pages/pdf/CreateInvoicePage"));

const AboutPage = lazy(() => import("./pages/legal/AboutPage"));
const DonatePage = lazy(() => import("./pages/DonatePage"));
const PrivacyPolicyPage = lazy(() => import("./pages/legal/PrivacyPolicyPage"));
const TermsPage = lazy(() => import("./pages/legal/TermsPage"));
const ContactPage = lazy(() => import("./pages/legal/ContactPage"));

function PageLoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      <span className="text-xs text-slate-400 font-medium">Loading tool...</span>
    </div>
  );
}

export default function App() {
  const [currentRoute, setCurrentRoute] = useState("home");
  const { isServerBusy, setIsServerBusy, checkServerStatus } = useNetworkStatus();

  // Sync route with URL hash on load and hash change
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "").trim();
      if (hash && hash !== "all-tools") {
        setCurrentRoute(hash);
      } else {
        if (hash === "all-tools") {
          window.history.replaceState(null, "", window.location.pathname);
        }
        setCurrentRoute("home");
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handleHashChange);
    };
  }, []);

  const navigateTo = (route, { skipScrollTop = false } = {}) => {
    setCurrentRoute(route);
    if (route === "home") {
      if (window.location.hash) {
        window.history.pushState(null, "", window.location.pathname);
      }
    } else {
      window.location.hash = `#${route}`;
    }
    if (!skipScrollTop) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderCurrentPage = () => {
    switch (currentRoute) {
      case "exam-resizer":
        return <ExamPhotoResizerPage onBack={() => navigateTo("home")} />;
      case "compress-image":
        return <ImageCompressorPage onBack={() => navigateTo("home")} />;
      case "images-to-pdf":
        return <ImagesToPdfPage onBack={() => navigateTo("home")} />;
      case "pdf-to-images":
        return <PdfToImagesPage onBack={() => navigateTo("home")} />;
      case "pdf-merge-split":
        return <PdfMergeSplitPage onBack={() => navigateTo("home")} />;
      case "image-converter":
        return <ImageConverterPage onBack={() => navigateTo("home")} />;
      case "pdf-organizer":
        return <PdfOrganizerPage onBack={() => navigateTo("home")} />;
      case "pdf-watermark":
        return <WatermarkPdfPage onBack={() => navigateTo("home")} />;
      case "pdf-page-numbers":
        return <PageNumbersPdfPage onBack={() => navigateTo("home")} />;
      case "pdf-compress":
        return <CompressPdfPage onBack={() => navigateTo("home")} />;
      case "pdf-sign":
        return <SignPdfPage onBack={() => navigateTo("home")} />;
      case "pdf-crop":
        return <CropPdfPage onBack={() => navigateTo("home")} />;
      case "pdf-flatten":
        return <FlattenPdfPage onBack={() => navigateTo("home")} />;
      case "pdf-blacken":
        return <BlackenPdfPage onBack={() => navigateTo("home")} />;
      case "pdf-compare":
        return <ComparePdfPage onBack={() => navigateTo("home")} />;
      case "pdf-metadata":
        return <EditPdfMetadataPage onBack={() => navigateTo("home")} />;
      case "pdf-page-size":
        return <ResizePdfPage onBack={() => navigateTo("home")} />;
      case "pdf-pages-per-sheet":
        return <PagesPerSheetPage onBack={() => navigateTo("home")} />;
      case "pdf-extract-text":
        return <PdfExtractTextPage onBack={() => navigateTo("home")} />;
      case "camera-to-pdf":
        return <CameraToPdfPage onBack={() => navigateTo("home")} />;
      case "screen-to-pdf":
        return <CaptureScreenToPdfPage onBack={() => navigateTo("home")} />;
      case "pdf-repair":
        return <RepairPdfPage onBack={() => navigateTo("home")} />;
      case "create-invoice":
        return <CreateInvoicePage onBack={() => navigateTo("home")} />;
      case "donate":
        return <DonatePage onBack={() => navigateTo("home")} onNavigate={navigateTo} />;
      case "about":
        return <AboutPage onBack={() => navigateTo("home")} />;
      case "privacy-policy":
        return <PrivacyPolicyPage onBack={() => navigateTo("home")} />;
      case "terms":
        return <TermsPage onBack={() => navigateTo("home")} />;
      case "contact":
        return <ContactPage onBack={() => navigateTo("home")} />;
      case "home":
      default:
        return <HomePage onNavigate={navigateTo} />;
    }
  };

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-[#0C0C0C] text-white selection:bg-[#FF3E18] selection:text-white">
        <ScrollProgress />
        <OfflineBanner />
        <Navbar currentRoute={currentRoute} onNavigate={navigateTo} />

        <main className="flex-1 w-full">
          <Suspense fallback={<PageLoadingFallback />}>
            {renderCurrentPage()}
          </Suspense>
        </main>

        <Footer onNavigate={navigateTo} />

        <ServerBusyModal
          isOpen={isServerBusy}
          onClose={() => setIsServerBusy(false)}
          onRetry={checkServerStatus}
        />
      </div>
    </ToastProvider>
  );
}

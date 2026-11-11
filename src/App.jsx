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
const ExamPhotoResizerPage = lazy(() => import("./pages/ExamPhotoResizerPage"));
const ImageCompressorPage = lazy(() => import("./pages/ImageCompressorPage"));
const ImagesToPdfPage = lazy(() => import("./pages/ImagesToPdfPage"));
const PdfMergeSplitPage = lazy(() => import("./pages/PdfMergeSplitPage"));
const ImageConverterPage = lazy(() => import("./pages/ImageConverterPage"));
const PdfOrganizerPage = lazy(() => import("./pages/PdfOrganizerPage"));
const WatermarkPdfPage = lazy(() => import("./pages/WatermarkPdfPage"));
const PageNumbersPdfPage = lazy(() => import("./pages/PageNumbersPdfPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));

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
      if (hash) {
        setCurrentRoute(hash);
      } else {
        setCurrentRoute("home");
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigateTo = (route) => {
    setCurrentRoute(route);
    window.location.hash = route === "home" ? "" : `#${route}`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderCurrentPage = () => {
    switch (currentRoute) {
      case "exam-resizer":
        return <ExamPhotoResizerPage onBack={() => navigateTo("home")} />;
      case "compress-image":
        return <ImageCompressorPage onBack={() => navigateTo("home")} />;
      case "images-to-pdf":
        return <ImagesToPdfPage onBack={() => navigateTo("home")} />;
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
      <div className="min-h-screen flex flex-col bg-[#F8F2D8] text-[#1400C3] selection:bg-[#FF4E02] selection:text-white">
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

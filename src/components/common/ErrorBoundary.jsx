import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import Button from "./Button";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("DocuPix ErrorBoundary caught an exception:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.hash = "";
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8F2D8] flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full p-8 rounded-3xl bg-white border-2 border-[#E5DCB8] shadow-2xl space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-[#FF4E02]/15 text-[#FF4E02] flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8 stroke-[2.2]" />
            </div>

            <h2 className="text-2xl font-black text-[#1400C3]">
              Something went wrong
            </h2>

            <p className="text-sm text-[#3B3355] font-semibold">
              An unexpected error occurred while processing your file. Your data is safe on your device.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={this.handleReset}
                variant="orange"
                size="md"
                icon={RefreshCw}
              >
                Reload DocuPix
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

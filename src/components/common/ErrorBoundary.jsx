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
    console.error("KraftDoc ErrorBoundary caught an exception:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.hash = "";
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const isChunkError =
        this.state.error?.name === "ChunkLoadError" ||
        this.state.error?.message?.includes("dynamically imported module") ||
        this.state.error?.message?.includes("Failed to fetch");

      return (
        <div className="min-h-screen bg-[#0C0C0C] text-white flex items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full p-8 rounded-2xl bg-[#141414] border-2 border-white/20 shadow-2xl space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-[#FF3E18]/15 border border-[#FF3E18]/30 text-[#FF3E18] flex items-center justify-center mx-auto shadow-lg">
              <AlertTriangle className="w-8 h-8 stroke-[2.2]" />
            </div>

            <h2 className="font-comic text-3xl text-white uppercase tracking-wider">
              {isChunkError ? "Server Temporarily Busy" : "Something went wrong"}
            </h2>

            <p className="text-sm text-gray-300 font-medium leading-relaxed">
              {isChunkError
                ? "The server is momentarily busy or network connection dropped. Please reconnect and reload the tool."
                : "An unexpected error occurred while processing your file. Your data is safe on your device."}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={this.handleReset}
                variant="orange"
                size="md"
                icon={RefreshCw}
              >
                Reload KraftDoc
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

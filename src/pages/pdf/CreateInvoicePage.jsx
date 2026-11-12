import React, { useState } from "react";
import {
  Receipt,
  Download,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle2,
  Building,
  User,
} from "lucide-react";
import ToolLayout from "../../components/layout/ToolLayout";
import Button from "../../components/common/Button";
import DownloadAdModal from "../../components/ads/DownloadAdModal";
import { generateInvoicePdf } from "../../services/pdfService";
import { downloadBlob } from "../../utils/downloadHelpers";
import { formatBytes } from "../../utils/fileHelpers";
import { useToast } from "../../hooks/useToast";

export default function CreateInvoicePage({ onBack }) {
  const { showToast } = useToast();

  const [companyName, setCompanyName] = useState("My Business Studio");
  const [companyEmail, setCompanyEmail] = useState("billing@business.com");

  const [clientName, setClientName] = useState("Acme Corp");
  const [clientEmail, setClientEmail] = useState("accounts@acme.com");

  const [invoiceNumber, setInvoiceNumber] = useState("INV-2026-001");
  const [invoiceDate, setInvoiceDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState("");
  const [currency, setCurrency] = useState("$");

  const [items, setItems] = useState([
    { id: 1, description: "Professional Web Consulting & Design", qty: 1, rate: 450 },
    { id: 2, description: "Document Optimization & Digital Assets", qty: 2, rate: 120 },
  ]);

  const [taxPercent, setTaxPercent] = useState(10);
  const [notes, setNotes] = useState("Thank you for choosing us! Payment due within 15 days.");

  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState(null);
  const [showAdModal, setShowAdModal] = useState(false);

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      { id: Date.now(), description: "New Service / Item", qty: 1, rate: 100 },
    ]);
    setResultBlob(null);
  };

  const handleRemoveItem = (id) => {
    if (items.length <= 1) {
      showToast("At least 1 item is required.", "warning");
      return;
    }
    setItems((prev) => prev.filter((it) => it.id !== id));
    setResultBlob(null);
  };

  const handleItemChange = (id, field, value) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, [field]: value } : it))
    );
    setResultBlob(null);
  };

  const subtotal = items.reduce(
    (sum, it) => sum + (Number(it.qty) || 0) * (Number(it.rate) || 0),
    0
  );
  const taxAmount = (subtotal * (Number(taxPercent) || 0)) / 100;
  const grandTotal = subtotal + taxAmount;

  const handleGenerateInvoice = async () => {
    setIsProcessing(true);
    try {
      const blob = await generateInvoicePdf({
        companyName,
        companyEmail,
        clientName,
        clientEmail,
        invoiceNumber,
        invoiceDate,
        dueDate,
        currency,
        items,
        taxPercent,
        notes,
      });
      setResultBlob(blob);
      showToast("Professional Invoice PDF generated!", "success");
    } catch (err) {
      showToast(err.message || "Failed to generate invoice.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob) return;
    downloadBlob(resultBlob, `${invoiceNumber.toLowerCase()}_invoice.pdf`);
  };

  return (
    <ToolLayout
      title="Visual Invoice PDF Maker"
      description="Create, customize, and export clean vector invoices and billing receipts in seconds without signup or server logging."
      badge="PDF Invoice Generator"
      onBack={onBack}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Main Invoice Form Paper */}
        <div className="rounded-2xl sm:rounded-[36px] bg-white border-2 border-[#1400C3]/15 p-4 sm:p-10 shadow-lg space-y-6 sm:space-y-8">
          {/* Top Bar: Title & Number */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/5 pb-5 sm:pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#1400C3] text-white flex items-center justify-center shadow-xs shrink-0">
                <Receipt className="w-6 h-6 text-[#F8F2D8]" />
              </div>
              <div>
                <h2 className="font-display text-xl sm:text-2xl text-[#1400C3]">INVOICE MAKER</h2>
                <span className="text-xs font-semibold text-[#6B627F]">
                  Generates vector-crisp A4 billing document
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-[#6B627F] mb-1">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => {
                    setCurrency(e.target.value);
                    setResultBlob(null);
                  }}
                  className="px-3 py-2 rounded-xl border-2 border-[#E5DCB8] font-bold text-xs text-[#1400C3] focus:outline-none focus:border-[#1400C3]"
                >
                  <option value="$">$ USD</option>
                  <option value="₹">₹ INR</option>
                  <option value="€">€ EUR</option>
                  <option value="£">£ GBP</option>
                  <option value="C$">C$ CAD</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-[#6B627F] mb-1">
                  Invoice #
                </label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => {
                    setInvoiceNumber(e.target.value);
                    setResultBlob(null);
                  }}
                  className="px-3.5 py-2 rounded-xl border-2 border-[#E5DCB8] font-bold text-xs text-[#1400C3] focus:outline-none focus:border-[#1400C3] w-28 sm:w-36"
                />
              </div>
            </div>
          </div>

          {/* Two Columns: From & To */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Sender Details */}
            <div className="p-5 rounded-2xl bg-[#F8F2D8]/50 border border-[#E5DCB8] space-y-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase text-[#1400C3]">
                <Building className="w-4 h-4 text-[#FF4E02]" />
                <span>Your Business Details</span>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#6B627F] mb-1">Company / Your Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => {
                    setCompanyName(e.target.value);
                    setResultBlob(null);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#E5DCB8] text-xs font-bold text-[#1400C3]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#6B627F] mb-1">Email / Contact</label>
                <input
                  type="text"
                  value={companyEmail}
                  onChange={(e) => {
                    setCompanyEmail(e.target.value);
                    setResultBlob(null);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#E5DCB8] text-xs font-bold text-[#1400C3]"
                />
              </div>
            </div>

            {/* Client Details */}
            <div className="p-5 rounded-2xl bg-[#EAF2FD]/50 border border-[#C2D8FA] space-y-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase text-[#1400C3]">
                <User className="w-4 h-4 text-[#1400C3]" />
                <span>Billed To (Client)</span>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#6B627F] mb-1">Client Name / Org</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => {
                    setClientName(e.target.value);
                    setResultBlob(null);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#C2D8FA] text-xs font-bold text-[#1400C3]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#6B627F] mb-1">Client Email</label>
                <input
                  type="text"
                  value={clientEmail}
                  onChange={(e) => {
                    setClientEmail(e.target.value);
                    setResultBlob(null);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#C2D8FA] text-xs font-bold text-[#1400C3]"
                />
              </div>
            </div>
          </div>

          {/* Dates Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1400C3] mb-1">Issue Date</label>
              <input
                type="date"
                value={invoiceDate}
                onChange={(e) => {
                  setInvoiceDate(e.target.value);
                  setResultBlob(null);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DCB8] text-xs font-bold text-[#1400C3]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1400C3] mb-1">Due Date (Optional)</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value);
                  setResultBlob(null);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DCB8] text-xs font-bold text-[#1400C3]"
              />
            </div>
          </div>

          {/* Line Items Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm uppercase text-[#1400C3]">Line Items</h3>
              <button
                type="button"
                onClick={handleAddItem}
                className="px-3 py-1.5 rounded-xl border border-[#1400C3] text-xs font-bold text-[#1400C3] hover:bg-[#F8F2D8] transition-colors cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="grid grid-cols-12 gap-2 items-center p-2.5 sm:p-3 rounded-2xl bg-slate-50 border border-slate-200"
                >
                  <div className="col-span-12 sm:col-span-7">
                    <input
                      type="text"
                      placeholder="Item description"
                      value={it.description}
                      onChange={(e) => handleItemChange(it.id, "description", e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-[#1400C3]"
                    />
                  </div>

                  <div className="col-span-4 sm:col-span-2">
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={it.qty}
                      onChange={(e) => handleItemChange(it.id, "qty", parseInt(e.target.value) || 1)}
                      className="w-full px-2 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-[#1400C3] text-center"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Rate"
                      value={it.rate}
                      onChange={(e) => handleItemChange(it.id, "rate", parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-[#1400C3] text-right font-mono"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1 flex justify-end sm:justify-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(it.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                      title="Remove row"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals & Notes Section */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4 border-t border-black/5 items-start">
            <div className="md:col-span-7 space-y-2">
              <label className="block text-xs font-bold text-[#1400C3]">Notes &amp; Payment Terms</label>
              <textarea
                value={notes}
                onChange={(e) => {
                  setNotes(e.target.value);
                  setResultBlob(null);
                }}
                rows={3}
                className="w-full p-3 rounded-xl border border-[#E5DCB8] text-xs font-semibold text-[#1400C3] focus:outline-none focus:border-[#1400C3]"
              />
            </div>

            <div className="md:col-span-5 rounded-2xl bg-[#F8F2D8]/70 border border-[#E5DCB8] p-4 space-y-2">
              <div className="flex justify-between text-xs font-semibold text-[#6B627F]">
                <span>Subtotal:</span>
                <span className="font-mono text-[#1400C3] font-bold">{currency}{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between text-xs font-semibold text-[#6B627F]">
                <span>Tax %:</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={taxPercent}
                  onChange={(e) => {
                    setTaxPercent(parseFloat(e.target.value) || 0);
                    setResultBlob(null);
                  }}
                  className="w-16 px-2 py-1 rounded-lg border border-[#E5DCB8] text-right text-xs font-bold font-mono"
                />
              </div>

              <div className="pt-2 border-t border-black/10 flex justify-between items-center text-sm font-black text-[#1400C3]">
                <span>TOTAL:</span>
                <span className="text-base text-[#FF4E02] font-mono">{currency}{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-black/5">
            <div className="text-xs font-bold text-[#1400C3]">
              Zero server logging. Invoice is computed and rendered in device memory.
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {!resultBlob ? (
                <Button
                  onClick={handleGenerateInvoice}
                  disabled={isProcessing}
                  isLoading={isProcessing}
                  variant="primary"
                  className="w-full sm:w-auto"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  <span>Generate Invoice PDF</span>
                </Button>
              ) : (
                <Button
                  onClick={() => setShowAdModal(true)}
                  variant="primary"
                  className="w-full sm:w-auto bg-[#FF4E02] hover:bg-[#e04502] text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  <span>Download Invoice PDF</span>
                </Button>
              )}
            </div>
          </div>

          {/* Success Download Card */}
          {resultBlob && (
            <div className="rounded-3xl bg-[#EBF7ED] border-2 border-[#C2E7C9] p-6 text-center space-y-3 animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-white text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="font-bold text-sm text-[#1400C3]">
                Invoice PDF Generated!
              </div>
              <p className="text-xs text-[#6B627F]">
                Processed size: {formatBytes(resultBlob.size)} • Standard vector A4 invoice ready.
              </p>
            </div>
          )}
        </div>
      </div>

      {showAdModal && (
        <DownloadAdModal
          isOpen={showAdModal}
          onClose={() => setShowAdModal(false)}
          onDownload={() => {
            setShowAdModal(false);
            handleDownload();
          }}
          fileName={`${invoiceNumber.toLowerCase()}_invoice.pdf`}
          fileSize={resultBlob?.size}
        />
      )}
    </ToolLayout>
  );
}

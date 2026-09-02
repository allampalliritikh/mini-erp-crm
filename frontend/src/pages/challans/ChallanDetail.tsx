import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getChallan, confirmChallan, cancelChallan, downloadChallanPdf } from "../../api/challan.api";

export default function ChallanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [challan, setChallan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) fetchChallan(id);
  }, [id]);

  async function fetchChallan(challanId: string) {
    setLoading(true);
    try {
      const res = await getChallan(challanId);
      setChallan(res.data.data);
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm() {
    if (!id) return;
    setError("");
    setActionLoading(true);
    try {
      await confirmChallan(id);
      fetchChallan(id);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to confirm challan");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCancel() {
    if (!id) return;
    setError("");
    setActionLoading(true);
    try {
      await cancelChallan(id);
      fetchChallan(id);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to cancel challan");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDownloadPdf() {
    if (!id) return;
    setError("");
    setPdfLoading(true);
    try {
      const res = await downloadChallanPdf(id);
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `challan-${challan.challanNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError("Failed to download PDF");
    } finally {
      setPdfLoading(false);
    }
  }

  if (loading) return <div className="p-8 text-gray-500">Loading...</div>;
  if (!challan) return <div className="p-8 text-gray-500">Challan not found.</div>;

  const statusColor: Record<string, string> = {
    DRAFT: "bg-yellow-100 text-yellow-700",
    CONFIRMED: "bg-green-100 text-green-700",
    CANCELLED: "bg-gray-200 text-gray-600",
  };

  const total = challan.items.reduce(
    (sum: number, item: any) => sum + Number(item.unitPrice) * item.quantity,
    0
  );

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">{challan.challanNumber}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {new Date(challan.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 text-sm rounded ${statusColor[challan.status]}`}>
            {challan.status}
          </span>
          <button
            onClick={handleDownloadPdf}
            disabled={pdfLoading}
            className="border border-gray-300 text-sm px-3 py-1.5 rounded hover:bg-gray-50 disabled:opacity-50"
          >
            {pdfLoading ? "Preparing..." : "Download PDF"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">{error}</div>
      )}

      <div className="bg-white rounded shadow-sm p-6 mb-6">
        <h2 className="text-sm text-gray-500 mb-1">Customer</h2>
        <p className="font-medium">{challan.customer.name}</p>
        <p className="text-sm text-gray-500">{challan.customer.mobile}</p>
      </div>

      <div className="bg-white rounded shadow-sm p-6 mb-6">
        <h2 className="text-sm text-gray-500 mb-3">Items</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-600">
              <th className="pb-2">Product</th>
              <th className="pb-2">SKU</th>
              <th className="pb-2">Qty</th>
              <th className="pb-2">Unit Price</th>
              <th className="pb-2">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {challan.items.map((item: any) => (
              <tr key={item.id} className="border-b">
                <td className="py-2">{item.productName}</td>
                <td className="py-2">{item.productSku}</td>
                <td className="py-2">{item.quantity}</td>
                <td className="py-2">₹{item.unitPrice}</td>
                <td className="py-2">₹{(Number(item.unitPrice) * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-right font-semibold mt-3 pt-3 border-t">
          Total: ₹{total.toFixed(2)}
        </div>
      </div>

      {challan.status === "DRAFT" && (
        <div className="flex gap-3">
          <button
            onClick={handleConfirm}
            disabled={actionLoading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {actionLoading ? "Confirming..." : "Confirm Challan"}
          </button>
          <button
            onClick={handleCancel}
            disabled={actionLoading}
            className="border border-red-300 text-red-600 px-4 py-2 rounded hover:bg-red-50 disabled:opacity-50"
          >
            Cancel Challan
          </button>
        </div>
      )}

      <button
        onClick={() => navigate("/challans")}
        className="mt-6 text-sm text-gray-500 hover:underline block"
      >
        ← Back to Challans
      </button>
    </div>
  );
}
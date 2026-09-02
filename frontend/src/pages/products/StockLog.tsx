import { useEffect, useState, FormEvent } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";
import { getProduct } from "../../api/product.api";

export default function StockLog() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [quantity, setQuantity] = useState("");
  const [movementType, setMovementType] = useState("IN");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) fetchData(id);
  }, [id]);

  async function fetchData(productId: string) {
    setLoading(true);
    try {
      const [productRes, logsRes] = await Promise.all([
        getProduct(productId),
        api.get("/stock/logs", { params: { productId } }),
      ]);
      setProduct(productRes.data.data);
      setLogs(logsRes.data.data);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdjust(e: FormEvent) {
    e.preventDefault();
    if (!id || !quantity) return;
    setError("");
    setSubmitting(true);
    try {
      await api.post("/stock/adjust", {
        productId: id,
        quantity: Number(quantity),
        movementType,
        reason: reason || undefined,
      });
      setQuantity("");
      setReason("");
      fetchData(id);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to adjust stock");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="p-8 text-gray-500">Loading...</div>;
  if (!product) return <div className="p-8 text-gray-500">Product not found.</div>;

  return (
    <div className="p-8 max-w-3xl">
      <Link to="/products" className="text-sm text-gray-500 hover:underline">
        ← Back to Products
      </Link>

      <div className="flex justify-between items-center mt-2 mb-6">
        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-gray-500 text-sm">SKU: {product.sku}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Current Stock</p>
          <p
            className={`text-2xl font-bold ${
              product.stock <= product.minStock ? "text-red-600" : ""
            }`}
          >
            {product.stock}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">{error}</div>
      )}

      <form onSubmit={handleAdjust} className="bg-white p-6 rounded shadow-sm mb-6">
        <h2 className="text-sm font-medium mb-3">Adjust Stock</h2>
        <div className="flex gap-3 items-end flex-wrap">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Type</label>
            <select
              value={movementType}
              onChange={(e) => setMovementType(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="IN">IN (Add stock)</option>
              <option value="OUT">OUT (Remove stock)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Quantity</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              className="border rounded px-3 py-2 w-28"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs text-gray-500 mb-1">Reason</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Restock from supplier"
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Apply"}
          </button>
        </div>
      </form>

      <h2 className="text-lg font-semibold mb-3">Movement History</h2>
      <table className="w-full bg-white rounded shadow-sm">
        <thead>
          <tr className="border-b text-left text-sm text-gray-600">
            <th className="p-3">Type</th>
            <th className="p-3">Quantity</th>
            <th className="p-3">Reason</th>
            <th className="p-3">By</th>
            <th className="p-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="border-b">
              <td className="p-3">
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    log.movementType === "IN"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {log.movementType}
                </span>
              </td>
              <td className="p-3">{log.quantity}</td>
              <td className="p-3">{log.reason || "-"}</td>
              <td className="p-3">{log.createdBy?.name || "-"}</td>
              <td className="p-3 text-gray-500 text-sm">
                {new Date(log.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
          {logs.length === 0 && (
            <tr>
              <td colSpan={5} className="p-6 text-center text-gray-400">
                No stock movements yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
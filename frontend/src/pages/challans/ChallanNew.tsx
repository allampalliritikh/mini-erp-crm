import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { getCustomers } from "../../api/customer.api";
import { getProducts } from "../../api/product.api";
import { createChallan } from "../../api/challan.api";

interface ItemRow {
  productId: string;
  quantity: number;
}

export default function ChallanNew() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState<ItemRow[]>([{ productId: "", quantity: 1 }]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCustomers({}).then((res) => setCustomers(res.data.data.customers));
    getProducts({}).then((res) => setProducts(res.data.data.products));
  }, []);

  function updateItem(index: number, field: keyof ItemRow, value: string | number) {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  }

  function addRow() {
    setItems([...items, { productId: "", quantity: 1 }]);
  }

  function removeRow(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  function getProductPrice(productId: string) {
    const p = products.find((p) => p.id === productId);
    return p ? Number(p.unitPrice) : 0;
  }

  const totalAmount = items.reduce(
    (sum, item) => sum + getProductPrice(item.productId) * item.quantity,
    0
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!customerId) {
      setError("Please select a customer");
      return;
    }
    const validItems = items.filter((i) => i.productId && i.quantity > 0);
    if (validItems.length === 0) {
      setError("Please add at least one product");
      return;
    }

    setLoading(true);
    try {
      const res = await createChallan({ customerId, items: validItems });
      navigate(`/challans/${res.data.data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">New Challan</h1>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Customer *</label>
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Select customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.mobile})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Items *</label>
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="flex gap-2 items-center">
                <select
                  value={item.productId}
                  onChange={(e) => updateItem(index, "productId", e.target.value)}
                  className="flex-1 border rounded px-3 py-2"
                  required
                >
                  <option value="">Select product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.sku}) — ₹{p.unitPrice} — Stock: {p.stock}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => updateItem(index, "quantity", Number(e.target.value))}
                  className="w-24 border rounded px-3 py-2"
                  required
                />
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRow(index)}
                    className="text-red-600 text-sm hover:underline px-2"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addRow}
            className="text-blue-600 text-sm hover:underline mt-2"
          >
            + Add another product
          </button>
        </div>

        <div className="text-right text-lg font-semibold border-t pt-4">
          Estimated Total: ₹{totalAmount.toFixed(2)}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save as Draft"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/challans")}
            className="border px-4 py-2 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
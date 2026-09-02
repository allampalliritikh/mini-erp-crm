import { useState, useEffect, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProduct, createProduct, updateProduct } from "../../api/product.api";

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    unitPrice: "",
    stock: "0",
    minStock: "0",
    location: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      getProduct(id).then((res) => {
        const p = res.data.data;
        setForm({
          name: p.name || "",
          sku: p.sku || "",
          category: p.category || "",
          unitPrice: String(p.unitPrice ?? ""),
          stock: String(p.stock ?? 0),
          minStock: String(p.minStock ?? 0),
          location: p.location || "",
        });
      });
    }
  }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload: any = {
        name: form.name,
        sku: form.sku,
        unitPrice: Number(form.unitPrice),
        stock: Number(form.stock),
        minStock: Number(form.minStock),
      };
      if (form.category) payload.category = form.category;
      if (form.location) payload.location = form.location;

      if (isEdit && id) {
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
      }
      navigate("/products");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">{isEdit ? "Edit Product" : "Add Product"}</h1>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-sm space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <input name="name" value={form.name} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">SKU *</label>
            <input name="sku" value={form.sku} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input name="category" value={form.category} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Unit Price *</label>
            <input name="unitPrice" type="number" step="0.01" value={form.unitPrice} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Current Stock</label>
            <input name="stock" type="number" value={form.stock} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Min Stock Alert</label>
            <input name="minStock" type="number" value={form.minStock} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Location/Warehouse</label>
            <input name="location" value={form.location} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
            {loading ? "Saving..." : "Save"}
          </button>
          <button type="button" onClick={() => navigate("/products")} className="border px-4 py-2 rounded hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../../api/product.api";

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string | null;
  unitPrice: string;
  stock: number;
  minStock: number;
  imageUrl: string | null;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [search, lowStockOnly]);

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await getProducts({ search: search || undefined, lowStock: lowStockOnly });
      setProducts(res.data.data.products);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          to="/products/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Product
        </Link>
      </div>

      <div className="flex gap-4 mb-4 items-center">
        <input
          type="text"
          placeholder="Search by name, SKU, or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 max-w-md border rounded px-3 py-2"
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={lowStockOnly}
            onChange={(e) => setLowStockOnly(e.target.checked)}
          />
          Low stock only
        </label>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <table className="w-full bg-white rounded shadow-sm">
          <thead>
            <tr className="border-b text-left text-sm text-gray-600">
              <th className="p-3"></th>
              <th className="p-3">Name</th>
              <th className="p-3">SKU</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-10 h-10 object-cover rounded border"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded border bg-gray-50" />
                  )}
                </td>
                <td className="p-3">
                  <Link to={`/products/${p.id}/edit`} className="text-blue-600 hover:underline">
                    {p.name}
                  </Link>
                </td>
                <td className="p-3">{p.sku}</td>
                <td className="p-3">{p.category || "-"}</td>
                <td className="p-3">₹{p.unitPrice}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      p.stock <= p.minStock ? "bg-red-100 text-red-700" : "bg-gray-100"
                    }`}
                  >
                    {p.stock}
                  </span>
                </td>
                <td className="p-3">
                  <Link
                    to={`/products/${p.id}/stock`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Manage Stock
                  </Link>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-400">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
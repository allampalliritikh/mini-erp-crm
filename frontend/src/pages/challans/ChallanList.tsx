import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getChallans } from "../../api/challan.api";

interface Challan {
  id: string;
  challanNumber: string;
  status: string;
  totalQuantity: number;
  createdAt: string;
  customer: { name: string };
}

export default function ChallanList() {
  const [challans, setChallans] = useState<Challan[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChallans();
  }, [statusFilter]);

  async function fetchChallans() {
    setLoading(true);
    try {
      const res = await getChallans({ status: statusFilter || undefined });
      setChallans(res.data.data.challans);
    } finally {
      setLoading(false);
    }
  }

  const statusColor: Record<string, string> = {
    DRAFT: "bg-yellow-100 text-yellow-700",
    CONFIRMED: "bg-green-100 text-green-700",
    CANCELLED: "bg-gray-200 text-gray-600",
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Challans</h1>
        <Link
          to="/challans/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          New Challan
        </Link>
      </div>

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="border rounded px-3 py-2 mb-4"
      >
        <option value="">All statuses</option>
        <option value="DRAFT">Draft</option>
        <option value="CONFIRMED">Confirmed</option>
        <option value="CANCELLED">Cancelled</option>
      </select>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <table className="w-full bg-white rounded shadow-sm">
          <thead>
            <tr className="border-b text-left text-sm text-gray-600">
              <th className="p-3">Challan #</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Total Qty</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {challans.map((c) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <Link to={`/challans/${c.id}`} className="text-blue-600 hover:underline">
                    {c.challanNumber}
                  </Link>
                </td>
                <td className="p-3">{c.customer.name}</td>
                <td className="p-3">{c.totalQuantity}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 text-xs rounded ${statusColor[c.status]}`}>
                    {c.status}
                  </span>
                </td>
                <td className="p-3 text-gray-500 text-sm">
                  {new Date(c.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {challans.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-400">
                  No challans found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCustomers } from "../../api/customer.api";

interface Customer {
  id: string;
  name: string;
  mobile: string;
  businessName: string | null;
  customerType: string;
  status: string;
}

export default function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  async function fetchCustomers() {
    setLoading(true);
    try {
      const res = await getCustomers({ search: search || undefined });
      setCustomers(res.data.data.customers);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customers</h1>
        <Link
          to="/customers/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Customer
        </Link>
      </div>

      <input
        type="text"
        placeholder="Search by name, mobile, or business..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md border rounded px-3 py-2 mb-4"
      />

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <table className="w-full bg-white rounded shadow-sm">
          <thead>
            <tr className="border-b text-left text-sm text-gray-600">
              <th className="p-3">Name</th>
              <th className="p-3">Mobile</th>
              <th className="p-3">Business</th>
              <th className="p-3">Type</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <Link to={`/customers/${c.id}`} className="text-blue-600 hover:underline">
                    {c.name}
                  </Link>
                </td>
                <td className="p-3">{c.mobile}</td>
                <td className="p-3">{c.businessName || "-"}</td>
                <td className="p-3">{c.customerType}</td>
                <td className="p-3">
                  <span className="px-2 py-1 text-xs rounded bg-gray-100">{c.status}</span>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-400">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
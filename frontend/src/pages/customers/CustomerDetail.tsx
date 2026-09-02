import { useEffect, useState, FormEvent } from "react";
import { useParams, Link } from "react-router-dom";
import { getCustomer, addCustomerNote } from "../../api/customer.api";

export default function CustomerDetail() {
  const { id } = useParams();
  const [customer, setCustomer] = useState<any>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchCustomer(id);
  }, [id]);

  async function fetchCustomer(customerId: string) {
    setLoading(true);
    try {
      const res = await getCustomer(customerId);
      setCustomer(res.data.data);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddNote(e: FormEvent) {
    e.preventDefault();
    if (!id || !note.trim()) return;
    await addCustomerNote(id, note);
    setNote("");
    fetchCustomer(id);
  }

  if (loading) return <div className="p-8 text-gray-500">Loading...</div>;
  if (!customer) return <div className="p-8 text-gray-500">Customer not found.</div>;

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{customer.name}</h1>
        <Link
          to={`/customers/${id}/edit`}
          className="border px-4 py-2 rounded hover:bg-gray-50 text-sm"
        >
          Edit
        </Link>
      </div>

      <div className="bg-white rounded shadow-sm p-6 grid grid-cols-2 gap-4 mb-6">
        <div><span className="text-gray-500 text-sm">Mobile</span><p>{customer.mobile}</p></div>
        <div><span className="text-gray-500 text-sm">Email</span><p>{customer.email || "-"}</p></div>
        <div><span className="text-gray-500 text-sm">Business</span><p>{customer.businessName || "-"}</p></div>
        <div><span className="text-gray-500 text-sm">GST Number</span><p>{customer.gstNumber || "-"}</p></div>
        <div><span className="text-gray-500 text-sm">Type</span><p>{customer.customerType}</p></div>
        <div><span className="text-gray-500 text-sm">Status</span><p>{customer.status}</p></div>
        <div className="col-span-2"><span className="text-gray-500 text-sm">Address</span><p>{customer.address || "-"}</p></div>
      </div>

      <h2 className="text-lg font-semibold mb-3">Follow-up Notes</h2>
      <form onSubmit={handleAddNote} className="flex gap-2 mb-4">
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note..."
          className="flex-1 border rounded px-3 py-2"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add
        </button>
      </form>

      <div className="space-y-2">
        {customer.notes?.length ? (
          customer.notes.map((n: any) => (
            <div key={n.id} className="bg-white p-3 rounded shadow-sm text-sm">
              <p>{n.note}</p>
              <p className="text-gray-400 text-xs mt-1">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">No notes yet.</p>
        )}
      </div>

      {customer.challans?.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mt-6 mb-3">Challans</h2>
          <div className="space-y-2">
            {customer.challans.map((c: any) => (
              <Link
                key={c.id}
                to={`/challans/${c.id}`}
                className="block bg-white p-3 rounded shadow-sm text-sm hover:bg-gray-50"
              >
                {c.challanNumber} — <span className="text-gray-500">{c.status}</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
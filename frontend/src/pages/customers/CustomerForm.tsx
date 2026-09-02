import { useState, useEffect, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCustomer, createCustomer, updateCustomer } from "../../api/customer.api";

export default function CustomerForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    businessName: "",
    gstNumber: "",
    customerType: "RETAIL",
    address: "",
    status: "LEAD",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      getCustomer(id).then((res) => {
        const c = res.data.data;
        setForm({
          name: c.name || "",
          mobile: c.mobile || "",
          email: c.email || "",
          businessName: c.businessName || "",
          gstNumber: c.gstNumber || "",
          customerType: c.customerType || "RETAIL",
          address: c.address || "",
          status: c.status || "LEAD",
        });
      });
    }
  }, [id]);

  function handleChange(
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload: any = { ...form };
      if (!payload.email) delete payload.email;
      if (!payload.businessName) delete payload.businessName;
      if (!payload.gstNumber) delete payload.gstNumber;
      if (!payload.address) delete payload.address;

      if (isEdit && id) {
        await updateCustomer(id, payload);
      } else {
        await createCustomer(payload);
      }
      navigate("/customers");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">{isEdit ? "Edit Customer" : "Add Customer"}</h1>

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
            <label className="block text-sm font-medium mb-1">Mobile *</label>
            <input name="mobile" value={form.mobile} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Business Name</label>
            <input name="businessName" value={form.businessName} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">GST Number</label>
            <input name="gstNumber" value={form.gstNumber} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Customer Type</label>
            <select name="customerType" value={form.customerType} onChange={handleChange} className="w-full border rounded px-3 py-2">
              <option value="RETAIL">Retail</option>
              <option value="WHOLESALE">Wholesale</option>
              <option value="DISTRIBUTOR">Distributor</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded px-3 py-2">
              <option value="LEAD">Lead</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Address</label>
            <textarea name="address" value={form.address} onChange={handleChange} className="w-full border rounded px-3 py-2" rows={2} />
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
            {loading ? "Saving..." : "Save"}
          </button>
          <button type="button" onClick={() => navigate("/customers")} className="border px-4 py-2 rounded hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
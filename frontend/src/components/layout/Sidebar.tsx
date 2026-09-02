import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
  const { user } = useAuth();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-2 rounded ${
      isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <aside className="w-56 min-h-screen bg-white border-r p-4">
      <h2 className="text-lg font-bold mb-6">Mini ERP</h2>
      <nav className="space-y-1">
        <NavLink to="/customers" className={linkClass}>
          Customers
        </NavLink>
        <NavLink to="/products" className={linkClass}>
          Products
        </NavLink>
        <NavLink to="/challans" className={linkClass}>
          Challans
        </NavLink>
      </nav>
      {user && (
        <div className="mt-8 text-xs text-gray-500">
          Logged in as {user.name} ({user.role})
        </div>
      )}
    </aside>
  );
}
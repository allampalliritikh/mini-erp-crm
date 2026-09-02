import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";
import Login from "./pages/Login";
import CustomerList from "./pages/customers/CustomerList";
import CustomerForm from "./pages/customers/CustomerForm";
import CustomerDetail from "./pages/customers/CustomerDetail";
import ProductList from "./pages/products/ProductList";
import ProductForm from "./pages/products/ProductForm";
import StockLog from "./pages/products/StockLog";
import ChallanList from "./pages/challans/ChallanList";
import ChallanNew from "./pages/challans/ChallanNew";
import ChallanDetail from "./pages/challans/ChallanDetail";

function Protected({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/customers" element={<Protected><CustomerList /></Protected>} />
          <Route path="/customers/new" element={<Protected><CustomerForm /></Protected>} />
          <Route path="/customers/:id/edit" element={<Protected><CustomerForm /></Protected>} />
          <Route path="/customers/:id" element={<Protected><CustomerDetail /></Protected>} />

          <Route path="/products" element={<Protected><ProductList /></Protected>} />
          <Route path="/products/new" element={<Protected><ProductForm /></Protected>} />
          <Route path="/products/:id/edit" element={<Protected><ProductForm /></Protected>} />
          <Route path="/products/:id/stock" element={<Protected><StockLog /></Protected>} />

          <Route path="/challans" element={<Protected><ChallanList /></Protected>} />
          <Route path="/challans/new" element={<Protected><ChallanNew /></Protected>} />
          <Route path="/challans/:id" element={<Protected><ChallanDetail /></Protected>} />

          <Route path="/" element={<Navigate to="/customers" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
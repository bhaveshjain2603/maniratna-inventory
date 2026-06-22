import React from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

// Pages
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import VerifyOTPPage from "./pages/VerifyOTPPage";
import Setup2FAPage from "./pages/Setup2FAPage";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import AddProductPage from "./pages/AddProductPage";
import EditProductPage from "./pages/EditProductPage";
import StockOutPage from "./pages/StockOutPage";
import ScannerPage from "./pages/ScannerPage";
import ReportsPage from "./pages/ReportsPage";
import TransactionsPage from "./pages/TransactionsPage";

function App() {
  return (
    // <Router>
    //   <AuthProvider>
    //     <Toaster
    //       position="top-center"
    //       reverseOrder={false}
    //       toastOptions={{
    //         duration: 3000,
    //         style: {
    //           background: "#1F1F1F",
    //           color: "#fff",
    //           border: "1px solid #D4AF37",
    //           borderRadius: "12px",
    //           padding: "14px 18px",
    //           fontSize: "14px",
    //           fontWeight: "500",
    //           boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
    //         },

    //         success: {
    //           iconTheme: {
    //             primary: "#D4AF37",
    //             secondary: "#1F1F1F",
    //           },
    //         },

    //         error: {
    //           iconTheme: {
    //             primary: "#EF4444",
    //             secondary: "#fff",
    //           },
    //         },
    //       }}
    //     />
    //     <Routes>
    //       <Route path="/login" element={<LoginPage />} />
    //       <Route path="/signup" element={<SignupPage />} />
    //       <Route path="/verify-otp" element={<VerifyOTPPage />} />
    //       <Route path="/setup-2fa" element={<Setup2FAPage />} />

    //       <Route
    //         path="/"
    //         element={
    //           <ProtectedRoute>
    //             <Layout />
    //           </ProtectedRoute>
    //         }
    //       >
    //         <Route index element={<DashboardPage />} />
    //         <Route path="products" element={<ProductsPage />} />
    //         <Route path="products/add" element={<AddProductPage />} />
    //         <Route path="products/:id/edit" element={<EditProductPage />} />
    //         <Route path="products/:id/stock-out" element={<StockOutPage />} />
    //         <Route path="scanner" element={<ScannerPage />} />
    //         <Route path="transactions" element={<TransactionsPage />} />
    //         <Route path="reports" element={<ReportsPage />} />
    //       </Route>

    //       <Route path="*" element={<Navigate to="/" replace />} />
    //     </Routes>
    //   </AuthProvider>
    // </Router>
    <>
      <Toaster />
      <button
        onClick={() => toast.success("Toast working")}
        style={{
          padding: "20px",
          margin: "100px",
          background: "black",
          color: "white",
        }}
      >
        Test Toast
      </button>
    </>
  );
}

export default App;

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/customer/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard.js";
import Loans from "./pages/customer/Loans";
import Payments from "./pages/customer/Payments.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <>
      <ToastContainer position="bottom-center" />
      <BrowserRouter>
        <Routes>
          <Route index path="/" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/loans" element={<Loans />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

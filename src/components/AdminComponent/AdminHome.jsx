import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import ProductManager from "./ProductManager";
import AdminBanner from "./AdminBanner";
import AdminPartners from "./AdminPartners";
import Footer from "../Footer";
function AdminHome({ token, onLogout }) {
  const [remainingTime, setRemainingTime] = useState("");

  useEffect(() => {
    if (!token) return;

    const decoded = jwtDecode(token);
    const expiry = decoded.exp * 1000; // JWT exp is in seconds, convert to ms

    const updateTimer = () => {
      const now = Date.now();
      const diff = expiry - now;

      if (diff <= 0) {
        setRemainingTime("Expired");
        onLogout(); // Auto logout on expiration
        return;
      }

      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setRemainingTime(`${minutes}m ${seconds}s`);
    };

    updateTimer(); // Initial call
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [token, onLogout]);

  return (
    <div className="p-1 w-full mx-auto m-0">
      <nav className="w-full bg-white shadow-md px-4 sm:px-6 py-3 flex flex-col sm:flex-row justify-between items-center max-w-6xl mx-auto">
        <div className="text-xl sm:text-2xl font-semibold text-mm-primary mb-2 sm:mb-0">
          Hello Admin!
        </div>

        <div className="text-gray-600 font-semibold mb-2 sm:mb-0">
          Logout in: {remainingTime}
        </div>

        <button
          onClick={onLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition w-full sm:w-auto"
        >
          Logout
        </button>
      </nav>

      <AdminBanner />

      {/* <CategoryManager /> */}

      <AdminPartners />
      <ProductManager />
      <Footer />
    </div>
  );
}

export default AdminHome;

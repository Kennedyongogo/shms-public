import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Landingpage from "./components/Landingpage";
import AdminHome from "./pages/AdminHome";
import SettingsPage from "./components/Admin/SettingsPage";
import Subscription from "./pages/Subscription";
import Newsletter from "./pages/Newsletter";

function App() {
  const ProtectedAdminRoute = ({ element }) => {
    const token = localStorage.getItem("admin_token");
    return token ? element : <Navigate to="/" replace />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/dashboard" element={<ProtectedAdminRoute element={<AdminHome />} />} />
        <Route path="/subscription" element={<ProtectedAdminRoute element={<Subscription />} />} />
        <Route path="/newsletter" element={<ProtectedAdminRoute element={<Newsletter />} />} />
        <Route path="/settings" element={<ProtectedAdminRoute element={<SettingsPage />} />} />
      </Routes>
    </Router>
  );
}

export default App;

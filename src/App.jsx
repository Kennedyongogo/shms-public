import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Landingpage from "./components/Landingpage";
import AdminHome from "./pages/AdminHome";
import SettingsPage from "./components/Admin/SettingsPage";

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
        <Route path="/settings" element={<ProtectedAdminRoute element={<SettingsPage />} />} />
      </Routes>
    </Router>
  );
}

export default App;

import { Navigate, useLocation } from "react-router-dom";

/**
 * Wraps patient portal routes. Redirects to /patient (login) if not logged in.
 */
export default function PatientGate({ children }) {
  const location = useLocation();
  const token = typeof localStorage !== "undefined" ? localStorage.getItem("patient_token") : null;

  if (!token) {
    return <Navigate to="/patient" state={{ from: location }} replace />;
  }

  return children;
}


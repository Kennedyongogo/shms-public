import React, { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getPatientMe } from "../api";

export default function PatientDashboard() {
  const navigate = useNavigate();
  const [patient, setPatient] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("patient") || "null");
    } catch {
      return null;
    }
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await getPatientMe();
        const p = res?.data?.patient || null;
        if (p) {
          setPatient(p);
          localStorage.setItem("patient", JSON.stringify(p));
        }
      } catch {
        // ignore
      }
    })();
  }, []);

  const logout = () => {
    localStorage.removeItem("patient_token");
    localStorage.removeItem("patient");
    navigate("/patient", { replace: true });
  };

  return (
    <Box sx={{ p: 2.5, maxWidth: 900, mx: "auto" }}>
      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 900, mb: 0.5 }}>
            Welcome{patient?.full_name ? `, ${patient.full_name}` : ""}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            This is the patient portal dashboard. Next we can add: appointments, prescriptions, bills, and medical reports.
          </Typography>
          <Button variant="outlined" onClick={logout}>
            Logout
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}


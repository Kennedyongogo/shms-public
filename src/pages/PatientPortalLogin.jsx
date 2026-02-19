import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { AccountCircle, Lock, Visibility, VisibilityOff, LocalHospital } from "@mui/icons-material";
import Swal from "sweetalert2";
import { loginPatient, registerPatient } from "../api";

const TEAL = "#00897B";
const TEAL_DARK = "#00695C";

export default function PatientPortalLogin() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");

  const doLogin = async (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      Swal.fire({ icon: "error", title: "Login", text: "Enter email/phone and password." });
      return;
    }
    setLoading(true);
    try {
      const res = await loginPatient({ identifier: identifier.trim(), password });
      const payload = res.data || res;
      const token = payload.token;
      const patient = payload.patient;
      if (!token || !patient) throw new Error("Invalid server response");
      localStorage.setItem("patient_token", token);
      localStorage.setItem("patient", JSON.stringify(patient));
      Swal.fire({ icon: "success", title: "Welcome", timer: 900, showConfirmButton: false });
      navigate("/patient/dashboard", { replace: true });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Login failed", text: err.message || "Login failed." });
    } finally {
      setLoading(false);
    }
  };

  const doRegister = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) return Swal.fire({ icon: "error", title: "Register", text: "Full name is required." });
    if (!email.trim() && !phone.trim()) return Swal.fire({ icon: "error", title: "Register", text: "Provide email or phone." });
    if (!regPassword) return Swal.fire({ icon: "error", title: "Register", text: "Password is required." });
    if (regPassword !== regConfirm) return Swal.fire({ icon: "error", title: "Register", text: "Passwords do not match." });

    setLoading(true);
    try {
      await registerPatient({
        full_name: fullName.trim(),
        email: email.trim() ? email.trim().toLowerCase() : null,
        phone: phone.trim() || null,
        password: regPassword,
        confirm_password: regConfirm,
      });
      Swal.fire({ icon: "success", title: "Account created", text: "Please log in." });
      setTab(0);
      setIdentifier(email.trim() || phone.trim());
      setPassword("");
    } catch (err) {
      Swal.fire({ icon: "error", title: "Registration failed", text: err.message || "Registration failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        background: `linear-gradient(135deg, ${TEAL_DARK}11 0%, ${TEAL}11 100%)`,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 520,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: 2.5, background: `linear-gradient(135deg, ${TEAL_DARK} 0%, ${TEAL} 100%)`, color: "white" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LocalHospital />
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              Patient Portal
            </Typography>
          </Box>
          <Typography sx={{ opacity: 0.9, mt: 0.5 }}>Log in to view your appointments and medical updates.</Typography>
        </Box>

        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{ px: 2, "& .MuiTabs-indicator": { backgroundColor: TEAL } }}
        >
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        <Box sx={{ p: 2.5 }}>
          {tab === 0 ? (
            <Box component="form" onSubmit={doLogin} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Email or phone"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword((v) => !v)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ bgcolor: TEAL, fontWeight: 900, "&:hover": { bgcolor: TEAL_DARK } }}
              >
                {loading ? <CircularProgress size={22} sx={{ color: "white" }} /> : "Login"}
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={doRegister} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} fullWidth />
              <TextField label="Email (optional)" value={email} onChange={(e) => setEmail(e.target.value)} type="email" fullWidth />
              <TextField label="Phone (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+2547XXXXXXXX" fullWidth />
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword((v) => !v)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Confirm password"
                type={showPassword ? "text" : "password"}
                value={regConfirm}
                onChange={(e) => setRegConfirm(e.target.value)}
                fullWidth
                error={Boolean(regConfirm) && regPassword !== regConfirm}
                helperText={Boolean(regConfirm) && regPassword !== regConfirm ? "Passwords do not match" : ""}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ bgcolor: TEAL, fontWeight: 900, "&:hover": { bgcolor: TEAL_DARK } }}
              >
                {loading ? <CircularProgress size={22} sx={{ color: "white" }} /> : "Create account"}
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
}


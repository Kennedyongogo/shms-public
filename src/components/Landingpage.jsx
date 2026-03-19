import React, { useMemo, useState } from "react";
import { Box, Button, Divider, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import {
  HelpOutline as HelpOutlineIcon,
  Settings as SettingsIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import Swal from "sweetalert2";

export default function Landingpage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const heroBg = useMemo(
    () =>
      [
        "radial-gradient(circle at 20% 30%, rgba(0, 74, 119, 0.4) 0%, transparent 50%)",
        "radial-gradient(circle at 80% 70%, rgba(0, 241, 254, 0.1) 0%, transparent 40%)",
        "linear-gradient(135deg, #090f13 0%, #001a2c 100%)",
      ].join(","),
    [],
  );

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      await Swal.fire({
        icon: "error",
        title: "Login failed",
        text: "Email and password are required.",
        confirmButtonColor: "#00897B",
      });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin-auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Login failed");
      }
      const token = data?.data?.token;
      const admin = data?.data?.admin || null;
      if (token) localStorage.setItem("admin_token", token);
      if (admin) localStorage.setItem("admin_user", JSON.stringify(admin));
      await Swal.fire({
        icon: "success",
        title: "Login successful",
        text: `Welcome${admin?.full_name ? `, ${admin.full_name}` : ""}`,
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
        backdrop: true,
      });
      window.location.href = "/dashboard";
    } catch (e) {
      await Swal.fire({
        icon: "error",
        title: "Login failed",
        text: e?.message || "Login failed",
        confirmButtonColor: "#00897B",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        height: "100vh",
        width: "100%",
        background: "#090f13",
        color: "#e0e6ec",
        fontFamily:
          '"Inter","Space Grotesk",system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif',
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          minHeight: 0,
        }}
      >
        {/* Left side */}
        <Box
          sx={{
            display: { xs: "none", lg: "flex" },
            width: "50%",
            position: "relative",
            alignItems: "center",
            justifyContent: "center",
            p: 8,
            backgroundImage: heroBg,
          }}
        >
          {/* Grid overlay */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              opacity: 0.2,
              pointerEvents: "none",
              backgroundImage:
                "linear-gradient(to right, rgba(153,247,255,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(153,247,255,0.5) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <Box sx={{ position: "relative", zIndex: 10, maxWidth: 520 }}>
            <Typography
              sx={{
                mb: 3,
                fontSize: { xs: "1.2rem", sm: "1.5rem" },
                fontWeight: 900,
                letterSpacing: "0.02em",
                color: "#99f7ff",
                textShadow: "0 0 8px rgba(153,247,255,0.35)",
              }}
            >
              Carlvyne SHMS
            </Typography>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1.5,
                px: 2,
                py: 1,
                borderRadius: 999,
                border: "1px solid rgba(0,241,254,0.2)",
                background: "rgba(0,241,254,0.08)",
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#99f7ff",
                  boxShadow: "0 0 10px rgba(153,247,255,0.35)",
                }}
              />
              <Typography sx={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.2em" }}>
                System Active
              </Typography>
            </Box>

            <Typography
              sx={{
                mt: 6,
                fontSize: "clamp(1.05rem, 4.2vw, 2.2rem)",
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.015em",
                whiteSpace: "nowrap",
              }}
            >
              Precision Pulse{" "}
              <Box component="span" sx={{ color: "#99f7ff" }}>
                Diagnostics.
              </Box>
            </Typography>

            <Typography sx={{ mt: 3, color: "rgba(224,230,236,0.72)", fontWeight: 300, fontSize: 18 }}>
              Access the next generation of healthcare management. Secure, integrated, and high-performance surgical
              system intelligence.
            </Typography>

            <Box sx={{ mt: 4, display: "flex", alignItems: "center", gap: 3 }}>
              <Box sx={{ width: 48, height: 1, background: "rgba(0,241,254,0.3)" }} />
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box sx={{ display: "flex", alignItems: "center", position: "relative" }}>
                  {[
                    "/bergy59-bed-8352775_1920.jpg",
                    "/geralt-ai-generated-8685102_1920.jpg",
                    "/shirley810-dentist-372792_1920.jpg",
                  ].map((src, i) => (
                    <Box
                      key={i}
                      component="img"
                      src={src}
                      alt="profile"
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "1px solid rgba(224,230,236,0.18)",
                        background: "rgba(19,39,45,0.6)",
                        mx: i === 0 ? 0 : -1,
                        boxShadow: "0 6px 24px rgba(0,0,0,0.22)",
                      }}
                    />
                  ))}
                </Box>
              </Box>
              <Typography sx={{ fontSize: 12, color: "rgba(224,230,236,0.65)", ml: 1 }}>
                Trusted by 2.4k Specialists
              </Typography>
            </Box>
          </Box>

          {/* Floating DNA-like glow elements */}
          <Box
            sx={{
              position: "absolute",
              left: "-5%",
              bottom: "-10%",
              width: 384,
              height: 384,
              background: "rgba(0,241,254,0.08)",
              filter: "blur(120px)",
              borderRadius: "50%",
              pointerEvents: "none",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              right: "-5%",
              top: "-5%",
              width: 256,
              height: 256,
              background: "rgba(149,200,253,0.08)",
              filter: "blur(100px)",
              borderRadius: "50%",
              pointerEvents: "none",
            }}
          />
        </Box>

        {/* Right side - Login form */}
        <Box
          sx={{
            width: "100%",
            lg: { width: "50%" },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: 2, sm: 6, md: 8 },
            background: "#131a1f",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 440,
              background: "rgba(30, 39, 45, 0.6)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderRadius: 2,
              p: { xs: 2, sm: 4 },
              position: "relative",
              overflow: "hidden",
              border: "1px solid rgba(153,247,255,0.12)",
              boxShadow:
                "0 0 15px rgba(153,247,255,0.1), inset 0 0 1px rgba(153,247,255,0.3)",
            }}
          >
            {/* Accent line */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: 2,
                background: "linear-gradient(90deg, transparent, rgba(0,241,254,0.5), transparent)",
              }}
            />

            <Box
              sx={{
                mb: 4,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 0 }}>
                Administrative Login
              </Typography>
            </Box>

            <Box
              component="form"
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              <TextField
                label="Email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="small"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: "rgba(148,163,184,0.9)" }} />
                    </InputAdornment>
                  ),
                }}
                fullWidth
                sx={{
                  "& .MuiInputBase-root": {
                    backgroundColor: "#0e1419",
                    borderRadius: 1.5,
                  },
                }}
              />

              <TextField
                label="Password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                size="small"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: "rgba(148,163,184,0.9)" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword((s) => !s)} edge="end" sx={{ color: "rgba(148,163,184,0.9)" }}>
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiInputBase-root": {
                    backgroundColor: "#0e1419",
                    borderRadius: 1.5,
                  },
                }}
                fullWidth
              />

              <Button
                variant="contained"
                disableElevation
                sx={{
                  mt: 2,
                  py: 1.5,
                  borderRadius: 999,
                  background: "linear-gradient(135deg, #00f1fe 0%, rgba(107,247,251,0.8) 100%)",
                  color: "#001a2c",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  fontSize: 12,
                }}
                onClick={handleLogin}
                disabled={loading}
                fullWidth
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </Box>

            {/* (Removed footer links from login card) */}
          </Box>
        </Box>
      </Box>
      {/* Footer (not fixed) */}
      <Box
        component="footer"
        sx={{
          px: { xs: 2, sm: 6, md: 8 },
          py: 2,
          display: { xs: "flex", md: "flex" },
          justifyContent: "center",
          alignItems: "center",
          borderTop: "1px solid rgba(153,247,255,0.08)",
          pointerEvents: "auto",
        }}
      >
        <Typography
          sx={{
            fontSize: "clamp(10px, 2.2vw, 12px)",
            color: "rgba(148,163,184,0.9)",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            whiteSpace: "nowrap",
            textAlign: "center",
          }}
        >
          © 2024 Carlvyne SHMS. Precision Pulse Diagnostics.
        </Typography>
      </Box>
    </Box>
  );
}


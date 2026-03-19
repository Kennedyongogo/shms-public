import React, { useMemo, useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  IconButton,
  Avatar,
  Dialog,
  DialogContent,
  Stack,
} from "@mui/material";
import { Menu as MenuIcon, Close as CloseIcon, Logout as LogoutIcon } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

export default function AdminNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeItem = useMemo(() => {
    const p = location.pathname || "";
    if (p.startsWith("/settings")) return "Settings";
    if (p.startsWith("/dashboard")) return "Home";
    return "Home";
  }, [location.pathname]);

  const adminUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("admin_user") || "null");
    } catch (e) {
      return null;
    }
  }, []);

  const avatarSrc = useMemo(() => {
    const imagePath = adminUser?.profile_image_path;
    if (!imagePath) return "";
    if (/^https?:\/\//i.test(imagePath)) return imagePath;
    if (imagePath.startsWith("/")) return imagePath;
    return `/${imagePath.replace(/^\/+/, "")}`;
  }, [adminUser]);

  const navItems = [
    { label: "Home", path: "/dashboard" },
    { label: "Owners", path: "#" },
    { label: "Subscription", path: "#" },
    { label: "Settings", path: "/settings" },
  ];

  const handleLogout = async () => {
    const result = await Swal.fire({
      icon: "question",
      title: "Log out?",
      text: "Do you want to log out of the system?",
      showCancelButton: true,
      confirmButtonText: "Yes, log out",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      confirmButtonColor: "#00897B",
      focusConfirm: false,
      focusCancel: false,
      customClass: {
        confirmButton: "swal-logout-btn",
        cancelButton: "swal-logout-btn",
      },
      didOpen: () => {
        const confirmBtn = Swal.getConfirmButton();
        const cancelBtn = Swal.getCancelButton();
        [confirmBtn, cancelBtn].forEach((btn) => {
          if (!btn) return;
          btn.style.outline = "none";
          btn.style.boxShadow = "none";
          btn.style.border = "none";
          btn.addEventListener("focus", () => {
            btn.style.outline = "none";
            btn.style.boxShadow = "none";
          });
        });
      },
    });
    if (!result.isConfirmed) return;
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    await Swal.fire({
      icon: "success",
      title: "Logged out",
      timer: 900,
      showConfirmButton: false,
    });
    navigate("/", { replace: true });
  };

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: "rgba(30, 39, 45, 0.6)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(112, 118, 123, 0.15)",
        }}
      >
        <Toolbar
          sx={{
            px: { xs: 1.25, md: 3 },
            py: 0.5,
            minHeight: { xs: "54px", md: "60px" },
            display: "grid",
            gridTemplateColumns: { xs: "1fr auto", md: "1fr auto 1fr" },
            alignItems: "center",
            gap: 1,
          }}
        >
          {/* Left: avatar + brand */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0 }}>
            <Avatar
              src={avatarSrc}
              alt="Admin Avatar"
              sx={{ width: 30, height: 30, border: "1px solid rgba(112,118,123,0.25)" }}
            />
            <Typography
              sx={{
                fontSize: { xs: "0.9rem", md: "1.15rem" },
                fontWeight: 900,
                letterSpacing: "-0.02em",
                color: "#22d3ee",
                textShadow: "0 0 8px rgba(153,247,255,0.4)",
                whiteSpace: "nowrap",
              }}
            >
              Carlvyne SHMS
            </Typography>
          </Box>

          {/* Center: nav items on large screens */}
          <Box sx={{ display: { xs: "none", md: "flex" }, justifyContent: "center", gap: 0.5 }}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                disableRipple
                disableFocusRipple
                onClick={() => {
                  if (item.path && item.path !== "#") navigate(item.path);
                }}
                sx={{
                  color: activeItem === item.label ? "#67e8f9" : "#94a3b8",
                  fontWeight: activeItem === item.label ? 800 : 700,
                  borderBottom: activeItem === item.label ? "2px solid #22d3ee" : "2px solid transparent",
                  borderRadius: 0,
                  textTransform: "none",
                  minWidth: 72,
                  backgroundColor: "transparent",
                  "&:hover": { backgroundColor: "transparent", color: "#67e8f9" },
                  "&.Mui-focusVisible": { outline: "none", boxShadow: "none" },
                  "&:focus": { outline: "none", boxShadow: "none" },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* Right: logout on large, hamburger on small */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
            <Button
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{
                display: { xs: "none", md: "inline-flex" },
                textTransform: "none",
                fontWeight: 800,
                color: "#E6FFFA",
                border: "1px solid rgba(0,137,123,0.45)",
                borderRadius: 2,
                px: 1.5,
                py: 0.45,
                backgroundColor: "#00897B",
                "&:hover": { backgroundColor: "#00796B" },
                "&.Mui-focusVisible": { outline: "none", boxShadow: "none" },
                "&:focus": { outline: "none", boxShadow: "none" },
              }}
            >
              Log out
            </Button>
            <IconButton
              onClick={() => setMobileOpen((v) => !v)}
              sx={{
                display: { xs: "inline-flex", md: "none" },
                color: "#e0e6ec",
                "&.Mui-focusVisible": { outline: "none", boxShadow: "none" },
                "&:focus": { outline: "none", boxShadow: "none" },
              }}
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile menu dialog */}
      <Dialog
        open={mobileOpen}
        onClose={closeMobileMenu}
        fullWidth
        maxWidth="xs"
        sx={{
          "& .MuiDialog-container": {
            alignItems: "flex-start",
            justifyContent: "flex-end",
            pt: { xs: "56px", md: "64px" },
            pr: { xs: 1, sm: 2 },
          },
          "& .MuiDialog-paper": {
            m: 0,
            width: { xs: "calc(100% - 16px)", sm: 360 },
            maxWidth: "100%",
            borderRadius: 2,
          },
        }}
      >
        <DialogContent sx={{ p: 2 }}>
          <Stack spacing={2}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar
                src={avatarSrc}
                alt="Admin Avatar"
                sx={{ width: 34, height: 34 }}
              />
              <Typography sx={{ fontWeight: 800, color: "#22d3ee" }}>Carlvyne SHMS</Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  onClick={() => {
                    closeMobileMenu();
                    if (item.path && item.path !== "#") navigate(item.path);
                  }}
                  sx={{
                    justifyContent: "flex-start",
                    textTransform: "none",
                    fontWeight: activeItem === item.label ? 800 : 700,
                    color: activeItem === item.label ? "#00897B" : "#1f2937",
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            <Button
              onClick={async () => {
                closeMobileMenu();
                await handleLogout();
              }}
              startIcon={<LogoutIcon />}
              variant="contained"
              sx={{
                textTransform: "none",
                fontWeight: 800,
                bgcolor: "#00897B",
                "&:hover": { bgcolor: "#00695C" },
              }}
            >
              Log out
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Button,
  Card,
} from "@mui/material";
import {
  Group,
  Domain,
  Emergency,
  Call,
} from "@mui/icons-material";

const HERO_IMAGE_URL = "/images/renatalferro-dentist-1437413_1920.jpg";

export default function HeroSection() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Detect when hero section is visible and notify header
  useEffect(() => {
    const heroSection = document.getElementById("hero-section");
    if (!heroSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isVisible =
            entry.isIntersecting && entry.intersectionRatio > 0.2;
          const scrollY = window.scrollY;
          const isAtTop = scrollY <= 20;

          // Dispatch custom event to notify header
          const event = new CustomEvent("heroVisibilityChange", {
            detail: {
              isVisible: isVisible && isAtTop,
              intersectionRatio: entry.intersectionRatio,
              scrollY: scrollY,
            },
          });
          window.dispatchEvent(event);
        });
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.5, 0.7, 1.0],
        rootMargin: "0px",
      },
    );

    observer.observe(heroSection);

    // Check initial state
    setTimeout(() => {
      const rect = heroSection.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight && rect.bottom > 0;
      const isAtTop = window.scrollY <= 20;
      const event = new CustomEvent("heroVisibilityChange", {
        detail: {
          isVisible: isInView && isAtTop,
          intersectionRatio: isInView ? 1 : 0,
          scrollY: window.scrollY,
        },
      });
      window.dispatchEvent(event);
    }, 200);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <Box
      id="hero-section"
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
        height: "calc(100vh - 72px)",
        maxHeight: "calc(100vh - 72px)",
        width: "100%",
        overflow: "hidden",
        fontFamily: '"Calibri Light", Calibri, sans-serif',
        backgroundColor: "#f6f8f6",
        color: "#263238",
      }}
    >
      {/* Left: Typography (same structure as MarketplaceLogin right panel) */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          pt: { xs: 1, sm: 1.5 },
          px: "clamp(1rem, 4vw, 3rem)",
          pb: "clamp(1rem, 2vh, 1.5rem)",
          bgcolor: "#f6f8f6",
          overflow: "auto",
          position: "relative",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 560, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: { xs: 2, lg: 2.5 } }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2.25rem", sm: "2.75rem", lg: "3.25rem" },
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1.2,
              color: "#263238",
              "& span": { color: "#00897B" },
            }}
          >
            Your Health, <span>Our Priority</span>
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "1.5rem", sm: "1.75rem", lg: "2rem" },
              fontWeight: 700,
              color: "rgba(38, 50, 56, 0.9)",
            }}
          >
            Smart Care at Your Fingertips
          </Typography>
          <Typography sx={{ fontSize: "1.125rem", color: "#546E7A", lineHeight: 1.75 }}>
            24/7 access to expert doctors, digital appointments, and your complete medical history — all in one place.
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, pt: 0.5, justifyContent: "center" }}>
            <Button
              variant="contained"
              onClick={() => navigate("/book-consultation")}
              sx={{
                px: 4,
                py: 1.75,
                backgroundColor: "#00897B",
                color: "white",
                fontWeight: 700,
                borderRadius: "0.75rem",
                boxShadow: "0 10px 15px -3px rgba(0, 137, 155, 0.25)",
                textTransform: "none",
                fontSize: "1rem",
                "&:hover": { backgroundColor: "#00695C", transform: "translateY(-2px)" },
                transition: "all 0.2s",
              }}
            >
              Book Appointment
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/staff")}
              sx={{
                px: 4,
                py: 1.75,
                border: "2px solid #1f89e5",
                color: "#1f89e5",
                fontWeight: 700,
                borderRadius: "0.75rem",
                textTransform: "none",
                fontSize: "1rem",
                "&:hover": { backgroundColor: "rgba(31, 137, 229, 0.05)", border: "2px solid #1f89e5" },
              }}
            >
              Find a Doctor
            </Button>
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2.5, pt: 0.5, justifyContent: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#00897B", fontWeight: 600 }}>
              <Group sx={{ fontSize: "1.25rem" }} />
              <Typography sx={{ fontWeight: 600, color: "#00897B", fontSize: "0.95rem" }}>50+ Expert Doctors</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#00897B", fontWeight: 600 }}>
              <Domain sx={{ fontSize: "1.25rem" }} />
              <Typography sx={{ fontWeight: 600, color: "#00897B", fontSize: "0.95rem" }}>15+ Departments</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#00897B", fontWeight: 600 }}>
              <Emergency sx={{ fontSize: "1.25rem" }} />
              <Typography sx={{ fontWeight: 600, color: "#00897B", fontSize: "0.95rem" }}>24/7 Emergency</Typography>
            </Box>
          </Box>
          <Box sx={{ maxWidth: "448px", pt: 0.5, mx: "auto" }}>
            <Card
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 2,
                backgroundColor: "white",
                borderRadius: "0.75rem",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                borderLeft: "4px solid #00897B",
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(0, 137, 123, 0.1)",
                  borderRadius: "50%",
                  color: "#00897B",
                }}
              >
                <Call />
              </Box>
              <Box>
                <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#00897B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Emergency? Call our 24/7 Helpline
                </Typography>
                <Typography sx={{ fontSize: "1.125rem", fontWeight: 700, color: "#263238" }}>
                  +254798757460
                </Typography>
              </Box>
            </Card>
          </Box>
        </Box>
      </Box>

      {/* Right: Image panel (same structure as MarketplaceLogin left panel) - desktop */}
      <Box
        sx={{
          display: { xs: "none", lg: "flex" },
          width: "50%",
          flex: "0 0 50%",
          height: "100%",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative",
          minHeight: 0,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            backgroundImage: `url(${HERO_IMAGE_URL})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background: "linear-gradient(to bottom right, rgba(31, 137, 229, 0.12) 0%, rgba(31, 137, 229, 0.02) 100%)",
          }}
        />
      </Box>

      {/* Mobile: image below typography */}
      <Box
        sx={{
          display: { xs: "block", lg: "none" },
          width: "100%",
          height: "min(320px, 45vh)",
          minHeight: 260,
          position: "relative",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${HERO_IMAGE_URL})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </Box>
    </Box>
  );
}
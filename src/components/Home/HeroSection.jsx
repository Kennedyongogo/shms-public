import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Button,
  Container,
  Grid,
  Card,
  Chip,
} from "@mui/material";
import {
  Group,
  Domain,
  Emergency,
  Call,
  Star,
  EventAvailable,
  MonitorHeart,
  Add,
} from "@mui/icons-material";

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
        height: "calc(100vh - 80px)", // Full viewport minus header height
        width: "100%",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        fontFamily: '"Inter", sans-serif',
        backgroundColor: "#f4f6f8",
        color: "#263238",
        backgroundImage:
          "radial-gradient(circle at 2px 2px, rgba(31, 137, 229, 0.05) 1px, transparent 0)",
        backgroundSize: "32px 32px",
      }}
    >
      {/* Background Decorative Elements */}
      <Box
        sx={{
          position: "absolute",
          top: "-10%",
          right: "-10%",
          width: "500px",
          height: "500px",
          backgroundColor: "rgba(31, 137, 229, 0.05)",
          borderRadius: "50%",
          filter: "blur(100px)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-5%",
          left: "-5%",
          width: "400px",
          height: "400px",
          backgroundColor: "rgba(0, 137, 123, 0.05)",
          borderRadius: "50%",
          filter: "blur(80px)",
        }}
      />

      <Container
        maxWidth="xl"
        sx={{
          px: { xs: 3, lg: 6 },
          py: { xs: 2, lg: 3 },
          position: "relative",
          zIndex: 10,
          height: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Grid container spacing={{ xs: 3, lg: 6 }} sx={{ alignItems: "center", height: "100%" }}>
          {/* LEFT SIDE: Content */}
          <Grid item xs={12} lg={6}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 2, lg: 3 }, maxWidth: "672px" }}>
              {/* Pill Badge */}
              <Box sx={{ display: "flex" }}>
                <Chip
                  icon={<span style={{ fontSize: "1rem" }}>🏥</span>}
                  label="Smart Hospital Management System"
                  sx={{
                    backgroundColor: "white",
                    color: "#263238",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    borderRadius: "9999px",
                    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                    border: "1px solid rgba(226, 232, 240, 1)",
                    "& .MuiChip-label": {
                      px: 1,
                    },
                  }}
                />
              </Box>

              {/* Headlines */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: "2.5rem", lg: "3.75rem" },
                    fontWeight: 700,
                    letterSpacing: "-0.025em",
                    lineHeight: 1.2,
                    color: "#263238",
                    "& span": {
                      color: "#1f89e5",
                    },
                  }}
                >
                  Your Health, <span>Our Priority</span>
                </Typography>
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: { xs: "1.875rem", lg: "2.25rem" },
                    fontWeight: 700,
                    color: "rgba(38, 50, 56, 0.9)",
                  }}
                >
                  Smart Care at Your Fingertips
                </Typography>
                <Typography
                  sx={{
                    fontSize: "1.125rem",
                    color: "#546E7A",
                    lineHeight: 1.75,
                    maxWidth: "512px",
                  }}
                >
                  24/7 access to expert doctors, digital appointments, and your
                  complete medical history — all in one place.
                </Typography>
              </Box>

              {/* Buttons */}
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, pt: 0.5 }}>
                <Button
                  variant="contained"
                  onClick={() => navigate("/book-consultation")}
                  sx={{
                    px: 4,
                    py: 2,
                    backgroundColor: "#1f89e5",
                    color: "white",
                    fontWeight: 700,
                    borderRadius: "0.75rem",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    textTransform: "none",
                    fontSize: "1rem",
                    transition: "all 0.2s",
                    transform: "translateY(0)",
                    "&:hover": {
                      backgroundColor: "rgba(31, 137, 229, 0.9)",
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  Book Appointment
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/staff")}
                  sx={{
                    px: 4,
                    py: 2,
                    backgroundColor: "transparent",
                    border: "2px solid #1f89e5",
                    color: "#1f89e5",
                    fontWeight: 700,
                    borderRadius: "0.75rem",
                    textTransform: "none",
                    fontSize: "1rem",
                    "&:hover": {
                      backgroundColor: "rgba(31, 137, 229, 0.05)",
                      border: "2px solid #1f89e5",
                    },
                  }}
                >
                  Find a Doctor
                </Button>
              </Box>

              {/* Trust Indicators */}
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, pt: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#00897B", fontWeight: 600 }}>
                  <Group sx={{ fontSize: "1.5rem" }} />
                  <Typography sx={{ fontWeight: 600, color: "#00897B" }}>
                    50+ Expert Doctors
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#00897B", fontWeight: 600 }}>
                  <Domain sx={{ fontSize: "1.5rem" }} />
                  <Typography sx={{ fontWeight: 600, color: "#00897B" }}>
                    15+ Departments
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#00897B", fontWeight: 600 }}>
                  <Emergency sx={{ fontSize: "1.5rem" }} />
                  <Typography sx={{ fontWeight: 600, color: "#00897B" }}>
                    24/7 Emergency
                  </Typography>
                </Box>
              </Box>

              {/* Emergency Banner */}
              <Box sx={{ maxWidth: "448px", mt: 1 }}>
                <Card
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                    backgroundColor: "white",
                    borderRadius: "0.75rem",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    borderLeft: "4px solid #E53935",
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "rgba(229, 57, 53, 0.1)",
                      borderRadius: "50%",
                      color: "#E53935",
                    }}
                  >
                    <Call />
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: "#E53935",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Emergency? Call our 24/7 Helpline
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "1.125rem",
                        fontWeight: 700,
                        color: "#263238",
                      }}
                    >
                      +1 (800) 123-4567
                    </Typography>
                  </Box>
                </Card>
              </Box>
            </Box>
          </Grid>

          {/* RIGHT SIDE: Visuals & Floating Cards */}
          <Grid item xs={12} lg={6}>
            <Box
              sx={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: { xs: "350px", lg: "calc(100vh - 200px)" },
                maxHeight: { xs: "350px", lg: "600px" },
              }}
            >
              {/* Main 3D Visual */}
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  maxWidth: "500px",
                  borderRadius: "1.5rem",
                  overflow: "hidden",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                }}
              >
                <Box
                  component="img"
                  alt="Professional medical team in a modern hospital setting"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuATYUHUbnjJJ0ukGfTvIZ8gYnL0KucRyGsX6BhC3LGn1nJ_UwOY50bmnfMZSxTy0bcbOpb9dB5gJaEM5vP2mtMui2LHkxgTFOXeRYA9fApl3auYLosUp06hzqUoSrKdpZCvKy0XjYjsaHna2ZgjwF_kSTa83Qa3veQkHn3Q_dYOMDS8zPf6S438pSnfcCEv5vUziTPVvbrLewHc3ZGq_Jorj1-PZTdopzrWBywlR-w_k5rzE8V7FJa0mBjGx7wQPNuWE35EEi9D_r_1"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />

                {/* Testimonial (Top Right - Higher) */}
                <Card
                  sx={{
                    position: "absolute",
                    top: { xs: 16, lg: 24 },
                    right: { xs: 12, lg: 24 },
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    px: 2,
                    py: 1,
                    borderRadius: "9999px",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 700,
                      color: "#263238",
                      fontStyle: "italic",
                    }}
                  >
                    "Amazing care!"
                  </Typography>
                  <Box sx={{ display: "flex", color: "#fbbf24" }}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        sx={{
                          fontSize: "0.875rem",
                          fill: "currentColor",
                          color: "#fbbf24",
                        }}
                      />
                    ))}
                  </Box>
                </Card>

                {/* Appointment Card (Top Right) */}
                <Card
                  sx={{
                    position: "absolute",
                    top: { xs: 80, lg: 96 },
                    right: { xs: -16, lg: -32 },
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    p: 2,
                    borderRadius: "0.75rem",
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                    width: "256px",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        backgroundColor: "rgba(31, 137, 229, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#1f89e5",
                      }}
                    >
                      <EventAvailable />
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          fontSize: "0.625rem",
                          textTransform: "uppercase",
                          fontWeight: 700,
                          color: "#1f89e5",
                          letterSpacing: "-0.025em",
                        }}
                      >
                        Appointment Confirmed
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.875rem",
                          fontWeight: 700,
                          color: "#263238",
                        }}
                      >
                        Dr. Sarah Chen
                      </Typography>
                    </Box>
                  </Box>
                </Card>

                {/* Vital Stats Card (Bottom Left of visual) */}
                <Card
                  sx={{
                    position: "absolute",
                    bottom: 48,
                    left: { xs: -16, lg: -32 },
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    borderTop: "2px solid rgba(0, 137, 123, 0.4)",
                    p: 2,
                    borderRadius: "0.75rem",
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <MonitorHeart sx={{ color: "#00897B", fontSize: "1.125rem" }} />
                      <Typography
                        sx={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: "#546E7A",
                        }}
                      >
                        Patient Vitals
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography
                          sx={{
                            fontSize: "0.625rem",
                            color: "#546E7A",
                            fontWeight: 500,
                          }}
                        >
                          BP
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "0.875rem",
                            fontWeight: 700,
                            color: "#263238",
                          }}
                        >
                          120/80
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: "1px",
                          height: "32px",
                          backgroundColor: "#e2e8f0",
                        }}
                      />
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography
                          sx={{
                            fontSize: "0.625rem",
                            color: "#546E7A",
                            fontWeight: 500,
                          }}
                        >
                          HR
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "0.875rem",
                            fontWeight: 700,
                            color: "#263238",
                          }}
                        >
                          72 bpm
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Card>
              </Box>

              {/* Global Stats Card (Bottom Center/Right) */}
              <Card
                sx={{
                  position: "absolute",
                  bottom: { xs: -24, lg: -24 },
                  left: { xs: 0, lg: "auto" },
                  right: { xs: 0, lg: 0 },
                  width: { xs: "100%", lg: "480px" },
                  backgroundColor: "white",
                  borderRadius: "1rem",
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                  p: 3,
                  border: "1px solid rgba(226, 232, 240, 1)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ textAlign: "center", px: 2 }}>
                  <Typography
                    sx={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: "#1f89e5",
                    }}
                  >
                    25+
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      color: "#546E7A",
                    }}
                  >
                    Years of Service
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: "1px",
                    height: "40px",
                    backgroundColor: "#f1f5f9",
                  }}
                />
                <Box sx={{ textAlign: "center", px: 2 }}>
                  <Typography
                    sx={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: "#1f89e5",
                    }}
                  >
                    5000+
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      color: "#546E7A",
                    }}
                  >
                    Patients
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: "1px",
                    height: "40px",
                    backgroundColor: "#f1f5f9",
                  }}
                />
                <Box sx={{ textAlign: "center", px: 2 }}>
                  <Typography
                    sx={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: "#00897B",
                    }}
                  >
                    98%
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      color: "#546E7A",
                    }}
                  >
                    Satisfaction
                  </Typography>
                </Box>
              </Card>

              {/* Floating Action Button */}
              <Button
                sx={{
                  position: "absolute",
                  bottom: 96,
                  right: { xs: -32, lg: -32 },
                  width: 56,
                  height: 56,
                  backgroundColor: "#1f89e5",
                  color: "white",
                  borderRadius: "50%",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "auto",
                  "&:hover": {
                    backgroundColor: "#1f89e5",
                    transform: "scale(1.1)",
                  },
                  transition: "transform 0.2s",
                }}
              >
                <Add sx={{ fontSize: "1.875rem" }} />
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Fade,
  Grid,
  CircularProgress,
} from "@mui/material";
import { Build } from "@mui/icons-material";

const buildImageUrl = (path) => {
  if (!path) return null;
  const normalized = path.replace(/\\/g, "/");
  if (normalized.startsWith("http")) return normalized;
  if (normalized.startsWith("/")) return normalized;
  return `/${normalized}`;
};

// Placeholder image when service has no image (optional Unsplash or local)
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=600&fit=crop";

export default function KeyServicesSection() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/services/public/key")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.success && Array.isArray(data.data)) {
          setServices(data.data);
        } else {
          setServices([]);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || "Failed to load services");
          setServices([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const imageFor = (service) => {
    const url = buildImageUrl(service.image);
    return url || PLACEHOLDER_IMAGE;
  };

  return (
    <Box
      sx={{
        pt: 0,
        pb: 0,
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        fontFamily: '"Calibri Light", Calibri, sans-serif',
      }}
    >
      <Card
        sx={{
          mx: 0.75,
          mt: 0.75,
          mb: 0.75,
          borderRadius: 3,
          border: "1px solid #cfe7cf",
          backgroundColor: "#f6f8f6",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          overflow: "visible",
          "& .MuiCardContent-root": {
            overflow: "visible",
          },
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            px: { xs: 1.5, sm: 1.5, md: 1.5 },
            pt: { xs: 0, sm: 0, md: 0 },
          }}
        >
          <Box
            sx={{
              pt: { xs: 2, md: 3 },
              pb: { xs: 1, sm: 1.5, md: 2 },
              px: { xs: 1.5, sm: 1.5, md: 1.5 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: 2,
                mb: 3,
              }}
            >
              <Fade in={isVisible} timeout={1000}>
                <Box
                  sx={{
                    maxWidth: "800px",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.15em",
                      color: "#13ec13",
                      fontFamily: '"Calibri Light", Calibri, sans-serif',
                      mb: 0,
                    }}
                  >
                    Key Services
                  </Typography>
                  <Typography
                    variant="h2"
                    sx={{
                      fontSize: { xs: "2rem", sm: "2.5rem", md: "3.5rem" },
                      fontWeight: 900,
                      color: "#0d1b0d",
                      fontFamily: '"Calibri Light", Calibri, sans-serif',
                      lineHeight: 1.2,
                      mb: 0,
                    }}
                  >
                    Our Expertise
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "1rem", md: "1.25rem" },
                      color: "#000000",
                      fontFamily: '"Calibri Light", Calibri, sans-serif',
                      lineHeight: 1.7,
                      maxWidth: "700px",
                    }}
                  >
                    We provide specialized, data-driven solutions for agricultural transformation and business excellence across the entire value chain.
                  </Typography>
                </Box>
              </Fade>
            </Box>
          </Box>
        </Container>

        {/* Services Grid */}
        <Container
          maxWidth="xl"
          disableGutters
          sx={{
            px: { xs: 0.5, sm: 0.5, md: 0.5 },
            pt: { xs: 0, sm: 0, md: 0 },
            pb: { xs: 1, sm: 1.5, md: 2 },
          }}
        >
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress sx={{ color: "#13ec13" }} />
            </Box>
          ) : error ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography sx={{ color: "#000000" }}>{error}</Typography>
            </Box>
          ) : (
            <Grid
              container
              spacing={{ xs: 0.8, sm: 0.8, md: 0.8 }}
              justifyContent="center"
            >
              {services.slice(0, 6).map((service, index) => (
                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                    md: 4,
                  }}
                  key={service.id}
                >
                  <Fade in={isVisible} timeout={1000 + index * 100}>
                    <Card
                      onClick={() => service.slug && navigate(`/service/${service.slug}`)}
                      sx={{
                        height: "100%",
                        width: "100%",
                        borderRadius: 3,
                        border: "1px solid #cfe7cf",
                        backgroundColor: "#f6f8f6",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        transition: "all 0.3s ease",
                        cursor: service.slug ? "pointer" : "default",
                        "&:hover": {
                          borderColor: "rgba(19, 236, 19, 0.5)",
                          boxShadow: "0 20px 25px -5px rgba(19, 236, 19, 0.1)",
                        },
                      }}
                    >
                      {/* Image */}
                      <Box
                        sx={{
                          width: "100%",
                          aspectRatio: "4/3",
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        <Box
                          component="img"
                          src={imageFor(service)}
                          alt={service.imageAltText || service.title}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            e.target.src = PLACEHOLDER_IMAGE;
                          }}
                        />
                      </Box>
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 2,
                            backgroundColor: "rgba(19, 236, 19, 0.2)",
                            color: "#13ec13",
                            mb: 2,
                          }}
                        >
                          <Build sx={{ fontSize: 26 }} />
                        </Box>
                        <Typography
                          variant="h3"
                          sx={{
                            fontSize: "1.25rem",
                            fontWeight: 700,
                            mb: 1.5,
                            color: "#000000",
                            fontFamily: '"Calibri Light", Calibri, sans-serif',
                          }}
                        >
                          {service.title}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "1rem",
                            color: "#000000",
                            fontFamily: '"Calibri Light", Calibri, sans-serif',
                            lineHeight: 1.75,
                          }}
                        >
                          {service.shortDescription || service.description || ""}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          )}
          {!loading && !error && services.length === 0 && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography sx={{ color: "#000000" }}>No key services at the moment.</Typography>
            </Box>
          )}
        </Container>
      </Card>
    </Box>
  );
}

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, IconButton, CircularProgress } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import TrainingEventsMap from "../components/TrainingEventsMap/TrainingEventsMap";

const PRIMARY = "#17cf54";
const BG_LIGHT = "#f6f8f6";

const getBaseUrl = () => {
  const env = typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_URL;
  return env ? String(env).replace(/\/$/, "") : "";
};

export default function TrainingOpportunitiesMapPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const base = getBaseUrl();
    fetch(`${base}/api/training-events/public`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) setEvents(data.data);
        else setEvents([]);
      })
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: BG_LIGHT, color: "#0e1b12", py: 2, px: 1 }}>
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 3,
            borderBottom: "1px solid",
            borderColor: "divider",
            pb: 2,
          }}
        >
          <IconButton
            onClick={() => navigate("/marketplace/training-opportunities")}
            sx={{
              color: "text.primary",
              "&:hover": { bgcolor: "action.hover" },
              "&:focus": { outline: "none" },
              "&:focus-visible": { outline: "none" },
            }}
            aria-label="Back to Training & Opportunities"
          >
            <ArrowBack />
          </IconButton>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              letterSpacing: "-0.01em",
              color: "text.primary",
            }}
          >
            Event locations
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress sx={{ color: PRIMARY }} />
          </Box>
        ) : (
          <TrainingEventsMap events={events} />
        )}
      </Box>
    </Box>
  );
}

import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography, Card, CardContent, LinearProgress, Skeleton } from "@mui/material";
import {
  MedicalServices,
  HealthAndSafety,
  LocalHospital,
  Notes,
  Science,
  Vaccines,
  MonitorHeart,
  TrendingUp,
  TrendingDown,
  HorizontalRule,
  AutoGraph,
  History,
} from "@mui/icons-material";
import AdminNavbar from "../components/Admin/AdminNavbar";
import { adminPortalOuterColumnSx, adminPortalMainContentSx } from "../components/Admin/adminPortalLayout";

const fallbackIcons = [
  <MedicalServices key="i1" />,
  <HealthAndSafety key="i2" />,
  <LocalHospital key="i3" />,
  <Notes key="i4" />,
  <Science key="i5" />,
  <Vaccines key="i6" />,
  <MonitorHeart key="i7" />,
];

const normalizeImagePath = (imagePath) => {
  if (!imagePath) return "";
  if (/^https?:\/\//i.test(imagePath)) return imagePath;
  if (imagePath.startsWith("/")) return imagePath;
  return `/${imagePath.replace(/^\/+/, "")}`;
};

function EngagementCard({ item }) {
  return (
    <Card
      sx={{
        bgcolor: "#131a1f",
        border: "1px solid rgba(67, 73, 77, 0.2)",
        borderRadius: 2,
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: "flex", gap: 1.5, mb: 2.5 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              overflow: "hidden",
              display: "grid",
              placeItems: "center",
              color: item.color,
              bgcolor: "rgba(153,247,255,0.08)",
              border: "1px solid rgba(153,247,255,0.2)",
            }}
          >
            {item.logo ? (
              <Box
                component="img"
                src={item.logo}
                alt={`${item.name} logo`}
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              item.icon
            )}
          </Box>
          <Box>
            <Typography sx={{ color: "#e0e6ec", fontWeight: 800 }}>{item.name}</Typography>
            <Typography sx={{ color: "#a6acb1", fontSize: 12 }}>{item.phone}</Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
            <Typography sx={{ color: "#a6acb1", fontSize: 11, fontWeight: 800, letterSpacing: 0.6 }}>
              ENGAGEMENT
            </Typography>
            <Typography sx={{ color: item.color, fontSize: 12, fontWeight: 800 }}>{item.engagement}%</Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={item.engagement}
            sx={{
              height: 8,
              borderRadius: 999,
              bgcolor: "#0e1419",
              "& .MuiLinearProgress-bar": {
                bgcolor: item.color,
              },
            }}
          />
        </Box>

        <Box sx={{ borderTop: "1px solid rgba(67,73,77,0.2)", pt: 1.5, display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ color: "#a6acb1", fontSize: 10, letterSpacing: 1, fontWeight: 700 }}>
            STATUS: {item.status}
          </Typography>
          <Box sx={{ color: item.color, display: "flex", alignItems: "center", gap: 0.5 }}>
            {item.trendIcon}
            <Typography sx={{ fontSize: 10, fontWeight: 700 }}>
              {item.trendPct > 0 ? `+${item.trendPct}%` : `${item.trendPct}%`}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function AdminHome() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOverview = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        if (!token) {
          setLoading(false);
          return;
        }
        const res = await fetch("/api/admin-auth/overview", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || !json?.success) {
          setLoading(false);
          return;
        }

        const mapped = (json.data || []).map((row, idx) => {
          const engagement = Number(row.engagement) || 0;
          const actionsWeek = Number(row?.metrics?.actions_this_week) || 0;
          const trendPct = Number(row?.trend_pct_week) || 0;
          const trendDirection = row?.trend_direction || "flat";
          return {
            name: row.name || "Unnamed Hospital",
            phone: `${row.phone || "No phone"} • ${actionsWeek} actions/week`,
            engagement,
            status: row.status || "Low Activity",
            color: engagement >= 85 ? "#99f7ff" : engagement >= 60 ? "#b7fdff" : "#ff716c",
            logo: normalizeImagePath(row.logo_path),
            icon: fallbackIcons[idx % fallbackIcons.length],
            trendIcon:
              trendDirection === "up" ? (
                <TrendingUp />
              ) : trendDirection === "down" ? (
                <TrendingDown />
              ) : (
                <HorizontalRule />
              ),
            trendPct,
          };
        });
        setCards(mapped);
      } catch (e) {
        // Keep page styling and fallback card if request fails.
        setCards([]);
      } finally {
        setLoading(false);
      }
    };

    loadOverview();
  }, []);

  const displayCards = useMemo(() => {
    if (cards.length) return cards;
    return [
      {
        name: "No hospitals yet",
        phone: "Data will appear here",
        engagement: 0,
        status: "Monitoring",
        color: "#b7fdff",
        icon: <MedicalServices />,
        trendIcon: <History />,
        trendPct: 0,
        logo: "",
      },
    ];
  }, [cards]);

  const skeletonCards = useMemo(() => Array.from({ length: 12 }, (_, idx) => idx), []);

  return (
    <Box sx={{ ...adminPortalOuterColumnSx, bgcolor: "#090f13", color: "#e0e6ec" }}>
      <AdminNavbar />

      <Box sx={adminPortalMainContentSx}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between", mb: 2.5, gap: 2 }}>
          <Box>
            <Typography sx={{ fontSize: { xs: "1.7rem", md: "2.25rem" }, fontWeight: 800, letterSpacing: "-0.02em" }}>
              Hospital Engagement Overview
            </Typography>
            <Typography sx={{ color: "#a6acb1", mt: 1 }}>
              Real-time performance and system integration metrics across the network.
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(4, minmax(0, 1fr))",
            },
            gap: 2,
          }}
        >
          {loading
            ? skeletonCards.map((idx) => (
                <Card
                  key={`skeleton-${idx}`}
                  sx={{
                    bgcolor: "#131a1f",
                    border: "1px solid rgba(67, 73, 77, 0.2)",
                    borderRadius: 2,
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: "flex", gap: 1.5, mb: 2.5 }}>
                      <Skeleton
                        variant="circular"
                        width={56}
                        height={56}
                        sx={{ bgcolor: "rgba(255,255,255,0.08)" }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Skeleton width="70%" height={24} sx={{ bgcolor: "rgba(255,255,255,0.08)" }} />
                        <Skeleton width="85%" height={18} sx={{ bgcolor: "rgba(255,255,255,0.08)" }} />
                      </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.75 }}>
                        <Skeleton width={90} height={16} sx={{ bgcolor: "rgba(255,255,255,0.08)" }} />
                        <Skeleton width={36} height={16} sx={{ bgcolor: "rgba(255,255,255,0.08)" }} />
                      </Box>
                      <Skeleton
                        variant="rounded"
                        height={8}
                        sx={{ borderRadius: 999, bgcolor: "rgba(255,255,255,0.08)" }}
                      />
                    </Box>

                    <Box sx={{ borderTop: "1px solid rgba(67,73,77,0.2)", pt: 1.5, display: "flex", justifyContent: "space-between" }}>
                      <Skeleton width={120} height={14} sx={{ bgcolor: "rgba(255,255,255,0.08)" }} />
                      <Skeleton width={56} height={14} sx={{ bgcolor: "rgba(255,255,255,0.08)" }} />
                    </Box>
                  </CardContent>
                </Card>
              ))
            : displayCards.map((item, idx) => (
                <EngagementCard key={`${item.name}-${idx}`} item={item} />
              ))}
        </Box>
      </Box>
    </Box>
  );
}


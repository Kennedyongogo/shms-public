import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Diamond, EmojiEvents, Star, WorkspacePremium, Stars, Download as DownloadIcon, Apartment as ApartmentIcon, MedicalServices, HealthAndSafety } from "@mui/icons-material";
import AdminNavbar from "../components/Admin/AdminNavbar";
import { adminPortalOuterColumnSx, adminPortalMainContentSx } from "../components/Admin/adminPortalLayout";

function SubscriptionCard({ variant, value }) {
  const isSilver = variant === "silver";

  return (
    <Card
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 4,
        border: "1px solid rgba(255,255,255,0.15)",
        color: "white",
        cursor: "default",
        boxShadow: isSilver
          ? "0px 20px 40px rgba(148,163,184,0.15)"
          : "0px 20px 40px rgba(180,83,9,0.15)",
        background: isSilver ? "linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%)" : "linear-gradient(135deg, #fbbf24 0%, #b45309 100%)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          opacity: 0.22,
          fontSize: 90,
          lineHeight: 1,
          pointerEvents: "none",
        }}
      >
        {isSilver ? <WorkspacePremium sx={{ fontSize: 90 }} /> : <Star sx={{ fontSize: 90 }} />}
      </Box>

      <CardContent sx={{ p: 5, "&:last-child": { pb: 5 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Box
            sx={{
              px: 2,
              py: 0.75,
              borderRadius: 999,
              backgroundColor: isSilver ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.10)",
              fontSize: 12,
              fontWeight: 900,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            {isSilver ? "Silver Package" : "Gold Package"}
          </Box>

          {isSilver ? <WorkspacePremium sx={{ color: "rgba(255,255,255,0.85)" }} /> : <Star sx={{ color: "rgba(255,255,255,0.9)" }} />}
        </Stack>

        <Box sx={{ mt: 2 }}>
          <Typography sx={{ fontSize: { xs: 52, md: 60 }, fontWeight: 1000, letterSpacing: "-0.03em", lineHeight: 1 }}>
            {value ?? (isSilver ? "48" : "27")}
          </Typography>
          <Typography sx={{ mt: 0.5, fontSize: 14, color: "rgba(255,255,255,0.85)", fontWeight: 700 }}>
            Current Subscribers
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 3, color: "rgba(255,255,255,0.8)" }}>
          {isSilver ? <EmojiEvents sx={{ fontSize: 18 }} /> : <Diamond sx={{ fontSize: 18 }} />}
          <Typography sx={{ fontSize: 12, fontWeight: 900 }}>
            {isSilver ? "Essential Clinical Modules" : "Full Atelier Suite Access"}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1.25, color: "rgba(255,255,255,0.72)" }}>
          {isSilver ? <Stars sx={{ fontSize: 16 }} /> : <WorkspacePremium sx={{ fontSize: 16 }} />}
          <Typography sx={{ fontSize: 12, fontWeight: 800 }}>
            {isSilver ? "Ethereal clinical tooling" : "End-to-end feature suite"}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function Subscription() {
  const [silverHospitals, setSilverHospitals] = useState(48);
  const [goldHospitals, setGoldHospitals] = useState(27);

  const [search, setSearch] = useState("");
  const [packageFilter, setPackageFilter] = useState("All Packages");
  const [statusFilter, setStatusFilter] = useState("Status: All");

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/admin-auth/packages/hospitals", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (!res.ok || !json?.success || !json?.data) return;

        setSilverHospitals(Number(json.data.silver ?? 0));
        setGoldHospitals(Number(json.data.gold ?? 0));
      } catch {
        // keep defaults
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Demo ledger rows (wire to backend later if needed).
  const ledgerRows = useMemo(
    () => [
      {
        facility: "City General Hospital",
        package: "Gold",
        registered: "2025-01-15",
        dueDate: "2026-03-01",
        amount: 12500.0,
        status: "Paid",
        icon: "apartment",
      },
      {
        facility: "St. Mary's Medical Center",
        package: "Gold",
        registered: "2025-02-10",
        dueDate: "2026-03-05",
        amount: 12500.0,
        status: "Paid",
        icon: "medical",
      },
      {
        facility: "Northside Community Hospital",
        package: "Silver",
        registered: "2025-03-20",
        dueDate: "2026-03-10",
        amount: 5800.0,
        status: "Paid",
        icon: "health",
      },
      {
        facility: "West End Specialty Clinic",
        package: "Silver",
        registered: "2025-04-05",
        dueDate: "2026-03-12",
        amount: 5800.0,
        status: "Pending",
        icon: "medical",
      },
      {
        facility: "Eastside Surgical Center",
        package: "Gold",
        registered: "2025-05-12",
        dueDate: "2026-03-08",
        amount: 12500.0,
        status: "Paid",
        icon: "apartment",
      },
      {
        facility: "Harbor Children's Hospital",
        package: "Silver",
        registered: "2025-06-18",
        dueDate: "2026-03-15",
        amount: 5800.0,
        status: "Overdue",
        icon: "health",
      },
    ],
    []
  );

  const statusChip = (status) => {
    const s = status || "";
    if (s === "Paid") {
      return <Chip size="small" label="Paid" sx={{ bgcolor: "rgba(16, 185, 129, 0.12)", color: "#34d399", fontWeight: 900, fontSize: 12, borderRadius: 999, px: 1.2 }} />;
    }
    if (s === "Pending") {
      return <Chip size="small" label="Pending" sx={{ bgcolor: "rgba(245, 158, 11, 0.12)", color: "#fbbf24", fontWeight: 900, fontSize: 12, borderRadius: 999, px: 1.2 }} />;
    }
    if (s === "Overdue") {
      return <Chip size="small" label="Overdue" sx={{ bgcolor: "rgba(239, 68, 68, 0.12)", color: "#f87171", fontWeight: 900, fontSize: 12, borderRadius: 999, px: 1.2 }} />;
    }
    return <Chip size="small" label={s || "—"} sx={{ fontWeight: 900, fontSize: 12, borderRadius: 999, px: 1.2 }} />;
  };

  const fmtMoney = (n) => {
    const v = Number(n || 0);
    return v.toLocaleString(undefined, { style: "currency", currency: "USD" });
  };

  const filteredRows = useMemo(() => {
    const q = String(search || "").trim().toLowerCase();
    return ledgerRows.filter((r) => {
      if (q && !r.facility.toLowerCase().includes(q)) return false;
      if (packageFilter !== "All Packages" && r.package !== packageFilter) return false;
      if (statusFilter !== "Status: All" && r.status !== statusFilter.replace("Status: ", "")) return false;
      return true;
    });
  }, [ledgerRows, packageFilter, search, statusFilter]);

  return (
    <Box sx={{ ...adminPortalOuterColumnSx, bgcolor: "#090f13", color: "#e0e6ec" }}>
      <AdminNavbar />
      <Box sx={adminPortalMainContentSx}>
        <Box
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
            gap: 3,
            mt: 1,
          }}
        >
          <SubscriptionCard variant="silver" value={silverHospitals} />
          <SubscriptionCard variant="gold" value={goldHospitals} />
        </Box>

        <Box sx={{ mt: 6, width: "100%" }}>
          <Stack direction={{ xs: "column", md: "row" }} alignItems={{ xs: "flex-start", md: "flex-end" }} justifyContent="space-between" gap={2}>
            <Box>
              <Typography sx={{ fontSize: 34, fontWeight: 900, letterSpacing: "-0.02em" }}>Hospital Ledger</Typography>
              <Typography sx={{ color: "rgba(166,172,177,1)", mt: 0.8, fontWeight: 700 }}>Fiscal Year 2025-26 Subscriptions</Typography>
            </Box>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ width: { xs: "100%", md: "auto" } }}>
              <TextField
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search hospital..."
                size="small"
                sx={{
                  minWidth: { xs: "100%", sm: 260 },
                  "& .MuiOutlinedInput-root": { bgcolor: "rgba(255,255,255,0.06)", borderRadius: 2 },
                }}
              />

              <Select
                size="small"
                value={packageFilter}
                onChange={(e) => setPackageFilter(e.target.value)}
                sx={{
                  minWidth: 180,
                  bgcolor: "rgba(255,255,255,0.06)",
                  borderRadius: 2,
                  "& .MuiSelect-select": { py: 1 },
                }}
              >
                <MenuItem value="All Packages">All Packages</MenuItem>
                <MenuItem value="Gold">Gold</MenuItem>
                <MenuItem value="Silver">Silver</MenuItem>
              </Select>

              <Select
                size="small"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={{
                  minWidth: 180,
                  bgcolor: "rgba(255,255,255,0.06)",
                  borderRadius: 2,
                  "& .MuiSelect-select": { py: 1 },
                }}
              >
                <MenuItem value="Status: All">Status: All</MenuItem>
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Overdue">Overdue</MenuItem>
              </Select>
            </Stack>
          </Stack>

          <Box sx={{ mt: 3, bgcolor: "rgba(255,255,255,0.06)", borderRadius: 4, border: "1px solid rgba(114,119,131,0.08)", overflow: "hidden" }}>
            <TableContainer component={Paper} elevation={0} sx={{ bgcolor: "transparent" }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ "& th": { borderBottom: "1px solid rgba(114,119,131,0.14)", color: "rgba(166,172,177,0.9)", fontWeight: 900, fontSize: 11, letterSpacing: 1 } }}>
                    <TableCell sx={{ py: 1.4, px: 3 }}>Hospital Facility</TableCell>
                    <TableCell align="center" sx={{ py: 1.4, px: 2 }}>
                      Package
                    </TableCell>
                    <TableCell sx={{ py: 1.4, px: 2 }}>Registered</TableCell>
                    <TableCell sx={{ py: 1.4, px: 2 }}>Due Date</TableCell>
                    <TableCell align="right" sx={{ py: 1.4, px: 2 }}>
                      Invoice Amount
                    </TableCell>
                    <TableCell align="center" sx={{ py: 1.4, px: 2 }}>
                      Status
                    </TableCell>
                    <TableCell align="right" sx={{ py: 1.4, px: 3 }}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredRows.map((r, idx) => {
                    const Icon = r.icon === "apartment" ? ApartmentIcon : r.icon === "health" ? HealthAndSafety : MedicalServices;
                    const packageTone =
                      r.package === "Gold"
                        ? { bgcolor: "rgba(251, 191, 36, 0.18)", color: "#fbbf24" }
                        : { bgcolor: "rgba(148, 163, 184, 0.18)", color: "#e0e3e5" };
                    return (
                      <TableRow
                        key={`${r.facility}-${idx}`}
                        sx={{
                          "& td": { borderBottom: "1px solid rgba(114,119,131,0.12)", color: "rgba(226,232,240,0.95)", fontWeight: 700 },
                          "&:hover": { bgcolor: "rgba(255,255,255,0.04)" },
                        }}
                      >
                        <TableCell sx={{ py: 1.6, px: 3 }}>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Box sx={{ width: 34, height: 34, borderRadius: 2, bgcolor: "rgba(0,71,141,0.10)", display: "grid", placeItems: "center", color: "#60a5fa" }}>
                              <Icon fontSize="small" />
                            </Box>
                            <Typography sx={{ fontWeight: 900 }}>{r.facility}</Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="center" sx={{ py: 1.6, px: 2 }}>
                          <Chip
                            size="small"
                            label={r.package}
                            sx={{
                              bgcolor: packageTone.bgcolor,
                              color: packageTone.color,
                              fontWeight: 900,
                              fontSize: 11,
                              borderRadius: 999,
                              textTransform: "uppercase",
                              letterSpacing: 0.6,
                              px: 1.2,
                            }}
                          />
                        </TableCell>

                        <TableCell sx={{ py: 1.6, px: 2 }}>{r.registered}</TableCell>
                        <TableCell sx={{ py: 1.6, px: 2 }}>{r.dueDate}</TableCell>
                        <TableCell align="right" sx={{ py: 1.6, px: 2, fontWeight: 900 }}>
                          {fmtMoney(r.amount)}
                        </TableCell>
                        <TableCell align="center" sx={{ py: 1.6, px: 2 }}>
                          {statusChip(r.status)}
                        </TableCell>
                        <TableCell align="right" sx={{ py: 1.6, px: 3 }}>
                          <IconButton
                            size="small"
                            sx={{ color: "#60a5fa" }}
                            onClick={() => {
                              // Placeholder for future download invoice/payment receipt.
                              console.log("Download action for", r.facility);
                            }}
                          >
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  {filteredRows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} sx={{ py: 3, textAlign: "center", color: "rgba(166,172,177,1)" }}>
                        No records found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box
            sx={{
              mt: 4,
              bgcolor: "rgba(0,0,0,0.18)",
              border: "1px solid rgba(114,119,131,0.10)",
              borderRadius: 4,
              px: 3,
              py: 2.5,
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "flex-start", md: "center" },
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Stack direction="row" spacing={4} sx={{ alignItems: "baseline", flexWrap: "wrap" }}>
              <Box>
                <Typography sx={{ fontSize: 12, fontWeight: 900, color: "rgba(166,172,177,1)", textTransform: "uppercase", letterSpacing: 0.6 }}>
                  Total Hospitals
                </Typography>
                <Typography sx={{ fontSize: 28, fontWeight: 1000 }}>8 Facilities</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: 12, fontWeight: 900, color: "rgba(166,172,177,1)", textTransform: "uppercase", letterSpacing: 0.6 }}>
                  Active Subscriptions
                </Typography>
                <Typography sx={{ fontSize: 28, fontWeight: 1000 }}>7/8</Typography>
              </Box>
            </Stack>

            <Box
              sx={{
                px: 3,
                py: 1.8,
                borderRadius: 3,
                bgcolor: "rgba(255,255,255,0.08)",
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Typography sx={{ fontSize: 12, fontWeight: 900, color: "rgba(166,172,177,1)", textTransform: "uppercase", letterSpacing: 0.6 }}>
                Total Revenue (FY25)
              </Typography>
              <Typography sx={{ fontSize: 28, fontWeight: 1000 }}>$72,400.00</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}


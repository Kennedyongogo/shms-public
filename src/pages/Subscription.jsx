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
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
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
            {value === null || value === undefined ? "—" : value}
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
  const [silverHospitals, setSilverHospitals] = useState(0);
  const [goldHospitals, setGoldHospitals] = useState(0);
  const [packageCountsLoaded, setPackageCountsLoaded] = useState(false);

  const [search, setSearch] = useState("");
  const [packageFilter, setPackageFilter] = useState("All Packages");

  const [ledgerTab, setLedgerTab] = useState("payments");

  const [ledgerRows, setLedgerRows] = useState([]);
  const [invoiceRows, setInvoiceRows] = useState([]);
  const [ledgerLoading, setLedgerLoading] = useState(true);
  const [fiscalYearLabel, setFiscalYearLabel] = useState("2025-26");
  const [ledgerSummary, setLedgerSummary] = useState({
    paymentCount: 0,
    uniqueHospitalCount: 0,
    totalRevenueAllKes: 0,
    totalRevenueFyKes: 0,
  });
  const [invoiceSummary, setInvoiceSummary] = useState({
    total: 0,
    unpaidCount: 0,
    paidCount: 0,
    unpaidAmountKes: 0,
    paidAmountKes: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      setLedgerLoading(false);
      setPackageCountsLoaded(true);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const [pkgRes, ledgerRes, invoiceRes] = await Promise.all([
          fetch("/api/admin-auth/packages/hospitals", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin-auth/ledger/subscriptions", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin-auth/ledger/invoices", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const pkgJson = await pkgRes.json().catch(() => ({}));
        const ledgerJson = await ledgerRes.json().catch(() => ({}));
        const invoiceJson = await invoiceRes.json().catch(() => ({}));
        if (cancelled) return;

        if (pkgRes.ok && pkgJson?.success && pkgJson?.data) {
          setSilverHospitals(Number(pkgJson.data.silver ?? 0));
          setGoldHospitals(Number(pkgJson.data.gold ?? 0));
        }

        if (ledgerRes.ok && ledgerJson?.success && ledgerJson?.data) {
          setLedgerRows(Array.isArray(ledgerJson.data.rows) ? ledgerJson.data.rows : []);
          if (ledgerJson.data.fiscalYearLabel) {
            setFiscalYearLabel(String(ledgerJson.data.fiscalYearLabel));
          }
          const s = ledgerJson.data.summary || {};
          setLedgerSummary({
            paymentCount: Number(s.paymentCount ?? 0),
            uniqueHospitalCount: Number(s.uniqueHospitalCount ?? 0),
            totalRevenueAllKes: Number(s.totalRevenueAllKes ?? 0),
            totalRevenueFyKes: Number(s.totalRevenueFyKes ?? 0),
          });
        }

        if (invoiceRes.ok && invoiceJson?.success && invoiceJson?.data) {
          setInvoiceRows(Array.isArray(invoiceJson.data.rows) ? invoiceJson.data.rows : []);
          const inv = invoiceJson.data.summary || {};
          setInvoiceSummary({
            total: Number(inv.total ?? 0),
            unpaidCount: Number(inv.unpaidCount ?? 0),
            paidCount: Number(inv.paidCount ?? 0),
            unpaidAmountKes: Number(inv.unpaidAmountKes ?? 0),
            paidAmountKes: Number(inv.paidAmountKes ?? 0),
          });
        }
      } catch {
        // keep defaults
      } finally {
        if (!cancelled) {
          setLedgerLoading(false);
          setPackageCountsLoaded(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const statusChip = (status) => {
    const s = status || "";
    if (s === "Paid") {
      return <Chip size="small" label="Paid" sx={{ bgcolor: "rgba(16, 185, 129, 0.12)", color: "#34d399", fontWeight: 900, fontSize: 12, borderRadius: 999, px: 1.2 }} />;
    }
    if (s === "Unpaid") {
      return <Chip size="small" label="Unpaid" sx={{ bgcolor: "rgba(245, 158, 11, 0.14)", color: "#fbbf24", fontWeight: 900, fontSize: 12, borderRadius: 999, px: 1.2 }} />;
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
    return v.toLocaleString(undefined, { style: "currency", currency: "KES" });
  };

  const filteredRows = useMemo(() => {
    const q = String(search || "").trim().toLowerCase();
    return ledgerRows.filter((r) => {
      if (q && !String(r.facility || "").toLowerCase().includes(q)) return false;
      if (packageFilter !== "All Packages" && r.package !== packageFilter) return false;
      return true;
    });
  }, [ledgerRows, packageFilter, search]);

  const filteredInvoiceRows = useMemo(() => {
    const q = String(search || "").trim().toLowerCase();
    return invoiceRows.filter((r) => {
      if (q && !String(r.facility || "").toLowerCase().includes(q)) return false;
      if (packageFilter !== "All Packages" && r.package !== packageFilter) return false;
      return true;
    });
  }, [invoiceRows, packageFilter, search]);

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
          <SubscriptionCard variant="silver" value={packageCountsLoaded ? silverHospitals : null} />
          <SubscriptionCard variant="gold" value={packageCountsLoaded ? goldHospitals : null} />
        </Box>

        <Box sx={{ mt: 6, width: "100%" }}>
          <Stack direction={{ xs: "column", md: "row" }} alignItems={{ xs: "flex-start", md: "flex-end" }} justifyContent="space-between" gap={2}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: 34, fontWeight: 900, letterSpacing: "-0.02em" }}>Hospital Ledger</Typography>
              <Typography sx={{ color: "rgba(166,172,177,1)", mt: 0.8, fontWeight: 700 }}>
                {ledgerTab === "payments"
                  ? `Paystack registration payments · FY ${fiscalYearLabel}`
                  : "Registration invoices (paid / unpaid) · all organizations"}
              </Typography>
              <Tabs
                value={ledgerTab}
                onChange={(_, v) => setLedgerTab(v)}
                sx={{
                  mt: 2,
                  minHeight: 40,
                  "& .MuiTab-root": {
                    color: "rgba(166,172,177,0.9)",
                    fontWeight: 800,
                    textTransform: "none",
                    minHeight: 40,
                  },
                  "& .Mui-selected": { color: "#60a5fa !important" },
                  "& .MuiTabs-indicator": { bgcolor: "#60a5fa" },
                }}
              >
                <Tab label="Payments" value="payments" />
                <Tab label="Invoices" value="invoices" />
              </Tabs>
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
                    <TableCell sx={{ py: 1.4, px: 2 }}>{ledgerTab === "payments" ? "Registered" : "Created"}</TableCell>
                    <TableCell sx={{ py: 1.4, px: 2 }}>Due Date</TableCell>
                    <TableCell align="right" sx={{ py: 1.4, px: 2 }}>
                      {ledgerTab === "payments" ? "Amount" : "Invoice amount"}
                    </TableCell>
                    <TableCell align="center" sx={{ py: 1.4, px: 2 }}>
                      Status
                    </TableCell>
                    <TableCell align="right" sx={{ py: 1.4, px: 3 }}>
                      {ledgerTab === "payments" ? "Action" : "Paid on"}
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {ledgerLoading && (
                    <TableRow>
                      <TableCell colSpan={7} sx={{ py: 3, textAlign: "center", color: "rgba(166,172,177,1)" }}>
                        Loading ledger…
                      </TableCell>
                    </TableRow>
                  )}
                  {!ledgerLoading &&
                    ledgerTab === "payments" &&
                    filteredRows.map((r, idx) => {
                      const Icon = r.icon === "apartment" ? ApartmentIcon : r.icon === "health" ? HealthAndSafety : MedicalServices;
                      const packageTone =
                        r.package === "Gold"
                          ? { bgcolor: "rgba(251, 191, 36, 0.18)", color: "#fbbf24" }
                          : { bgcolor: "rgba(148, 163, 184, 0.18)", color: "#e0e3e5" };
                      return (
                        <TableRow
                          key={`${r.paymentId || r.paystackReference || idx}-${idx}`}
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
                                console.log("Payment", r.paystackReference, r.facility);
                              }}
                            >
                              <DownloadIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}

                  {!ledgerLoading &&
                    ledgerTab === "invoices" &&
                    filteredInvoiceRows.map((r, idx) => {
                      const Icon = r.icon === "apartment" ? ApartmentIcon : r.icon === "health" ? HealthAndSafety : MedicalServices;
                      const packageTone =
                        r.package === "Gold"
                          ? { bgcolor: "rgba(251, 191, 36, 0.18)", color: "#fbbf24" }
                          : { bgcolor: "rgba(148, 163, 184, 0.18)", color: "#e0e3e5" };
                      return (
                        <TableRow
                          key={`${r.invoiceId || idx}-${idx}`}
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

                          <TableCell sx={{ py: 1.6, px: 2 }}>{r.createdAt}</TableCell>
                          <TableCell sx={{ py: 1.6, px: 2 }}>{r.dueDate}</TableCell>
                          <TableCell align="right" sx={{ py: 1.6, px: 2, fontWeight: 900 }}>
                            {fmtMoney(r.amount)}
                          </TableCell>
                          <TableCell align="center" sx={{ py: 1.6, px: 2 }}>
                            {statusChip(r.status)}
                          </TableCell>
                          <TableCell align="right" sx={{ py: 1.6, px: 3 }}>
                            <Typography sx={{ fontSize: 12, color: "rgba(166,172,177,1)", fontWeight: 700 }}>
                              {r.paidAt || "—"}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}

                  {!ledgerLoading && ledgerTab === "payments" && filteredRows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} sx={{ py: 3, textAlign: "center", color: "rgba(166,172,177,1)" }}>
                        No records found.
                      </TableCell>
                    </TableRow>
                  )}

                  {!ledgerLoading && ledgerTab === "invoices" && filteredInvoiceRows.length === 0 && (
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
              {ledgerTab === "payments" ? (
                <>
                  <Box>
                    <Typography sx={{ fontSize: 12, fontWeight: 900, color: "rgba(166,172,177,1)", textTransform: "uppercase", letterSpacing: 0.6 }}>
                      Payments recorded
                    </Typography>
                    <Typography sx={{ fontSize: 28, fontWeight: 1000 }}>{ledgerSummary.paymentCount}</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 12, fontWeight: 900, color: "rgba(166,172,177,1)", textTransform: "uppercase", letterSpacing: 0.6 }}>
                      Hospitals (paid registration)
                    </Typography>
                    <Typography sx={{ fontSize: 28, fontWeight: 1000 }}>{ledgerSummary.uniqueHospitalCount}</Typography>
                  </Box>
                </>
              ) : (
                <>
                  <Box>
                    <Typography sx={{ fontSize: 12, fontWeight: 900, color: "rgba(166,172,177,1)", textTransform: "uppercase", letterSpacing: 0.6 }}>
                      Invoices
                    </Typography>
                    <Typography sx={{ fontSize: 28, fontWeight: 1000 }}>{invoiceSummary.total}</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 12, fontWeight: 900, color: "rgba(166,172,177,1)", textTransform: "uppercase", letterSpacing: 0.6 }}>
                      Unpaid / Paid
                    </Typography>
                    <Typography sx={{ fontSize: 28, fontWeight: 1000 }}>
                      {invoiceSummary.unpaidCount} / {invoiceSummary.paidCount}
                    </Typography>
                  </Box>
                </>
              )}
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
              {ledgerTab === "payments" ? (
                <>
                  <Typography sx={{ fontSize: 12, fontWeight: 900, color: "rgba(166,172,177,1)", textTransform: "uppercase", letterSpacing: 0.6 }}>
                    Total Revenue (FY{fiscalYearLabel.replace("-", "–")})
                  </Typography>
                  <Typography sx={{ fontSize: 28, fontWeight: 1000 }}>{fmtMoney(ledgerSummary.totalRevenueFyKes)}</Typography>
                </>
              ) : (
                <>
                  <Stack spacing={0.5} sx={{ alignItems: "flex-end" }}>
                    <Typography sx={{ fontSize: 12, fontWeight: 900, color: "rgba(166,172,177,1)", textTransform: "uppercase", letterSpacing: 0.6 }}>
                      Unpaid total
                    </Typography>
                    <Typography sx={{ fontSize: 22, fontWeight: 1000 }}>{fmtMoney(invoiceSummary.unpaidAmountKes)}</Typography>
                  </Stack>
                  <Stack spacing={0.5} sx={{ alignItems: "flex-end", pl: 2, borderLeft: "1px solid rgba(114,119,131,0.2)" }}>
                    <Typography sx={{ fontSize: 12, fontWeight: 900, color: "rgba(166,172,177,1)", textTransform: "uppercase", letterSpacing: 0.6 }}>
                      Paid total
                    </Typography>
                    <Typography sx={{ fontSize: 22, fontWeight: 1000 }}>{fmtMoney(invoiceSummary.paidAmountKes)}</Typography>
                  </Stack>
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}


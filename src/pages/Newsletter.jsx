import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
  TablePagination,
  Typography,
  Tooltip,
} from "@mui/material";
import Swal from "sweetalert2";
import AdminNavbar from "../components/Admin/AdminNavbar";
import { adminPortalOuterColumnSx, adminPortalMainContentSx } from "../components/Admin/adminPortalLayout";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { Send as SendIcon, AttachFile as AttachFileIcon, Visibility as VisibilityIcon } from "@mui/icons-material";

function formatDate(value) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleString();
}

export default function Newsletter() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });

  // MUI TablePagination uses a 0-based page index.
  const [pageIndex, setPageIndex] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const offset = useMemo(() => pageIndex * rowsPerPage, [pageIndex, rowsPerPage]);

  // Send/queue dialog state (no email provider yet, this just creates a campaign skeleton)
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [sendSubject, setSendSubject] = useState("");
  const [sendBody, setSendBody] = useState("");
  const [sendAttachment, setSendAttachment] = useState(null);
  const [sending, setSending] = useState(false);
  // SweetAlert is shown after the send dialog closes to avoid z-index overlap.

  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      setLoading(false);
      setError("Admin token not found. Please log in again.");
      return;
    }

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const apiPage = pageIndex + 1;
        const res = await fetch(
          `/api/newsletter/admin/subscribers?page=${apiPage}&limit=${rowsPerPage}`,
          {
          headers: { Authorization: `Bearer ${token}` },
          }
        );
        const json = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (!res.ok || !json?.success) {
          throw new Error(json?.message || "Failed to load newsletter subscribers");
        }
        setSubscribers(Array.isArray(json.data) ? json.data : []);
        setPagination(json.pagination || { total: 0, page: apiPage, limit: rowsPerPage, totalPages: 1 });
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load newsletter subscribers");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pageIndex, rowsPerPage]);

  const total = pagination?.total ?? 0;
  const skeletonRows = useMemo(() => Array.from({ length: rowsPerPage }, (_, i) => i), [rowsPerPage]);

  return (
    <Box sx={{ ...adminPortalOuterColumnSx, bgcolor: "#090f13", color: "#e0e6ec" }}>
      <AdminNavbar />
      <Box sx={adminPortalMainContentSx}>
        <Typography sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 900, letterSpacing: "-0.02em" }}>
          Newsletter Subscribers
        </Typography>

        {!loading && error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {!error && (
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              mt: 2,
              bgcolor: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(114,119,131,0.14)",
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow sx={{ "& th": { color: "#a6acb1", fontWeight: 800, borderBottom: "1px solid rgba(114,119,131,0.14)" } }}>
                  <TableCell sx={{ width: 56, display: { xs: "none", md: "table-cell" } }}>No</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>Status</TableCell>
                  <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>Subscribed At</TableCell>
                  <TableCell sx={{ width: 140, textAlign: "right" }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  skeletonRows.map((idx) => (
                    <TableRow
                      key={`skeleton-${idx}`}
                      sx={{
                        "& td": { borderBottom: "1px solid rgba(114,119,131,0.1)", color: "#e0e6ec" },
                      }}
                    >
                      <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                        <Skeleton variant="text" width={28} />
                      </TableCell>
                      <TableCell>
                        <Skeleton variant="text" width="70%" />
                      </TableCell>
                      <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                        <Skeleton variant="text" width={80} />
                      </TableCell>
                      <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                        <Skeleton variant="text" width="80%" />
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Skeleton variant="rectangular" width={120} height={32} sx={{ borderRadius: 2 }} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <>
                    {subscribers.map((row, idx) => (
                      <TableRow
                        key={row.id}
                        sx={{
                          "& td": { borderBottom: "1px solid rgba(114,119,131,0.1)", color: "#e0e6ec" },
                          "&:hover": { bgcolor: "rgba(255,255,255,0.03)" },
                        }}
                      >
                        <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>{offset + idx + 1}</TableCell>
                        <TableCell>{row.email || "N/A"}</TableCell>
                        <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>{row.status || "subscribed"}</TableCell>
                        <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>{formatDate(row.createdAt)}</TableCell>
                        <TableCell sx={{ textAlign: "right" }}>
                          <Stack direction="row" justifyContent="flex-end" spacing={0.5}>
                            <Tooltip title="View subscriber details" placement="top">
                              <IconButton
                                size="small"
                                sx={{
                                  borderRadius: 2,
                                  color: "#a6acb1",
                                  "&:hover": { bgcolor: "rgba(255,255,255,0.03)" },
                                  "&:focus, &.Mui-focusVisible": { outline: "none", boxShadow: "none", bgcolor: "rgba(255,255,255,0.03)" },
                                  "&:active": { bgcolor: "rgba(255,255,255,0.03)" },
                                }}
                                onClick={() => {
                                  setSelectedSubscriber(row);
                                  setSendDialogOpen(false);
                                  setViewDialogOpen(true);
                                }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Send newsletter to all subscribers" placement="top">
                              <IconButton
                                size="small"
                                sx={{
                                  borderColor: "rgba(103,232,249,0.35)",
                                  color: "#67e8f9",
                                  fontWeight: 900,
                                  borderRadius: 2,
                                  px: 1.1,
                                  "&:hover": { borderColor: "rgba(103,232,249,0.6)" },
                                  "&:focus, &.Mui-focusVisible": { outline: "none", boxShadow: "none" },
                                }}
                                onClick={() => {
                                  setViewDialogOpen(false);
                                  setSendDialogOpen(true);
                                  setSending(false);
                                }}
                              >
                                <SendIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                    {subscribers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} sx={{ color: "#a6acb1", textAlign: "center", py: 3 }}>
                          No newsletter subscribers found.
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                )}
              </TableBody>
            </Table>

            <TablePagination
              component="div"
              count={total}
              page={pageIndex}
              onPageChange={(_, newPage) => {
                if (!loading) setPageIndex(newPage);
              }}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                if (loading) return;
                const next = parseInt(e.target.value, 10) || 10;
                setRowsPerPage(next);
                setPageIndex(0);
              }}
              rowsPerPageOptions={[10, 25, 50, 100]}
              sx={{
                color: "#a6acb1",
                "& .MuiTablePagination-toolbar": { px: 2 },
                "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": { color: "#a6acb1" },
                "& .MuiSelect-select, & .MuiTablePagination-actions button": { color: "#e0e6ec" },
              }}
            />
          </TableContainer>
        )}

        <Dialog
          open={sendDialogOpen}
          onClose={() => {
            if (sending) return;
            setSendDialogOpen(false);
          }}
          fullWidth
          maxWidth="sm"
          sx={{
            "& .MuiTypography-root": { color: "#000" },
            "& .MuiButton-root": { color: "#000" },
            "& .MuiInputLabel-root": { color: "#000" },
            "& .MuiInputBase-input": { color: "#000" },
          }}
        >
          <DialogTitle sx={{ p: 0 }}>
            <Box
              sx={{
                p: 2,
                borderRadius: "8px 8px 0 0",
                background: "linear-gradient(135deg, rgba(0,241,254,0.20) 0%, rgba(0,137,123,0.18) 55%, rgba(14,20,25,0.02) 100%)",
                borderBottom: "1px solid rgba(103,232,249,0.18)",
              }}
            >
              <Typography sx={{ fontWeight: 1000, letterSpacing: "-0.02em", fontSize: 18 }}>
                Send Newsletter
              </Typography>
              <Typography sx={{ color: "#000", fontSize: 12, mt: 0.6, fontWeight: 700 }}>
                Sends to all subscribers currently marked as `subscribed`.
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <TextField
              label="Subject"
              value={sendSubject}
              onChange={(e) => setSendSubject(e.target.value)}
              size="small"
              fullWidth
              sx={{
                mt: 1,
                "& .MuiInputBase-root": { bgcolor: "rgba(255,255,255,0.98)", borderRadius: 2 },
              }}
            />
            <TextField
              label="Body (text)"
              value={sendBody}
              onChange={(e) => setSendBody(e.target.value)}
              size="small"
              fullWidth
              multiline
              minRows={5}
              sx={{
                mt: 2,
                "& .MuiInputBase-root": { bgcolor: "rgba(255,255,255,0.98)", borderRadius: 2 },
              }}
              placeholder="Write your newsletter content here..."
            />

            <Box sx={{ mt: 2 }}>
              <Typography
                sx={{
                  color: "#000",
                  fontSize: 12,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: 0.6,
                  mb: 1,
                }}
              >
                Attachment (optional)
              </Typography>

              <Box
                sx={{
                  border: "1px dashed rgba(103,232,249,0.35)",
                  bgcolor: "rgba(255,255,255,0.96)",
                  borderRadius: 3,
                  p: 2,
                  cursor: "pointer",
                  transition: "all 150ms ease",
                  "&:hover": { borderColor: "rgba(103,232,249,0.65)", bgcolor: "rgba(255,255,255,0.98)" },
                }}
                onClick={() => {
                  if (sending) return;
                  const el = document.getElementById("newsletter_attachment_input");
                  if (el) el.click();
                }}
              >
                <input
                  id="newsletter_attachment_input"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  style={{ display: "none" }}
                  disabled={sending}
                  onChange={(e) => {
                    const f = e.target.files && e.target.files.length ? e.target.files[0] : null;
                    setSendAttachment(f);
                  }}
                />

                <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: 2,
                      display: "grid",
                      placeItems: "center",
                      border: "1px solid rgba(103,232,249,0.25)",
                      bgcolor: "rgba(103,232,249,0.08)",
                      color: "#67e8f9",
                    }}
                  >
                    <AttachFileIcon />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 1000, fontSize: 13, color: "#000" }}>Drop a file or click to upload</Typography>
                    <Typography sx={{ color: "rgba(0,0,0,0.6)", fontSize: 12, mt: 0.4, fontWeight: 700 }}>
                      Supported: PDF, DOC, DOCX
                    </Typography>
                  </Box>
                </Box>

                {sendAttachment && (
                  <Typography sx={{ mt: 1.2, color: "#000", fontSize: 13, fontWeight: 800 }}>
                    Selected: {sendAttachment.name}
                  </Typography>
                )}
              </Box>
            </Box>
          </DialogContent>
          <DialogActions
            sx={{
              pr: 2,
              pb: 2,
              gap: 1,
            }}
          >
            <Button
              onClick={() => setSendDialogOpen(false)}
              disabled={sending}
              sx={{
                textTransform: "none",
                fontWeight: 900,
                color: "#000",
                "&:focus, &.Mui-focusVisible": { outline: "none", boxShadow: "none" },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={async () => {
                if (!sendSubject.trim()) {
                  // Close the dialog first, then show SweetAlert.
                  setSendDialogOpen(false);
                  setSending(false);
                  setTimeout(() => {
                    Swal.fire({
                      icon: "error",
                      title: "Subject is required",
                      confirmButtonColor: "#00897B",
                      zIndex: 4000,
                    });
                  }, 0);
                  return;
                }
                setSending(true);
                try {
                  const token = localStorage.getItem("admin_token");
                  const formData = new FormData();
                  formData.append("subject", sendSubject);
                  formData.append("body", sendBody || "");
                  if (sendAttachment) {
                    formData.append("newsletter_attachment", sendAttachment);
                  }

                  const res = await fetch("/api/newsletter/admin/send", {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData,
                  });
                  const json = await res.json().catch(() => ({}));
                  if (!res.ok || !json?.success) {
                    throw new Error(json?.message || "Failed to send newsletter");
                  }
                  setSendDialogOpen(false);
                  setSendSubject("");
                  setSendBody("");
                  setSendAttachment(null);
                  Swal.fire({
                    icon: "success",
                    title: "Newsletter sent",
                    text: `Recipients: ${json?.data?.recipientCount}. Sent chunks: ${json?.data?.sentChunks}. Failed chunks: ${json?.data?.failedChunks}`,
                    confirmButtonColor: "#00897B",
                    zIndex: 4000,
                  });
                } catch (e) {
                  // Close the dialog first, then show the SweetAlert.
                  setSendDialogOpen(false);
                  setTimeout(() => {
                    Swal.fire({
                      icon: "error",
                      title: "Send failed",
                      text: e?.message || "Failed to send newsletter",
                      confirmButtonColor: "#00897B",
                      zIndex: 4000,
                    });
                  }, 0);
                } finally {
                  setSending(false);
                }
              }}
              disabled={sending}
              sx={{
                textTransform: "none",
                fontWeight: 900,
                bgcolor: "#00897B",
                "&:hover": { bgcolor: "#00796B" },
                color: "#000",
                "&:focus, &.Mui-focusVisible": { outline: "none", boxShadow: "none" },
              }}
            >
              {sending ? "Sending..." : "Send"}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={viewDialogOpen}
          onClose={() => {
            if (sending) return;
            setViewDialogOpen(false);
          }}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle sx={{ p: 0 }}>
            <Box
              sx={{
                p: 2,
                borderRadius: "8px 8px 0 0",
                background: "linear-gradient(135deg, rgba(103,232,249,0.18) 0%, rgba(0,137,123,0.18) 55%, rgba(14,20,25,0.02) 100%)",
                borderBottom: "1px solid rgba(103,232,249,0.18)",
              }}
            >
              <Typography sx={{ fontWeight: 1000, letterSpacing: "-0.02em", fontSize: 18 }}>
                Subscriber Details
              </Typography>
              <Typography sx={{ color: "#000", fontSize: 12, mt: 0.6, fontWeight: 700 }}>
                View newsletter recipient information
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedSubscriber ? (
              <Box sx={{ mt: 1, bgcolor: "rgba(255,255,255,0.96)", borderRadius: 2, p: 2 }}>
                <Typography sx={{ color: "#000", fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: 0.6, mb: 0.75 }}>
                  Email
                </Typography>
                <Typography sx={{ fontWeight: 900, color: "#000", wordBreak: "break-word", mb: 1.5 }}>
                  {selectedSubscriber.email || "N/A"}
                </Typography>

                <Typography sx={{ color: "#000", fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: 0.6, mb: 0.75 }}>
                  Status
                </Typography>
                <Typography sx={{ fontWeight: 900, color: "#000", mb: 1.5 }}>
                  {selectedSubscriber.status || "subscribed"}
                </Typography>

                <Typography sx={{ color: "#000", fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: 0.6, mb: 0.75 }}>
                  Subscribed At
                </Typography>
                <Typography sx={{ fontWeight: 900, color: "#000", mb: 1.5 }}>
                  {formatDate(selectedSubscriber.createdAt)}
                </Typography>
              </Box>
            ) : (
              <Typography sx={{ color: "#000" }}>No subscriber selected.</Typography>
            )}
          </DialogContent>
          <DialogActions sx={{ pr: 2, pb: 2 }}>
            <Button
              onClick={() => setViewDialogOpen(false)}
              disabled={sending}
              sx={{
                textTransform: "none",
                fontWeight: 900,
                color: "#000",
                "&:focus, &.Mui-focusVisible": { outline: "none", boxShadow: "none" },
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

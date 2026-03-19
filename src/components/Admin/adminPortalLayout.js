/**
 * Shared admin portal layout: same horizontal inset (px) and bottom breathing room (pb)
 * as the engagement page.
 *
 * Note: We intentionally do NOT use flex:1 on the main block. Stretching the main area
 * to full viewport height leaves a large empty band below short pages (e.g. Settings) and
 * makes scrolling feel like there is “dead space” under the last card. MUI `pb: 12` is
 * also 96px (12×8) — too much for a bottom gutter; use a smaller spacing token instead.
 */
export const adminPortalOuterColumnSx = {
  minHeight: "100vh",
};

/** Bottom padding in theme units (~12px with default MUI spacing, half of 3). */
export const adminPortalMainBottomPadding = 1.5;

export const adminPortalMainContentSx = {
  minWidth: 0,
  pt: "72px",
  px: { xs: 0.75, sm: 1, md: 1.25 },
  pb: adminPortalMainBottomPadding,
  borderTop: "1px solid rgba(67, 73, 77, 0.28)",
};

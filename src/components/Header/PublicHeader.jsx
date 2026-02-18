import React, { useState, useEffect, useMemo } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Link,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Fade,
  Slide,
} from "@mui/material";
import {
  Construction,
  Home,
  Menu as MenuIcon,
  Close,
  VolunteerActivism,
  Psychology,
  Favorite,
  School,
  LocalHospital,
  Groups,
  RateReview,
  Explore,
  Cabin,
  Hotel,
  BusinessCenter,
  Work,
  Assignment,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

export default function PublicHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isAtTop, setIsAtTop] = useState(false); // Start with background, only transparent when explicitly at top
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero-section");
  const [isNavigating, setIsNavigating] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false); // Track if user has scrolled at least once

  const navItems = useMemo(
    () => [
      {
        label: "Home",
        icon: <Home />,
        sectionId: "hero-section",
        color: "#0fbd0f", // Primary Green
      },
      {
        label: "About MK",
        icon: <Groups />,
        route: "/team",
        color: "#4caf50", // Secondary Green
      },
      {
        label: "Our Services",
        icon: <Work />,
        route: "/services",
        color: "#0fbd0f", // Primary Green
      },
      {
        label: "Projects",
        icon: <Assignment />,
        route: "/projects",
        color: "#4caf50", // Secondary Green
      },
      {
        label: "Testimonials",
        icon: <RateReview />,
        route: "/reviews",
        color: "#4caf50", // Secondary Green
      },
    ],
    []
  );

  // Close mobile menu and reset scroll state when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setIsHeaderVisible(true);
    if (location.pathname === "/") {
      setScrolled(false);
      setIsAtTop(true);
      setHasScrolled(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const newScrolled = scrollY > 0;

      // Track if user has scrolled at least once
      if (scrollY > 0 && !hasScrolled) {
        setHasScrolled(true);
      }

      // Update scrolled state
      setScrolled(newScrolled);

      // Update isAtTop based on scroll position
      // On small screens, when scrolling back up, ensure header becomes transparent at top
      if (location.pathname === "/" || location.pathname === "/services") {
        const isAtVeryTop = scrollY <= 20;

        // Check if hero section is actually visible in viewport (only for home page)
        if (location.pathname === "/") {
          const heroElement = document.getElementById("hero-section");
          let heroIsVisibleInViewport = false;
          if (heroElement) {
            const rect = heroElement.getBoundingClientRect();
            // Hero is visible if it's in the viewport
            heroIsVisibleInViewport =
              rect.top < window.innerHeight && rect.bottom > 0;
          }

          // Priority: if at very top, always at top; otherwise use viewport check
          const newIsAtTop = isAtVeryTop ? true : heroIsVisibleInViewport && scrollY <= 50;
          setIsAtTop(newIsAtTop);
        } else if (location.pathname === "/services") {
          // For services page, make header transparent when at top
          setIsAtTop(isAtVeryTop);
        }
      }

      // Don't update active section if we're currently navigating (clicked a nav item)
      if (isNavigating) return;

      // Detect active section based on scroll position
      if (location.pathname === "/") {
        // Header always visible on home (no hide on scroll)
        setIsHeaderVisible(true);

        // Get all sections in the order they appear on the page (exclude items with routes)
        const sectionIds = navItems
          .filter((item) => !item.route && item.sectionId)
          .map((item) => item.sectionId);
        const sections = sectionIds
          .map((id) => {
            const element = document.getElementById(id);
            return element
              ? {
                  id,
                  top: element.offsetTop,
                  bottom: element.offsetTop + element.offsetHeight,
                }
              : null;
          })
          .filter((section) => section !== null)
          .sort((a, b) => a.top - b.top); // Sort by position on page

        const scrollPosition = window.scrollY + 200; // Offset for header height

        // If at top, set hero section as active
        if (window.scrollY < 100) {
          setActiveSection("hero-section");
          return;
        }

        // Find the section that's currently in view
        // Check from bottom to top to get the most recent section passed
        for (let i = sections.length - 1; i >= 0; i--) {
          const section = sections[i];
          if (scrollPosition >= section.top - 100) {
            // Add some threshold
            setActiveSection(section.id);
            break;
          }
        }
      } else if (location.pathname === "/services" || location.pathname === "/team" || location.pathname === "/projects") {
        setIsHeaderVisible(true);
      } else {
        setIsHeaderVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname, navItems, isNavigating, hasScrolled]);

  const isActive = (path) => location.pathname === path;

  // Split nav items - on home page, show all on right when not in hero, otherwise all on right
  const isHomePage = location.pathname === "/";
  const leftNavItems = []; // No left nav items - all go to right
  const rightNavItems = navItems; // All nav items on the right

  // Check if header is transparent (only on services page when at absolute top)
  const isServicesPage = location.pathname === "/services";
  const isHeaderTransparent = isServicesPage && isAtTop;

  // Debug logging for font size conditions
  useEffect(() => {
    console.log("📊 Header State Debug:", {
      isHomePage,
      isAtTop,
      isHeaderTransparent,
      isHeaderVisible,
      scrolled,
      shouldBeLarge: isHeaderTransparent && isHeaderVisible,
      location: location.pathname,
    });
  }, [
    isHomePage,
    isAtTop,
    isHeaderTransparent,
    isHeaderVisible,
    scrolled,
    location.pathname,
  ]);

  const handleNavigateToSection = (item) => {
    setMobileMenuOpen(false);

    // If item has a route, navigate to that route
    if (item.route) {
      navigate(item.route);
      return;
    }

    // Otherwise, handle section scrolling
    const sectionId = item.sectionId;
    setActiveSection(sectionId);
    setIsNavigating(true);

    if (location.pathname === "/") {
      const section = document.getElementById(sectionId);
      if (section) {
        // When already at top (e.g. in hero), don't scroll — avoids jump when clicking Home from hero
        const scrollY = window.scrollY;
        const heroAlreadyAtTop = sectionId === "hero-section" && scrollY <= 20;
        if (!heroAlreadyAtTop) {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        // Ensure active section is set after scroll and re-enable scroll detection
        setTimeout(() => {
          setActiveSection(sectionId);
          setIsNavigating(false);
        }, heroAlreadyAtTop ? 0 : 1000);
      } else {
        console.warn(`Section with id "${sectionId}" not found`);
        setIsNavigating(false);
      }
    } else {
      navigate("/");
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
          setTimeout(() => {
            setActiveSection(sectionId);
            setIsNavigating(false);
          }, 1000);
        } else {
          setIsNavigating(false);
        }
      }, 100);
    }
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor:
            location.pathname === "/services" && isAtTop
              ? "transparent" // Transparent when at absolute top on services page only
              : "rgba(246, 248, 246, 0.8)", // Light background with transparency otherwise
          backdropFilter:
            location.pathname === "/services" && isAtTop ? "none" : "blur(12px)",
          boxShadow:
            location.pathname === "/services" && isAtTop
              ? "none"
              : "0 8px 32px rgba(26, 26, 26, 0.12)",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          borderBottom:
            location.pathname === "/services" && isAtTop
              ? "none"
              : "1px solid rgba(15, 189, 15, 0.15)",
          transform: "translateY(0)",
          opacity: 1,
          pointerEvents: "auto",
          // Hide active underline when any nav button is hovered
          "&:has(button:hover) button[data-active='true']::after": {
            opacity: 0,
          },
        }}
      >
        <Toolbar sx={{ px: { xs: 1, sm: 1.5, md: 2 }, py: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              minWidth: 0,
              gap: { md: 1, lg: 2 },
            }}
          >
            {/* Left Section - Logo: one line, font scales with width to fit */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flex: "0 1 auto",
                minWidth: 0,
                maxWidth: { md: "24%", lg: "28%", xl: "30%" },
              }}
            >
              <Fade in={true} timeout={1000}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    minWidth: 0,
                    width: "100%",
                    "&:hover": {
                      transform: "scale(1.05) translateY(-2px)",
                    },
                  }}
                  onClick={() => navigate("/")}
                >
                  <Typography
                    component="span"
                    sx={{
                      fontFamily: '"Calibri Light", Calibri, sans-serif',
                      fontWeight: 900,
                      fontSize: "clamp(0.55rem, 0.7vw + 0.5rem, 1.15rem)",
                      letterSpacing: "0.04em",
                      color:
                        isHeaderTransparent && isHeaderVisible
                          ? "#ffffff"
                          : "#00897B",
                      lineHeight: 1.1,
                      transition: "color 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                      textShadow:
                        isHeaderTransparent && isHeaderVisible
                          ? "2px 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.6), 0 0 40px rgba(0, 0, 0, 0.4)"
                          : "none",
                      background: "none",
                      backgroundClip: "unset",
                      WebkitBackgroundClip: "unset",
                      WebkitTextFillColor:
                        isHeaderTransparent && isHeaderVisible
                          ? "#ffffff"
                          : "#00897B",
                      letterSpacing: "0.02em",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Smart Hospital Management System
                  </Typography>
                </Box>
              </Fade>
            </Box>

            {/* Center Navigation Items - flex middle so never overlapped by logo */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                flex: "1 1 auto",
                minWidth: 0,
                gap: { md: 0.5, lg: 1 },
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {rightNavItems.map((item, index) => {
                const isActiveItem = item.route
                  ? location.pathname === item.route
                  : activeSection === item.sectionId &&
                    location.pathname === "/";
                const adjustedIndex = index;
                return (
                  <Slide
                    direction="down"
                    in={true}
                    timeout={800 + adjustedIndex * 200}
                    key={item.label}
                  >
                    <Button
                      onClick={() => handleNavigateToSection(item)}
                      startIcon={item.icon}
                      disableRipple
                      data-active={isActiveItem}
                        sx={{
                        color:
                          isActiveItem && location.pathname !== "/"
                            ? "#00897B"
                            : (isHeaderTransparent && isHeaderVisible) || (!scrolled && location.pathname === "/services")
                              ? "white"
                              : "#00897B",
                        fontSize: "clamp(0.7rem, 0.9vw + 0.5rem, 0.975rem)",
                        fontWeight:
                          isActiveItem && location.pathname !== "/" ? 700 : 600,
                        px: { md: 1, lg: 1.5, xl: 2 },
                        py: { md: 0.9, lg: 1, xl: 1.2 },
                        borderRadius: "25px",
                        textTransform: "uppercase",
                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        position: "relative",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        backgroundColor:
                          isActiveItem && location.pathname !== "/"
                            ? scrolled || location.pathname !== "/"
                              ? "rgba(0, 137, 123, 0.12)"
                              : "rgba(0, 137, 123, 0.18)"
                            : "transparent",
                        "&:focus": {
                          outline: "none",
                          backgroundColor:
                            isActiveItem && location.pathname !== "/"
                              ? scrolled || location.pathname !== "/"
                                ? "rgba(0, 137, 123, 0.12)"
                                : "rgba(0, 137, 123, 0.18)"
                              : "transparent",
                        },
                        "&:focus-visible": {
                          outline: "none",
                        },
                        "& .MuiButton-startIcon": {
                          marginRight: { md: 0.5, lg: 0.75, xl: 1 },
                          "& > *:nth-of-type(1)": {
                            fontSize: "clamp(0.9rem, 1vw, 1.1rem)",
                            color:
                              isActiveItem && location.pathname !== "/"
                                ? "#00897B"
                                : "inherit",
                          },
                        },
                        "&:hover": {
                          backgroundColor: "transparent",
                          transform: "none",
                          boxShadow: "none",
                          "& .icon": {
                            color: "#00897B",
                          },
                        },
                        "&:hover::after": {
                          content: '""',
                          position: "absolute",
                          bottom: 0,
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: "60%",
                          height: "3px",
                          backgroundColor:
                            (location.pathname === "/services" && isHeaderTransparent) ? "white" : "#00897B",
                          borderRadius: "2px 2px 0 0",
                          transition: "all 0.3s ease-out",
                          zIndex: 1,
                        },
                        "&::after":
                          isActiveItem && (location.pathname === "/services" && isHeaderTransparent)
                            ? {
                                content: '""',
                                position: "absolute",
                                bottom: 0,
                                left: "50%",
                                transform: "translateX(-50%)",
                                width: "60%",
                                height: "3px",
                                backgroundColor: "white",
                                borderRadius: "2px 2px 0 0",
                                transition: "opacity 0.3s ease-out",
                                opacity: 1,
                              }
                            : isActiveItem && location.pathname !== "/"
                              ? {
                                  content: '""',
                                  position: "absolute",
                                  bottom: 0,
                                  left: "50%",
                                  transform: "translateX(-50%)",
                                  width: "60%",
                                  height: "3px",
                                  backgroundColor: "#00897B",
                                  borderRadius: "2px 2px 0 0",
                                }
                              : {},
                        "& .icon": {
                          transition: "all 0.4s ease",
                          color:
                            isActiveItem && location.pathname !== "/"
                              ? "#00897B"
                              : (isHeaderTransparent && isHeaderVisible) || (!scrolled && location.pathname === "/services")
                                ? "white"
                                : "#00897B",
                        },
                      }}
                    >
                      {item.label}
                    </Button>
                  </Slide>
                );
              })}
            </Box>

            {/* Book Consultation Button - Far Right */}
            <Box
              sx={{
                display: { xs: "none", lg: "flex" },
                alignItems: "center",
                flex: "0 0 auto",
                justifyContent: "flex-end",
              }}
            >
              <Button
                variant="contained"
                onClick={() => navigate("/book-consultation")}
                sx={{
                  px: 3,
                  py: 1.5,
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  borderRadius: 2,
                  backgroundColor: "#00897B",
                  color: "#ffffff",
                  textTransform: "none",
                  boxShadow: "0 4px 12px rgba(0, 137, 123, 0.3)",
                  transition: "all 0.3s ease",
                  "&:focus": {
                    outline: "none",
                    boxShadow: "0 4px 12px rgba(0, 137, 123, 0.3)",
                  },
                  "&:focus-visible": {
                    outline: "none",
                    boxShadow: "0 4px 12px rgba(0, 137, 123, 0.3)",
                  },
                  "&:hover": {
                    backgroundColor: "#00695C",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 16px rgba(0, 137, 123, 0.4)",
                  },
                }}
              >
                Book Appointment
              </Button>
            </Box>

            {/* Enhanced Mobile Menu Button */}
            <Fade in={true} timeout={1200}>
              <IconButton
                disableRipple
                sx={{
                  display: { xs: "flex", md: "none" },
                  marginLeft: "auto",
                  color: mobileMenuOpen
                    ? "#00897B"
                    : (isHeaderTransparent && isHeaderVisible) || (!scrolled && location.pathname === "/services")
                      ? "white"
                      : "#00897B",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  borderRadius: "12px",
                  backgroundColor: mobileMenuOpen
                    ? scrolled || location.pathname !== "/"
                      ? "rgba(0, 137, 123, 0.1)"
                      : "rgba(0, 137, 123, 0.15)"
                    : "transparent",
                  "&:focus": {
                    outline: "none",
                    backgroundColor: mobileMenuOpen
                      ? scrolled || location.pathname !== "/"
                        ? "rgba(0, 137, 123, 0.1)"
                        : "rgba(0, 137, 123, 0.15)"
                      : "transparent",
                  },
                  "&:focus-visible": {
                    outline: "none",
                    boxShadow: "none",
                  },
                  "&:hover": {
                    backgroundColor: mobileMenuOpen
                      ? scrolled || location.pathname !== "/"
                        ? "rgba(15, 189, 15, 0.15)"
                        : "rgba(15, 189, 15, 0.2)"
                      : scrolled || location.pathname !== "/"
                        ? "rgba(15, 189, 15, 0.05)"
                        : "rgba(255, 255, 255, 0.15)",
                    transform: mobileMenuOpen
                      ? "scale(1.05)"
                      : "rotate(90deg) scale(1.1)",
                    boxShadow:
                      scrolled || location.pathname !== "/"
                        ? "0 8px 25px rgba(15, 189, 15, 0.2)"
                        : "0 8px 25px rgba(255, 255, 255, 0.2)",
                  },
                }}
                onClick={() => setMobileMenuOpen(true)}
              >
                <MenuIcon sx={{ fontSize: "1.8rem" }} />
              </IconButton>
            </Fade>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Compact Mobile Dropdown */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "260px", sm: "300px" },
            marginRight: { xs: 2, sm: 3 }, // Add right margin so it doesn't appear cut by screen edge
            backgroundColor: "#f6f8f6", // Light Green/White
            backgroundImage:
              "linear-gradient(135deg, rgba(246, 248, 246, 0.95) 0%, rgba(255, 255, 255, 0.95) 100%)",
            backdropFilter: "blur(20px)",
            borderLeft: "1px solid rgba(15, 189, 15, 0.15)", // Primary Green border
            boxShadow: "0 8px 32px rgba(26, 26, 26, 0.12)",
            height: "auto", // shrink to content by default
            maxHeight: {
              xs: "calc(100vh - 72px)",
              sm: "calc(100vh - 80px)",
            }, // cap height on small screens
            top: { xs: "64px", sm: "72px" },
            overflowY: "auto", // always allow scroll if items overflow
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(45deg, #0fbd0f, #1a1a1a)", // Primary Green to Primary Black
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: { xs: "1.1rem", sm: "1.25rem" },
              }}
            >
              Menu
            </Typography>
            <IconButton
              onClick={() => setMobileMenuOpen(false)}
              size="small"
              sx={{
                transition: "all 0.3s ease",
                borderRadius: "8px",
                "&:focus": { outline: "none" },
                "&:focus-visible": { outline: "none", boxShadow: "none" },
                "&:hover": {
                  transform: "rotate(90deg)",
                  backgroundColor: "rgba(0, 137, 123, 0.05)",
                },
              }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 1.5, borderColor: "rgba(15, 189, 15, 0.15)" }} />
          <List
            dense
            sx={{ py: 0, gap: 0.5, display: "flex", flexDirection: "column" }}
          >
            {navItems.map((item, index) => {
              const isActiveItem = item.route
                ? location.pathname === item.route
                : activeSection === item.sectionId && location.pathname === "/";
              return (
                <ListItem
                  dense
                  key={item.label}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleNavigateToSection(item);
                  }}
                  disableRipple
                  sx={{
                    cursor: "pointer",
                    borderRadius: "12px",
                    py: 1,
                    px: 1.5,
                    transition: "all 0.3s ease",
                    backgroundColor: isActiveItem
                      ? "rgba(0, 137, 123, 0.12)"
                      : "transparent",
                    borderLeft: isActiveItem
                      ? "3px solid #00897B"
                      : "3px solid transparent",
                    "&:focus": {
                      outline: "none",
                      backgroundColor: isActiveItem
                        ? "rgba(0, 137, 123, 0.12)"
                        : "transparent",
                    },
                    "&:focus-visible": {
                      outline: "none",
                    },
                    "&:hover": {
                      backgroundColor: "rgba(0, 137, 123, 0.08)",
                      transform: "translateX(8px)",
                      boxShadow: "0 4px 12px rgba(0, 137, 123, 0.2)",
                      "& .icon": {
                        color: "#00897B",
                        transform: "rotate(180deg)",
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: "#00897B",
                      minWidth: 32,
                      "& .icon": {
                        transition: "all 0.3s ease",
                      },
                    }}
                  >
                    {React.cloneElement(item.icon, {
                      className: "icon",
                      fontSize: "small",
                    })}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                      fontWeight: isActiveItem ? 700 : 600,
                      color: isActiveItem ? "#00897B" : "text.primary",
                    }}
                  />
                </ListItem>
              );
            })}
          </List>
          <Divider sx={{ my: 1.5, borderColor: "rgba(15, 189, 15, 0.15)" }} />
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              setMobileMenuOpen(false);
              navigate("/book-consultation");
            }}
            sx={{
              px: 3,
              py: 1.5,
              fontSize: "0.875rem",
              fontWeight: 700,
              borderRadius: 2,
              backgroundColor: "#00897B",
              color: "#ffffff",
              textTransform: "none",
              boxShadow: "0 4px 12px rgba(0, 137, 123, 0.3)",
              transition: "all 0.3s ease",
              "&:focus": {
                outline: "none",
                boxShadow: "0 4px 12px rgba(0, 137, 123, 0.3)",
              },
              "&:focus-visible": {
                outline: "none",
                boxShadow: "0 4px 12px rgba(0, 137, 123, 0.3)",
              },
              "&:hover": {
                backgroundColor: "#00695C",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 16px rgba(0, 137, 123, 0.4)",
              },
            }}
          >
            Book Appointment
          </Button>
        </Box>
      </Drawer>

      <Toolbar
        sx={{
          height: "72px",
          minHeight: "72px",
          transition: "height 0.4s ease",
        }}
      />

    </>
  );
}

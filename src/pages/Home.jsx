import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import HeroSection from "../components/Home/HeroSection";
import KeyServicesSection from "../components/Home/KeyServicesSection";
import AccreditationsSection from "../components/Home/AccreditationsSection";
import ContactSection from "../components/Home/ContactSection";
import BackgroundImageSection from "../components/Home/BackgroundImageSection";
import CTASection from "../components/Home/CTASection";
import Footer from "../components/Footer/Footer";

function scrollHomeToTop() {
  // Only scroll to top; do not scrollIntoView (that pulls hero under the fixed header)
  window.scrollTo(0, 0);
}

export default function Home() {
  const location = useLocation();

  // Same behavior as Team/Services: when this page opens, always start at top (no "pushed up" hero)
  useEffect(() => {
    scrollHomeToTop();
    const t1 = setTimeout(scrollHomeToTop, 0);
    const t2 = setTimeout(scrollHomeToTop, 100);
    const t3 = setTimeout(scrollHomeToTop, 300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [location.pathname]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        fontFamily: '"Calibri Light", Calibri, sans-serif',
        paddingTop: "4.5px", // Spacer below fixed header
        backgroundColor: "#f6f8f6", // Match hero so no dark strip between header and hero
      }}
    >
      <HeroSection />
      <KeyServicesSection />
      <AccreditationsSection />
      <ContactSection />
      <BackgroundImageSection />
      <CTASection />
      <Footer />
    </Box>
  );
}

import React, { useEffect, useLayoutEffect, useRef } from "react";
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
  window.scrollTo(0, 0);
}

export default function Home() {
  const location = useLocation();
  const lockUntil = useRef(0);

  useLayoutEffect(() => {
    scrollHomeToTop();
    lockUntil.current = performance.now() + 600;
  }, [location.pathname]);

  useEffect(() => {
    const t1 = setTimeout(scrollHomeToTop, 0);
    const t2 = setTimeout(scrollHomeToTop, 50);
    const t3 = setTimeout(scrollHomeToTop, 150);
    const t4 = setTimeout(scrollHomeToTop, 350);
    // Keep scroll at 0 for 600ms so layout shifts from sections (FAQs, services, etc.) can't move the page
    const interval = setInterval(() => {
      if (performance.now() < lockUntil.current && window.scrollY !== 0) {
        window.scrollTo(0, 0);
      }
    }, 16);
    const stopAt = setTimeout(() => clearInterval(interval), 600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearInterval(interval);
      clearTimeout(stopAt);
    };
  }, [location.pathname]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        fontFamily: '"Calibri Light", Calibri, sans-serif',
        paddingTop: "6px", // Spacer below fixed header
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

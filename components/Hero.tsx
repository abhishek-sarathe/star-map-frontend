"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

const STARS = Array.from({ length: 120 }, (_, i) => ({
  id: i,
  size:     ((i * 7  + 13) % 20) / 10 + 0.8,
  top:      ((i * 37 + 11) % 100),
  left:     ((i * 53 + 7)  % 100),
  opacity:  ((i * 17 + 3)  % 6)  / 10 + 0.08,
  duration: ((i * 11 + 5)  % 30) / 10 + 3,
  delay:    ((i * 19 + 2)  % 40) / 10,
}));

const OCCASIONS = [
  "Our story began",
  "A new star arrived",
  "We first met",
  "you achieved your dream",
  "She said yes",
  "you made it happen",
  "family became complete",
  "history was made",
];

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [occasionIdx, setOccasionIdx] = useState(0);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setOccasionIdx(i => (i + 1) % OCCASIONS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section style={{
      position: "relative",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "0 24px",
      background: "radial-gradient(ellipse at 50% 0%, #1e3560 0%, #0d1f38 35%, #080E1A 70%)",
      overflow: "hidden",
    }}>

      {mounted && (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {STARS.map(s => (
            <motion.div key={s.id}
              style={{
                position: "absolute", borderRadius: "50%", background: "white",
                width: s.size + "px", height: s.size + "px",
                top: s.top + "%", left: s.left + "%",
              }}
              animate={{ opacity: [s.opacity * 0.3, s.opacity, s.opacity * 0.3] }}
              transition={{ duration: s.duration, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
            />
          ))}
        </div>
      )}

      <div style={{
        position: "absolute", width: "600px", height: "300px",
        background: "radial-gradient(ellipse, rgba(200,169,110,0.07) 0%, transparent 70%)",
        top: "50%", left: "50%", transform: "translate(-50%, -60%)", pointerEvents: "none",
      }} />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        style={{ position: "relative", zIndex: 10, maxWidth: "760px", width: "100%" }}
      >
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{
            color: "#C8A96E", fontSize: "12px", fontWeight: 700,
            letterSpacing: "5px", textTransform: "uppercase", marginBottom: "24px",
          }}
        >
          Astronomical portrait of your moment
        </motion.p>

        <h1 style={{
          fontFamily: "var(--font-playfair), Georgia, serif",
          fontWeight: 700, lineHeight: 1.15, color: "white",
          marginBottom: "20px", letterSpacing: "-0.5px",
        }}>
          <span style={{
            display: "block",
            fontSize: "clamp(28px, 4.5vw, 58px)",
            whiteSpace: "nowrap",
            marginBottom: "8px",
          }}>
            The universe, the night
          </span>
          {/* 2-line height — fits any text regardless of length or screen size */}
          <span style={{
            display: "block",
            fontSize: "clamp(36px, 6vw, 72px)",
            minHeight: "180px",
            overflow: "visible",
            color: "#C8A96E",
            fontStyle: "italic",
          }}>
            {mounted ? (
              <motion.span
                key={occasionIdx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                style={{ display: "block" }}
              >
                {OCCASIONS[occasionIdx]}
              </motion.span>
            ) : OCCASIONS[0]}
          </span>
        </h1>

        <p style={{
          fontSize: "clamp(16px, 2vw, 19px)", lineHeight: 1.7,
          color: "rgba(138,175,212,0.85)", maxWidth: "540px",
          margin: "0 auto 48px",
        }}>
          We compute the exact position of every star, planet, Sun and Moon
          for any moment in history — rendered as a print-ready poster you'll frame forever.
        </p>

        <motion.div
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          style={{ display: "inline-block", marginBottom: "20px" }}
        >
          <Link href="/customize" style={{
            display: "inline-flex", alignItems: "center", gap: "10px",
            padding: "18px 44px",
            background: "linear-gradient(135deg, #C8A96E 0%, #E0C080 100%)",
            color: "#080E1A", fontWeight: 700, fontSize: "17px",
            borderRadius: "14px", textDecoration: "none", letterSpacing: "0.2px",
            boxShadow: "0 0 40px rgba(200,169,110,0.25)",
          }}>
            Create your star map
            <span style={{ fontSize: "20px" }}>→</span>
          </Link>
        </motion.div>

        <p style={{
          fontSize: "13px", color: "rgba(138,175,212,0.45)", letterSpacing: "0.3px",
        }}>
          Starting at ₹99 &nbsp;·&nbsp; PNG + PDF &nbsp;·&nbsp; Print-ready A4
        </p>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "6px", marginTop: "40px",
          }}
        >
          <div style={{ display: "flex" }}>
            {["🌙","⭐","✨","🌟","💫"].map((e, i) => (
              <span key={i} style={{ fontSize: "15px", marginRight: "-2px" }}>{e}</span>
            ))}
          </div>
          <span style={{ fontSize: "13px", color: "rgba(138,175,212,0.6)", marginLeft: "8px" }}>
            For birthdays, weddings, anniversaries — any moment that mattered
          </span>
        </motion.div>
      </motion.div>

      <motion.div
        style={{ position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)" }}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div style={{
          width: "24px", height: "40px",
          border: "1.5px solid rgba(255,255,255,0.15)",
          borderRadius: "12px", display: "flex",
          alignItems: "flex-start", justifyContent: "center", paddingTop: "6px",
        }}>
          <div style={{ width: "3px", height: "8px", background: "rgba(200,169,110,0.5)", borderRadius: "2px" }} />
        </div>
      </motion.div>
    </section>
  );
}

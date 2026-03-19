"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import type { MapFormData } from "./CustomizeFlow";

type Props = {
  data: MapFormData;
  update: (fields: Partial<MapFormData>) => void;
  onBack: () => void;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const PLAN_DETAILS: Record<string, { label: string; price: number; description: string }> = {
  zenith:  { label: "Your Sky",     price: 99,  description: "Your local sky at that exact moment" },
  fullsky: { label: "All Stars",    price: 99,  description: "The complete celestial sphere" },
  both:    { label: "Both Posters", price: 149, description: "Both styles — decide which to print after" },
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "13px 16px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "10px", color: "white", fontSize: "15px",
  outline: "none", transition: "border-color 0.2s", boxSizing: "border-box",
  minHeight: "48px",
};

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "12px", fontWeight: 700,
  color: "rgba(138,175,212,0.7)", letterSpacing: "1.5px",
  textTransform: "uppercase", marginBottom: "12px",
};

export default function Step3({ data, update, onBack }: Props) {
  const plan         = (data.mapType as string) || "both";
  const selectedPlan = PLAN_DETAILS[plan] || PLAN_DETAILS["both"];

  const [email1, setEmail1]     = useState("");
  const [email2, setEmail2]     = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [orderId, setOrderId]   = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [polling, setPolling]   = useState(false);
  const [downloadUrls, setDownloadUrls] = useState<Record<string, string>>({});

  // Detect Razorpay return redirect
  useEffect(() => {
    const params   = new URLSearchParams(window.location.search);
    const rzpOrder = params.get("rzp_order_id");
    if (rzpOrder) {
      setOrderId(rzpOrder);
      window.history.replaceState({}, "", window.location.pathname);
      pollForCompletion(rzpOrder);
    }
  }, []);

  const pollForCompletion = async (oid: string) => {
    setPolling(true);
    for (let i = 0; i < 20; i++) {
      try {
        const resp = await fetch(`${API_URL}/api/v1/orders/${oid}`);
        const d    = await resp.json();
        if (d.status === "paid") {
          const urls: Record<string, string> = {};
          if (d.zenith_png_url)  urls.zenith_png  = d.zenith_png_url;
          if (d.zenith_pdf_url)  urls.zenith_pdf  = d.zenith_pdf_url;
          if (d.fullsky_png_url) urls.fullsky_png = d.fullsky_png_url;
          if (d.fullsky_pdf_url) urls.fullsky_pdf = d.fullsky_pdf_url;
          const expected = plan === "both" ? 4 : 2;
          if (Object.keys(urls).length >= expected) {
            setDownloadUrls(urls);
            setConfirmed(true);
            setPolling(false);
            return;
          }
        }
      } catch {}
      await new Promise(r => setTimeout(r, 3000));
    }
    setPolling(false);
    setError("Payment confirmed but poster is taking longer than usual. Check your email — we'll send the link when ready.");
  };

  const handlePay = async () => {
    setError("");
    if (!email1.trim())                   { setError("Please enter your email address."); return; }
    if (email1.trim() !== email2.trim())  { setError("Email addresses do not match."); return; }
    if (!email1.includes("@") || !email1.split("@")[1]?.includes(".")) {
      setError("Please enter a valid email address."); return;
    }

    setLoading(true);
    try {
      // Helper: for "both" each map has suffixed keys; for single maps fall back to unsuffixed
      const get = (key: string, mt: "zenith" | "fullsky") => {
        const suffixed = (data as any)[`${key}_${mt}`];
        return suffixed !== undefined ? suffixed : (data as any)[key];
      };

      const mapsToSend = plan === "both" ? ["zenith", "fullsky"] : [plan] as ("zenith" | "fullsky")[];
      const perMapFields: Record<string, any> = {};
      for (const mt of mapsToSend as ("zenith" | "fullsky")[]) {
        const s = mt === "zenith" ? "z" : "f";
        Object.assign(perMapFields, {
          [`theme_${s}`]               : get("theme", mt)       || "Dark Navy",
          [`title_option_${s}`]        : get("titleOption", mt) || "AI",
          [`custom_title_${s}`]        : get("customTitle", mt) || "",
          [`wishing_text_${s}`]        : get("wishingText", mt) || "",
          [`title_font_${s}`]          : get("titleFont", mt),
          [`occasion_font_${s}`]       : get("occasionFont", mt),
          [`title_color_${s}`]         : get("titleColor", mt),
          [`occasion_color_${s}`]      : get("occasionColor", mt),
          [`bg_color_${s}`]            : get("bgColor", mt),
          [`const_color_${s}`]         : get("constColor", mt),
          [`star_density_${s}`]        : get("starDensity", mt) ?? 50,
          [`show_constellations_${s}`]        : get("showConstellations", mt)      ?? true,
          [`show_constellation_labels_${s}`]  : get("showConstellationLabels", mt) ?? true,
          [`star_size_${s}`]           : get("starSize", mt)          ?? 50,
          [`planet_size_${s}`]         : get("planetSize", mt)        ?? 50,
          [`sun_size_${s}`]            : get("sunSize", mt)           ?? 50,
          [`moon_size_${s}`]           : get("moonSize", mt)          ?? 50,
          [`show_star_labels_${s}`]    : get("showStarLabels", mt)    ?? true,
          [`show_planet_names_${s}`]   : get("showPlanetNames", mt)   ?? true,
          [`show_sun_label_${s}`]      : get("showSunLabel", mt)      ?? true,
          [`show_moon_label_${s}`]     : get("showMoonLabel", mt)     ?? true,
          [`show_horizon_labels_${s}`] : get("showHorizonLabels", mt) ?? true,
          [`show_rising_labels_${s}`]  : get("showRisingLabels", mt)  ?? true,
          [`location_format_${s}`]     : get("locationFormat", mt)    || "City, State, Country",
        });
      }

      const timeStr = (() => {
        const h = data.ampm === "PM" ? (data.hour % 12) + 12 : data.hour % 12;
        return `${String(h).padStart(2,"0")}:${String(data.minute).padStart(2,"0")}`;
      })();

      const resp = await fetch(`${API_URL}/api/v1/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          email    : email1.trim(),
          map_type : plan === "both" ? "Both Posters" : plan === "zenith" ? "Your Sky" : "All Stars",
          occasion : data.occasion === "Custom" ? data.customOccasion : data.occasion,
          city     : data.city,
          lat      : data.lat,
          lon      : data.lon,
          date     : data.date,
          time     : timeStr,
          name     : data.name,
          session_id: "",
          ...perMapFields,
        }),
      });

      if (!resp.ok) throw new Error("Could not create order.");
      const orderData = await resp.json();

      // Same-tab redirect — no popup blocker issues
      const callbackUrl = encodeURIComponent(window.location.href);
      window.location.href = `${API_URL}/checkout/${orderData.order_id}?callback_url=${callbackUrl}`;

    } catch (e: any) {
      setError(e.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  // ── Confirmed + downloads ready ───────────────────────────
  if (confirmed) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: "center" }}>
        <div style={{ fontSize: "56px", marginBottom: "24px" }}>✨</div>
        <h2 style={{
          fontFamily: "var(--font-playfair), Georgia, serif",
          fontSize: "32px", fontWeight: 700, color: "white", marginBottom: "12px",
        }}>Your map is ready</h2>
        <p style={{ fontSize: "16px", color: "rgba(138,175,212,0.7)", lineHeight: 1.7, marginBottom: "32px" }}>
          Download your poster below. We also sent the links to{" "}
          <strong style={{ color: "white" }}>{email1 || "your email"}</strong>.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "32px" }}>
          {["zenith", "fullsky"].map(type => {
            const png = downloadUrls[`${type}_png`];
            const pdf = downloadUrls[`${type}_pdf`];
            if (!png && !pdf) return null;
            const label = type === "zenith" ? "Your Sky" : "All Stars";
            return (
              <div key={type} style={{
                padding: "20px", borderRadius: "12px",
                background: "rgba(200,169,110,0.06)",
                border: "1px solid rgba(200,169,110,0.2)",
              }}>
                <p style={{ fontSize: "13px", fontWeight: 700, color: "rgba(138,175,212,0.6)",
                  letterSpacing: "2px", textTransform: "uppercase", margin: "0 0 14px" }}>
                  {label}
                </p>
                <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                  {png && (
                    <a href={png} download target="_blank" rel="noopener noreferrer" style={{
                      display: "inline-flex", alignItems: "center", gap: "8px",
                      padding: "12px 24px",
                      background: "linear-gradient(135deg, #C8A96E, #E0C080)",
                      color: "#080E1A", fontWeight: 700, fontSize: "14px",
                      borderRadius: "10px", textDecoration: "none",
                    }}>↓ Download PNG</a>
                  )}
                  {pdf && (
                    <a href={pdf} download target="_blank" rel="noopener noreferrer" style={{
                      display: "inline-flex", alignItems: "center", gap: "8px",
                      padding: "12px 24px", background: "transparent",
                      color: "#C8A96E", fontWeight: 700, fontSize: "14px",
                      borderRadius: "10px", textDecoration: "none",
                      border: "1px solid rgba(200,169,110,0.4)",
                    }}>↓ Download PDF</a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{
          padding: "16px 20px", borderRadius: "10px",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
          fontSize: "13px", color: "rgba(138,175,212,0.5)", lineHeight: 1.6,
        }}>
          Links also sent to your email · Never expire
        </div>
      </motion.div>
    );
  }

  // ── Polling spinner ────────────────────────────────────────
  if (polling) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        style={{ textAlign: "center", padding: "40px 0" }}>
        <div style={{ fontSize: "48px", marginBottom: "24px" }}>🌟</div>
        <h2 style={{
          fontFamily: "var(--font-playfair), Georgia, serif",
          fontSize: "26px", fontWeight: 700, color: "white", marginBottom: "12px",
        }}>Your map is being created</h2>
        <p style={{ fontSize: "15px", color: "rgba(138,175,212,0.6)", lineHeight: 1.7 }}>
          Computing star positions, rendering your poster...<br />
          This usually takes under a minute.
        </p>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          style={{
            width: "32px", height: "32px", margin: "32px auto 0",
            border: "2px solid rgba(200,169,110,0.2)",
            borderTop: "2px solid #C8A96E",
            borderRadius: "50%",
          }}
        />
      </motion.div>
    );
  }

  // ── Main payment form ──────────────────────────────────────
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}>

      <div style={{ marginBottom: "32px" }}>
        <h1 style={{
          fontFamily: "var(--font-playfair), Georgia, serif",
          fontSize: "clamp(26px, 4vw, 34px)", fontWeight: 700,
          color: "white", marginBottom: "8px", lineHeight: 1.2,
        }}>Complete your order</h1>
        <p style={{ fontSize: "15px", color: "rgba(138,175,212,0.6)", lineHeight: 1.6 }}>
          Your poster is ready. Enter your email and complete payment to download.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

        {/* Plan summary */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 18px", borderRadius: "12px",
          background: "rgba(200,169,110,0.06)", border: "1px solid rgba(200,169,110,0.25)",
        }}>
          <div>
            <p style={{ fontSize: "15px", fontWeight: 600, color: "#C8A96E", margin: "0 0 3px" }}>
              {selectedPlan.label}
            </p>
            <p style={{ fontSize: "13px", color: "rgba(138,175,212,0.55)", margin: 0 }}>
              {selectedPlan.description}
            </p>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "16px" }}>
            <p style={{ fontSize: "26px", fontWeight: 700, color: "white", margin: 0, lineHeight: 1 }}>
              ₹{selectedPlan.price}
            </p>
            <button onClick={onBack} style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: "11px", color: "rgba(138,175,212,0.4)", padding: 0, marginTop: "4px",
            }}>change</button>
          </div>
        </div>

        {/* Email */}
        <div>
          <label style={labelStyle}>
            Your email
            <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0,
              marginLeft: "8px", fontSize: "11px", color: "rgba(138,175,212,0.4)" }}>
              download link sent here
            </span>
          </label>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input style={inputStyle} type="email" placeholder="you@example.com"
              value={email1} onChange={e => { setEmail1(e.target.value); setError(""); }}
              onFocus={e => (e.target.style.borderColor = "rgba(200,169,110,0.6)")}
              onBlur={e  => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
            <input style={inputStyle} type="email" placeholder="Confirm your email"
              value={email2} onChange={e => { setEmail2(e.target.value); setError(""); }}
              onFocus={e => (e.target.style.borderColor = "rgba(200,169,110,0.6)")}
              onBlur={e  => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
          </div>
        </div>

        {/* Error */}
        {error && (
          <p style={{
            fontSize: "13px", color: "#F87171", padding: "10px 14px",
            background: "rgba(248,113,113,0.08)", borderRadius: "8px",
            border: "1px solid rgba(248,113,113,0.2)", margin: 0,
          }}>{error}</p>
        )}

        {/* Pay button */}
        <motion.button onClick={handlePay} disabled={loading}
          whileHover={!loading ? { scale: 1.02 } : {}}
          whileTap={!loading ? { scale: 0.98 } : {}}
          style={{
            width: "100%", padding: "18px", border: "none", borderRadius: "12px",
            background: loading
              ? "rgba(255,255,255,0.08)"
              : "linear-gradient(135deg, #C8A96E 0%, #E0C080 100%)",
            color: loading ? "rgba(255,255,255,0.3)" : "#080E1A",
            fontSize: "17px", fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer", transition: "all 0.3s",
            boxShadow: loading ? "none" : "0 0 32px rgba(200,169,110,0.25)",
          }}>
          {loading ? "Creating your order..." : `Pay ₹${selectedPlan.price} & Download`}
        </motion.button>

        {/* Trust strip */}
        <div style={{
          display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap",
          padding: "14px", borderRadius: "10px",
          background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)",
        }}>
          {["🔒 Secured by Razorpay", "📧 Instant email delivery", "🖨️ Print-ready files"].map(item => (
            <span key={item} style={{ fontSize: "12px", color: "rgba(138,175,212,0.45)" }}>{item}</span>
          ))}
        </div>

        {/* Back */}
        <button onClick={onBack} style={{
          background: "none", border: "none", cursor: "pointer",
          color: "rgba(138,175,212,0.4)", fontSize: "14px",
          textAlign: "center", padding: "4px",
        }}
          onMouseEnter={e => (e.currentTarget.style.color = "rgba(138,175,212,0.8)")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(138,175,212,0.4)")}
        >← Back to customization</button>

      </div>
    </motion.div>
  );
}

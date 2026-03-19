"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import type { MapFormData } from "./CustomizeFlow";
import DatePicker from "./DatePicker";

const OCCASIONS = ["Birthday", "Anniversary", "Wedding", "First Date", "Baby Birth", "Custom"];

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

type Props = {
  data: MapFormData;
  update: (fields: Partial<MapFormData>) => void;
  onNext: () => void;
};

type CityResult = {
  label: string;
  lat: number;
  lon: number;
};

// ── Shared input style ────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "13px 16px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "10px",
  color: "white",
  fontSize: "15px",
  outline: "none",
  transition: "border-color 0.2s",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "12px",
  fontWeight: 700,
  color: "rgba(138,175,212,0.7)",
  letterSpacing: "1.5px",
  textTransform: "uppercase",
  marginBottom: "8px",
};

export default function Step1({ data, update, onNext }: Props) {
  const [cityQuery, setCityQuery]     = useState(data.city);
  const [cityResults, setCityResults] = useState<CityResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searching, setSearching]     = useState(false);
  const searchTimeout                 = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── City search via Mapbox ────────────────────────────────
  const searchCities = async (q: string) => {
    if (q.length < 2) { setCityResults([]); return; }
    if (!MAPBOX_TOKEN) return;
    setSearching(true);
    try {
      // proximity=77.2,28.6 biases results toward India (Delhi coords)
      // worldview=in shows India-centric place names
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json`
        + `?access_token=${MAPBOX_TOKEN}&types=place&limit=8&language=en&proximity=77.2,20.5&worldview=in`;
      const res  = await fetch(url);
      const json = await res.json();
      const results: CityResult[] = (json.features || []).map((f: any) => ({
        label: f.place_name,
        lat:   f.geometry.coordinates[1],
        lon:   f.geometry.coordinates[0],
      }));
      setCityResults(results);
      setShowDropdown(true);
    } catch {
      setCityResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleCityInput = (val: string) => {
    setCityQuery(val);
    update({ city: val, lat: null, lon: null });
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => searchCities(val), 350);
  };

  const selectCity = (r: CityResult) => {
    setCityQuery(r.label);
    update({ city: r.label, lat: r.lat, lon: r.lon });
    setShowDropdown(false);
    setCityResults([]);
  };

  // ── Validation ────────────────────────────────────────────
  const hasCity    = data.lat !== null && data.lon !== null;
  const hasDate    = data.date !== "" && data.date !== null && data.date !== undefined;
  const hasName    = data.name.trim() !== "";
  const hasOccasion = data.occasion !== "Custom" || data.customOccasion.trim() !== "";

  const canProceed = hasCity && hasDate && hasName && hasOccasion;

  // Show hint about what's missing
  const missingHint = !hasName ? "Enter a name to continue"
    : !hasCity   ? "Select a city from the dropdown"
    : !hasDate   ? "Select a complete date (day, month and year)"
    : !hasOccasion ? "Describe your custom occasion"
    : null;

  const handleNext = () => {
    if (canProceed) onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Heading */}
      <div style={{ marginBottom: "36px" }}>
        <h1 style={{
          fontFamily: "var(--font-playfair), Georgia, serif",
          fontSize: "clamp(26px, 4vw, 34px)",
          fontWeight: 700, color: "white",
          marginBottom: "8px", lineHeight: 1.2,
        }}>
          Tell us about your moment
        </h1>
        <p style={{ fontSize: "15px", color: "rgba(138,175,212,0.6)", lineHeight: 1.6 }}>
          We'll compute the exact position of every star, planet, Sun and Moon for this moment.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

        {/* Name */}
        <div>
          <label style={labelStyle}>This map is for</label>
          <input
            style={inputStyle}
            placeholder="e.g. Priya, Rohan & Meera, Our Wedding"
            value={data.name}
            onChange={e => update({ name: e.target.value })}
            onFocus={e => (e.target.style.borderColor = "rgba(200,169,110,0.6)")}
            onBlur={e  => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
          />
        </div>

        {/* Occasion */}
        <div>
          <label style={labelStyle}>Occasion</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {OCCASIONS.map(o => (
              <button
                key={o}
                onClick={() => update({ occasion: o })}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: data.occasion === o
                    ? "1px solid rgba(200,169,110,0.7)"
                    : "1px solid rgba(255,255,255,0.1)",
                  background: data.occasion === o
                    ? "rgba(200,169,110,0.12)"
                    : "rgba(255,255,255,0.04)",
                  color: data.occasion === o ? "#C8A96E" : "rgba(255,255,255,0.55)",
                  fontSize: "14px",
                  fontWeight: data.occasion === o ? 600 : 400,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {o}
              </button>
            ))}
          </div>
          {data.occasion === "Custom" && (
            <input
              style={{ ...inputStyle, marginTop: "10px" }}
              placeholder="Describe the occasion..."
              value={data.customOccasion}
              onChange={e => update({ customOccasion: e.target.value })}
              onFocus={e => (e.target.style.borderColor = "rgba(200,169,110,0.6)")}
              onBlur={e  => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          )}
        </div>

        {/* City search */}
        <div style={{ position: "relative" }}>
          <label style={labelStyle}>Location</label>
          <input
            style={{
              ...inputStyle,
              borderColor: data.lat ? "rgba(200,169,110,0.4)" : "rgba(255,255,255,0.1)",
            }}
            placeholder="Search for a city..."
            value={cityQuery}
            onChange={e => handleCityInput(e.target.value)}
            onFocus={e => {
              e.target.style.borderColor = "rgba(200,169,110,0.6)";
              if (cityResults.length > 0) setShowDropdown(true);
            }}
            onBlur={() => setTimeout(() => setShowDropdown(false), 180)}
          />
          {/* Confirmed city checkmark */}
          {data.lat && (
            <span style={{
              position: "absolute", right: "14px", top: "38px",
              color: "#C8A96E", fontSize: "16px",
            }}>✓</span>
          )}
          {/* Dropdown */}
          {showDropdown && cityResults.length > 0 && (
            <div style={{
              position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
              background: "#1B2D4F",
              border: "1px solid rgba(200,169,110,0.2)",
              borderRadius: "10px",
              overflow: "hidden",
              zIndex: 100,
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            }}>
              {cityResults.map((r, i) => (
                <button
                  key={i}
                  onMouseDown={() => selectCity(r)}
                  style={{
                    display: "block", width: "100%",
                    padding: "12px 16px",
                    background: "none",
                    border: "none",
                    borderBottom: i < cityResults.length - 1
                      ? "1px solid rgba(255,255,255,0.05)" : "none",
                    color: "rgba(255,255,255,0.85)",
                    fontSize: "14px",
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(200,169,110,0.1)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "none")}
                >
                  {r.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date */}
        <div>
          <label style={labelStyle}>Date</label>
          <DatePicker
            value={data.date}
            onChange={val => update({ date: val })}
          />
        </div>

        {/* Time */}
        <div>
          <label style={labelStyle}>Time</label>
          <div style={{ display: "flex", gap: "10px" }}>
            {/* Hour */}
            <select
              style={{ ...inputStyle, flex: 1 }}
              value={data.hour}
              onChange={e => update({ hour: Number(e.target.value) })}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                <option key={h} value={h} style={{ background: "#1B2D4F" }}>{h}</option>
              ))}
            </select>
            {/* Minute */}
            <select
              style={{ ...inputStyle, flex: 1 }}
              value={data.minute}
              onChange={e => update({ minute: Number(e.target.value) })}
            >
              {Array.from({ length: 12 }, (_, i) => i * 5).map(m => (
                <option key={m} value={m} style={{ background: "#1B2D4F" }}>
                  {m.toString().padStart(2, "0")}
                </option>
              ))}
            </select>
            {/* AM/PM */}
            <div style={{ display: "flex", gap: "6px" }}>
              {(["AM", "PM"] as const).map(p => (
                <button
                  key={p}
                  onClick={() => update({ ampm: p })}
                  style={{
                    padding: "13px 18px",
                    borderRadius: "10px",
                    border: data.ampm === p
                      ? "1px solid rgba(200,169,110,0.7)"
                      : "1px solid rgba(255,255,255,0.1)",
                    background: data.ampm === p
                      ? "rgba(200,169,110,0.12)"
                      : "rgba(255,255,255,0.04)",
                    color: data.ampm === p ? "#C8A96E" : "rgba(255,255,255,0.55)",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    whiteSpace: "nowrap",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Next button */}
        <motion.button
          onClick={handleNext}
          disabled={!canProceed}
          whileHover={canProceed ? { scale: 1.02 } : {}}
          whileTap={canProceed ? { scale: 0.98 } : {}}
          style={{
            width: "100%",
            padding: "16px",
            marginTop: "8px",
            background: canProceed
              ? "linear-gradient(135deg, #C8A96E 0%, #E0C080 100%)"
              : "rgba(255,255,255,0.08)",
            border: "none",
            borderRadius: "12px",
            color: canProceed ? "#080E1A" : "rgba(255,255,255,0.25)",
            fontSize: "16px",
            fontWeight: 700,
            cursor: canProceed ? "pointer" : "not-allowed",
            transition: "all 0.3s",
            boxShadow: canProceed ? "0 0 32px rgba(200,169,110,0.2)" : "none",
          }}
        >
          Continue to style →
        </motion.button>

        {/* Missing field hint */}
        {missingHint && (
          <p style={{
            textAlign: "center", fontSize: "13px",
            color: "rgba(138,175,212,0.45)", marginTop: "10px",
          }}>
            {missingHint}
          </p>
        )}

      </div>
    </motion.div>
  );
}

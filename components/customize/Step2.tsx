"use client";
// Responsive two-column layout for Step 2
// On desktop (>900px): preview left, form right
// On mobile: form first, preview below


import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { MapFormData } from "./CustomizeFlow";

type Props = {
  data: MapFormData;
  update: (fields: Partial<MapFormData>) => void;
  onBack: () => void;
  onNext: () => void;
};

const MAP_TYPES = [
  {
    id: "zenith",
    label: "Your Sky",
    description: "Stars, planets, Sun and Moon positioned exactly as they were from your location at that moment.",
    badge: null,
    hint: null,
  },
  {
    id: "fullsky",
    label: "All Stars",
    description: "The full celestial sphere — every star and constellation, day or night, exactly as they were.",
    badge: null,
    hint: null,
  },
  {
    id: "both",
    label: "Both Posters",
    description: "Get both styles now. Decide which one to print, frame, or gift after you see them.",
    badge: "Decide later",
    hint: "Not sure which style you'll prefer? Get both and choose after you see them.",
  },
];

// Themes match src/config.py THEMES exactly — same names, same order
const THEMES = [
  { id: "Dark Navy",      bg: "#0B1426", stars: "#FFFFFF",  lines: "#C8C3C0" },
  { id: "Midnight Black", bg: "#000000", stars: "#FFFFFF",  lines: "#CC8866" },
  { id: "Sepia",          bg: "#2C1810", stars: "#FFE4C4",  lines: "#D4956A" },
  { id: "Vintage",        bg: "#1A1A2E", stars: "#FFD700",  lines: "#B8860B" },
  { id: "Light",          bg: "#F5F0E8", stars: "#2C2C2C",  lines: "#8B6914" },
  { id: "Burgundy",       bg: "#1A0008", stars: "#FFE8EE",  lines: "#C2185B" },
];

const TITLE_FONTS = [
  { id: "Playfair Display", label: "Playfair" },
  { id: "Cinzel",           label: "Cinzel" },
  { id: "Dancing Script",   label: "Dancing Script" },
  { id: "Raleway",          label: "Raleway" },
  { id: "Montserrat",       label: "Montserrat" },
];

const OCCASION_FONTS = [
  { id: "Alex Brush",     label: "Alex Brush" },
  { id: "Dancing Script", label: "Dancing Script" },
  { id: "Great Vibes",    label: "Great Vibes" },
  { id: "Pacifico",       label: "Pacifico" },
  { id: "Montserrat",     label: "Montserrat" },
];

const LOCATION_FORMATS = [
  "City only",
  "City, Country",
  "City, State, Country",
  "Coordinates",
];

const HANDPICKED: Record<string, string[]> = {
  Birthday:    ["The Night a New Star Was Born", "The Universe Celebrated You", "A Sky Full of Wishes", "The Night the World Got Better"],
  Anniversary: ["Under the Same Stars, Forever", "The Night We Became We", "A Sky Witnessed Our Love", "The Stars That Saw It All"],
  Wedding:     ["When Two Skies Became One", "The Night Forever Began", "Married Under These Stars", "The Universe Said Yes"],
  "First Date":["The Night That Changed Everything", "When the Stars Aligned", "The Sky the Night We Met", "An Accidental Universe"],
  "Baby Birth":["A New Star in Our Universe", "The Night Our World Changed", "Welcome to the Stars", "The Sky You Were Born Under"],
  Custom:      ["The Night That Mattered", "A Sky Worth Remembering", "Under These Stars", "The Universe Remembers"],
};

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "12px", fontWeight: 700,
  color: "rgba(138,175,212,0.7)", letterSpacing: "1.5px",
  textTransform: "uppercase", marginBottom: "12px",
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "13px 16px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "10px", color: "white", fontSize: "15px",
  outline: "none", transition: "border-color 0.2s", boxSizing: "border-box",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle, cursor: "pointer",
  appearance: "none", WebkitAppearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238AAFD4' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: "36px",
};

function ExpandSection({ title, subtitle, children }: {
  title: string; subtitle: string; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderRadius: "12px", border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden" }}>
      <button onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", padding: "16px 18px", background: open ? "rgba(200,169,110,0.06)" : "rgba(255,255,255,0.03)",
          border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between",
          transition: "background 0.2s",
        }}
      >
        <div style={{ textAlign: "left" }}>
          <p style={{ fontSize: "14px", fontWeight: 600, color: open ? "#C8A96E" : "rgba(255,255,255,0.8)", margin: 0 }}>{title}</p>
          <p style={{ fontSize: "12px", color: "rgba(138,175,212,0.45)", margin: "2px 0 0", lineHeight: 1.4 }}>{subtitle}</p>
        </div>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}
          style={{ color: "rgba(138,175,212,0.5)", fontSize: "14px", flexShrink: 0, marginLeft: "12px" }}>▾</motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}>
            <div style={{ padding: "20px 18px 24px", display: "flex", flexDirection: "column", gap: "20px" }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "12px", color: "rgba(138,175,212,0.5)", fontFamily: "monospace" }}>{value}</span>
        <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: value, border: "2px solid rgba(255,255,255,0.15)", overflow: "hidden", cursor: "pointer", flexShrink: 0 }}>
          <input type="color" value={value} onChange={e => onChange(e.target.value)}
            style={{ width: "200%", height: "200%", transform: "translate(-25%,-25%)", cursor: "pointer", border: "none", padding: 0, background: "none" }} />
        </div>
      </div>
    </div>
  );
}

function SliderField({ label, value, min, max, step, onChange, formatLabel }: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; formatLabel?: (v: number) => string;
}) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
        <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>{label}</span>
        <span style={{ fontSize: "12px", color: "#C8A96E", fontWeight: 600 }}>{formatLabel ? formatLabel(value) : value}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: "#C8A96E", cursor: "pointer" }} />
    </div>
  );
}

function Toggle({ label, value, onChange, note }: { label: string; value: boolean; onChange: (v: boolean) => void; note?: string }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>{label}</span>
        <button onClick={() => onChange(!value)}
          style={{
            width: "44px", height: "24px", borderRadius: "12px", border: "none",
            background: value ? "#C8A96E" : "rgba(255,255,255,0.12)",
            cursor: "pointer", position: "relative", transition: "background 0.25s", flexShrink: 0,
          }}>
          <div style={{
            position: "absolute", top: "3px", left: value ? "23px" : "3px",
            width: "18px", height: "18px", borderRadius: "50%",
            background: "white", transition: "left 0.25s", boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
          }} />
        </button>
      </div>
      {note && <p style={{ fontSize: "11px", color: "rgba(138,175,212,0.4)", margin: "4px 0 0", lineHeight: 1.4 }}>{note}</p>}
    </div>
  );
}

// ── Tier 1 per-map panel ─────────────────────────────────────
function Tier1Panel({ suffix, data, update, titles, occasion }: {
  suffix: string;
  data: MapFormData;
  update: (f: Partial<MapFormData>) => void;
  titles: string[];
  occasion: string;
}) {
  const themeKey       = `theme_${suffix}`       as any;
  const titleOptKey    = `titleOption_${suffix}`  as any;
  const customTitleKey = `customTitle_${suffix}`  as any;
  const wishingKey     = `wishingText_${suffix}`  as any;

  const theme       = (data as any)[themeKey]       || data.theme       || "Dark Navy";
  const titleOption = (data as any)[titleOptKey]    || data.titleOption  || "AI";
  const customTitle = (data as any)[customTitleKey] ?? data.customTitle  ?? "";
  const wishingText = (data as any)[wishingKey]     ?? data.wishingText  ?? "";

  return (
    <>
      {/* Color theme */}
      <div>
        <label style={labelStyle}>Color theme</label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
          {THEMES.map(t => (
            <button key={t.id} onClick={() => update({ [themeKey]: t.id } as any)}
              style={{
                padding: "14px 10px", borderRadius: "12px", cursor: "pointer",
                background: t.bg, position: "relative",
                border: theme === t.id ? "2px solid #C8A96E" : "1.5px solid rgba(255,255,255,0.08)",
                display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
                transition: "all 0.2s",
              }}>
              <div style={{
                width: "40px", height: "40px", borderRadius: "50%",
                border: `1px solid ${t.lines}50`, position: "relative", overflow: "hidden",
              }}>
                {[[30,20],[15,30],[25,35],[35,28],[20,15],[32,38],[12,22],[38,15]].map(([x,y],i) => (
                  <div key={i} style={{
                    position: "absolute", borderRadius: "50%", background: t.stars,
                    width: i<3?"2px":"1.5px", height: i<3?"2px":"1.5px",
                    left: x+"%", top: y+"%", opacity: 0.8,
                  }} />
                ))}
              </div>
              <span style={{
                fontSize: "10px", fontWeight: theme === t.id ? 700 : 500,
                color: theme === t.id ? "#C8A96E" : t.stars,
                opacity: theme === t.id ? 1 : 0.7, letterSpacing: "0.3px",
              }}>{t.id}</span>
              {theme === t.id && (
                <div style={{
                  position: "absolute", top: "6px", right: "6px",
                  width: "16px", height: "16px", borderRadius: "50%",
                  background: "#C8A96E", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: "9px", color: "#080E1A", fontWeight: 800,
                }}>✓</div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Poster title */}
      <div>
        <label style={labelStyle}>Poster title</label>
        <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
          {[
            { id: "AI",         label: "AI magic ✨" },
            { id: "handpicked", label: "Handpicked" },
            { id: "custom",     label: "Write my own" },
          ].map(opt => (
            <button key={opt.id} onClick={() => update({ [titleOptKey]: opt.id } as any)}
              style={{
                flex: 1, padding: "10px 6px", borderRadius: "10px", cursor: "pointer",
                fontSize: "13px", fontWeight: 600, transition: "all 0.2s", border: "none",
                background: titleOption === opt.id ? "rgba(200,169,110,0.15)" : "rgba(255,255,255,0.04)",
                color: titleOption === opt.id ? "#C8A96E" : "rgba(255,255,255,0.45)",
                outline: titleOption === opt.id ? "1px solid rgba(200,169,110,0.5)" : "1px solid rgba(255,255,255,0.07)",
              }}>{opt.label}</button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {titleOption === "AI" && (
            <motion.div key="ai" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}>
              <div style={{ padding: "14px 16px", borderRadius: "10px", background: "rgba(200,169,110,0.06)", border: "1px solid rgba(200,169,110,0.15)" }}>
                <p style={{ fontSize: "14px", color: "rgba(138,175,212,0.7)", margin: 0, lineHeight: 1.6 }}>
                  We'll write a poetic, personalised title for your{" "}
                  <span style={{ color: "#C8A96E" }}>{occasion.toLowerCase()}</span> poster. You can regenerate after preview.
                </p>
              </div>
            </motion.div>
          )}
          {titleOption === "handpicked" && (
            <motion.div key="handpicked" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {titles.map(t => (
                <button key={t} onClick={() => update({ [customTitleKey]: t } as any)}
                  style={{
                    padding: "12px 16px", borderRadius: "10px", cursor: "pointer",
                    textAlign: "left", fontSize: "14px", transition: "all 0.2s", border: "none",
                    fontFamily: "var(--font-playfair), Georgia, serif",
                    background: customTitle === t ? "rgba(200,169,110,0.1)" : "rgba(255,255,255,0.03)",
                    color: customTitle === t ? "#C8A96E" : "rgba(255,255,255,0.75)",
                    outline: customTitle === t ? "1px solid rgba(200,169,110,0.5)" : "1px solid rgba(255,255,255,0.07)",
                  }}>{t}</button>
              ))}
            </motion.div>
          )}
          {titleOption === "custom" && (
            <motion.div key="custom" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}>
              <input style={inputStyle} placeholder='"The Night Everything Changed"'
                value={customTitle} onChange={e => update({ [customTitleKey]: e.target.value } as any)}
                onFocus={e => (e.target.style.borderColor = "rgba(200,169,110,0.6)")}
                onBlur={e  => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dedication line */}
      <div>
        <label style={labelStyle}>
          Dedication line
          <span style={{ fontWeight: 400, letterSpacing: 0, textTransform: "none", marginLeft: "8px", color: "rgba(138,175,212,0.4)", fontSize: "11px" }}>optional</span>
        </label>
        <input style={inputStyle} placeholder='e.g. "Happy Birthday Priya!" — AI writes one if blank'
          value={wishingText} onChange={e => update({ [wishingKey]: e.target.value } as any)}
          onFocus={e => (e.target.style.borderColor = "rgba(200,169,110,0.6)")}
          onBlur={e  => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
      </div>
    </>
  );
}

// The actual customization panel — reused for both maps in "both" mode
function CustomizationPanel({
  suffix, data, update, showFullSkyOptions,
}: {
  suffix: string;
  data: MapFormData;
  update: (f: Partial<MapFormData>) => void;
  showFullSkyOptions: boolean;
}) {
  const bgKey          = `bgColor_${suffix}`         as any;
  const titleColorKey  = `titleColor_${suffix}`       as any;
  const occasionColorKey = `occasionColor_${suffix}`  as any;
  const constColorKey  = `constColor_${suffix}`       as any;
  const titleFontKey   = `titleFont_${suffix}`        as any;
  const occFontKey     = `occasionFont_${suffix}`     as any;
  const starDensityKey = `starDensity_${suffix}`      as any;
  const showConstKey   = `showConstellations_${suffix}` as any;
  const showConstLabelsKey = `showConstellationLabels_${suffix}` as any;
  const starSizeKey    = `starSize_${suffix}`         as any;
  const planetSizeKey  = `planetSize_${suffix}`       as any;
  const sunSizeKey     = `sunSize_${suffix}`          as any;
  const moonSizeKey    = `moonSize_${suffix}`         as any;
  const showStarLabelsKey = `showStarLabels_${suffix}` as any;
  const showPlanetNamesKey = `showPlanetNames_${suffix}` as any;
  const horizonKey     = `showHorizonLabels_${suffix}` as any;
  const risingKey      = `showRisingLabels_${suffix}` as any;
  const sunLabelKey    = `showSunLabel_${suffix}`     as any;
  const moonLabelKey   = `showMoonLabel_${suffix}`    as any;
  const locationFmtKey = `locationFormat_${suffix}`   as any;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Tier 2 */}
      <ExpandSection title="Personalise further" subtitle="Fonts, colors, star density, constellation lines">

        <div>
          <label style={{ ...labelStyle, marginBottom: "8px" }}>Title font</label>
          <select style={selectStyle} value={(data as any)[titleFontKey] || "Playfair Display"}
            onChange={e => update({ [titleFontKey]: e.target.value } as any)}
            onFocus={e => (e.target.style.borderColor = "rgba(200,169,110,0.6)")}
            onBlur={e  => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}>
            {TITLE_FONTS.map(f => <option key={f.id} value={f.id} style={{ background: "#1B2D4F" }}>{f.label}</option>)}
          </select>
        </div>

        <div>
          <label style={{ ...labelStyle, marginBottom: "8px" }}>Dedication font</label>
          <select style={selectStyle} value={(data as any)[occFontKey] || "Alex Brush"}
            onChange={e => update({ [occFontKey]: e.target.value } as any)}
            onFocus={e => (e.target.style.borderColor = "rgba(200,169,110,0.6)")}
            onBlur={e  => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}>
            {OCCASION_FONTS.map(f => <option key={f.id} value={f.id} style={{ background: "#1B2D4F" }}>{f.label}</option>)}
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <ColorPicker label="Background color" value={(data as any)[bgKey] || "#1B2D4F"} onChange={v => update({ [bgKey]: v } as any)} />
          <ColorPicker label="Title color" value={(data as any)[titleColorKey] || "#C8A96E"} onChange={v => update({ [titleColorKey]: v } as any)} />
          <ColorPicker label="Dedication color" value={(data as any)[occasionColorKey] || "#F4A460"} onChange={v => update({ [occasionColorKey]: v } as any)} />
          <ColorPicker label="Constellation line color" value={(data as any)[constColorKey] || "#8AAFD4"} onChange={v => update({ [constColorKey]: v } as any)} />
        </div>

        <SliderField label="Star density" value={(data as any)[starDensityKey] ?? 50}
          min={0} max={100} step={5} onChange={v => update({ [starDensityKey]: v } as any)} formatLabel={v => v + "%"} />

        <Toggle label="Constellation lines" value={(data as any)[showConstKey] ?? true} onChange={v => update({ [showConstKey]: v } as any)} />
        <Toggle label="Constellation labels" value={(data as any)[showConstLabelsKey] ?? true} onChange={v => update({ [showConstLabelsKey]: v } as any)} />

        <div>
          <label style={{ ...labelStyle, marginBottom: "8px" }}>Location format</label>
          <select style={selectStyle} value={(data as any)[locationFmtKey] || "City, State, Country"}
            onChange={e => update({ [locationFmtKey]: e.target.value } as any)}
            onFocus={e => (e.target.style.borderColor = "rgba(200,169,110,0.6)")}
            onBlur={e  => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}>
            {LOCATION_FORMATS.map(f => <option key={f} value={f} style={{ background: "#1B2D4F" }}>{f}</option>)}
          </select>
        </div>

      </ExpandSection>

      {/* Tier 3 */}
      <ExpandSection title="🔭 For the truly obsessed" subtitle="We already picked the best settings — but we respect your curiosity">

        <p style={{
          fontSize: "13px", color: "rgba(138,175,212,0.5)", lineHeight: 1.6,
          padding: "10px 14px", background: "rgba(200,169,110,0.04)",
          borderRadius: "8px", border: "1px solid rgba(200,169,110,0.1)", margin: 0,
        }}>
          Honestly? Our defaults look better than anything you'll tweak here.
          But since you opened this — you've earned it. 🏆
        </p>

        <SliderField label="Star size" value={(data as any)[starSizeKey] ?? 50}
          min={0} max={100} step={5} onChange={v => update({ [starSizeKey]: v } as any)} formatLabel={v => v + "%"} />
        <SliderField label="Planet size" value={(data as any)[planetSizeKey] ?? 50}
          min={0} max={100} step={5} onChange={v => update({ [planetSizeKey]: v } as any)} formatLabel={v => v + "%"} />
        <SliderField label="Sun size" value={(data as any)[sunSizeKey] ?? 50}
          min={0} max={100} step={5} onChange={v => update({ [sunSizeKey]: v } as any)} formatLabel={v => v + "%"} />
        <SliderField label="Moon size" value={(data as any)[moonSizeKey] ?? 50}
          min={0} max={100} step={5} onChange={v => update({ [moonSizeKey]: v } as any)} formatLabel={v => v + "%"} />

        <div style={{ height: "1px", background: "rgba(255,255,255,0.06)" }} />

        <Toggle label="Named star labels" value={(data as any)[showStarLabelsKey] ?? true} onChange={v => update({ [showStarLabelsKey]: v } as any)} />
        <Toggle label="Planet names" value={(data as any)[showPlanetNamesKey] ?? true} onChange={v => update({ [showPlanetNamesKey]: v } as any)} />
        <Toggle label="Sun label" value={(data as any)[sunLabelKey] ?? true} onChange={v => update({ [sunLabelKey]: v } as any)} />
        <Toggle label="Moon label" value={(data as any)[moonLabelKey] ?? true} onChange={v => update({ [moonLabelKey]: v } as any)} />

        {showFullSkyOptions && (
          <>
            <div style={{ height: "1px", background: "rgba(255,255,255,0.06)" }} />
            <p style={{ fontSize: "11px", color: "rgba(200,169,110,0.5)", margin: 0, letterSpacing: "0.5px", fontWeight: 600, textTransform: "uppercase" }}>
              Full Sky only
            </p>
            <Toggle label="Horizon labels" value={(data as any)[horizonKey] ?? true} onChange={v => update({ [horizonKey]: v } as any)}
              note="Shows N/S/E/W labels around the horizon ellipse" />
            <Toggle label="Rising & setting labels" value={(data as any)[risingKey] ?? true} onChange={v => update({ [risingKey]: v } as any)}
              note="Labels for stars rising and setting on the horizon" />
          </>
        )}

      </ExpandSection>
    </div>
  );
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Step2({ data, update, onBack, onNext }: Props) {
  const [mapTab, setMapTab] = useState<"zenith" | "fullsky">("zenith");
  const [generated, setGenerated]               = useState(false);
  const [generating, setGenerating]             = useState(false);
  const [previewImages, setPreviewImages]       = useState<Record<string, string>>({});
  const [generatedTitles, setGeneratedTitles]   = useState<Record<string, string>>({});
  const [generatedWishing, setGeneratedWishing] = useState<Record<string, string>>({});
  const [regenLoading, setRegenLoading]         = useState<Record<string, boolean>>({});
  const [error, setError]                       = useState("");
  const titles = HANDPICKED[data.occasion] || HANDPICKED["Custom"];

  const canProceed =
    data.mapType !== null && data.theme !== "" &&
    (data.titleOption === "AI" ||
     data.titleOption !== "custom" || data.customTitle.trim() !== "") &&
    (data.titleOption === "AI" ||
     data.titleOption !== "handpicked" || data.customTitle.trim() !== "");

  const handleGenerate = async () => {
    setGenerating(true);
    setError("");
    try {
      // Guard — coordinates required
      if (!data.lat || !data.lon) {
        setError("Please go back and select a city from the dropdown suggestions.");
        setGenerating(false);
        return;
      }
      if (!data.date) {
        setError("Please go back and select a complete date.");
        setGenerating(false);
        return;
      }

      // data.mapType is "zenith" | "fullsky" | "both" — sent directly to backend
      const mapType = data.mapType as "zenith" | "fullsky" | "both";

      // Helper: for "both", each map has its own suffixed fields in MapFormData (e.g. theme_zenith).
      // For single maps, fall back to the unsuffixed key.
      const get = (key: string, mt: "zenith" | "fullsky") => {
        const suffixed = (data as any)[`${key}_${mt}`];
        return suffixed !== undefined ? suffixed : (data as any)[key];
      };

      // Build per-map fields for all maps being requested
      const mapsToSend = mapType === "both" ? ["zenith", "fullsky"] : [mapType];
      const perMapFields: Record<string, any> = {};
      for (const mt of mapsToSend as ("zenith" | "fullsky")[]) {
        const s = mt === "zenith" ? "z" : "f";
        Object.assign(perMapFields, {
          [`theme_${s}`]        : get("theme", mt)       || "Dark Navy",
          [`title_option_${s}`] : get("titleOption", mt) || "AI",
          [`custom_title_${s}`] : get("customTitle", mt) || "",
          [`wishing_text_${s}`] : get("wishingText", mt) || "",
          [`title_font_${s}`]     : get("titleFont", mt),
          [`occasion_font_${s}`]  : get("occasionFont", mt),
          [`title_color_${s}`]    : get("titleColor", mt),
          [`occasion_color_${s}`] : get("occasionColor", mt),
          [`bg_color_${s}`]       : get("bgColor", mt),
          [`const_color_${s}`]    : get("constColor", mt),
          [`star_density_${s}`]   : get("starDensity", mt) ?? 50,
          [`show_constellations_${s}`]       : get("showConstellations", mt) ?? true,
          [`show_constellation_labels_${s}`] : get("showConstellationLabels", mt) ?? true,
          [`star_size_${s}`]          : get("starSize", mt)         ?? 50,
          [`planet_size_${s}`]        : get("planetSize", mt)       ?? 50,
          [`sun_size_${s}`]           : get("sunSize", mt)          ?? 50,
          [`moon_size_${s}`]          : get("moonSize", mt)         ?? 50,
          [`show_star_labels_${s}`]   : get("showStarLabels", mt)   ?? true,
          [`show_planet_names_${s}`]  : get("showPlanetNames", mt)  ?? true,
          [`show_sun_label_${s}`]     : get("showSunLabel", mt)     ?? true,
          [`show_moon_label_${s}`]    : get("showMoonLabel", mt)    ?? true,
          [`show_horizon_labels_${s}`]: get("showHorizonLabels", mt)?? true,
          [`show_rising_labels_${s}`] : get("showRisingLabels", mt) ?? true,
          [`location_format_${s}`]    : get("locationFormat", mt)   || "City, State, Country",
        });
      }

      const resp = await fetch(`${API_URL}/api/v1/preview`, {
        method : "POST",
        headers: { "Content-Type": "application/json" },
        body   : JSON.stringify({
          lat     : data.lat,
          lon     : data.lon,
          date    : data.date,
          time    : (() => {
            const h = data.ampm === "PM" ? (data.hour % 12) + 12 : data.hour % 12;
            return `${String(h).padStart(2,"0")}:${String(data.minute).padStart(2,"0")}`;
          })(),
          city    : data.city,
          occasion: data.occasion === "Custom" ? data.customOccasion : data.occasion,
          name    : data.name,
          map_type: mapType,
          ...perMapFields,
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.detail || "Preview generation failed.");
      }

      const result = await resp.json();

      // Consume all returned maps — backend returns only what was requested
      const newImages: Record<string, string>  = {};
      const newTitles: Record<string, string>  = {};
      const newWishing: Record<string, string> = {};
      const formUpdates: Record<string, any>   = {};

      for (const mt of mapsToSend as ("zenith" | "fullsky")[]) {
        const s = mt === "zenith" ? "z" : "f";
        const img     = result[`${mt}_preview_b64`];
        const title   = result[`title_${s}`];
        const wishing = result[`wishing_${s}`];

        if (img)     newImages[mt]  = img;
        if (title) {
          newTitles[mt] = title;
          if (mapType === "both") {
            formUpdates[`customTitle_${mt}`] = title;
            formUpdates[`titleOption_${mt}`] = "custom";
          } else {
            formUpdates.customTitle = title;
            formUpdates.titleOption = "custom";
          }
        }
        if (wishing) {
          newWishing[mt] = wishing;
          if (mapType === "both") {
            formUpdates[`wishingText_${mt}`] = wishing;
          } else {
            formUpdates.wishingText = wishing;
          }
        }
      }

      setPreviewImages(prev  => ({ ...prev,  ...newImages  }));
      setGeneratedTitles(prev => ({ ...prev, ...newTitles  }));
      setGeneratedWishing(prev => ({ ...prev,...newWishing }));
      if (Object.keys(formUpdates).length) update(formUpdates as any);
      setGenerated(true);

    } catch (e: any) {
      setError(e.message || "Preview failed. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  // Regenerate preview for a specific map — full re-render with new AI title
  const handleRegenPreview = async (mapType: "zenith" | "fullsky") => {
    setRegenLoading(prev => ({ ...prev, [mapType]: true }));
    setError("");
    try {
      const mt = mapType;
      const s  = mt === "zenith" ? "z" : "f";
      const get = (key: string) => {
        const suffixed = (data as any)[`${key}_${mt}`];
        return suffixed !== undefined ? suffixed : (data as any)[key];
      };

      // Force AI title regeneration by clearing custom title for this map
      if (data.mapType === "both") {
        update({ [`titleOption_${mt}`]: "AI", [`customTitle_${mt}`]: "" } as any);
      } else {
        update({ titleOption: "AI", customTitle: "" });
      }

      const resp = await fetch(`${API_URL}/api/v1/preview`, {
        method : "POST",
        headers: { "Content-Type": "application/json" },
        body   : JSON.stringify({
          lat     : data.lat,
          lon     : data.lon,
          date    : data.date,
          time    : (() => {
            const h = data.ampm === "PM" ? (data.hour % 12) + 12 : data.hour % 12;
            return `${String(h).padStart(2,"0")}:${String(data.minute).padStart(2,"0")}`;
          })(),
          city    : data.city,
          occasion: data.occasion === "Custom" ? data.customOccasion : data.occasion,
          name    : data.name,
          map_type: mt,
          [`theme_${s}`]               : get("theme")       || "Dark Navy",
          [`title_option_${s}`]        : "AI",
          [`custom_title_${s}`]        : "",
          [`wishing_text_${s}`]        : "",
          [`title_font_${s}`]          : get("titleFont"),
          [`occasion_font_${s}`]       : get("occasionFont"),
          [`title_color_${s}`]         : get("titleColor"),
          [`occasion_color_${s}`]      : get("occasionColor"),
          [`bg_color_${s}`]            : get("bgColor"),
          [`const_color_${s}`]         : get("constColor"),
          [`star_density_${s}`]        : get("starDensity")        ?? 50,
          [`show_constellations_${s}`]       : get("showConstellations")      ?? true,
          [`show_constellation_labels_${s}`] : get("showConstellationLabels") ?? true,
          [`star_size_${s}`]           : get("starSize")           ?? 50,
          [`planet_size_${s}`]         : get("planetSize")         ?? 50,
          [`sun_size_${s}`]            : get("sunSize")            ?? 50,
          [`moon_size_${s}`]           : get("moonSize")           ?? 50,
          [`show_star_labels_${s}`]    : get("showStarLabels")     ?? true,
          [`show_planet_names_${s}`]   : get("showPlanetNames")    ?? true,
          [`show_sun_label_${s}`]      : get("showSunLabel")       ?? true,
          [`show_moon_label_${s}`]     : get("showMoonLabel")      ?? true,
          [`show_horizon_labels_${s}`] : get("showHorizonLabels")  ?? true,
          [`show_rising_labels_${s}`]  : get("showRisingLabels")   ?? true,
          [`location_format_${s}`]     : get("locationFormat")     || "City, State, Country",
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.detail || "Preview generation failed.");
      }

      const result = await resp.json();
      const img    = result[`${mt}_preview_b64`];
      const title  = result[`title_${s}`];
      const wishing = result[`wishing_${s}`];

      if (img)    setPreviewImages(prev  => ({ ...prev,  [mt]: img }));
      if (title)  setGeneratedTitles(prev => ({ ...prev, [mt]: title }));
      if (wishing) setGeneratedWishing(prev => ({ ...prev, [mt]: wishing }));

      // Store new title in form state for full-res
      if (data.mapType === "both") {
        update({ [`customTitle_${mt}`]: title, [`titleOption_${mt}`]: "custom",
                 [`wishingText_${mt}`]: wishing } as any);
      } else {
        update({ customTitle: title, titleOption: "custom", wishingText: wishing });
      }

    } catch (e: any) {
      setError(e.message || "Could not regenerate preview.");
    } finally {
      setRegenLoading(prev => ({ ...prev, [mapType]: false }));
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

      <div style={{ marginBottom: "36px" }}>
        <h1 style={{
          fontFamily: "var(--font-playfair), Georgia, serif",
          fontSize: "clamp(26px, 4vw, 34px)", fontWeight: 700,
          color: "white", marginBottom: "8px", lineHeight: 1.2,
        }}>Make it yours</h1>
        <p style={{ fontSize: "15px", color: "rgba(138,175,212,0.6)", lineHeight: 1.6 }}>
          Choose your map style, color theme, and title.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

        {/* ── Map type ─────────────────────────────────── */}
        <div>
          <label style={labelStyle}>Map style</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {MAP_TYPES.map(m => (
              <button key={m.id} onClick={() => update({ mapType: m.id as any })}
                style={{
                  display: "flex", alignItems: "flex-start", gap: "14px",
                  padding: "14px 16px", borderRadius: "12px", cursor: "pointer",
                  textAlign: "left", transition: "all 0.2s", border: "none",
                  background: data.mapType === m.id ? "rgba(200,169,110,0.08)" : "rgba(255,255,255,0.03)",
                  outline: data.mapType === m.id ? "1px solid rgba(200,169,110,0.6)" : "1px solid rgba(255,255,255,0.08)",
                }}>
                <div style={{
                  width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0, marginTop: "2px",
                  border: data.mapType === m.id ? "none" : "1.5px solid rgba(255,255,255,0.2)",
                  background: data.mapType === m.id ? "#C8A96E" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {data.mapType === m.id && <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#080E1A" }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span style={{ fontSize: "15px", fontWeight: 600, color: data.mapType === m.id ? "#C8A96E" : "white" }}>
                      {m.label}
                    </span>
                    {m.badge && (
                      <span style={{
                        fontSize: "10px", fontWeight: 700, padding: "2px 8px",
                        background: "rgba(138,175,212,0.1)", border: "1px solid rgba(138,175,212,0.25)",
                        borderRadius: "20px", color: "#8AAFD4",
                      }}>{m.badge}</span>
                    )}
                  </div>
                  <p style={{ fontSize: "13px", color: "rgba(138,175,212,0.55)", margin: 0, lineHeight: 1.5 }}>
                    {m.description}
                  </p>
                  {m.hint && data.mapType === m.id && (
                    <p style={{
                      fontSize: "12px", color: "rgba(200,169,110,0.6)",
                      margin: "6px 0 0", lineHeight: 1.5,
                      padding: "6px 10px", background: "rgba(200,169,110,0.06)",
                      borderRadius: "6px", borderLeft: "2px solid rgba(200,169,110,0.3)",
                    }}>
                      💡 {m.hint}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Per-map customization tabs (shown when both selected) ── */}
        {data.mapType === "both" ? (
          <div>
            {/* Sticky tabs — always visible while scrolling */}
            <div style={{
              position: "sticky",
              top: "64px", // below navbar
              zIndex: 20,
              display: "flex",
              gap: "8px",
              marginBottom: "20px",
              padding: "10px 0",
              background: "linear-gradient(to bottom, #0F1923 80%, transparent 100%)",
              backdropFilter: "blur(8px)",
            }}>
              {(["zenith", "fullsky"] as const).map(tab => (
                <button key={tab} onClick={() => setMapTab(tab)}
                  style={{
                    flex: 1, padding: "11px", borderRadius: "10px", cursor: "pointer",
                    fontSize: "13px", fontWeight: 600, transition: "all 0.2s", border: "none",
                    background: mapTab === tab ? "rgba(200,169,110,0.15)" : "rgba(255,255,255,0.04)",
                    color: mapTab === tab ? "#C8A96E" : "rgba(255,255,255,0.45)",
                    outline: mapTab === tab ? "1px solid rgba(200,169,110,0.5)" : "1px solid rgba(255,255,255,0.07)",
                  }}>
                  {tab === "zenith" ? "🔭 Your Sky" : "🌌 All Stars"}
                </button>
              ))}
            </div>

            {/* Left border accent — passive color cue while scrolling */}
            <AnimatePresence mode="wait">
              <motion.div
                key={mapTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                style={{
                  display: "flex", flexDirection: "column", gap: "28px",
                  borderLeft:  mapTab === "zenith" ? "3px solid rgba(200,169,110,0.45)" : "none",
                  borderRight: mapTab === "fullsky" ? "3px solid rgba(200,169,110,0.45)" : "none",
                  paddingLeft:  mapTab === "zenith" ? "20px" : "0",
                  paddingRight: mapTab === "fullsky" ? "20px" : "0",
                }}
              >
                <Tier1Panel suffix={mapTab} data={data} update={update} titles={titles} occasion={data.occasion} />
                <CustomizationPanel suffix={mapTab} data={data} update={update} showFullSkyOptions={mapTab === "fullsky"} />
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            <Tier1Panel suffix={data.mapType || "zenith"} data={data} update={update} titles={titles} occasion={data.occasion} />
            <CustomizationPanel suffix={data.mapType || "zenith"} data={data} update={update} showFullSkyOptions={data.mapType === "fullsky"} />
          </div>
        )}

{/* Error */}
        {error && (
          <p style={{
            fontSize: "13px", color: "#F87171",
            padding: "10px 14px", background: "rgba(248,113,113,0.08)",
            borderRadius: "8px", border: "1px solid rgba(248,113,113,0.2)", margin: 0,
          }}>{error}</p>
        )}

        {/* ── Generate button ──────────────────────────── */}
        <div style={{ display: "flex", gap: "12px", marginTop: "4px" }}>
          <button onClick={onBack}
            style={{
              flex: "0 0 auto", padding: "16px 24px",
              background: "transparent", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "12px", color: "rgba(255,255,255,0.6)", fontSize: "15px",
              cursor: "pointer", transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; e.currentTarget.style.color = "white"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
          >← Back</button>
          <motion.button
            onClick={() => canProceed && handleGenerate()}
            disabled={!canProceed || generating}
            whileHover={canProceed && !generating ? { scale: 1.02 } : {}}
            whileTap={canProceed && !generating ? { scale: 0.98 } : {}}
            style={{
              flex: 1, padding: "16px", border: "none", borderRadius: "12px",
              background: !canProceed || generating
                ? "rgba(255,255,255,0.08)"
                : "rgba(200,169,110,0.15)",
              color: !canProceed || generating
                ? "rgba(255,255,255,0.25)"
                : "#C8A96E",
              outline: canProceed && !generating ? "1px solid rgba(200,169,110,0.4)" : "none",
              fontSize: "16px", fontWeight: 700,
              cursor: !canProceed || generating ? "not-allowed" : "pointer",
              transition: "all 0.3s",
            }}
          >
            {generating ? "Generating..." : generated ? "↺ Regenerate" : "✦ Generate my map"}
          </motion.button>
        </div>

        {/* ── Preview — shown after generate ───────────── */}
        <AnimatePresence>
          {generated && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5 }}
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <p style={{
                fontSize: "12px", fontWeight: 700,
                color: "rgba(138,175,212,0.7)", letterSpacing: "1.5px",
                textTransform: "uppercase", margin: 0,
              }}>
                Your poster preview
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {/* Poster 1 — always shown */}
                <div style={{
                  position: "relative", borderRadius: "12px", overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.08)", background: "#0C1624",
                  aspectRatio: "3/4",
                }}>
                  <img
                    src={
                      data.mapType === "fullsky"
                        ? (previewImages["fullsky"] ? `data:image/png;base64,${previewImages["fullsky"]}` : "/poster-sample.png")
                        : (previewImages["zenith"]  ? `data:image/png;base64,${previewImages["zenith"]}`  : "/poster-sample.png")
                    }
                    alt="preview"
                    style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  <div style={{
                    position: "absolute", inset: 0, display: "flex",
                    alignItems: "center", justifyContent: "center", pointerEvents: "none",
                  }}>
                    <span style={{
                      transform: "rotate(-30deg)", fontSize: "11px", fontWeight: 700,
                      color: "rgba(255,255,255,0.18)", letterSpacing: "4px",
                      textTransform: "uppercase", whiteSpace: "nowrap",
                    }}>PREVIEW</span>
                  </div>
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    padding: "6px", background: "rgba(8,14,26,0.75)",
                    fontSize: "10px", fontWeight: 600, color: "rgba(200,169,110,0.8)",
                    textAlign: "center", letterSpacing: "1px", textTransform: "uppercase",
                  }}>
                    {data.mapType === "fullsky" ? "All Stars" : "Your Sky"}
                  </div>
                </div>

                {/* Poster 2 — shown for both, placeholder otherwise */}
                {data.mapType === "both" ? (
                  <div style={{
                    position: "relative", borderRadius: "12px", overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.08)", background: "#0C1624",
                    aspectRatio: "3/4",
                  }}>
                    <img
                      src={previewImages["fullsky"] ? `data:image/png;base64,${previewImages["fullsky"]}` : "/poster-sample.png"}
                      alt="All Stars" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    <div style={{
                      position: "absolute", inset: 0, display: "flex",
                      alignItems: "center", justifyContent: "center", pointerEvents: "none",
                    }}>
                      <span style={{
                        transform: "rotate(-30deg)", fontSize: "11px", fontWeight: 700,
                        color: "rgba(255,255,255,0.18)", letterSpacing: "4px",
                        textTransform: "uppercase", whiteSpace: "nowrap",
                      }}>PREVIEW</span>
                    </div>
                    <div style={{
                      position: "absolute", bottom: 0, left: 0, right: 0,
                      padding: "6px", background: "rgba(8,14,26,0.75)",
                      fontSize: "10px", fontWeight: 600, color: "rgba(200,169,110,0.8)",
                      textAlign: "center", letterSpacing: "1px", textTransform: "uppercase",
                    }}>All Stars</div>
                  </div>
                ) : (
                  <div style={{
                    borderRadius: "12px", aspectRatio: "3/4",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px dashed rgba(255,255,255,0.06)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <p style={{ fontSize: "12px", color: "rgba(138,175,212,0.25)", textAlign: "center", padding: "16px", lineHeight: 1.6 }}>
                      Select Both Posters for a second map
                    </p>
                  </div>
                )}
              </div>

              <p style={{
                fontSize: "12px", color: "rgba(138,175,212,0.35)",
                textAlign: "center", margin: 0,
              }}>
                Watermark removed after purchase · Full resolution PNG + PDF
              </p>

              {/* Generated titles — shown per map */}
              {(data.mapType === "both" ? ["zenith", "fullsky"] : [data.mapType || "zenith"]).map(mt => {
                const title   = generatedTitles[mt];
                const wishing = generatedWishing[mt];
                const label   = mt === "zenith" ? "Your Sky" : "All Stars";
                const loading = regenLoading[mt];
                if (!title && !wishing) return null;
                return (
                  <div key={mt} style={{
                    padding: "16px 18px", borderRadius: "12px",
                    background: "rgba(200,169,110,0.05)",
                    border: "1px solid rgba(200,169,110,0.15)",
                  }}>
                    {data.mapType === "both" && (
                      <p style={{ fontSize: "11px", fontWeight: 700, color: "rgba(138,175,212,0.5)",
                        letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 10px" }}>
                        {label}
                      </p>
                    )}
                    {title && (
                      <p style={{
                        fontFamily: "var(--font-playfair), Georgia, serif",
                        fontSize: "16px", color: "#C8A96E", margin: "0 0 6px", lineHeight: 1.4,
                      }}>
                        {title}
                      </p>
                    )}
                    {wishing && (
                      <p style={{ fontSize: "14px", color: "rgba(138,175,212,0.6)", margin: "0 0 12px", fontStyle: "italic" }}>
                        {wishing}
                      </p>
                    )}
                    <button
                      onClick={() => handleRegenPreview(mt as "zenith" | "fullsky")}
                      disabled={loading}
                      style={{
                        background: "none", border: "1px solid rgba(200,169,110,0.25)",
                        borderRadius: "8px", padding: "6px 14px",
                        color: loading ? "rgba(200,169,110,0.3)" : "rgba(200,169,110,0.7)",
                        fontSize: "12px", cursor: loading ? "not-allowed" : "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      {loading ? "Regenerating..." : "↺ Regenerate preview"}
                    </button>
                  </div>
                );
              })}

              {/* Proceed to payment */}
              <motion.button
                onClick={onNext}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: "100%", padding: "17px", border: "none",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #C8A96E 0%, #E0C080 100%)",
                  color: "#080E1A", fontSize: "16px", fontWeight: 700,
                  cursor: "pointer", transition: "all 0.3s",
                  boxShadow: "0 0 32px rgba(200,169,110,0.25)",
                }}
              >
                Proceed to payment →
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}
"use client";

import { useState, useEffect } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";

export type MapFormData = {
  // Step 1
  city: string;
  lat: number | null;
  lon: number | null;
  date: string;
  hour: number;
  minute: number;
  ampm: "AM" | "PM";
  occasion: string;
  customOccasion: string;
  name: string;
  // Step 2 — Tier 1
  mapType: "zenith" | "fullsky" | "both";
  theme: string;
  titleOption: string;
  customTitle: string;
  wishingText: string;
  // Step 2 — per-map customization (suffix = zenith | fullsky | both)
  [key: string]: any;
};

const INITIAL: MapFormData = {
  city: "",
  lat: null,
  lon: null,
  date: "",
  hour: 12,
  minute: 0,
  ampm: "PM",
  occasion: "Birthday",
  customOccasion: "",
  name: "",
  mapType: "both",
  theme: "Dark Navy",
  titleOption: "AI",
  customTitle: "",
  wishingText: "",
};

const STEPS = ["Your moment", "Your style", "Preview & pay"];

export default function CustomizeFlow() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<MapFormData>(INITIAL);

  const update = (fields: Partial<MapFormData>) =>
    setData(d => ({ ...d, ...fields }));

  // If returning from Razorpay redirect, jump straight to Step 3
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("rzp_order_id") || params.get("rzp_payment_id")) {
      setStep(2);
    }
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at top, #1B2D4F 0%, #080E1A 60%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "80px 24px 48px",
    }}>

      {/* Progress bar — matches content width */}
      <div style={{ width: "100%", maxWidth: step === 1 ? "900px" : "560px", marginBottom: "48px", transition: "max-width 0.4s ease" }}>
        {/* Step labels */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
          {STEPS.map((label, i) => (
            <span key={i} style={{
              fontSize: "12px",
              fontWeight: i === step ? 700 : 400,
              color: i === step ? "#C8A96E" : i < step ? "rgba(200,169,110,0.5)" : "rgba(138,175,212,0.35)",
              letterSpacing: "0.3px",
              transition: "color 0.3s",
            }}>
              {label}
            </span>
          ))}
        </div>
        {/* Track */}
        <div style={{
          height: "2px",
          background: "rgba(255,255,255,0.08)",
          borderRadius: "2px",
          overflow: "hidden",
        }}>
          <div style={{
            height: "100%",
            width: `${((step + 1) / STEPS.length) * 100}%`,
            background: "linear-gradient(90deg, #C8A96E, #E0C080)",
            borderRadius: "2px",
            transition: "width 0.4s ease",
          }} />
        </div>
      </div>

      {/* Step content — wider on step 2 for preview panel */}
      <div style={{ width: "100%", maxWidth: step === 1 ? "900px" : "560px", transition: "max-width 0.4s ease" }}>
        {step === 0 && (
          <Step1
            data={data}
            update={update}
            onNext={() => setStep(1)}
          />
        )}
        {step === 1 && (
          <Step2
            data={data}
            update={update}
            onBack={() => setStep(0)}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <Step3
            data={data}
            update={update}
            onBack={() => setStep(1)}
          />
        )}
      </div>

    </div>
  );
}

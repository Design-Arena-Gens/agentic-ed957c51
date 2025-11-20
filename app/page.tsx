"use client";
import React, { useEffect, useMemo, useState } from "react";
import type { GeneratedAsset, MotionAsset, StrategyPlan } from "@/src/types";
import LottiePlayer from "@/components/LottiePlayer";

type Stage = "idle" | "planned" | "visuals" | "motion" | "packaged";

export default function HomePage() {
  const [niche, setNiche] = useState("Tech Tutorials");
  const [theme, setTheme] = useState("Modern Gradient");
  const [colors, setColors] = useState(["#0ea5e9", "#7c3aed", "#22d3ee"]);
  const [goal, setGoal] = useState("Increase engagement");

  const [stage, setStage] = useState<Stage>("idle");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<StrategyPlan | null>(null);
  const [assets, setAssets] = useState<GeneratedAsset[]>([]);
  const [motion, setMotion] = useState<MotionAsset | null>(null);
  const [zipUrl, setZipUrl] = useState<string | null>(null);
  const [lottieDataUrl, setLottieDataUrl] = useState<string | null>(null);

  const canGenerate = useMemo(() => !!plan, [plan]);

  async function doPlan() {
    setLoading(true);
    setZipUrl(null);
    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche, theme, colors, goal })
      });
      const data = await res.json();
      setPlan(data.plan);
      setStage("planned");
    } finally {
      setLoading(false);
    }
  }

  async function doDesign() {
    if (!plan) return;
    setLoading(true);
    setZipUrl(null);
    try {
      const res = await fetch("/api/design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan })
      });
      const data = await res.json();
      setAssets(data.assets);
      setStage("visuals");
    } finally {
      setLoading(false);
    }
  }

  async function doMotion() {
    if (!plan) return;
    setLoading(true);
    setZipUrl(null);
    try {
      const res = await fetch("/api/motion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan })
      });
      const data = await res.json();
      setMotion(data.motion);
      setStage("motion");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!motion) {
      setLottieDataUrl(null);
      return;
    }
    if (typeof window === "undefined") return;
    const jsonStr = JSON.stringify(motion.lottieJson);
    const base64 = window.btoa(unescape(encodeURIComponent(jsonStr)));
    setLottieDataUrl(`data:application/json;base64,${base64}`);
  }, [motion]);

  async function doPublish() {
    if (!plan) return;
    setLoading(true);
    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, visuals: assets, motion })
      });
      const data = await res.json();
      const blob = base64ToBlob(data.zipBase64, "application/zip");
      const url = URL.createObjectURL(blob);
      setZipUrl(url);
      setStage("packaged");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>Design Arena Automation</h1>
      <p style={{ marginTop: 6, color: "var(--muted)" }}>Automated AI-style design pipeline with minimal input.</p>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="row">
          <div>
            <div className="label">Niche / Theme</div>
            <input className="input" value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="e.g., Tech Tutorials" />
          </div>
          <div>
            <div className="label">Aesthetic Style</div>
            <input className="input" value={theme} onChange={(e) => setTheme(e.target.value)} placeholder="e.g., Modern Gradient" />
          </div>
        </div>
        <div className="row" style={{ marginTop: 12 }}>
          <div>
            <div className="label">Primary Color</div>
            <input className="input" type="color" value={colors[0]} onChange={(e) => setColors([e.target.value, colors[1], colors[2]])} />
          </div>
          <div>
            <div className="label">Secondary Color</div>
            <input className="input" type="color" value={colors[1]} onChange={(e) => setColors([colors[0], e.target.value, colors[2]])} />
          </div>
          <div>
            <div className="label">Accent Color</div>
            <input className="input" type="color" value={colors[2]} onChange={(e) => setColors([colors[0], colors[1], e.target.value])} />
          </div>
        </div>
        <div className="row" style={{ marginTop: 12 }}>
          <div>
            <div className="label">Project Goal</div>
            <input className="input" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="e.g., Increase engagement" />
          </div>
        </div>
        <div className="row" style={{ marginTop: 16 }}>
          <button className="btn" onClick={doPlan} disabled={loading}>
            {loading && stage === "idle" ? "Planning..." : "Generate Strategy Plan"}
          </button>
          <span className="pill">Stage: {stage}</span>
        </div>
      </div>

      {plan && (
        <div className="card" style={{ marginTop: 16 }}>
          <div className="row" style={{ alignItems: "flex-start" }}>
            <div style={{ flex: 2 }}>
              <h3 style={{ marginTop: 0 }}>Plan</h3>
              <p style={{ marginTop: 6, color: "var(--muted)" }}>{plan.summary}</p>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                {plan.moodboard.colors.map((c) => (
                  <div key={c} style={{ width: 28, height: 28, borderRadius: 8, background: c, border: "1px solid #00000030" }} title={c} />
                ))}
              </div>
              <div style={{ marginTop: 8, color: "var(--muted)", fontSize: 13 }}>
                <strong>Typography:</strong> {plan.moodboard.typography.join(", ")} ? <strong>Layouts:</strong> {plan.moodboard.layout_styles.join(", ")}
              </div>
            </div>
            <div style={{ flex: 1, textAlign: "right" }}>
              <button className="btn secondary" onClick={doDesign} disabled={loading || !canGenerate} style={{ marginRight: 8 }}>
                {loading && stage === "planned" ? "Designing..." : "Generate Visuals"}
              </button>
              <button className="btn secondary" onClick={doMotion} disabled={loading || !canGenerate}>
                {loading && (stage === "visuals" || stage === "planned") ? "Animating..." : "Generate Motion"}
              </button>
            </div>
          </div>
        </div>
      )}

      {assets.length > 0 && (
        <div className="card" style={{ marginTop: 16 }}>
          <h3 style={{ marginTop: 0 }}>Visual Assets</h3>
          <div className="grid" style={{ marginTop: 12 }}>
            {assets.map((a) => (
              <div key={a.id} className="asset">
                <img src={a.dataUrl} alt={a.filename} style={{ width: "100%", display: "block" }} />
                <div style={{ padding: 10, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{a.design_type}</div>
                    <div style={{ color: "var(--muted)", fontSize: 12 }}>{a.width}x{a.height}</div>
                  </div>
                  <a className="btn" href={a.dataUrl} download={a.filename}>Download</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {motion && (
        <div className="card" style={{ marginTop: 16 }}>
          <h3 style={{ marginTop: 0 }}>Motion Preview</h3>
          <div className="grid" style={{ marginTop: 12 }}>
            <div className="asset">
              <LottiePlayer json={motion.lottieJson} />
              <div style={{ padding: 10, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>Lottie</div>
                  <div style={{ color: "var(--muted)", fontSize: 12 }}>{motion.filename}</div>
                </div>
                <a className="btn" href={lottieDataUrl ?? "#"} download={motion.filename} onClick={(e) => { if (!lottieDataUrl) e.preventDefault(); }}>
                  Download
                </a>
              </div>
            </div>
          </div>
          <div className="row" style={{ marginTop: 16 }}>
            <button className="btn" onClick={doPublish} disabled={loading}>
              {loading && stage === "motion" ? "Packaging..." : "Package & Download All"}
            </button>
            {zipUrl && (
              <a className="btn secondary" href={zipUrl} download="design_arena_package.zip">Download ZIP</a>
            )}
          </div>
        </div>
      )}

      <div className="footer">
        Tip: Press <span className="kbd">G</span> to re-run the whole pipeline quickly.
      </div>
    </div>
  );
}

function base64ToBlob(base64: string, mime: string) {
  const byteChars = atob(base64);
  const byteNumbers = new Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) {
    byteNumbers[i] = byteChars.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mime });
}

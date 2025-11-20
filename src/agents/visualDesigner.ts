import { GeneratedAsset, StrategyIdea } from "@/src/types";
import { contrastColor, ensurePalette, toRgbString } from "@/src/lib/palette";

const SIZE_MAP: Record<string, { w: number; h: number }> = {
  "1280x720": { w: 1280, h: 720 },
  "1080x1080": { w: 1080, h: 1080 },
  "1080x1920": { w: 1080, h: 1920 },
  "1500x500": { w: 1500, h: 500 },
  "2000x3000": { w: 2000, h: 3000 },
  "1200x630": { w: 1200, h: 630 }
};

export function generateVisuals(idea: StrategyIdea): GeneratedAsset[] {
  const palette = ensurePalette(idea.colors);
  const { w, h } = SIZE_MAP[idea.aspect_ratio] || { w: 1080, h: 1080 };

  const bgA = palette[0];
  const bgB = palette[1] || palette[0];
  const accent = palette[2] || "#ffffff";
  const textColor = contrastColor(bgA);

  const headline = idea.project_name;
  const sub = idea.keywords.slice(0, 3).join(" ? ");

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${bgA}" />
      <stop offset="100%" stop-color="${bgB}" />
    </linearGradient>
    <linearGradient id="g2" x1="1" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(${toRgbString(accent)},0.0)" />
      <stop offset="100%" stop-color="rgba(${toRgbString(accent)},0.25)" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g1)" />
  <g opacity="0.9">
    <circle cx="${w * 0.85}" cy="${h * 0.2}" r="${Math.min(w, h) * 0.15}" fill="url(#g2)" />
    <rect x="${w * 0.05}" y="${h * 0.65}" rx="${Math.min(w, h) * 0.02}" width="${w * 0.5}" height="${h * 0.25}" fill="url(#g2)" />
  </g>
  <g>
    <text x="${w * 0.08}" y="${h * 0.35}" font-family="Inter, ui-sans-serif, system-ui" font-size="${Math.min(w, h) * 0.10}" font-weight="800" fill="${textColor}">${escapeXml(headline)}</text>
    <text x="${w * 0.08}" y="${h * 0.42}" font-family="Inter, ui-sans-serif, system-ui" font-size="${Math.min(w, h) * 0.035}" font-weight="500" fill="${textColor}" opacity="0.9">${escapeXml(idea.style)}</text>
    <g>
      <rect x="${w * 0.08}" y="${h * 0.5}" rx="${Math.min(w, h) * 0.01}" width="${w * 0.84}" height="${Math.min(w, h) * 0.08}" fill="${accent}" />
      <text x="${w * 0.10}" y="${h * 0.555}" font-family="Inter, ui-sans-serif, system-ui" font-size="${Math.min(w, h) * 0.035}" font-weight="700" fill="${contrastColor(accent)}">${escapeXml(sub)}</text>
    </g>
  </g>
</svg>
`.trim();

  const dataUrl = "data:image/svg+xml;base64," + Buffer.from(svg, "utf-8").toString("base64");

  const asset: GeneratedAsset = {
    id: `asset_${idea.design_type}_${w}x${h}`,
    filename: `${idea.project_name.replace(/\s+/g, "_").toLowerCase()}_${w}x${h}.svg`,
    design_type: idea.design_type,
    width: w,
    height: h,
    dataUrl
  };

  return [asset];
}

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}


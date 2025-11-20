import { MotionAsset, StrategyIdea } from "@/src/types";
import { ensurePalette } from "@/src/lib/palette";

export function generateMotion(idea: StrategyIdea): MotionAsset {
  const palette = ensurePalette(idea.colors);
  const bg = palette[0];
  const accent = palette[2] || "#ffffff";
  const text = "#ffffff";
  const name = idea.project_name.replace(/\s+/g, "_").toLowerCase();

  // Minimal Lottie JSON: animated rectangle sweep and scaling badge
  const lottie = {
    v: "5.10.0",
    fr: 30,
    ip: 0,
    op: 120,
    w: 1080,
    h: 1080,
    nm: `${idea.project_name} Motion`,
    ddd: 0,
    assets: [],
    layers: [
      // Background
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: "Background",
        sr: 1,
        ks: { o: { a: 0, k: 100 }, r: { a: 0, k: 0 }, p: { a: 0, k: [540, 540, 0] }, a: { a: 0, k: [0, 0, 0] }, s: { a: 0, k: [100, 100, 100] } },
        shapes: [
          {
            ty: "rc",
            d: 1,
            s: { a: 0, k: [1080, 1080] },
            p: { a: 0, k: [0, 0] },
            r: { a: 0, k: 0 }
          },
          {
            ty: "fl",
            c: { a: 0, k: hexToLottieColor(bg) },
            o: { a: 0, k: 100 }
          }
        ],
        ip: 0,
        op: 120,
        st: 0,
        bm: 0
      },
      // Sweep band
      {
        ddd: 0,
        ind: 2,
        ty: 4,
        nm: "Sweep",
        sr: 1,
        ks: {
          o: { a: 0, k: 90 },
          r: { a: 0, k: -20 },
          p: { a: 1, k: [{ t: 0, s: [-300, 800, 0] }, { t: 120, s: [1380, 200, 0] }] },
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 0, k: [100, 100, 100] }
        },
        shapes: [
          {
            ty: "rc",
            d: 1,
            s: { a: 0, k: [800, 260] },
            p: { a: 0, k: [0, 0] },
            r: { a: 0, k: 30 }
          },
          {
            ty: "fl",
            c: { a: 0, k: hexToLottieColor(accent) },
            o: { a: 0, k: 100 }
          }
        ],
        ip: 0,
        op: 120,
        st: 0,
        bm: 0
      },
      // Title (non-animated static for simplicity)
      {
        ddd: 0,
        ind: 3,
        ty: 5,
        nm: "Title",
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [540, 420, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 0, k: [100, 100, 100] }
        },
        t: {
          d: {
            k: [
              {
                s: {
                  s: 72,
                  f: "Inter",
                  t: idea.project_name,
                  j: 0,
                  tr: 0,
                  lh: 86,
                  ls: 0,
                  fc: hexToLottieColorArray(text)
                },
                t: 0
              }
            ]
          },
          p: {},
          m: { a: 0, k: 0 }
        },
        ip: 0,
        op: 120,
        st: 0,
        bm: 0
      }
    ]
  };

  return {
    id: `motion_${name}`,
    filename: `${name}.lottie.json`,
    lottieJson: lottie
  };
}

function hexToLottieColor(hex: string) {
  const [r, g, b] = hexToRgb(hex);
  return [r / 255, g / 255, b / 255, 1];
}
function hexToLottieColorArray(hex: string) {
  const [r, g, b] = hexToRgb(hex);
  return [r / 255, g / 255, b / 255];
}
function hexToRgb(hex: string): [number, number, number] {
  const c = hex.replace("#", "");
  const n = c.length === 3 ? parseInt(c.split("").map(x => x + x).join(""), 16) : parseInt(c, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}


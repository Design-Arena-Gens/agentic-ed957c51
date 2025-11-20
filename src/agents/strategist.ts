import { StrategyIdea, StrategyPlan, UserInput } from "@/src/types";

const STYLE_LIBRARY = [
  "Bold minimalism",
  "Neon cyberpunk",
  "Editorial elegance",
  "Retro-futuristic",
  "Playful Memphis",
  "High-contrast typography"
];

const LAYOUT_STYLES = [
  "Center headline + badge",
  "Top-left headline + diagonal band",
  "Rule-of-thirds focal point",
  "Split layout (image/text)",
  "Grid-based modular blocks"
];

const TYPOGRAPHY_STACKS = [
  "Inter / system",
  "Poppins / system",
  "Montserrat / system",
  "Bebas Neue / system",
  "DM Sans / system",
  "Oswald / system"
];

const DESIGN_TYPES: Array<{ type: StrategyIdea["design_type"]; size: string }> = [
  { type: "thumbnail", size: "1280x720" },
  { type: "instagram_post", size: "1080x1080" },
  { type: "story", size: "1080x1920" },
  { type: "banner", size: "1500x500" },
  { type: "poster", size: "2000x3000" },
  { type: "cover", size: "1200x630" }
];

function pick<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  const selected: T[] = [];
  while (selected.length < n && copy.length) {
    const idx = Math.floor(Math.random() * copy.length);
    selected.push(copy.splice(idx, 1)[0]);
  }
  return selected;
}

export function generateStrategy(input: UserInput): StrategyPlan {
  const paletteName = `${input.theme} Core`;

  const ideas: StrategyIdea[] = DESIGN_TYPES.map(({ type, size }) => {
    return {
      project_name: `${capitalize(input.niche)} ${capitalize(type)}`,
      design_type: type,
      theme: input.theme,
      colors: input.colors,
      style: pick(STYLE_LIBRARY, 1)[0],
      keywords: [
        input.niche,
        input.theme,
        input.goal,
        ...pick(["modern", "clean", "bold", "gradient", "dynamic", "organic"], 3)
      ],
      aspect_ratio: size
    };
  });

  const plan: StrategyPlan = {
    summary: `Automated design plan for ${input.niche} targeting "${input.goal}" with ${input.theme} aesthetics.`,
    moodboard: {
      palette_name: paletteName,
      colors: input.colors,
      typography: pick(TYPOGRAPHY_STACKS, 2),
      layout_styles: pick(LAYOUT_STYLES, 3)
    },
    daily_ideas: ideas
  };

  return plan;
}

function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}


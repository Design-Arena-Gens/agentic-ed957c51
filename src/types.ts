export type UserInput = {
  niche: string;
  theme: string;
  colors: string[]; // hex colors
  goal: string;
};

export type StrategyIdea = {
  project_name: string;
  design_type: "thumbnail" | "instagram_post" | "banner" | "poster" | "story" | "cover";
  theme: string;
  colors: string[];
  style: string;
  keywords: string[];
  aspect_ratio: string; // e.g. "1080x1080"
};

export type StrategyPlan = {
  summary: string;
  moodboard: {
    palette_name: string;
    colors: string[];
    typography: string[];
    layout_styles: string[];
  };
  daily_ideas: StrategyIdea[];
};

export type GeneratedAsset = {
  id: string;
  filename: string;
  design_type: StrategyIdea["design_type"];
  width: number;
  height: number;
  dataUrl: string; // usually data:image/svg+xml;base64,...
};

export type MotionAsset = {
  id: string;
  filename: string;
  lottieJson: any;
};


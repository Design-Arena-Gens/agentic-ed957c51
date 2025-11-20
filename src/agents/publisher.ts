import JSZip from "jszip";
import { GeneratedAsset, MotionAsset, StrategyPlan } from "@/src/types";

export async function packageProject(plan: StrategyPlan, visuals: GeneratedAsset[], motion: MotionAsset | null) {
  const zip = new JSZip();
  const folder = zip.folder(safe(plan.summary).slice(0, 48) || "project")!;

  folder.file("README.txt", [
    `Design Arena - Automated Package`,
    ``,
    `Summary: ${plan.summary}`,
    ``,
    `Palette: ${plan.moodboard.colors.join(", ")}`,
    `Typography: ${plan.moodboard.typography.join(", ")}`,
    `Layouts: ${plan.moodboard.layout_styles.join(", ")}`,
    ``,
    `Daily ideas (${plan.daily_ideas.length}):`,
    ...plan.daily_ideas.map((i, idx) => ` ${idx + 1}. ${i.project_name} [${i.design_type}] ${i.aspect_ratio} | ${i.style}`)
  ].join("\n"));

  // Save visuals
  const assetFolder = folder.folder("visuals")!;
  for (const a of visuals) {
    const { mime, data } = parseDataUrl(a.dataUrl);
    const ext = mime.includes("svg") ? "svg" : mime.includes("png") ? "png" : "jpg";
    assetFolder.file(a.filename || `asset_${a.width}x${a.height}.${ext}`, data, { base64: true });
  }

  // Save motion
  if (motion) {
    folder.folder("motion")!.file(motion.filename, JSON.stringify(motion.lottieJson, null, 2));
  }

  // Add content calendar (simple JSON)
  const calendar = plan.daily_ideas.map((i, idx) => ({
    day: idx + 1,
    post_title: i.project_name,
    platform: i.design_type === "story" ? "Instagram Stories" : i.design_type === "thumbnail" ? "YouTube" : "Generic",
    tags: i.keywords.slice(0, 8),
    color_hint: i.colors[0],
    style: i.style
  }));
  folder.file("content_calendar.json", JSON.stringify(calendar, null, 2));

  const content = await zip.generateAsync({ type: "base64" });
  return content;
}

function parseDataUrl(url: string): { mime: string; data: string } {
  const m = url.match(/^data:(.*?);base64,(.*)$/);
  if (!m) return { mime: "image/svg+xml", data: "" };
  return { mime: m[1], data: m[2] };
}

function safe(s: string) {
  return s.replace(/[^\w\-]+/g, "_");
}


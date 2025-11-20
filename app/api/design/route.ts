import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { StrategyPlan } from "@/src/types";
import { generateVisuals } from "@/src/agents/visualDesigner";

const PlanSchema = z.object({
  plan: z.object({
    summary: z.string(),
    moodboard: z.object({
      palette_name: z.string(),
      colors: z.array(z.string()),
      typography: z.array(z.string()),
      layout_styles: z.array(z.string())
    }),
    daily_ideas: z.array(
      z.object({
        project_name: z.string(),
        design_type: z.enum(["thumbnail", "instagram_post", "banner", "poster", "story", "cover"]),
        theme: z.string(),
        colors: z.array(z.string()),
        style: z.string(),
        keywords: z.array(z.string()),
        aspect_ratio: z.string()
      })
    )
  })
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = PlanSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid plan", issues: parsed.error.issues }, { status: 400 });
  }
  const plan = parsed.data.plan as StrategyPlan;

  const assets = plan.daily_ideas.flatMap((idea) => generateVisuals(idea));
  return NextResponse.json({ assets });
}


import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { packageProject } from "@/src/agents/publisher";
import { GeneratedAsset, MotionAsset, StrategyPlan } from "@/src/types";

const PublishSchema = z.object({
  plan: z.any(),
  visuals: z.array(
    z.object({
      id: z.string(),
      filename: z.string(),
      design_type: z.string(),
      width: z.number(),
      height: z.number(),
      dataUrl: z.string()
    })
  ),
  motion: z.object({ id: z.string(), filename: z.string(), lottieJson: z.any() }).nullable()
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = PublishSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", issues: parsed.error.issues }, { status: 400 });
  }
  const plan = parsed.data.plan as StrategyPlan;
  const visuals = parsed.data.visuals as GeneratedAsset[];
  const motion = parsed.data.motion as MotionAsset | null;

  const base64Zip = await packageProject(plan, visuals, motion);
  return NextResponse.json({ zipBase64: base64Zip });
}


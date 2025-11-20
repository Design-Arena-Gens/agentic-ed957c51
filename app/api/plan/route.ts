import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateStrategy } from "@/src/agents/strategist";
import { UserInput } from "@/src/types";

const InputSchema = z.object({
  niche: z.string().min(2),
  theme: z.string().min(2),
  colors: z.array(z.string().regex(/^#?[0-9a-fA-F]{3,6}$/)).min(1),
  goal: z.string().min(2)
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = InputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }
  const input: UserInput = {
    niche: parsed.data.niche,
    theme: parsed.data.theme,
    colors: parsed.data.colors.map((c) => (c.startsWith("#") ? c : `#${c}`)),
    goal: parsed.data.goal
  };
  const plan = generateStrategy(input);
  return NextResponse.json({ plan });
}


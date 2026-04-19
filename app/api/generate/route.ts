import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { cookerSize, servings, preferences, prepTime } = await req.json();
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://api.deepseek.com/v1",
    });
    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are an expert slow cooker meal planner. Create set-it-and-forget-it dump-and-go recipes with layered ingredient order and precise timing. Use markdown with clear sections.`,
        },
        {
          role: "user",
          content: `Plan a slow cooker dump meal:\n- Slow cooker size: ${cookerSize}\n- Servings needed: ${servings}\n- Protein/vegetable preferences: ${preferences}\n- Prep time available: ${prepTime} minutes\n\nProvide:\n1. Complete ingredient list with measurements\n2. Layering order (what goes in first, second, etc.)\n3. Cooking time and temperature settings (LOW/HIGH)\n4. Serving suggestions\n5. Make-ahead prep tips\n6. Storage and leftovers`,
        },
      ],
      temperature: 0.7,
    });
    return NextResponse.json({ result: response.choices[0].message.content });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

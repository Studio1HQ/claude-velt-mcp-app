import { Anthropic } from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

// Point to MiniMax's API instead of Anthropic
const client = new Anthropic({
  apiKey:
    "APIKEY",
  baseURL: "https://api.minimax.io/anthropic",
});

export async function POST(req: Request) {
  try {
    const { prompt, systemPrompt, context } = await req.json();

    console.log("🤖 AI Request:", {
      prompt: prompt.substring(0, 100),
      hasContext: !!context,
    });

    const message = await client.messages.create({
      model: "MiniMax-M2.5",
      max_tokens: 2000,
      system:
        systemPrompt ||
        "You are a helpful AI assistant for a collaborative whiteboard app (like Mural). Help users organize, generate, and analyze their canvas content.",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Extract text from response
    const text = message.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("");

    // Get thinking content if available
    const thinking = message.content.find(
      (b) => b.type === "thinking",
    )?.thinking;

    console.log("✅ AI Response:", text.substring(0, 100));

    return NextResponse.json({
      response: text,
      thinking: thinking,
    });
  } catch (error: any) {
    console.error("❌ MiniMax API Error:", error);
    return NextResponse.json(
      { error: error?.message || "AI request failed" },
      { status: 500 },
    );
  }
}

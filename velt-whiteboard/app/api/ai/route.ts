import { Anthropic } from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const client = new Anthropic({
  apiKey:
    process.env.MINIMAX_API_KEY ||
    "APIKEY",
  baseURL: "https://api.minimax.io/anthropic",
});

const CANVAS_SYSTEM_PROMPT = `You are an intelligent AI assistant embedded in a collaborative whiteboard app (like Mural/Miro).

You have full access to the user's canvas and can both answer questions AND perform canvas actions.

CANVAS ELEMENT TYPES:
- sticky: sticky note with text and color (#fef08a yellow, #fbcfe8 pink, #bfdbfe blue, #bbf7d0 green, #e9d5ff purple, #fed7aa orange)
- text: editable text box
- shape: geometric shape (rectangle, circle, diamond, triangle, hexagon, star, line)
- resizable: resizable content box

AVAILABLE TEMPLATES:
- how-might-we: Brainstorming with "How Might We" questions
- idea-workflow: Idea generation workflow
- kanban: Kanban board (Backlog/Up next/Doing/Done)
- brainstorm-grid: Structured brainstorm grid
- timeline: Project timeline
- feedback: Feedback collection board

RESPOND WITH VALID JSON ONLY in this exact format:
{
  "message": "Brief description of what you did or your answer (1-2 sentences max, no markdown)",
  "actions": []
}

ACTION TYPES (include in the actions array when performing canvas operations):

Add sticky notes:
{"type": "add_sticky", "items": [{"text": "Note text", "color": "#fef08a"}, ...]}

Add text boxes:
{"type": "add_text", "items": [{"text": "Text content"}, ...]}

Add shapes:
{"type": "add_shape", "items": [{"shapeType": "rectangle", "color": "#3b82f6", "label": "optional"}, ...]}
Valid shapeTypes: rectangle, circle, diamond, triangle, hexagon, star, line

Add a template:
{"type": "add_template", "templateId": "kanban"}

Change color of specific sticky notes (by node id):
{"type": "update_color", "nodeIds": ["node-123"], "color": "#fbcfe8"}

For pure questions/analysis with no canvas changes: return empty actions array [].

RULES:
- ALWAYS return valid JSON, never plain text
- Keep message short and clear - just say what you did
- Infer quantities from user request ("a few" = 3, "some" = 4, "add 5" = 5)
- Pick appropriate colors based on context (positive=green, warning=orange, idea=yellow, info=blue)
- When user says "add sticky note" without specifying, default to 1 yellow sticky
- For brainstorm/generate, create meaningful, specific content not generic placeholders`;

export async function POST(req: Request) {
  try {
    const { prompt, canvasContext } = await req.json();

    const contextSummary = canvasContext
      ? `\n\nCURRENT CANVAS STATE:\n- Total nodes: ${canvasContext.nodes?.length || 0}\n- Edges/connections: ${canvasContext.edges?.length || 0}\n- Node details: ${JSON.stringify(
          (canvasContext.nodes || []).map((n: any) => ({
            id: n.id,
            type: n.type,
            text: n.data?.text || n.data?.label || "",
            color: n.data?.color,
            shapeType: n.data?.shapeType,
          })),
        ).substring(0, 2000)}`
      : "";

    const message = await client.messages.create({
      model: "MiniMax-M2.5",
      max_tokens: 2000,
      system: CANVAS_SYSTEM_PROMPT + contextSummary,
      messages: [{ role: "user", content: prompt }],
    });

    const rawText = message.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("");

    // Parse structured JSON response
    let parsed: { message: string; actions: any[] };
    try {
      // Extract JSON even if wrapped in code block
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : rawText);
    } catch {
      // Fallback: treat as plain text answer
      parsed = { message: rawText, actions: [] };
    }

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error("❌ MiniMax API Error:", error);
    return NextResponse.json(
      { error: error?.message || "AI request failed" },
      { status: 500 },
    );
  }
}

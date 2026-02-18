import { Node, Edge } from "@xyflow/react";
import { AICanvasResponse } from "./canvas-actions";

export interface StickyNoteContent {
  text: string;
  color: string;
}

export interface AIRequest {
  prompt: string;
  systemPrompt?: string;
  context?: any;
}

export interface AIResponse {
  response: string;
  thinking?: string;
  error?: string;
}

/**
 * Process a free-form canvas command - returns structured message + actions.
 * The API route handles the system prompt internally.
 */
export async function processCanvasCommand(
  prompt: string,
  nodes: Node[],
  edges: Edge[],
): Promise<AICanvasResponse> {
  try {
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        canvasContext: { nodes, edges },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        message: data.error || "AI request failed",
        actions: [],
        error: data.error,
      };
    }

    return {
      message: data.message || "",
      actions: data.actions || [],
    };
  } catch (error: any) {
    return { message: "", actions: [], error: error.message };
  }
}

/**
 * Organize sticky notes into categories on the canvas.
 * Returns { categories } with node id groups.
 */
export async function organizeStickyNotes(nodes: Node[]): Promise<{
  categories: { name: string; items: string[] }[];
}> {
  const stickyNotes = nodes
    .filter((n) => n.type === "sticky")
    .map((n) => ({ id: n.id, text: n.data.text || "Untitled" }));

  if (stickyNotes.length === 0) return { categories: [] };

  const result = await processCanvasCommand(
    `Organize these sticky notes into 3-5 logical categories. Reply with ONLY the message field and NO actions. Instead, fill the actions array with update_color actions for each category (use different colors per category), then structure the categories in your message text.\n\nSticky notes: ${JSON.stringify(stickyNotes)}`,
    nodes,
    [],
  );

  // Extract categories from message text as fallback - just return empty for positional remapping
  return { categories: [] };
}

/**
 * Summarize all canvas content.
 */
export async function summarizeCanvas(
  nodes: Node[],
  edges: Edge[],
): Promise<string> {
  const result = await processCanvasCommand(
    "Summarize all the content on this whiteboard canvas. Provide key themes, main ideas, and action items in your message.",
    nodes,
    edges,
  );
  return result.error ? `Error: ${result.error}` : result.message;
}

/**
 * Suggest next steps based on canvas.
 */
export async function suggestNextSteps(
  nodes: Node[],
  edges: Edge[],
): Promise<string> {
  const result = await processCanvasCommand(
    "Based on the current whiteboard content, suggest 5 concrete next steps. List them in your message.",
    nodes,
    edges,
  );
  return result.error ? `Error: ${result.error}` : result.message;
}

/**
 * Analyze sentiment of sticky notes.
 */
export async function groupBySentiment(
  nodes: Node[],
  edges: Edge[],
): Promise<string> {
  const stickyNotes = nodes
    .filter((n) => n.type === "sticky")
    .map((n) => ({ id: n.id, text: n.data.text || "" }));

  if (stickyNotes.length === 0) return "No sticky notes found to analyze.";

  const result = await processCanvasCommand(
    `Analyze the sentiment of these sticky notes and categorize them as Positive, Negative, Neutral, or Concerns. Report counts in your message and use update_color actions to color-code them (green=#bbf7d0 for positive, #fbcfe8 pink for negative, #bfdbfe blue for neutral, #fed7aa orange for concerns).\n\nNotes: ${JSON.stringify(stickyNotes)}`,
    nodes,
    edges,
  );
  return result.error ? `Error: ${result.error}` : result.message;
}

/**
 * Generate template info from existing canvas.
 */
export async function generateTemplateFromCanvas(
  nodes: Node[],
  edges: Edge[],
): Promise<string> {
  const result = await processCanvasCommand(
    "Look at this canvas structure and suggest a template name and description that best describes its layout and purpose. Put the name and description in your message.",
    nodes,
    edges,
  );
  return result.error ? `Error: ${result.error}` : result.message;
}

import { Node } from "@xyflow/react";

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
 * Call the MiniMax AI API
 */
export async function callAI(request: AIRequest): Promise<AIResponse> {
  try {
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "AI request failed");
    }

    return data;
  } catch (error: any) {
    console.error("AI Error:", error);
    return { response: "", error: error.message };
  }
}

/**
 * Generate brainstorm ideas based on a topic
 */
export async function generateBrainstormIdeas(
  topic: string,
): Promise<string[]> {
  const result = await callAI({
    prompt: `Generate 8 creative and diverse brainstorming ideas about: "${topic}"\n\nFormat: Return ONLY a JSON array of strings, each idea max 15 words.\nExample: ["Idea 1", "Idea 2", ...]`,
    systemPrompt:
      "You are a creative brainstorming assistant. Return only valid JSON arrays.",
  });

  if (result.error) {
    throw new Error(result.error);
  }

  try {
    // Parse JSON response
    const ideas = JSON.parse(result.response);
    return Array.isArray(ideas) ? ideas : [];
  } catch {
    // Fallback: split by newlines
    return result.response
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => line.replace(/^[-*•]\s*/, "").trim())
      .slice(0, 8);
  }
}

/**
 * Organize sticky notes into categories
 */
export async function organizeStickyNotes(nodes: Node[]): Promise<{
  categories: { name: string; items: string[] }[];
}> {
  const stickyNotes = nodes
    .filter((n) => n.type === "sticky")
    .map((n) => ({ id: n.id, text: n.data.text || "Untitled" }));

  if (stickyNotes.length === 0) {
    return { categories: [] };
  }

  const result = await callAI({
    prompt: `Analyze these sticky notes and group them into 3-5 logical categories:\n\n${JSON.stringify(stickyNotes, null, 2)}\n\nReturn ONLY a JSON object with this format:\n{\n  "categories": [\n    {"name": "Category Name", "items": ["note id 1", "note id 2"]}\n  ]\n}`,
    systemPrompt:
      "You are an organizational assistant. Return only valid JSON.",
  });

  if (result.error) {
    throw new Error(result.error);
  }

  try {
    const parsed = JSON.parse(result.response);
    return parsed;
  } catch {
    return { categories: [] };
  }
}

/**
 * Summarize canvas content
 */
export async function summarizeCanvas(nodes: Node[]): Promise<string> {
  const content = nodes.map((n) => ({
    type: n.type,
    text: n.data.text || n.data.label || "",
  }));

  const result = await callAI({
    prompt: `Summarize this whiteboard canvas content:\n\n${JSON.stringify(content, null, 2)}\n\nProvide:\n1. Key themes (2-3 bullet points)\n2. Main ideas (3-5 bullet points)\n3. Action items (if any)\n4. Overall summary (1 paragraph)`,
    systemPrompt:
      "You are a helpful assistant that creates concise, actionable summaries.",
  });

  return result.error || result.response;
}

/**
 * Suggest next steps based on canvas content
 */
export async function suggestNextSteps(nodes: Node[]): Promise<string[]> {
  const content = nodes.map((n) => ({
    type: n.type,
    text: n.data.text || n.data.label || "",
  }));

  const result = await callAI({
    prompt: `Based on this whiteboard content, suggest 5 concrete next steps:\n\n${JSON.stringify(content, null, 2)}\n\nReturn ONLY a JSON array of strings, each step max 20 words.\nExample: ["Step 1...", "Step 2...", ...]`,
    systemPrompt:
      "You are a strategic planning assistant. Return only valid JSON arrays.",
  });

  if (result.error) {
    throw new Error(result.error);
  }

  try {
    const steps = JSON.parse(result.response);
    return Array.isArray(steps) ? steps : [];
  } catch {
    return result.response
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => line.replace(/^[-*•]\s*/, "").trim())
      .slice(0, 5);
  }
}

/**
 * Auto-create a template based on existing canvas
 */
export async function generateTemplateFromCanvas(nodes: Node[]): Promise<{
  name: string;
  description: string;
}> {
  const content = nodes.map((n) => ({
    type: n.type,
    text: n.data.text || n.data.label || "",
    position: n.position,
  }));

  const result = await callAI({
    prompt: `Based on this canvas structure, create a template:\n\n${JSON.stringify(content, null, 2)}\n\nReturn ONLY a JSON object:\n{\n  "name": "Template Name (3-5 words)",\n  "description": "Brief description (1 sentence)"\n}`,
    systemPrompt:
      "You are a template creation assistant. Return only valid JSON.",
  });

  if (result.error) {
    throw new Error(result.error);
  }

  try {
    const template = JSON.parse(result.response);
    return template;
  } catch {
    return {
      name: "Custom Template",
      description: "Generated from current canvas",
    };
  }
}

/**
 * Group sticky notes by sentiment
 */
export async function groupBySentiment(nodes: Node[]): Promise<{
  positive: string[];
  negative: string[];
  neutral: string[];
  concerns: string[];
}> {
  const stickyNotes = nodes
    .filter((n) => n.type === "sticky")
    .map((n) => ({ id: n.id, text: n.data.text || "" }));

  if (stickyNotes.length === 0) {
    return { positive: [], negative: [], neutral: [], concerns: [] };
  }

  const result = await callAI({
    prompt: `Analyze sentiment of these notes and categorize:\n\n${JSON.stringify(stickyNotes, null, 2)}\n\nReturn ONLY a JSON object:\n{\n  "positive": ["id1", "id2"],\n  "negative": ["id3"],\n  "neutral": ["id4"],\n  "concerns": ["id5"]\n}`,
    systemPrompt:
      "You are a sentiment analysis assistant. Return only valid JSON.",
  });

  if (result.error) {
    throw new Error(result.error);
  }

  try {
    const sentiment = JSON.parse(result.response);
    return sentiment;
  } catch {
    return { positive: [], negative: [], neutral: [], concerns: [] };
  }
}

/**
 * Generate sticky notes based on a topic
 */
export async function generateStickyNotes(
  topic: string,
  count: number = 4,
): Promise<StickyNoteContent[]> {
  const result = await callAI({
    prompt: `Generate ${count} sticky notes about: "${topic}"

Return ONLY a JSON array of objects with this exact format:
[
  {"text": "Note content here", "color": "#fef08a"},
  {"text": "Note content here", "color": "#fbcfe8"}
]

Color options (choose the most appropriate for each note):
- Yellow: #fef08a (default for ideas)
- Pink: #fbcfe8 (for highlights)
- Blue: #bfdbfe (for information)
- Green: #bbf7d0 (for positive/agreements)
- Purple: #e9d5ff (for creative thoughts)
- Orange: #fed7aa (for action items)

Each text should be max 30 words and meaningful.`,
    systemPrompt:
      "You are a creative brainstorming assistant. Return only valid JSON arrays with text and color properties.",
  });

  if (result.error) {
    throw new Error(result.error);
  }

  try {
    const notes = JSON.parse(result.response);
    return Array.isArray(notes) ? notes : [];
  } catch {
    return [];
  }
}

/**
 * General question answering with canvas context
 */
export async function askQuestion(
  question: string,
  nodes: Node[],
): Promise<string> {
  const canvasContext = nodes.map((n) => ({
    type: n.type,
    text: n.data.text || n.data.label || "",
  }));

  const result = await callAI({
    prompt: question,
    systemPrompt: `You are a helpful AI assistant for a collaborative whiteboard. Current canvas has ${nodes.length} items. Canvas context: ${JSON.stringify(canvasContext).substring(0, 1000)}`,
    context: canvasContext,
  });

  return result.error || result.response;
}

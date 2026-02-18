import { Node } from "@xyflow/react";
import { TEMPLATES } from "@/lib/constants/templates";

export interface AddStickyAction {
  type: "add_sticky";
  items: { text: string; color: string }[];
}
export interface AddTextAction {
  type: "add_text";
  items: { text: string }[];
}
export interface AddShapeAction {
  type: "add_shape";
  items: { shapeType: string; color: string; label?: string }[];
}
export interface AddTemplateAction {
  type: "add_template";
  templateId: string;
}
export interface UpdateColorAction {
  type: "update_color";
  nodeIds: string[];
  color: string;
}

export type CanvasAction =
  | AddStickyAction
  | AddTextAction
  | AddShapeAction
  | AddTemplateAction
  | UpdateColorAction;

export interface AICanvasResponse {
  message: string;
  actions: CanvasAction[];
  error?: string;
}

/**
 * Build nodes from AI actions, positioned around an anchor point.
 */
export function buildNodesFromActions(
  actions: CanvasAction[],
  anchor: { x: number; y: number },
  getNextId: () => string,
): Node[] {
  const newNodes: Node[] = [];
  let offsetX = 0;
  let offsetY = 0;
  const COL_WIDTH = 220;
  const ROW_HEIGHT = 220;
  const COLS = 4;

  for (const action of actions) {
    if (action.type === "add_sticky") {
      action.items.forEach((item, i) => {
        const col = newNodes.length % COLS;
        const row = Math.floor(newNodes.length / COLS);
        newNodes.push({
          id: getNextId(),
          type: "sticky",
          position: {
            x: anchor.x + col * COL_WIDTH,
            y: anchor.y + row * ROW_HEIGHT,
          },
          data: { text: item.text, color: item.color || "#fef08a" },
          style: { width: 200, height: 200 },
        });
      });
    }

    if (action.type === "add_text") {
      action.items.forEach((item, i) => {
        const col = newNodes.length % COLS;
        const row = Math.floor(newNodes.length / COLS);
        newNodes.push({
          id: getNextId(),
          type: "text",
          position: {
            x: anchor.x + col * COL_WIDTH,
            y: anchor.y + row * ROW_HEIGHT,
          },
          data: { text: item.text || "" },
          style: { width: 200, height: 100 },
        });
      });
    }

    if (action.type === "add_shape") {
      action.items.forEach((item) => {
        const col = newNodes.length % COLS;
        const row = Math.floor(newNodes.length / COLS);
        newNodes.push({
          id: getNextId(),
          type: "shape",
          position: {
            x: anchor.x + col * 160,
            y: anchor.y + row * 160,
          },
          data: {
            shapeType: item.shapeType || "rectangle",
            color: item.color || "#3b82f6",
            label: item.label || "",
          },
          style: { width: 120, height: 120 },
        });
      });
    }

    if (action.type === "add_template") {
      const template = TEMPLATES.find((t) => t.id === action.templateId);
      if (template) {
        template.nodes.forEach((nodeTemplate) => {
          newNodes.push({
            ...nodeTemplate,
            id: getNextId(),
            position: {
              x: anchor.x + (nodeTemplate.position?.x || 0),
              y: anchor.y + (nodeTemplate.position?.y || 0),
            },
          } as Node);
        });
      }
    }
  }

  return newNodes;
}

/**
 * Apply update_color actions to existing nodes.
 */
export function applyColorUpdates(
  existingNodes: Node[],
  actions: CanvasAction[],
): Node[] | null {
  const colorActions = actions.filter(
    (a): a is UpdateColorAction => a.type === "update_color",
  );
  if (colorActions.length === 0) return null;

  const updatedNodes = existingNodes.map((node) => {
    for (const action of colorActions) {
      if (action.nodeIds.includes(node.id)) {
        return {
          ...node,
          data: { ...node.data, color: action.color },
        };
      }
    }
    return node;
  });

  return updatedNodes;
}

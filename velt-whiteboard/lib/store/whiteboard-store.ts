import { create } from "zustand";
import { User, DEFAULT_USER } from "@/lib/constants/users";
import { Node } from "@xyflow/react";

export type ShapeType =
  | "rectangle"
  | "circle"
  | "diamond"
  | "triangle"
  | "hexagon"
  | "star"
  | "line";
export type ToolType =
  | "sticky"
  | "text"
  | "shapes"
  | "templates"
  | "ai"
  | "draw"
  | null;

export interface TemplateType {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  nodes: Omit<Node, "id">[];
}

interface WhiteboardState {
  // User & Document
  currentUser: User;
  documentId: string;
  setCurrentUser: (user: User) => void;

  // Sidebars
  selectedTool: ToolType;
  setSelectedTool: (tool: ToolType) => void;
  isShapesPanelOpen: boolean;
  setShapesPanelOpen: (open: boolean) => void;
  isTemplatesPanelOpen: boolean;
  setTemplatesPanelOpen: (open: boolean) => void;

  // Shape selection for click-to-place
  selectedShape: { type: ShapeType; color: string } | null;
  setSelectedShape: (shape: { type: ShapeType; color: string } | null) => void;

  // Template selection
  selectedTemplate: TemplateType | null;
  setSelectedTemplate: (template: TemplateType | null) => void;

  // Node ID counter for unique IDs
  nodeIdCounter: number;
  getNextNodeId: () => string;
}

export const useWhiteboardStore = create<WhiteboardState>((set, get) => ({
  // User & Document
  currentUser: DEFAULT_USER,
  documentId: "whiteboard-doc-001",
  setCurrentUser: (user: User) => set({ currentUser: user }),

  // Sidebars
  selectedTool: null,
  setSelectedTool: (tool: ToolType) => {
    set({ selectedTool: tool });
    // Open shapes panel when shapes tool is selected
    if (tool === "shapes") {
      set({ isShapesPanelOpen: true });
    }
    // Open templates panel when templates tool is selected
    if (tool === "templates") {
      set({ isTemplatesPanelOpen: true });
    }
  },
  isShapesPanelOpen: false,
  setShapesPanelOpen: (open: boolean) => set({ isShapesPanelOpen: open }),
  isTemplatesPanelOpen: false,
  setTemplatesPanelOpen: (open: boolean) => set({ isTemplatesPanelOpen: open }),

  // Shape selection
  selectedShape: null,
  setSelectedShape: (shape: { type: ShapeType; color: string } | null) =>
    set({ selectedShape: shape }),

  // Template selection
  selectedTemplate: null,
  setSelectedTemplate: (template: TemplateType | null) =>
    set({ selectedTemplate: template }),

  // Node counter
  nodeIdCounter: 100,
  getNextNodeId: () => {
    const current = get().nodeIdCounter;
    set({ nodeIdCounter: current + 1 });
    return `node-${current}`;
  },
}));

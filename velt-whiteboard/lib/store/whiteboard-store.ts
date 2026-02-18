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
  | "select"
  | "sticky"
  | "text"
  | "shapes"
  | "templates"
  | "ai"
  | "draw"
  | null;

export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface TemplateType {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  nodes: Omit<Node, "id">[];
}

// Sticky note content from AI
export interface StickyNoteContent {
  text: string;
  color: string;
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
  isAIPanelOpen: boolean;
  setAIPanelOpen: (open: boolean) => void;

  // AI Chat
  aiMessages: AIMessage[];
  addAIMessage: (message: Omit<AIMessage, "id" | "timestamp">) => void;
  clearAIMessages: () => void;

  // Shape selection for click-to-place
  selectedShape: { type: ShapeType; color: string } | null;
  setSelectedShape: (shape: { type: ShapeType; color: string } | null) => void;

  // Template selection
  selectedTemplate: TemplateType | null;
  setSelectedTemplate: (template: TemplateType | null) => void;

  // Node ID counter for unique IDs
  nodeIdCounter: number;
  getNextNodeId: () => string;

  // Pending sticky notes from AI
  pendingStickyNotes: (StickyNoteContent & {
    position: { x: number; y: number };
  })[];
  addPendingStickyNotes: (
    notes: StickyNoteContent[],
    position: { x: number; y: number },
  ) => void;
  clearPendingStickyNotes: () => void;

  // Last click position on canvas for AI placement
  aiCanvasPosition: { x: number; y: number };
  setAICanvasPosition: (position: { x: number; y: number }) => void;
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
    // Open AI panel when AI tool is selected
    if (tool === "ai") {
      set({ isAIPanelOpen: true });
    }
  },
  isShapesPanelOpen: false,
  setShapesPanelOpen: (open: boolean) => set({ isShapesPanelOpen: open }),
  isTemplatesPanelOpen: false,
  setTemplatesPanelOpen: (open: boolean) => set({ isTemplatesPanelOpen: open }),
  isAIPanelOpen: false,
  setAIPanelOpen: (open: boolean) => set({ isAIPanelOpen: open }),

  // AI Chat
  aiMessages: [],
  addAIMessage: (message: Omit<AIMessage, "id" | "timestamp">) => {
    const newMessage: AIMessage = {
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };
    set((state) => ({ aiMessages: [...state.aiMessages, newMessage] }));
  },
  clearAIMessages: () => set({ aiMessages: [] }),

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

  // Pending sticky notes from AI
  pendingStickyNotes: [],
  addPendingStickyNotes: (
    notes: StickyNoteContent[],
    position: { x: number; y: number },
  ) => {
    set({ pendingStickyNotes: [...notes.map((n) => ({ ...n, position }))] });
  },
  clearPendingStickyNotes: () => set({ pendingStickyNotes: [] }),

  // Last click position on canvas for AI placement
  aiCanvasPosition: { x: 100, y: 100 },
  setAICanvasPosition: (position) => set({ aiCanvasPosition: position }),
}));

"use client";

import React from "react";
import ToolTab from "./ToolTab";
import {
  StickyNote,
  Type,
  Circle,
  Sparkles,
  Pencil,
  LayoutTemplate,
  MousePointer,
} from "lucide-react";
import { useWhiteboardStore, ToolType } from "@/lib/store/whiteboard-store";

const tools: Array<{ id: ToolType; label: string; Icon: any }> = [
  { id: "select", label: "Select", Icon: MousePointer },
  { id: "sticky", label: "Sticky Notes", Icon: StickyNote },
  { id: "text", label: "Text", Icon: Type },
  { id: "shapes", label: "Shapes", Icon: Circle },
  { id: "templates", label: "Templates", Icon: LayoutTemplate },
  { id: "ai", label: "AI Assistant", Icon: Sparkles },
  { id: "draw", label: "Draw/Pen", Icon: Pencil },
];

export function FloatingToolbar() {
  const {
    selectedTool,
    setSelectedTool,
    isShapesPanelOpen,
    setShapesPanelOpen,
    isTemplatesPanelOpen,
    setTemplatesPanelOpen,
    isAIPanelOpen,
    setAIPanelOpen,
    setSelectedShape,
    setSelectedTemplate,
  } = useWhiteboardStore();

  const handleToolClick = (toolId: ToolType) => {
    // Toggle tool if clicking the same tool again
    if (
      selectedTool === toolId &&
      toolId !== "shapes" &&
      toolId !== "templates" &&
      toolId !== "ai"
    ) {
      setSelectedTool(null);
      setSelectedShape(null);
      setSelectedTemplate(null);
      console.log("🔧 Deselected tool:", toolId);
      return;
    }

    if (toolId === "shapes") {
      setSelectedTool("shapes");
      setShapesPanelOpen(true);
    } else if (toolId === "templates") {
      setSelectedTool("templates");
      setTemplatesPanelOpen(true);
    } else if (toolId === "ai") {
      setSelectedTool("ai");
      setAIPanelOpen(true);
    } else {
      setSelectedTool(toolId);
      setSelectedShape(null); // Clear shape selection when switching tools
      setSelectedTemplate(null); // Clear template selection when switching tools
      console.log("🔧 Selected tool:", toolId);
    }
  };

  // Hide floating toolbar when shapes, templates, or AI panel is open
  if (isShapesPanelOpen || isTemplatesPanelOpen || isAIPanelOpen) {
    return null;
  }

  return (
    <aside
      className="fixed left-4 top-1/6 z-50 w-16 bg-linear-to-b from-gray-800 to-gray-900 rounded-lg shadow-2xl overflow-hidden flex-col items-center py-3 gap-2 border border-gray-700"
      aria-label="whiteboard-tools-sidebar"
    >
      <div className="flex flex-col items-center gap-2">
        {tools.map((tool) => (
          <ToolTab
            key={tool.id}
            id={`tool-${tool.id}`}
            label={tool.label}
            Icon={tool.Icon}
            onClick={() => handleToolClick(tool.id as ToolType)}
            active={selectedTool === tool.id}
          />
        ))}
      </div>
    </aside>
  );
}

export default FloatingToolbar;

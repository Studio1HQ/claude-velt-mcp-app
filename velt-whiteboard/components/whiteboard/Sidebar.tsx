"use client";

import { ShapeType, useWhiteboardStore } from "@/lib/store/whiteboard-store";
import {
  Circle,
  Square,
  Triangle,
  Hexagon,
  Star,
  X,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { DragEvent } from "react";

const shapes: Array<{
  type: ShapeType;
  icon: any;
  label: string;
  color: string;
}> = [
  { type: "line", icon: MoreVertical, label: "Line", color: "#3b82f6" },
  { type: "rectangle", icon: Square, label: "Rectangle", color: "#3b82f6" },
  { type: "circle", icon: Circle, label: "Circle", color: "#8b5cf6" },
  { type: "diamond", icon: Square, label: "Diamond", color: "#ec4899" },
  { type: "triangle", icon: Triangle, label: "Triangle", color: "#10b981" },
  { type: "hexagon", icon: Hexagon, label: "Hexagon", color: "#f59e0b" },
  { type: "star", icon: Star, label: "Star", color: "#ef4444" },
];

export function Sidebar() {
  const {
    isShapesPanelOpen,
    setShapesPanelOpen,
    selectedShape,
    setSelectedShape,
    setSelectedTool,
  } = useWhiteboardStore();

  const onDragStart = (
    event: DragEvent,
    shapeType: ShapeType,
    color: string,
  ) => {
    event.dataTransfer.setData("application/reactflow", shapeType);
    event.dataTransfer.setData("color", color);
    event.dataTransfer.effectAllowed = "move";
  };

  const onShapeClick = (shapeType: ShapeType, color: string) => {
    // Set selected shape for click-to-place mode
    setSelectedShape({ type: shapeType, color });
    console.log("🎨 Selected shape for placement:", shapeType);
  };

  const handleClose = () => {
    setShapesPanelOpen(false);
    setSelectedTool(null);
    setSelectedShape(null);
  };

  if (!isShapesPanelOpen) {
    return null;
  }

  return (
    <aside className="absolute left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-lg z-10 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Shapes</h2>
        <button
          onClick={handleClose}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="Close Panel"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Instructions */}
      <div className="p-4 bg-blue-50 border-b border-blue-100">
        <p className="text-sm text-blue-800">
          <strong>Drag & drop</strong> or <strong>click</strong> a shape, then
          click on canvas
        </p>
      </div>

      {/* Shapes Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {shapes.map((shape) => {
            const Icon = shape.icon;
            return (
              <div
                key={shape.type}
                draggable
                onDragStart={(e) => onDragStart(e, shape.type, shape.color)}
                onClick={() => onShapeClick(shape.type, shape.color)}
                className={`group cursor-pointer bg-white border-2 rounded-lg p-4 hover:border-blue-400 hover:shadow-md transition-all flex flex-col items-center gap-2 ${
                  selectedShape?.type === shape.type
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
                style={{ minHeight: "100px" }}
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ backgroundColor: shape.color }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-medium text-gray-700 text-center">
                  {shape.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-600 text-center">
          {selectedShape ? (
            <span className="text-blue-600 font-medium">
              Click on canvas to place {selectedShape.type}
            </span>
          ) : (
            "All shapes are resizable"
          )}
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;

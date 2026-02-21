"use client";

import { memo, useState, useRef, useEffect } from "react";
import {
  Handle,
  Position,
  NodeResizeControl,
  NodeProps,
  NodeToolbar,
} from "@xyflow/react";
import { ExpandIcon } from "lucide-react";
import { useNodeSync } from "../NodeSyncContext";

interface StickyNoteData {
  text?: string;
  color?: string;
  onNodesChange?: (changes: any[]) => void;
}

export const STICKY_COLORS = [
  { name: "Yellow", value: "#fef08a" },
  { name: "Pink", value: "#fbcfe8" },
  { name: "Blue", value: "#bfdbfe" },
  { name: "Green", value: "#bbf7d0" },
  { name: "Purple", value: "#e9d5ff" },
  { name: "Orange", value: "#fed7aa" },
];

function StickyNote({ data, selected, id }: NodeProps) {
  const nodeData = data as StickyNoteData;
  const [text, setText] = useState(nodeData?.text || "");
  const [color, setColor] = useState(nodeData?.color || STICKY_COLORS[0].value);
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { onNodesChange } = useNodeSync();

  // Sync with external data changes (from CRDT)
  useEffect(() => {
    if (nodeData?.text !== undefined && nodeData.text !== text) {
      setText(nodeData.text);
    }
    if (nodeData?.color !== undefined && nodeData.color !== color) {
      setColor(nodeData.color);
    }
  }, [nodeData?.text, nodeData?.color]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    // Update node data and trigger CRDT sync
    if (nodeData) {
      nodeData.text = text;
      nodeData.color = color;
      // Trigger CRDT sync through ReactFlow's onNodesChange
      if (onNodesChange) {
        onNodesChange([{ type: "select", id, selected: true }]);
      }
    }
  };

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    if (nodeData) {
      nodeData.color = newColor;
      // Trigger CRDT sync through ReactFlow's onNodesChange
      if (onNodesChange) {
        onNodesChange([{ type: "select", id, selected: true }]);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsEditing(false);
      textareaRef.current?.blur();
    }
  };

  return (
    <>
      {selected && (
        <NodeResizeControl
          minWidth={10}
          minHeight={10}
          position="bottom-right"
          style={{ background: "transparent", border: "none" }}
        >
          {/* <ExpandIcon className="h-4 w-4 text-red-400" /> */}
        </NodeResizeControl>
      )}

      {/* Node Toolbar - Only visible when selected */}
      <NodeToolbar isVisible={!!selected} position={Position.Top}>
        <div className="flex gap-1 bg-white rounded-lg shadow-lg p-2 border border-gray-200">
          {STICKY_COLORS.map((stickyColor) => (
            <button
              key={stickyColor.value}
              onClick={() => handleColorChange(stickyColor.value)}
              className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                color === stickyColor.value
                  ? "border-gray-800 scale-110"
                  : "border-gray-300"
              }`}
              style={{ backgroundColor: stickyColor.value }}
              title={stickyColor.name}
            />
          ))}
        </div>
      </NodeToolbar>

      {/* 4 Handles - All sides as both source and target */}
      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        className="w-3 h-3 bg-gray-600"
      />
      <Handle
        type="source"
        position={Position.Top}
        id="top-source"
        className="w-3 h-3 bg-gray-600"
        style={{ left: "55%" }}
      />

      <Handle
        type="target"
        position={Position.Right}
        id="right-target"
        className="w-3 h-3 bg-gray-600"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        className="w-3 h-3 bg-gray-600"
        style={{ top: "55%" }}
      />

      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-target"
        className="w-3 h-3 bg-gray-600"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        className="w-3 h-3 bg-gray-600"
        style={{ left: "55%" }}
      />

      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        className="w-3 h-3 bg-gray-600"
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left-source"
        className="w-3 h-3 bg-gray-600"
        style={{ top: "55%" }}
      />

      <div
        className="w-full h-full p-4 rounded-lg shadow-lg cursor-pointer transition-shadow hover:shadow-xl"
        style={{ backgroundColor: color }}
        onDoubleClick={handleDoubleClick}
      >
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (nodeData) {
                nodeData.text = e.target.value;
                // Trigger CRDT sync
                if (onNodesChange) {
                  onNodesChange([{ type: "select", id, selected: true }]);
                }
              }
            }}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-full h-full resize-none border-none outline-none text-sm font-normal text-gray-900 bg-transparent"
            placeholder="Double-click to add note..."
            style={{ fontFamily: "inherit" }}
          />
        ) : (
          <div className="w-full h-full text-sm font-normal text-gray-900 whitespace-pre-wrap overflow-auto">
            {text || "Double-click to add note..."}
          </div>
        )}
      </div>
    </>
  );
}

export default memo(StickyNote);

"use client";

import { memo, useState, useRef, useEffect } from "react";
import {
  Handle,
  Position,
  NodeResizeControl,
  NodeProps,
  useReactFlow,
  NodeToolbar,
} from "@xyflow/react";
import { ExpandIcon } from "lucide-react";
import { STICKY_COLORS } from "./StickyNote";
interface TextNodeData {
  text?: string;
  color?: string;
}

function TextNode({ data, selected, id }: NodeProps) {
  const nodeData = data as TextNodeData;
  const [text, setText] = useState(nodeData?.text || "");
  const [color, setColor] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const reactFlow = useReactFlow();

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (nodeData) {
      nodeData.text = text;
    }
  };

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    if (nodeData) {
      nodeData.color = newColor;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsEditing(false);
      textareaRef.current?.blur();
    }
  };

  // Shared handle styles
  const handleClassName =
    "w-3 h-3 bg-pink border-2 border-white hover:bg-blue-600 transition-colors";

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

      <NodeToolbar isVisible={!!selected} position={Position.Top}>
        <div className="flex gap-1 bg-white rounded-lg shadow-lg p-2 border border-gray-200">
          {STICKY_COLORS.map((textNodeColor) => (
            <button
              key={textNodeColor.value}
              onClick={() => handleColorChange(textNodeColor.value)}
              className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                color === textNodeColor.value
                  ? "border-gray-800 scale-110"
                  : "border-gray-300"
              }`}
              style={{ backgroundColor: textNodeColor.value }}
              title={textNodeColor.name}
            />
          ))}
        </div>
      </NodeToolbar>

      {/* TOP - Bidirectional (source + target overlapped) */}
      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        className={handleClassName}
        style={{ left: "50%", transform: "translateX(-50%)" }}
      />
      <Handle
        type="source"
        position={Position.Top}
        id="top-source"
        className={handleClassName}
        style={{ left: "50%", transform: "translateX(-50%)" }}
      />

      {/* RIGHT - Bidirectional (source + target overlapped) */}
      <Handle
        type="target"
        position={Position.Right}
        id="right-target"
        className={handleClassName}
        style={{ top: "50%", transform: "translateY(-50%)" }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        className={handleClassName}
        style={{ top: "50%", transform: "translateY(-50%)" }}
      />

      {/* BOTTOM - Bidirectional (source + target overlapped) */}
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-target"
        className={handleClassName}
        style={{ left: "50%", transform: "translateX(-50%)" }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        className={handleClassName}
        style={{ left: "50%", transform: "translateX(-50%)" }}
      />

      {/* LEFT - Bidirectional (source + target overlapped) */}
      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        className={handleClassName}
        style={{ top: "50%", transform: "translateY(-50%)" }}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left-source"
        className={handleClassName}
        style={{ top: "50%", transform: "translateY(-50%)" }}
      />

      <div
        className="w-full h-full p-3 bg-white border-2 border-gray-300 rounded-lg cursor-text transition-colors"
        onClick={handleClick}
        style={{ backgroundColor: color }}
      >
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-full h-full resize-none border-none outline-none text-sm font-normal text-gray-900 bg-transparent"
            placeholder="Click to add text..."
            style={{ fontFamily: "inherit" }}
          />
        ) : (
          <div className="w-full h-full text-sm font-normal text-gray-900 whitespace-pre-wrap overflow-auto">
            {text || "Click to add text..."}
          </div>
        )}
      </div>
    </>
  );
}

export default memo(TextNode);

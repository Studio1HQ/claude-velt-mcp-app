"use client";

import { memo, CSSProperties } from "react";
import { Handle, Position, NodeResizer, NodeProps } from "@xyflow/react";
import { ShapeType } from "@/lib/store/whiteboard-store";

interface ShapeNodeData {
  shapeType?: ShapeType;
  color?: string;
  label?: string;
}

function ShapeNode({ data, selected }: NodeProps) {
  const nodeData = data as ShapeNodeData;
  const shapeType = nodeData.shapeType || "rectangle";
  const color = nodeData.color || "#3b82f6";
  const label = nodeData.label || "";

  const renderShape = () => {
    const shapeStyle: CSSProperties = {
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    };

    switch (shapeType) {
      case "line":
        return (
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{ position: "absolute", top: 0, left: 0 }}
          >
            <line
              x1="0"
              y1="50"
              x2="100"
              y2="50"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
            />
            {selected && (
              <>
                <circle cx="0" cy="50" r="3" fill="#1e40af" />
                <circle cx="100" cy="50" r="3" fill="#1e40af" />
              </>
            )}
          </svg>
        );

      case "circle":
        return (
          <div
            style={{
              ...shapeStyle,
              borderRadius: "50%",
              backgroundColor: color,
              color: "white",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            {label}
          </div>
        );

      case "diamond":
        return (
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            style={{ position: "absolute", top: 0, left: 0 }}
          >
            <polygon
              points="50,5 95,50 50,95 5,50"
              fill={color}
              stroke={selected ? "#1e40af" : "none"}
              strokeWidth={selected ? "2" : "0"}
            />
            <text
              x="50"
              y="50"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize="12"
              fontWeight="500"
            >
              {label}
            </text>
          </svg>
        );

      case "triangle":
        return (
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            style={{ position: "absolute", top: 0, left: 0 }}
          >
            <polygon
              points="50,10 90,90 10,90"
              fill={color}
              stroke={selected ? "#1e40af" : "none"}
              strokeWidth={selected ? "2" : "0"}
            />
            <text
              x="50"
              y="65"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize="12"
              fontWeight="500"
            >
              {label}
            </text>
          </svg>
        );

      case "hexagon":
        return (
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            style={{ position: "absolute", top: 0, left: 0 }}
          >
            <polygon
              points="50,5 90,25 90,75 50,95 10,75 10,25"
              fill={color}
              stroke={selected ? "#1e40af" : "none"}
              strokeWidth={selected ? "2" : "0"}
            />
            <text
              x="50"
              y="50"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize="12"
              fontWeight="500"
            >
              {label}
            </text>
          </svg>
        );

      case "star":
        return (
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            style={{ position: "absolute", top: 0, left: 0 }}
          >
            <polygon
              points="50,5 61,35 92,35 67,57 78,88 50,70 22,88 33,57 8,35 39,35"
              fill={color}
              stroke={selected ? "#1e40af" : "none"}
              strokeWidth={selected ? "2" : "0"}
            />
            <text
              x="50"
              y="55"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize="12"
              fontWeight="500"
            >
              {label}
            </text>
          </svg>
        );

      case "rectangle":
      default:
        return (
          <div
            style={{
              ...shapeStyle,
              backgroundColor: color,
              borderRadius: "4px",
              color: "white",
              fontSize: "14px",
              fontWeight: 500,
              border: selected ? "2px solid #1e40af" : "none",
            }}
          >
            {label}
          </div>
        );
    }
  };

  return (
    <>
      <NodeResizer
        isVisible={!!selected}
        minWidth={80}
        minHeight={80}
        lineClassName="border-blue-500"
        handleClassName="h-3 w-3 bg-blue-500 rounded-full"
      />

      {/* 4 Handles - All sides as both source and target */}
      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        className="w-3 h-3 bg-gray-500"
      />
      <Handle
        type="source"
        position={Position.Top}
        id="top-source"
        className="w-3 h-3 bg-gray-500"
        style={{ left: "55%" }}
      />

      <Handle
        type="target"
        position={Position.Right}
        id="right-target"
        className="w-3 h-3 bg-gray-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        className="w-3 h-3 bg-gray-500"
        style={{ top: "55%" }}
      />

      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-target"
        className="w-3 h-3 bg-gray-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        className="w-3 h-3 bg-gray-500"
        style={{ left: "55%" }}
      />

      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        className="w-3 h-3 bg-gray-500"
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left-source"
        className="w-3 h-3 bg-gray-500"
        style={{ top: "55%" }}
      />

      <div style={{ width: "100%", height: "100%", position: "relative" }}>
        {renderShape()}
      </div>
    </>
  );
}

export default memo(ShapeNode);

"use client";

import { memo } from "react";
import { Handle, Position, NodeResizer, NodeProps } from "@xyflow/react";

interface ResizableNodeData {
  label?: string;
}

function ResizableNode({ data, selected }: NodeProps) {
  const nodeData = data as ResizableNodeData;
  const label = nodeData?.label || "Resizable Node";

  return (
    <>
      <NodeResizer
        isVisible={!!selected}
        minWidth={5}
        minHeight={3}
        lineClassName="border-blue-500"
        handleClassName="h-3 w-3 bg-blue-500 rounded-full"
        keepAspectRatio={false}
      />

      {/* 4 Handles - All sides as both source and target */}
      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        className="w-3 h-3 bg-blue-400"
      />
      <Handle
        type="source"
        position={Position.Top}
        id="top-source"
        className="w-3 h-3 bg-blue-400"
        style={{ left: "55%" }}
      />

      <Handle
        type="target"
        position={Position.Right}
        id="right-target"
        className="w-3 h-3 bg-blue-400"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        className="w-3 h-3 bg-blue-400"
        style={{ top: "55%" }}
      />

      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-target"
        className="w-3 h-3 bg-blue-400"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        className="w-3 h-3 bg-blue-400"
        style={{ left: "55%" }}
      />

      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        className="w-3 h-3 bg-blue-400"
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left-source"
        className="w-3 h-3 bg-blue-400"
        style={{ top: "55%" }}
      />

      <div className="px-4 py-2 w-full h-full box-border">
        <div className="text-sm font-medium text-gray-900">{label}</div>
      </div>
    </>
  );
}

export default memo(ResizableNode);

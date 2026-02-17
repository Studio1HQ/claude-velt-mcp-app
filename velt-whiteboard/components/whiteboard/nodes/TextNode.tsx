// "use client";

// import { memo, useState, useRef, useEffect } from "react";
// import { Handle, Position, NodeResizer, NodeProps, useReactFlow } from "@xyflow/react";

// interface TextNodeData {
//   text?: string;
// }

// function TextNode({ data, selected, id }: NodeProps) {
//   const nodeData = data as TextNodeData;
//   const [text, setText] = useState(nodeData?.text || "");
//   const [isEditing, setIsEditing] = useState(false);
//   const textareaRef = useRef<HTMLTextAreaElement>(null);
//  const reactFlow = useReactFlow();
//   useEffect(() => {
//     if (isEditing && textareaRef.current) {
//       textareaRef.current.focus();
//       textareaRef.current.select();
//     }
//   }, [isEditing]);

//   const handleClick = () => {
//     setIsEditing(true);
//   };

//   const handleBlur = () => {
//     setIsEditing(false);
//     // Update node data
//     if (nodeData) {
//       nodeData.text = text;
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === "Escape") {
//       setIsEditing(false);
//       textareaRef.current?.blur();
//     }
//   };

//   return (
//     <>
//       <NodeResizer
//         isVisible={!!selected}
//         minWidth={150}
//         minHeight={60}
//         lineClassName="border-blue-500"
//         handleClassName="h-3 w-3 bg-blue-500 rounded-full"
//         onResizeEnd={(event, params) => {
//     // Only update AFTER resize is complete
//     reactFlow.updateNode(id, {
//       style: {
//         width: params.width,
//         height: params.height,
//       },
//     });
//   }}
//       />

//       {/* 4 Handles - All sides as both source and target */}
//       <Handle
//         type="target"
//         position={Position.Top}
//         id="top-target"
//         className="w-3 h-3 bg-blue-400"
//       />
//       <Handle
//         type="source"
//         position={Position.Top}
//         id="top-source"
//         className="w-3 h-3 bg-blue-400"
//         style={{ left: "55%" }}
//       />

//       <Handle
//         type="target"
//         position={Position.Right}
//         id="right-target"
//         className="w-3 h-3 bg-blue-400"
//       />
//       <Handle
//         type="source"
//         position={Position.Right}
//         id="right-source"
//         className="w-3 h-3 bg-blue-400"
//         style={{ top: "55%" }}
//       />

//       <Handle
//         type="target"
//         position={Position.Bottom}
//         id="bottom-target"
//         className="w-3 h-3 bg-blue-400"
//       />
//       <Handle
//         type="source"
//         position={Position.Bottom}
//         id="bottom-source"
//         className="w-3 h-3 bg-blue-400"
//         style={{ left: "55%" }}
//       />

//       <Handle
//         type="target"
//         position={Position.Left}
//         id="left-target"
//         className="w-3 h-3 bg-blue-400"
//       />
//       <Handle
//         type="source"
//         position={Position.Left}
//         id="left-source"
//         className="w-3 h-3 bg-blue-400"
//         style={{ top: "55%" }}
//       />

//       <div
//         className="w-full h-full p-3 bg-white border-2 border-gray-300 rounded-lg cursor-text hover:border-blue-400 transition-colors"
//         onClick={handleClick}
//       >
//         {isEditing ? (
//           <textarea
//             ref={textareaRef}
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//             onBlur={handleBlur}
//             onKeyDown={handleKeyDown}
//             className="w-full h-full resize-none border-none outline-none text-sm font-normal text-gray-900 bg-transparent"
//             placeholder="Click to add text..."
//             style={{ fontFamily: "inherit" }}
//           />
//         ) : (
//           <div className="w-full h-full text-sm font-normal text-gray-900 whitespace-pre-wrap overflow-auto">
//             {text || "Click to add text..."}
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

// export default memo(TextNode);

"use client";

import { memo, useState, useRef, useEffect } from "react";
import { Handle, Position, NodeResizer, NodeProps, useReactFlow } from "@xyflow/react";

interface TextNodeData {
  text?: string;
}

function TextNode({ data, selected, id }: NodeProps) {
  const nodeData = data as TextNodeData;
  const [text, setText] = useState(nodeData?.text || "");
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsEditing(false);
      textareaRef.current?.blur();
    }
  };

  // Shared handle styles
  const handleClassName = "w-3 h-3 bg-pink border-2 border-white hover:bg-blue-600 transition-colors";

  return (
    <>
      <NodeResizer
        isVisible={!!selected}
        minWidth={150}
        minHeight={60}
        lineClassName="border-blue-500"
        handleClassName="h-3 w-3 bg-blue-500 rounded-full"
        onResizeEnd={(event, params) => {
          reactFlow.updateNode(id, {
            style: {
              width: params.width,
              height: params.height,
            },
          });
        }}
      />

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
        className="w-full h-full p-3 bg-white border-2 border-gray-300 rounded-lg cursor-text hover:border-blue-400 transition-colors"
        onClick={handleClick}
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

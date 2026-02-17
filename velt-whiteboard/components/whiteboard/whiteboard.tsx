"use client";

import {
  useCallback,
  useEffect,
  DragEvent as ReactDragEvent,
  useRef,
} from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  ReactFlowProvider,
  Panel,
  BackgroundVariant,
  useReactFlow,
} from "@xyflow/react";
import { useVeltReactFlowCrdtExtension } from "@veltdev/reactflow-crdt";
import { useVeltInitState } from "@veltdev/react";
import { useWhiteboardStore, ShapeType } from "@/lib/store/whiteboard-store";
import "@xyflow/react/dist/style.css";
import Sidebar from "./Sidebar";
import TemplatesSidebar from "./TemplatesSidebar";
import FloatingToolbar from "./FloatingToolbar";
import ResizableNode from "./nodes/ResizableNode";
import ShapeNode from "./nodes/ShapeNode";
import TextNode from "./nodes/TextNode";
import StickyNote from "./nodes/StickyNote";

// Define custom node types
const nodeTypes = {
  resizable: ResizableNode,
  shape: ShapeNode,
  text: TextNode,
  sticky: StickyNote,
};

const initialNodes: Node[] = [
  {
    id: "node-1",
    type: "resizable",
    data: { label: "Welcome to Collaborative Whiteboard!" },
    position: { x: 250, y: 50 },
    style: {
      width: 300,
      height: 80,
      border: "2px solid #3b82f6",
      borderRadius: "8px",
      backgroundColor: "white",
    },
  },
  {
    id: "node-2",
    type: "shape",
    data: {
      shapeType: "circle" as ShapeType,
      color: "#8b5cf6",
      label: "Drag me!",
    },
    position: { x: 100, y: 200 },
    style: { width: 120, height: 120 },
  },
  {
    id: "node-3",
    type: "shape",
    data: {
      shapeType: "hexagon" as ShapeType,
      color: "#f59e0b",
      label: "Resizable",
    },
    position: { x: 400, y: 200 },
    style: { width: 140, height: 140 },
  },
];

const initialEdges: Edge[] = [];

function CollaborativeCanvas() {
  const {
    currentUser,
    documentId,
    getNextNodeId,
    selectedShape,
    setSelectedShape,
    selectedTool,
    setSelectedTool,
    selectedTemplate,
    setSelectedTemplate,
  } = useWhiteboardStore();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useReactFlow();
  const { screenToFlowPosition } = reactFlowInstance;

  // Initialize CRDT extension
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, store } =
    useVeltReactFlowCrdtExtension({
      editorId: "whiteboard-canvas-001",
      initialNodes,
      initialEdges,
    });

  // Log CRDT store initialization
  useEffect(() => {
    if (store) {
      console.log("✅ CRDT store initialized for user:", currentUser.name);
      console.log("📄 Document:", documentId);
    }
  }, [store, currentUser, documentId]);

  // Log node changes for debugging
  useEffect(() => {
    console.log("📊 Nodes synced:", nodes.length, "nodes");
  }, [nodes]);

  // Handle Escape key to deselect tools
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedTool(null);
        setSelectedShape(null);
        setSelectedTemplate(null);
        console.log("⌨️ Tools deselected via Escape");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setSelectedTool, setSelectedShape, setSelectedTemplate]);

  const onNodeDoubleClick = useCallback((_: React.MouseEvent, node: Node) => {
    console.log("🖱️ Double clicked node:", node.id);
  }, []);

  // Handle drag over to allow drop
  const onDragOver = useCallback((event: ReactDragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Handle drop to add new shape node
  const onDrop = useCallback(
    (event: ReactDragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const shapeType = event.dataTransfer.getData(
        "application/reactflow",
      ) as ShapeType;
      const color = event.dataTransfer.getData("color");

      if (!shapeType) {
        return;
      }

      // Get drop position
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // Create new node
      const newNode: Node = {
        id: getNextNodeId(),
        type: "shape",
        position,
        data: { shapeType, color, label: "" },
        style: { width: 120, height: 120 },
      };

      // Add node to canvas using addNodes
      reactFlowInstance.addNodes([newNode]);
      console.log("🎨 Dropped shape:", shapeType, "at", position);
    },
    [screenToFlowPosition, getNextNodeId, reactFlowInstance],
  );

  // Handle canvas click for click-to-place mode
  const onPaneClick = useCallback(
    (event: React.MouseEvent) => {
      // Handle template placement
      if (selectedTemplate) {
        // Get click position (this will be the top-left anchor point)
        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        // Create all nodes from the template with adjusted positions
        const templateNodes: Node[] = selectedTemplate.nodes.map((nodeTemplate) => ({
          ...nodeTemplate,
          id: getNextNodeId(),
          position: {
            x: position.x + (nodeTemplate.position?.x || 0),
            y: position.y + (nodeTemplate.position?.y || 0),
          },
        }));

        // Add all template nodes to canvas
        reactFlowInstance.addNodes(templateNodes);
        console.log("📋 Placed template:", selectedTemplate.name, "with", templateNodes.length, "nodes");

        // Clear template selection after placing
        setSelectedTemplate(null);
        setSelectedTool(null);
        return;
      }

      // Handle shape placement
      if (selectedShape) {
        // Get click position
        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        // Create new node
        const newNode: Node = {
          id: getNextNodeId(),
          type: "shape",
          position,
          data: {
            shapeType: selectedShape.type,
            color: selectedShape.color,
            label: "",
          },
          style: { width: 120, height: 120 },
        };

        // Add node to canvas
        reactFlowInstance.addNodes([newNode]);
        console.log("🎨 Placed shape:", selectedShape.type, "at", position);

        // Clear selection after placing
        setSelectedShape(null);
        return;
      }

      // Handle text node placement
      if (selectedTool === "text") {
        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        const newNode: Node = {
          id: getNextNodeId(),
          type: "text",
          position,
          data: { text: "" },
          style: { width: 200, height: 100 },
        };

        reactFlowInstance.addNodes([newNode]);
        console.log("📝 Placed text node at", position);

        // Keep tool selected for multiple placements
        return;
      }

      // Handle sticky note placement
      if (selectedTool === "sticky") {
        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        const newNode: Node = {
          id: getNextNodeId(),
          type: "sticky",
          position,
          data: { text: "", color: "#fef08a" },
          style: { width: 200, height: 200 },
        };

        reactFlowInstance.addNodes([newNode]);
        console.log("📌 Placed sticky note at", position);

        // Keep tool selected for multiple placements
        return;
      }
    },
    [
      selectedTemplate,
      selectedShape,
      selectedTool,
      screenToFlowPosition,
      getNextNodeId,
      reactFlowInstance,
      setSelectedShape,
      setSelectedTemplate,
      setSelectedTool,
    ],
  );

  return (
    <div className="w-full h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDoubleClick={onNodeDoubleClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        style={{
          cursor:
            selectedTemplate ||
            selectedShape ||
            selectedTool === "text" ||
            selectedTool === "sticky"
              ? "crosshair"
              : "default",
        }}
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls />
        <MiniMap />
        <Panel
          position="top-right"
          className="bg-white px-4 py-2 rounded-lg shadow-md"
        >
          <div className="text-sm text-gray-600">
            <p className="font-semibold">✨ {currentUser.name} Connected</p>
            <p className="text-xs mt-1">Real-time CRDT sync active</p>
            {(selectedTool || selectedShape || selectedTemplate) && (
              <p className="text-xs mt-1 text-blue-600 font-medium">
                {selectedTool === "text" && "📝 Click to place Text"}
                {selectedTool === "sticky" && "📌 Click to place Sticky Note"}
                {selectedShape && `🎨 Click to place ${selectedShape.type}`}
                {selectedTemplate && `📋 Click to place ${selectedTemplate.name}`}
                {" · Press ESC to cancel"}
              </p>
            )}
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-700 font-medium">Initializing Velt...</p>
        <p className="text-gray-500 text-sm mt-2">
          Setting up real-time collaboration
        </p>
      </div>
    </div>
  );
}

export function Whiteboard() {
  // Check if Velt is initialized (user identified + document set)
  const veltInitialized = useVeltInitState();
  const { currentUser } = useWhiteboardStore();

  useEffect(() => {
    console.log("🎨 Velt initialization state:", veltInitialized);
    if (veltInitialized) {
      console.log("✅ Velt ready! User:", currentUser.name);
    }
  }, [veltInitialized, currentUser]);

  // Only render ReactFlow when Velt is fully initialized
  if (!veltInitialized) {
    return <LoadingScreen />;
  }

  return (
    <ReactFlowProvider>
      <div className="w-full h-full relative">
        <CollaborativeCanvas />
        {/* Floating toolbar on the left */}
        <FloatingToolbar />
        {/* Shapes panel (opens when shapes tool is selected) */}
        <Sidebar />
        {/* Templates panel (opens when templates tool is selected) */}
        <TemplatesSidebar />
      </div>
    </ReactFlowProvider>
  );
}

import React, { useCallback } from 'react';
import { 
  ReactFlow, 
  ReactFlowProvider, 
  Background, 
  Controls, 
  MiniMap, 
  Panel,
  BackgroundVariant 
} from '@xyflow/react';
import { useVeltReactFlowCrdtExtension } from '@veltdev/reactflow-crdt';
import '@xyflow/react/dist/style.css';

const initialNodes = [
  {
    id: '1',
    type: 'default',
    data: { label: 'Welcome to Collaborative Canvas!' },
    position: { x: 250, y: 100 },
  },
  {
    id: '2',
    type: 'default',
    data: { label: 'Add nodes and edges' },
    position: { x: 250, y: 200 },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
];

interface CollaborativeCanvasProps {
  editorId: string;
}

const CanvasContent: React.FC<CollaborativeCanvasProps> = ({ editorId }) => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
    useVeltReactFlowCrdtExtension({
      editorId,
      initialNodes,
      initialEdges,
    });

  const handleAddNode = useCallback(() => {
    const newNode = {
      id: `node-${Date.now()}`,
      position: { 
        x: Math.random() * 400 + 100, 
        y: Math.random() * 300 + 100 
      },
      data: { label: `Node ${nodes.length + 1}` },
    };
    
    onNodesChange([{ type: 'add', item: newNode }]);
  }, [nodes.length, onNodesChange]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        attributionPosition="bottom-left"
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls />
        <MiniMap />
        
        <Panel position="top-right">
          <button
            onClick={handleAddNode}
            style={{
              padding: '10px 20px',
              backgroundColor: '#5B5BD6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 2px 8px rgba(91, 91, 214, 0.3)',
            }}
          >
            + Add Node
          </button>
        </Panel>

        <Panel position="top-left">
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
              fontSize: '14px',
              fontWeight: '600',
              color: '#333',
            }}
          >
            🎨 Collaborative Canvas Board
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export const CollaborativeCanvas: React.FC<CollaborativeCanvasProps> = ({ editorId }) => {
  return (
    <ReactFlowProvider>
      <CanvasContent editorId={editorId} />
    </ReactFlowProvider>
  );
};

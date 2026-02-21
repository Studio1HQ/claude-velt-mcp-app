"use client";

import { createContext, useContext, ReactNode } from "react";

interface NodeSyncContextValue {
  onNodesChange?: (changes: any[]) => void;
}

const NodeSyncContext = createContext<NodeSyncContextValue>({});

export function NodeSyncProvider({
  children,
  onNodesChange,
}: {
  children: ReactNode;
  onNodesChange?: (changes: any[]) => void;
}) {
  return (
    <NodeSyncContext.Provider value={{ onNodesChange }}>
      {children}
    </NodeSyncContext.Provider>
  );
}

export function useNodeSync() {
  return useContext(NodeSyncContext);
}

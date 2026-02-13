import React, { useEffect, useState } from "react";
import { VeltProviderWrapper } from "./components/velt/VeltProvider";
import { CollaborativeCanvas } from "./components/canvas/CollaborativeCanvas";

const App: React.FC = () => {
  const [documentId] = useState(() => `canvas-${Date.now()}`);
  const [editorId] = useState(() => `editor-${Date.now()}`);

  useEffect(() => {
    console.log("Canvas Board App initialized");
    console.log("Document ID:", documentId);
    console.log("Editor ID:", editorId);
  }, [documentId, editorId]);

  return (
    <VeltProviderWrapper documentId={documentId}>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <CollaborativeCanvas editorId={editorId} />
      </div>
    </VeltProviderWrapper>
  );
};

export default App;

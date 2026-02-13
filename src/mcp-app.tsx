import React from "react";
import { createRoot } from "react-dom/client";
import { App as McpApp } from "@modelcontextprotocol/ext-apps";
import AppComponent from "./App";

// Initialize MCP App
const app = new McpApp({
  name: "Canvas Board",
  version: "1.0.0",
});

// Mount React app IMMEDIATELY (per MCP Apps best practices)
console.log("Mounting React app...");
const rootElement = document.getElementById("root");
if (rootElement) {
  const reactRoot = createRoot(rootElement);
  reactRoot.render(
    <React.StrictMode>
      <AppComponent />
    </React.StrictMode>,
  );
  console.log("React app mounted successfully!");
}

// Register ALL handlers BEFORE calling app.connect()
// Handlers are for processing data, not gating UI mount

// Handle tool input (when Claude calls the tool)
app.ontoolinput = (params) => {
  console.log("Tool called with params:", params);
  return {};
};

// Handle tool result (after tool execution)
app.ontoolresult = (result) => {
  console.log("Tool result:", result);
  return {};
};

// Handle host context changes (e.g., theme changes)
app.onhostcontextchanged = (context) => {
  console.log("Host context changed:", context);
  return {};
};

// Handle teardown
app.onteardown = async () => {
  console.log("App teardown");
  return {};
};

// Connect to Claude AFTER registering all handlers
app
  .connect()
  .then(() => {
    console.log("Connected to Claude via MCP!");
    console.log("Collaborative Canvas Board ready");
  })
  .catch((error) => {
    console.error("Failed to connect to Claude:", error);
  });

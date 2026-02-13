import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {
  registerAppTool,
  registerAppResource,
  RESOURCE_MIME_TYPE,
} from "@modelcontextprotocol/ext-apps/server";
import express from "express";
import cors from "cors";
import fs from "node:fs/promises";
import path from "node:path";

const server = new McpServer({
  name: "Collaborative Canvas Server",
  version: "1.0.0",
});

const resourceUri = "ui://canvas/board.html";

// Register Canvas Board tool
registerAppTool(
  server,
  "open-canvas-board",
  {
    title: "Open Canvas Board",
    description:
      "Opens a collaborative Miro-like canvas board with ReactFlow and Velt real-time collaboration features",
    inputSchema: {},
    _meta: { ui: { resourceUri } },
  },
  async () => {
    return {
      content: [
        {
          type: "text",
          text: "Canvas Board opened successfully! You can now collaborate in real-time.",
        },
      ],
    };
  },
);

// Register UI resource
registerAppResource(
  server,
  resourceUri,
  resourceUri,
  { mimeType: RESOURCE_MIME_TYPE },
  async () => {
    const html = await fs.readFile(
      path.join(import.meta.dirname, "dist", "index.html"),
      "utf-8",
    );
    return {
      contents: [
        {
          uri: resourceUri,
          mimeType: RESOURCE_MIME_TYPE,
          text: html,
        },
      ],
    };
  },
);

// Start HTTP server
const app = express();
app.use(cors());
app.use(express.json());

app.post("/mcp", async (req, res) => {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });
  res.on("close", () => transport.close());
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

app.listen(3001, () => {
  console.log("✅ Server running on http://localhost:3001/mcp");
});

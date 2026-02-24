"use client";

import { useState, useRef, useEffect } from "react";
import { useWhiteboardStore } from "@/lib/store/whiteboard-store";
import {
  X,
  Sparkles,
  Send,
  Loader2,
  ChevronUp,
  ChevronDown,
  Lightbulb,
  FolderTree,
  FileText,
  TrendingUp,
  Heart,
  Layers,
} from "lucide-react";
import { useReactFlow } from "@xyflow/react";
import {
  processCanvasCommand,
  summarizeCanvas,
  suggestNextSteps,
  generateTemplateFromCanvas,
} from "@/lib/ai/ai-helpers";
import {
  buildNodesFromActions,
  applyColorUpdates,
  type CanvasAction,
} from "@/lib/ai/canvas-actions";

type AIFeature =
  | "chat"
  | "brainstorm"
  | "organize"
  | "summarize"
  | "next-steps"
  | "sentiment"
  | "create-template";

const FEATURES = [
  {
    id: "chat" as AIFeature,
    name: "Ask AI",
    icon: Sparkles,
    description: "Chat & add anything to canvas",
  },
  {
    id: "brainstorm" as AIFeature,
    name: "Brainstorm",
    icon: Lightbulb,
    description: "Generate ideas as sticky notes",
  },
  // {
  //   id: "organize" as AIFeature,
  //   name: "Organize",
  //   icon: FolderTree,
  //   description: "Group & color-code notes",
  // },
  {
    id: "summarize" as AIFeature,
    name: "Summarize",
    icon: FileText,
    description: "Summarize canvas content",
  },
  {
    id: "create-template" as AIFeature,
    name: "Template",
    icon: Layers,
    description: "Name this canvas layout",
  },
];

function ChatMessage({ role, content }: { role: string; content: string }) {
  return (
    // MessageBubble.tsx
    <div
      className={`flex w-full ${role === "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`p-3 rounded-lg text-sm max-w-[75%] ${
          role === "user" ? "bg-muted" : "bg-muted"
        }`}
      >
        <div className="text-xs font-medium text-ring mb-1">
          {role === "user" ? "You" : "AI"}
        </div>
        <div className="whitespace-pre-wrap leading-relaxed">{content}</div>
      </div>
    </div>
  );
}

export default function AISidebar() {
  const {
    isAIPanelOpen,
    setAIPanelOpen,
    aiMessages,
    addAIMessage,
    aiCanvasPosition,
    getNextNodeId,
  } = useWhiteboardStore();
  const { getNodes, getEdges, addNodes, setNodes } = useReactFlow();
  const [selectedFeature, setSelectedFeature] = useState<AIFeature>("chat");
  const [isGridOpen, setIsGridOpen] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiMessages, isLoading]);

  if (!isAIPanelOpen) return null;

  /** Execute canvas actions directly — no store roundtrip, renders immediately */
  const executeActions = (actions: CanvasAction[]) => {
    const addActions = actions.filter((a) => a.type !== "update_color");
    if (addActions.length > 0) {
      const newNodes = buildNodesFromActions(
        addActions,
        aiCanvasPosition,
        getNextNodeId,
      );
      if (newNodes.length > 0) addNodes(newNodes);
    }
    const colorUpdated = applyColorUpdates(getNodes(), actions);
    if (colorUpdated) setNodes(colorUpdated);
  };

  const runCommand = async (prompt: string, userLabel?: string) => {
    setIsLoading(true);
    addAIMessage({ role: "user", content: userLabel || prompt });

    const result = await processCanvasCommand(prompt, getNodes(), getEdges());

    if (result.error) {
      addAIMessage({
        role: "assistant",
        content: `Something went wrong. Please try again.`,
      });
    } else {
      if (result.actions.length > 0) executeActions(result.actions);
      if (result.message)
        addAIMessage({ role: "assistant", content: result.message });
    }
    setIsLoading(false);
  };

  const handleChat = () => {
    if (!inputValue.trim() || isLoading) return;
    const prompt = inputValue.trim();
    setInputValue("");
    runCommand(prompt);
  };

  const handleBrainstorm = () => {
    if (!inputValue.trim() || isLoading) return;
    const topic = inputValue.trim();
    setInputValue("");
    runCommand(
      `Generate 6 brainstorming sticky notes about: "${topic}". Use different colors to categorize them by type or theme.`,
      `Brainstorm: ${topic}`,
    );
  };

  const handleOrganize = () => {
    const stickies = getNodes().filter((n) => n.type === "sticky");
    if (!stickies.length) {
      addAIMessage({
        role: "assistant",
        content: "No sticky notes found to organize.",
      });
      return;
    }
    runCommand(
      "Group all the sticky notes on this canvas into logical categories. Use update_color actions to color-code each group with a distinct color. Explain the groupings briefly.",
      "Organize sticky notes",
    );
  };

  const handleSummarize = async () => {
    if (isLoading) return;
    setIsLoading(true);
    addAIMessage({ role: "user", content: "Summarize canvas" });
    const summary = await summarizeCanvas(getNodes(), getEdges());
    addAIMessage({ role: "assistant", content: summary });
    setIsLoading(false);
  };

  const handleNextSteps = async () => {
    if (isLoading) return;
    setIsLoading(true);
    addAIMessage({ role: "user", content: "Suggest next steps" });
    const steps = await suggestNextSteps(getNodes(), getEdges());
    addAIMessage({ role: "assistant", content: steps });
    setIsLoading(false);
  };

  const handleSentiment = () => {
    const stickies = getNodes().filter((n) => n.type === "sticky");
    if (!stickies.length) {
      addAIMessage({
        role: "assistant",
        content: "No sticky notes found to analyze.",
      });
      return;
    }
    runCommand(
      "Analyze the sentiment of all sticky notes on this canvas. Color-code them with update_color actions: green (#bbf7d0) for positive, pink (#fbcfe8) for negative, blue (#bfdbfe) for neutral, orange (#fed7aa) for concerns. Report the counts in your message.",
      "Analyze sentiment",
    );
  };

  const handleCreateTemplate = async () => {
    if (isLoading) return;
    setIsLoading(true);
    addAIMessage({ role: "user", content: "Identify canvas template" });
    const info = await generateTemplateFromCanvas(getNodes(), getEdges());
    addAIMessage({ role: "assistant", content: info });
    setIsLoading(false);
  };

  const handleFeatureAction = () => {
    switch (selectedFeature) {
      case "chat":
        handleChat();
        break;
      case "brainstorm":
        handleBrainstorm();
        break;
      case "organize":
        handleOrganize();
        break;
      case "summarize":
        handleSummarize();
        break;
      case "next-steps":
        handleNextSteps();
        break;
      case "sentiment":
        handleSentiment();
        break;
      case "create-template":
        handleCreateTemplate();
        break;
    }
  };

  const needsInput =
    selectedFeature === "chat" || selectedFeature === "brainstorm";

  return (
    <div className="absolute top-0 right-0 h-full w-96 bg-background shadow-2xl z-50 flex flex-col rounded-2xl">
      {/* Header */}
      <div className="p-4 bg-linear-to-r from-red-400 to-red-600 text-background flex items-center justify-between shrink-0 rounded-tl-2xl">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          <h2 className="font-bold text-lg">AI Assistant</h2>
        </div>
        <button
          onClick={() => setAIPanelOpen(false)}
          className="p-1 rounded transition-colors text-background cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Feature Grid (collapsible; overlays messages when open) */}
      <div className="p-3 border-b border-foreground bg-background shrink-0 relative">
        <div className="flex items-start justify-between">
          <div className="text-sm font-medium text-foreground">Features</div>
          <button
            onClick={() => setIsGridOpen((s) => !s)}
            aria-expanded={isGridOpen}
            className="p-1 rounded hover:bg-red-500 text-foregorund"
          >
            {isGridOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Absolute overlay grid so expanding doesn't push content below */}
        <div
          className={`absolute left-3 right-3 top-full mt-2 z-40 bg-muted rounded-lg p-3 shadow transition-all duration-150 transform origin-top ${
            isGridOpen
              ? "opacity-100 scale-100 visible"
              : "opacity-0 scale-95 invisible pointer-events-none"
          }`}
        >
          <div className="grid grid-cols-2 gap-1.5">
            {FEATURES.map(({ id, name, icon: Icon, description }) => (
              <button
                key={id}
                onClick={() => setSelectedFeature(id)}
                className={`p-2.5 rounded-lg border-2 text-left transition-all ${
                  selectedFeature === id
                    ? "border-red-500 bg-card"
                    : "border-gray-200 bg-card hover:border-red-300"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Icon
                    className={`w-3.5 h-3.5 ${selectedFeature === id ? "text-red-500" : "text-foreground"}`}
                  />
                  <span
                    className={`text-xs font-semibold ${selectedFeature === id ? "text-red-500" : "text-foreground"}`}
                  >
                    {name}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 leading-tight">
                  {description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {aiMessages.length === 0 && (
          <div className="text-center py-12">
            <Sparkles className="w-10 h-10 mx-auto text-foreground mb-3" />
            <p className="text-gray-400 text-sm">
              Select a feature or type in Ask AI
            </p>
            <p className="text-gray-300 text-xs mt-1">
              e.g. "add 3 sticky notes about marketing"
            </p>
          </div>
        )}
        {aiMessages.map((msg) => (
          <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-foreground bg-card p-3 rounded-lg mr-6">
            <Loader2 className="w-4 h-4 animate-spin text-red-400" />
            <span className="text-sm">Thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input / Action */}
      <div className="p-3 bg-card shrink-0 rounded-bl-2xl">
        {needsInput ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && handleFeatureAction()
              }
              placeholder={
                selectedFeature === "brainstorm"
                  ? "Enter topic..."
                  : "add 2 sticky notes, add triangle, add kanban..."
              }
              className="flex-1 px-3 py-2 text-foreground text-sm rounded-lg border-2 border-red-400 focus:outline-none focus:ring-1 focus:ring-red-400"
              disabled={isLoading}
            />
            <button
              onClick={handleFeatureAction}
              disabled={isLoading || !inputValue.trim()}
              className="px-3 py-2 bg-linear-to-r from-red-400 to-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-40 transition-colors"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        ) : (
          <button
            onClick={handleFeatureAction}
            disabled={isLoading}
            className="w-full py-2.5 bg-linear-to-r from-red-400 to-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 disabled:opacity-40 transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Running...
              </>
            ) : (
              `Run ${FEATURES.find((f) => f.id === selectedFeature)?.name}`
            )}
          </button>
        )}
      </div>
    </div>
  );
}

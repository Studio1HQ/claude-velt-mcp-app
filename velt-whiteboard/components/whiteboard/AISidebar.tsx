"use client";

import { useState } from "react";
import { useWhiteboardStore } from "@/lib/store/whiteboard-store";
import {
  X,
  Sparkles,
  Send,
  Loader2,
  Lightbulb,
  FolderTree,
  FileText,
  TrendingUp,
  Layers,
  Heart,
} from "lucide-react";
import { useReactFlow } from "@xyflow/react";
import {
  generateBrainstormIdeas,
  organizeStickyNotes,
  summarizeCanvas,
  suggestNextSteps,
  askQuestion,
  groupBySentiment,
  generateTemplateFromCanvas,
  generateStickyNotes,
} from "@/lib/ai/ai-helpers";

type AIFeature =
  | "chat"
  | "brainstorm"
  | "organize"
  | "summarize"
  | "next-steps"
  | "sentiment"
  | "create-template";

export default function AISidebar() {
  const {
    isAIPanelOpen,
    setAIPanelOpen,
    aiMessages,
    addAIMessage,
    aiCanvasPosition,
    addPendingStickyNotes,
  } = useWhiteboardStore();
  const { getNodes, addNodes, getNode, setNodes } = useReactFlow();
  const [selectedFeature, setSelectedFeature] = useState<AIFeature>("chat");
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isAIPanelOpen) return null;

  const handleClose = () => {
    setAIPanelOpen(false);
    setInputValue("");
  };

  const handleBrainstorm = async () => {
    if (!inputValue.trim()) return;

    setIsLoading(true);
    addAIMessage({
      role: "user",
      content: `Generate ideas for: ${inputValue}`,
    });

    try {
      // Use the new generateStickyNotes function with colors
      const notes = await generateStickyNotes(inputValue, 4);

      if (notes.length > 0) {
        // Add sticky notes to pending queue (will be placed at last click position)
        addPendingStickyNotes(notes, aiCanvasPosition);
        addAIMessage({
          role: "assistant",
          content: `✅ Generated ${notes.length} colored sticky notes at position (${Math.round(aiCanvasPosition.x)}, ${Math.round(aiCanvasPosition.y)})! You can drag them to reposition.`,
        });
      } else {
        // Fallback to old behavior
        const ideas = await generateBrainstormIdeas(inputValue);
        const nodes = getNodes();
        const startX = aiCanvasPosition.x;
        const startY = aiCanvasPosition.y;

        const newNodes = ideas.map((idea, index) => ({
          id: `sticky-${Date.now()}-${index}`,
          type: "sticky",
          position: {
            x: startX + (index % 4) * 220,
            y: startY + Math.floor(index / 4) * 220,
          },
          data: { text: idea, color: "#fef08a" },
          style: { width: 200, height: 200 },
        }));

        addNodes(newNodes);
        addAIMessage({
          role: "assistant",
          content: `✅ Generated ${ideas.length} brainstorm ideas and added them to canvas!`,
        });
      }
      setInputValue("");
    } catch (error: any) {
      addAIMessage({
        role: "assistant",
        content: `❌ Error: ${error.message}`,
      });
    }
    setIsLoading(false);
  };

  const handleOrganize = async () => {
    setIsLoading(true);
    addAIMessage({
      role: "user",
      content: "Organize sticky notes by category",
    });

    try {
      const nodes = getNodes();
      const result = await organizeStickyNotes(nodes);

      if (result.categories.length === 0) {
        addAIMessage({
          role: "assistant",
          content: "No sticky notes found to organize.",
        });
        setIsLoading(false);
        return;
      }

      // Display categories
      let summary = `📋 Organized into ${result.categories.length} categories:\n\n`;
      result.categories.forEach((cat) => {
        summary += `**${cat.name}** (${cat.items.length} notes)\n`;
      });

      addAIMessage({ role: "assistant", content: summary });

      // Move sticky notes into groups
      const allNodes = getNodes();
      result.categories.forEach((category, catIndex) => {
        category.items.forEach((nodeId, itemIndex) => {
          const node = allNodes.find((n) => n.id === nodeId);
          if (node) {
            node.position = {
              x: 100 + catIndex * 500,
              y: 100 + itemIndex * 220,
            };
          }
        });
      });

      setNodes(allNodes);
    } catch (error: any) {
      addAIMessage({
        role: "assistant",
        content: `❌ Error: ${error.message}`,
      });
    }
    setIsLoading(false);
  };

  const handleSummarize = async () => {
    setIsLoading(true);
    addAIMessage({ role: "user", content: "Summarize canvas content" });

    try {
      const nodes = getNodes();
      const summary = await summarizeCanvas(nodes);
      addAIMessage({ role: "assistant", content: summary });
    } catch (error: any) {
      addAIMessage({
        role: "assistant",
        content: `❌ Error: ${error.message}`,
      });
    }
    setIsLoading(false);
  };

  const handleNextSteps = async () => {
    setIsLoading(true);
    addAIMessage({ role: "user", content: "Suggest next steps" });

    try {
      const nodes = getNodes();
      const steps = await suggestNextSteps(nodes);

      const stepsList = steps.map((step, i) => `${i + 1}. ${step}`).join("\n");
      addAIMessage({
        role: "assistant",
        content: `🎯 Suggested Next Steps:\n\n${stepsList}`,
      });
    } catch (error: any) {
      addAIMessage({
        role: "assistant",
        content: `❌ Error: ${error.message}`,
      });
    }
    setIsLoading(false);
  };

  const handleSentiment = async () => {
    setIsLoading(true);
    addAIMessage({ role: "user", content: "Analyze sentiment" });

    try {
      const nodes = getNodes();
      const sentiment = await groupBySentiment(nodes);

      let report = "📊 Sentiment Analysis:\n\n";
      report += `✅ Positive: ${sentiment.positive.length} notes\n`;
      report += `❌ Negative: ${sentiment.negative.length} notes\n`;
      report += `➖ Neutral: ${sentiment.neutral.length} notes\n`;
      report += `⚠️ Concerns: ${sentiment.concerns.length} notes`;

      addAIMessage({ role: "assistant", content: report });
    } catch (error: any) {
      addAIMessage({
        role: "assistant",
        content: `❌ Error: ${error.message}`,
      });
    }
    setIsLoading(false);
  };

  const handleCreateTemplate = async () => {
    setIsLoading(true);
    addAIMessage({ role: "user", content: "Create template from canvas" });

    try {
      const nodes = getNodes();
      const template = await generateTemplateFromCanvas(nodes);

      addAIMessage({
        role: "assistant",
        content: `📐 Template Created!\n\n**Name:** ${template.name}\n**Description:** ${template.description}\n\nYou can save this as a custom template.`,
      });
    } catch (error: any) {
      addAIMessage({
        role: "assistant",
        content: `❌ Error: ${error.message}`,
      });
    }
    setIsLoading(false);
  };

  const handleChat = async () => {
    if (!inputValue.trim()) return;

    setIsLoading(true);
    addAIMessage({ role: "user", content: inputValue });

    try {
      const nodes = getNodes();
      const response = await askQuestion(inputValue, nodes);
      addAIMessage({ role: "assistant", content: response });
      setInputValue("");
    } catch (error: any) {
      addAIMessage({
        role: "assistant",
        content: `❌ Error: ${error.message}`,
      });
    }
    setIsLoading(false);
  };

  const handleSubmit = () => {
    if (selectedFeature === "chat") {
      handleChat();
    } else if (selectedFeature === "brainstorm") {
      handleBrainstorm();
    }
  };

  const features = [
    {
      id: "chat" as AIFeature,
      name: "Ask AI",
      icon: Sparkles,
      description: "Ask questions about your canvas",
    },
    {
      id: "brainstorm" as AIFeature,
      name: "Brainstorm",
      icon: Lightbulb,
      description: "Generate creative ideas",
    },
    {
      id: "organize" as AIFeature,
      name: "Organize",
      icon: FolderTree,
      description: "Auto-organize notes",
    },
    {
      id: "summarize" as AIFeature,
      name: "Summarize",
      icon: FileText,
      description: "Summarize content",
    },
    {
      id: "next-steps" as AIFeature,
      name: "Next Steps",
      icon: TrendingUp,
      description: "Suggest actions",
    },
    // {
    //   id: "sentiment" as AIFeature,
    //   name: "Sentiment",
    //   icon: Heart,
    //   description: "Analyze sentiment",
    // },
    // {
    //   id: "create-template" as AIFeature,
    //   name: "Template",
    //   icon: Layers,
    //   description: "Create template",
    // },
  ];

  return (
    <div className="absolute top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200 rounded-[12px]">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-red-600 to-pink-600 text-white flex items-center justify-between rounded-[12px]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          <h2 className="font-bold text-lg">AI Assistant</h2>
        </div>
        <button
          onClick={handleClose}
          className="p-1 hover:bg-white/20 rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Features Grid */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="grid grid-cols-2 gap-2">
          {features.map((feature) => {
            const Icon = feature.icon;
            const isActive = selectedFeature === feature.id;
            return (
              <button
                key={feature.id}
                onClick={() => setSelectedFeature(feature.id)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  isActive
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 bg-white hover:border-purple-300"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon
                    className={`w-4 h-4 ${isActive ? "text-purple-600" : "text-gray-600"}`}
                  />
                  <span
                    className={`text-sm font-semibold ${isActive ? "text-purple-700" : "text-gray-700"}`}
                  >
                    {feature.name}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{feature.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {aiMessages.length === 0 && (
          <div className="text-center py-8">
            <Sparkles className="w-12 h-12 mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500 text-sm">
              Select a feature above to get started
            </p>
          </div>
        )}

        {aiMessages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 rounded-lg ${
              msg.role === "user" ? "bg-blue-100 ml-8" : "bg-gray-100 mr-8"
            }`}
          >
            <div className="text-xs text-gray-500 mb-1">
              {msg.role === "user" ? "You" : "AI Assistant"}
            </div>
            <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-gray-500 bg-gray-100 p-3 rounded-lg mr-8">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">AI is thinking...</span>
          </div>
        )}
      </div>

      {/* Input Area */}
      {(selectedFeature === "chat" || selectedFeature === "brainstorm") && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !isLoading && handleSubmit()
              }
              placeholder={
                selectedFeature === "brainstorm"
                  ? "Enter topic for brainstorming..."
                  : "Ask a question about your canvas..."
              }
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={isLoading}
            />
            <button
              onClick={handleSubmit}
              disabled={isLoading || !inputValue.trim()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Action Button for other features */}
      {selectedFeature !== "chat" && selectedFeature !== "brainstorm" && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={() => {
              if (selectedFeature === "organize") handleOrganize();
              else if (selectedFeature === "summarize") handleSummarize();
              else if (selectedFeature === "next-steps") handleNextSteps();
              else if (selectedFeature === "sentiment") handleSentiment();
              else if (selectedFeature === "create-template")
                handleCreateTemplate();
            }}
            disabled={isLoading}
            className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </span>
            ) : (
              `Run ${features.find((f) => f.id === selectedFeature)?.name}`
            )}
          </button>
        </div>
      )}
    </div>
  );
}

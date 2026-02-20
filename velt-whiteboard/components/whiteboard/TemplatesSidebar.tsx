"use client";

import { useWhiteboardStore } from "@/lib/store/whiteboard-store";
import { TEMPLATES } from "@/lib/constants/templates";
import {
  X,
  Lightbulb,
  Workflow,
  LayoutGrid,
  Brain,
  Calendar,
  MessageSquare,
} from "lucide-react";

const TEMPLATE_ICONS = {
  "how-might-we": Brain,
  "idea-workflow": Workflow,
  kanban: LayoutGrid,
  "brainstorm-grid": Lightbulb,
  timeline: Calendar,
  feedback: MessageSquare,
};

export function TemplatesSidebar() {
  const {
    isTemplatesPanelOpen,
    setTemplatesPanelOpen,
    selectedTemplate,
    setSelectedTemplate,
    setSelectedTool,
  } = useWhiteboardStore();

  const handleTemplateClick = (templateId: string) => {
    const template = TEMPLATES.find((t) => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      console.log("📋 Selected template for placement:", template.name);
    }
  };

  const handleClose = () => {
    setTemplatesPanelOpen(false);
    setSelectedTool(null);
    setSelectedTemplate(null);
  };

  if (!isTemplatesPanelOpen) {
    return null;
  }

  return (
    <aside className="absolute left-0 top-0 h-full w-80 bg-background border-r border-gray-200 shadow-lg z-10 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Templates</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Click to use a pre-built canvas
          </p>
        </div>
        <button
          onClick={handleClose}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="Close Panel"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      {/* Instructions */}
      <div className="p-4 bg-card">
        <p className="text-sm text-foreground">
          <strong>Click</strong> a template, then{" "}
          <strong>click on canvas</strong> to place it
        </p>
      </div>

      {/* Templates List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {TEMPLATES.map((template) => {
            const Icon =
              TEMPLATE_ICONS[template.id as keyof typeof TEMPLATE_ICONS];
            const isSelected = selectedTemplate?.id === template.id;

            return (
              <button
                key={template.id}
                onClick={() => handleTemplateClick(template.id)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all hover:shadow-lg hover:scale-[1.02] ${
                  isSelected
                    ? "border-red-500 bg-card shadow-md"
                    : "bg-card hover:border-red-300"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      isSelected
                        ? "bg-red-500"
                        : "bg-linear-to-br from-red-400 to-red-500"
                    }`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">
                      {template.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {template.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {template.nodes.length} elements
                    </p>
                  </div>
                </div>
                {isSelected && (
                  <div className="mt-3 text-xs text-red-400 font-medium">
                    ✓ Selected - Click on canvas to place
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 bg-card">
        <p className="text-xs text-muted-foreground text-center">
          {selectedTemplate ? (
            <span className="text-red-400 font-medium">
              Click anywhere on canvas to place template
            </span>
          ) : (
            "All elements in templates are editable and resizable"
          )}
        </p>
      </div>
    </aside>
  );
}

export default TemplatesSidebar;

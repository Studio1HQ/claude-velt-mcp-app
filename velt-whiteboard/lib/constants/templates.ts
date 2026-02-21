import { TemplateType } from "../store/whiteboard-store";

export const TEMPLATES: TemplateType[] = [
  // Template 1: How Might We - Brainstorming
  {
    id: "how-might-we",
    name: "How Might We",
    description: "Brainstorm solutions using 'How Might We' questions",
    nodes: [
      // Title Card (Black)
      {
        type: "sticky",
        position: { x: 50, y: 50 },
        data: {
          text: "In what ways might we dramatically improve our offering for different people?",
          color: "pink",
        },
        style: { width: 200, height: 180 },
      },
      // Category Cards (Purple)
      {
        type: "text",
        position: { x: 50, y: 270 },
        data: {
          text: "🔹 Simplification\nReducing complexity, streamlining processes...",
        },
        style: {
          width: 160,
          height: 120,
          border: "2px solid #8b5cf6",
          borderRadius: "8px",
          backgroundColor: "#f3e8ff",
        },
      },
      {
        type: "text",
        position: { x: 50, y: 420 },
        data: {
          text: "👥 Personalization\nTailoring experiences to individual needs...",
        },
        style: {
          width: 160,
          height: 120,
          border: "2px solid #8b5cf6",
          borderRadius: "8px",
          backgroundColor: "#f3e8ff",
        },
      },
      {
        type: "text",
        position: { x: 50, y: 570 },
        data: {
          text: "💬 Social & community\nBuilding connections, enabling collaboration...",
        },
        style: {
          width: 160,
          height: 120,
          border: "2px solid #8b5cf6",
          borderRadius: "8px",
          backgroundColor: "#f3e8ff",
        },
      },
      {
        type: "text",
        position: { x: 50, y: 720 },
        data: {
          text: "🏆 Gamification\nAdding game elements, rewarding progress...",
        },
        style: {
          width: 160,
          height: 120,
          border: "2px solid #8b5cf6",
          borderRadius: "8px",
          backgroundColor: "#f3e8ff",
        },
      },
      // Question Cards (Blue)
      {
        type: "text",
        position: { x: 280, y: 50 },
        data: { text: "⚙️ How might we attract new users or customers?" },
        style: {
          width: 180,
          height: 100,
          border: "2px solid #3b82f6",
          borderRadius: "8px",
          backgroundColor: "#dbeafe",
        },
      },
      {
        type: "text",
        position: { x: 490, y: 50 },
        data: { text: "⚡ How might we power users or longtime customers?" },
        style: {
          width: 180,
          height: 100,
          border: "2px solid #3b82f6",
          borderRadius: "8px",
          backgroundColor: "#dbeafe",
        },
      },
      {
        type: "text",
        position: { x: 700, y: 50 },
        data: { text: "👥 How might we audiences we haven't reached yet?" },
        style: {
          width: 180,
          height: 100,
          border: "2px solid #3b82f6",
          borderRadius: "8px",
          backgroundColor: "#dbeafe",
        },
      },
      {
        type: "text",
        position: { x: 910, y: 50 },
        data: { text: "😊 How might we our skeptics or detractors?" },
        style: {
          width: 180,
          height: 100,
          border: "2px solid #3b82f6",
          borderRadius: "8px",
          backgroundColor: "#dbeafe",
        },
      },
      // Sticky Notes for ideas
      {
        type: "sticky",
        position: { x: 280, y: 180 },
        data: { text: "Idea", color: "#fef08a" },
        style: { width: 130, height: 130 },
      },
      {
        type: "sticky",
        position: { x: 280, y: 340 },
        data: { text: "", color: "#fef08a" },
        style: { width: 130, height: 130 },
      },
      {
        type: "sticky",
        position: { x: 490, y: 340 },
        data: { text: "Idea", color: "#fef08a" },
        style: { width: 130, height: 130 },
      },
      {
        type: "sticky",
        position: { x: 490, y: 500 },
        data: { text: "Idea", color: "#fef08a" },
        style: { width: 130, height: 130 },
      },
      {
        type: "sticky",
        position: { x: 700, y: 640 },
        data: { text: "Idea", color: "#fef08a" },
        style: { width: 130, height: 130 },
      },
    ],
  },

  // Template 2: Idea Generation Workflow
  {
    id: "idea-workflow",
    name: "Idea Generation Workflow",
    description: "Spark new ideas using well-written 'how might we' questions",
    nodes: [
      // Title Card
      {
        type: "sticky",
        position: { x: 50, y: 50 },
        data: {
          text: "Spark new ideas using well-written 'how might we' questions",
          color: "pink",
        },
        style: { width: 200, height: 180 },
      },
      // Workflow Cards (Green)
      {
        type: "text",
        position: { x: 300, y: 50 },
        data: {
          text: "✅ How might we\nfor the frontliners?",
        },
        style: {
          width: 160,
          height: 90,
          border: "2px solid #10b981",
          borderRadius: "8px",
          backgroundColor: "#d1fae5",
        },
      },
      {
        type: "text",
        position: { x: 490, y: 50 },
        data: {
          text: "✅ How might we manage\nemotion or product?",
        },
        style: {
          width: 160,
          height: 90,
          border: "2px solid #10b981",
          borderRadius: "8px",
          backgroundColor: "#d1fae5",
        },
      },
      {
        type: "text",
        position: { x: 680, y: 50 },
        data: {
          text: "✅ How might we create\nan amazing innovation?",
        },
        style: {
          width: 160,
          height: 90,
          border: "2px solid #10b981",
          borderRadius: "8px",
          backgroundColor: "#d1fae5",
        },
      },
      // Workflow Cards (Red)
      {
        type: "text",
        position: { x: 870, y: 50 },
        data: {
          text: "❌ How might we create\nan amazing product\nimmediately tomorrow?",
        },
        style: {
          width: 160,
          height: 90,
          border: "2px solid #ef4444",
          borderRadius: "8px",
          backgroundColor: "#fee2e2",
        },
      },
      {
        type: "text",
        position: { x: 1060, y: 50 },
        data: {
          text: "❌ How might we improve\nan amazing product?",
        },
        style: {
          width: 160,
          height: 90,
          border: "2px solid #ef4444",
          borderRadius: "8px",
          backgroundColor: "#fee2e2",
        },
      },
      // Instructions
      {
        type: "text",
        position: { x: 300, y: 170 },
        data: {
          text: "→ Look at any 'how might we' question...",
        },
        style: {
          width: 180,
          height: 60,
          backgroundColor: "transparent",
        },
      },
      {
        type: "text",
        position: { x: 870, y: 170 },
        data: {
          text: "→ Avoid overly broad questions...",
        },
        style: {
          width: 180,
          height: 60,
          backgroundColor: "transparent",
        },
      },
      // Yellow Notes Grid
      {
        type: "text",
        position: { x: 1280, y: 50 },
        data: {
          text: "Design a variety of diverse students...",
          color: "#fef08a",
        },
        style: {
          width: 140,
          height: 100,
          border: "2px solid #eab308",
          borderRadius: "4px",
          backgroundColor: "#fef9c3",
        },
      },
      // Person sections
      ...Array.from({ length: 6 }, (_, i) => [
        {
          type: "text",
          position: {
            x: 300 + (i % 3) * 350,
            y: 300 + Math.floor(i / 3) * 250,
          },
          data: { text: `Person ${i + 1}` },
          style: {
            width: 300,
            height: 40,
            backgroundColor: "transparent",
            fontWeight: "bold",
          },
        },
        {
          type: "sticky",
          position: {
            x: 300 + (i % 3) * 350,
            y: 350 + Math.floor(i / 3) * 250,
          },
          data: { text: "How might we", color: "#fef08a" },
          style: { width: 140, height: 80 },
        },
        {
          type: "sticky",
          position: {
            x: 460 + (i % 3) * 350,
            y: 350 + Math.floor(i / 3) * 250,
          },
          data: { text: "", color: "#fef08a" },
          style: { width: 140, height: 80 },
        },
        {
          type: "sticky",
          position: {
            x: 300 + (i % 3) * 350,
            y: 450 + Math.floor(i / 3) * 250,
          },
          data: { text: "", color: "#fef08a" },
          style: { width: 140, height: 80 },
        },
        {
          type: "sticky",
          position: {
            x: 460 + (i % 3) * 350,
            y: 450 + Math.floor(i / 3) * 250,
          },
          data: { text: "", color: "#fef08a" },
          style: { width: 140, height: 80 },
        },
      ]).flat(),
    ],
  },

  // Template 3: Kanban Board
  {
    id: "kanban",
    name: "Kanban Board",
    description: "Organize tasks with a classic Kanban workflow",
    nodes: [
      // Column Headers
      {
        type: "text",
        position: { x: 50, y: 50 },
        data: { text: "📋 Backlog" },
        style: {
          width: 250,
          height: 80,
          border: "2px solid #3b82f6",
          borderRadius: "8px",
          backgroundColor: "#dbeafe",
          fontSize: "18px",
          fontWeight: "bold",
        },
      },
      {
        type: "text",
        position: { x: 330, y: 50 },
        data: { text: "➡️ Up next" },
        style: {
          width: 250,
          height: 80,
          border: "2px solid #3b82f6",
          borderRadius: "8px",
          backgroundColor: "#dbeafe",
          fontSize: "18px",
          fontWeight: "bold",
        },
      },
      {
        type: "text",
        position: { x: 610, y: 50 },
        data: { text: "🔄 Doing" },
        style: {
          width: 250,
          height: 80,
          border: "2px solid #3b82f6",
          borderRadius: "8px",
          backgroundColor: "#dbeafe",
          fontSize: "18px",
          fontWeight: "bold",
        },
      },
      {
        type: "text",
        position: { x: 890, y: 50 },
        data: { text: "✅ Done" },
        style: {
          width: 250,
          height: 80,
          border: "2px solid #3b82f6",
          borderRadius: "8px",
          backgroundColor: "#dbeafe",
          fontSize: "18px",
          fontWeight: "bold",
        },
      },
    ],
  },

  // Template 4: Brainstorm Grid
  {
    id: "brainstorm-grid",
    name: "Brainstorm Grid",
    description: "Structured brainstorming with categories",
    nodes: [
      // Title
      {
        type: "sticky",
        position: { x: 50, y: 50 },
        data: {
          text: "💡 Brainstorm Session\n\nTopic: ___________",
          color: "pink",
        },
        style: { width: 280, height: 150 },
      },
      // Grid Headers
      {
        type: "text",
        position: { x: 380, y: 50 },
        data: { text: "🎯 Goals" },
        style: {
          width: 200,
          height: 60,
          border: "2px solid #8b5cf6",
          borderRadius: "8px",
          backgroundColor: "#f3e8ff",
        },
      },
      {
        type: "text",
        position: { x: 610, y: 50 },
        data: { text: "⚠️ Challenges" },
        style: {
          width: 200,
          height: 60,
          border: "2px solid #ef4444",
          borderRadius: "8px",
          backgroundColor: "#fee2e2",
        },
      },
      {
        type: "text",
        position: { x: 840, y: 50 },
        data: { text: "💡 Ideas" },
        style: {
          width: 200,
          height: 60,
          border: "2px solid #10b981",
          borderRadius: "8px",
          backgroundColor: "#d1fae5",
        },
      },
      {
        type: "text",
        position: { x: 1070, y: 50 },
        data: { text: "✨ Next Steps" },
        style: {
          width: 200,
          height: 60,
          border: "2px solid #f59e0b",
          borderRadius: "8px",
          backgroundColor: "#fef3c7",
        },
      },
      // Add some starter sticky notes
      ...Array.from({ length: 4 }, (_, i) =>
        Array.from({ length: 3 }, (_, j) => ({
          type: "sticky",
          position: { x: 380 + i * 230, y: 140 + j * 160 },
          data: { text: "", color: "#fef08a" },
          style: { width: 180, height: 130 },
        })),
      ).flat(),
    ],
  },

  // Template 5: Timeline
  {
    id: "timeline",
    name: "Timeline",
    description: "Plan and visualize project milestones",
    nodes: [
      // Title
      {
        type: "sticky",
        position: { x: 50, y: 50 },
        data: {
          text: "📅 Project Timeline\n\nProject: ___________",
          color: "#1f2937",
        },
        style: { width: 250, height: 150 },
      },
      // Timeline phases
      ...Array.from({ length: 5 }, (_, i) => [
        {
          type: "text",
          position: { x: 350 + i * 240, y: 50 },
          data: { text: `Phase ${i + 1}` },
          style: {
            width: 200,
            height: 60,
            border: "2px solid #3b82f6",
            borderRadius: "8px",
            backgroundColor: "#dbeafe",
            fontWeight: "bold",
          },
        },
        {
          type: "sticky",
          position: { x: 350 + i * 240, y: 140 },
          data: { text: "Task", color: "#fef08a" },
          style: { width: 180, height: 100 },
        },
        {
          type: "sticky",
          position: { x: 350 + i * 240, y: 260 },
          data: { text: "Task", color: "#fef08a" },
          style: { width: 180, height: 100 },
        },
        {
          type: "sticky",
          position: { x: 350 + i * 240, y: 380 },
          data: { text: "Task", color: "#fef08a" },
          style: { width: 180, height: 100 },
        },
      ]).flat(),
    ],
  },

  // Template 6: Feedback Collection
  {
    id: "feedback",
    name: "Feedback Collection",
    description: "Gather and organize user feedback",
    nodes: [
      // ── Section 1: Positive Feedback (green) ──
      {
        type: "sticky",
        position: { x: -140, y: 60 },
        data: {
          text: "😊\n\nPositive\nfeedback",
          color: "#bbf7d0",
        },
        style: { width: 310, height: 210, borderRadius: "12px" },
      },
      ...Array.from({ length: 4 }, (_, col) =>
        Array.from({ length: 3 }, (_, row) => ({
          id: `positive-${col}-${row}`,
          type: "sticky",
          position: { x: 180 + col * 130, y: 40 + row * 120 },
          data: { text: "", color: "#bbf7d0" },
          style: { width: 110, height: 100, borderRadius: "10px" },
        })),
      ).flat(),

      // ── Section 2: Negative Feedback (pink/red) ──
      {
        id: "label-negative",
        type: "sticky",
        position: { x: -140, y: 420 },
        data: {
          text: "😞\n\nNegative\nfeedback",
          color: "#fecaca",
        },
        style: { width: 310, height: 210, borderRadius: "12px" },
      },
      ...Array.from({ length: 4 }, (_, col) =>
        Array.from({ length: 3 }, (_, row) => ({
          id: `negative-${col}-${row}`,
          type: "sticky",
          position: { x: 180 + col * 130, y: 400 + row * 120 },
          data: { text: "", color: "#fecaca" },
          style: { width: 110, height: 100, borderRadius: "10px" },
        })),
      ).flat(),

      // ── Section 3: Ideas (yellow) ──
      {
        id: "label-ideas",
        type: "sticky",
        position: { x: -140, y: 780 },
        data: {
          text: "💡\n\nIdeas\nyou have",
          color: "#fef08a",
        },
        style: { width: 310, height: 210, borderRadius: "12px" },
      },
      ...Array.from({ length: 4 }, (_, col) =>
        Array.from({ length: 3 }, (_, row) => ({
          id: `ideas-${col}-${row}`,
          type: "sticky",
          position: { x: 180 + col * 130, y: 760 + row * 120 },
          data: { text: "", color: "#fef08a" },
          style: { width: 110, height: 100, borderRadius: "10px" },
        })),
      ).flat(),

      // ── Section 4: Questions (blue) ──
      {
        id: "label-questions",
        type: "sticky",
        position: { x: -140, y: 1140 },
        data: {
          text: "❓\n\nQuestions\nyou have",
          color: "#bae6fd",
        },
        style: { width: 310, height: 210, borderRadius: "12px" },
      },
      ...Array.from({ length: 4 }, (_, col) =>
        Array.from({ length: 3 }, (_, row) => ({
          id: `questions-${col}-${row}`,
          type: "sticky",
          position: { x: 180 + col * 130, y: 1120 + row * 120 },
          data: { text: "", color: "#bae6fd" },
          style: { width: 110, height: 100, borderRadius: "10px" },
        })),
      ).flat(),
    ],
  },
];

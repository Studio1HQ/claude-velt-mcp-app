# Collaborative Whiteboard

A real-time collaborative whiteboard application built with **Next.js**, **ReactFlow**, **Zustand**, and **Velt CRDT** for seamless multi-user collaboration.

![Untitled design (47)](https://github.com/user-attachments/assets/b83fa9e2-f815-48f3-ad7f-44713a370fca)


> **Built with:** Velt Docs MCP, Velt Skills, ReactFlow, Zustand, VELT CRDT

## Features

### Core Functionality

- **Real-time Collaborative Canvas**: Built with ReactFlow for a powerful diagramming experience
- **CRDT Synchronization**: Uses Velt CRDT to ensure conflict-free real-time updates across multiple users
- **Multi-user Support**: Two hardcoded users (Alex and Bob) for deterministic testing
- **Live Presence**: See other users' cursors and selections in real-time

### Collaboration Features

- **Comments**: Add freestyle comments anywhere on the canvas
- **Comment Sidebar**: View all comments in an organized sidebar
- **Notifications**: Get notified of new comments and changes
- **Comment Tool**: Click to add contextual comments to specific elements

### Technical Highlights

- **Zustand State Management**: Centralized global state for AI integration
- **Modular Architecture**: Clean separation of concerns with proper file structure
- **TypeScript**: Fully typed for better developer experience
- **shadcn/ui**: Beautiful, accessible UI components
- **Next.js 16**: App router with server and client components

## Project Structure

```
velt-whiteboard/
├── app/
│   ├── layout.tsx          # Root layout with Velt providers
│   ├── page.tsx            # Main page component
│   └── globals.css         # Global styles
├── components/
│   ├── layout/
│   │   └── header.tsx      # Header with user switcher and tools
│   ├── providers/
│   │   ├── velt-provider-wrapper.tsx  # Velt SDK provider
│   │   └── velt-authenticator.tsx     # User authentication
│   ├── ui/
│   │   ├── button.tsx      # Button component
│   │   └── dropdown-menu.tsx  # Dropdown menu component
│   └── whiteboard/
│       └── whiteboard.tsx  # Main canvas component with ReactFlow
├── lib/
│   ├── constants/
│   │   └── users.ts        # Hardcoded users (Alex & Bob)
│   ├── store/
│   │   └── whiteboard-store.ts  # Zustand global state
│   └── utils.ts            # Utility functions
└── .env.local              # Environment variables
```

## Installation

> **Note:** This project uses Velt SDK v5.0.1-beta.1 which requires `--legacy-peer-deps` flag.

```bash
cd velt-whiteboard
npm install --legacy-peer-deps
```

Set up environment variables in `.env`:

```
NEXT_PUBLIC_VELT_API_KEY=your_velt_api_key
MINIMAX_API_KEY=your_minimax_m2_5_key
```

> **Note:** Get your Velt API key from [Velt Dashboard](https://dashboard.velt.dev) and Minimax API key from [Minimax Platform](https://platform.minimaxi.com).

Run the development server:

```bash
npm run dev
```

Open your browser at [http://localhost:3000](http://localhost:3000)

## Usage

### Testing Real-time Collaboration

1. **Open two browser windows** (or use two different browsers/incognito windows)
2. **Navigate to** `http://localhost:3000` in both windows
3. **Switch users** using the dropdown in the header:
   - Window A: Keep as Alex (default)
   - Window B: Switch to Bob
4. **Test real-time features**:
   - Drag nodes in one window → See them move in the other
   - Add/delete nodes → Changes sync instantly
   - Add connections between nodes → Edges appear in both windows
   - Add comments → See them in the sidebar
   - Watch cursors → See other users' cursor positions

### User Switching

Click the user dropdown in the top-right corner to switch between:

- **Alex Johnson** (alex@example.com)
- **Bob Smith** (bob@example.com)

### Adding Comments

1. Click the **Comment Tool** button in the header
2. Click anywhere on the canvas to place a comment
3. View all comments in the **Comments Sidebar** (click the sidebar button)
4. Get notified of new comments via the **Notifications** button

## Technologies

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **ReactFlow (@xyflow/react)** - Canvas/diagramming library
- **Velt SDK (@veltdev/react)** - Real-time collaboration
- **Velt CRDT (@veltdev/reactflow-crdt)** - Conflict-free data synchronization
- **Zustand** - State management
- **shadcn/ui** - UI component library
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible component primitives

## Architecture

### State Management

The app uses **Zustand** for global state management with a centralized store:

- Current user (Alex or Bob)
- Document ID for collaboration
- AI integration state

### Real-time Collaboration

**Velt CRDT** handles all real-time synchronization:

- Node positions
- Edge connections
- Node additions/deletions
- User presence and cursors

### Component Hierarchy

```
RootLayout (VeltProvider)
  └── VeltAuthenticator
        ├── VeltPresence (cursors)
        ├── VeltComments (comment system)
        ├── VeltCommentsSidebar (comment list)
        └── Page
              ├── Header
              │     ├── User Switcher
              │     ├── VeltCommentTool
              │     ├── VeltSidebarButton
              │     └── VeltNotificationsTool
              └── Whiteboard
                    └── ReactFlow (with CRDT)
```

## Key Features Explained

### 1. Real-time Node Synchronization

When a user drags a node:

```typescript
const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
  useVeltReactFlowCrdtExtension({
    editorId: "whiteboard-canvas-001",
    initialNodes,
    initialEdges,
  });
```

Velt CRDT automatically syncs the change to all connected clients.

### 2. User Identification

Each user is authenticated with Velt:

```typescript
client.identify({
  userId: currentUser.userId,
  name: currentUser.name,
  email: currentUser.email,
  photoUrl: currentUser.photoUrl,
});
```

### 3. Document Context

All collaboration happens in a shared document:

```typescript
client.setDocument(documentId);
```

## Troubleshooting

### CRDT not syncing?

- Check that both users have different `userId`
- Ensure `documentId` is the same in both windows
- Verify Velt API key is correct

### Comments not appearing?

- Check that `VeltComments` is in the component tree
- Ensure user is authenticated
- Verify document is set

### TypeScript errors?

- Run `npm run build` to check for build errors
- Restart TypeScript server in your IDE

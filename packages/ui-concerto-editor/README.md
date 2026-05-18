# @accordproject/ui-concerto-editor

A visual editor for [Concerto](https://concerto.accordproject.org/) data models — my proof of concept for **GSoC 2026, Project 2: Concerto Graphical Editor**.

This is a new package in the [web-components](https://github.com/accordproject/web-components) monorepo, built on top of [PR #436](https://github.com/accordproject/web-components/pull/436). 

Right now, building Concerto models means writing ".cto" code by hand. This tool lets you do it visually instead — you see your model as a graph of connected nodes, and you can edit it by clicking, dragging, and filling in dialogs. The CTO code updates automatically.

## What it does

**The basics:**
- You get a split view: CTO text on the left, interactive graph on the right
- Edit either side and the other stays in sync
- Nodes represent concepts, enums, and maps. Edges show how they relate

**Editing from the graph (no code needed):**
- Add new concepts, enums, assets, participants, events, transactions, maps
- Add/remove properties on any concept
- Set property type, optional, array, or relationship ("-->")
- Toggle abstract on/off
- Set inheritance ("extends") via dialog or by dragging between nodes
- Add/remove enum values
- Delete any declaration

**Other stuff:**
- Undo/redo that also remembers where you dragged nodes (Ctrl+Z / Ctrl+Shift+Z)
- Import/export ".cto" files
- Syntax highlighting in the text editor with colors matching the graph
- Collapsible text panel (hide it to get full-screen graph)
- Dendrogram layout that auto-arranges nodes in a tree

## How it looks

The graph uses different visual styles to help you read the model at a glance:

- **Blue nodes** — concepts (darker blue for assets, purple for participants, etc.)
- **Yellow/gold nodes** — enums
- **Teal nodes** — maps
- **Solid blue lines** — property (this concept *contains* that type)
- **Dashed red lines** — relationship (this concept *references* that type)
- **Animated purple lines** — inheritance (extends)

## Concerto features covered

Based on the [Concerto specification](https://concerto.accordproject.org/docs/category/specification) and the [GSoC project description](https://github.com/accordproject/techdocs/wiki/Google-Summer-of-Code-2026-Ideas-List):

- Type composition (concept with properties of other concept types)
- Enumerations (full create/edit/delete)
- Inheritance ("extends")
- Abstract types (toggle)
- Relationships ("-->")
- Arrays ("Type[]")
- Maps ("map Name { o KeyType o ValueType }")
- Namespace (parsed and preserved)

## Built with

- **React 18** + **TypeScript**
- **React Flow** ("@xyflow/react" v12) for the graph
- **Vite** for dev/build
- **@accordproject/concerto-core** as a dependency (for future integration with the real parser)

Currently using a custom regex-based CTO parser. One of the next steps is replacing it with "concerto-core"'s actual parser.

## Project structure

The code is split into two main folders: "components/" for the React UI and "utils/" for the data logic.

**Components:**
- **ConcertoGraphEditor** — the main component that wires everything together: React Flow canvas, state management, bidirectional sync, undo/redo, and all the edit operations
- **ConceptNode / EnumNode / MapNode** — custom React Flow nodes for each Concerto declaration type, with inline edit buttons
- **Toolbar** — the top bar with add/import/export/undo/redo buttons, plus all the popup dialogs for adding declarations, properties, enum values, and setting inheritance
- **CtoEditor** — the syntax-highlighted text editor (transparent textarea layered over a colored "pre" element)

**Utils:**
- **types.ts** — shared TypeScript interfaces (Declaration, Property, ConcertoModel, etc.)
- **ctoToGraph.ts** — parses a CTO string into a model, computes the tree layout, and generates React Flow nodes and edges
- **graphToCto.ts** — the reverse: takes the model and generates valid CTO code
- **defaultModel.ts** — a demo NDA model used on first load

## Running it

```bash
cd packages/ui-concerto-editor
npm install
npm run dev
```

- Portfolio: [soniaduma.dev](https://soniaduma.dev)
- LinkedIn: [linkedin.com/in/sonia-duma-555786283](https://www.linkedin.com/in/sonia-duma-555786283)

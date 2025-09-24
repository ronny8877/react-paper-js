## React + Paper.js boolean ops (Figma‑like)

Live Demo: https://react-paper-js.vercel.app/

This is a small demo that showcases Figma‑style boolean operations on vector shapes using Paper.js, wrapped in a React + MobX state management setup and bundled with Vite. It focuses on the four standard boolean ops between two shapes:

- Union
- Subtract
- Intersect
- Exclude

The module is designed to be reusable in a DOM‑based editor and plays nicely with a MobX store.

## Tech stack

- React (UI)
- MobX (state management)
- Paper.js (boolean geometry on paths)
- styled-components (styling)
- Vite + TypeScript (build/dev tooling)

## Quick start

1) Install deps

```bash
npm install
```

2) Start dev server

```bash
npm run dev
```

3) Build for production

```bash
npm run build
```

4) Preview local production build

```bash
npm run preview
```

## How it works (high level)

- Shapes are mounted as DOM nodes and mirrored into a hidden Paper.js canvas to run boolean operations accurately and efficiently.
- A simple bounding‑box intersection check determines if two selected shapes are candidates for a boolean op.
- On a valid operation, the store removes the original shapes and inserts the resulting path as a new shape, keeping history simple for undo/redo.
- The boolean algorithm itself is delegated to Paper.js; swapping to a different geometry engine only requires changing the `performBooleanOperation` logic.

### Basic workflow

```
Add shapes → Select two shapes → Check bbox intersection
→ Perform boolean op via Paper.js → Create resulting shape
→ Update MobX store ↔ DOM → Continue editing
```

## Limitations

- Paper.js runs on a hidden canvas (it’s not DOM‑native). We sync DOM shapes to that canvas to compute results.
- Bounding‑box checks are coarse. Boxes can intersect when the actual paths don’t; improving this would require per‑path hit tests prior to the boolean op.

## Customization

- Swap geometry engine: replace the Paper.js call inside `performBooleanOperation` with the engine of your choice.
- Styling: update styled‑components as desired.
- State: extend MobX stores to support grouping, layers, guides, snapping, etc.

## SEO notes (for this demo)

Basic on‑page SEO is included in `index.html`:

- Descriptive `<title>` and `<meta name="description">`
- Open Graph + Twitter card tags for link previews
- Canonical URL and robots hints
- Optional JSON‑LD structured data for a WebApplication

You can customize these values in `index.html` and add a social image (e.g., `public/og-image.png`) for richer previews.

## Acknowledgements

- Paper.js — https://paperjs.org/
- Figma boolean ops explainer — https://www.youtube.com/watch?v=1IebN9pTulE

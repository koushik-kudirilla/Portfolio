# Koushik Kudirilla — Portfolio MPA

This version keeps the existing multi-page structure while adding seamless client-side navigation. The individual `.html` files remain directly accessible, but internal navigation swaps the `<main>` content without a full browser reload. `page-templates.js` provides a local fallback so the same behavior can work when the site is opened directly from the filesystem.

## Assets
Keep your existing `assets/` folder beside these files. Certificate and resume PDFs are referenced from `assets/`.

## PDF previews
Certificate/resume previews use PDF.js and intentionally do not use the browser's native PDF iframe toolbar. For local development, serve the folder through a small HTTP server (for example VS Code Live Server or `python -m http.server`) so PDF.js can fetch local PDF files correctly. The deployed site will use the same custom canvas viewer.

## Galleries
Event galleries are rendered only when an event has one or more image paths in `data.js`. Empty galleries are completely omitted; no placeholder or instruction block is shown.

## Page headings
The visual page-heading copy is centralized in `data.js` under `pageCopy`, including the reference-inspired About, Skills, and Selected Projects headings.

### Event galleries
Gallery image paths are configured directly on their corresponding events in `data.js`:
- `Industrial Visit — MongoDB` → `assets/galleries/MongoDB_Vist/`
- `Organic Farming Awareness` → `assets/galleries/organic_farming/`

The gallery component renders only when an event has at least one image. Keep the filenames and folder structure unchanged, or update the paths in `data.js`.

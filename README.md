# Petsit printable care sheets (Eleventy)

Minimal static site generator that turns one JSON file per dog into a printable, A4-friendly care sheet.

## Requirements
- Node.js 18+ recommended

## Install

```bash
npm install
```

## Run locally

```bash
npm run dev
```

Or, equivalently:

```bash
npx @11ty/eleventy --serve
```

## Deploy to Vercel
This builds to a static output folder (`_site`).

- **Build command**: `npm run build`
- **Output directory**: `_site`

No client-side JavaScript is used; the output is pure HTML + CSS.


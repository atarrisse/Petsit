# Petsit

Petsitting business management platform — dog profiles, bookings, invoicing, and owner portal.

**Product docs:** [`docs/product/`](docs/product/README.md) (overview, roadmap, requirements)

**Legacy (archived):** Printable care sheets via Eleventy (`npm run dev`) — superseded by the platform rebuild. Old planning docs are in [`docs/archive/`](docs/archive/README.md).

## Requirements

- Node.js 18+ (Eleventy care sheets, tooling)
- Python 3 + Docker (backend — see [`backend/README.md`](backend/README.md))

## Install

```bash
npm install
```

`npm install` enables a **pre-commit** hook (Husky) that runs Prettier on staged files. CI still runs `npm run format:check` on push.

## Run locally

```bash
npm run dev
```

Or, equivalently:

```bash
npx @11ty/eleventy --serve
```

## Deploy to GitHub Pages

This repository deploys automatically to GitHub Pages on pushes to `main` using GitHub Actions.

- **Live site**: `https://atarrisse.github.io/Petsit/`

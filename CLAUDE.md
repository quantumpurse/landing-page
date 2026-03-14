# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Landing page for Quantum Purse, a quantum-resistant desktop wallet for the CKB blockchain. The page includes a SPHINCS+ binary signature verifier that runs entirely in the browser using the `@noble/post-quantum` library.

## Build Commands

```bash
bun run build          # Build both CSS and JS (runs build:css then build:ts)
bun run build:css      # Compile Tailwind CSS to dist/styles.css
bun run build:ts       # Bundle TypeScript with esbuild to dist/main.js
bun run serve          # Start local HTTP server (serves from project root)
```

Watch modes for development (run in separate terminals):
```bash
bun run watch:css      # Tailwind CSS watch mode
bun run watch:ts       # esbuild watch mode
```

## Architecture

This is a static site with no framework. The build produces two output files in `dist/`:

- **`index.html`** - Single-page HTML with all sections (hero, features, security, binary verifier, installation). Contains two inline `<script>` blocks: an ES module for SPHINCS+ verification logic and a classic script for file upload UI handling.
- **`src/main.ts`** - TypeScript source bundled by esbuild into an IIFE. Handles smooth scrolling, navbar scroll effects, intersection observer animations, code block copy buttons, and quantum particle effects. Also contains a duplicate of the SPHINCS+ verification logic (the inline module in `index.html` is the one actually used at runtime).
- **`src/styles.css`** - Tailwind CSS source with custom component classes (`gradient-text`, `card-hover`, `quantum-glow`).

The `@noble/post-quantum` library is loaded via an import map in `index.html` pointing directly into `node_modules/`. It is not bundled by esbuild.

## Tailwind Configuration

Custom color palette defined in `tailwind.config.js`:
- `quantum-primary`: `#1e40af` (blue)
- `quantum-secondary`: `#7c3aed` (violet)
- `quantum-accent`: `#06b6d4` (cyan)
- `quantum-dark`: `#0f172a` (dark slate)

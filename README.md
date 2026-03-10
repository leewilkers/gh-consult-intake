# Ethics Consultation Request Portal

Demo of a client-facing ethics consultation intake system with AI-augmented context surfacing.

**Live demo**: [GitHub Pages URL after deployment]

## What This Demonstrates

**Client submits request → System surfaces relevant context → Consultant gets pre-populated intake**

The differentiator: the moment a request lands, the system shows relevant prior work, applicable frameworks, recent literature, and suggested engagement type. Hours of consultant preparation in seconds.

## Pages

| Page | Purpose |
|------|---------|
| `index.html` | Landing page — service overview, how it works, CTAs |
| `request.html` | Client request form — plain language, no jargon |
| `review.html` | **Preliminary context scan** — simulated AI surfacing of documents, frameworks, literature, and concepts |
| `intake.html` | Consultant intake wizard — 7-step diagnostic tool, pre-populated from client submission |

## Design System

- **Client pages** (index, request, review): Navy (#1e3a5f) / Amber (#d97706) — institutional trust
- **Consultant intake**: Stone / Goldenrod — distinct visual identity for internal tool

## Data Flow

```
request.html → localStorage → review.html → localStorage → intake.html
```

No server required. All data flows through browser localStorage within a session.

## Running Locally

Open `index.html` in any browser. No build step.

Or serve with any static server:
```bash
npx serve .
# or
python3 -m http.server 8000
```

## Deploying to GitHub Pages

1. Push to `main` branch
2. Settings → Pages → Source: Deploy from branch → `main` / `/ (root)`
3. Site publishes at `https://leewilkers.github.io/gh-consult-intake/`

## Dependencies

- [SheetJS](https://sheetjs.com/) (CDN) — Excel export on the review page
- Everything else is vanilla HTML/CSS/JS

## Architecture

```
gh-consult-intake/
├── index.html
├── request.html
├── review.html
├── intake.html
├── css/
│   └── styles.css        # Shared design system (navy/amber)
├── js/
│   ├── shared.js         # E() helper, localStorage bridge, nav, export
│   ├── request.js        # Form logic, example pre-fill, validation
│   ├── review.js         # Simulated context scan, topic detection, triage
│   └── intake.js         # Consultant wizard, pre-population from request
└── README.md
```

## Context Surfacing (Review Page)

The review page demonstrates what would happen with real integrations:

- **Key Concepts**: NLP-detected terms and themes from the request text
- **Internal Documents**: Google Drive search for prior consultations and policies
- **Frameworks**: Matched ethical guidelines and professional standards
- **Literature**: Academic database search for recent relevant publications
- **Triage**: Suggested engagement type, complexity assessment, timeline

Currently uses keyword-matching against a curated topic database. In production, these would be backed by Google Drive search, academic database queries, and embeddings-based semantic search.

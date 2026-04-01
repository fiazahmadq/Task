---
name: NexusAI Project Conventions
description: Stack, file structure, and key patterns for the NexusAI frontend
type: project
---

NexusAI is an AI model marketplace built with Next.js 16.2.2 App Router, MUI v7, Zustand v5, and TypeScript. No TanStack Query, Axios, or Formik.

**Why:** Full frontend implementation for a marketplace showcasing 30+ AI models from 12 labs.

**How to apply:** Follow these conventions when adding any new pages or components.

## Key patterns
- All pages use `'use client'` (MUI requires it)
- Data lives in `src/data/models.json` — Model interface includes: id, name, provider, description, tags, rating, reviewCount, price, badge?, icon, contextWindow?, speed?, category?
- Labs constant (emoji + name + count) is duplicated in home page and marketplace page — keep in sync if adding labs
- `useStore` (Zustand) holds: searchQuery, activeCategory, activeModelId, chatMessages
- ModelCard accepts optional `onLearnMore?: (model) => void` — marketplace page manages modal state and passes this down
- ModelDetailModal is a full-screen Dialog with 4 tabs: Details | How to Use | Pricing | Reviews

## Component locations
- `src/components/marketplace/ModelCard.tsx` — card with onLearnMore prop
- `src/components/marketplace/ModelDetailModal.tsx` — detail dialog (tabs)
- `src/components/layout/Navbar.tsx` — sticky nav

## Routing
- `/` — home (hero, stats bar, featured models, labs grid, budget tiers, actions grid, trending, use cases, newsletter)
- `/marketplace` — filter sidebar + labs bar + model grid + detail modal
- `/chat` — 3-col: model list | chat | active model info panel + prompts + quick actions
- `/discover` — hero + trending + new releases timeline + category grid + lab activity feed
- `/agents` — agent builder + templates

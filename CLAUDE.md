# NexusAI Project — Agent Conventions

## Stack
Next.js 14 App Router · TypeScript · MongoDB · Redis · Socket.io · Tailwind · shadcn/ui · Zustand · TanStack Query

## Rules
- All API routes return `{ data, error, meta }` envelope
- All API routes are versioned under `/api/v1/`
- Use Zod schemas as the single source of truth for FE+BE validation
- Never put business logic in route handlers — use service layer
- Never access DB from components — always through API or RSC
- All new components go in `src/features/{feature}/components/`
- Zustand stores = client state only; TanStack Query = server state
- All auth is via NextAuth; never roll custom JWT logic
- Rate limit config: auth=10/min, chat=60/min, search=100/min
- Log with Pino; never console.log in production code
- Soft delete all user-generated content (isActive: false)

## Agent Assignment
- frontend-dev: `src/app/`, `src/features/*/components/`, `src/features/*/hooks/`, `src/store/`
- backend-dev: `src/app/api/`, `src/lib/`, `src/features/*/services/`
- ai-logic-agent: `src/lib/ai/`, `src/features/recommendations/`, `src/lib/socket/handlers/`

# Next.js AI Agents — Reference

Source: https://nextjs.org/docs/app/guides/ai-agents

## Bundled docs layout

```txt
node_modules/next/dist/docs/
├── 01-app/
│   ├── 01-getting-started/
│   ├── 02-guides/
│   └── 03-api-reference/
├── 02-pages/
├── 03-architecture/
└── index.mdx
```

## AGENTS.md managed block (Next.js ≥ 16.3)

Next.js auto-generates this block when `next dev` detects an AI agent and no managed block exists:

```md
<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
```

`CLAUDE.md` typically contains `@AGENTS.md`.

## Opting out of auto-generation

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  agentRules: false,
}

export default nextConfig
```

## Version matrix

| Version | Bundled docs | AGENTS.md auto-gen | Setup |
|---------|--------------|-------------------|-------|
| ≥ 16.3 | Yes | Yes (on `next dev`) | Run `next dev` |
| 16.2 | Yes | No | Add `AGENTS.md` manually |
| ≤ 16.1 | No | No | `npx @next/codemod@canary agents-md` |

## Official workflow skills — prerequisites

| Skill | Prerequisites |
|-------|---------------|
| `next-dev-loop` | Running `next dev` |
| `next-cache-components-adoption` | None (enables flag as step 1) |
| `next-cache-components-optimizer` | Route already builds with Cache Components |
| `next-partial-prefetching-adoption` | Cache Components adopted + production-like build |

## MCP server tools

Endpoint: `/_next/mcp` (when dev server is running)

- `get_compilation_issues` — compilation errors without full build
- `compile_route` — check if a specific route compiles

## agent-browser

CLI exposing browser state as structured text for agents:

```bash
agent-browser open --enable react-devtools <url>
agent-browser react tree
```

Used by `next-dev-loop` for component tree and Suspense boundary inspection.

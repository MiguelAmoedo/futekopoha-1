---
name: nextjs-ai-agents
description: >-
  Guides AI coding agents working on Next.js projects — bundled version-matched
  docs, AGENTS.md setup, dev-server runtime visibility, error-driven fixes, and
  official Next.js workflow skills. Use when writing or debugging Next.js/App
  Router code, configuring AGENTS.md, running next dev/build, fixing prerender
  or Cache Components errors, adopting Partial Prefetching, or when the user
  mentions Next.js AI agents, bundled docs, or next-dev-loop.
metadata:
  source: https://nextjs.org/docs/app/guides/ai-agents
  version: "1.0"
---

# Next.js AI Agents

Four pillars for effective Next.js agent work: **bundled docs**, **runtime visibility**, **error-driven fixes**, and **workflow skills**.

## 1. Use bundled docs (not training data)

Next.js ships version-matched docs at `node_modules/next/dist/docs/` (resolve from the project root; in monorepos the `next` package may not be at repo root).

**Before writing Next.js code**, read the relevant guide there. Training data may be stale — this version may have breaking API, convention, and file-structure changes.

### AGENTS.md setup

| Scenario | Action |
|----------|--------|
| New project (`create-next-app@canary`) | `AGENTS.md` + `CLAUDE.md` generated automatically |
| Existing project (Next.js ≥ 16.3) | Run `next dev` — auto-upserts managed block in `AGENTS.md`/`CLAUDE.md`; content outside `<!-- BEGIN:nextjs-agent-rules -->` markers is preserved |
| Next.js 16.2 | Docs bundled; add `AGENTS.md` manually pointing to `node_modules/next/dist/docs/` |
| Next.js ≤ 16.1 | Run `npx @next/codemod@canary agents-md` (downloads to `.next-docs/`) |
| Opt out | Set `agentRules: false` in `next.config` |

Skip agent files on new projects: `create-next-app@canary --no-agents-md`.

### Network docs (fallback)

- Append `.md` to any `nextjs.org/docs/...` URL for Markdown
- Index: `https://nextjs.org/docs/llms.txt`
- Per-error pages under `/docs/messages/` are **not** bundled — fetch over network when needed

## 2. Runtime visibility

Run `next dev` and verify against the live server. Client errors, warnings, and rendered output live in the browser — surface them to the terminal.

| Mechanism | Purpose |
|-----------|---------|
| `logging.browserToTerminal` | Forwards browser console errors/warnings to terminal |
| `.next/dev/lock` | PID, port, URL — avoid duplicate dev servers |
| `/_next/mcp` MCP server | Routes, server logs, `get_compilation_issues`, `compile_route` |
| `agent-browser` CLI | DOM, console, network, Web Vitals as structured text; `react tree` with `--enable react-devtools` |

**Inspect → edit → verify** loop: prefer the `next-dev-loop` skill (see §4) over guessing from static code alone.

## 3. Let errors drive fixes

With Cache Components enabled, blocking errors show labeled fixes with trade-offs. The dev overlay **Copy prompt** button packages a paste-ready prompt for the agent.

Terminal and `next build` output show the same menu:

```txt
Ways to fix this:
  - [stream] Provide a placeholder with <Suspense fallback={...}>
  - [cache] Cache the data access with "use cache"
  - [block] Set export const instant = false
Learn more: https://nextjs.org/docs/messages/blocking-prerender-dynamic
```

**Agent workflow on errors:**

1. Read the `Learn more` link (`/docs/messages/...`) — canonical patterns, trade-offs, gotchas
2. Apply the chosen fix pattern from the error page
3. Verify at runtime via `next dev` (stack frames resolve to source in dev)
4. For build-only failures: `next build --debug-prerender` enables server source maps

Write failing `instant()` tests before the fix; confirm they pass after.

## 4. Workflow skills (multi-step tasks)

Framework knowledge lives in bundled docs — **not** in skills. Skills cover repeatable workflows. Install from the Next.js repo:

```bash
npx skills add vercel/next.js --skill <skill-name>
```

| Skill | Type | Use when |
|-------|------|----------|
| `next-dev-loop` | Runtime foundation | After every edit, verify page works at runtime via MCP + browser |
| `next-cache-components-adoption` | Interactive | Migrate app to Cache Components (flag on → fix routes → check in per feature) |
| `next-cache-components-optimizer` | Unattended loop | Make a route's UI instant at click time via `instant()` test + refactor |
| `next-partial-prefetching-adoption` | Interactive | Adopt Partial Prefetching (requires Cache Components + production-like build) |

Browse source: [vercel/next.js skills on skills.sh](https://skills.sh).

### Example prompts

```prompt
After every edit, verify the page still works at runtime using the next-dev-loop Skill.
```

```prompt
Adopt Cache Components in this project using the next-cache-components-adoption Skill.
```

```prompt
Make the navigation from /settings to /dashboard instant using the next-cache-components-optimizer Skill. The header and the project list should be part of the instant UI.
```

```prompt
Adopt Partial Prefetching in this project using the next-partial-prefetching-adoption Skill.
```

## Agent checklist

When starting Next.js work:

- [ ] Confirm `AGENTS.md` exists and points to `node_modules/next/dist/docs/`
- [ ] Read the relevant bundled guide before coding
- [ ] Run `next dev` (or connect to existing server via `.next/dev/lock`)
- [ ] Read terminal + MCP compilation issues after edits
- [ ] On errors: fetch `/docs/messages/...`, apply canonical fix, verify runtime
- [ ] For multi-step migrations: install and follow the matching official skill

## Additional resources

- [Next.js MCP Server docs](https://nextjs.org/docs/app/guides/mcp)
- Version-specific details: [reference.md](reference.md)

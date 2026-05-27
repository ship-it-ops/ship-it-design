---
type: decision
status: active
created: 2026-05-21
updated: 2026-05-21
author: claude-opus-4-7
tags: [meta, agent-context, onboarding]
importance: core
---

# Initialized docs/agent/ for cross-session agent handoff

## Context

Multiple agents work on this monorepo across branches (e.g., `next-phase`, feature
branches). Static rules live in `CLAUDE.md` / `AGENTS.md`, but there was no shared
place to capture _dynamic_ state — half-finished plans, decisions and their rationale,
in-flight work by sibling agents, open questions, and incident scars. Without it,
agents repeatedly re-derive context from `git log` and code reading, and sometimes
collide on overlapping work.

## Decision

Adopt `docs/agent/` as the committed, repo-local handoff layer for AI agents, using
the `ship-agent-context` skill conventions. Layout:

- `decisions/` — architecture, library, configuration choices with rationale
- `plans/` — implementation plans, active and historical
- `investigations/` — bug hunts and root cause analyses
- `patterns/` — codebase conventions discovered by agents
- `status/` — in-flight work, cleared on completion
- `open-questions/` — blockers awaiting human/maintainer answers
- `scars/` — incidents and tripwires
- `archive/` — superseded/deprecated content

`MANIFEST.md` is the index every agent reads at session start.

## Alternatives Considered

- **Do nothing, rely on `git log` + `CLAUDE.md`**: rejected — git captures _what_
  changed, not _why_, and `CLAUDE.md` is for static rules, not in-flight state.
- **Use an external knowledge base (Notion, Obsidian)**: rejected for this layer —
  branch-local context belongs in-repo so every agent on every branch sees the
  same snapshot. External vaults are still useful for cross-repo knowledge.
- **Per-session journals**: explicitly excluded by the skill design; routine
  chronological logs duplicate `git log`.

## Consequences

- Every new session must read `docs/agent/MANIFEST.md` and all of `status/` before
  beginning work (enforced by the `ship-agent-context` skill).
- Decisions, plans, root causes, and scars worth >5 minutes of re-derivation get
  written immediately on the milestone, not deferred to end-of-session.
- `MANIFEST.md` entries change frequently — concurrent agents touching it on the
  same branch can collide; resolve with normal merge conflict handling.
- Static rules that emerge from a decision (e.g., "standardize on pnpm") still
  belong in `CLAUDE.md` / `AGENTS.md`, not here. This folder links to them.

## Revisit Triggers

- If the team adopts a different agent-context tool (MCP-based vault, external
  service) that supersedes the file-based approach.
- If `MANIFEST.md` grows past ~100 entries — split per-section per the skill's
  scaling guidance.
- If `status/` entries routinely go stale (>14 days untouched), revisit the
  write/cleanup discipline.

## Related

- (none yet — first entry)

---
type: instruction
status: active
created: 2026-06-14
updated: 2026-06-14
author: claude-opus-4-8
source: user-instruction
scope: always
tags: [git, commits, workflow]
importance: core
---

# Never include an agent signature in commit messages

## Instruction

Never add a `Co-Authored-By: Claude ...` trailer (or any other "generated
by / authored by Claude / Anthropic" signature) to git commit messages in
this repo.

## How to apply

When writing any `git commit` message, stop at the final body line. Do NOT
append the `Co-Authored-By: Claude ...` trailer the default harness
guidance would otherwise add. This overrides that default. PR bodies are
not covered by this rule unless the user says so.

## Source

- Session: 2026-06-14 (carousel fix-scroll branch)
- Captured from: "add to repo memory the instruction to never include your
  signature in commits"

## To revoke

Say "you can sign commits again" or "drop the no-signature rule".

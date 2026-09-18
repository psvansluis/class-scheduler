---
id: 011
title: Complete migration to Typescript 7
status: open # open | in-progress | closed
priority: low # low | medium | high
assignee:
labels: []
created: 2026-09-18
---

# 011 - Complete migration to Typescript 7

## Dependencies

Blocked by:

- Release of TypeScript 7.1
- Support for TypeScript 7 in `vue-tsc`

## Description

When vue-tsc releases native TS 7+ support:

Update package.json:
Point typescript directly to ^7.1.0:

`"typescript": "^7.1.0"`

Delete the `"typescript-7"` entry.
Upgrade `vue-tsc` to the version supporting native TS 7.
Remove or simplify the temporary `"typecheck:ts7"` script.
Run `npm install` and verify `npm run build`.

## Acceptance Criteria

- [ ] All references to Typescript 6 are removed
- [ ] All typechecks and pipelines continue to work as before

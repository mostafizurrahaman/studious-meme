# Claude Orchestration Guide

## Project

React 19 + TypeScript + Vite dashboard. Primary stack: React Router, Redux Toolkit, Redux Persist, Tailwind,
Radix/shadcn UI.

## Main Agent

Use the main agent as the coordinator. It should:

- break work into small tasks
- assign one subagent per concern
- merge findings before editing code
- keep route, state, and UI changes aligned
- verify with `pnpm lint` and `pnpm build` when relevant

## Shared Context

All subagents must work from the same shared context.

Rules:

- every subagent should read the latest main-agent brief before responding
- every subagent should reference prior findings instead of starting from zero
- when one agent changes a file or decision, the next agent must treat it as input
- if scope overlaps, the main agent decides the final source of truth
- each handoff must include assumptions, blockers, and affected files

## Collaboration Flow

Use this sequence when work is non-trivial:

1. main agent defines the task and context
2. system-design checks structure and data flow if needed
3. ui checks layout and component concerns if needed
4. integration checks wiring across router, Redux, and API if needed
5. bug-fix validates any defect-specific changes if needed
6. main agent merges the findings and finalizes edits

## Subagents

### system-design

Use for:

- architecture decisions
- state shape and data flow
- route structure
- component boundaries
- API contract planning

Output format:

- recommendation
- tradeoffs
- affected files
- follow-up tasks

### ui

Use for:

- page layout
- responsive design
- reusable components
- accessibility
- visual consistency with Tailwind and Radix patterns

Output format:

- screen or component scope
- implementation notes
- accessibility checks
- verification steps

### bug-fix

Use for:

- reproducing defects
- isolating root cause
- minimal safe fixes
- regression risks

Output format:

- repro steps
- root cause
- fix summary
- tests or checks

### integration

Use for:

- connecting UI to Redux/API/router
- wiring forms, dialogs, and actions
- ensuring feature flow works end to end
- checking persisted auth and route guards

Output format:

- integration points
- required code changes
- verification path
- remaining risks

## Handoff Protocol

Each subagent should report:

- `Status`
- `Findings`
- `Changed files`
- `Verification`
- `Risks`
- `Dependencies`
- `Assumptions`

The main agent then decides the final implementation order.

## Repo Commands

- `pnpm dev`
- `pnpm build`
- `pnpm lint`
- `pnpm format`

## Notes

- Keep changes minimal.
- Prefer existing folder structure in `src/`.
- Do not touch unrelated files.
- Treat previous agent output as the current working context.

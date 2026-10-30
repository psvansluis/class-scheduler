# Project: Class scheduler

## Testing instructions

- Prolog unit tests may be written liberally
- Restrict unit testing for TypeScript functions to complex functions.
- Write E2E tests when a change affects routing, browser workflows, or interaction between the UI and Prolog engine

## TypeScript instructions

- Prefer functional idiom over imperative
- Prefer function declaration with `const`-assigned arrow expressions over `function`
- Prefer expression bodies over block bodies where possible
- Function files should export only the bare necessary amount of functions for the domain to function.
- Function files may not maintain mutable state. They may, however, pass on state to Vue components or DOM.

## Vue instructions

- Prefer `v-for` over repeated element declarations within a component. Use inline objects if you must.
- The project uses `shadcn-vue` as a design system. If a new component is required, see if a relevant component can be found at <https://ui.shadcn.com/docs/components>. Prefer this over writing elaborate front-end logic yourself.
- A component should not be too big. Consider splitting a component if it contains >50 lines between `<template>` tags. Components with more than 100 lines between `<template>` tags must be split.

## Prolog and TypeScript boundary

- Keep the boundary data-oriented: TypeScript should pass input as tagged rows through the typed query-binding API instead of interpolating user data into Prolog source text.
- Keep form-to-row conversion in TypeScript, and let a Prolog adapter validate and translate those external rows into domain facts. Keep the row tags and their atom-based slugs consistent across both sides.
- Export schedule results as flat rows with scalar fields. Type the query binding in TypeScript and map those rows into application models there; avoid making TypeScript parse nested Prolog compound terms.
- Keep the public query entry points in `prolog/rules.pl`, domain predicates and solver logic in `prolog/domain/scheduler_domain.pl`, and representation conversion in `prolog/adapters/schedule_io.pl`.
- When adding or renaming Prolog assets, update both `PROLOG_ASSET_MANIFEST` in `vite.config.ts` and `PROLOG_FILES` in `src/functions/processForm.ts`. Preserve the `/prolog/` directory structure when copying assets into the SWI virtual filesystem before consulting `/prolog/rules.pl`.

## Prolog tests

- Keep domain tests in `prolog/tests/domain_tests.pl`; import the domain module directly and test its predicates using native domain facts.
- Keep boundary and wiring tests in `prolog/tests/boundary_tests.pl`; load the public `rules.pl` entry point and cover tagged-row input, result flattening, and module integration.
- Run the test suites separately so domain behavior can be diagnosed independently from the TypeScript/Prolog representation boundary.
- If a change affects the UI-to-Prolog workflow, add or update an E2E test as described above.

## Verification steps before finishing

- Build the project with `npm run build`
- Test the project with `npm run test`
- Format the project using `npm run format`
- Lint the project using `npm run lint`

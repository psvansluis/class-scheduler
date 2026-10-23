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

## Verification steps before finishing

- Build the project with `npm run build`
- Test the project with `npm run test`
- Format the project using `npm run format`
- Lint the project using `npm run lint`

# Repository guidance

Read this guide end-to-end before starting a task. Re-skim it when requirements shift or major decisions arise.

## Workflow

- Study the existing architecture, patterns, and conventions before planning changes. Prefer repository evidence; consult external documentation when needed.
- Do not start building until the user asks for implementation.
- Search for existing utilities, helpers, components, and patterns before writing new code. Reuse or extend them before introducing abstractions.
- Prioritize consistency, then simplicity. Ask the user when there is a meaningful trade-off between approaches.
- Research dependencies and confirm their fit with the user before adding one.
- Treat Git status and diffs as read-only evidence. Never revert changes or assume missing changes were yours.
- Never push or open a pull request unless the user explicitly asks.

## Architecture

This is a TypeScript browser extension with a Lit settings UI and Rollup builds for Chrome and Firefox. There is no backend implementation in this repository.

- `src/background.ts` wires browser events to task creation and settings.
- `src/controllers/` coordinates user actions, models, API calls, and icon feedback.
- `src/models/` contains task serialization, URL rules, project data, and persisted state. `Model<T>` integrates local storage with the observer in `src/lib/observer/`.
- `src/api/extension/` wraps browser storage, tabs, icons, and manifest access. Browser integration uses the `chrome` namespace in both builds.
- `src/api/todoist/` handles API tokens, authenticated requests, and API errors. `src/api/misc/` calls the external project-guessing and analytics service.
- `src/views/settings/` contains feature-specific settings components. Reuse the `tc-*` elements in `src/views/common/system/` and existing shared styles.
- `src/html/` contains the settings shell; `assets/manifest/` contains browser-specific manifests.
- Unit tests live beside source files as `*.test.ts`; Playwright tests and fixtures live in `e2e/`.

Keep behavior in its existing layer. Follow the current controller/model/observer flow and Lit component registration and event patterns.

## Code quality

- Write idiomatic, simple TypeScript consistent with surrounding code and strict compiler settings.
- Follow `biome.json`: four-space indentation, single quotes in JavaScript/TypeScript, and semicolons only as needed. Use the configured import organization.
- Prefer the best design consistent with the codebase, even if it touches more files. For equivalent designs, prefer fewer moving parts and a smaller API surface.
- Keep high-level behavior above implementation details. In classes, prefer constructor, public methods, then private helpers; follow top-down call flow when practical.
- Fix root causes instead of adding workarounds.
- Remove unused code and parameters and update callers. Do not add backward compatibility unless requested.
- Do not leave breadcrumb comments after deleting, moving, or renaming code.
- Preserve Lit custom-element registration imports even when they have no imported bindings.

## Bundle size

Bundle size is a high priority. Aim to never increase it between releases. Consider the size impact of code, assets, and dependencies, and prefer solutions that keep the extension small. Before a release, compare production bundle and ZIP sizes for each browser against the previous release using the same build process. Investigate increases and look for reductions that offset them; call out any remaining increase and its reason.

## Behavior to account for

- Task content is the page title formatted as a Markdown link to the page URL.
- URL rules use the first stored match. Contains matching is case-sensitive; exact matching is case-insensitive. A matching rule is used as a whole, without merging the default rule.
- Project guessing runs only when the default rule applies and the option is enabled. Failed or empty suggestions fall back to the configured project.
- Failed submissions retain the page title and URL; retrying recomputes settings from the current rules.
- API tokens and extension state use `chrome.storage.local`. Keep real tokens and personal data out of source, logs, and test fixtures.
- Changes to project guessing or analytics should keep the README's data-sharing description accurate.

## Commands and validation

Use the Node.js version in `.nvmrc` and `npm ci` with the committed `package-lock.json`.

| Command | Use |
| --- | --- |
| `npm run dev:chrome` / `npm run dev:firefox` | Rebuild on source changes for manual browser testing. |
| `npm test` | Run unit tests with Vitest. |
| `npm run lint` | Check formatting and lint rules with Biome. |
| `npx tsc --noEmit` | Check TypeScript without emitting files. |
| `npm run knip` | Check for unused files, exports, and dependencies. |
| `npm run e2e` | Build Chrome and run Playwright settings tests. |
| `npm run build:chrome` / `npm run build:firefox` | Validate and package a browser build. |

Run checks appropriate to the change. For code changes, run lint, type checking, and relevant unit tests. For settings UI or browser integration changes, run applicable end-to-end tests and verify the affected browser build. Report what ran and any checks that could not run. Documentation-only changes need link, command, and diff checks, not application tests.

Playwright requires its Chromium installation (`npx playwright install chromium`) and a graphical session because the fixture uses `headless: false`. Follow the existing mocked Todoist request patterns; tests should not need real credentials. `npm run e2e:ui` does not build the extension, so build Chrome first.

Both browser variants write to `dist/`; do not run builds or watchers concurrently. Edit source manifests, not generated output. Keep `__VERSION__` in source manifests: Rollup substitutes the version from `package.json`. Do not commit generated `dist/`, `packages/`, or test reports.

`npm run test:all` removes `dist/` and `packages/` after successful tests. Release scripts also bump the version and create a Git commit and tag; use them only when the user asks for a release.

## Collaboration and tools

- Be direct and technical. Explain incorrect assumptions or suboptimal approaches and propose better alternatives.
- Respond to numbered review feedback point-by-point, marking each item addressed or deferred.
- Prefer `rg` and `rg --files` for searches, `gh` for GitHub access, and `git log` or `git blame` when history would help.
- Keep each PR description paragraph or bullet on one line; let GitHub soft-wrap the prose.

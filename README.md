# Todoist One-Click

A browser extension that saves the active tab to Todoist with one click. The task contains the page title linked to its URL. Chrome and Firefox builds use Manifest V3.

## Features

- Capture a tab from the extension's toolbar button or the configurable **Add tab as task** keyboard command.
- Choose a default project, labels, and due date. The initial due date is `today`.
- Create URL rules with their own project, labels, and due date.
- Enable **Guess the project** to suggest a destination when no URL rule matches, falling back to the default project if no suggestion is available.
- Retry or discard failed task submissions from settings.

## Local setup

Use the Node.js version in [.nvmrc](.nvmrc) and install dependencies from the lockfile:

```sh
nvm install
nvm use
npm ci
```

If you do not use nvm, install the version specified in `.nvmrc` through your preferred Node.js manager.

### Chrome

```sh
npm run dev:chrome
```

1. Open `chrome://extensions/` and enable **Developer mode**.
2. Choose **Load unpacked** and select this repository's `dist/` directory.
3. Pin the extension for quick access to its toolbar button.

### Firefox

```sh
npm run dev:firefox
```

1. Open `about:debugging#/runtime/this-firefox`.
2. Choose **Load Temporary Add-on** and select `dist/manifest.json`.
3. Repeat the temporary installation after restarting Firefox.

Both development commands watch source files and rebuild `dist/`. Reload the extension in the browser after changes, and refresh any open settings page. Run only one browser build or watcher at a time: both use the same output directory.

## Configure and use

The settings page opens on first installation. You can reopen it from the extension's **Settings…** context-menu item.

1. Follow the link in settings to obtain your Todoist API token, paste it into the extension, and save it.
2. Configure the target project, labels, and due date. Clear the due date if new tasks should have none.
3. Optionally add URL rules or enable **Guess the project**.
4. Visit a page and click the extension's toolbar button to create a task. The icon indicates loading, success, or failure.

No keyboard shortcut is assigned by default. Assign the **Add tab as task** command through your browser's extension shortcut settings.

URL rules are checked in stored order, and the first match supplies the task settings. **Contains** is case-sensitive; **matches exactly** is case-insensitive. If nothing matches, the default rule applies. A matching rule supplies its own settings rather than inheriting missing fields from the default rule.

When a task submission fails, the settings page opens with the failed task. Use **Retry** to submit it again using the current rules, or **Discard** to remove it from the failed-task list.

## Data and external services

The extension stores the API token, settings, cached projects, and failed tasks in `chrome.storage.local`. It sends authenticated requests to Todoist's API at `https://api.todoist.com/api/v1` to load projects and create tasks.

When **Guess the project** is enabled and no URL rule matches, the extension sends project names, the page title, and its URL to `https://tdoneclick.pereiravalente.com/guess_project`. After successful task creation, it sends the extension version, browser language, whether project guessing is enabled, and the Todoist user ID to the same service's `/register_event` endpoint. That event is sent even when project guessing is disabled. The service implementation is outside this repository.

## Development commands

| Command | Purpose |
| --- | --- |
| `npm run dev:chrome` / `npm run dev:firefox` | Watch and rebuild the extension for one browser. |
| `npm test` | Run Vitest unit tests. |
| `npm run test:watch` | Run unit tests in watch mode. |
| `npm run lint` | Check formatting and lint rules with Biome. |
| `npx tsc --noEmit` | Type-check source and end-to-end tests. |
| `npm run knip` | Check for unused files, exports, and dependencies. |
| `npm run e2e` | Build for Chrome and run Playwright tests. |
| `npm run e2e:ui` | Open Playwright's UI using the existing `dist/` build. |
| `npm run test:all` | Run unit and end-to-end tests, then remove `dist/` and `packages/` on success. |
| `npm run build:chrome` / `npm run build:firefox` | Build and package the extension for one browser. |
| `npm run build:all` | Build and package both browser variants. |

Before the first end-to-end run, install Playwright's Chromium browser:

```sh
npx playwright install chromium
npm run e2e
```

The Playwright fixture launches a visible Chromium window, so it requires a graphical session. Tests use mocked Todoist responses and placeholder tokens. For UI mode, run `npm run build:chrome` first. Reports are written to `e2e/html-report/`, with test artifacts in `e2e/test-results/`.

Production builds create `dist/` and `packages/tdoneclick-<browser>-<version>.zip`. The version comes from `package.json` and replaces `__VERSION__` in the selected manifest. After `build:all`, `dist/` contains the Firefox build and `packages/` contains both archives.

The `release:major`, `release:minor`, and `release:patch` scripts run all tests, invoke `npm version` to bump the version and create a Git commit and tag, then build both packages. They do not publish the extension to browser stores.

## Project structure

| Path | Responsibility |
| --- | --- |
| `src/background.ts` | Browser installation, toolbar, context-menu, and keyboard-command handlers. |
| `src/controllers/` | Task creation and settings actions. |
| `src/models/` | Stored state, project data, URL rules, and task payloads. |
| `src/api/` | Browser API wrappers, Todoist requests, project guessing, and analytics. |
| `src/lib/observer/` | Shared observer implementation used by models and settings. |
| `src/views/settings/` | Settings UI built with Lit custom elements. |
| `src/views/common/` | Shared UI elements, styles, and SVG assets. |
| `src/html/` | Settings page shell and global stylesheet. |
| `src/types/` | Shared TypeScript types. |
| `assets/` | Browser manifests and extension icons. |
| `e2e/` | Playwright configuration, extension fixture, and settings tests. |

See [AGENTS.md](AGENTS.md) for repository workflow and coding guidance.

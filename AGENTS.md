# Repository Guidelines

## Project Structure

This repository is a small React 19 application built with Vite. Application code and styles live in `src/`: `App.jsx` contains the main interface, `main.jsx` mounts the app, and `App.css` / `index.css` provide component and global styling. Static files served as-is belong in `public/`; imported image and other source assets belong in `src/assets/`. `index.html` is Vite's page entry point. `REQUIREMENTS.md` describes the intended game behavior.

## Build, Test, and Development

- `npm install` installs the dependencies recorded in `package-lock.json`.
- `npm run dev` starts the Vite development server with hot reload.
- `npm run build` creates the production bundle in `dist/`.
- `npm run preview` serves the production bundle locally after building.
- `npm run lint` runs ESLint across the repository.

There is no test script configured currently. Vitest and Testing Library are dependencies; when adding tests, wire a script into `package.json` and document the command here.

## Coding Style

Use JavaScript ES modules and React function components with hooks. Follow the existing single-quoted JavaScript style, omit semicolons, and use two spaces for indentation. Use `.jsx` for files containing JSX and `.css` for styles. Name React components in PascalCase and variables/functions in camelCase. Keep game rules in clear, focused functions and keep presentation styles with their relevant component where practical. Run `npm run lint` before submitting changes.

## Testing Guidelines

For behavior changes, add focused tests for the affected interaction or game rule (such as turn switching, win/draw detection, undo, or computer moves). Use Vitest with React Testing Library, and prefer user-visible assertions over implementation details. No coverage threshold is configured.

## Commits and Pull Requests

Git history is not available in this checkout, so no established commit prefix convention can be verified. Use short, imperative commit subjects, for example `Add undo move support`. Pull requests should explain the user-visible change, list validation performed, link any related issue or requirement, and include screenshots for visual changes. Call out any known limitations.

## Configuration and Generated Files

Keep dependency versions in `package.json` and `package-lock.json` in sync. Do not commit generated `dist/` output or local dependency directories. Avoid adding secrets; browser configuration belongs in documented environment variables when needed.

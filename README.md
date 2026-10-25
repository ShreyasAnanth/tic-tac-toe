# Tic Tac Toe

A responsive browser-based Tic Tac Toe game with two-player and computer-opponent modes. The app tracks the current round and session scores locally, so a refresh restores play on the same browser.

## Tech Stack

- React 19 with JavaScript and Vite 8
- Vitest 5 for unit and hook tests
- React Testing Library, `jest-dom`, and jsdom for component and DOM testing
- ESLint for code checks

## Features

- Accessible 3×3 board with turn indication, win detection, winning-cell highlights, and draw handling.
- Two-player mode and Play Computer mode. The computer follows a strict priority: win, block, center, corner, then any open cell. It responds after 600 ms.
- Move history with move number, player, and row/column position.
- Undo removes one move in two-player mode and the human/computer pair in computer mode. Undo is unavailable after a game ends.
- Session scoreboard for X wins, O wins, and draws. Resetting a game preserves scores; Reset Scoreboard clears them.
- Game and scoreboard state persist in separate versioned `localStorage` entries. A new game keeps the selected mode and starts with an empty board.
- Responsive layout for desktop, laptop, and mobile screens, with keyboard focus indicators and reduced-motion support.

## Local Setup and Run Instructions

Requires Node.js and npm. From the repository root, install dependencies and start the development server:

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite in your browser.

## Tests and Other Commands

Run the full unit and component test suite:

```bash
npm test -- --reporter=verbose
```

Other project commands:

```bash
npm run lint       # Run ESLint
npm run build      # Create the production bundle in dist/
npm run preview    # Preview the production build locally
```

## Project Structure

- `src/components/` — board, controls, scoreboard, and move-history UI, with component tests.
- `src/hooks/useTicTacToe.js` — game state, undo, persistence, and delayed computer turns.
- `src/utils/gameLogic.js` — win/draw detection and computer move selection.
- `src/App.jsx` — composes the game UI; `src/App.css` and `src/index.css` define its styling.
- `REQUIREMENTS.md` — detailed functional requirements.

## Clarifications and Assumptions

- The app is a client-side game with no backend or API endpoints; game and score data are stored in this browser's `localStorage` only.
- `X` always starts. In computer mode, the human plays `X` and the computer plays `O`.
- Board cells use row-major indices `0–8`; history displays one-based row and column positions.
- The computer uses the required five-tier heuristic, not full-game search. Ties within a tier select the lowest row-major index.
- Computer replies wait 600 ms; pending replies are canceled when a round is undone, reset, or switched to another mode.
- Two-player undo removes the latest move. Computer-mode undo removes both moves from the last turn, or just the human move if the computer is still waiting.
- Undo is disabled after a win or draw, keeping the completed result and score final.
- `tic-tac-toe:game:v1` stores the current round; `tic-tac-toe:scoreboard:v1` stores session totals. Reset Game saves a clean round while preserving mode and scores. Reset Scoreboard removes the saved totals.

## AI-Assisted Engineering - Prompt summary

Codex was used to turn `REQUIREMENTS.md` into the game-logic module, state hook, UI components, tests, and this documentation. Prompts focused on the five-tier AI rules, mode-specific undo, scoreboard and round persistence, responsive UI, and requirement-aligned test descriptions. Verification was performed with the Vitest suite, ESLint, and a Vite production build.

## Known Limitations

- Scores and the current game are stored only in the browser's local storage; they do not sync across devices or browsers.
- The computer is a predictable priority-based opponent and is not guaranteed to play optimally.
- No code-coverage threshold or deployment target is configured. Visual behavior is not covered by automated browser tests.

## Future Improvements

- Add an optimal-play or adjustable-difficulty computer opponent.
- Add automated browser and accessibility checks across viewport sizes.
- Add optional online score synchronization if multi-device play is needed.

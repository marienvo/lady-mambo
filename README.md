# Lady Mambo

[Live demo](https://lady-mambo.marienvanoverbeek.nl/)

Een kleine grid-based “huizen bouwen” game in React + TypeScript met canvas rendering (Konva) en state (Zustand).

## Getting started

### 1) Check Node.js versie

Open een terminal in de projectmap en run:

```bash
node -v
```

Dit project werkt met **Node 24+**.

Als je Node nog niet hebt: installeer het via bijvoorbeeld Node Version Manager (nvm) of de officiële Node installer.

### 2) Check pnpm

We gebruiken `pnpm` als package manager.

```bash
pnpm -v
```

Heb je nog geen pnpm?

- Als je Node met **Corepack** komt (meestal bij moderne Node): run eenmalig:

```bash
corepack enable
```

- Daarna zou `pnpm` beschikbaar moeten zijn.

### 3) Dependencies installeren

```bash
pnpm install
```

### 4) Start de dev server

```bash
pnpm dev
```

Vite print daarna een lokale URL (meestal `http://localhost:5173`).

## Handige commands

- **Dev server**: `pnpm dev`
- **Build**: `pnpm build`
- **Typecheck**: `pnpm typecheck`
- **Tests**: `pnpm test`
- **Lint**: `pnpm lint`
- **Format (Prettier)**: `pnpm format`

## Deploy (Surge)

We deployen de `dist/` folder via Surge naar `lady-mambo.marienvanoverbeek.nl`.

- Met **npm**:

```bash
npm run deploy
```

- Met **pnpm** (let op: `pnpm deploy` is een pnpm built-in, dus gebruik `run`):

```bash
pnpm run deploy
```

De eerste keer kan Surge om login vragen (interactief) en/of domain setup.

## Project structuur (kort)

- **Domain rules (pure, testbaar)**: `src/domain/`
  - placement/rotatie/collision rules lives hier (zie `src/domain/placement.ts`)
- **State**: `src/state/`
  - Zustand store: `src/state/gameStore.ts`
  - Demo shapes: `src/state/sampleShapes.ts`
- **Canvas UI (react-konva)**: `src/ui/canvas/`
  - Stage/layers en ghost preview: `src/ui/canvas/CanvasStage.tsx`
- **Docs (spec-driven + ADRs)**: `docs/`
  - Specs: `docs/specs/`
  - ADRs: `docs/adr/`
- **Cursor rules**: `.cursor/rules/`

## Wat je ziet in de app

- Beweeg je muis: je ziet een “ghost” die **snapt** naar het grid.
- Klik: placement wordt alleen ge-commit als het **binnen het grid** is en **niet overlapt**.
- Druk op **R**: rotate (90°).

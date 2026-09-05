# UI Coding Standards

These standards govern how UI is built in this app. They are mandatory, not guidelines.

## Component library: shadcn only

- All UI components **must** use [shadcn/ui](https://ui.shadcn.com) components (config: [components.json](../components.json)).
- **No custom UI components are allowed.** Do not hand-roll buttons, inputs, dialogs, dropdowns, cards, tables, tooltips, etc. If shadcn doesn't have the primitive you need, add it via the shadcn CLI rather than writing it from scratch:

  ```bash
  npx shadcn@latest add <component>
  ```

- Installed components live under [src/components/ui/](../src/components/ui/) (alias `@/components/ui`). Import from there — never duplicate a shadcn component's markup/behavior inline.
- Compose pages and features by combining shadcn primitives in `@/components`. Styling tweaks should go through the props/variants shadcn already exposes (e.g. `variant`, `size`, `className` via `cn()` from `@/lib/utils`), not by rewriting the component.
- Icons come from `lucide-react` (the configured `iconLibrary`), matching shadcn's default.
- If a design genuinely cannot be built with a shadcn component, raise it for discussion before writing bespoke markup — don't silently introduce custom UI.

## Date formatting: date-fns only

- All date formatting in the UI **must** use [date-fns](https://date-fns.org/). Do not use `Intl.DateTimeFormat`, `Date.prototype.toLocaleDateString`, dayjs, moment, or manual string building.
- Standard display format is an ordinal day, short month, full year — e.g.:

  ```
  1st Aug 2025
  2nd Sep 2025
  3rd Aug 2026
  4th Feb 2026
  ```

- Use date-fns's `format` with the `do MMM yyyy` token, which produces the ordinal day (`1st`, `2nd`, `3rd`, `4th`, ...) automatically:

  ```ts
  import { format } from "date-fns";

  format(new Date("2025-08-01"), "do MMM yyyy"); // "1st Aug 2025"
  format(new Date("2026-02-04"), "do MMM yyyy"); // "4th Feb 2026"
  ```

- Centralize this in a shared helper (e.g. `@/lib/date.ts`) rather than inlining the format string at every call site, so the display format stays consistent across the app.

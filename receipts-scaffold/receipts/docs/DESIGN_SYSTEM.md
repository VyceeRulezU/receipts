# Design System

## Aesthetic Direction: Ledger Noir

Dark surfaces. Monochrome structure. Color only where it earns its place — in the category badges and chart segments. The feel is a Bloomberg terminal designed by someone who went to art school. Calm, dense, but never anxious.

Money is emotional. This interface doesn't add to that. It shows the truth with clarity.

---

## Color Tokens

```css
/* src/styles/tokens.css */

:root {
  /* Background layers */
  --color-bg-base:       #0e0e0e;
  --color-bg-surface:    #161616;
  --color-bg-elevated:   #1f1f1f;
  --color-bg-input:      #252525;

  /* Borders */
  --color-border:        rgba(255, 255, 255, 0.08);
  --color-border-strong: rgba(255, 255, 255, 0.16);

  /* Text */
  --color-text-primary:   #f0ede8;
  --color-text-secondary: #888780;
  --color-text-muted:     #4a4a48;

  /* Category colors — warm, distinct, not rainbow */
  --color-food:       #E8593C;   /* coral red */
  --color-transport:  #F2A623;   /* amber */
  --color-data:       #4A90D9;   /* cool blue */
  --color-fun:        #9B8FE8;   /* muted violet */
  --color-other:      #5a5a58;   /* neutral gray */

  /* Accent */
  --color-accent:     #E8593C;   /* same as food — doubles as primary accent */

  /* State */
  --color-success:    #4caf79;
  --color-danger:     #e05a5a;

  /* Sizing */
  --radius-sm:  4px;
  --radius-md:  8px;
  --radius-lg:  12px;
  --radius-xl:  16px;

  /* Spacing scale (4px base) */
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-8:  32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  /* Typography */
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  --font-sans: 'Geist', 'Inter', system-ui, sans-serif;

  --text-xs:   11px;
  --text-sm:   13px;
  --text-base: 15px;
  --text-lg:   18px;
  --text-xl:   24px;
  --text-2xl:  32px;
  --text-3xl:  48px;

  --font-normal: 400;
  --font-medium: 500;
  --font-bold:   600;

  /* Layout */
  --max-width:   960px;
  --sidebar-w:   320px;
  --chart-h:     240px;
}
```

---

## Typography

| Role | Font | Size | Weight |
|---|---|---|---|
| App title | Geist (sans) | 13px | 500 |
| Total figure | JetBrains Mono | 48px | 400 |
| Section label | Geist | 11px uppercase | 500 |
| Body / form | Geist | 15px | 400 |
| Date / meta | JetBrains Mono | 13px | 400 |
| Category badge | Geist | 11px | 500 |
| Chart tick | JetBrains Mono | 11px | 400 |

The **total figure** uses monospace because it's a number that should feel precise, not friendly. Everything else is Geist for a clean sans-serif structure.

---

## Layout

Single column on mobile. Two-column on desktop (≥ 768px):

```
┌──────────────────────────────────────────────────┐
│ RECEIPTS                     [This week ▾]        │
├────────────────────┬─────────────────────────────┤
│                    │  ₦ 47,200.00                 │
│  AddExpenseForm    │  This week                   │
│                    ├─────────────────────────────┤
│                    │  [Donut chart]               │
│                    ├─────────────────────────────┤
│                    │  [Bar chart — 7 days]        │
│                    ├─────────────────────────────┤
│                    │  [Expense list]              │
└────────────────────┴─────────────────────────────┘
```

On mobile, the form stacks above the dashboard.

---

## Category Colors (Visual Reference)

| Category | Color | Hex |
|---|---|---|
| 🟠 Food | Coral red | `#E8593C` |
| 🟡 Transport | Amber | `#F2A623` |
| 🔵 Data | Cool blue | `#4A90D9` |
| 🟣 Fun | Muted violet | `#9B8FE8` |
| ⬛ Other | Neutral gray | `#5a5a58` |

---

## Component Tokens

### FilterBar (segmented control)

- Background: `--color-bg-elevated`
- Border: `1px solid var(--color-border)`
- Active button: background `--color-bg-input`, text `--color-text-primary`
- Inactive button: text `--color-text-secondary`
- Radius: `--radius-md`

### Category Badge

- Background: 15% opacity of the category color
- Text: full category color
- Radius: `--radius-sm`
- Padding: `2px 8px`
- Font: 11px, 500 weight, uppercase

### Expense Row

- Background: transparent
- Bottom border: `1px solid var(--color-border)`
- Hover background: `--color-bg-elevated`
- Delete button: visible on hover only, color `--color-text-muted`, hover `--color-danger`

### Form Input

- Background: `--color-bg-input`
- Border: `1px solid var(--color-border)`
- Focus border: `1px solid var(--color-border-strong)`
- Text: `--color-text-primary`
- Placeholder: `--color-text-muted`
- Radius: `--radius-md`

---

## Animations

Keep them functional, not decorative.

| Interaction | Animation |
|---|---|
| Filter switch | Bar/donut data transitions via Recharts' built-in 300ms ease |
| Expense row add | Fade in + slide down from 4px offset, 150ms ease-out |
| Expense row delete | Fade out + height collapse, 200ms ease-in |
| Form submit button | Scale 0.97 on active, 80ms |
| Filter button switch | Background color transition 120ms |

No page transitions. No loading skeletons (localStorage reads are synchronous). No confetti. The app respects `prefers-reduced-motion`.

---

## Accessibility

- Color is never the only indicator — category badges have text labels.
- Chart tooltips are keyboard-accessible via Recharts defaults.
- The form has visible labels (not just placeholders).
- Focus rings are visible: `outline: 2px solid var(--color-border-strong)`.
- Delete buttons have `aria-label="Delete expense"`.
- `prefers-reduced-motion: reduce` disables all transitions.

# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** PEBOL KOPOHA
**Generated:** 2026-09-08 14:58:17
**Category:** Sports Team/Club — Football Pitch Theme
**Design Dials:** Variance 7/10 (Balanced / Modern) | Motion 5/10 (Standard) | Density 7/10 (Standard)

---

## Global Rules

### Color Palette (Football Pitch Green — overrides generated red)

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Primary | `#16A34A` | `--color-primary` |
| On Primary | `#FFFFFF` | `--color-on-primary` |
| Secondary | `#DCFCE7` | `--color-secondary` |
| On Secondary | `#14532D` | `--color-on-secondary` |
| Accent/CTA | `#F0FDF4` | `--color-accent` |
| On Accent/CTA | `#14532D` | `--color-on-accent` |
| Background | `#F0FDF4` | `--color-background` |
| Foreground | `#14532D` | `--color-foreground` |
| Card | `#FFFFFF` | `--color-card` |
| Card Foreground | `#14532D` | `--color-card-foreground` |
| Muted | `#ECFDF5` | `--color-muted` |
| Muted Foreground | `#475569` | `--color-muted-foreground` |
| Border | `#BBF7D0` | `--color-border` |
| Destructive | `#DC2626` | `--color-destructive` |
| Ring | `#16A34A` | `--color-ring` |

**Color Notes:** Grass green pitch + white line markers + stadium light background

### Typography

- **Heading Font:** Bebas Neue
- **Body Font:** Source Sans 3
- **Mood:** bold, impactful, sports headlines, mobile-first

### Component Patterns

- **PitchCard:** 3px border, white-line inset shadow, grass stripe background on shell
- **Touch targets:** minimum 44px (`min-h-11`)
- **Spacing:** flex + gap (never margin chains)
- **Forms:** Field + FieldGroup + FieldLabel

---

## Pre-Delivery Checklist

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from Lucide
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px

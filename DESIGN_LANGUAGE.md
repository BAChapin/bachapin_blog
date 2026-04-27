# 🧭 Design Language — Personal Blog

## 1. Philosophy

**Core Principles:**
- Minimal over maximal
- Content-first, always
- Calm, deliberate pacing
- Subtle technical aesthetic (inspired by The Matrix, not dominated by it)

**Design Intent:**
> The interface should feel like a quiet terminal crossed with a refined editorial layout.

---

## 2. Tone & Personality

| Attribute        | Description |
|-----------------|------------|
| Minimal         | Remove anything non-essential |
| Intentional     | Every element has purpose |
| Technical       | Subtle system-like cues |
| Calm            | No visual noise |
| Timeless        | Avoid trendy UI patterns |

---

## 3. Color System

### Palette

| Role              | Color        | Usage |
|------------------|-------------|------|
| Background        | `#0D0D0D`    | Primary background |
| Surface           | `#111111`    | Cards / containers |
| Primary Text      | `#EAEAEA`    | Main content |
| Secondary Text    | `#888888`    | Metadata / subtle text |
| Accent            | `#FB9100`    | Links, hover, highlights |
| Divider           | `#1F1F1F`    | Borders, separators |

### Rules
- Use accent color **sparingly**
- Never use accent for large blocks
- Prefer contrast through **spacing**, not color

---

## 4. Typography

### Font Stack

```css
font-family: "Inter", system-ui, -apple-system, sans-serif;
```

Optional heading alternative:
```css
font-family: "IBM Plex Serif", serif;
```

---

### Type Scale

| Element      | Size     | Weight |
|-------------|----------|--------|
| H1           | 2.5rem   | 600    |
| H2           | 2rem     | 600    |
| H3           | 1.5rem   | 500    |
| Body         | 1rem     | 400    |
| Small Text   | 0.875rem | 400    |

---

### Typography Rules

- Line height: `1.6 – 1.8`
- Max width: `65ch`
- Avoid pure white text (`#FFFFFF`)
- Use spacing to create hierarchy, not just size

---

## 5. Layout System

### Content Width

| Type        | Width      |
|------------|-----------|
| Standard    | 640–720px |
| Wide        | 900px     |

---

### Spacing Scale

Use a consistent spacing system:

```txt
4px, 8px, 16px, 24px, 32px, 48px, 64px
```

### Layout Rules

- Generous vertical spacing
- Clear section separation
- No cramped UI
- Left-aligned content preferred

---

## 6. Components

### Links

- Default: Primary text color
- Hover: Accent color
- Underline on hover only

---

### Buttons

**Style:**
- Minimal
- Border-based or subtle fill

```css
border: 1px solid #1F1F1F;
padding: 8px 16px;
```

Hover:
- Border or text turns accent color

---

### Cards (Blog Posts)

Structure:
- Title
- Metadata (date, tags)
- Short excerpt

Style:
- No heavy shadows
- Subtle background (`#111111`)
- Clean separation via spacing

---

### Inputs (Search)

Style:
- Dark background
- Thin border
- No heavy styling

Focus:
- Border turns accent color

---

## 7. Interaction Design

### Hover States
- Subtle color shift
- No dramatic animations

### Transitions

```css
transition: all 0.2s ease;
```

### Motion Philosophy

- Minimal motion
- No bouncing or flashy effects
- Prefer fade or subtle shift

---

## 8. Blog-Specific Patterns

### Post List

Each post includes:
- Title (prominent)
- Date
- Tags (optional)
- Excerpt

---

### Article Page

Structure:
- Title
- Metadata row
- Content
- Navigation (prev/next)

---

### Content Styling

- Comfortable reading width
- Clear paragraph spacing
- Code blocks styled subtly (dark surface + slight border)

---

## 9. Matrix Influence (Subtle Layer)

### Allowed

- Accent orange highlights
- Occasional monospace usage
- Terminal-like spacing

### Avoid

- Neon overload
- Animated “code rain”
- Gimmicky hacker visuals

---

## 10. Accessibility

- Maintain strong contrast
- Avoid relying on color alone
- Ensure readable font sizes
- Focus states must be visible

---

## 11. Future-Proofing

Design must support:
- Blog growth
- Tag filtering
- Portfolio expansion
- Additional pages without redesign

---

## 12. Anti-Patterns

Avoid:

- ❌ Overusing accent color  
- ❌ Dense layouts  
- ❌ Heavy shadows  
- ❌ Loud gradients  
- ❌ Trendy UI (glassmorphism, neumorphism)  
- ❌ Over-animated interfaces  

---

## 13. Guiding Principle

> If removing something improves clarity, remove it.

---

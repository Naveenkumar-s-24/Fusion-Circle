# Fusion Circle - Design Guidelines

## Design Approach: Linear-Inspired Productivity System

**Rationale**: As a utility-focused productivity platform with information-dense content, Fusion Circle adopts a design system approach inspired by Linear - prioritizing clarity, efficiency, and professional aesthetics over decorative elements.

## Core Design Principles

1. **Clarity Over Decoration**: Every element serves a functional purpose
2. **Information Hierarchy**: Clear visual structure for complex data
3. **Responsive Efficiency**: Fast, intuitive interactions
4. **Professional Minimalism**: Clean, modern, trustworthy aesthetic

---

## Color Palette

### Dark Mode (Primary)
- **Background Primary**: 217 19% 12% (deep blue-gray)
- **Background Secondary**: 217 19% 15% (slightly lighter panels)
- **Background Tertiary**: 217 19% 18% (hover states, cards)
- **Border Subtle**: 217 10% 25% (dividers, borders)
- **Text Primary**: 217 10% 95% (main text)
- **Text Secondary**: 217 10% 70% (supporting text)
- **Text Tertiary**: 217 10% 50% (labels, metadata)

### Light Mode
- **Background Primary**: 0 0% 100% (white)
- **Background Secondary**: 217 15% 97% (panels)
- **Background Tertiary**: 217 15% 94% (hover states)
- **Border Subtle**: 217 10% 85%
- **Text Primary**: 217 25% 15%
- **Text Secondary**: 217 15% 35%
- **Text Tertiary**: 217 10% 55%

### Accent Colors
- **Primary Brand**: 217 91% 60% (vibrant blue for CTAs, key actions)
- **Success**: 142 71% 45% (completed tasks, positive states)
- **Warning**: 38 92% 50% (pending items, alerts)
- **Error**: 0 84% 60% (critical actions, errors)
- **AI Indicator**: 271 76% 65% (AI suggestions, insights)

---

## Typography

### Font Stack
- **Primary**: 'Inter', system-ui, -apple-system, sans-serif
- **Monospace**: 'JetBrains Mono', 'Fira Code', monospace (for code, IDs)

### Type Scale
- **Hero/Display**: text-5xl (48px), font-semibold, tracking-tight
- **Page Titles**: text-3xl (30px), font-semibold
- **Section Headers**: text-xl (20px), font-medium
- **Body Large**: text-base (16px), font-normal
- **Body Default**: text-sm (14px), font-normal
- **Labels/Meta**: text-xs (12px), font-medium, uppercase tracking-wide
- **Line Height**: Default 1.5 for body, 1.2 for headings

---

## Layout System

### Spacing Primitives
Use Tailwind units: **2, 3, 4, 6, 8, 12, 16, 20** for consistent rhythm
- Tight spacing: p-2, gap-2 (components, inline elements)
- Standard spacing: p-4, gap-4 (cards, sections)
- Generous spacing: p-6, p-8 (page sections, major divisions)
- Page margins: px-6, py-8 (mobile), px-12, py-12 (desktop)

### Grid System
- **Sidebar + Main**: Fixed 240px sidebar, flex-1 main content
- **Dashboard Cards**: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4
- **Task Lists**: Single column, full-width with max-w-4xl
- **Max Widths**: max-w-7xl for main containers, max-w-4xl for content

---

## Component Library

### Navigation
- **Top Bar**: Fixed header, h-16, with project switcher, search, notifications, user menu
- **Sidebar**: Fixed left sidebar (240px), collapsible on mobile, with project list and quick actions
- **Breadcrumbs**: Subtle text-xs with separator arrows for context

### Cards & Panels
- **Project Cards**: Rounded-lg, border border-[border-subtle], p-4, hover:bg-[background-tertiary] transition
- **Task Cards**: Similar to project cards, with status indicator (4px left border in status color)
- **Dashboard Panels**: Larger cards with p-6, containing stats or charts

### Forms & Inputs
- **Text Inputs**: h-10, px-3, rounded-md, bg-[background-secondary], border border-[border-subtle], focus:ring-2 focus:ring-[primary]
- **Buttons Primary**: bg-[primary], text-white, px-4, py-2, rounded-md, hover:opacity-90
- **Buttons Secondary**: border border-[border-subtle], bg-transparent, hover:bg-[background-tertiary]
- **Dropdowns**: Custom styled with smooth open/close, max-h-60 overflow-y-auto

### Kanban Board
- **Columns**: min-w-80, max-w-sm, bg-[background-secondary], rounded-lg, p-4
- **Task Cards**: Draggable, rounded-md, p-3, shadow-sm, with grab cursor
- **Column Headers**: Sticky top-0, with task count badge

### Data Display
- **Tables**: Striped rows (even:bg-[background-secondary]), hover:bg-[background-tertiary], text-sm
- **Charts**: Use muted colors matching palette, clean axes, tooltips on hover
- **Stats**: Large number (text-3xl font-bold), small label beneath (text-xs text-[text-tertiary])

### Notifications & Modals
- **Toast Notifications**: Fixed top-right, slide-in animation, auto-dismiss after 4s
- **Modals**: Centered overlay, max-w-lg, p-6, rounded-lg, backdrop-blur

---

## Iconography

**Library**: Heroicons (outline for most, solid for active states)
- **Icon Sizes**: w-4 h-4 (inline with text), w-5 h-5 (standard buttons), w-6 h-6 (prominent actions)
- **Usage**: Left-align with text, consistent spacing (gap-2)

---

## Interactions & Animations

**Philosophy**: Subtle, purposeful, never distracting

### Transitions
- **Default**: transition-colors duration-200 (hover states)
- **Modals/Drawers**: Fade + slide animations (150ms)
- **Drag & Drop**: Scale(1.02) on drag start, shadow-lg while dragging
- **Loading States**: Skeleton screens with pulse animation, not spinners

### Micro-interactions
- **Button Hover**: Slight opacity change (hover:opacity-90)
- **Card Hover**: Background shift (hover:bg-[background-tertiary])
- **AI Suggestions**: Subtle glow effect (ring-2 ring-[ai-indicator]/20)

---

## Unique Features

### AI Elements Styling
- **AI Badges**: Small pill with AI icon, bg-[ai-indicator]/10, text-[ai-indicator]
- **Suggestions**: Dashed border, with sparkle icon, hover to reveal details
- **Insights Panel**: Dedicated section with gradient accent (from primary to ai-indicator)

### Status Indicators
- **Task Status**: 4px left border (red=todo, yellow=in-progress, green=completed)
- **Priority Tags**: Small pills with dot indicator (high=red, medium=yellow, low=gray)
- **Activity Indicators**: Pulsing dot for real-time updates

### Dashboard Design
- **Layout**: 3-column grid on desktop, single column on mobile
- **Stat Cards**: Icon + number + label, with trend arrows for changes
- **Progress Bars**: Thin (h-2), rounded-full, with smooth fill animation
- **Activity Feed**: Timeline with left border, avatars, and timestamps

---

## Images

### Hero Section (Landing Page Only)
- **Type**: Abstract/geometric illustration of collaboration (nodes/connections)
- **Placement**: Right side of hero, 50% width on desktop
- **Style**: Gradient-colored (primary to ai-indicator), semi-transparent, modern

### Dashboard Assets
- **Empty States**: Simple line illustrations for "no projects" or "no tasks"
- **Profile Photos**: Circular avatars (w-8 h-8 for lists, w-12 h-12 for profiles)
- **No images needed** in main application - focus on data visualization

---

## Responsive Behavior

- **Mobile (<768px)**: Sidebar collapses to hamburger menu, single-column layouts, bottom nav for quick actions
- **Tablet (768-1024px)**: 2-column grids, sidebar toggleable
- **Desktop (>1024px)**: Full 3-column layouts, persistent sidebar, maximum information density

---

## Accessibility

- **Focus States**: Ring-2 ring-offset-2 ring-[primary] for keyboard navigation
- **ARIA Labels**: All interactive elements properly labeled
- **Color Contrast**: WCAG AA compliant (4.5:1 for text)
- **Dark Mode**: Consistent implementation across all inputs and components
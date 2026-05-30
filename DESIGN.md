---
name: JobJockey
colors:
  surface: '#FBF9F4'
  surface-dim: '#ECEBE4'
  surface-bright: '#FFFFFF'
  surface-container: '#F5F3EE'
  on-surface: '#0A0A0A'
  on-surface-variant: '#444444'
  background: '#FBF9F4'
  on-background: '#0A0A0A'
  
  # Dark Midnight Split Pane (Sleek UI Minimalism Left-Side)
  space-midnight: '#07111E'
  space-midnight-dark: '#030810'
  space-stars: '#FFFFFF'
  
  # Functional Accents (Aesthetic Gradient and Terminal Colors)
  primary: '#FF4D00'
  secondary: '#FFCC00'
  success: '#00FF4D'
  error: '#FF1500'
  warning: '#FFEA00'
  accent-teal-start: '#15B097'
  accent-teal-end: '#217A94'
  border: '#E4E2DD'
  muted: '#7F7F7F'
  
typography:
  logotype:
    fontFamily: Space Mono
    fontSize: 18px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: DM Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: DM Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: DM Sans
    fontSize: 15px
    fontWeight: '500'
    lineHeight: 22px
  body-md:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: DM Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  mono-terminal:
    fontFamily: Space Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  content-padding-x: 32px
  content-padding-y: 28px
  card-padding: 20px
  card-gap: 14px
  section-gap: 24px
---

# JobJockey Design System

The JobJockey Design System is defined by a striking **Split-Screen Dualism** (Sleek UI Minimalism on the right, and SRE/AI Terminal Maximalism on the left), directly inspired by our core brand identity.

---

## 1. Split-Screen Brand Architecture

Every major screen in JobJockey (including the landing page, Dashboard, and AutoMode) inherits the Split-Screen layout pattern:

### 1.1 Left Side: The Deep Space SRE Console (Maximalism)
* **Visual Aura**: Dark Midnight Blue (`#07111E` to `#030810`) representing deep space, with a subtle speckled star background.
* **Core Purpose**: Communicates AI capability, active agent loops, and structured technical precision.
* **Key Components**:
  * **Bold Value Copy**: Set in pristine White `DM Sans` (e.g., *Your AI recruiter, legal advisor, and career coach*).
  * **Live Interactive Terminal**: A dark panel containing a simulated terminal window. Uses green/teal monospace text (`#00FFCC` / `#00FF88` in `Space Mono`) to list real-time progress steps like:
    ```bash
    [Orchestrator] Scanning 240 roles...
    [Scout] 12 matches found
    [Tailor] Resume adapted for Stripe -> 94% ATS score
    system: Awaiting user confirmation █
    ```

### 1.2 Right Side: The Premium Editorial Canvas (Minimalism)
* **Visual Aura**: Clean, warm, premium paper-like surface (`#FBF9F4`) with deep carbon text (`#0A0A0A`).
* **Core Purpose**: Keeps user actions distraction-free, elegant, and highly legible.
* **Key Components**:
  * Clean, rounded input boxes (`#FFFFFF` background, 20px border-radius, `#E4E2DD` border).
  * **Gradients buttons**: Primary buttons use a sleek horizontal gradient from `accent-teal-start` (`#15B097`) to `accent-teal-end` (`#217A94`), conveying modern high-tech capability.

---

## 2. Typographic Style Guide

We employ two typefaces to maintain our identity:

1. **DM Sans**: Our workhorse font. Handles headlines, description copy, metadata cards, and core forms.
   * *Headline LG*: Bold, heavy (`700`), with negative letter-spacing for premium editorial impact.
2. **Space Mono**: Reserved entirely for system prompts, terminal consoles, code blocks, and the official Logotype.
   * Signifies active, background automated agent reasoning.

---

## 3. Shape Language & Spacing Rhythm

* **Rhythm**: All paddings, gaps, and heights must align to a **4px grid** (unit: 4px).
* **Interactive Elements**: Inputs and primary CTA buttons use a **pill shape** (20px to 9999px radius) for tactile comfort.
* **Card Objects**: Job listing and review containers use a **14px rounded border** with flat, subtle background tonal shifts (`#F5F3EE`) instead of heavy dropshadows.

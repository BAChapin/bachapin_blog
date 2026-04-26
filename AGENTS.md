## 1. Purpose

This document defines how AI agents should operate within this project.  
The goal is to ensure high-quality output, maintain consistency, and reduce unnecessary rework.

---

## 2. Core Principles

### 2.1 Delegate When Appropriate

- Break work into smaller, logical tasks when beneficial.
- Suggest sub-tasks or parallelizable work where it improves clarity or efficiency.
- Do not attempt to solve large, ambiguous problems in a single pass if decomposition would yield better results.

**Example:**
Instead of generating an entire website at once:
- Propose: structure → components → styling → refinement

---

### 2.2 Ask Clarifying Questions Early

- If a request is ambiguous, incomplete, or could benefit from refinement:
  - Ask targeted clarifying questions **before proceeding**.
- Prefer a short round of clarification over producing incorrect or generic output.

**When to ask questions:**
- Missing constraints (design, tech stack, audience)
- Multiple valid interpretations
- Opportunities to significantly improve output quality

**Question Style:**
- Be concise
- Ask only what materially impacts the result
- Group related questions together

---

### 2.3 Avoid Assumptions

- Do not invent requirements that were not provided.
- If assumptions are necessary:
  - Clearly state them
  - Keep them minimal
  - Prefer asking instead

---

## 3. Design Guidelines

### 3.1 Single Source of Truth

- **ALWAYS reference `DESIGN_LANGUAGE.md` when generating UI, styling, or layout.**
- Treat it as the authoritative design system.

---

### 3.2 UI Consistency Rules

When creating UI elements:

- Follow defined:
  - Color palette
  - Typography
  - Spacing scale
  - Component patterns

- Ensure:
  - Minimalism is preserved
  - Visual noise is avoided
  - Accent usage is restrained

---

### 3.3 If Design Is Unclear

- Ask questions rather than guessing
- Or propose 2–3 aligned options based on the design language

---

## 4. Output Expectations

### 4.1 Be Structured

- Use clear sections
- Prefer readable formatting
- Keep outputs easy to scan and implement

---

### 4.2 Be Practical

- Favor implementation-ready outputs
- Avoid unnecessary theory unless explicitly requested

---

### 4.3 Iterate, Don’t Finalize

- Treat outputs as drafts unless explicitly told otherwise
- Encourage refinement and iteration

---

## 5. Code Generation Guidelines

### 5.1 Follow Project Stack

- Respect the existing tech stack (e.g., Astro, Tailwind, React if applicable)
- Do not introduce new frameworks without justification

---

### 5.2 Keep Code Maintainable

- Use clear naming
- Prefer reusable components
- Avoid over-engineering

---

### 5.3 Align With Design Language

- Styling must reflect `DESIGN_LANGUAGE.md`
- Avoid arbitrary values when system values exist

---

## 6. Communication Style

- Be concise but clear
- Avoid filler language
- Focus on usefulness over verbosity

---

## 7. Anti-Patterns

Avoid:

- ❌ Generating large solutions without clarification  
- ❌ Ignoring `DESIGN_LANGUAGE.md`  
- ❌ Overcomplicating simple tasks  
- ❌ Making silent assumptions  
- ❌ Producing unstructured responses  

---

## 8. Modes of Operation

The AI should adapt its behavior based on the explicitly requested mode.  
If no mode is specified, default to **Architect Mode** or ask for clarification.

---

### 🏗️ Architect Mode

**Purpose:** Planning and structure

**Responsibilities:**
- Define architecture, file structure, and data flow
- Break work into clear, ordered steps
- Identify dependencies and risks

**Avoid:**
- Writing full implementation code
- Making visual design decisions

---

### 🎨 Design Mode

**Purpose:** UI/UX and visual decisions

**Responsibilities:**
- Apply `DESIGN_LANGUAGE.md` strictly
- Define layout, spacing, typography, and component structure
- Ensure consistency and minimalism

**Avoid:**
- Backend logic
- Structural re-architecture unless necessary

---

### 🧱 Builder Mode

**Purpose:** Implementation

**Responsibilities:**
- Write clean, maintainable code
- Follow architecture and design constraints
- Create reusable components

**Avoid:**
- Redesigning or restructuring unless instructed

---

### 🔍 Reviewer Mode

**Purpose:** Evaluation and critique

**Responsibilities:**
- Identify issues, inconsistencies, and risks
- Check alignment with `DESIGN_LANGUAGE.md` and architecture
- Suggest targeted improvements

**Avoid:**
- Rewriting everything unnecessarily

---

### 🧪 Refiner Mode

**Purpose:** Iteration and polish

**Responsibilities:**
- Simplify code and UI
- Improve readability and spacing
- Reduce complexity and noise

**Avoid:**
- Large structural or architectural changes

---

### 🔄 Mode Usage Rules

- The AI must **strictly adhere to the requested mode**
- If multiple modes are specified, combine responsibilities carefully
- If mode is unclear:
  - Ask for clarification OR
  - Default to Architect Mode

---

## 9. Planning & Task Tracking (`PLANNING.md`)

### 9.1 Purpose

To maintain continuity across sessions and ensure progress is tracked clearly.

---

### 9.2 File Location

```txt
/docs/PLANNING.md
```

---

### 9.3 When to Create or Update

The AI should create or update `PLANNING.md` when:

- Breaking down a multi-step task
- Defining implementation steps
- Creating a roadmap or execution plan

---

### 9.4 Format

Use a checklist-based structure:

```markdown
# Project Planning

## Current Tasks

- [ ] Task 1 description
- [ ] Task 2 description
- [ ] Task 3 description
```

---

### 9.5 Task Management Rules

- When a task is completed:
  - Update it from `[ ]` → `[x]`
- Keep tasks:
  - Clear
  - Atomic (small, actionable)
  - Ordered when necessary

---

### 9.6 Completion Behavior

- When **all tasks are completed**:
  - Remove the entire checklist section
  - Optionally replace with a new plan if continuing work

---

## 10. Session Continuity Rules

### 10.1 At the Start of a Session

The AI must:

1. Check for the existence of:
   ```txt
   /docs/PLANNING.md
   ```

2. If the file exists and contains incomplete tasks:
   - Inform the user
   - Ask:

   > “There are unfinished tasks in PLANNING.md. Would you like to continue where we left off?”

3. Do **not proceed** with new work until the user confirms or declines

---

### 10.2 During a Session

- Continuously reference `PLANNING.md` when working through tasks
- Update task status as progress is made

---

### 10.3 When Planning New Work

- Always document new steps in `PLANNING.md` before implementation
- Ensure the plan reflects the current scope of work

---

### 10.4 If the Plan Becomes Outdated

- Revise the plan instead of ignoring it
- Keep it aligned with the current direction of the project

---

## 11. Guiding Principle (Extended)

> Plan clearly. Track progress. Resume seamlessly. Build intentionally.

---

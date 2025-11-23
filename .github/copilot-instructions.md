# LilyBlock Online Shop – Copilot Instructions

## Critical Rules for Copilot

1. **No Hallucination:**
	- All code changes, suggestions, and explanations must be based on actual files, code, or documentation present in the workspace, or on authoritative external sources (official docs, referenced standards).
	- Never invent features, APIs, or code that do not exist in the project or in referenced documentation.

2. **Source of Truth:**
	- Always use the README, project structure, and actual file contents as the primary source of truth.
	- For backend/API/database changes, reference the Netlify functions and `supabase-schemas.md`.
	- For frontend/UI/logic, reference `index.html`, `main.js`, `main.css`, and related files.

3. **Research Before Edit:**
	- Before making any change, scan and analyze the relevant files and context.
	- If a feature or fix is requested, locate the source code, logic, or config that implements it before suggesting or applying changes.
	- If external documentation is needed, cite the source (e.g., MDN, Supabase docs, Netlify docs).

4. **Change Management:**
	- Only edit the minimum set of files required for the requested change.
	- Use clear, concise comments and code blocks. Avoid unnecessary repetition.
	- For multi-file changes, explain the relationship and flow between files.

5. **Testing and Validation:**
	- After making changes, check for errors, broken flows, or regressions.
	- Use the manual test checklist in the README to validate features.

6. **Documentation:**
	- Update the README or relevant docs if the change affects project structure, flow, or usage.
	- Add comments in code for non-obvious logic or important rules.

7. **Respect Project Conventions:**
	- Follow the separation of concerns: HTML for structure, CSS for styles, JS for logic, Netlify functions for backend/API.
	- Use the mobile-specific styles at the bottom of `main.css` for mobile changes.

8. **Copilot Workflow:**
	- Always start by analyzing the workspace and context.
	- Only suggest or apply changes that are supported by the codebase or referenced documentation.
	- If unsure, ask for clarification or request more information.

---

**Summary:**
Copilot must never hallucinate or invent code. All changes must be based on the actual source of truth in the workspace or on authoritative research. Always validate, document, and respect project conventions.

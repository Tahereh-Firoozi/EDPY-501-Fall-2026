# EDPY 501 Session 1 Activity Site

This repository contains the student-facing activities for Session 1 of **EDPY 501: Introduction to Methods of Educational Research** (Fall 2026), taught by Dr. Tahereh Firoozi.

The site includes:

- a downloadable PowerPoint lecture deck;
- a launch point for the approved Research Thinking and AI Use Baseline form;
- **Activity 1: What Counts as Research?** with facilitator debrief prompts;
- **Activity 2: One Problem, Three Possible Studies** with a printable study-design workspace;
- an AI-source verification scenario and workflow; and
- a launch point for the approved exit-ticket form.

## Student-response privacy

This is a static GitHub Pages site. It does **not** transmit, save, or analyze student responses. The free-text drafting fields and selections exist only in the currently open browser page. Baseline and exit-ticket responses should be collected through a University-approved form or learning-management system.

## Add the approved form links

Open `config.js` and place the two secure `https://` links between the quotation marks:

```js
window.EDPY501_CONFIG = {
  baselineFormUrl: "https://your-approved-form-link",
  exitTicketFormUrl: "https://your-approved-form-link"
};
```

If a link is left blank, the page tells students that the instructor will share it through the course learning platform.

## Publish with GitHub Pages

The repository includes `.github/workflows/pages.yml`, which publishes the static site whenever the `main` branch changes. In the repository settings, select **GitHub Actions** as the GitHub Pages source once, then open the published site and confirm that both approved form buttons work.

The `.nojekyll` file is included so GitHub Pages serves the files exactly as provided.

## Files

- `index.html` — all student-facing Session 1 content
- `styles.css` — responsive, print-friendly course styling
- `app.js` — activity interactions; no analytics or response storage
- `config.js` — approved form links
- `resources/EDPY_501_Session_1_Research_Thinking_and_AI_Literacy.pptx` — PowerPoint lecture deck
- `.github/workflows/pages.yml` — automatic GitHub Pages deployment
- `forms/baseline-form-blueprint.md` — questions and setup notes for the diagnostic
- `forms/exit-ticket-form-blueprint.md` — four closing reflection questions
- `INSTRUCTOR_SETUP.md` — class setup and facilitation notes
- `SOURCES.md` — sources supporting the instructional content

## Accessibility and printing

The site supports keyboard navigation, visible focus states, responsive layouts, reduced-motion preferences, and a print view for the Activity 2 study-design plan. Students can select **Print or save this plan as PDF** after completing Activity 2.

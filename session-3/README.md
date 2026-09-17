# Session 3: Synthesis Lab

Static, dependency-free classroom practice activity. Open `index.html` through the course site. No API key, account, analytics or backend is used.

## Teaching sequence

Read three original teaching summaries based on the instructor-provided PDFs. Each separates prior literature from the focal study's methods and findings. Students start with the matrix and choose any empty study cell. Each opens an accessible dialog with a plain-language question, a short research-term reminder, the relevant reading, targeted retry hints and an explanation. Completed cells can be reopened. Nine study cells cover gaps, designs and findings; only after all nine are filled does the cross-study synthesis question become available. Context and limitations are supplied.

Local browser storage preserves completion. There is no displayed score or timer. Existing v1 completion is preserved; older first-attempt scores are discarded when progress is next saved. Reset requires confirmation. Native dialog focus containment, Escape/close support, focus restoration to the selected cell, and reduced-motion styling support keyboard and assistive-technology use. Printing supports the matrix in landscape format. This is self-study practice, not authenticated assessment: students can inspect the answer key in the JavaScript, and instructors do not receive responses.

## Sources and scope

All text is paraphrased from the uploaded papers; source sections and printed pages appear in reading cards. Paper A uses its final publication year (2022; online 2021). Paper C's citation includes all eight authors. Paper B concerns science and mathematics, not writing. Mixed-methods design labels describe research designs, not literature-review types.

The original papers are linked using DOIs rather than redistributed. Paper A may need institutional access. For authenticated student submissions or distribution of subscription PDFs, use the university-approved course platform.

## Maintenance

`data.js` contains readings, answer options, feedback, citations and matrix content. `activity.js` controls interaction and storage. `activity.css` is isolated from Session 1. Change the storage-key version when changing answer indexing. No build step is required; the existing GitHub Pages workflow deploys this directory.

# SQL Quest with Lumi 🫧

A playful, pastel SQL course that takes a complete beginner to intermediate level. It's built for people heading into business analyst, product manager, operations and data analyst roles.

**Live site:** https://chaitalipatil06.github.io/sql-quest/

Everything runs in the browser. Learners write real SQL against a small fictional company database (powered by [sql.js](https://github.com/sql-js/sql.js), SQLite compiled to JavaScript). There's no server and no sign-up.

## Features

- **10 chapters**: databases and keys → SELECT → WHERE → ORDER BY/LIMIT → GROUP BY/HAVING → JOINs → CASE and functions → subqueries and CTEs → window functions → real manager reports and interview prep
- **Try-it buttons** on every example, plus a playground with a live schema browser
- **Quizzes and auto-graded challenges** in every chapter, with hints and friendly error messages
- **Progress tracker**: a quest map, gems, ranks (Data Sprout → SQL Sage), a badge shelf and a progress bar, saved in the browser with a backup/restore code
- **A reward game every 2 chapters**: Keyword Memory, Clause Shuffle, Join Detective, Brain Teasers and a 60-second Speed Blitz that ends in a certificate
- **Lumi**, an original axolotl mascot, animated in hand-written SVG
- A role guide showing which chapters matter most for each target job

## Project structure

```
index.html        built, self-contained site (what GitHub Pages serves)
src/
  shell.html      page skeleton
  style.css       styles and animations
  content.js      chapters, quizzes, challenges, games (edit this to change the course)
  app.js          app logic: router, playground, grading, games, progress
  gen_seed.py     generates the practice database
  seed.sql        generated practice data
  build.py        bundles src/ into index.html
tests/            Playwright end-to-end checks
```

## Develop

```bash
npm install            # fetches sql.js (only needed for the tests)
npm run build          # rebuilds index.html from src/
python3 tests/e2e_chapters.py   # solves every chapter and runs every example
python3 tests/e2e_games.py      # plays all five games
```

Open `index.html` in a browser to preview it. The SQL engine loads from a CDN, so you need an internet connection.

## Deploy

GitHub Pages: **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)`**.

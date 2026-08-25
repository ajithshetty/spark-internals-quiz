# Spark Internals Quiz

A self-contained, static multiple-choice quiz on Apache Spark internals — scheduling, shuffle, Catalyst, Tungsten, joins, caching, structured streaming, and adaptive query execution. Pick an answer and get an immediate right/wrong verdict plus a short explanation and a link to further reading.

## Run it locally


`index.html` loads `questions.js` via a `<script src>` tag (not `fetch`), so you can just double-click `index.html` and it works straight from disk — no local server needed.  
  
If you prefer a local server anyway:  
  
```bash  
cd spark-quiz  
python3 -m http.server 8000
# open [http://localhost:8000](http://localhost:8000)
```

## Reading-material sources

Every question links to primary, authoritative material — official Apache Spark documentation for API/config/behavior questions, and the original Databricks engineering blog posts for internals that aren't covered in the docs (Catalyst, Tungsten, whole-stage code generation, Adaptive Query Execution). 13 distinct sources cover all 50 questions.

## Features

- 50 questions across 10 categories (architecture, scheduling, shuffle, Catalyst, Tungsten/memory, joins, caching, structured streaming, AQE, fault tolerance)
- Instant right/wrong feedback with an explanation — and a reading-material link — for every question, whether you got it right or not
- Category filter, shuffle-order button, jump-to-question grid, keyboard shortcuts (1–4 to answer, arrow keys to navigate)
- Score tracking and a results screen
- Progress is saved in `localStorage`, so a reload doesn't lose your answers
- No dependencies beyond a Google Fonts import (IBM Plex Mono / IBM Plex Sans) — works offline otherwise

## Built with love from Claude and Cursor
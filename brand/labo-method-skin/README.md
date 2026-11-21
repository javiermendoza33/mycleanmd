# The Labo Method Skin — brand kit v1 (Nov 20 2026)

Rebuilt from the AI prototype (which had a colliding "LABO" and garbled copy) into real files.

- `logo/` — primary, stacked, mark and wordmark as **outlined SVG** (no fonts needed) + 2400 px transparent PNGs; `-white` variants for ink/sage backgrounds.
- `print/` — `business-card.pdf` (3.5 × 2 in + 0.125 in bleed, front/back), `letterhead.pdf` (US Letter), `labels.pdf` (packaging label system at 100%), `brand-guide.pdf` (7 pages: logo, clear space/don'ts, colour, type, packaging grid, files).
- `web/` — `tokens.css`, `favicon.svg`, `avatar-1024.png`, `og-1200x630.png`.
- `fonts/` — Bebas Neue (wordmark) and Montserrat (everything else), both SIL OFL.
- `source/` — the HTML/CSS the PDFs render from and `logos.py` (fontTools) that outlines the lockups. Regenerate: `python3 source/logos.py <dir-with-fonts> logo/`, then print each HTML to PDF with headless Chrome (`--print-to-pdf`, `--no-pdf-header-footer`).

Palette: ink #2C3539 · sage #8F9A94 · taupe #A8A199 · white. Packaging: stacked wordmark over a numbered hairline grid (index · category / name / actives / volume · batch).

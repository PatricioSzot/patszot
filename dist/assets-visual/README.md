# Visual timeline assets

Every top-level project folder must begin with a month, day, and four-digit year. Single-digit months and days may be padded or unpadded:

`M-D-YYYY-project-name` or `MM-DD-YYYY-project-name`

Examples: `9-27-2026-Brand-Guidelines` and `06-10-2024-album-art-presage`

The date prefix controls the project's year and chronological position on the timeline. Use day `01` when only the month and year are known. The name after the date is its stable project slug. Files containing `preview` or `thumbnail` are preferred for the project preview; otherwise the first asset is used.

When a dated folder is renamed or its assets change on `main`, the **Sync visual timeline** GitHub Action rebuilds `manifest.json`. A new slug creates a new visual project automatically. Known slugs retain their curated title and existing source metadata.

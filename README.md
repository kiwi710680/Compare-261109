# IMPRESIVE hero comparison studio

Open `IMPRESIVE-Hero-Lab.html` directly in a current browser. This is the self-contained single-file deliverable; its images, font, styles, and scripts are included. No installation or server is required.

`index.html` and the single-file deliverable now include adjacent **中文 / English** buttons in the header. Switching languages updates the current page without navigation or reloading the previews. Colors, slider values, the pinned A design, comparison mode, and divider position are retained. Language preference is stored separately from design settings and restored on the next visit.

`index.html` is the editable source entry point. Keep it together with the CSS and JavaScript files. After source edits, run `node build-standalone.cjs` to refresh the single-file deliverable and validate all four renderers and embedded asset bytes.

## Usage
- Choose one of four presets, then adjust B with colour pickers, hex inputs, and sliders.
- Choose single, side-by-side, or draggable wipe comparison. The native wipe range also supports arrow keys.
- Choose A from the baseline selector, or pin the current B as A before further adjustments.
- Switch between 1440px desktop and 390px mobile preview canvases.
- Export a standalone HTML preview, comparison settings JSON, or CSS variables. JSON can be imported later. Changes are also saved in this browser's local storage when available.
- If the clipboard is unavailable under file://, CSS export automatically downloads a file.

## Scope
This folder is a local design exploration. The original `Website_261107-1` is untouched. English product copy and authentic identity assets come from that website. The original preset is a visual reconstruction, not an exact capture; all variants use a lower white partner strip for comparable logo presentation.

Assets are embedded unchanged in `assets.js`, including the local Inter font. The font license is included in `Inter-OFL-LICENSE.txt`. The studio and exported previews embed the font. Original-site navigation deliberately opens the source website in a new tab; exports resolve those links against the studio location, so these links require the original local folder. The exported hero visual itself remains self-contained.

The colour contrast indicator estimates headline and body contrast against gradient endpoints. It does not certify accessibility across every gradient midpoint, pattern, secondary control, or image field. Highly saturated custom colours can reduce readability. Custom colours never recolour the authentic logos.

## Files
- `index.html`: tool entry point.
- `studio.css`, `studio.js`: comparison UI and controls.
- `studio-i18n.js`, `studio-i18n.css`: same-page language switching and translated-label layout.
- `hero-preview.js`: four standalone hero compositions and live-update listener.
- `assets.js`: embedded authentic image/font data.
- Markdown files: design source, scope, and validation record.

No packages, telemetry, remote fonts, external scripts, publication, or source-site edits are involved.

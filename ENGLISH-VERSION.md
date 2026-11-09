# English version

Open `IMPRESIVE-Hero-Lab-EN.html` directly in a browser. This single file includes all scripts, styles, images, and fonts.

The English interface includes preset descriptions, color and layout controls, accessibility labels, comparison instructions, validation errors, status messages, and export notices. The original English hero copy and authentic logo assets are unchanged.

Editable sources: `index-en.html`, `studio-en.js`, and `studio-en.css`. These reuse `studio.css`, `assets.js`, and `hero-preview.js`. Run `node build-english.cjs` after source edits to validate and rebuild the English single-file version.

The original Chinese files are preserved. Both languages use the same settings schema and storage key, so existing A/B settings remain compatible. No packages, raw data, research outputs, or original-site files are changed.

Validation: `node --check studio-en.js` and `node build-english.cjs` passed. The build checks all embedded JavaScript, English document language, absence of untranslated Chinese, identical preset configuration values, and inclusion of all scripts and styles. The translated version was not separately exercised in a browser.

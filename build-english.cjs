'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = __dirname;
let html = fs.readFileSync(path.join(root, 'index-en.html'), 'utf8');
for (const file of ['studio.css', 'studio-en.css']) {
  html = html.replace('<link rel="stylesheet" href="' + file + '">', '<style>\n' + fs.readFileSync(path.join(root, file), 'utf8') + '\n</style>');
}
for (const file of ['assets.js', 'hero-preview.js', 'studio-en.js']) {
  const script = fs.readFileSync(path.join(root, file), 'utf8');
  new vm.Script(script, { filename: file });
  html = html.replace('<script src="' + file + '"></script>', '<script>\n' + script.replace(/<\/script/gi, '<\\/script') + '\n</script>');
}
assert(!/<script\s+src=|<link\s+rel="stylesheet"/.test(html), 'English HTML must be self-contained');
assert(html.includes('<html lang="en">'), 'English document language required');
assert(!/\p{Script=Han}/u.test(html), 'No untranslated Chinese should remain in the English HTML');
for (const script of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) new vm.Script(script[1]);
function extractPresets(file) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  const match = source.match(/const PRESETS = ([\s\S]*?);\n  const COLORS/);
  assert(match, 'Preset declarations must be present');
  return JSON.parse(JSON.stringify(vm.runInNewContext('(' + match[1] + ')')));
}
const original = extractPresets('studio.js');
const english = extractPresets('studio-en.js');
assert.deepEqual(Object.keys(english), Object.keys(original));
for (const key of Object.keys(original)) assert.deepEqual(english[key].config, original[key].config, key + ' design settings must be unchanged');
fs.writeFileSync(path.join(root, 'IMPRESIVE-Hero-Lab-EN.html'), html, 'utf8');
console.log('PASS: English-only content, document language, JavaScript syntax, unchanged preset settings, and self-contained bundle.');

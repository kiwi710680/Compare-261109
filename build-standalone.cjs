'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = __dirname;
let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
for (const file of ['studio.css', 'studio-i18n.css']) {
  const css = fs.readFileSync(path.join(root, file), 'utf8');
  html = html.replace('<link rel="stylesheet" href="' + file + '">', '<style>\n' + css + '\n</style>');
}
for (const file of ['assets.js', 'hero-preview.js', 'studio-i18n.js', 'studio.js']) {
  const script = fs.readFileSync(path.join(root, file), 'utf8');
  new vm.Script(script, { filename: file });
  html = html.replace('<script src="' + file + '"></script>', '<script>\n' + script.replace(/<\/script/gi, '<\\/script') + '\n</script>');
}
assert(!/<script\s+src=|<link\s+rel="stylesheet"/.test(html));
fs.writeFileSync(path.join(root, 'IMPRESIVE-Hero-Lab.html'), html, 'utf8');

const sandbox = { window: {} };
vm.createContext(sandbox);
for (const file of ['assets.js', 'hero-preview.js']) vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), sandbox);
const source = fs.readFileSync(path.join(root, 'studio.js'), 'utf8');
const presetMatch = source.match(/const PRESETS = ([\s\S]*?);\n  const COLORS/);
assert(presetMatch, 'Preset declarations found');
const presets = vm.runInNewContext('(' + presetMatch[1] + ')');
for (const [id, preset] of Object.entries(presets)) {
  const preview = sandbox.window.HeroPreview.render(preset.config, sandbox.window.HERO_ASSETS);
  assert(preview.includes('Leveraging Local Healthcare Data for'));
  assert(preview.includes('Global Real-World Evidence'));
  assert(preview.includes('Developed by the Population Health Data Center (PHDc) at National Cheng Kung University,'));
  assert.equal((preview.match(/<img\s/g) || []).length, 4);
  assert.equal((preview.match(/<img src="data:/g) || []).length, 4);
  assert(!/<script\s+src=|<link[^>]+href="https?:/.test(preview));
  const embeddedScript = preview.match(/<script>([\s\S]*?)<\/script>/);
  assert(embeddedScript);
  new vm.Script(embeddedScript[1], { filename: id + '-embedded-script.js' });
}
for (const script of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) new vm.Script(script[1]);
const assetFiles = { logoStatic: 'img/impresive-logo-static.svg', logoAnimated: 'img/impresive-logo-animated.svg', phdc: 'img/phdc-logo-vertical.png', ncku: 'img/ncku-logo-vertical.png', font: 'fonts/InterVariable-latin.woff2' };
for (const [key, file] of Object.entries(assetFiles)) {
  const original = fs.readFileSync(path.join(root, '../Website_261107-1/assets', file));
  const embedded = Buffer.from(sandbox.window.HERO_ASSETS[key].split(',')[1], 'base64');
  assert(original.equals(embedded), key + ' must remain unchanged');
}
console.log('PASS: 4 layouts, embedded script syntax, exact asset bytes, and standalone HTML bundle.');

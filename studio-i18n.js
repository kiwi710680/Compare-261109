(function () {
  'use strict';

  const STORAGE_KEY = 'impresive-hero-studio-language-261109-v1';
  const pairs = [
    ['IMPRESIVE 首頁主視覺比較與即時調色工具', 'Compare and customize IMPRESIVE homepage hero designs in real time.'],
    ['IMPRESIVE — 主視覺實驗室', 'IMPRESIVE — Hero Design Lab'],
    ['IMPRESIVE 主視覺實驗室首頁', 'IMPRESIVE Hero Design Lab home'],
    ['主視覺實驗室', 'Hero Design Lab'],
    ['本機設計工作台', 'Local design studio'],
    ['設定會自動保留', 'Settings save automatically'],
    ['匯出設計', 'Export'],
    ['下載 B 版 HTML', 'Download B as HTML'],
    ['含字型與圖像，可離線開啟', 'Includes fonts and images for offline use'],
    ['複製 B 版 CSS 變數', "Copy B's CSS variables"],
    ['保留目前色彩與版面參數', 'Keep the current colors and layout values'],
    ['下載 A/B 設定 JSON', 'Download A/B settings JSON'],
    ['載入設定 JSON', 'Import settings JSON'],
    ['主視覺調整控制台', 'Hero design controls'],
    ['從一個方向開始', 'Choose a direction'],
    ['4 個提案', '4 presets'],
    ['選範本，再把它調成你想要的樣子。', 'Start with a preset, then make it your own.'],
    ['設計範本', 'Design presets'],
    ['調整 B 版', 'Customize B'],
    ['範本設定', 'Preset values'],
    ['色彩調色盤', 'Color palette'],
    ['5 色', '5 colors'],
    ['漸層與版面', 'Gradient & layout'],
    ['拉桿調整', 'Sliders'],
    ['標誌動畫', 'Animate logo'],
    ['還原此範本', 'Reset this preset'],
    ['調整只影響比較頁，原網站維持原樣。', 'Changes apply here only. Your original site is unchanged.'],
    ['設計預覽與比較', 'Design preview and comparison'],
    ['即時預覽', 'Live preview'],
    ['已自訂', 'Customized'],
    ['預覽裝置', 'Preview device'],
    ['桌面', 'Desktop'],
    ['手機', 'Mobile'],
    ['比較模式', 'Comparison mode'],
    ['單一預覽', 'Preview'],
    ['左右比較', 'Side by side'],
    ['拉桿比較', 'Wipe compare'],
    ['比較基準', 'Reference'],
    ['A 版比較基準', 'A reference preset'],
    ['已固定的自訂版本', 'Pinned custom version'],
    ['將目前 B 版設為 A', 'Pin B as A'],
    ['A 版：固定比較基準', 'A: fixed reference design'],
    ['B 版：目前調整中的主視覺', 'B: current hero design'],
    ['即時調整', 'Live adjustments'],
    ['拖曳調整 A/B 比較分界', 'Adjust the A/B comparison divider'],
    ['右側預覽會跟著設定即時更新。切換「拉桿比較」，可與 A 版直接對照。', 'The preview updates as you adjust the controls. Choose Wipe compare to compare it directly with A.'],
    ['拖曳中線，或聚焦比較拉桿後按方向鍵。左側為 A 版，右側為目前調整的 B 版。', 'Drag the divider, or focus the comparison slider and use the arrow keys. A is on the left; your current B design is on the right.'],
    ['左右使用相同的畫面尺寸縮放，方便比較構圖、文字層次與色彩。', 'Both versions use the same preview dimensions, making composition, hierarchy, and color easier to compare.'],
    ['另開純預覽', 'Open clean preview'],
    ['以更輕的背景襯托品牌藍綠，縮小內文，讓標題與網絡標誌各自有清楚的位置。', "A lighter background highlights the brand's blue and green, while smaller body text gives the headline and network mark their own space."],
    ['請啟用 JavaScript 以使用即時調色與比較功能。', 'Enable JavaScript to use live color controls and design comparison.'],
    ['原版重建', 'Original'],
    ['保留原網站的視覺方向', 'Based on the original website'],
    ['原版的比較起點', 'The original comparison baseline'],
    ['依原站文案、配色與資產重建，方便比較。這是主視覺示意，並非原站的逐像素複製；機構標誌統一放在下方白底區。', 'Rebuilt from the original website copy, colors, and assets as a comparison baseline. This is a hero concept rather than a pixel-perfect copy; institution logos use a consistent white strip below.'],
    ['清透藍綠', 'Blue Mist'],
    ['更輕的底色，更清楚的層次', 'Lighter colors, clearer hierarchy'],
    ['建議從這一版開始', 'Our recommended starting point'],
    ['保留品牌的藍綠語彙，降低背景存在感、縮小內文。以留白和細線框景襯托原有網絡標誌，適合延續目前網站的學術形象。', 'Retains the brand blue-green palette with a quieter background and smaller body text. Generous spacing and fine outlines frame the original network mark, preserving the academic character of the website.'],
    ['暖白編輯式', 'Warm Editorial'],
    ['襯線字體與大面積色塊', 'Serif type and a bold color panel'],
    ['讓文字更像一份有份量的學術刊物', 'The presence of an academic publication'],
    ['以暖白文字區、襯線標題與獨立圖像區建立鮮明分工。這版同時探索字體與構圖；右側使用漸層終色及強調色，調色時可觀察整體平衡。', 'A warm white text area, a serif headline, and a separate image panel create a clear editorial structure. This direction explores both typography and composition. The right panel uses the gradient end and accent colors, so adjust them together for balance.'],
    ['深海藍', 'Deep Navy'],
    ['高對比標題與聚焦的品牌圖像', 'High contrast and a focused logo'],
    ['另一種更有張力的首頁表情', 'A more striking homepage direction'],
    ['以深藍底和淺青色建立明確對比，讓標題從背景中浮現。正式標誌維持原色並置於白底；若偏好較沉穩的研究平台形象，可以從這版調整。', 'A deep navy background and pale cyan emphasis give the headline stronger contrast. The official logo retains its original colors on white. Start here for a more composed research platform identity.'],
    ['背景起色', 'Background start'],
    ['漸層終色', 'Gradient end'],
    ['強調／按鈕', 'Accent / button'],
    ['主標題', 'Heading'],
    ['說明文字', 'Body text'],
    ['背景色濃度', 'Background intensity'],
    ['漸層角度', 'Gradient angle'],
    ['標題字級', 'Heading size'],
    ['標誌大小', 'Logo size'],
    ['上下留白', 'Vertical spacing'],
    ['背景點紋', 'Dot texture'],
    ['版型設定不完整', 'The layout settings are incomplete'],
    ['色碼需使用 #RRGGBB 格式', 'Colors must use the #RRGGBB format'],
    ['拉桿數值超出範圍', 'A slider value is out of range'],
    ['無法辨識設計設定', 'The design settings are not recognized'],
    ['目前僅保留在此分頁', 'Settings kept in this tab only'],
    ['已自動儲存於本機', 'Saved locally'],
    ['請匯出設定以保留調整', 'Export settings to keep your changes'],
    ['文字對比：背景端點檢查通過', 'Text contrast: endpoint check passed'],
    ['文字對比偏低，建議調整色彩', 'Low text contrast: adjust the colors'],
    ['估算文字與漸層端點的對比；未涵蓋所有漸層中間色、點紋、按鈕和右側圖像區。內文建議至少 4.5:1，大標題至少 3:1。', 'Estimates text contrast against gradient endpoints only. It does not cover every intermediate color, texture, button, or right-side image panel. Aim for at least 4.5:1 for body text and 3:1 for large headlines.'],
    ['推薦', 'Recommended'],
    ['・自訂', ' · Custom'],
    ['色碼需使用 #RRGGBB 格式，已保留上一個有效顏色。', 'Use the #RRGGBB format. The last valid color has been kept.'],
    ['已將目前 B 版固定為 A。繼續調整 B 版，就能直接比較。', 'Current B saved as A. Keep adjusting B to compare the changes.'],
    ['已還原目前範本。', 'Current preset reset.'],
    ['已匯出 B 版 HTML，圖像與字型皆已包含。', 'B exported as HTML with all images and fonts included.'],
    ['瀏覽器封鎖了新分頁，請允許彈出視窗或改用下載 HTML。', 'The browser blocked the new tab. Allow pop-ups or download the HTML instead.'],
    ['已匯出 A/B 配色與比較設定。', 'A/B color and comparison settings exported.'],
    ['已複製此版 CSS 變數，供本比較頁的版型使用。', 'CSS variables copied for use with the layouts in this comparison tool.'],
    ['瀏覽器限制剪貼簿，已改為下載 CSS 變數檔。', 'Clipboard access is unavailable. The CSS variables were downloaded instead.'],
    ['設定檔過大', 'The settings file is too large'],
    ['不支援此設定版本', 'This settings version is not supported'],
    ['已載入 A/B 設定。', 'A/B settings loaded.'],
    ['此瀏覽器暫時無法自動保留設定，可使用「匯出設計」下載設定。', 'Automatic saving is unavailable in this browser. Use Export to download your settings.'],
    ['介面語言', 'Interface language'],
    ['內文', 'Body'],
    ['主標', 'Heading'],
    ['強調', 'Accent'],
    ['左側 A 版', 'A on the left'],
    ['，右側 B 版', ', B on the right'],
    ['無法載入設定：', 'Could not load settings: '],
    ['。請使用本工具匯出的 JSON。', '. Use a JSON file exported by this tool.'],
    ['調色盤', ' color picker'],
    ['十六進位色碼', ' hex color']
  ];

  const toEnglish = new Map(pairs);
  const toChinese = new Map(pairs.map(([chinese, english]) => [english, chinese]));
  // Earlier English source variants remain recognized during an in-place refresh.
  toChinese.set('Preset settings', '範本設定');
  toChinese.set('Pinned custom design', '已固定的自訂版本');
  toChinese.set('The preview updates as you adjust the settings. Choose Wipe compare to compare it directly with A.', '右側預覽會跟著設定即時更新。切換「拉桿比較」，可與 A 版直接對照。');
  const colorLabels = [
    ['背景起色', 'Background start'], ['漸層終色', 'Gradient end'],
    ['強調／按鈕', 'Accent / button'], ['主標題', 'Heading'], ['說明文字', 'Body text']
  ];
  colorLabels.forEach(([chinese, english]) => {
    [[chinese + '調色盤', english + ' color picker'], [chinese + '十六進位色碼', english + ' hex color']].forEach(([source, target]) => {
      toEnglish.set(source, target);
      toChinese.set(target, source);
    });
  });

  let language = 'zh-Hant';
  try {
    if (localStorage.getItem(STORAGE_KEY) === 'en') language = 'en';
  } catch (error) {
    // Language switching remains available when browser storage is disabled.
  }

  const textSources = new WeakMap();
  const attributeSources = new WeakMap();
  const excluded = 'script,style,iframe,svg,textarea,code,pre,[data-language]';

  function t(text) {
    const value = String(text);
    const chinese = toChinese.get(value) || value;
    return language === 'en' ? (toEnglish.get(chinese) || value) : chinese;
  }

  function translateWithWhitespace(value) {
    const core = value.trim();
    if (!core) return value;
    const leading = value.slice(0, value.indexOf(core));
    const trailing = value.slice(value.indexOf(core) + core.length);
    return leading + t(core) + trailing;
  }

  function applyText(node) {
    const prior = textSources.get(node);
    const source = prior && node.nodeValue === prior.output ? prior.source : node.nodeValue;
    const output = translateWithWhitespace(source);
    if (node.nodeValue !== output) node.nodeValue = output;
    textSources.set(node, { source, output });
  }

  function applyAttributes(element) {
    let records = attributeSources.get(element);
    if (!records) { records = new Map(); attributeSources.set(element, records); }
    ['aria-label', 'title', 'aria-valuetext'].forEach((attribute) => {
      const current = element.getAttribute(attribute);
      if (current === null) return;
      const prior = records.get(attribute);
      const source = prior && current === prior.output ? prior.source : current;
      const output = translateWithWhitespace(source);
      if (current !== output) element.setAttribute(attribute, output);
      records.set(attribute, { source, output });
    });
  }

  function apply() {
    document.documentElement.lang = language;
    document.title = t('IMPRESIVE — 主視覺實驗室');
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = t('IMPRESIVE 首頁主視覺比較與即時調色工具');
    if (!document.body) return;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        return node.parentElement && !node.parentElement.closest(excluded) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    let node;
    while ((node = walker.nextNode())) applyText(node);
    document.querySelectorAll('[aria-label],[title],[aria-valuetext]').forEach((element) => {
      if (!element.closest('script,style,svg,[data-language]')) applyAttributes(element);
    });
    document.querySelectorAll('[data-language]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.language === language));
    });
    const group = document.querySelector('.language-switch');
    if (group) group.setAttribute('aria-label', t('介面語言'));
  }

  function setLanguage(next) {
    if (next !== 'zh-Hant' && next !== 'en') return;
    if (next === language) { apply(); return; }
    language = next;
    try { localStorage.setItem(STORAGE_KEY, language); } catch (error) { /* Keep the choice in this tab. */ }
    document.dispatchEvent(new CustomEvent('studio:languagechange', { detail: { language } }));
  }

  document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('button[data-language]') : null;
    if (button) setLanguage(button.dataset.language);
  });

  window.StudioI18n = Object.freeze({ t, apply, setLanguage, get language() { return language; } });
})();

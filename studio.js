(function () {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const t = (text) => window.StudioI18n ? window.StudioI18n.t(text) : text;
  const localize = () => { if (window.StudioI18n) window.StudioI18n.apply(); };
  const STORAGE_KEY = 'impresive-hero-studio-261109-v1';
  const PRESETS = {
    original: { name: '原版重建', subtitle: '保留原網站的視覺方向', noteTitle: '原版的比較起點', note: '依原站文案、配色與資產重建，方便比較。這是主視覺示意，並非原站的逐像素複製；機構標誌統一放在下方白底區。', config: { layout: 'original', bgStart: '#d3e4f6', bgEnd: '#d6eadf', accent: '#0058ad', ink: '#0b2545', muted: '#2f4559', angle: 115, strength: 100, titleSize: 62, logoSize: 318, spacing: 70, pattern: 0, animate: false } },
    refined: { name: '清透藍綠', subtitle: '更輕的底色，更清楚的層次', noteTitle: '建議從這一版開始', note: '保留品牌的藍綠語彙，降低背景存在感、縮小內文。以留白和細線框景襯托原有網絡標誌，適合延續目前網站的學術形象。', config: { layout: 'refined', bgStart: '#edf4f9', bgEnd: '#e5f0e9', accent: '#086a8b', ink: '#102f45', muted: '#47616d', angle: 115, strength: 78, titleSize: 62, logoSize: 304, spacing: 84, pattern: 0, animate: false } },
    editorial: { name: '暖白編輯式', subtitle: '襯線字體與大面積色塊', noteTitle: '讓文字更像一份有份量的學術刊物', note: '以暖白文字區、襯線標題與獨立圖像區建立鮮明分工。這版同時探索字體與構圖；右側使用漸層終色及強調色，調色時可觀察整體平衡。', config: { layout: 'editorial', bgStart: '#f4f1e8', bgEnd: '#bad9cc', accent: '#21665e', ink: '#243e39', muted: '#52665d', angle: 145, strength: 100, titleSize: 68, logoSize: 320, spacing: 80, pattern: 0, animate: false } },
    navy: { name: '深海藍', subtitle: '高對比標題與聚焦的品牌圖像', noteTitle: '另一種更有張力的首頁表情', note: '以深藍底和淺青色建立明確對比，讓標題從背景中浮現。正式標誌維持原色並置於白底；若偏好較沉穩的研究平台形象，可以從這版調整。', config: { layout: 'navy', bgStart: '#0b243d', bgEnd: '#103f4a', accent: '#8ad9dc', ink: '#f4f8fc', muted: '#b9cdd9', angle: 120, strength: 100, titleSize: 62, logoSize: 304, spacing: 84, pattern: 7, animate: false } }
  };
  const COLORS = [ ['bgStart', '背景起色'], ['bgEnd', '漸層終色'], ['accent', '強調／按鈕'], ['ink', '主標題'], ['muted', '說明文字'] ];
  const RANGES = [
    ['strength', '背景色濃度', 0, 100, 1, '%'], ['angle', '漸層角度', 0, 360, 1, '°'],
    ['titleSize', '標題字級', 42, 76, 1, ' px'], ['logoSize', '標誌大小', 200, 420, 2, ' px'],
    ['spacing', '上下留白', 48, 110, 2, ' px'], ['pattern', '背景點紋', 0, 40, 1, '%']
  ];
  const clone = (value) => JSON.parse(JSON.stringify(value));
  let state = { preset: 'refined', b: clone(PRESETS.refined.config), a: clone(PRESETS.original.config), reference: 'original', mode: 'single', device: 'desktop', split: 50 };
  let storageAvailable = true;
  let liveFrame = 0;
  let saveTimer;
  let toastTimer;
  let previewUrl;

  function sanitizeConfig(input) {
    if (!input || typeof input !== 'object' || !Object.hasOwn(PRESETS,input.layout)) throw new Error(t('版型設定不完整'));
    const safe = clone(PRESETS[input.layout].config);
    COLORS.forEach(([key]) => {
      if (!/^#[0-9a-f]{6}$/i.test(String(input[key]))) throw new Error(t('色碼需使用 #RRGGBB 格式'));
      safe[key] = input[key].toLowerCase();
    });
    RANGES.forEach(([key, , min, max]) => {
      if (typeof input[key] !== 'number' || !Number.isFinite(input[key]) || input[key] < min || input[key] > max) throw new Error(t('拉桿數值超出範圍'));
      safe[key] = input[key];
    });
    safe.animate = input.animate === true;
    return safe;
  }

  function sanitizeState(input) {
    if (!input || typeof input !== 'object' || !Object.hasOwn(PRESETS,input.preset)) throw new Error(t('無法辨識設計設定'));
    return { preset: input.preset, a: sanitizeConfig(input.a), b: sanitizeConfig(input.b),
      reference: ['original','refined','editorial','navy','snapshot'].includes(input.reference) ? input.reference : 'snapshot',
      mode: ['single','side','wipe'].includes(input.mode) ? input.mode : 'single',
      device: input.device === 'mobile' ? 'mobile' : 'desktop', split: Number.isFinite(Number(input.split)) ? Math.max(0, Math.min(100, Number(input.split))) : 50 };
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) state = sanitizeState(JSON.parse(saved));
  } catch (error) {
    storageAvailable = false;
    $('#saveStatus').textContent = t('目前僅保留在此分頁');
  }

  function persist() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); storageAvailable = true; $('#saveStatus').textContent = t('已自動儲存於本機'); }
      catch (error) { storageAvailable = false; $('#saveStatus').textContent = t('請匯出設定以保留調整'); }
    }, 240);
  }
  function notify(message) {
    clearTimeout(toastTimer); $('#toast').textContent = t(message); $('#toast').hidden = false;
    toastTimer = setTimeout(() => { $('#toast').hidden = true; }, 4200);
  }
  function rgb(hex) { return [1,3,5].map((index) => parseInt(hex.slice(index,index+2),16)); }
  function blend(color, base, amount) {
    const c = rgb(color), b = rgb(base);
    return '#' + c.map((value,index) => Math.round(b[index] + (value-b[index])*amount).toString(16).padStart(2,'0')).join('');
  }
  function luminance(hex) {
    const c = rgb(hex).map((value) => { const n = value/255; return n <= .04045 ? n/12.92 : ((n+.055)/1.055)**2.4; });
    return .2126*c[0]+.7152*c[1]+.0722*c[2];
  }
  function contrast(a,b) { const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05); }
  function variables(config) {
    const base = config.layout === 'navy' ? '#071b30' : '#ffffff';
    return { '--start': blend(config.bgStart,base,config.strength/100), '--end': blend(config.bgEnd,base,config.strength/100),
      '--accent':config.accent, '--ink':config.ink, '--muted':config.muted, '--angle':config.angle+'deg',
      '--title-size':config.titleSize+'px', '--logo-size':config.logoSize+'px', '--space':config.spacing+'px', '--pattern':String(config.pattern/100),
      '--button-text': contrast(config.accent,'#ffffff') >= contrast(config.accent,'#0b2545') ? '#ffffff' : '#0b2545' };
  }
  function assessContrast() {
    const vars=variables(state.b);
    const backgrounds=state.b.layout==='editorial' ? [vars['--start']] : [vars['--start'],vars['--end']];
    const body=Math.min(...backgrounds.map((color)=>contrast(state.b.muted,color)));
    const title=Math.min(...backgrounds.map((color)=>contrast(state.b.ink,color)));
    const emphasis=Math.min(...backgrounds.map((color)=>contrast(state.b.accent,color)));
    const pass = body>=4.5 && title>=3 && emphasis>=3;
    const status=$('#contrastStatus');status.classList.toggle('warning',!pass);
    status.replaceChildren();
    const strong=document.createElement('strong');strong.textContent=t(pass?'文字對比：背景端點檢查通過':'文字對比偏低，建議調整色彩');
    const detail=document.createElement('span');detail.textContent=`${t('內文')} ${body.toFixed(1)}:1 · ${t('主標')} ${title.toFixed(1)}:1 · ${t('強調')} ${emphasis.toFixed(1)}:1`;
    status.append(strong,detail);
    status.title=t('估算文字與漸層端點的對比；未涵蓋所有漸層中間色、點紋、按鈕和右側圖像區。內文建議至少 4.5:1，大標題至少 3:1。');
  }
  function isCustom() { return JSON.stringify(state.b)!==JSON.stringify(PRESETS[state.preset].config); }
  function updateLabels() {
    const preset=PRESETS[state.preset],custom=isCustom();
    $('#currentName').textContent=t(preset.name);$('#versionName').textContent=t(preset.name)+(custom?t('・自訂'):'');
    $('#modifiedDot').hidden=!custom;$('#customBadge').textContent=t(custom?'已自訂':'範本設定');
    $('#referenceName').textContent=t(state.reference==='snapshot'?'已固定的自訂版本':PRESETS[state.reference].name);
    $('#directionTitle').textContent=t(preset.noteTitle);$('#directionDescription').textContent=t(preset.note);
    document.querySelectorAll('.preset').forEach((button)=>button.setAttribute('aria-pressed',String(button.dataset.preset===state.preset)));
    assessContrast();
    localize();
  }

  Object.entries(PRESETS).forEach(([id,preset])=>{
    const button=document.createElement('button');button.type='button';button.className='preset';button.dataset.preset=id;button.setAttribute('aria-pressed','false');
    button.innerHTML=`<span class="preset-art" style="--c1:${preset.config.bgStart};--c2:${preset.config.bgEnd};--c3:${preset.config.accent}" aria-hidden="true"></span><span class="preset-text"><span class="preset-title">${preset.name}${id==='refined'?'<span class="recommended">推薦</span>':''}</span><span class="preset-subtitle">${preset.subtitle}</span></span><svg class="preset-check" viewBox="0 0 20 20" aria-hidden="true"><path d="m4 10 4 4 8-8"/></svg>`;
    button.addEventListener('click',()=>{state.preset=id;state.b=clone(preset.config);syncInputs();renderB();updateLabels();persist();});
    $('#presetList').append(button);
  });
  COLORS.forEach(([key,label])=>{
    const group=document.createElement('div');group.className='color-control';
    group.innerHTML=`<label for="color-${key}">${label}</label><div class="color-field"><input type="color" id="color-${key}" data-color="${key}" aria-label="${label}調色盤"><input type="text" id="hex-${key}" data-hex="${key}" aria-label="${label}十六進位色碼" maxlength="7" spellcheck="false" autocomplete="off" pattern="#[0-9a-fA-F]{6}"></div>`;
    $('#colorControls').append(group);
  });
  RANGES.forEach(([key,label,min,max,step,unit])=>{
    const group=document.createElement('div');group.className='range-control';
    group.innerHTML=`<div class="range-label"><label for="range-${key}">${label}</label><output for="range-${key}" id="output-${key}"></output></div><input type="range" id="range-${key}" data-range="${key}" min="${min}" max="${max}" step="${step}" aria-label="${label}">`;
    $('#rangeControls').append(group);
  });

  function syncInputs() {
    COLORS.forEach(([key])=>{ $('#color-'+key).value=state.b[key];$('#hex-'+key).value=state.b[key].toUpperCase();$('#hex-'+key).removeAttribute('aria-invalid'); });
    RANGES.forEach(([key,,,max,,unit])=>{
      const range=$('#range-'+key);range.value=state.b[key];$('#output-'+key).value=state.b[key]+unit;
      range.style.setProperty('--range-progress',((state.b[key]-Number(range.min))/(max-Number(range.min))*100)+'%');
    });
    $('#animateLogo').checked=state.b.animate;
    $('#referencePreset option[value=snapshot]').hidden=state.reference!=='snapshot';$('#referencePreset').value=state.reference;
    $('#wipeRange').value=state.split;updateWipe();
  }
  function scheduleLiveUpdate() {
    if(liveFrame) return;
    liveFrame=requestAnimationFrame(()=>{
      liveFrame=0;$('#frameB').contentWindow.postMessage({type:'impresive:settings',styles:variables(state.b)},'*');
      updateLabels();persist();
    });
  }
  document.querySelectorAll('[data-color]').forEach((input)=>input.addEventListener('input',()=>{
    const key=input.dataset.color;state.b[key]=input.value;$('#hex-'+key).value=input.value.toUpperCase();$('#hex-'+key).removeAttribute('aria-invalid');scheduleLiveUpdate();
  }));
  document.querySelectorAll('[data-hex]').forEach((input)=>{
    input.addEventListener('input',()=>{
      const valid=/^#[0-9a-f]{6}$/i.test(input.value);input.setAttribute('aria-invalid',String(!valid));
      if(valid){state.b[input.dataset.hex]=input.value.toLowerCase();$('#color-'+input.dataset.hex).value=input.value;scheduleLiveUpdate();}
    });
    input.addEventListener('blur',()=>{if(input.getAttribute('aria-invalid')==='true'){input.value=state.b[input.dataset.hex].toUpperCase();input.removeAttribute('aria-invalid');notify('色碼需使用 #RRGGBB 格式，已保留上一個有效顏色。');}});
  });
  document.querySelectorAll('[data-range]').forEach((input)=>input.addEventListener('input',()=>{
    const key=input.dataset.range,definition=RANGES.find((row)=>row[0]===key);state.b[key]=Number(input.value);
    $('#output-'+key).value=input.value+definition[5];input.style.setProperty('--range-progress',((Number(input.value)-Number(input.min))/(Number(input.max)-Number(input.min))*100)+'%');scheduleLiveUpdate();
  }));
  $('#animateLogo').addEventListener('change',()=>{state.b.animate=$('#animateLogo').checked;renderB();updateLabels();persist();});

  function renderA() { $('#frameA').srcdoc=window.HeroPreview.render(state.a,window.HERO_ASSETS); }
  function renderB() { $('#frameB').srcdoc=window.HeroPreview.render(state.b,window.HERO_ASSETS); }
  $('#frameB').addEventListener('load',()=>{ $('#frameB').contentWindow.postMessage({type:'impresive:settings',styles:variables(state.b)},'*'); });
  function updateWipe() {
    $('#stage').style.setProperty('--split',state.split+'%');$('#wipeControl').style.setProperty('--split',state.split+'%');
    $('#wipeRange').setAttribute('aria-valuetext',window.StudioI18n?.language==='en' ? `A on the left ${state.split}%, B on the right ${100-state.split}%` : `左側 A 版 ${state.split}%，右側 B 版 ${100-state.split}%`);
  }
  $('#wipeRange').addEventListener('input',()=>{state.split=Number($('#wipeRange').value);updateWipe();persist();});
  function scaleFrames() {
    const width=state.device==='mobile'?390:1440,height=state.device==='mobile'?1120:900;
    ['A','B'].forEach((id)=>{
      const shell=$('#shell'+id),frame=$('#frame'+id),available=shell.getBoundingClientRect().width;
      if(!available) return;
      const scale=available/width;frame.style.width=width+'px';frame.style.height=height+'px';frame.style.transform=`scale(${scale})`;shell.style.height=(height*scale)+'px';
    });
    $('#canvasSize').textContent=width+' × '+height;
  }
  function syncView() {
    $('#stage').dataset.mode=state.mode;$('#stage').dataset.device=state.device;
    $('#wipeControl').hidden=state.mode!=='wipe';
    document.querySelectorAll('[data-mode]').forEach((button)=>{if(button.tagName==='BUTTON')button.setAttribute('aria-pressed',String(button.dataset.mode===state.mode));});
    document.querySelectorAll('[data-device]').forEach((button)=>{if(button.tagName==='BUTTON')button.setAttribute('aria-pressed',String(button.dataset.device===state.device));});
    $('#previewHint').textContent=t(state.mode==='wipe'?'拖曳中線，或聚焦比較拉桿後按方向鍵。左側為 A 版，右側為目前調整的 B 版。':state.mode==='side'?'左右使用相同的畫面尺寸縮放，方便比較構圖、文字層次與色彩。':'右側預覽會跟著設定即時更新。切換「拉桿比較」，可與 A 版直接對照。');
    requestAnimationFrame(scaleFrames);
    localize();
  }
  document.querySelectorAll('button[data-mode]').forEach((button)=>button.addEventListener('click',()=>{state.mode=button.dataset.mode;syncView();persist();}));
  document.querySelectorAll('button[data-device]').forEach((button)=>button.addEventListener('click',()=>{state.device=button.dataset.device;syncView();persist();}));
  $('#referencePreset').addEventListener('change',()=>{
    if($('#referencePreset').value==='snapshot')return;
    state.reference=$('#referencePreset').value;state.a=clone(PRESETS[state.reference].config);$('#referencePreset option[value=snapshot]').hidden=true;renderA();updateLabels();persist();
  });
  $('#pinReference').addEventListener('click',()=>{state.a=clone(state.b);state.reference='snapshot';state.mode='wipe';renderA();syncInputs();syncView();updateLabels();persist();notify('已將目前 B 版固定為 A。繼續調整 B 版，就能直接比較。');});
  $('#resetPreset').addEventListener('click',()=>{state.b=clone(PRESETS[state.preset].config);syncInputs();renderB();updateLabels();persist();notify('已還原目前範本。');});

  function download(text,type,name) {
    const url=URL.createObjectURL(new Blob([text],{type}));const link=document.createElement('a');link.href=url;link.download=name;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);$('#exportMenu').open=false;
  }
  function standalone() {
    // Resolve only source-site navigation; keep the local skip link in the exported document.
    const sourceUrl=new URL('../Website_261107-1/',document.baseURI).href.replace(/&/g,'&amp;').replace(/"/g,'&quot;');
    return window.HeroPreview.render(state.b,window.HERO_ASSETS).replaceAll('href="../Website_261107-1/','href="'+sourceUrl);
  }
  $('#downloadHtml').addEventListener('click',()=>{download(standalone(),'text/html;charset=utf-8','IMPRESIVE-'+state.preset+'-hero.html');notify('已匯出 B 版 HTML，圖像與字型皆已包含。');});
  $('#openPreview').addEventListener('click',()=>{
    if(previewUrl)URL.revokeObjectURL(previewUrl);previewUrl=URL.createObjectURL(new Blob([standalone()],{type:'text/html;charset=utf-8'}));
    const preview=window.open(previewUrl,'_blank');if(preview)preview.opener=null;else notify('瀏覽器封鎖了新分頁，請允許彈出視窗或改用下載 HTML。');
  });
  $('#downloadJson').addEventListener('click',()=>{download(JSON.stringify({version:1,...state},null,2),'application/json','IMPRESIVE-hero-settings.json');notify('已匯出 A/B 配色與比較設定。');});
  $('#copyCss').addEventListener('click',async()=>{
    const css='/* IMPRESIVE '+state.preset+' hero preview variables */\n:root {\n'+Object.entries(variables(state.b)).map(([key,value])=>'  '+key+': '+value+';').join('\n')+'\n}\n';
    try { if(!navigator.clipboard)throw new Error('Clipboard unavailable');await navigator.clipboard.writeText(css);notify('已複製此版 CSS 變數，供本比較頁的版型使用。'); }
    catch(error){download(css,'text/css;charset=utf-8','IMPRESIVE-hero-variables.css');notify('瀏覽器限制剪貼簿，已改為下載 CSS 變數檔。');}
    $('#exportMenu').open=false;
  });
  $('#importJson').addEventListener('click',()=>{$('#importFile').click();$('#exportMenu').open=false;});
  $('#importFile').addEventListener('change',async(event)=>{
    const file=event.target.files[0];if(!file)return;
    try{if(file.size>65536)throw new Error(t('設定檔過大'));const imported=JSON.parse(await file.text());if(imported.version!==1)throw new Error(t('不支援此設定版本'));state=sanitizeState(imported);syncInputs();renderA();renderB();syncView();updateLabels();persist();notify('已載入 A/B 設定。');}
    catch(error){notify(t('無法載入設定：')+error.message+t('。請使用本工具匯出的 JSON。'));}finally{event.target.value='';}
  });
  document.addEventListener('click',(event)=>{if(!$('#exportMenu').contains(event.target))$('#exportMenu').open=false;});
  document.addEventListener('keydown',(event)=>{if(event.key==='Escape')$('#exportMenu').open=false;});
  new ResizeObserver(()=>requestAnimationFrame(scaleFrames)).observe($('#canvasArea'));
  window.addEventListener('pagehide',()=>{if(previewUrl)URL.revokeObjectURL(previewUrl);});
  document.addEventListener('studio:languagechange',()=>{
    updateLabels();updateWipe();syncView();
  });
  const fontStyle=document.createElement('style');
  fontStyle.textContent='@font-face{font-family:StudioInter;src:url("'+window.HERO_ASSETS.font+'");font-weight:100 900;font-display:swap}';
  document.head.append(fontStyle);
  syncInputs();renderA();renderB();syncView();updateLabels();
  localize();
  if(!storageAvailable)notify('此瀏覽器暫時無法自動保留設定，可使用「匯出設計」下載設定。');
})();

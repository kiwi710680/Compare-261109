(function () {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const STORAGE_KEY = 'impresive-hero-studio-261109-v1';
  const PRESETS = {
    original: { name: 'Original', subtitle: 'Based on the original website', noteTitle: 'The original comparison baseline', note: 'Rebuilt from the original website copy, colors, and assets as a comparison baseline. This is a hero concept rather than a pixel-perfect copy; institution logos use a consistent white strip below.', config: { layout: 'original', bgStart: '#d3e4f6', bgEnd: '#d6eadf', accent: '#0058ad', ink: '#0b2545', muted: '#2f4559', angle: 115, strength: 100, titleSize: 62, logoSize: 318, spacing: 70, pattern: 0, animate: false } },
    refined: { name: 'Blue Mist', subtitle: 'Lighter colors, clearer hierarchy', noteTitle: 'Our recommended starting point', note: 'Retains the brand blue-green palette with a quieter background and smaller body text. Generous spacing and fine outlines frame the original network mark, preserving the academic character of the website.', config: { layout: 'refined', bgStart: '#edf4f9', bgEnd: '#e5f0e9', accent: '#086a8b', ink: '#102f45', muted: '#47616d', angle: 115, strength: 78, titleSize: 62, logoSize: 304, spacing: 84, pattern: 0, animate: false } },
    editorial: { name: 'Warm Editorial', subtitle: 'Serif type and a bold color panel', noteTitle: 'The presence of an academic publication', note: 'A warm white text area, a serif headline, and a separate image panel create a clear editorial structure. This direction explores both typography and composition. The right panel uses the gradient end and accent colors, so adjust them together for balance.', config: { layout: 'editorial', bgStart: '#f4f1e8', bgEnd: '#bad9cc', accent: '#21665e', ink: '#243e39', muted: '#52665d', angle: 145, strength: 100, titleSize: 68, logoSize: 320, spacing: 80, pattern: 0, animate: false } },
    navy: { name: 'Deep Navy', subtitle: 'High contrast and a focused logo', noteTitle: 'A more striking homepage direction', note: 'A deep navy background and pale cyan emphasis give the headline stronger contrast. The official logo retains its original colors on white. Start here for a more composed research platform identity.', config: { layout: 'navy', bgStart: '#0b243d', bgEnd: '#103f4a', accent: '#8ad9dc', ink: '#f4f8fc', muted: '#b9cdd9', angle: 120, strength: 100, titleSize: 62, logoSize: 304, spacing: 84, pattern: 7, animate: false } }
  };
  const COLORS = [ ['bgStart', 'Background start'], ['bgEnd', 'Gradient end'], ['accent', 'Accent / button'], ['ink', 'Heading'], ['muted', 'Body text'] ];
  const RANGES = [
    ['strength', 'Background intensity', 0, 100, 1, '%'], ['angle', 'Gradient angle', 0, 360, 1, '°'],
    ['titleSize', 'Heading size', 42, 76, 1, ' px'], ['logoSize', 'Logo size', 200, 420, 2, ' px'],
    ['spacing', 'Vertical spacing', 48, 110, 2, ' px'], ['pattern', 'Dot texture', 0, 40, 1, '%']
  ];
  const clone = (value) => JSON.parse(JSON.stringify(value));
  let state = { preset: 'refined', b: clone(PRESETS.refined.config), a: clone(PRESETS.original.config), reference: 'original', mode: 'single', device: 'desktop', split: 50 };
  let storageAvailable = true;
  let liveFrame = 0;
  let saveTimer;
  let toastTimer;
  let previewUrl;

  function sanitizeConfig(input) {
    if (!input || typeof input !== 'object' || !Object.hasOwn(PRESETS,input.layout)) throw new Error('The layout settings are incomplete');
    const safe = clone(PRESETS[input.layout].config);
    COLORS.forEach(([key]) => {
      if (!/^#[0-9a-f]{6}$/i.test(String(input[key]))) throw new Error('Colors must use the #RRGGBB format');
      safe[key] = input[key].toLowerCase();
    });
    RANGES.forEach(([key, , min, max]) => {
      if (typeof input[key] !== 'number' || !Number.isFinite(input[key]) || input[key] < min || input[key] > max) throw new Error('A slider value is out of range');
      safe[key] = input[key];
    });
    safe.animate = input.animate === true;
    return safe;
  }

  function sanitizeState(input) {
    if (!input || typeof input !== 'object' || !Object.hasOwn(PRESETS,input.preset)) throw new Error('The design settings are not recognized');
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
    $('#saveStatus').textContent = 'Settings kept in this tab only';
  }

  function persist() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); storageAvailable = true; $('#saveStatus').textContent = 'Saved locally'; }
      catch (error) { storageAvailable = false; $('#saveStatus').textContent = 'Export settings to keep your changes'; }
    }, 240);
  }
  function notify(message) {
    clearTimeout(toastTimer); $('#toast').textContent = message; $('#toast').hidden = false;
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
    const strong=document.createElement('strong');strong.textContent=pass?'Text contrast: endpoint check passed':'Low text contrast: adjust the colors';
    const detail=document.createElement('span');detail.textContent=`Body ${body.toFixed(1)}:1 · Heading ${title.toFixed(1)}:1 · Accent ${emphasis.toFixed(1)}:1`;
    status.append(strong,detail);
    status.title='Estimates text contrast against gradient endpoints only. It does not cover every intermediate color, texture, button, or right-side image panel. Aim for at least 4.5:1 for body text and 3:1 for large headlines.';
  }
  function isCustom() { return JSON.stringify(state.b)!==JSON.stringify(PRESETS[state.preset].config); }
  function updateLabels() {
    const preset=PRESETS[state.preset],custom=isCustom();
    $('#currentName').textContent=preset.name;$('#versionName').textContent=preset.name+(custom?' · Custom':'');
    $('#modifiedDot').hidden=!custom;$('#customBadge').textContent=custom?'Customized':'Preset values';
    $('#referenceName').textContent=state.reference==='snapshot'?'Pinned custom design':PRESETS[state.reference].name;
    $('#directionTitle').textContent=preset.noteTitle;$('#directionDescription').textContent=preset.note;
    document.querySelectorAll('.preset').forEach((button)=>button.setAttribute('aria-pressed',String(button.dataset.preset===state.preset)));
    assessContrast();
  }

  Object.entries(PRESETS).forEach(([id,preset])=>{
    const button=document.createElement('button');button.type='button';button.className='preset';button.dataset.preset=id;button.setAttribute('aria-pressed','false');
    button.innerHTML=`<span class="preset-art" style="--c1:${preset.config.bgStart};--c2:${preset.config.bgEnd};--c3:${preset.config.accent}" aria-hidden="true"></span><span class="preset-text"><span class="preset-title">${preset.name}${id==='refined'?'<span class="recommended">Recommended</span>':''}</span><span class="preset-subtitle">${preset.subtitle}</span></span><svg class="preset-check" viewBox="0 0 20 20" aria-hidden="true"><path d="m4 10 4 4 8-8"/></svg>`;
    button.addEventListener('click',()=>{state.preset=id;state.b=clone(preset.config);syncInputs();renderB();updateLabels();persist();});
    $('#presetList').append(button);
  });
  COLORS.forEach(([key,label])=>{
    const group=document.createElement('div');group.className='color-control';
    group.innerHTML=`<label for="color-${key}">${label}</label><div class="color-field"><input type="color" id="color-${key}" data-color="${key}" aria-label="${label} color picker"><input type="text" id="hex-${key}" data-hex="${key}" aria-label="${label} hex color" maxlength="7" spellcheck="false" autocomplete="off" pattern="#[0-9a-fA-F]{6}"></div>`;
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
    input.addEventListener('blur',()=>{if(input.getAttribute('aria-invalid')==='true'){input.value=state.b[input.dataset.hex].toUpperCase();input.removeAttribute('aria-invalid');notify('Use the #RRGGBB format. The last valid color has been kept.');}});
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
    $('#wipeRange').setAttribute('aria-valuetext',`A on the left ${state.split}%, B on the right ${100-state.split}%`);
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
    $('#previewHint').textContent=state.mode==='wipe'?'Drag the divider, or focus the comparison slider and use the arrow keys. A is on the left; your current B design is on the right.':state.mode==='side'?'Both versions use the same preview dimensions, making composition, hierarchy, and color easier to compare.':'The preview updates as you adjust the controls. Choose Wipe compare to compare it directly with A.';
    requestAnimationFrame(scaleFrames);
  }
  document.querySelectorAll('button[data-mode]').forEach((button)=>button.addEventListener('click',()=>{state.mode=button.dataset.mode;syncView();persist();}));
  document.querySelectorAll('button[data-device]').forEach((button)=>button.addEventListener('click',()=>{state.device=button.dataset.device;syncView();persist();}));
  $('#referencePreset').addEventListener('change',()=>{
    if($('#referencePreset').value==='snapshot')return;
    state.reference=$('#referencePreset').value;state.a=clone(PRESETS[state.reference].config);$('#referencePreset option[value=snapshot]').hidden=true;renderA();updateLabels();persist();
  });
  $('#pinReference').addEventListener('click',()=>{state.a=clone(state.b);state.reference='snapshot';state.mode='wipe';renderA();syncInputs();syncView();updateLabels();persist();notify('Current B saved as A. Keep adjusting B to compare the changes.');});
  $('#resetPreset').addEventListener('click',()=>{state.b=clone(PRESETS[state.preset].config);syncInputs();renderB();updateLabels();persist();notify('Current preset reset.');});

  function download(text,type,name) {
    const url=URL.createObjectURL(new Blob([text],{type}));const link=document.createElement('a');link.href=url;link.download=name;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);$('#exportMenu').open=false;
  }
  function standalone() {
    // Resolve only source-site navigation; keep the local skip link in the exported document.
    const sourceUrl=new URL('../Website_261107-1/',document.baseURI).href.replace(/&/g,'&amp;').replace(/"/g,'&quot;');
    return window.HeroPreview.render(state.b,window.HERO_ASSETS).replaceAll('href="../Website_261107-1/','href="'+sourceUrl);
  }
  $('#downloadHtml').addEventListener('click',()=>{download(standalone(),'text/html;charset=utf-8','IMPRESIVE-'+state.preset+'-hero.html');notify('B exported as HTML with all images and fonts included.');});
  $('#openPreview').addEventListener('click',()=>{
    if(previewUrl)URL.revokeObjectURL(previewUrl);previewUrl=URL.createObjectURL(new Blob([standalone()],{type:'text/html;charset=utf-8'}));
    const preview=window.open(previewUrl,'_blank');if(preview)preview.opener=null;else notify('The browser blocked the new tab. Allow pop-ups or download the HTML instead.');
  });
  $('#downloadJson').addEventListener('click',()=>{download(JSON.stringify({version:1,...state},null,2),'application/json','IMPRESIVE-hero-settings.json');notify('A/B color and comparison settings exported.');});
  $('#copyCss').addEventListener('click',async()=>{
    const css='/* IMPRESIVE '+state.preset+' hero preview variables */\n:root {\n'+Object.entries(variables(state.b)).map(([key,value])=>'  '+key+': '+value+';').join('\n')+'\n}\n';
    try { if(!navigator.clipboard)throw new Error('Clipboard unavailable');await navigator.clipboard.writeText(css);notify('CSS variables copied for use with the layouts in this comparison tool.'); }
    catch(error){download(css,'text/css;charset=utf-8','IMPRESIVE-hero-variables.css');notify('Clipboard access is unavailable. The CSS variables were downloaded instead.');}
    $('#exportMenu').open=false;
  });
  $('#importJson').addEventListener('click',()=>{$('#importFile').click();$('#exportMenu').open=false;});
  $('#importFile').addEventListener('change',async(event)=>{
    const file=event.target.files[0];if(!file)return;
    try{if(file.size>65536)throw new Error('The settings file is too large');const imported=JSON.parse(await file.text());if(imported.version!==1)throw new Error('This settings version is not supported');state=sanitizeState(imported);syncInputs();renderA();renderB();syncView();updateLabels();persist();notify('A/B settings loaded.');}
    catch(error){notify('Could not load settings: '+error.message+'. Use a JSON file exported by this tool.');}finally{event.target.value='';}
  });
  document.addEventListener('click',(event)=>{if(!$('#exportMenu').contains(event.target))$('#exportMenu').open=false;});
  document.addEventListener('keydown',(event)=>{if(event.key==='Escape')$('#exportMenu').open=false;});
  new ResizeObserver(()=>requestAnimationFrame(scaleFrames)).observe($('#canvasArea'));
  window.addEventListener('pagehide',()=>{if(previewUrl)URL.revokeObjectURL(previewUrl);});
  const fontStyle=document.createElement('style');
  fontStyle.textContent='@font-face{font-family:StudioInter;src:url("'+window.HERO_ASSETS.font+'");font-weight:100 900;font-display:swap}';
  document.head.append(fontStyle);
  syncInputs();renderA();renderB();syncView();updateLabels();
  if(!storageAvailable)notify('Automatic saving is unavailable in this browser. Use Export to download your settings.');
})();

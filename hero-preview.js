(function () {
  "use strict";

  const defaults = {
    layout: "original", bgStart: "#d3e4f6", bgEnd: "#d6eadf",
    accent: "#0058ad", ink: "#0b2545", muted: "#2f4559", angle: 120,
    strength: 100, titleSize: 58, logoSize: 300, spacing: 70,
    pattern: 0, animate: false
  };

  function escape(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[char]));
  }

  function numeric(value, fallback, min, max) {
    const number = Number(value);
    return Number.isFinite(number) ? Math.max(min, Math.min(max, number)) : fallback;
  }

  function hex(value, fallback) {
    return /^#[\da-f]{6}$/i.test(String(value)) ? String(value) : fallback;
  }

  function blend(color, base, amount) {
    const channel = (source, index) => parseInt(source.slice(index, index + 2), 16);
    return "#" + [1, 3, 5].map((index) => Math.round(
      channel(base, index) + (channel(color, index) - channel(base, index)) * amount
    ).toString(16).padStart(2, "0")).join("");
  }

  function luminance(color) {
    const values = [1, 3, 5].map((index) => {
      const value = parseInt(color.slice(index, index + 2), 16) / 255;
      return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4;
    });
    return values[0] * .2126 + values[1] * .7152 + values[2] * .0722;
  }

  function buttonText(background) {
    const surface = luminance(background);
    const whiteContrast = 1.05 / (surface + .05);
    const darkContrast = (Math.max(surface, luminance("#0b2545")) + .05) /
      (Math.min(surface, luminance("#0b2545")) + .05);
    return whiteContrast >= darkContrast ? "#ffffff" : "#0b2545";
  }

  function render(config, assets) {
    const incoming = config || {};
    const suppliedAssets = assets || {};
    const settings = { ...defaults, ...incoming };
    const layout = ["original", "refined", "editorial", "navy"].includes(settings.layout)
      ? settings.layout : "original";
    const isDark = layout === "navy";
    const strength = numeric(settings.strength, 100, 0, 100) / 100;
    const base = isDark ? "#071b30" : "#ffffff";
    const start = blend(hex(settings.bgStart, defaults.bgStart), base, strength);
    const end = blend(hex(settings.bgEnd, defaults.bgEnd), base, strength);
    const ink = hex(settings.ink, isDark ? "#f2f7fc" : defaults.ink);
    const accent = hex(settings.accent, isDark ? "#7cd8e6" : defaults.accent);
    const muted = hex(settings.muted, isDark ? "#bdd0df" : defaults.muted);
    const angle = numeric(settings.angle, 120, 0, 360);
    const titleSize = numeric(settings.titleSize, 58, 42, 76);
    const logoSize = numeric(settings.logoSize, 300, 200, 420);
    const spacing = numeric(settings.spacing, 70, 48, 110);
    const pattern = numeric(settings.pattern, 0, 0, 40) / 100;
    const staticLogo = escape(suppliedAssets.logoStatic);
    const animatedLogo = escape(suppliedAssets.logoAnimated || suppliedAssets.logoStatic);
    const logo = settings.animate ? animatedLogo : staticLogo;
    const phdc = escape(suppliedAssets.phdc);
    const ncku = escape(suppliedAssets.ncku);
    const font = escape(suppliedAssets.font);
    const navItems = [
      ["Home", "index.html"], ["About", "about.html"], ["Objective", "objective.html"],
      ["How", "how.html"], ["Accomplishment", "cases.html"],
      ["Partner", "databases.html"], ["Join", "join.html"]
    ];
    const nav = navItems.map(([label, href], index) =>
      `<a href="../Website_261107-1/${href}" target="_blank" rel="noopener noreferrer"${index === 0 ? ' aria-current="page"' : ""}${label === "Join" ? ' class="nav-join"' : ""}>${label}<span class="sr-only"> (opens original website in a new tab)</span></a>`
    ).join("");

    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>IMPRESIVE — ${escape(layout)} hero preview</title>
  <style>
    @font-face{font-family:Inter;src:url("${font}") format("woff2");font-weight:100 900;font-style:normal;font-display:swap}
    :root{--start:${start};--end:${end};--accent:${accent};--ink:${ink};--muted:${muted};--angle:${angle}deg;--title-size:${titleSize}px;--logo-size:${logoSize}px;--space:${spacing}px;--pattern:${pattern};--button-text:${buttonText(accent)}}
    *,*::before,*::after{box-sizing:border-box}
    html{color-scheme:light;scroll-behavior:smooth}
    ::selection{background:var(--accent);color:var(--button-text)}
    *{scrollbar-width:thin;scrollbar-color:var(--accent) var(--start)}
    ::-webkit-scrollbar{width:8px;height:8px}
    ::-webkit-scrollbar-track{background:var(--start)}
    ::-webkit-scrollbar-thumb{background:var(--accent);border:2px solid var(--start);border-radius:8px}
    body{margin:0;background:${isDark ? base : "#fff"};font-family:Inter,"Segoe UI","Microsoft JhengHei",Arial,sans-serif;-webkit-font-smoothing:antialiased}
    img{display:block;max-width:100%}
    a{color:inherit}
    button{font:inherit}
    a:focus-visible,button:focus-visible{outline:3px solid #16899d;outline-offset:5px}
    .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
    .skip-link{position:absolute;top:-80px;left:16px;z-index:9;padding:12px 20px;background:#fff;color:#073763;border:2px solid #005cb9}
    .skip-link:focus{top:8px}
    .site-header{position:relative;z-index:5;background:#fff;color:#18344f;border-bottom:1px solid #e1e9ef}
    .nav-wrap{width:min(100% - 80px,1280px);min-height:84px;margin:auto;display:flex;align-items:center;gap:24px}
    .brand{display:flex;align-items:center;gap:13px;text-decoration:none;flex-shrink:0}
    .brand img{width:39px;height:39px}
    .brand-name{font-size:20px;font-weight:750;letter-spacing:-.025em;line-height:1.2}
    .brand-name small{display:block;font-size:9px;letter-spacing:.1em;font-weight:650;line-height:1.5;margin-top:3px;text-transform:uppercase}
    .nav-links{display:flex;align-items:center;gap:3px;margin-left:auto}
    .nav-links a{padding:12px 11px;text-decoration:none;font-size:13px;line-height:1.3;font-weight:650;border-radius:7px;color:#40556b;white-space:nowrap}
    .nav-links a:hover{background:#edf4fa;color:#064b88}
    .nav-links a[aria-current]{color:#123f6c;background:#eaf3fb}
    .nav-links .nav-join{margin-left:7px;padding:13px 18px;background:#005cb9;color:#fff}
    .nav-links .nav-join:hover{background:#074a8d;color:#fff}
    .menu-toggle{display:none;margin-left:auto;padding:10px 13px;border:1px solid #ccd9e4;background:white;border-radius:7px;color:#18344f;font-size:12px;cursor:pointer}
    .hero{position:relative;isolation:isolate;overflow:hidden;color:var(--ink);background:linear-gradient(var(--angle),var(--start),var(--end));border-top:4px solid var(--accent)}
    .hero::before{position:absolute;inset:0;z-index:-1;pointer-events:none;content:"";opacity:var(--pattern);background-image:radial-gradient(currentColor .8px,transparent .9px);background-size:19px 19px;mask-image:linear-gradient(90deg,transparent 35%,#000 100%)}
    .hero-inner{width:min(100% - 80px,1280px);min-height:calc(510px + var(--space) * 2);margin:auto;padding-block:var(--space);display:grid;grid-template-columns:minmax(0,1.8fr) minmax(220px,.68fr);align-items:center;gap:44px}
    .hero-copy{position:relative;z-index:2;min-width:0}
    .kicker{width:fit-content;max-width:100%;margin:0 0 23px;padding:11px 17px;border-radius:100px;background:#fff;color:#0c477d;font-size:13px;font-weight:650;line-height:1.5;letter-spacing:.035em}
    h1{margin:0;font-size:clamp(32px,var(--title-size),76px);font-weight:750;line-height:1.09;letter-spacing:-.035em;text-wrap:balance;color:var(--ink)}
    h1 .hero-em{color:var(--accent)}
    .tagline{max-width:69ch;margin:28px 0 0;color:var(--muted);font-size:clamp(17px,1.66vw,24px);font-weight:400;line-height:1.65;letter-spacing:-.012em}
    .actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:28px}
    .button{display:inline-flex;align-items:center;justify-content:center;gap:18px;min-height:50px;padding:13px 21px;border:1px solid transparent;border-radius:8px;font-size:14px;line-height:1.4;font-weight:700;text-decoration:none;transition:transform .2s,box-shadow .2s}
    .button:hover{transform:translateY(-2px);box-shadow:0 6px 20px #071b3015}
    .button-primary{background:var(--accent);color:var(--button-text)}
    .button-secondary{background:#fff;color:var(--accent);border-color:var(--accent)}
    .visual{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;justify-self:center;min-width:0;width:100%}
    .logo-stage{position:relative;display:grid;place-items:center;width:min(100%,var(--logo-size));aspect-ratio:1}
    .hero-logo{position:relative;z-index:1;display:block;width:100%;filter:drop-shadow(0 15px 24px #0b25451a)}
    .hero-logo img{width:100%;height:auto;aspect-ratio:1}
    .visual-caption{display:none}
    .partner-strip{background:#fff;border-top:1px solid #dce5eb;color:#466075}
    .partners-inner{width:min(100% - 80px,1280px);margin:auto;min-height:109px;display:flex;align-items:center;justify-content:space-between;gap:25px}
    .partner-label{font-size:10px;line-height:1.8;letter-spacing:.14em;text-transform:uppercase;font-weight:600}
    .partner-label strong{display:block;color:#153a59;letter-spacing:.02em;font-size:12px;font-weight:650;text-transform:none}
    .partner-logos{display:flex;align-items:center;gap:26px}
    .partner-logos img{height:62px;width:auto;max-width:130px;object-fit:contain}
    .partner-logos img+img{border-left:1px solid #d7e1e9;padding-left:26px;box-sizing:content-box}
    .institution-line{font-size:11px;line-height:1.7;max-width:300px;color:#496175}

    /* A more deliberate hierarchy and a quiet geometric frame for the authentic mark. */
    body.refined .hero{border-top:0}
    body.refined .hero-inner{grid-template-columns:minmax(0,1.25fr) minmax(250px,.9fr);gap:80px;min-height:calc(496px + var(--space) * 2)}
    body.refined .kicker{padding:0;border-radius:0;background:transparent;font-size:11px;letter-spacing:.11em;margin-bottom:26px;color:var(--muted);max-width:330px}
    body.refined .kicker::before{content:"";display:inline-block;width:25px;height:2px;background:var(--accent);vertical-align:middle;margin-right:11px}
    body.refined h1{font-weight:620;line-height:1.12;letter-spacing:-.035em}
    body.refined .tagline{font-size:17px;line-height:1.8;max-width:58ch;margin-top:24px}
    body.refined .actions{margin-top:30px}
    body.refined .button{border-radius:4px;font-size:13px}
    body.refined .button-secondary{background:transparent;border-color:transparent;padding-inline:10px}
    body.refined .logo-stage::before,body.refined .logo-stage::after{content:"";position:absolute;inset:-12%;border:1px solid var(--accent);border-radius:50%;opacity:.15}
    body.refined .logo-stage::after{inset:-24%;opacity:.07}
    body.refined .visual-caption{display:block;margin-top:55px;text-align:center;font-size:9px;font-weight:550;letter-spacing:.16em;text-transform:uppercase;color:var(--muted)}

    /* Editorial typesetting and a distinct colour field create a second composition. */
    body.editorial .hero{border-top:0;background:var(--start)}
    body.editorial .hero-inner{width:100%;max-width:none;grid-template-columns:minmax(0,1.15fr) minmax(300px,.85fr);padding:0;gap:0;min-height:calc(520px + var(--space) * 2);align-items:stretch}
    body.editorial .hero-copy{padding:var(--space) clamp(35px,5.5vw,100px);align-self:center}
    body.editorial .kicker{padding:0;background:transparent;border-radius:0;margin-bottom:30px;color:var(--muted);font-size:10px;line-height:1.7;letter-spacing:.15em;text-transform:uppercase}
    body.editorial h1{font-family:Georgia,"Times New Roman",serif;font-weight:400;letter-spacing:-.035em;line-height:1.06;font-size:clamp(32px,var(--title-size),76px)}
    body.editorial .hero-em{font-style:italic}
    body.editorial .tagline{max-width:53ch;font-size:16px;line-height:1.85;margin-top:27px}
    body.editorial .button{border-radius:0;font-size:12px;min-height:47px;padding:13px 17px}
    body.editorial .button-secondary{background:transparent;border-color:transparent;padding-left:0}
    body.editorial .visual{padding:var(--space) 50px;min-height:100%;background:linear-gradient(var(--angle),var(--end),var(--accent));overflow:hidden}
    body.editorial .visual::before,body.editorial .visual::after{content:"";position:absolute;left:35px;right:35px;height:1px;background:#ffffff5c;top:35px}
    body.editorial .visual::after{top:auto;bottom:35px}
    body.editorial .logo-stage{background:#ffffffed;border-radius:50%;padding:19px;box-shadow:0 10px 70px #071b300d}
    body.editorial .visual-caption{display:block;position:absolute;left:35px;bottom:49px;color:#fff;font-size:9px;line-height:1.7;font-weight:500;text-transform:uppercase;letter-spacing:.14em}

    /* Navy direction keeps official marks on a white surface and shifts the title register. */
    body.navy .hero{border-top:0}
    body.navy .hero-inner{grid-template-columns:minmax(0,1.2fr) minmax(250px,.9fr);gap:70px;min-height:calc(502px + var(--space) * 2)}
    body.navy .kicker{padding:0;border-radius:0;background:transparent;color:var(--muted);font-size:10px;letter-spacing:.14em;text-transform:uppercase;max-width:340px}
    body.navy .kicker::before{content:"";display:inline-block;width:6px;height:6px;margin-right:11px;background:var(--accent);border-radius:50%;vertical-align:middle}
    body.navy h1{font-weight:600;line-height:1.12}
    body.navy .tagline{font-size:17px;line-height:1.85;max-width:57ch}
    body.navy .button{border-radius:3px;font-size:13px}
    body.navy .button-secondary{background:transparent;color:var(--ink);border-color:#ffffff45}
    body.navy .logo-stage{padding:20px;border-radius:50%;background:#f7fbff;box-shadow:0 0 0 22px #ffffff03,0 0 0 23px #ffffff0d,0 0 0 56px #ffffff02,0 0 0 57px #ffffff08}
    body.navy .hero-logo{filter:none}
    body.navy .visual-caption{display:block;margin-top:78px;font-size:9px;letter-spacing:.17em;text-transform:uppercase;color:var(--muted)}

    @media(min-width:1500px){.hero-inner{min-height:calc(550px + var(--space) * 2)}}
    @media(max-width:1100px){
      .nav-wrap{width:calc(100% - 48px);gap:16px}.nav-links a{font-size:11px;padding:11px 8px}.brand-name{font-size:17px}.brand-name small{font-size:8px}.brand img{width:33px;height:33px}
      .hero-inner{width:calc(100% - 64px);gap:30px;grid-template-columns:minmax(0,1.65fr) minmax(190px,.7fr);min-height:calc(450px + var(--space) * 2)}
      h1,body.editorial h1{font-size:clamp(32px,calc(var(--title-size) * .84),64px)}.tagline{font-size:18px}.kicker{font-size:11px}
      body.refined .hero-inner,body.navy .hero-inner{gap:48px;grid-template-columns:minmax(0,1.25fr) minmax(200px,.8fr);min-height:calc(470px + var(--space) * 2)}
      body.editorial .hero-copy{padding-inline:38px}body.editorial .visual{padding-inline:36px}
      .partners-inner{width:calc(100% - 64px)}.institution-line{max-width:240px;font-size:10px}
    }
    @media(max-width:860px){
      .nav-wrap{min-height:72px;flex-wrap:wrap;gap:0;padding-block:13px}.menu-toggle{display:block}.nav-links{display:none;flex:1 0 100%;margin:13px 0 0;padding-top:12px;border-top:1px solid #e2eaf1;flex-wrap:wrap;gap:4px}.nav-links.is-open{display:flex}.nav-links a{font-size:12px;padding:11px 13px}.nav-links .nav-join{margin-left:0}
      .hero-inner{grid-template-columns:minmax(0,1.7fr) minmax(150px,.65fr);width:calc(100% - 56px);gap:25px;min-height:calc(420px + var(--space) * 2)}
      h1{font-size:clamp(30px,calc(var(--title-size) * .74),56px)}.tagline{font-size:16px}.button{font-size:12px;padding:12px 15px;min-height:46px}.kicker{font-size:10px;letter-spacing:.02em}
      body.refined .hero-inner,body.navy .hero-inner{gap:35px;grid-template-columns:minmax(0,1.4fr) minmax(160px,.7fr);min-height:calc(460px + var(--space) * 2)}body.refined .tagline,body.navy .tagline{font-size:15px}
      body.editorial .hero-inner{grid-template-columns:minmax(0,1.25fr) minmax(230px,.75fr);min-height:calc(470px + var(--space) * 2)}body.editorial .hero-copy{padding-inline:28px}body.editorial h1{font-size:clamp(30px,calc(var(--title-size) * .74),56px)}body.editorial .tagline{font-size:15px}.institution-line{display:none}
    }
    @media(max-width:620px){
      .nav-wrap{width:calc(100% - 40px);min-height:69px}.brand img{width:30px;height:30px}.brand{gap:10px}.brand-name{font-size:16px}.brand-name small{font-size:7.5px}.menu-toggle{padding:8px 10px;font-size:11px}
      .hero-inner,body.refined .hero-inner,body.navy .hero-inner{width:calc(100% - 44px);grid-template-columns:minmax(0,1fr);min-height:0;padding-block:calc(var(--space) * .65) 35px;gap:32px}
      .kicker{padding:8px 12px;font-size:9px;margin-bottom:21px;line-height:1.6}h1{font-size:clamp(28px,calc(var(--title-size) * .64),49px);line-height:1.1;letter-spacing:-.035em;text-wrap:balance}.tagline{font-size:14px;line-height:1.8;margin-top:21px}
      .actions{gap:8px;margin-top:22px}.button{font-size:11px;min-height:44px;padding:12px 13px;gap:8px}
      .visual{min-height:170px}.logo-stage{width:min(100%,calc(var(--logo-size) * .62));max-width:260px}.visual-caption{font-size:8px}
      .partners-inner{width:calc(100% - 44px);min-height:110px;gap:12px}.partner-label{font-size:8px;letter-spacing:.08em;max-width:155px;line-height:1.8}.partner-label strong{font-size:10px;line-height:1.6;max-width:145px}.partner-logos{gap:12px}.partner-logos img{height:48px;max-width:80px}.partner-logos img+img{padding-left:12px}
      body.refined .hero-inner{gap:49px;padding-bottom:37px}body.refined .kicker{font-size:9px;margin-bottom:22px;max-width:300px;letter-spacing:.09em}body.refined h1,body.navy h1{font-size:clamp(28px,calc(var(--title-size) * .64),49px)}body.refined .tagline,body.navy .tagline{font-size:14px}body.refined .logo-stage{width:min(100%,calc(var(--logo-size) * .58));max-width:244px}body.refined .visual-caption{margin-top:39px;font-size:8px}body.refined .button,body.navy .button{font-size:11px}
      body.editorial .hero-inner{display:flex;flex-direction:column;min-height:0}body.editorial .hero-copy{padding:calc(var(--space) * .65) 24px 33px}body.editorial .kicker{font-size:9px;margin-bottom:24px}body.editorial h1{font-size:clamp(30px,calc(var(--title-size) * .7),54px)}body.editorial .tagline{font-size:14px;line-height:1.8}body.editorial .visual{width:100%;min-height:300px;padding:36px 40px 64px}body.editorial .logo-stage{width:min(100%,calc(var(--logo-size) * .58));max-width:244px;padding:10px}body.editorial .visual::before{top:20px;left:24px;right:24px}body.editorial .visual::after{bottom:22px;left:24px;right:24px}body.editorial .visual-caption{left:24px;bottom:33px;font-size:7px}body.editorial .button{font-size:11px;padding:12px 13px}
      body.navy .hero-inner{gap:57px;padding-bottom:38px}body.navy .kicker{font-size:9px;letter-spacing:.08em;margin-bottom:24px}body.navy .logo-stage{width:min(100%,calc(var(--logo-size) * .58));max-width:244px;padding:14px}body.navy .visual-caption{font-size:8px;margin-top:48px}
    }
    @media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}*,*::before,*::after{animation:none!important;transition:none!important}.button:hover{transform:none}}
  </style>
</head>
<body class="${layout}">
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header">
    <div class="nav-wrap">
      <a class="brand" href="../Website_261107-1/index.html" target="_blank" rel="noopener noreferrer" aria-label="IMPRESIVE home — opens original website in a new tab">
        <img src="${staticLogo}" width="39" height="39" alt="">
        <span class="brand-name">IMPRESIVE<small>Study preparedness platform</small></span>
      </a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-nav">Menu</button>
      <nav class="nav-links" id="primary-nav" aria-label="Primary navigation">${nav}</nav>
    </div>
  </header>
  <main id="main">
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-inner">
        <div class="hero-copy">
          <p class="kicker">International Multi-database study PREparedness</p>
          <h1 id="hero-title">Leveraging Local Healthcare Data for <span class="hero-em">Global Real-World Evidence</span></h1>
          <p class="tagline">Developed by the Population Health Data Center (PHDc) at National Cheng Kung University, the IMPRESIVE framework harmonizes local health data into timely, multi-country evidence for faster healthcare decision-making.</p>
          <div class="actions">
            <a class="button button-primary" href="../Website_261107-1/how.html" target="_blank" rel="noopener noreferrer">See how IMPRESIVE works→<span class="sr-only"> (opens original website in a new tab)</span></a>
            <a class="button button-secondary" href="../Website_261107-1/cases.html" target="_blank" rel="noopener noreferrer">View case studies<span class="sr-only"> (opens original website in a new tab)</span></a>
          </div>
        </div>
        <div class="visual">
          <div class="logo-stage">
            <picture class="hero-logo">
              <source srcset="${staticLogo}" media="(prefers-reduced-motion: reduce)">
              <img src="${logo}" width="300" height="300" alt="IMPRESIVE network logo" decoding="async">
            </picture>
          </div>
          <div class="visual-caption" aria-hidden="true">International Multi-database<br>study PREparedness</div>
        </div>
      </div>
    </section>
    <div class="partner-strip" aria-label="Developed by the Population Health Data Center at National Cheng Kung University">
      <div class="partners-inner">
        <div class="partner-label">Developed at<strong>Population Health Data Center</strong></div>
        <div class="institution-line">Population Health Data Center (PHDc)<br>National Cheng Kung University</div>
        <div class="partner-logos">
          <img src="${phdc}" width="166" height="240" alt="Population Health Data Center (PHDc)">
          <img src="${ncku}" width="179" height="240" alt="National Cheng Kung University">
        </div>
      </div>
    </div>
  </main>
  <script>
    (function(){
      var toggle=document.querySelector('.menu-toggle');
      var nav=document.getElementById('primary-nav');
      document.querySelector('.skip-link').addEventListener('click',function(event){
        event.preventDefault();
        var main=document.getElementById('main');
        main.tabIndex=-1;main.focus();
      });
      toggle.addEventListener('click',function(){
        var open=toggle.getAttribute('aria-expanded')!=='true';
        toggle.setAttribute('aria-expanded',String(open));
        nav.classList.toggle('is-open',open);
      });
      document.addEventListener('keydown',function(event){
        if(event.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true'){
          toggle.setAttribute('aria-expanded','false');nav.classList.remove('is-open');toggle.focus();
        }
      });
      window.addEventListener('message',function(event){
        var message=event.data;
        if(event.source!==parent||!message||message.type!=='impresive:settings'||
          !message.styles||typeof message.styles!=='object'||Array.isArray(message.styles))return;
        var colors=['--start','--end','--accent','--ink','--muted','--button-text'];
        var units={
          '--angle':['deg',0,360],
          '--title-size':['px',42,76],
          '--logo-size':['px',200,420],
          '--space':['px',48,110]
        };
        Object.keys(message.styles).forEach(function(property){
          var value=String(message.styles[property]);
          var valid=false;
          if(colors.indexOf(property)!==-1)valid=/^#[0-9a-f]{6}$/i.test(value);
          else if(property==='--pattern'){
            valid=/^(?:0(?:\\.\\d+)?|\\.\\d+)$/.test(value)&&Number(value)>=0&&Number(value)<=.4;
          }else if(Object.prototype.hasOwnProperty.call(units,property)){
            var rule=units[property];
            var number=Number(value.slice(0,-rule[0].length));
            valid=value.endsWith(rule[0])&&/^[0-9]+(?:\\.[0-9]+)?$/.test(value.slice(0,-rule[0].length))&&
              Number.isFinite(number)&&number>=rule[1]&&number<=rule[2];
          }
          if(valid)document.documentElement.style.setProperty(property,value);
        });
      });
    })();
  <\/script>
</body>
</html>`;
  }

  window.HeroPreview = Object.freeze({ render });
})();


(() => {
  'use strict';
  /**
   * CLYRA RESPONSE / AGENT-ACTIVITY DESIGN REFERENCE — INTEGRATOR CONTRACT
   * --------------------------------------------------------------------
   * This module runs a DEMO timeline. Its timeline, sample words, mocked tools,
   * scroll container and user-message placement are NOT intended for transfer.
   *
   * REUSE the presentation of response content and activity states ONLY:
   *   - addThinking / finishThinking: thought icon, animated thinking, elapsed-time label
   *   - addActivity / completed: tool/status rows, icons, shimmer and transition
   *   - createEditReview: inline diff disclosures and review motion
   *   - createBrowserPreview: short, neutral viewport shimmer and action list
   *   - addWritingCard: rounded document artifact and editor toolbar
   *   - createPresentationCard / createMusicCard: artifact preview UI
   *   - createCommandView / createUniversalToolCard: execution statuses
   *   - addSourcesFooter / addFooter: citation strip and response actions
   *
   * Standalone fixture shows a TEMPORARY composer to exercise the visual sequence.
   * The production host MUST NOT copy that composer or user message styling.
   * Your application REMAINS OWNER of its own composer, user bubbles, assistant
   * message container, chat width/placement, auto-scroll rules, message entrance
   * animations, routing, stores, tool runtime, stream timing, and agent loop.
   * Mount these status/artifact elements INTO your existing assistant messages;
   * DO NOT copy index.html's demo shell or runDemo() as app architecture.
   * Use your real tool events and outputs, not the sample events below.
   * See INTEGRATION_GUIDE.md for exact one-to-one event mappings.
   * INTEGRATION RULE: replace only existing component interiors for thinking,
   * search, edit diffs, command execution, artifacts and tool statuses.
   * Render them inside your OWN existing assistant-message wrapper. DO NOT
   * introduce the demo's lane, response offset, typing loop, auto-scroll,
   * sample phase sequencing, synthetic timers, sidebar or document mock data.
   * Maintain existing user bubbles AND assistant bubbles (shape, position,
   * motion), all composer/input behavior, and agent-event routing unchanged.
   * The mocked sequence is a visual TEST FIXTURE, not the actual AI workflow.
   */
  // Self-contained visual fixture: no API calls, browser automation or real file changes.
  const viewport = document.getElementById('conversationViewport');
  const assistant = document.getElementById('assistantTurn');
  const planMount = document.getElementById('planMount');
  const planRail = document.getElementById('planRail');
  const composerForm = document.getElementById('demoComposer');
  const composerInput = document.getElementById('demoInput');
  const composerSend = document.getElementById('demoSend');
  const planToggle = document.getElementById('planToggle');
  const planClose = document.getElementById('planClose');
  const planScrim = document.getElementById('planScrim');
  const setPlanOpen = open => {
    document.body.classList.toggle('c-plan-open',open);
    planToggle.setAttribute('aria-expanded',String(open));
    if(open)planClose.focus({preventScroll:true});
    else planToggle.focus({preventScroll:true});
  };
  planToggle.addEventListener('click',()=>setPlanOpen(!document.body.classList.contains('c-plan-open')));
  planClose.addEventListener('click',()=>setPlanOpen(false));
  planScrim.addEventListener('click',()=>setPlanOpen(false));
  window.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('c-plan-open'))setPlanOpen(false);});
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ICONS = {

    type:'<path d="M4 6V4h16v2M12 4v16M8 20h8"/>',
    box:'<rect x="3.5" y="4" width="17" height="16" rx="2"/>',
    circle:'<circle cx="12" cy="12" r="8.5"/>',
    x:'<path d="M5 5l14 14M19 5 5 19"/>',
    download:'<path d="M12 3v12m-4-4 4 4 4-4M5 17v4h14v-4"/>',
    image:'<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.2" cy="8.2" r="1.7"/><path d="m4 17 5-5 4 4 3-3 4 5"/>',
    line:'<path d="M4 19 20 5"/><circle cx="4" cy="19" r="1" fill="currentColor"/><circle cx="20" cy="5" r="1" fill="currentColor"/>',
    table:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M10 4v16M16 4v16M3 15h18"/>',
    brain:'<path d="M12 5.5A3.7 3.7 0 0 0 5.1 7 3.5 3.5 0 0 0 4 13a3.8 3.8 0 0 0 4 6 3.2 3.2 0 0 0 4-2.7V5.5Z"/><path d="M12 5.5A3.7 3.7 0 0 1 18.9 7 3.5 3.5 0 0 1 20 13a3.8 3.8 0 0 1-4 6 3.2 3.2 0 0 1-4-2.7"/><path d="M8.4 9a2.4 2.4 0 0 0-2 2.2M8 15.3a2 2 0 0 1 2.3 1M15.6 9a2.4 2.4 0 0 1 2 2.2M16 15.3a2 2 0 0 0-2.3 1"/>',
    terminal:'<rect x="2.5" y="4" width="19" height="16" rx="2.5"/><path d="m7 9 3 3-3 3M13 16h5"/>',
    book:'<path d="M12 6c-2.9-1.7-5.8-2-9-1v14c3.2-1 6.1-.7 9 1 2.9-1.7 5.8-2 9-1V5c-3.2-1-6.1-.7-9 1Zm0 0v14"/>',
    clipboard:'<rect x="5" y="5" width="14" height="16" rx="2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h6"/>',
    shield:'<path d="m12 2 8 4v6c0 5-3.5 8.3-8 10-4.5-1.7-8-5-8-10V6l8-4Z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
    filePen:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10M14 2v6h6M14 2l6 6"/><path d="m12 18 6.8-6.8a1.5 1.5 0 0 1 2.1 2.1L14.1 20H12v-2Z"/>',
    folder:'<path d="M3 6a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6Z"/>',
    route:'<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h7a4 4 0 0 0 0-8h-6a4 4 0 0 1 0-8"/>',
    listTodo:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m7 10 1.5 1.5L11 9M13 10h4M7 16h10"/>',
    verify:'<path d="m4 12 5 5L20 6"/><path d="M5 5a9 9 0 1 1-1 13"/>',
    search:'<circle cx="10.7" cy="10.7" r="6.7"/><path d="m16 16 5 5"/>',
    settings:'<path d="M12 2v3M12 19v3M4.9 4.9 7 7M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1"/><circle cx="12" cy="12" r="4"/>',
    sparkles:'<path d="m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2ZM19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8L19 17Z"/>',
    layers:'<path d="m12 2 9 5-9 5-9-5 9-5Zm-9 10 9 5 9-5M3 17l9 5 9-5"/>',
    document:'<path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"/><path d="M15 2v5h5M8 12h8M8 16h8"/>',
    thought:'<path d="M6.3 8.8a6 6 0 0 1 11.4 0"/><path d="M5.6 11.5c-1.1 2.7.3 5.2 2.8 5.8 1.9.5 3.9-.4 4.7-2.1.8-1.8 2.8-2.4 4.3-1.1"/><path d="M10.1 20.5h3.8"/><path d="M12 17.1v3.4"/>',
    external:'<path d="M8 16 16 8M9 8h7v7"/>',
    globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/>',
    file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>',
    edit:'<path d="M12 20h9"/><path d="m16.7 3.5 3.8 3.8M4 20l4.5-1 11-11a2.7 2.7 0 0 0-3.8-3.8l-11 11L4 20z"/>',
    check:'<path d="m5 12 4 4L19 6"/>',
    code:'<rect x="2.5" y="4" width="19" height="16" rx="2"/><path d="m7 9 3 3-3 3M12.5 16h4"/>',
    chevron:'<path d="m9 18 6-6-6-6"/>',
    copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
    replay:'<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 3v6h6"/>',
    thumbUp:'<path d="M7 10v11H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3Zm0 0 5-8a2 2 0 0 1 2.7-.6c.7.5 1 1.4.8 2.2L14 9h5a3 3 0 0 1 2.9 3.9L20 20a2 2 0 0 1-2 1H7"/>',
    thumbDown:'<path d="M7 14V3H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h3Zm0 0 5 8a2 2 0 0 0 2.7.6c.7-.5 1-1.4.8-2.2L14 15h5a3 3 0 0 0 2.9-3.9L20 4a2 2 0 0 0-2-1H7"/>',
    bold:'<path d="M7 4h6a4 4 0 0 1 0 8H7zM7 12h7a4 4 0 0 1 0 8H7z"/>',
    italic:'<path d="M14 4h6M4 20h6M15 4 9 20"/>',
    alignLeft:'<path d="M4 6h16M4 10h10M4 14h16M4 18h10"/>',
    alignCenter:'<path d="M4 6h16M7 10h10M4 14h16M7 18h10"/>',
    list:'<path d="M8 6h12M8 12h12M8 18h12"/><path d="M4 6h.1M4 12h.1M4 18h.1"/>',
    text:'<path d="M3 6V4h18v2M12 4v16M8 20h8"/>',
    browser:'<rect x="2.5" y="4" width="19" height="16" rx="2.5"/><path d="M2.5 9h19M7 6.7h.1M10 6.7h.1"/>',
    pointer:'<path d="M5 3v17l4.7-4.7 3 6.4 3-1.5-3.1-6.2 6.8-.7L5 3z"/>',
    music:'<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
    skipBack:'<path d="M5 5v14M19 5 8 12l11 7V5z"/>',
    skipNext:'<path d="M19 5v14M5 5l11 7-11 7V5z"/>',
    play:'<path d="m8 5 12 7-12 7z"/>',
    pause:'<path d="M8 5v14M16 5v14"/>',
    slides:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 9h8M8 13h5"/>',
    wand:'<path d="m5 19 14-14M15 5l4 4M4 4v3M2.5 5.5h3M19 16v5M16.5 18.5h5"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/>',
    map:'<path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2zM9 3v16M15 5v16"/>',
    video:'<rect x="3" y="5" width="14" height="14" rx="2"/><path d="m17 10 4-3v10l-4-3"/>',
    mic:'<rect x="9" y="3" width="6" height="12" rx="3"/><path d="M6 11a6 6 0 0 0 12 0M12 17v4m-4 0h8"/>',
    memory:'<path d="M8 3a4 4 0 0 0-4 4v10a4 4 0 0 0 4 4M16 3a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4M8 3v18M16 3v18M8 9h8M8 15h8"/>',
    underline:'<path d="M6 3v8a6 6 0 0 0 12 0V3M4 21h16"/>',
    strike:'<path d="M4 12h16M17 6c-1.4-1.4-3.2-2-5.5-2C8.2 4 6 5.7 6 8c0 1.7 1 2.5 3 3.2M8 17c1.2 1.3 3 2 5.2 2 3.2 0 5.3-1.4 5.3-3.6 0-1.4-.8-2.3-2.3-3"/>',
    heading:'<path d="M4 5v14M15 5v14M4 12h11M19 7v12m-3 0h6"/>',
    quote:'<path d="M9.5 9a4 4 0 0 0-4 4v2h5v-4h-3M20 9a4 4 0 0 0-4 4v2h5v-4h-3"/>',
    highlighter:'<path d="m8 15 7-7 4 4-7 7-4-4ZM16 7l2-2 4 4-2 2M3 21h18"/>',
    palette:'<circle cx="12" cy="12" r="9"/><circle cx="7.5" cy="10" r="1"/><circle cx="11" cy="6.5" r="1"/><circle cx="16" cy="8" r="1"/><path d="M17 15c-3.5-1-5.5 2-3 5"/>',
    alignRight:'<path d="M4 6h16M10 10h10M4 14h16M10 18h10"/>',
    expand:'<path d="M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5"/><path d="m3 3 6 6M21 3l-6 6M3 21l6-6M21 21l-6-6"/>',
    link:'<path d="M10 13a5 5 0 0 0 7 .5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
    textColor:'<path d="M4 20h16M6 16l6-12 6 12M8 12h8"/>',
    highlightColor:'<path d="m8 15 7-7 4 4-7 7-4-4Zm8-8 2-2 4 4-2 2M4 21h16"/>',
    bullets:'<circle cx="4.5" cy="6" r=".8" fill="currentColor" stroke="none"/><circle cx="4.5" cy="12" r=".8" fill="currentColor" stroke="none"/><circle cx="4.5" cy="18" r=".8" fill="currentColor" stroke="none"/><path d="M9 6h11M9 12h11M9 18h11"/>',
    numbered:'<path d="M3 6h2V3.5M3.5 12h2l-2 2.8h2.3M3.5 18h2.5l-1.4 2H6M9 6h11M9 12h11M9 18h11"/>',
    table:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M10 4v16M16 4v16M3 15h18"/>',
    caret:'<path d="m7 10 5 5 5-5"/>',
    run:'<path d="m8 5 11 7-11 7V5Z"/>',
    font:'<path d="M4 19 10 5h4l6 14M6 14h12"/>',
    codeBrackets:'<path d="m9 6-6 6 6 6m6-12 6 6-6 6M14 4l-4 16"/>'

  };
  const svg = (name, cls='c-icon') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;
  const SOURCES = [
    {name:'developer.mozilla.org', title:'prefers-reduced-motion — CSS | MDN', href:'https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion',mark:'MDN'},
    {name:'web.dev', title:'Learn CSS animations — web.dev', href:'https://web.dev/learn/css/animations/',mark:'web'},
    {name:'w3.org', title:'Understanding animation from interactions — W3C', href:'https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html',mark:'W3C'}
  ];
  function websiteLogo(source){
    // Small inline vector publisher marks: no remote assets or runtime network dependencies.
    const mark=source.mark;
    if(mark==='MDN')return '<svg viewBox="0 0 28 28" aria-hidden="true"><circle cx="14" cy="14" r="14" fill="#111"/><path d="M5 18V9l4 5 4-5v9m2 0V9l4 5 4-5v9" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    if(mark==='web')return '<svg viewBox="0 0 28 28" aria-hidden="true"><circle cx="14" cy="14" r="14" fill="#e7f0ff"/><path d="m4 17 6-9h5l-6 9H4Z" fill="#4285f4"/><path d="m12 20 7-12h5l-7 12h-5Z" fill="#34a853"/><path d="m8 20 7-12h5l-7 12H8Z" fill="#fbbc05"/></svg>';
    return '<svg viewBox="0 0 28 28" aria-hidden="true"><circle cx="14" cy="14" r="14" fill="#125f9c"/><path d="M4.7 9.5 8 18l3.5-7 3.4 7 3.5-8.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
  function sourceLogo(source, className){const n=element('span',className);n.innerHTML=websiteLogo(source);n.setAttribute('aria-hidden','true');return n;}
  function websiteStack(sources, animated=true){
    const stack=element('span','c-web-favicons');stack.setAttribute('aria-hidden','true');
    sources.forEach((source,index)=>{const logo=sourceLogo(source,'c-web-favicon');logo.title=source.name;if(!animated)logo.style.animation='none';else logo.style.animationDelay=(index*125)+'ms';stack.appendChild(logo);});
    return stack;
  }
  function sourceLink(src){
    const a=element('a','c-source-link');a.href=src.href;a.target='_blank';a.rel='noopener noreferrer';
    const txt=element('span','c-source-link-body');txt.append(element('span','c-source-link-title',src.title),element('span','c-source-link-domain',src.name));
    const ext=element('span','c-source-link-arrow');ext.innerHTML=svg('external','c-source-link-arrow');
    a.append(sourceLogo(src,'c-source-logo'),txt,ext);
    return a;
  }
  const speedFactor = Math.min(2,Math.max(.025,Number(new URLSearchParams(location.search).get('speed'))||1));
  let session = 0;
  let userScrollTakeover = false;
  let copyResetTimer;
  let followFrame=0;
  function isNearBottom(){return viewport.scrollHeight-viewport.clientHeight-viewport.scrollTop <= 110;}
  viewport.addEventListener('wheel', e => {if(e.deltaY < -1 || !isNearBottom())userScrollTakeover=true;},{passive:true});
  viewport.addEventListener('touchstart', () => {userScrollTakeover=true;},{passive:true});
  viewport.addEventListener('scroll', () => {if(isNearBottom() && !followFrame)userScrollTakeover=false;},{passive:true});
  function glideToLatest(){
    if(followFrame || reducedMotion)return;
    const tick=()=>{
      if(userScrollTakeover){followFrame=0;return;}
      const target=Math.max(0,viewport.scrollHeight-viewport.clientHeight);
      const delta=target-viewport.scrollTop;
      if(Math.abs(delta)<0.9){viewport.scrollTop=target;followFrame=0;return;}
      // Critically damped, capped follow motion: large artifact expansions never jerk the viewport.
      viewport.scrollTop+=Math.sign(delta)*Math.min(Math.abs(delta)*.135,28);
      followFrame=requestAnimationFrame(tick);
    };
    followFrame=requestAnimationFrame(tick);
  }
  function paint(change){
    const follow=!userScrollTakeover && (isNearBottom() || !!followFrame);
    change();
    if(follow){
      if(reducedMotion)requestAnimationFrame(()=>{if(!userScrollTakeover)viewport.scrollTop=viewport.scrollHeight;});
      else glideToLatest();
    }
  }
  function sleep(ms, token){return new Promise((resolve,reject)=>setTimeout(()=>token===session?resolve():reject(new Error('restarted')),ms*speedFactor));}
  function element(tag, className, text){const el=document.createElement(tag);if(className)el.className=className;if(text!==undefined)el.textContent=text;return el;}
  function addThinking(){
    const el=element('div','c-think');
    el.setAttribute('role','status');
    el.innerHTML=svg('brain','c-think-icon')+'<span class="c-think-label">Thinking</span><span class="c-dots" aria-hidden="true"><i></i><i></i><i></i></span>';
    const start=performance.now();
    paint(()=>assistant.append(el));
    return {el,start};
  }
  function updateLabel(node,text){
    if(!node || node.textContent===text)return;
    if(node._settleAnimation)node._settleAnimation.cancel();
    node.textContent=text;
    node.classList.remove('is-updating');
    if(reducedMotion)return;
    node._settleAnimation=node.animate([
      {opacity:.24,transform:'translate3d(0,4px,0)',filter:'blur(1.5px)'},
      {opacity:1,transform:'translate3d(0,0,0)',filter:'blur(0)'}
    ],{duration:380,easing:'cubic-bezier(.22,1,.36,1)'});
  }
  function finishThinking(ref){
    if(!ref?.el?.isConnected)return;
    const seconds=Math.max(1,Math.round((performance.now()-ref.start)/1000));
    paint(()=>{
      ref.el.classList.add('is-finished');
      updateLabel(ref.el.querySelector('.c-think-label'),`Thought ${seconds}s`);
    });
  }

  function createBrowserPreview(){
    const outer=element('section','c-browser-unit');outer.setAttribute('aria-label','Browser agent activity');
    const header=element('button','c-browser-toggle');header.type='button';header.setAttribute('aria-expanded','true');
    header.innerHTML='<span class="c-action-icon">'+svg('browser')+'</span><span class="c-browser-label c-active-shimmer">Working in browser</span>'+svg('chevron','c-chevron');
    const shell=element('div','c-browser-detail-shell is-open');
    const clip=element('div','c-browser-detail-clip');const inside=element('div','c-browser-detail-inner');
    // Fixture-only visualisation: grey shimmer for 3s, animated blue browser
    // work glow and a moving pointer, fade/collapse at ~10s. No real browsing.
    const placeholder=element('div','c-browser-placeholder c-browser-v18');
    placeholder.setAttribute('role','img');placeholder.setAttribute('aria-label','Simulated browser: loading, then glowing blue while an agent cursor moves');
    placeholder.appendChild(element('div','c-browser-placeholder-shimmer'));
    placeholder.appendChild(element('div','c-browser-blue-field'));
    const cursor=element('div','c-browser-agent-cursor');cursor.setAttribute('aria-hidden','true');
    cursor.innerHTML=svg('pointer')+'<span class="c-browser-agent-halo"></span>';
    placeholder.appendChild(cursor);
    const actions=element('div','c-browser-action-list');actions.setAttribute('aria-label','Browser actions');
    inside.append(placeholder,actions);clip.appendChild(inside);shell.appendChild(clip);
    const id='browser-demo-detail';shell.id=id;header.setAttribute('aria-controls',id);
    outer.append(header,shell);paint(()=>assistant.appendChild(outer));
    let open=true;
    function expand(next){open=next;header.setAttribute('aria-expanded',String(next));paint(()=>shell.classList.toggle('is-open',next));}
    header.addEventListener('click',()=>expand(!open));
    function setLabel(txt,active){const label=header.querySelector('.c-browser-label');label.classList.toggle('c-active-shimmer',active);updateLabel(label,txt);}
    function addAction(icon,description){
      const row=element('div','c-browser-action');row.dataset.actionIcon=icon;
      row.innerHTML='<span class="c-action-icon">'+svg(icon)+'</span>';
      const name=element('span','c-active-shimmer',description);row.appendChild(name);
      paint(()=>{actions.appendChild(row);if(actions.children.length>3){actions.classList.add('is-scrollable');actions.scrollTo({top:actions.scrollHeight,behavior:reducedMotion?'instant':'smooth'});}});return {row,name};
    }
    function finishAction(item,description){item.name.classList.remove('c-active-shimmer');item.row.classList.add('is-finished');updateLabel(item.name,description);}
    function activate(){placeholder.classList.add('is-agent-working');placeholder.setAttribute('aria-label','Simulated agent cursor working in browser');}
    function finish(){
      placeholder.classList.remove('is-agent-working');placeholder.classList.add('is-agent-closing');
      setLabel('Used browser · 5 actions',false);
      setTimeout(()=>{if(outer.isConnected)expand(false);},760);
    }
    return {outer,header,shell,addAction,finishAction,activate,finish};
  }
  async function playBrowserAgent(token,delay){
    const browser=createBrowserPreview();
    // 0–3s: grey shimmer; 3–10s: blue agent highlight + Codex-like pointer.
    await delay(3000);browser.activate();
    const steps=[
      ['browser','Opening browser session','Opened browser session',860],
      ['globe','Loading page','Loaded page',840],
      ['search','Finding relevant controls','Found relevant controls',1100],
      ['edit','Submitting changes','Submitted changes',920],
      ['shield','Checking browser result','Checked browser result',900]
    ];
    for(const [icon,active,done,ms] of steps){
      const action=browser.addAction(icon,active);
      await delay(ms);browser.finishAction(action,done);await delay(230);
    }
    // 3000ms + 4620ms of actions + 1150ms between actions + 1230ms = 10s.
    await delay(1230);browser.finish();await delay(840);return browser;
  }

  async function streamParagraph(chunks, token){
    const block=element('div','c-stream-block');
    const p=element('p');block.appendChild(p);
    paint(()=>assistant.appendChild(block));
    // Smooth word-level text diffusion: no large phrase jumps or typewriter cursor.
    const words=chunks.join('').match(/\s+|\S+/g)||[];
    for(let i=0;i<words.length;i++){
      if(token!==session)throw new Error('restarted');
      const part=words[i];
      paint(()=>{
        if(/^\s+$/.test(part)){p.appendChild(document.createTextNode(part));}
        else {const word=element('span','c-stream-word',part);if(reducedMotion)word.style.animation='none';p.appendChild(word);}
      });
      if(!/^\s+$/.test(part) && i<words.length-1){
        const punctuation=/[.!?]$/.test(part)?150:/[,;:]$/.test(part)?75:0;
        await sleep((reducedMotion?3:32)+Math.round(punctuation*.65),token);
      }
    }
    return block;
  }
  function addActivityGroup(){const group=element('section','c-activity-group');group.setAttribute('aria-label','Agent activity');paint(()=>assistant.appendChild(group));return group;}
  function addActivity(group,{label,icon='file',details=[],disclose=false,edit=false}){
    const wrapper=element('div','c-activity-unit');
    const row=element('div','c-activity-row'+(edit?' is-edit':''));
    row.dataset.actionIcon=icon;
    const button = disclose ? element('button','c-activity-toggle') : null;
    const title=element('span','c-activity-label c-active-shimmer',label);
    let target = button || row;
    if(button){button.type='button';button.setAttribute('aria-expanded','false');button.setAttribute('aria-label',label+' details');}
    target.insertAdjacentHTML('beforeend',`<span class="c-action-icon">${svg(icon)}</span>`);
    target.appendChild(title);
    if(button){button.insertAdjacentHTML('beforeend',svg('chevron','c-chevron'));row.appendChild(button);}
    let diff = null;
    if(edit){diff=element('div','c-diff');diff.hidden=true;row.appendChild(diff);}
    wrapper.appendChild(row);
    let extra=null;
    let userChoseExpansion=false;
    if(disclose){
      extra=element('div','c-activity-extra');extra.hidden=true;
      const id='activity-'+Math.random().toString(36).slice(2);
      extra.id=id;button.setAttribute('aria-controls',id);
      details.forEach(x=>{const detail=element('div','c-extra-line');detail.innerHTML=svg('chevron','c-extra-icon');detail.appendChild(element('span','',x));extra.appendChild(detail);});
      wrapper.appendChild(extra);
      button.addEventListener('click',()=>{userChoseExpansion=true;setExpanded(!extra.hidden);});
    }
    let accordionMotion;
    function setExpanded(expanded){
      if(!extra)return;
      if(accordionMotion){accordionMotion.cancel();accordionMotion=null;}
      const wasOpen=!extra.hidden;
      if(expanded===wasOpen){button.setAttribute('aria-expanded',String(expanded));return;}
      if(expanded){
        paint(()=>{extra.hidden=false;button.setAttribute('aria-expanded','true');});
        if(!reducedMotion){
          const h=extra.scrollHeight;
          accordionMotion=extra.animate([
            {height:'0px',opacity:0,transform:'translate3d(0,-4px,0)'},
            {height:h+'px',opacity:1,transform:'translate3d(0,0,0)'}
          ],{duration:290,easing:'cubic-bezier(.22,1,.36,1)'});
          accordionMotion.onfinish=()=>{accordionMotion=null;};
        }
      }else{
        button.setAttribute('aria-expanded','false');
        if(reducedMotion){paint(()=>{extra.hidden=true;});return;}
        const h=extra.getBoundingClientRect().height;
        accordionMotion=extra.animate([
          {height:h+'px',opacity:1,transform:'translate3d(0,0,0)'},
          {height:'0px',opacity:0,transform:'translate3d(0,-4px,0)'}
        ],{duration:260,easing:'cubic-bezier(.22,1,.36,1)'});
        accordionMotion.onfinish=()=>{accordionMotion=null;paint(()=>{extra.hidden=true;});};
      }
    }
    paint(()=>group.appendChild(wrapper));
    return {row,title,button,extra,diff,icon,insertIcons:(icons)=>{const parent=button||row;parent.insertBefore(icons,button?button.querySelector('.c-chevron'):diff);},setExpanded,autoSetExpanded:(open)=>{if(!userChoseExpansion)setExpanded(open);}};
  }
  function completed(activity,label){
    paint(()=>{
      activity.title.classList.remove('c-active-shimmer');
      updateLabel(activity.title,label);
      if(activity.button)activity.button.setAttribute('aria-label',label+' details');
      // Preserve the action's own icon. Completion is expressed in past tense, not a tick.
    });
  }
  function addSearchSources(activity){
    if(!activity.extra)return;
    const holder=element('div','c-source-links');
    SOURCES.forEach(source=>holder.appendChild(sourceLink(source)));
    paint(()=>activity.extra.appendChild(holder));
  }
  function makeDigit(rollTo, secondary){
    const windowEl=element('span','c-digit-window');
    const col=element('span','c-digit-column'+(secondary?' is-secondary':''));
    for(let repeat=0;repeat<4;repeat++)for(let i=0;i<=9;i++)col.appendChild(element('span','',String(i)));
    windowEl.appendChild(col);
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      // 18px number rows; travel upward through a complete ten-digit cycle.
      col.style.transform=`translate3d(0,-${((secondary?20:10)+rollTo)*18}px,0)`;
    }));
    return windowEl;
  }
  function counter(value, sign, className){
    const item=element('span','c-stat '+className);item.setAttribute('aria-label',`${sign}${value} lines`);
    const signNode=element('span','c-stat-sign',sign);signNode.setAttribute('aria-hidden','true');item.appendChild(signNode);
    const digits=String(value).split('');
    digits.forEach((d,i)=>{const col=makeDigit(Number(d),i===digits.length-1);col.setAttribute('aria-hidden','true');item.appendChild(col);});
    return item;
  }
  function completeEdit(activity,label,added,removed){
    completed(activity,label);
    paint(()=>{
      activity.diff.append(counter(added,'+','c-diff-add'),counter(removed,'−','c-diff-del'));
      activity.diff.hidden=false;
    });
  }
  // Diff viewer: source-agnostic review UI, adapted to the existing zero-dependency project.
  // The mock content is illustrative; no real files are edited by this demo.
  const DEMO_DIFF_COMPONENT = [
    {kind:'context',number:1,content:'import { useState } from "react";'},
    {kind:'removed',number:2,content:'export const LaunchPanel = () => {'},
    {kind:'removed',number:3,content:'  return <div className="panel">'},
    {kind:'removed',number:4,content:'    <h1>Launch</h1>'},
    {kind:'removed',number:5,content:'    <p>Ready soon.</p>'},
    {kind:'removed',number:6,content:'  </div>;' },
    {kind:'removed',number:7,content:'};'},
    {kind:'removed',number:8,content:'// TODO: add status'},
    {kind:'removed',number:9,content:'// TODO: add actions'},
    {kind:'added',number:2,content:'type LaunchPanelProps = {'},
    {kind:'added',number:3,content:'  title: string;'},
    {kind:'added',number:4,content:'  description: string;'},
    {kind:'added',number:5,content:'  onPreview?: () => void;'},
    {kind:'added',number:6,content:'};'},
    {kind:'added',number:7,content:'export function LaunchPanel(props: LaunchPanelProps) {'},
    {kind:'added',number:8,content:'  const [expanded, setExpanded] = useState(false);'},
    {kind:'added',number:9,content:'  return ('},
    {kind:'added',number:10,content:'    <section className="launch-panel">'},
    {kind:'added',number:11,content:'      <header className="launch-panel__header">'},
    {kind:'added',number:12,content:'        <h2>{props.title}</h2>'},
    {kind:'added',number:13,content:'        <span className="launch-panel__status">Ready</span>'},
    {kind:'added',number:14,content:'      </header>'},
    {kind:'added',number:15,content:'      <p>{props.description}</p>'},
    {kind:'added',number:16,content:'      <button onClick={() => setExpanded(!expanded)}>'},
    {kind:'added',number:17,content:'        {expanded ? "Hide details" : "Show details"}'},
    {kind:'added',number:18,content:'      </button>'},
    {kind:'added',number:19,content:'      {expanded && <div className="launch-panel__details">'},
    {kind:'added',number:20,content:'        <span>Preview available</span>'},
    {kind:'added',number:21,content:'      </div>}'},
    {kind:'added',number:22,content:'      <button onClick={props.onPreview}>Open preview</button>'},
    {kind:'added',number:23,content:'    </section>'},
    {kind:'added',number:24,content:'  );'},
    {kind:'added',number:25,content:'}'},
  ];
  const DEMO_DIFF_STYLES = [
    {kind:'context',number:1,content:'.launch-panel {'},
    {kind:'removed',number:2,content:'  padding: 8px;'},
    {kind:'removed',number:3,content:'  border: none;'},
    {kind:'removed',number:4,content:'  background: #eee;'},
    {kind:'added',number:2,content:'  padding: 24px;'},
    {kind:'added',number:3,content:'  border: 1px solid #e8e8e8;'},
    {kind:'added',number:4,content:'  background: #fff;'},
    {kind:'added',number:5,content:'  border-radius: 14px;'},
    {kind:'added',number:6,content:'  display: grid;'},
    {kind:'added',number:7,content:'  gap: 12px;'},
    {kind:'added',number:8,content:'  transition: border-color 180ms ease;'},
    {kind:'added',number:9,content:'}'},
    {kind:'added',number:10,content:'.launch-panel__header { display: flex; }'},
    {kind:'added',number:11,content:'.launch-panel__status { color: #555; }'},
    {kind:'added',number:12,content:'.launch-panel__details { line-height: 1.6; }'},
    {kind:'added',number:13,content:'.launch-panel:focus-within { outline-offset: 3px; }'},
  ];
  let editReviewSequence = 0;
  function createEditReview(group,path,lines){
    const added=lines.filter(line=>line.kind==='added').length;
    const removed=lines.filter(line=>line.kind==='removed').length;
    const unit=element('section','c-edit-review is-working');
    unit.setAttribute('aria-label','File edit review: '+path);
    const trigger=element('button','c-edit-review-trigger');trigger.type='button';trigger.disabled=true;
    trigger.setAttribute('aria-expanded','false');
    const panel=element('div','c-edit-review-expansion');
    const panelId='edit-diff-'+(++editReviewSequence);panel.id=panelId;
    trigger.setAttribute('aria-controls',panelId);
    const icon=element('span','c-action-icon');icon.innerHTML=svg('edit');
    const title=element('span','c-edit-review-label c-active-shimmer','Editing '+path);
    const stats=element('span','c-edit-review-stats');stats.hidden=true;
    const chevron=element('span','c-edit-review-arrow');chevron.innerHTML=svg('chevron');
    trigger.append(icon,title,stats,chevron);
    const inner=element('div','c-edit-review-inner');
    const codeCard=element('div','c-edit-code-card');
    const codeHead=element('div','c-edit-code-head');
    codeHead.append(element('span','c-edit-code-path',path));
    const codeStats=element('span','c-edit-code-stats');
    const plus=element('span','c-edit-plus','+'+added);
    const minus=element('span','c-edit-minus','−'+removed);codeStats.append(plus,minus);codeHead.append(codeStats);
    const codeViewport=element('div','c-edit-code-viewport');
    const codeLines=element('div','c-edit-code-lines');
    lines.forEach((line,index)=>{
      const row=element('div','c-edit-code-line is-'+line.kind);
      row.style.setProperty('--line-index',index);
      if(line.number!==undefined)row.append(element('span','c-edit-line-number',String(line.number)));
      else row.append(element('span','c-edit-line-number',''));
      row.append(element('span','c-edit-line-prefix',line.kind==='added'?'+':line.kind==='removed'?'−':' '));
      row.append(element('span','c-edit-line-content',line.content || ' '));
      codeLines.appendChild(row);
    });
    codeViewport.append(codeLines);codeCard.append(codeHead,codeViewport);
    const actions=element('div','c-edit-decision-bar');
    const reject=element('button','c-edit-reject','Reject');reject.type='button';
    const accept=element('button','c-edit-accept','Accept');accept.type='button';
    actions.append(reject,accept);
    const decisionStatus=element('p','c-edit-decision-status');decisionStatus.hidden=true;
    codeCard.append(actions,decisionStatus);
    inner.append(codeCard);panel.appendChild(inner);unit.append(trigger,panel);
    paint(()=>group.appendChild(unit));
    let finished=false,open=false,decision=null,hasOpened=false;
    function setOpen(next){
      if(!finished)return;
      open=next;
      trigger.setAttribute('aria-expanded',String(next));
      paint(()=>unit.classList.toggle('is-open',next));
      if(next && !hasOpened){hasOpened=true;unit.classList.add('is-first-open');
        if(!reducedMotion)setTimeout(()=>unit.classList.remove('is-first-open'),1000);
      }
    }
    trigger.addEventListener('click',()=>setOpen(!open));
    function choose(value){
      if(decision || !finished)return;
      decision=value;unit.dataset.decision=value;
      unit.classList.add(value==='accepted'?'is-accepted':'is-rejected');
      actions.hidden=true;decisionStatus.hidden=false;decisionStatus.textContent=value==='accepted'?'Accepted':'Rejected';
      codeCard.classList.remove('is-decision-flash');void codeCard.offsetWidth;
      if(!reducedMotion)codeCard.classList.add('is-decision-flash');
    }
    accept.addEventListener('click',()=>choose('accepted'));
    reject.addEventListener('click',()=>choose('rejected'));
    return {unit,trigger,complete:()=>{
      finished=true;unit.classList.remove('is-working');unit.classList.add('is-finished');
      trigger.disabled=false;title.classList.remove('c-active-shimmer');
      updateLabel(title,'Edited '+path);
      stats.append(counter(added,'+','c-diff-add'),counter(removed,'−','c-diff-del'));
      stats.hidden=false;
    },open:()=>setOpen(true)};
  }

  function addCitations(){
    const block=element('div','c-stream-block');
    const p=element('p');
    p.appendChild(document.createTextNode('The sources recommend keeping controls accessible and reducing nonessential motion when requested. '));
    const source=SOURCES[0];const a=element('a','c-citation');a.href=source.href;a.target='_blank';a.rel='noopener noreferrer';
    a.dataset.title=source.title;a.setAttribute('aria-label',source.title);
    const logo=sourceLogo(source,'c-citation-logo');a.append(logo,document.createTextNode('MDN +2'));
    p.appendChild(a);block.appendChild(p);paint(()=>assistant.appendChild(block));
  }
  function addSourcesFooter(){
    // Sources expand *horizontally* beside the trigger; website links are live,
    // but never open automatically. The demo data is illustrative.
    const root=element('section','c-sources-inline');
    root.setAttribute('aria-label','Referenced sources');
    const trigger=element('button','c-sources-inline-trigger');
    trigger.type='button';trigger.setAttribute('aria-expanded','false');
    trigger.setAttribute('aria-controls','c-sources-inline-items-'+session);
    const logos=element('span','c-sources-logos');
    SOURCES.forEach(source=>logos.appendChild(sourceLogo(source,'c-sources-logo')));
    const directionIcon=element('span','c-sources-inline-direction');directionIcon.innerHTML=svg('chevron');
    trigger.setAttribute('aria-label','Show sources');
    trigger.append(logos,element('span','c-sources-inline-heading','Sources'),element('span','c-sources-inline-count',String(SOURCES.length)),directionIcon);
    const clip=element('div','c-sources-inline-clip');clip.id='c-sources-inline-items-'+session;
    clip.setAttribute('aria-hidden','true');clip.inert=true;
    const links=element('div','c-sources-inline-links');
    SOURCES.forEach((source,index)=>{
      const slot=element('span','c-sources-inline-slot');slot.style.setProperty('--source-index',index);
      const a=element('a','c-sources-inline-link');a.href=source.href;a.target='_blank';a.rel='noopener noreferrer';
      a.setAttribute('aria-label','Open '+source.name);
      a.style.setProperty('--source-index',index);
      a.append(sourceLogo(source,'c-sources-inline-favicon'),element('span','c-sources-inline-site',source.name));
      slot.append(a);links.append(slot);
    });
    clip.append(links);root.append(trigger,clip);
    trigger.addEventListener('click',()=>{
      const open=trigger.getAttribute('aria-expanded')!=='true';
      trigger.setAttribute('aria-expanded',String(open));
      trigger.setAttribute('aria-label',open?'Hide sources':'Show sources');
      clip.setAttribute('aria-hidden',String(!open));
      clip.inert=!open;
      paint(()=>root.classList.toggle('is-open',open));
    });
    paint(()=>assistant.append(root));
    return root;
  }


  /* Native MathML works offline. Optional, on-demand KaTeX expands the demo to
     arbitrary TeX without altering npm run dev. Production uses its own renderer. */
  function addRichResponseShowcase(){
    const wrap=element('section','c-rich-response');wrap.setAttribute('aria-label','Response formatting');
    const title=element('div','c-rich-heading');title.append(element('h3','','Rich response formatting'),element('span','c-rich-subtitle','Mathematics · data · writing'));wrap.append(title);
    const math=element('section','c-rich-math-card');math.append(element('h4','','Equations & fractions'));
    const inline=element('p','c-rich-inline-math');inline.append(document.createTextNode('Quadratic formula: '));
    inline.insertAdjacentHTML('beforeend','<math xmlns="http://www.w3.org/1998/Math/MathML" aria-label="Quadratic formula"><mi>x</mi><mo>=</mo><mfrac><mrow><mo>−</mo><mi>b</mi><mo>±</mo><msqrt><msup><mi>b</mi><mn>2</mn></msup><mo>−</mo><mn>4</mn><mi>a</mi><mi>c</mi></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></math>');
    const display=element('div','c-rich-math-display');
    display.innerHTML='<math xmlns="http://www.w3.org/1998/Math/MathML" display="block" aria-label="Integral from zero to one x squared dx equals one third"><msubsup><mo>∫</mo><mn>0</mn><mn>1</mn></msubsup><msup><mi>x</mi><mn>2</mn></msup><mi>d</mi><mi>x</mi><mo>=</mo><mfrac><mn>1</mn><mn>3</mn></mfrac></math>';
    const more=element('div','c-rich-math-secondary');
    more.innerHTML='<math xmlns="http://www.w3.org/1998/Math/MathML" display="block" aria-label="Two by two matrix"><mi>A</mi><mo>=</mo><mo>(</mo><mtable><mtr><mtd><mn>1</mn></mtd><mtd><mn>2</mn></mtd></mtr><mtr><mtd><mn>3</mn></mtd><mtd><mn>4</mn></mtd></mtr></mtable><mo>)</mo></math><math xmlns="http://www.w3.org/1998/Math/MathML" display="block" aria-label="Sum of i from one to n"><munderover><mo>∑</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mi>n</mi></munderover><mi>i</mi><mo>=</mo><mfrac><mrow><mi>n</mi><mo>(</mo><mi>n</mi><mo>+</mo><mn>1</mn><mo>)</mo></mrow><mn>2</mn></mfrac></math>';
    const buttons=element('div','c-rich-math-actions');
    const copy=element('button','c-rich-minibutton','Copy LaTeX');copy.type='button';copy.setAttribute('aria-label','Copy formula LaTeX');
    copy.addEventListener('click',async()=>{if(await writeClipboard('x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}')){copy.textContent='Copied';setTimeout(()=>copy.textContent='Copy LaTeX',1200);}});
    const toggle=element('button','c-rich-minibutton','Try LaTeX');toggle.type='button';toggle.setAttribute('aria-expanded','false');
    const inputArea=element('div','c-rich-tex-editor');inputArea.hidden=true;
    const input=element('textarea','c-rich-tex-input');input.rows=2;input.value='\\frac{\\sqrt{x^2+1}}{1+\\alpha}';input.setAttribute('aria-label','LaTeX expression');
    const render=element('button','c-rich-minibutton','Render equation');render.type='button';
    const result=element('div','c-rich-tex-result');result.setAttribute('aria-live','polite');
    const status=element('span','c-rich-math-status','MathML samples render offline. Optional LaTeX requires a network connection.');
    inputArea.append(input,render,result,status);
    toggle.addEventListener('click',()=>{inputArea.hidden=!inputArea.hidden;toggle.setAttribute('aria-expanded',String(!inputArea.hidden));if(!inputArea.hidden)input.focus();});
    let loadPromise=null;
    const loadKaTeX=()=>{
      if(window.katex)return Promise.resolve(window.katex);
      if(loadPromise)return loadPromise;
      loadPromise=new Promise((resolve,reject)=>{
        if(!document.querySelector('link[data-clyra-math]')){
          const sheet=document.createElement('link');sheet.rel='stylesheet';sheet.href='https://cdn.jsdelivr.net/npm/katex@0.19.1/dist/katex.min.css';sheet.dataset.clyraMath='yes';document.head.append(sheet);
        }
        const script=document.createElement('script');script.src='https://cdn.jsdelivr.net/npm/katex@0.19.1/dist/katex.min.js';script.async=true;
        script.onload=()=>window.katex?resolve(window.katex):reject(Error('KaTeX not loaded'));script.onerror=()=>reject(Error('KaTeX unavailable'));document.head.append(script);
      }).catch(error=>{loadPromise=null;throw error;});
      return loadPromise;
    };
    render.addEventListener('click',async()=>{render.disabled=true;status.textContent='Rendering…';
      try{(await loadKaTeX()).render(input.value,result,{displayMode:true,throwOnError:false,trust:false});
        status.textContent='Rendered using KaTeX.';}
      catch{result.textContent=input.value;status.textContent='TeX renderer unavailable offline; native MathML examples remain visible.';}
      finally{render.disabled=false;}
    });
    buttons.append(copy,toggle);math.append(inline,display,more,buttons,inputArea);wrap.append(math);
    const data=element('section','c-rich-data');data.append(element('h4','','Structured data'));
    const table=element('table','c-rich-table');
    table.innerHTML='<caption>Illustrative metrics</caption><thead><tr><th>Metric</th><th>Before</th><th>After</th></tr></thead><tbody><tr><th>Completion</th><td>68%</td><td>91%</td></tr><tr><th>Accuracy</th><td>82%</td><td>95%</td></tr><tr><th>Latency</th><td>2.1s</td><td>1.4s</td></tr></tbody>';
    data.append(table);
    const chart=element('div','c-rich-mini-chart');chart.setAttribute('role','img');chart.setAttribute('aria-label','Illustrative completion 68 percent before and 91 percent after');
    for(const [name,value,color] of [['Before','68%','base'],['After','91%','updated']]){
      const row=element('div','c-rich-chart-row');row.append(element('span','c-rich-chart-label',name));
      const track=element('span','c-rich-chart-track');const bar=element('span','c-rich-chart-bar '+color);bar.style.width=value;track.append(bar);
      row.append(track,element('span','c-rich-chart-value',value));chart.append(row);
    }
    data.append(chart);wrap.append(data);
    const editorial=element('section','c-rich-editorial');
    editorial.append(element('h4','','Editorial content'));
    editorial.append(element('blockquote','c-rich-quote','Clear answers make evidence, decisions and next steps easy to inspect.'));
    const list=element('ul','c-rich-list');
    ['Headings, emphasis, quotes and linked sources','Equations, code, tables and visual comparisons','Editable documents, slides and tool activity'].forEach(t=>list.append(element('li','',t)));
    editorial.append(list);wrap.append(editorial);
    paint(()=>assistant.append(wrap));return wrap;
  }

  function addResults(){
    const block=element('div','c-stream-block');
    const header=element('h3','c-result-heading','Changes applied');
    const list=element('ul','c-result-list');
    const entries=[
      ['Interaction states','Active thinking, search and edit rows transition to completed labels without leaving empty space.'],
      ['Typography and spacing','Text remains aligned in one reading lane with compact activity spacing.'],
      ['Motion','Status effects use lightweight transforms and opacity, with a reduced-motion fallback.']
    ];
    for(const [label,value] of entries){const li=element('li');const strong=element('strong','',label+': ');li.append(strong,document.createTextNode(value));list.appendChild(li);}
    block.append(header,list);paint(()=>assistant.appendChild(block));
  }
  async function writeClipboard(text){
    if(navigator.clipboard?.writeText){try{await navigator.clipboard.writeText(text);return true;}catch(e){}}
    const textArea=document.createElement('textarea');
    textArea.value=text;textArea.setAttribute('readonly','');
    textArea.style.cssText='position:fixed;left:-9999px;top:0;opacity:0;';
    document.body.appendChild(textArea);textArea.select();
    let ok=false;try{ok=document.execCommand('copy');}catch(e){}
    textArea.remove();return ok;
  }
  function addWritingCard(){
    const card=element('section','c-writing-card');
    card.setAttribute('aria-label','Editable writing document');
    const header=element('div','c-writing-header');
    const title=element('span','c-writing-header-title','Writing');
    const actions=element('div','c-writing-header-actions');
    function headButton(icon,label,text=''){
      const b=element('button','c-writing-head-btn');b.type='button';b.setAttribute('aria-label',label);b.dataset.tooltip=label;
      b.innerHTML=svg(icon)+(text?'<span>'+text+'</span>':'');return b;
    }
    const copy=headButton('copy','Copy writing');
    const edit=headButton('edit','Edit writing','Edit');edit.setAttribute('aria-pressed','false');
    const expand=headButton('expand','Full screen writing','Full screen');
    actions.append(copy,edit,expand);header.append(title,actions);
    const toolbarShell=element('div','c-writing-toolbar-shell');toolbarShell.setAttribute('aria-hidden','true');
    const toolbarClip=element('div','c-writing-toolbar-clip');
    const toolbar=element('div','c-writing-toolbar');toolbar.setAttribute('role','toolbar');toolbar.setAttribute('aria-label','Document formatting');
    const content=element('div','c-writing-content');content.style.fontSize='16px';
    content.setAttribute('contenteditable','false');content.setAttribute('role','textbox');
    content.setAttribute('aria-label','Document content');content.setAttribute('aria-multiline','true');
    const notice=element('span','c-writing-feedback');notice.hidden=true;
    let noticeTimer,editing=false,rememberedRange=null,popup=null;
    const notify=txt=>{notice.textContent=txt;notice.hidden=false;clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>{notice.hidden=true;},1250);};
    const fonts=[['System UI','system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif'],['Arial','Arial,sans-serif'],['Helvetica','Helvetica,Arial,sans-serif'],['Georgia','Georgia,serif'],['Times New Roman','"Times New Roman",serif'],['Verdana','Verdana,sans-serif'],['Tahoma','Tahoma,sans-serif'],['Trebuchet MS','"Trebuchet MS",sans-serif'],['Palatino','Palatino,serif'],['Garamond','Garamond,serif'],['Courier New','"Courier New",monospace'],['Menlo','Menlo,monospace'],['Monaco','Monaco,monospace'],['Gill Sans','"Gill Sans",sans-serif'],['Impact','Impact,sans-serif']];
    const esc=txt=>txt.replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
    function preserveSelection(){const sel=window.getSelection();if(sel&&sel.rangeCount&&!sel.isCollapsed&&content.contains(sel.anchorNode))rememberedRange=sel.getRangeAt(0).cloneRange();}
    function restoreSelection(){if(rememberedRange&&rememberedRange.startContainer.isConnected){const sel=window.getSelection();sel.removeAllRanges();sel.addRange(rememberedRange);}}
    function command(cmd,val=null){restoreSelection();content.focus({preventScroll:true});try{document.execCommand(cmd,false,val);}catch(e){notify('Formatting unavailable');}preserveSelection();}
    const makeButton=(name,label)=>{const b=element('button','c-writing-format-btn');b.type='button';b.dataset.tooltip=label;b.setAttribute('aria-label',label);b.setAttribute('aria-pressed','false');b.innerHTML=svg(name);return b;};
    const buttons={};
    [['bold','Bold'],['italic','Italic'],['underline','Underline'],['strike','Strikethrough'],['link','Insert link'],['heading','Heading'],['quote','Quote'],['textColor','Text colour'],['highlightColor','Highlight colour'],['bullets','Bulleted list'],['numbered','Numbered list'],['table','Insert table'],['alignLeft','Align left'],['alignCenter','Align centre'],['alignRight','Align right']].forEach(([name,label])=>buttons[name]=makeButton(name,label));
    const fontBtn=element('button','c-editor-font-button');fontBtn.type='button';fontBtn.setAttribute('aria-label','Choose font');fontBtn.dataset.tooltip='Font family';fontBtn.innerHTML='<span class="c-editor-font-name">System UI</span>'+svg('caret');
    const size=element('select','c-writing-select c-writing-size');size.setAttribute('aria-label','Font size');
    [11,12,13,14,15,16,18,20,22,24,28,32,36,40,48].forEach(v=>{const o=element('option','',String(v));o.value=String(v);if(v===16)o.selected=true;size.appendChild(o);});
    const sep=()=>element('span','c-writing-tool-divider');
    function tooltipWrap(button){return button;}
    const listGroup=element('div','c-editor-split');
    const listArrow=makeButton('caret','List styles');listArrow.classList.add('c-editor-chevron-button');
    listGroup.append(buttons.bullets,listArrow);
    const textColorGroup=element('div','c-editor-color-group');buttons.textColor.classList.add('is-ink-control');textColorGroup.append(buttons.textColor);
    const highlightGroup=element('div','c-editor-color-group');buttons.highlightColor.classList.add('is-highlight-control');highlightGroup.append(buttons.highlightColor);
    toolbar.append(fontBtn,size,sep(),buttons.bold,buttons.italic,buttons.underline,buttons.strike,buttons.link,buttons.heading,buttons.quote,sep(),textColorGroup,highlightGroup,sep(),listGroup,buttons.numbered,buttons.table,sep(),buttons.alignLeft,buttons.alignCenter,buttons.alignRight);
    toolbar.addEventListener('mousedown',e=>{if(e.target.closest('button')&& !e.target.closest('input'))e.preventDefault();});
    toolbarClip.append(toolbar);toolbarShell.append(toolbarClip);
    const aiSelection=element('button','c-ai-selection-action');aiSelection.type='button';aiSelection.innerHTML=svg('sparkles')+'<span>Ask AI about selection</span>';aiSelection.hidden=true;
    aiSelection.dataset.tooltip='Ask AI about selection';aiSelection.setAttribute('aria-label','Ask AI about selection');
    const syncSelection=()=>{const sel=window.getSelection();const active=sel&&!sel.isCollapsed&&content.contains(sel.anchorNode)&&content.contains(sel.focusNode);aiSelection.hidden=!active;if(active)preserveSelection();};
    document.addEventListener('selectionchange',syncSelection);
    aiSelection.addEventListener('click',()=>{const txt=window.getSelection()?.toString()?.trim();if(!txt)return;composerInput.value='Improve this text: '+txt;composerSend.disabled=false;composerInput.focus();aiSelection.hidden=true;});
    // The document is presented as an inline artifact from the start, not a dropdown.
    card.append(header,toolbarShell,content,aiSelection,notice);
    function closePopup(){if(popup){popup.remove();popup=null;}document.removeEventListener('pointerdown',onOutside,true);document.removeEventListener('keydown',onEscape,true);}
    function onOutside(e){if(popup&&!popup.contains(e.target)&&!toolbar.contains(e.target))closePopup();}
    function onEscape(e){if(e.key==='Escape')closePopup();}
    function openPopup(trigger,kind){
      if(popup&&popup.dataset.kind===kind){closePopup();return;}
      closePopup();const surface=element('div','c-editor-popup');surface.dataset.kind=kind;surface.setAttribute('role','dialog');surface.setAttribute('aria-label',kind+' options');
      const rect=trigger.getBoundingClientRect();
      surface.style.left=Math.max(8,Math.min(rect.left,window.innerWidth-(kind==='fonts'?250:226)))+'px';
      surface.style.top=Math.min(rect.bottom+7,window.innerHeight-280)+'px';
      surface.style.width=(kind==='fonts'?240:210)+'px';
      const label=element('div','c-editor-popup-label',kind==='fonts'?'Choose font':kind==='text'?'Text colour':kind==='highlight'?'Highlight colour':kind==='lists'?'List style':'Insert table');surface.append(label);
      if(kind==='fonts'){
        const search=element('input','c-editor-font-search');search.type='search';search.placeholder='Search fonts';search.setAttribute('aria-label','Search fonts');surface.append(search);
        const items=element('div','c-editor-font-options');surface.append(items);
        const render=q=>{items.replaceChildren();fonts.filter(([name])=>name.toLowerCase().includes(q.toLowerCase())).forEach(([name,family])=>{const o=element('button','c-editor-menu-item',name);o.type='button';o.style.fontFamily=family;o.addEventListener('click',()=>{fontBtn.querySelector('.c-editor-font-name').textContent=name;restoreSelection();if(rememberedRange)command('fontName',name);else content.style.fontFamily=family;closePopup();});items.append(o);});if(!items.children.length)items.append(element('p','c-editor-empty','No matching fonts'));};
        render('');search.addEventListener('input',()=>render(search.value));setTimeout(()=>search.focus({preventScroll:true}),0);
      } else if(kind==='text'||kind==='highlight'){
        const colors=[['Black','#202124'],['Grey','#77777b'],['Red','#d93025'],['Orange','#e37400'],['Yellow','#f9c846'],['Green','#188038'],['Teal','#008577'],['Blue','#1a73e8'],['Purple','#8e24aa'],['Pink','#d81b60'],['White','#ffffff'],['None',kind==='highlight'?'transparent':'#202124']];
        const grid=element('div','c-editor-swatches');surface.append(grid);
        colors.forEach(([name,hex])=>{const b=element('button','c-editor-swatch');b.type='button';b.style.setProperty('--swatch',hex);b.setAttribute('aria-label',name);b.dataset.tooltip=name;b.addEventListener('click',()=>{command(kind==='text'?'foreColor':'hiliteColor',hex);closePopup();});grid.append(b);});
      } else if(kind==='lists'){
        [['disc','• Bullets','insertUnorderedList'],['circle','◦ Circles','insertUnorderedList'],['square','▪ Squares','insertUnorderedList'],['decimal','1. Numbers','insertOrderedList'],['lower-alpha','a. Letters','insertOrderedList']].forEach(([style,text,cmd])=>{const o=element('button','c-editor-menu-item',text);o.type='button';o.addEventListener('click',()=>{command(cmd);let node=window.getSelection()?.anchorNode;const root=(node?.nodeType===1?node:node?.parentElement)?.closest('ul,ol');if(root)root.style.listStyleType=style;buttons.bullets.setAttribute('aria-pressed',String(cmd==='insertUnorderedList'));buttons.numbered.setAttribute('aria-pressed',String(cmd==='insertOrderedList'));closePopup();});surface.append(o);});
      } else if(kind==='table'){
        const desc=element('div','c-editor-table-size','2 × 2');surface.append(desc);
        const grid=element('div','c-editor-table-grid');surface.append(grid);
        for(let row=1;row<=4;row++)for(let col=1;col<=4;col++){
          const b=element('button','c-editor-table-cell');b.type='button';b.dataset.row=String(row);b.dataset.col=String(col);b.setAttribute('aria-label',`Insert ${row} by ${col} table`);
          b.addEventListener('pointerenter',()=>{desc.textContent=row+' × '+col;grid.querySelectorAll('button').forEach(x=>x.classList.toggle('is-highlighted',Number(x.dataset.row)<=row&&Number(x.dataset.col)<=col));});
          b.addEventListener('click',()=>{let html='<table class="c-writing-table"><tbody>';for(let r=0;r<row;r++){html+='<tr>';for(let c=0;c<col;c++)html+='<td>Cell</td>';html+='</tr>';}html+='</tbody></table><p><br></p>';command('insertHTML',html);closePopup();});grid.append(b);
        }
      }
      document.body.append(surface);popup=surface;
      document.addEventListener('pointerdown',onOutside,true);document.addEventListener('keydown',onEscape,true);
    }
    fontBtn.addEventListener('click',()=>openPopup(fontBtn,'fonts'));
    buttons.textColor.addEventListener('click',()=>openPopup(buttons.textColor,'text'));
    buttons.highlightColor.addEventListener('click',()=>openPopup(buttons.highlightColor,'highlight'));
    listArrow.addEventListener('click',()=>openPopup(listArrow,'lists'));
    buttons.table.addEventListener('click',()=>openPopup(buttons.table,'table'));
    const setPressed=(key,pressed)=>buttons[key].setAttribute('aria-pressed',String(pressed));
    for(const [key,cmd,val] of [['bold','bold'],['italic','italic'],['underline','underline'],['strike','strikeThrough'],['heading','formatBlock','h2'],['quote','formatBlock','blockquote'],['bullets','insertUnorderedList'],['numbered','insertOrderedList']])buttons[key].addEventListener('click',()=>{command(cmd,val||null);setPressed(key,buttons[key].getAttribute('aria-pressed')!=='true');if(key==='bullets')setPressed('numbered',false);if(key==='numbered')setPressed('bullets',false);});
    buttons.link.addEventListener('click',()=>{restoreSelection();const selection=window.getSelection();if(!selection||selection.isCollapsed){notify('Select text to add a link');return;}const url=window.prompt('Link URL','https://');if(url){if(/^https?:\/\//i.test(url))command('createLink',url);else notify('Use an http(s) URL');}});
    [['alignLeft','justifyLeft'],['alignCenter','justifyCenter'],['alignRight','justifyRight']].forEach(([key,cmd])=>buttons[key].addEventListener('click',()=>{command(cmd);['alignLeft','alignCenter','alignRight'].forEach(k=>setPressed(k,k===key));}));
    setPressed('alignLeft',true);
    function setExpanded(next){
      card.classList.toggle('is-expanded',next);
      document.body.classList.toggle('c-document-fullscreen-active',next);
      expand.innerHTML=svg(next?'x':'expand')+'<span>'+(next?'Close':'Full screen')+'</span>';
      expand.setAttribute('aria-label',next?'Close writing full screen':'Full screen writing');
      expand.setAttribute('aria-expanded',String(next));
    }
    function setEditing(next){editing=next;if(editing)setExpanded(true);else if(card.classList.contains('is-expanded'))setExpanded(false);card.classList.toggle('is-editing',editing);toolbarShell.classList.toggle('is-open',editing);toolbarShell.setAttribute('aria-hidden',String(!editing));edit.innerHTML=editing?svg('check')+'<span>Done</span>':svg('edit')+'<span>Edit</span>';edit.setAttribute('aria-label',editing?'Finish editing writing':'Edit writing');edit.setAttribute('aria-pressed',String(editing));content.contentEditable=String(editing);if(editing)content.focus({preventScroll:true});else{closePopup();content.blur();}}
    edit.addEventListener('click',()=>setEditing(!editing));
    expand.addEventListener('click',()=>{
      if(card.classList.contains('is-expanded')){if(editing)setEditing(false);else setExpanded(false);}
      else setExpanded(true);
    });
    window.addEventListener('keydown',event=>{
      if(event.key==='Escape'&&card.isConnected&&card.classList.contains('is-expanded')){
        if(editing)setEditing(false);else setExpanded(false);
      }
    });
    content.addEventListener('click',()=>{if(!editing&&card.classList.contains('is-document-ready'))setEditing(true);});
    copy.addEventListener('click',async()=>{const ok=await writeClipboard(content.innerText.trim());if(ok){copy.innerHTML=svg('check');setTimeout(()=>{if(copy.isConnected)copy.innerHTML=svg('copy');},1150);}else notify('Copy unavailable');});
    size.addEventListener('change',()=>{content.style.fontSize=size.value+'px';});
    paint(()=>assistant.append(card));
    async function revealAndType(token,delay){
      card.classList.add('is-document-opening');
      const sections=[['h4','Product launch brief'],['h5','One thoughtful workspace ✨'],['p','Bring research, documents and connected tools together in a focused environment.'],['p','Objective. Make complex workflows feel simple, clear and dependable.'],['p','Approach. Plan, act and verify — with each step visible when you need it.']];
      for(const [tag,text] of sections){const line=element(tag,'c-document-typed');content.append(line);for(const word of text.match(/\S+\s*/g)||[]){line.append(element('span','c-document-word',word));await delay(25);}await delay(110);}
      card.classList.remove('is-document-opening');card.classList.add('is-document-ready');
    }
    return {card,revealAndType};
  }
  function addFooter(){
    const footer=element('div','c-footer-actions');footer.setAttribute('aria-label','Response actions');
    function action(name,label){
      const b=element('button','c-action-btn');b.type='button';b.dataset.tooltip=label;b.setAttribute('aria-label',label);b.innerHTML=svg(name);
      return b;
    }
    const copy=action('copy','Copy response');
    const replay=action('replay','Regenerate response');
    const note=element('span','c-copy-note');
    copy.addEventListener('click',async()=>{
      const text=[...assistant.querySelectorAll('.c-stream-block p,.c-result-heading,.c-result-list li')].map(n=>n.textContent).join('\n');
      const ok=await writeClipboard(text);
      if(ok){note.textContent='Copied';copy.innerHTML=svg('check');clearTimeout(copyResetTimer);copyResetTimer=setTimeout(()=>{note.textContent='';if(copy.isConnected)copy.innerHTML=svg('copy');},1400);}
      else{note.textContent='Copy unavailable';}
    });
    replay.addEventListener('click',()=>runDemo());
    footer.append(copy,replay,note);
    paint(()=>assistant.appendChild(footer));
  }

  function addStepDivider(label){
    const div=element('div','c-step-divider',label);div.setAttribute('role','separator');div.setAttribute('aria-label',label);
    paint(()=>assistant.appendChild(div));return div;
  }
  /** Presentation-only port of the supplied compact animated TodoList design.
   * Native DOM version keeps this zero-dependency showcase; a real React host may
   * use the provided component directly with actual task IDs and state.
   * Do NOT copy the three demonstration tasks or demo progress timing. */
  function createTodo(items){
    const card=element('section','c-todo c-todo-v8');card.setAttribute('aria-label','Agent task list');
    const titleId='c-todo-label',contentId='c-todo-content';
    const trigger=element('button','c-todo-v8-trigger');trigger.type='button';trigger.id=titleId;
    trigger.setAttribute('aria-expanded','true');trigger.setAttribute('aria-controls',contentId);
    const mark=element('span','c-todo-v8-headicon');
    mark.innerHTML='<span class="c-todo-glyph c-todo-glyph-list">'+svg('listTodo')+'</span><svg class="c-todo-progress-svg" viewBox="0 0 28 28" aria-hidden="true"><circle class="c-todo-progress-track" cx="14" cy="14" r="11"/><circle class="c-todo-progress-value" cx="14" cy="14" r="11"/></svg><span class="c-todo-glyph c-todo-glyph-complete">'+svg('check')+'</span>';
    const label=element('span','c-todo-v8-title','To-dos');
    const counter=element('span','c-todo-v8-counter');counter.textContent='0/'+items.length;
    const chevron=element('span','c-todo-v8-chevron');chevron.innerHTML=svg('chevron');
    trigger.append(mark,label,counter,chevron);
    const disclosure=element('div','c-todo-v8-disclosure is-open');disclosure.id=contentId;
    disclosure.setAttribute('role','region');disclosure.setAttribute('aria-labelledby',titleId);
    const inner=element('div','c-todo-v8-inner');const list=element('ol','c-todo-v8-list');
    const rows=items.map((task,i)=>{
      const row=element('li','c-todo-v8-item');row.style.setProperty('--row-index',i);
      const icon=element('span','c-todo-v8-status');icon.innerHTML=svg('check');
      const txt=element('span','c-todo-v8-itemtext');txt.textContent=task;
      row.append(icon,txt);list.append(row);return row;
    });
    inner.append(list);disclosure.append(inner);card.append(trigger,disclosure);planMount.replaceChildren(card);
    let done=0,open=false,pinned=false,hovered=false;setOpen(false);
    // Hover offers a temporary peek; click pins open until click outside or again.
    // Touch/keyboard users use click, and hover never changes their explicit choice.
    function setOpen(next){open=next;trigger.setAttribute('aria-expanded',String(open));
      card.classList.toggle('is-open',open);disclosure.classList.toggle('is-open',open);
      disclosure.setAttribute('aria-hidden',String(!open));disclosure.inert=!open;
    }
    trigger.addEventListener('click',event=>{
      event.stopPropagation();
      if(pinned){pinned=false;setOpen(false);}
      else{pinned=true;setOpen(true);}
    });
    card.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'||event.pointerType==='pen'){hovered=true;if(!pinned)setOpen(true);}});
    card.addEventListener('pointerleave',()=>{hovered=false;if(!pinned)setOpen(false);});
    document.addEventListener('pointerdown',event=>{
      if(card.isConnected&&pinned&&!card.contains(event.target)){pinned=false;setOpen(false);}
    });
    function render(){
      const all=done===items.length;
      rows.forEach((row,index)=>{
        row.classList.toggle('is-done',index<done);row.classList.toggle('is-current',index===done);
        row.classList.toggle('is-pending',index>done);
      });
      // Digits dissolve into their next value without shifting the surrounding layout.
      const nextCount=done+'/'+items.length;
      if(counter.textContent!==nextCount){
        counter.textContent=nextCount;
        if(!reducedMotion)counter.animate([
          {opacity:.35,filter:'blur(1.5px)'},{opacity:1,filter:'blur(0)'}
        ],{duration:440,easing:'cubic-bezier(.22,1,.36,1)'});
      }
      // The 1/N text represents progress; the icon is a *spinning activity indicator*.
      // It intentionally does not represent the fraction completed.
      mark.classList.toggle('is-all-done',all);mark.classList.toggle('is-working',!all&&done<items.length);
      if(all){setTimeout(()=>{if(done===items.length&&card.isConnected&&!pinned)setOpen(false);},880);}
      // Keep the compact collapsed plan stable unless the user opens it.
    }
    render();
    return {card,advance:()=>paint(()=>{done=Math.min(items.length,done+1);render();})};
  }
  async function playSkill(label,details,token,delay,kind='wand'){
    const group=addActivityGroup();
    const isPresentationBuilder=label==='Presentation Builder';
    const activity=addActivity(group,{label:'Using skill · '+label,icon:kind,disclose:!isPresentationBuilder,details:isPresentationBuilder?[]:details});
    if(!isPresentationBuilder)activity.autoSetExpanded(true);
    await delay(900);
    completed(activity,'Used skill · '+label);
    await delay(170);
    if(!isPresentationBuilder)activity.autoSetExpanded(false);
    return activity;
  }
  function createPresentationCard(){
    // A usable local slide editor for this visual fixture. Production apps MUST
    // reuse their own slide engine, file formats, collaboration and persistence.
    const card=element('section','c-presentation c-slides-v10 c-slides-v14');
    card.setAttribute('aria-label','Editable presentation');
    const top=element('div','c-preview-top');
    const name=element('div','c-preview-name');name.innerHTML=svg('slides')+'<span>Presentation</span>';
    const editBtn=element('button','c-slide-action');editBtn.type='button';editBtn.dataset.tooltip='Edit slides';editBtn.setAttribute('aria-label','Edit slides');editBtn.innerHTML=svg('edit')+'<span>Edit</span>';
    const fullBtn=element('button','c-slide-action');fullBtn.type='button';fullBtn.dataset.tooltip='Full screen';fullBtn.setAttribute('aria-label','Full screen');fullBtn.innerHTML=svg('expand')+'<span>Full screen</span>';
    const filename=element('input','c-slide-filename');filename.type='text';filename.value='Clyra presentation';filename.maxLength=90;filename.setAttribute('aria-label','Presentation file name');
    name.replaceChildren(element('span','c-slide-brand-icon'));name.firstChild.innerHTML=svg('slides');name.append(filename);
    const saved=element('span','c-slide-saved-status','Local demo');
    const actions=element('div','c-slide-top-actions');actions.append(saved,editBtn,fullBtn);top.append(name,actions);
    const menuBar=element('nav','c-slide-menu-bar');menuBar.setAttribute('aria-label','Presentation menus');
    const topToolbar=element('div','c-slide-top-toolbar');
    const editor=element('div','c-slide-workspace');
    const filmstrip=element('div','c-slide-filmstrip');filmstrip.setAttribute('aria-label','Slide thumbnails');
    const stage=element('div','c-presentation-stage');
    const canvas=element('div','c-slide-canvas');canvas.setAttribute('aria-label','Slide canvas');stage.append(canvas);
    const inspector=element('div','c-slide-inspector');const toolbar=element('div','c-slide-v10-toolbar c-slide-v14-toolbar');
    const controls=element('div','c-slide-v14-controls');
    const notes=element('textarea','c-slide-v14-notes');notes.placeholder='Add speaker notes…';notes.setAttribute('aria-label','Speaker notes');notes.rows=2;
    const importInput=element('input','c-slide-import-picker');importInput.type='file';importInput.accept='.json,application/json';importInput.hidden=true;
    importInput.setAttribute('aria-label','Import JSON presentation');
    const imageInput=element('input','c-slide-image-picker');imageInput.type='file';imageInput.accept='image/png,image/jpeg,image/webp';imageInput.hidden=true;imageInput.setAttribute('aria-label','Choose image for slide');
    const layerPanel=element('div','c-slide-layer-panel');layerPanel.setAttribute('aria-label','Slide object layers');
    const stageWrap=element('div','c-slide-stage-wrap');stageWrap.append(stage,inspector);
    const slides=[
      {title:'One workspace.',body:'Research, create and act from one place.',eyebrow:'INTRODUCTION',theme:'minimal',objects:[],notes:''},
      {title:'Less friction.',body:'A quieter workflow for meaningful work.',eyebrow:'DIRECTION',theme:'minimal',objects:[],notes:''},
      {title:'Made to move.',body:'Bring documents and actions into focus.',eyebrow:'OUTCOME',theme:'minimal',objects:[],notes:''}
    ];
    let current=0,editing=false,selected={field:'title',id:null},showNotes=false,zoom=100,showGrid=false,activeMenu=null;
    let draggedSlideIndex=null;
    let history=[],future=[],nextObjectId=1;
    const clone=()=>JSON.parse(JSON.stringify({slides,current}));
    function snapshot(){history.push(clone());if(history.length>80)history.shift();future=[];}
    function restore(state){slides.splice(0,slides.length,...state.slides);current=Math.max(0,Math.min(slides.length-1,state.current));render();}
    function undo(){if(!history.length)return;future.push(clone());restore(history.pop());}
    function redo(){if(!future.length)return;history.push(clone());restore(future.pop());}
    const tool=(label,icon,handler)=>{
      const btn=element('button','c-slide-tool');btn.type='button';
      btn.setAttribute('aria-label',label);btn.dataset.tooltip=label;
      btn.innerHTML=svg(icon);btn.addEventListener('click',handler);return btn;
    };
    const select=(label,options,css='c-slide-v10-select')=>{
      const sel=element('select',css);sel.setAttribute('aria-label',label);
      sel.dataset.tooltip=label;
      options.forEach(([value,display])=>{const o=element('option','',display);o.value=value;sel.append(o);});
      return sel;
    };
    const fontSize=select('Font size',[[12,'12'],[14,'14'],[16,'16'],[18,'18'],[20,'20'],[24,'24'],[28,'28'],[32,'32'],[40,'40'],[48,'48'],[56,'56'],[64,'64']]);
    const zoomSelect=select('Zoom',[['75','75%'],['90','90%'],['100','100%'],['110','110%'],['125','125%']],'c-slide-v10-select c-slide-v16-zoom');zoomSelect.value='100';
    const layoutSelect=select('Slide layout',[['title-body','Title and body'],['title','Title only'],['blank','Blank']],'c-slide-v10-select c-slide-v16-layout');
    const transitionSelect=select('Slide transition',[['none','None'],['fade','Fade'],['slide','Slide']],'c-slide-v10-select c-slide-v16-transition');
    const fontFamily=select('Font',[
      ['system-ui','System'],['Arial, sans-serif','Arial'],['Georgia, serif','Georgia'],['Verdana, sans-serif','Verdana'],
      ['Trebuchet MS, sans-serif','Trebuchet'],['Times New Roman, serif','Times New Roman']
    ],'c-slide-v10-select c-slide-v14-font');
    const theme=select('Slide theme',[['minimal','White'],['warm','Warm'],['cool','Blue'],['dark','Dark']]);
    const align=select('Alignment',[['left','Left'],['center','Centre'],['right','Right']]);
    const textColour=element('input','c-slide-v14-colour');textColour.type='color';textColour.value='#17171b';textColour.dataset.tooltip='Text colour';textColour.setAttribute('aria-label','Text colour');
    const backgroundColour=element('input','c-slide-v14-colour');backgroundColour.type='color';backgroundColour.value='#ffffff';backgroundColour.dataset.tooltip='Slide background';backgroundColour.setAttribute('aria-label','Slide background');
    function addSlide(){snapshot();slides.splice(current+1,0,{title:'New slide',body:'Select and edit the text.',eyebrow:'SECTION',theme:theme.value,objects:[],notes:''});current++;render();}
    function duplicateSlide(){snapshot();slides.splice(current+1,0,JSON.parse(JSON.stringify(slides[current])));current++;render();}
    function removeSlide(){if(slides.length<2)return;snapshot();slides.splice(current,1);current=Math.min(current,slides.length-1);render();}
    function moveSlide(dir){const to=current+dir;if(to<0||to>=slides.length)return;snapshot();[slides[to],slides[current]]=[slides[current],slides[to]];current=to;render();}
    function addObject(type){
      snapshot();const obj={id:nextObjectId++,type,x:27,y:37,w:type==='text'?46:type==='line'?40:28,h:type==='text'?14:type==='line'?2:25,
        color:type==='text'?'#222228':'#d5dbe8',text:type==='text'?'New text box':'',cells:type==='table'?Array(9).fill(''):undefined};
      slides[current].objects.push(obj);selected={field:'object',id:obj.id};render();
    }
    function moveObjectLayer(direction){
      if(selected.field!=='object')return;
      const objects=slides[current].objects,index=objects.findIndex(o=>o.id===selected.id);
      const target=index+direction;if(index<0||target<0||target>=objects.length)return;
      snapshot();[objects[index],objects[target]]=[objects[target],objects[index]];render();
    }
    function duplicateObject(){
      if(selected.field!=='object')return;
      const original=slides[current].objects.find(o=>o.id===selected.id);if(!original)return;
      snapshot();const next={...original,id:nextObjectId++,x:Math.min(90,original.x+4),y:Math.min(90,original.y+4)};
      slides[current].objects.push(next);selected={field:'object',id:next.id};render();
    }
    imageInput.addEventListener('change',()=>{
      const file=imageInput.files?.[0];imageInput.value='';
      if(!file)return;
      if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>3*1024*1024){window.alert('Use a PNG, JPEG or WebP image under 3 MB.');return;}
      const reader=new FileReader();reader.addEventListener('load',()=>{
        if(!card.isConnected)return;
        snapshot();const object={id:nextObjectId++,type:'image',src:String(reader.result),x:22,y:22,w:45,h:46,color:'#ffffff'};
        slides[current].objects.push(object);selected={field:'object',id:object.id};render();
      });reader.readAsDataURL(file);
    });
    function removeObject(){
      if(selected.field!=='object')return;
      snapshot();slides[current].objects=slides[current].objects.filter(o=>o.id!==selected.id);
      selected={field:'title',id:null};render();
    }
    function targetValue(prop,fallback){
      const slide=slides[current];if(selected.field==='object'){const obj=slide.objects.find(o=>o.id===selected.id);return obj?.[prop]??fallback;}
      const pre=selected.field==='body'?'body':'title';return slide[pre+prop[0].toUpperCase()+prop.slice(1)]??fallback;
    }
    function applySelected(prop,value){
      snapshot();const slide=slides[current];
      if(selected.field==='object'){
        const o=slide.objects.find(o=>o.id===selected.id);if(o)o[prop]=value;
      } else slide[selected.field+prop[0].toUpperCase()+prop.slice(1)]=value;
      render();
    }
    function selectElement(field,id=null){
      selected={field,id};layerPanel.querySelectorAll('.c-slide-layer-item').forEach(b=>b.classList.toggle('is-selected',field==='object'&&b.dataset.objectId===String(id)));
      canvas.querySelectorAll('.c-slide-selectable,.c-slide-object').forEach(el=>{
        el.classList.toggle('is-element-selected',(el.dataset.field===field)&&(field!=='object'||Number(el.dataset.objectId)===id)&&editing);
      });updateSelections();
    }
    function updateSelections(){
      const slide=slides[current];
      const isBody=selected.field==='body';
      fontSize.value=String(targetValue('size',selected.field==='title'?40:isBody?16:22));
      fontFamily.value=targetValue('font','system-ui');
      align.value=targetValue('align',slide.align||'left');
      textColour.value=targetValue('color','#17171b');
      theme.value=slide.theme||'minimal';backgroundColour.value=slide.bg||'#ffffff';
      layoutSelect.value=slide.layout||'title-body';transitionSelect.value=slide.transition||'none';
      zoomSelect.value=String(zoom);
    }
    function renderThumbnail(slide,index){
      const btn=element('button','c-slide-film-item c-slide-mini'+(index===current?' is-selected':''));btn.type='button';
      btn.setAttribute('aria-label','Open slide '+(index+1)+': '+slide.title);
      btn.draggable=editing;
      btn.addEventListener('dragstart',event=>{if(!editing)return;draggedSlideIndex=index;event.dataTransfer.effectAllowed='move';event.dataTransfer.setData('text/plain',String(index));btn.classList.add('is-dragging');});
      btn.addEventListener('dragend',()=>{draggedSlideIndex=null;btn.classList.remove('is-dragging');});
      btn.addEventListener('dragover',event=>{if(!editing||draggedSlideIndex===null)return;event.preventDefault();event.dataTransfer.dropEffect='move';});
      btn.addEventListener('drop',event=>{event.preventDefault();if(!editing||draggedSlideIndex===null||draggedSlideIndex===index)return;
        snapshot();const from=draggedSlideIndex;const moved=slides.splice(from,1)[0];slides.splice(index,0,moved);
        current=current===from?index:current>from&&current<=index?current-1:current<from&&current>=index?current+1:current;
        draggedSlideIndex=null;render();});
      const number=element('span','c-slide-mini-number',String(index+1));
      const miniature=element('span','c-slide-mini-frame');miniature.dataset.theme=slide.theme||'minimal';
      miniature.style.background=slide.bg||'';
      const eyebrow=element('span','c-slide-mini-eyebrow',slide.eyebrow||'');
      const title=element('span','c-slide-mini-title',slide.title||'Untitled');
      const body=element('span','c-slide-mini-body',slide.body||'');
      miniature.append(eyebrow,title,body);btn.append(number,miniature);
      btn.addEventListener('click',()=>{current=index;selected={field:'title',id:null};render();});
      return btn;
    }
    function render(){
      const slide=slides[current];canvas.replaceChildren();
      canvas.dataset.theme=slide.theme||'minimal';canvas.style.background=slide.bg||'';
      canvas.style.setProperty('--slide-preview-zoom',String(zoom/100));
      canvas.dataset.layout=slide.layout||'title-body';
      canvas.dataset.transition=slide.transition||'none';canvas.classList.toggle('c-slide-grid-visible',showGrid);
      const eyebrow=element('div','c-slide-eyebrow',slide.eyebrow||'');
      const title=element('div','c-slide-heading c-slide-selectable',slide.title||'');
      const body=element('div','c-slide-body c-slide-selectable',slide.body||'');
      for(const item of [title,body]){
        const field=item===title?'title':'body';item.dataset.field=field;
        item.contentEditable=String(editing);item.spellcheck=false;
        item.addEventListener('click',()=>selectElement(field));
        item.addEventListener('focus',()=>selectElement(field));
        item.addEventListener('input',()=>{
          slide[field]=item.innerText;
          const thumb=filmstrip.children[current]?.querySelector(field==='title'?'.c-slide-mini-title':'.c-slide-mini-body');
          if(thumb)thumb.textContent=slide[field];
        });
        const pre=field==='title'?'title':'body';
        item.style.fontSize=(slide[pre+'Size']||(field==='title'?40:16))+'px';
        item.style.fontFamily=slide[pre+'Font']||'system-ui';
        item.style.color=slide[pre+'Color']||'#17171b';
        item.style.textAlign=slide[pre+'Align']||slide.align||'left';
        item.style.fontWeight=slide[pre+'Bold']?'700':'400';
        item.style.fontStyle=slide[pre+'Italic']?'italic':'normal';
        item.style.textDecoration=slide[pre+'Underline']?'underline':'none';
        item.classList.toggle('is-element-selected',editing&&selected.field===field);
      }
      canvas.append(eyebrow,title,body);
      slide.objects.forEach(obj=>{
        const el=element('div','c-slide-object c-slide-object-'+obj.type);
        el.dataset.field='object';el.dataset.objectId=obj.id;
        Object.assign(el.style,{left:obj.x+'%',top:obj.y+'%',width:obj.w+'%',height:obj.h+'%',background:obj.type==='text'?'transparent':obj.color,color:obj.color});
        if(obj.type==='text'){el.textContent=obj.text;el.contentEditable=String(editing);el.spellcheck=false;
          el.style.fontFamily=obj.font||'system-ui';el.style.fontSize=(obj.size||17)+'px';
          el.style.fontWeight=obj.bold?'700':'400';el.style.fontStyle=obj.italic?'italic':'normal';
          el.style.textDecoration=obj.underline?'underline':'none';
          el.addEventListener('input',()=>{obj.text=el.innerText;});}
        else if(obj.type==='image'&&obj.src){const img=element('img','c-slide-object-image');img.src=obj.src;img.alt='Inserted slide image';img.draggable=false;el.append(img);}
        else if(obj.type==='table'){const tableGrid=element('div','c-slide-native-table');(obj.cells||Array(9).fill('')).forEach((value,index)=>{
          const cell=element('div','c-slide-native-cell',value);cell.contentEditable=String(editing);cell.spellcheck=false;
          cell.setAttribute('aria-label','Table cell '+(index+1));cell.addEventListener('input',()=>{obj.cells[index]=cell.innerText;});
          tableGrid.append(cell);});el.append(tableGrid);}
        el.classList.toggle('is-element-selected',editing&&selected.field==='object'&&selected.id===obj.id);
        el.addEventListener('click',()=>selectElement('object',obj.id));
        if(editing){
          const resize=element('span','c-slide-object-resize');
          resize.contentEditable='false';resize.setAttribute('aria-label','Resize slide object');
          resize.addEventListener('pointerdown',event=>{
            event.preventDefault();event.stopPropagation();resize.setPointerCapture(event.pointerId);
            const rect=canvas.getBoundingClientRect(),startX=event.clientX,startY=event.clientY,w=obj.w,h=obj.h;let moved=false;
            const move=e=>{if(!moved){snapshot();moved=true;}
              obj.w=Math.max(8,Math.min(100-obj.x,w+(e.clientX-startX)/rect.width*100));
              obj.h=Math.max(6,Math.min(100-obj.y,h+(e.clientY-startY)/rect.height*100));
              el.style.width=obj.w+'%';el.style.height=obj.h+'%';};
            const finish=()=>{resize.removeEventListener('pointermove',move);resize.removeEventListener('pointerup',finish);resize.removeEventListener('pointercancel',finish);};
            resize.addEventListener('pointermove',move);resize.addEventListener('pointerup',finish);resize.addEventListener('pointercancel',finish);
          });el.append(resize);
        }
        el.addEventListener('pointerdown',event=>{
          if(!editing||event.button!==0||event.target.isContentEditable)return;
          event.preventDefault();selectElement('object',obj.id);el.setPointerCapture(event.pointerId);
          const rect=canvas.getBoundingClientRect(),startX=event.clientX,startY=event.clientY,x=obj.x,y=obj.y;let moved=false;
          const move=e=>{if(!moved){snapshot();moved=true;}obj.x=Math.max(0,Math.min(100-obj.w,x+(e.clientX-startX)/rect.width*100));obj.y=Math.max(0,Math.min(100-obj.h,y+(e.clientY-startY)/rect.height*100));el.style.left=obj.x+'%';el.style.top=obj.y+'%';};
          const finish=()=>{el.removeEventListener('pointermove',move);el.removeEventListener('pointerup',finish);el.removeEventListener('pointercancel',finish);};
          el.addEventListener('pointermove',move);el.addEventListener('pointerup',finish);el.addEventListener('pointercancel',finish);
        });canvas.append(el);
      });
      canvas.append(element('span','c-slide-rule'),element('span','c-slide-num',String(current+1).padStart(2,'0')));
      layerPanel.replaceChildren();
      if(slide.objects.length){
        layerPanel.append(element('span','c-slide-layer-title','Objects'));
        [...slide.objects].reverse().forEach(obj=>{
          const row=element('button','c-slide-layer-item'+(selected.field==='object'&&selected.id===obj.id?' is-selected':''));row.type='button';row.dataset.objectId=String(obj.id);
          row.setAttribute('aria-label','Select '+obj.type+' object');row.dataset.tooltip='Select '+obj.type;
          row.append(element('span','c-slide-layer-dot'),element('span','c-slide-layer-name',obj.type==='text'?(obj.text||'Text box').slice(0,25):obj.type[0].toUpperCase()+obj.type.slice(1)));
          row.addEventListener('click',()=>selectElement('object',obj.id));layerPanel.append(row);
        });
      }
      filmstrip.replaceChildren(...slides.map(renderThumbnail));
      notes.value=slide.notes||'';updateSelections();
    }
    const toolbarGroup=(...els)=>{const group=element('span','c-slide-v14-group');
      els.forEach(control=>{if(control.matches('select,input')){const wrapper=element('span','c-slide-v14-toolwrap');
        wrapper.dataset.tooltip=control.getAttribute('aria-label')||control.dataset.tooltip||'Formatting';
        control.removeAttribute('data-tooltip');wrapper.append(control);group.append(wrapper);
      }else group.append(control);});return group;};
    // Four predictable toolbar zones. Insert/Arrange controls stay in white
    // popovers, never scattered as a wall of ungrouped icon buttons.
    const makeToolLabel=text=>element('span','c-slide-toolbar-section-label',text);
    const buildPopover=(label,icon,entries)=>{
      const group=element('div','c-slide-toolbar-popover');
      const trigger=element('button','c-slide-tool c-slide-toolbar-popover-trigger');
      trigger.type='button';trigger.setAttribute('aria-label',label);trigger.setAttribute('aria-expanded','false');
      trigger.dataset.tooltip=label;trigger.innerHTML=svg(icon)+'<span>'+label+'</span>'+svg('chevron');
      const panel=element('div','c-slide-toolbar-popover-panel');panel.setAttribute('role','group');
      panel.setAttribute('aria-label',label+' tools');
      entries.forEach(([title,iconName,fn])=>{
        const button=tool(title,iconName,()=>{fn();closeToolPopovers();});
        button.classList.add('c-slide-popover-action');
        button.append(element('span','c-slide-popover-label',title));panel.append(button);
      });
      const closeToolPopovers=()=>topToolbar.querySelectorAll('.c-slide-toolbar-popover').forEach(pop=>{
        pop.classList.remove('is-open');pop.querySelector('.c-slide-toolbar-popover-trigger')?.setAttribute('aria-expanded','false');
      });
      trigger.addEventListener('click',event=>{event.stopPropagation();const opening=!group.classList.contains('is-open');closeToolPopovers();group.classList.toggle('is-open',opening);trigger.setAttribute('aria-expanded',String(opening));});
      group.append(trigger,panel);return group;
    };
    const slidesGroup=element('div','c-slide-toolbar-zone');slidesGroup.append(makeToolLabel('SLIDES'),
      toolbarGroup(tool('New slide','slides',addSlide),tool('Undo','replay',undo),tool('Redo','replay',redo),zoomSelect,layoutSelect));
    const insertGroup=element('div','c-slide-toolbar-zone');insertGroup.append(makeToolLabel('INSERT'),
      toolbarGroup(tool('Insert text box','type',()=>addObject('text')),tool('Insert image','image',()=>imageInput.click()),
      buildPopover('Shapes & tables','box',[
        ['Insert rectangle','box',()=>addObject('rect')],['Insert ellipse','circle',()=>addObject('ellipse')],
        ['Insert line','line',()=>addObject('line')],['Insert table','table',()=>addObject('table')]
      ])));
    const textGroup=element('div','c-slide-toolbar-zone');textGroup.append(makeToolLabel('TEXT'),
      toolbarGroup(fontFamily,fontSize,align,tool('Bold','bold',()=>applySelected('bold',!targetValue('bold',false))),
      tool('Italic','italic',()=>applySelected('italic',!targetValue('italic',false))),
      tool('Underline','underline',()=>applySelected('underline',!targetValue('underline',false))),textColour));
    const arrangeGroup=element('div','c-slide-toolbar-zone');arrangeGroup.append(makeToolLabel('ARRANGE'),
      toolbarGroup(buildPopover('Objects','layers',[
        ['Duplicate object','copy',duplicateObject],['Bring object forward','layers',()=>moveObjectLayer(1)],
        ['Send object backward','layers',()=>moveObjectLayer(-1)],['Remove selected object','x',removeObject],
        ['Duplicate slide','copy',duplicateSlide],['Delete slide','file',removeSlide],
        ['Move up','chevron',()=>moveSlide(-1)],['Move down','caret',()=>moveSlide(1)]
      ]),theme,backgroundColour,transitionSelect,
      tool('Speaker notes','file',()=>{showNotes=!showNotes;notes.classList.toggle('is-visible',showNotes);})));
    toolbar.append(slidesGroup,insertGroup,textGroup,arrangeGroup);
    document.addEventListener('pointerdown',event=>{if(card.isConnected&&!topToolbar.contains(event.target))topToolbar.querySelectorAll('.c-slide-toolbar-popover').forEach(pop=>{pop.classList.remove('is-open');pop.querySelector('.c-slide-toolbar-popover-trigger')?.setAttribute('aria-expanded','false');});});
    toolbar.addEventListener('mousedown',event=>{if(event.target.closest('button'))event.preventDefault();});
    fontSize.addEventListener('change',()=>applySelected('size',Number(fontSize.value)));
    zoomSelect.addEventListener('change',()=>{zoom=Number(zoomSelect.value);canvas.style.setProperty('--slide-preview-zoom',String(zoom/100));});
    layoutSelect.addEventListener('change',()=>{snapshot();slides[current].layout=layoutSelect.value;render();});
    transitionSelect.addEventListener('change',()=>{snapshot();slides[current].transition=transitionSelect.value;render();});
    fontFamily.addEventListener('change',()=>applySelected('font',fontFamily.value));
    align.addEventListener('change',()=>applySelected('align',align.value));
    textColour.addEventListener('input',()=>applySelected('color',textColour.value));
    backgroundColour.addEventListener('change',()=>{snapshot();slides[current].bg=backgroundColour.value;render();});
    backgroundColour.addEventListener('input',()=>{canvas.style.background=backgroundColour.value;});
    theme.addEventListener('change',()=>{snapshot();slides[current].theme=theme.value;render();});
    notes.addEventListener('input',()=>{slides[current].notes=notes.value;});
    // Google Slides-inspired command row. Every available command is backed by
    // the fixture's actual slide model; absent enterprise features are not faked.
    const safeFilename=()=>filename.value.trim().replace(/[^a-z0-9_\- ]/gi,'').replace(/\s+/g,'-').slice(0,60)||'Clyra-presentation';
    const doExportJSON=()=>{
      const blob=new Blob([JSON.stringify(slides,null,2)],{type:'application/json'});
      const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;
      link.download=safeFilename()+'.json';link.click();
      setTimeout(()=>URL.revokeObjectURL(url),1000);
    };
    const downloadBlob=(blob,extension)=>{
      const url=URL.createObjectURL(blob),a=document.createElement('a');
      a.href=url;a.download=safeFilename()+extension;a.click();
      setTimeout(()=>URL.revokeObjectURL(url),1200);
    };
    const doExportPNG=async()=>{
      const slide=slides[current],out=document.createElement('canvas');out.width=1280;out.height=720;
      const g=out.getContext('2d');g.fillStyle=slide.bg|| (slide.theme==='dark'?'#282b33':'#ffffff');g.fillRect(0,0,1280,720);
      if((slide.layout||'title-body')!=='blank'){
        g.fillStyle=slide.theme==='dark'?'#e7e7eb':'#777981';g.font='24px system-ui';g.fillText(slide.eyebrow||'',90,145);
        g.fillStyle=slide.titleColor|| (slide.theme==='dark'?'#ffffff':'#17171b');
        g.font='600 '+(slide.titleSize||55)+'px system-ui';g.fillText(slide.title||'',90,292,1100);
        if((slide.layout||'title-body')!=='title'){
          g.fillStyle=slide.bodyColor|| (slide.theme==='dark'?'#d5d5de':'#555660');
          g.font='30px system-ui';g.fillText(slide.body||'',94,360,1090);
        }
      }
      for(const obj of slide.objects){
        const x=obj.x*12.8,y=obj.y*7.2,w=obj.w*12.8,h=obj.h*7.2;
        if(obj.type==='image'&&obj.src){
          try{const pic=new Image();pic.src=obj.src;await pic.decode();g.drawImage(pic,x,y,w,h);}catch{}
        } else if(obj.type==='rect'){g.fillStyle=obj.color||'#d5dbe8';g.fillRect(x,y,w,h);}
        else if(obj.type==='ellipse'){g.fillStyle=obj.color||'#d5dbe8';g.beginPath();g.ellipse(x+w/2,y+h/2,w/2,h/2,0,0,Math.PI*2);g.fill();}
        else if(obj.type==='line'){g.strokeStyle=obj.color||'#555';g.lineWidth=4;g.beginPath();g.moveTo(x,y+h);g.lineTo(x+w,y);g.stroke();}
        else if(obj.type==='text'){g.fillStyle=obj.color||'#222';g.font='28px system-ui';g.fillText(obj.text||'',x,y+30,w);}
        else if(obj.type==='table'){const cells=obj.cells||[];g.strokeStyle='#9296a2';g.font='16px system-ui';
          for(let i=0;i<3;i++)for(let j=0;j<3;j++){const xx=x+j*w/3,yy=y+i*h/3;g.strokeRect(xx,yy,w/3,h/3);g.fillStyle='#30333b';g.fillText(cells[i*3+j]||'',xx+8,yy+24,w/3-12);}
        }
      }
      out.toBlob(blob=>{if(blob)downloadBlob(blob,'.png');},'image/png');
    };
    importInput.addEventListener('change',()=>{
      const file=importInput.files?.[0];importInput.value='';
      if(!file)return;if(file.size>2*1024*1024){window.alert('Choose a JSON presentation below 2 MB.');return;}
      const reader=new FileReader();reader.addEventListener('load',()=>{
        try{const parsed=JSON.parse(String(reader.result));
          if(!Array.isArray(parsed)||parsed.length<1||parsed.length>80||parsed.some(sl=>!sl||typeof sl.title!=='string'||!Array.isArray(sl.objects)))throw Error('Invalid slides');
          snapshot();slides.splice(0,slides.length,...parsed.map(sl=>({
            title:sl.title.slice(0,300),body:String(sl.body||'').slice(0,3000),
            eyebrow:String(sl.eyebrow||'').slice(0,80),theme:['warm','cool','dark','minimal'].includes(sl.theme)?sl.theme:'minimal',
            bg:sl.bg||'',layout:sl.layout||'title-body',transition:sl.transition||'none',
            objects:sl.objects.slice(0,90).filter(o=>o&&typeof o.type==='string').map(o=>({...o,id:nextObjectId++})),
            notes:String(sl.notes||'').slice(0,5000)
          })));current=0;selected={field:'title',id:null};render();
        }catch{window.alert('Could not import this presentation JSON.');}
      });reader.readAsText(file);
    });
    const setLayout=name=>{snapshot();slides[current].layout=name;render();};
    const setTransition=name=>{snapshot();slides[current].transition=name;render();};
    const adjustZoom=n=>{zoom=n;canvas.style.setProperty('--slide-preview-zoom',String(n/100));zoomSelect.value=String(n);};
    const alignObject=axis=>{
      if(selected.field!=='object')return;const obj=slides[current].objects.find(o=>o.id===selected.id);if(!obj)return;
      snapshot();if(axis==='horizontal')obj.x=(100-obj.w)/2;else obj.y=(100-obj.h)/2;render();
    };
    const toggleNotes=()=>{showNotes=!showNotes;notes.classList.toggle('is-visible',showNotes);};
    const toggleGrid=()=>{showGrid=!showGrid;canvas.classList.toggle('c-slide-grid-visible',showGrid);};
    const help=element('div','c-slide-help-panel');help.hidden=true;
    help.innerHTML='<strong>Keyboard shortcuts</strong><p>⌘/Ctrl+M New slide · ⌘/Ctrl+Z Undo · ⌘/Ctrl+D Duplicate object · Delete Remove selected · Esc Exit full screen</p>';
    const toggleHelp=()=>{help.hidden=!help.hidden;};
    const menuDefinitions=[
      ['File',[
        ['New presentation',()=>{snapshot();slides.splice(0,slides.length,{title:'Untitled slide',body:'',eyebrow:'',theme:'minimal',objects:[],notes:''});current=0;render();}],
        ['Open JSON…',()=>importInput.click()],['Download JSON',doExportJSON],['Download current slide PNG',doExportPNG]
      ]],
      ['Edit',[
        ['Undo',undo],['Redo',redo],['Duplicate slide',duplicateSlide],['Duplicate selected object',duplicateObject],
        ['Delete selected object',removeObject],['Delete slide',removeSlide]
      ]],
      ['View',[
        ['Zoom 75%',()=>adjustZoom(75)],['Zoom 100%',()=>adjustZoom(100)],['Zoom 125%',()=>adjustZoom(125)],
        ['Show grid',toggleGrid],['Speaker notes',toggleNotes],['Full screen',()=>setFullscreen(true)]
      ]],
      ['Insert',[
        ['Text box',()=>addObject('text')],['Image…',()=>imageInput.click()],['Rectangle',()=>addObject('rect')],
        ['Ellipse',()=>addObject('ellipse')],['Line',()=>addObject('line')],['3 × 3 table',()=>addObject('table')]
      ]],
      ['Slide',[
        ['New slide',addSlide],['Duplicate slide',duplicateSlide],['Delete slide',removeSlide],
        ['Move slide up',()=>moveSlide(-1)],['Move slide down',()=>moveSlide(1)],
        ['Title and body layout',()=>setLayout('title-body')],['Title only layout',()=>setLayout('title')],
        ['Blank layout',()=>setLayout('blank')],['Fade transition',()=>setTransition('fade')],
        ['Slide transition',()=>setTransition('slide')],['No transition',()=>setTransition('none')]
      ]],
      ['Format',[
        ['Bold',()=>applySelected('bold',!targetValue('bold',false))],['Italic',()=>applySelected('italic',!targetValue('italic',false))],['Underline',()=>applySelected('underline',!targetValue('underline',false))],
        ['Align left',()=>applySelected('align','left')],['Align centre',()=>applySelected('align','center')],
        ['Align right',()=>applySelected('align','right')],['Text colour…',()=>textColour.click()],
        ['Slide background…',()=>backgroundColour.click()]
      ]],
      ['Arrange',[
        ['Bring forward',()=>moveObjectLayer(1)],['Send backward',()=>moveObjectLayer(-1)],
        ['Duplicate object',duplicateObject],['Delete object',removeObject],
        ['Centre object horizontally',()=>alignObject('horizontal')],['Centre object vertically',()=>alignObject('vertical')]
      ]],
      ['Tools',[['Toggle guides',toggleGrid],['Speaker notes',toggleNotes],['Keyboard shortcuts',toggleHelp]]],
      ['Help',[['Keyboard shortcuts',toggleHelp]]]
    ];
    function closeMenu(){activeMenu=null;menuBar.querySelectorAll('.c-slide-menu-item').forEach(item=>{
      item.classList.remove('is-open');item.querySelector('button')?.setAttribute('aria-expanded','false');});
    }
    for(const [menuLabel,entries] of menuDefinitions){
      const wrap=element('div','c-slide-menu-item');
      const button=element('button','c-slide-menu-trigger',menuLabel);button.type='button';
      button.setAttribute('aria-haspopup','menu');button.setAttribute('aria-expanded','false');
      button.setAttribute('aria-label',menuLabel+' menu');
      const panel=element('div','c-slide-menu-options');panel.setAttribute('role','menu');panel.setAttribute('aria-label',menuLabel+' commands');
      for(const [text,action] of entries){
        const item=element('button','c-slide-menu-option',text);item.type='button';item.setAttribute('role','menuitem');
        item.addEventListener('click',()=>{closeMenu();action();});panel.append(item);
      }
      button.addEventListener('click',event=>{event.stopPropagation();const open=activeMenu===menuLabel;closeMenu();if(!open){activeMenu=menuLabel;wrap.classList.add('is-open');button.setAttribute('aria-expanded','true');}});
      wrap.append(button,panel);menuBar.append(wrap);
    }
    menuBar.addEventListener('keydown',event=>{
      const buttons=[...menuBar.querySelectorAll('.c-slide-menu-trigger')],on=buttons.indexOf(event.target);
      if(on>=0&&(event.key==='ArrowRight'||event.key==='ArrowLeft')){
        event.preventDefault();buttons[(on+(event.key==='ArrowRight'?1:buttons.length-1))%buttons.length].focus();
      }else if(on>=0&&event.key==='ArrowDown'){
        event.preventDefault();if(event.target.getAttribute('aria-expanded')!=='true')event.target.click();
        event.target.nextElementSibling?.querySelector('.c-slide-menu-option')?.focus();
      }else if(event.target.classList.contains('c-slide-menu-option')&&(event.key==='ArrowDown'||event.key==='ArrowUp')){
        event.preventDefault();const options=[...event.target.parentElement.querySelectorAll('.c-slide-menu-option')];
        const index=options.indexOf(event.target);options[(index+(event.key==='ArrowDown'?1:options.length-1))%options.length]?.focus();
      }
    });
    document.addEventListener('pointerdown',event=>{if(card.isConnected&&!menuBar.contains(event.target))closeMenu();});
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&card.isConnected){closeMenu();help.hidden=true;}});
    filename.addEventListener('input',()=>{saved.textContent='Local draft';});

    inspector.append(element('p','c-slide-instructions','Select a slide, edit text, insert shapes or add speaker notes.'));
    inspector.append(imageInput,importInput,layerPanel,notes,help);
    topToolbar.append(toolbar);
    editor.append(filmstrip,stageWrap);stageWrap.append(inspector);card.append(top,menuBar,topToolbar,editor);
    function setEditing(next){editing=next;closeMenu();card.classList.toggle('is-slide-editing',editing);
      editBtn.setAttribute('aria-pressed',String(editing));editBtn.querySelector('span').textContent=editing?'Done':'Edit';
      if(next)setFullscreen(true);else if(card.classList.contains('is-slide-fullscreen'))setFullscreen(false);
      render();}
    editBtn.addEventListener('click',()=>setEditing(!editing));
    const setFullscreen=next=>{
      card.classList.toggle('is-slide-fullscreen',next);document.body.classList.toggle('c-slide-fullscreen-active',next);
      fullBtn.innerHTML=next?svg('x')+'<span>Close</span>':svg('expand')+'<span>Full screen</span>';
      fullBtn.setAttribute('aria-label',next?'Close full screen':'Full screen');
      fullBtn.dataset.tooltip=next?'Close editor':'Full screen';
      if(!next&&editing){editing=false;card.classList.remove('is-slide-editing');editBtn.setAttribute('aria-pressed','false');editBtn.querySelector('span').textContent='Edit';}
      render();
    };
    fullBtn.addEventListener('click',()=>setFullscreen(!card.classList.contains('is-slide-fullscreen')));
    window.addEventListener('keydown',event=>{
      if(event.key==='Escape'&&card.classList.contains('is-slide-fullscreen'))setFullscreen(false);
      if(!card.isConnected||!editing)return;
      // Let the native contenteditable engine undo/redo the user's text edits.
      if(event.target?.isContentEditable&&(event.metaKey||event.ctrlKey)&&['z','y'].includes(event.key.toLowerCase()))return;
      if((event.key==='Delete'||event.key==='Backspace')&&selected.field==='object'&&!event.target?.isContentEditable&&event.target?.tagName!=='INPUT'&&event.target?.tagName!=='TEXTAREA'){event.preventDefault();removeObject();}
      if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='d'&&selected.field==='object'&&!event.target?.isContentEditable){event.preventDefault();duplicateObject();}
      if((event.metaKey||event.ctrlKey)&&!event.target?.isContentEditable&&['b','i','u'].includes(event.key.toLowerCase())){
        event.preventDefault();const key={b:'bold',i:'italic',u:'underline'}[event.key.toLowerCase()];
        applySelected(key,!targetValue(key,false));
      }
      if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='m'){event.preventDefault();addSlide();}
      if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='z'&&!event.shiftKey){event.preventDefault();undo();}
      if((event.metaKey||event.ctrlKey)&&((event.key.toLowerCase()==='y')||(event.key.toLowerCase()==='z'&&event.shiftKey))){event.preventDefault();redo();}
    });
    render();paint(()=>assistant.append(card));
    return {card,selectSlide:index=>{current=Math.max(0,Math.min(slides.length-1,index));render();}};
  }
  /** Light dynamic-island music presentation. A playback event, not a playlist.
   * Real integrations provide their own track metadata and playback state.
   * The disclosure and controls are visual only in this demo. */
  function createMusicCard(){
    // Demo transport: interaction is real inside this card, but no external
    // provider/audio stream is invented. Production must bind to a provider's
    // authenticated player and show actual cover art and queue metadata.
    const card=element('section','c-music-island c-island-v10 c-music-v19');
    card.setAttribute('aria-label','Music player demo');
    const tracks=[
      {title:'Quiet Momentum',artist:'Studio North',seconds:192,tone:['#5c7ca0','#b8d1d4','#d3e6e2']},
      {title:'Afterglow',artist:'Studio North',seconds:205,tone:['#ad7f81','#f5beaa','#f7e7d4']},
      {title:'Soft Focus',artist:'Studio North',seconds:178,tone:['#807eab','#d4c7ec','#e4deed']}
    ];
    const art=element('span','c-island-art c-music-art');art.setAttribute('aria-label','Album cover');
    const info=element('div','c-island-info');
    const title=element('span','c-island-track',tracks[0].title),artist=element('span','c-island-artist',tracks[0].artist);info.append(title,artist);
    const queueToggle=element('button','c-music-queue-toggle');queueToggle.type='button';
    queueToggle.setAttribute('aria-label','Show song queue');queueToggle.setAttribute('aria-expanded','false');
    queueToggle.innerHTML=svg('chevron');
    const previous=element('button','c-island-control c-island-skip c-music-skip-back');
    previous.type='button';previous.setAttribute('aria-label','Previous track or restart; hold to rewind');previous.innerHTML=svg('skipBack');
    const play=element('button','c-island-control c-island-toggle');play.type='button';play.setAttribute('aria-label','Play music');play.innerHTML=svg('play');
    const next=element('button','c-island-control c-island-skip c-music-skip-next');
    next.type='button';next.setAttribute('aria-label','Next track; hold to fast forward');next.innerHTML=svg('skipNext');
    const transport=element('div','c-island-playback-controls');transport.append(previous,play,next);
    const scrub=element('input','c-island-scrubber');scrub.type='range';scrub.min='0';scrub.max='192';scrub.value='42';scrub.setAttribute('aria-label','Seek song playback');
    const elapsed=element('span','c-island-elapsed','0:42'),duration=element('span','c-island-duration','3:12');
    const times=element('div','c-island-time');times.append(elapsed,duration);
    const header=element('div','c-island-body');header.append(art,info,queueToggle,transport);
    const queueClip=element('div','c-music-queue-clip');queueClip.setAttribute('aria-hidden','true');queueClip.inert=true;
    const queueInner=element('div','c-music-queue-inner');queueInner.append(element('div','c-music-queue-label','Up next'));
    const queueList=element('div','c-music-queue-list');queueInner.append(queueList);queueClip.append(queueInner);
    const status=element('span','c-music-seek-status');status.setAttribute('aria-live','polite');
    card.append(header,scrub,times,queueClip,status);
    let index=0,seconds=42,playing=false,queueOpen=false,lastQueueIndex=-1;
    const format=n=>Math.floor(n/60)+':'+String(n%60).padStart(2,'0');
    const artwork=(i)=>{
      const [a,b,c]=tracks[i].tone;
      return '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Abstract cover art for '+tracks[i].title+'">'
        +'<defs><linearGradient id="music-art-'+i+'" x1="0" y1="0" x2="1" y2="1"><stop stop-color="'+a+'"/><stop offset=".6" stop-color="'+b+'"/><stop offset="1" stop-color="'+c+'"/></linearGradient></defs>'
        +'<rect width="56" height="56" rx="12" fill="url(#music-art-'+i+')"/>'
        +'<circle cx="39" cy="14" r="15" fill="#fff" opacity=".22"/><path d="M-8 42Q18 10 59 31" fill="none" stroke="#fff" stroke-width="7" stroke-opacity=".45"/>'
        +'<path d="M-8 55Q20 22 60 45" fill="none" stroke="#fff" stroke-width="4" stroke-opacity=".33"/></svg>';
    };
    const chooseTrack=i=>{index=(i+tracks.length)%tracks.length;seconds=0;update();};
    function update(){
      const track=tracks[index];title.textContent=track.title;artist.textContent=track.artist;
      art.innerHTML=artwork(index);art.setAttribute('aria-label','Cover art for '+track.title);
      play.innerHTML=svg(playing?'pause':'play');play.setAttribute('aria-label',playing?'Pause music':'Play music');
      card.classList.toggle('is-playing',playing);
      scrub.max=String(track.seconds);scrub.value=String(seconds);
      scrub.style.setProperty('--progress',(seconds/track.seconds*100)+'%');
      elapsed.textContent=format(seconds);duration.textContent=format(track.seconds);
      if(lastQueueIndex!==index){renderQueue();lastQueueIndex=index;}
    }
    function renderQueue(){
      queueList.replaceChildren();
      tracks.forEach((track,i)=>{
        const option=element('button','c-music-queue-item'+(i===index?' is-current':''));option.type='button';
        option.setAttribute('aria-label','Play '+track.title+' by '+track.artist);
        const cover=element('span','c-music-queue-art');cover.innerHTML=artwork(i);
        const name=element('span','c-music-queue-copy');name.append(element('span','c-music-queue-title',track.title),
          element('span','c-music-queue-artist',track.artist));
        option.append(cover,name,element('span','c-music-queue-duration',format(track.seconds)));
        option.addEventListener('click',()=>{chooseTrack(i);playing=true;update();});
        queueList.append(option);
      });
    }
    function setQueue(open){
      queueOpen=open;card.classList.toggle('is-queue-open',open);queueToggle.setAttribute('aria-expanded',String(open));
      queueToggle.setAttribute('aria-label',open?'Hide song queue':'Show song queue');
      queueClip.setAttribute('aria-hidden',String(!open));queueClip.inert=!open;
    }
    queueToggle.addEventListener('click',()=>setQueue(!queueOpen));
    play.addEventListener('click',()=>{playing=!playing;update();});
    scrub.addEventListener('input',()=>{seconds=Number(scrub.value);update();});
    function wireSeek(button,direction){
      let arm=null,interval=null,held=false;
      const stop=()=>{clearTimeout(arm);clearInterval(interval);arm=null;interval=null;status.textContent='';};
      button.addEventListener('pointerdown',event=>{
        if(event.button!==0)return;stop();held=false;
        arm=setTimeout(()=>{
          held=true;status.textContent=direction<0?'Rewinding':'Fast-forwarding';
          // Deliberately modest incremental scanning rather than jumping tracks.
          interval=setInterval(()=>{
            const max=tracks[index].seconds;
            seconds=Math.max(0,Math.min(max,seconds+1));
            if(direction<0)seconds=Math.max(0,seconds-2);
            if(direction>0&&seconds>=max){chooseTrack(index+1);}
            update();
          },180);
        },380);
      });
      button.addEventListener('pointerup',stop);
      button.addEventListener('pointercancel',()=>{stop();held=false;});
      button.addEventListener('pointerleave',()=>{if(arm||interval){stop();held=false;}});
      button.addEventListener('click',()=>{
        if(held){held=false;return;}
        if(direction<0){if(seconds>3){seconds=0;update();}else chooseTrack(index-1);}
        else chooseTrack(index+1);
      });
      // Press-and-hold is only implemented in this local UI; real providers
      // should commit a seek when released, avoiding tight external API loops.
    }
    wireSeek(previous,-1);wireSeek(next,1);
    const timer=setInterval(()=>{
      if(!card.isConnected){clearInterval(timer);return;}
      if(!playing)return;seconds++;
      if(seconds>=tracks[index].seconds){chooseTrack(index+1);}else update();
    },1000);
    function setPlaying(i,on){if(Number.isInteger(i)&&i>=0&&i<tracks.length)index=i;playing=Boolean(on);update();}
    update();paint(()=>assistant.append(card));return {card,setPlaying,chooseTrack,setQueue};
  }
  function createCommandView(command){
    const unit=element('div','c-command-unit c-command-v11');
    const header=element('button','c-command-head');header.type='button';header.setAttribute('aria-expanded','true');
    header.innerHTML='<span class="c-action-icon">'+svg('terminal')+'</span><span class="c-active-shimmer c-command-label">Running command</span>';
    const commandText=element('code','c-command-text',command);header.append(commandText);
    header.insertAdjacentHTML('beforeend',svg('chevron','c-chevron'));
    header.setAttribute('aria-label','Command: '+command);
    const shell=element('div','c-command-shell is-open');const clip=element('div','c-command-clip');
    const terminal=element('div','c-terminal c-terminal-v11');
    const bar=element('div','c-terminal-bar');bar.append(element('span','c-terminal-bar-label','Terminal output'));
    const copy=element('button','c-terminal-copy');copy.type='button';copy.setAttribute('aria-label','Copy terminal output');copy.dataset.tooltip='Copy output';copy.innerHTML=svg('copy');
    bar.append(copy);terminal.append(bar,element('div','c-terminal-command','$ '+command));
    const output=element('div','c-terminal-output');output.setAttribute('aria-live','polite');terminal.append(output);
    copy.addEventListener('click',async()=>{const ok=await writeClipboard('$ '+command+'\n'+output.innerText);if(ok){copy.innerHTML=svg('check');setTimeout(()=>copy.innerHTML=svg('copy'),1000);}});
    clip.append(terminal);shell.append(clip);unit.append(header,shell);
    header.addEventListener('click',()=>{const on=header.getAttribute('aria-expanded')!=='true';header.setAttribute('aria-expanded',String(on));shell.classList.toggle('is-open',on);});
    paint(()=>assistant.append(unit));
    return {
      line:txt=>paint(()=>{const line=element('div','c-terminal-line');line.append(element('span','c-terminal-prompt','›'),document.createTextNode(txt));output.append(line);}),
      finish:()=>{header.querySelector('.c-command-label').classList.remove('c-active-shimmer');updateLabel(header.querySelector('.c-command-label'),'Ran command');header.setAttribute('aria-expanded','false');shell.classList.remove('is-open');}
    };
  }
  /** Demonstration code block. A host must mount its existing code-block renderer instead.
   * The Run control intentionally SIMULATES output; it does not evaluate untrusted code. */
  /**
   * Global weather + map mini-app. All data is fetched live, never hard-coded.
   * Weather: Open-Meteo. City search: Open-Meteo geocoding. Map: OpenStreetMap
   * official interactive embed, with visible attribution. No access tokens.
   * These are DEMO workflows; production Clyra must honour providers' terms,
   * geolocation consent, per-user rate limiting and configurable tile services.
   */
  function addWeatherAndMapCards(){
    const weather=element('section','c-weather-card c-geo-card');
    weather.setAttribute('aria-label','Live weather');
    const header=element('div','c-geo-header');
    const heading=element('div','c-geo-heading');heading.innerHTML=svg('globe')+'<span>Weather</span>';
    const locate=element('button','c-geo-small-button');locate.type='button';locate.textContent='Use my location';
    locate.setAttribute('aria-label','Request current location permission');
    header.append(heading,locate);
    const caption=element('div','c-geo-place','Choose a location to view current conditions');
    const condition=element('div','c-weather-main');
    const temperature=element('div','c-weather-temperature','—°');
    const description=element('div','c-weather-description','Live data appears after a location is chosen');
    condition.append(temperature,description);
    const metrics=element('div','c-weather-metrics');
    const days=element('div','c-weather-days');
    const search=element('form','c-geo-search');search.setAttribute('aria-label','Search location');
    const searchInput=element('input','c-geo-search-input');searchInput.type='search';searchInput.placeholder='Search a city worldwide';searchInput.setAttribute('aria-label','City or region');searchInput.autocomplete='off';
    const searchButton=element('button','c-geo-small-button','Search');searchButton.type='submit';
    search.append(searchInput,searchButton);
    const choices=element('div','c-geo-choices');choices.hidden=true;
    const info=element('div','c-geo-status');info.setAttribute('aria-live','polite');
    const source=element('div','c-geo-credit');
    source.innerHTML='Weather by <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">Open-Meteo</a> · Place search by Open-Meteo/GeoNames';
    weather.append(header,caption,condition,metrics,days,search,choices,info,source);

    const map=element('section','c-location-card c-geo-card');
    map.setAttribute('aria-label','Interactive location map');
    const mapTop=element('div','c-geo-header');
    const mapHeading=element('div','c-geo-heading');mapHeading.innerHTML=svg('map')+'<span>Map</span>';
    const mapExpand=element('button','c-geo-small-button');mapExpand.type='button';mapExpand.innerHTML=svg('expand')+'<span>Expand map</span>';mapExpand.setAttribute('aria-label','Expand map');
    mapTop.append(mapHeading,mapExpand);
    const mapLabel=element('p','c-location-subtitle','Select a place above to load the interactive map.');
    const mapFrameWrap=element('div','c-location-frame');
    const mapEmpty=element('div','c-location-empty');mapEmpty.innerHTML=svg('map')+'<span>Map available after selecting a location</span>';
    const frame=element('iframe','c-location-iframe');frame.title='Interactive OpenStreetMap';
    frame.loading='lazy';frame.referrerPolicy='strict-origin-when-cross-origin';frame.hidden=true;
    mapFrameWrap.append(frame,mapEmpty);
    const mapControls=element('div','c-location-controls');
    const zoomIn=element('button','c-geo-round-button');zoomIn.type='button';zoomIn.setAttribute('aria-label','Zoom in');zoomIn.textContent='+';
    const zoomOut=element('button','c-geo-round-button');zoomOut.type='button';zoomOut.setAttribute('aria-label','Zoom out');zoomOut.textContent='−';
    mapControls.append(zoomIn,zoomOut);mapFrameWrap.append(mapControls);
    const mapFooter=element('div','c-location-footer');
    const attribution=element('a','c-location-attribution','© OpenStreetMap contributors');
    attribution.href='https://www.openstreetmap.org/copyright';attribution.target='_blank';attribution.rel='noopener noreferrer';
    const openMap=element('a','c-geo-open-map','Open in OpenStreetMap');openMap.href='https://www.openstreetmap.org';openMap.target='_blank';openMap.rel='noopener noreferrer';
    mapFooter.append(attribution,openMap);map.append(mapTop,mapLabel,mapFrameWrap,mapFooter);

    // A responsive map search bar and details sheet appear only full screen.
    const fullTools=element('div','c-location-full-tools');
    const mapSearch=element('form','c-geo-search c-location-search');mapSearch.setAttribute('aria-label','Find city on map');
    const mapInput=element('input','c-geo-search-input');mapInput.placeholder='Find a city or region';mapInput.setAttribute('aria-label','Map place search');
    const mapSubmit=element('button','c-geo-small-button','Search');mapSubmit.type='submit';mapSearch.append(mapInput,mapSubmit);
    const mapChoices=element('div','c-geo-choices c-map-choices');mapChoices.hidden=true;
    const mapDetails=element('div','c-location-place-sheet');
    const mapTitle=element('strong','c-location-place-title','No location selected');
    const mapSub=element('span','c-location-place-caption','Search a city or use current location');
    mapDetails.append(mapTitle,mapSub);
    fullTools.append(mapSearch,mapChoices);map.append(fullTools,mapDetails);

    const state={place:null,zoom:0.025,epoch:0,searchEpoch:0};
    const weatherLabels=[
      [0,'Clear sky','sun'],[1,'Mostly clear','sun'],[2,'Partly cloudy','cloud'],[3,'Overcast','cloud'],
      [45,'Fog','cloud'],[48,'Freezing fog','cloud'],[51,'Drizzle','rain'],[53,'Drizzle','rain'],[55,'Drizzle','rain'],
      [61,'Rain','rain'],[63,'Rain','rain'],[65,'Heavy rain','rain'],[71,'Snow','snow'],[73,'Snow','snow'],[75,'Snow','snow'],
      [80,'Rain showers','rain'],[81,'Rain showers','rain'],[82,'Heavy showers','rain'],
      [95,'Thunderstorm','storm'],[96,'Thunderstorm','storm'],[99,'Thunderstorm','storm']
    ];
    const conditionFor=code=>weatherLabels.find(([n])=>n===code)?.slice(1)||['Weather conditions','cloud'];
    const requestJSON=async url=>{const response=await fetch(url,{headers:{Accept:'application/json'}});
      if(!response.ok)throw Error('Service returned '+response.status);
      return response.json();
    };
    const formatPlace=p=>[p.name,p.admin1,p.country].filter(Boolean).filter((v,i,a)=>a.indexOf(v)===i).join(', ');
    function mapURL(place){
      const lat=place.latitude,lon=place.longitude,d=state.zoom;
      const bbox=[lon-d,lat-d*.65,lon+d,lat+d*.65].map(v=>v.toFixed(5)).join('%2C');
      return 'https://www.openstreetmap.org/export/embed.html?bbox='+bbox+'&layer=mapnik&marker='+lat.toFixed(5)+'%2C'+lon.toFixed(5);
    }
    function updateMap(){
      if(!state.place)return;
      const place=state.place,location=formatPlace(place);
      mapLabel.textContent=location;
      mapTitle.textContent=place.name;mapSub.textContent=[place.admin1,place.country].filter(Boolean).join(' · ');
      mapEmpty.hidden=true;frame.hidden=false;
      frame.src=mapURL(place);
      openMap.href='https://www.openstreetmap.org/?mlat='+place.latitude.toFixed(5)+'&mlon='+place.longitude.toFixed(5)+'#map=12/'+place.latitude.toFixed(5)+'/'+place.longitude.toFixed(5);
    }
    async function setPlace(place){
      if(!Number.isFinite(place.latitude)||!Number.isFinite(place.longitude))return;
      state.place=place;state.zoom=0.025;state.epoch++;
      const epoch=state.epoch;
      caption.textContent=formatPlace(place);temperature.textContent='—°';description.textContent='Loading current forecast…';
      metrics.replaceChildren();days.replaceChildren();info.textContent='Loading live weather…';
      choices.hidden=true;mapChoices.hidden=true;updateMap();
      const query=new URLSearchParams({
        latitude:String(place.latitude),longitude:String(place.longitude),
        current:'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day',
        daily:'temperature_2m_max,temperature_2m_min,weather_code',
        forecast_days:'3',timezone:'auto'
      });
      try{
        const result=await requestJSON('https://api.open-meteo.com/v1/forecast?'+query);
        if(epoch!==state.epoch||!weather.isConnected)return;
        if(!result.current||!Number.isFinite(result.current.temperature_2m))throw Error('No current conditions');
        const now=result.current;
        temperature.textContent=Math.round(now.temperature_2m)+'°';
        description.textContent=conditionFor(now.weather_code)[0];
        const metric=(label,value)=>{const box=element('div','c-weather-metric');box.append(element('span','',label),element('strong','',value));metrics.append(box);};
        metric('Feels like',Math.round(now.apparent_temperature)+'°');
        metric('Humidity',Math.round(now.relative_humidity_2m)+'%');
        metric('Wind',Math.round(now.wind_speed_10m)+' km/h');
        (result.daily?.time||[]).slice(0,3).forEach((date,i)=>{
          const row=element('div','c-weather-day');
          const dateLabel=i===0?'Today':new Date(date+'T12:00:00').toLocaleDateString(undefined,{weekday:'short'});
          row.append(element('span','',dateLabel),element('span','',conditionFor(result.daily.weather_code[i])[0]),
            element('strong','',Math.round(result.daily.temperature_2m_max[i])+'° / '+Math.round(result.daily.temperature_2m_min[i])+'°'));
          days.append(row);
        });
        info.textContent='Current forecast · '+(now.time?.replace('T',' ')||'updated recently')+' local';
      }catch(error){if(epoch!==state.epoch)return;info.textContent='Weather unavailable: '+error.message+'. Try another place or retry.';description.textContent='No live conditions available';}
    }
    async function searchPlaces(text,target){
      const query=text.trim();if(query.length<2){target.textContent='Enter at least two characters.';target.hidden=false;return;}
      const epoch=++state.searchEpoch;
      target.hidden=false;target.textContent='Searching…';
      try{
        const url='https://geocoding-api.open-meteo.com/v1/search?'+new URLSearchParams({name:query,count:'5',language:'en',format:'json'});
        const result=await requestJSON(url);
        if(epoch!==state.searchEpoch)return;
        target.replaceChildren();
        const places=(result.results||[]).filter(p=>Number.isFinite(p.latitude)&&Number.isFinite(p.longitude));
        if(!places.length){target.textContent='No matching cities. Try a wider search.';return;}
        places.forEach(p=>{const button=element('button','c-geo-choice',formatPlace(p));button.type='button';
          button.addEventListener('click',()=>{setPlace(p);searchInput.value='';mapInput.value='';target.hidden=true;});
          target.append(button);});
      }catch(error){if(epoch!==state.searchEpoch)return;target.textContent='Search unavailable. Check your connection and retry.';}
    }
    search.addEventListener('submit',event=>{event.preventDefault();searchPlaces(searchInput.value,choices);});
    mapSearch.addEventListener('submit',event=>{event.preventDefault();searchPlaces(mapInput.value,mapChoices);});
    function locateMe(){
      if(!navigator.geolocation){info.textContent='Current location is unavailable in this browser. Search a city instead.';return;}
      locate.disabled=true;info.textContent='Requesting location permission…';
      navigator.geolocation.getCurrentPosition(position=>{
        locate.disabled=false;setPlace({name:'Current location',latitude:position.coords.latitude,longitude:position.coords.longitude});
      },()=>{locate.disabled=false;info.textContent='Location permission unavailable or denied. Search a city instead.';},
      {timeout:8500,enableHighAccuracy:false,maximumAge:600000});
    }
    locate.addEventListener('click',locateMe);
    for(const [button,dir] of [[zoomIn,-1],[zoomOut,1]]){
      button.addEventListener('click',()=>{if(!state.place)return;state.zoom=Math.max(.002,Math.min(2,state.zoom*Math.pow(1.8,dir)));updateMap();});
    }
    function fullscreen(open){
      map.classList.toggle('is-map-fullscreen',open);
      document.body.classList.toggle('c-map-fullscreen-active',open);
      mapExpand.innerHTML=open?svg('x')+'<span>Close</span>':svg('expand')+'<span>Expand map</span>';
      mapExpand.setAttribute('aria-label',open?'Close map':'Expand map');
    }
    mapExpand.addEventListener('click',()=>fullscreen(!map.classList.contains('is-map-fullscreen')));
    window.addEventListener('keydown',e=>{if(e.key==='Escape'&&map.classList.contains('is-map-fullscreen'))fullscreen(false);});
    paint(()=>{assistant.append(weather,map);});
    // Request current position by default when permission is available.
    // On denial or insecure context, no fabricated position is shown.
    if(navigator.geolocation)setTimeout(()=>{if(weather.isConnected)locateMe();},250);
    return {weather,map,setPlace,searchPlaces};
  }

  function addCodeBlock(){
    const raw=`const status = { ready: true, files: 18 };\nif (status.ready) {\n  console.log("All checks passed");\n}`;
    const block=element('section','c-code-demo');block.setAttribute('aria-label','Code example');
    const head=element('div','c-code-demo-head');head.append(element('span','c-code-demo-lang','JavaScript'));
    const actions=element('div','c-code-demo-actions');
    const copy=element('button','c-code-demo-button');copy.type='button';copy.dataset.tooltip='Copy code';copy.setAttribute('aria-label','Copy code');copy.innerHTML=svg('copy')+'<span>Copy</span>';
    const run=element('button','c-code-demo-button');run.type='button';run.dataset.tooltip='Run sample';run.setAttribute('aria-label','Run sample');run.innerHTML=svg('run')+'<span>Run</span>';
    actions.append(copy,run);head.append(actions);
    const pre=element('pre','c-code-demo-pre');const code=element('code','c-code-demo-code');
    const highlighted=raw.split('\n').map(line=>line.split(/("[^"]*"|\b(?:const|if|true)\b)/g).map(part=>{
      const escaped=part.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
      return /^"/.test(part)?'<span class="c-code-token-string">'+escaped+'</span>':/^(const|if|true)$/.test(part)?'<span class="c-code-token-keyword">'+escaped+'</span>':escaped;
    }).join('')).join('\n');code.innerHTML=highlighted;pre.append(code);
    const output=element('div','c-code-demo-output');output.hidden=true;block.append(head,pre,output);
    copy.addEventListener('click',async()=>{if(await writeClipboard(raw)){copy.innerHTML=svg('check')+'<span>Copied</span>';setTimeout(()=>{copy.innerHTML=svg('copy')+'<span>Copy</span>';},1050);}});
    run.addEventListener('click',()=>{output.hidden=false;output.textContent='› All checks passed  ·  Demo output';run.setAttribute('aria-label','Run sample again');});
    paint(()=>assistant.append(block));return block;
  }
  /** A single restrained tool status rather than another nested three-stage plan.
   * Hosts trigger finish() when their own real tool event completes; they own
   * the execution/retry lifecycle. This is only a presentational component. */
  /** Minimal shared activity renderer. Avoid previews under scheduling/connector
   * actions unless a real result explicitly supplies a meaningful artifact.
   * Host application keeps all existing tool dispatch and permissions. */
  function createUniversalToolCard({tool,icon='link',active,done}){
    const group=addActivityGroup();
    const activity=addActivity(group,{label:active,icon:ICONS[icon]?icon:'link'});
    return {card:group,advance:()=>{},finish:()=>completed(activity,done)};
  }
  // Universal visual dispatcher: future tools need only a label, icon, activity and preview.
  /* ====================== AI INTEGRATOR / BACKEND CONTRACT ==================
   * The visual sequence below exists ONLY so a coding agent can observe each
   * control, layout state, typography style and animation in a running browser.
   * It is NOT the production agent workflow, harness or state machine.
   *
   * Production host must preserve, unchanged:
   *   - composer/input bar, attachments, focus and send behavior
   *   - existing user AND assistant message bubbles (geometry, styles, position)
   *   - conversation scroll anchoring/restoration and route/navigation shell
   *   - existing streaming protocol, agent decision loop, tools and permissions
   *
   * Replace ONLY individual response/tool presentation components:
   *   THINKING -> brain/dots, measured elapsed-time settled label
   *   SEARCH -> tiny circular favicons reveal on real search result events
   *   FILE EDIT -> pencil/real file diff and +/- counters, expandable review
   *   COMMAND -> exact real command, terminal output, collapsing disclosure
   *   BROWSER -> compact 16:9 placeholder while active, action-status history
   *   ARTIFACT -> document, slides, music, and generic connector renderers
   *   SOURCES -> compact linked citations, only if actual sources are returned
   *
   * Map real event IDs, actual timestamps and data to isolated components.
   * Never use runDemo(), fake commands, sample narratives, or scripted timers
   * to control your backend. The three phase dividers below are demonstration
   * grouping ONLY; production phases are whatever the host agent decides.
   * Only mount components under the host's existing assistant response body.
   * See AGENTS.md and INTEGRATION_GUIDE.md for precise event mapping.
   * ======================================================================= */

  /** DEMO ONLY: three narrative phases to exercise components in context.
   * Never copy this sequence into the host agent. The host has its own plan,
   * commentary, orchestration, timing and action source of truth. */
  async function runDemo(){
    const token=++session;userScrollTakeover=false;clearTimeout(copyResetTimer);
    if(followFrame){cancelAnimationFrame(followFrame);followFrame=0;}
    assistant.replaceChildren();assistant.setAttribute('aria-busy','true');viewport.scrollTop=0;
    composerSend.disabled=true;composerSend.setAttribute('aria-label','Running demonstration');
    document.body.classList.remove('c-document-expanded','c-document-fullscreen-active','c-plan-open');planToggle.setAttribute('aria-expanded','false');
    const delay=ms=>sleep(reducedMotion?Math.round(ms*.55):ms,token);
    // Demo-only pacing; do not insert scripted pauses into a real agent loop.
    const actionPause=()=>sleep(1000,token);
    const completeEditThenPause=async review=>{
      review.complete();
      if(!reducedMotion)await delay(2250); // allow digit roll to finish
      await actionPause();
    };
    try {
      await delay(320);
      const todo=createTodo([
        'Research the request',
        'Create the deliverables',
        'Verify the changes'
      ]);

      // SECTION 1 / 3 — group web, browser and recovery activity under one phase.
      let think=addThinking();await delay(1820);finishThinking(think);
      await actionPause();
      await streamParagraph([
        'I’ll first review the relevant sources and inspect the current working environment, then use that information to shape the documents, presentation and connected actions. ',
        'I’ll keep the activity visible without splitting every small tool call into another section, and only surface expanded details where they add useful context.'
      ],token);
      await actionPause();
      const searchGroup=addActivityGroup();
      const search=addActivity(searchGroup,{label:'Searching the web',icon:'search'});
      await delay(450);
      const faviconStack=element('span','c-web-favicons');faviconStack.setAttribute('aria-hidden','true');
      search.insertIcons(faviconStack);
      for(const source of SOURCES){
        await delay(245);
        const logo=sourceLogo(source,'c-web-favicon');logo.title=source.name;
        faviconStack.appendChild(logo);
      }
      await actionPause();
      const reading=addActivity(searchGroup,{label:'Reading 3 pages',icon:'book'});
      await delay(690);completed(reading,'Read 3 pages');completed(search,'Searched the web');
      await actionPause();
      addCitations();
      await streamParagraph([
        'The initial research confirms the direction: the interface should prioritise readable text, clear editing controls, and subtle motion that communicates progress without drawing attention to itself. ',
        'The browser actions below will remain readable and keep their own activity area compact as the work proceeds.'
      ],token);
      await actionPause();
      await playBrowserAgent(token,delay);
      todo.advance();

      // SECTION 2 / 3 — artifacts are not interspersed with decorative dividers.
      await actionPause();
      addStepDivider('Create & refine');
      think=addThinking();await delay(1370);finishThinking(think);
      await actionPause();
      await streamParagraph([
        'With the supporting information collected, I can turn the brief into a document and a small presentation. ',
        'The document uses a comfortable reading width and a rounded, open canvas. Its editing toolbar stays compact and stable, so choosing formatting options does not cause buttons or text to jump around.'
      ],token);
      await actionPause();
      await playSkill('Document Design',[
        'Arranged the information into a readable editorial hierarchy',
        'Applied restrained headings, generous paragraph spacing and neutral typography',
        'Prepared a document that can be copied, expanded or edited in place'
      ],token,delay,'edit');
      await actionPause();
      const writing=addWritingCard();
      await writing.revealAndType(token,delay);
      await actionPause();
      await streamParagraph([
        'The accompanying presentation follows the same visual logic, but adapts the information to a sequence of simple slides rather than trying to squeeze a document into a slide template. ',
        'You can inspect each slide and switch the preview style; those visual controls are independent of the surrounding conversation.'
      ],token);
      await actionPause();
      await playSkill('Presentation Builder',[
        'Mapped the brief into a concise opening, product story and closing',
        'Selected consistent margins, type sizes and slide transitions',
        'Prepared a navigable preview with style options'
      ],token,delay,'slides');
      await actionPause();
      const slides=createPresentationCard();
      await delay(480);slides.selectSlide(1);
      await delay(440);slides.selectSlide(2);
      await actionPause();
      await streamParagraph([
        'I can also play a track through a connected music service. ',
        'The playback state is displayed as a compact, light music capsule. It stays out of the way, with the extra playback controls available only when expanded.'
      ],token);
      await actionPause();
      const musicGroup=addActivityGroup();
      const createMusic=addActivity(musicGroup,{label:'Opening music',icon:'music'});
      await delay(800);completed(createMusic,'Opened music');
      await actionPause();
      const music=createMusicCard();
      await delay(590);music.setPlaying(0,true);
      await actionPause();
      const geo=addWeatherAndMapCards();
      await actionPause();
      const playback=addActivity(musicGroup,{label:'Starting · Quiet Momentum',icon:'play'});
      completed(playback,'Started · Quiet Momentum');
      await actionPause();
      todo.advance();

      // SECTION 3 / 3 — file diffs, commands and connectors stay in one broad phase.
      await actionPause();
      addStepDivider('Execute & verify');
      await streamParagraph([
        'Next I’ll review the implementation changes and make the result inspectable. ',
        'File edits appear as lightweight rows while running; once complete they offer a rounded diff disclosure with line numbers, additions and removals. ',
        'Commands keep their exact text visible, and verification output collapses when the action ends so the response remains easy to scan.'
      ],token);
      await actionPause();
      const editGroup=addActivityGroup();
      const edit=createEditReview(editGroup,'src/components/LaunchPanel.tsx',DEMO_DIFF_COMPONENT);
      await delay(850);await completeEditThenPause(edit);
      const styles=createEditReview(editGroup,'src/styles/launch.css',DEMO_DIFF_STYLES);
      await delay(810);await completeEditThenPause(styles);
      const command=createCommandView('npm run typecheck');
      await delay(520);command.line('Checking 18 files');
      await delay(430);command.line('0 errors found');
      await delay(370);command.finish();
      await actionPause();
      const build=createCommandView('npm run build');
      await delay(510);build.line('Bundling client assets');
      await delay(490);build.line('Build completed');
      await delay(300);build.finish();
      await actionPause();
      await streamParagraph([
        'The revised implementation keeps related tool events together instead of adding status cards for every possible integration. ',
        'The result is easier to scan: file changes stay inspectable, executed commands retain their real output, and longer explanations connect the work without dividing the conversation into tiny fragments. ',
        'Additional integrations can use the same component patterns when genuine results are available.'
      ],token);
      await actionPause();
      think=addThinking();await delay(1230);finishThinking(think);
      await actionPause();
      await streamParagraph([
        'The demonstration is complete. The document, slide deck, compact music controls, browser activity, code edits and command checks are all represented above, with previews only where those previews are useful. ',
        'The compact task list stays separate from the response, while small activity rows show what happened inside the work. ',
        'In a real application, these components should react to genuine agent events and preserve the application’s existing chat bubbles, composer, scrolling and message lifecycle.'
      ],token);
      await actionPause();
      addCodeBlock();
      await actionPause();
      addRichResponseShowcase();
      todo.advance();
      await actionPause();addSourcesFooter();
      await actionPause();addFooter();
      assistant.setAttribute('aria-busy','false');composerSend.disabled=false;
    }catch(e){if(token===session){assistant.setAttribute('aria-busy','false');composerSend.disabled=false;console.error(e);}}
  }
  // Standalone demo composer: triggers only the visual fixture. Host apps must keep their own composer.
  // Shift+Enter inserts a line break. Enter sends, except while composing with an IME.
  composerInput.addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.shiftKey&&!event.isComposing){event.preventDefault();if(composerInput.value.trim())composerForm.requestSubmit();}});
  composerForm.addEventListener('submit',event=>{
    event.preventDefault();const content=composerInput.value.trim();if(!content)return;
    composerInput.value='';composerInput.style.height='auto';composerSend.disabled=true;
    const dock=document.getElementById('demoComposerDock');
    const wasWelcome=!dock.classList.contains('is-active');
    dock.classList.add('is-active');
    dock.classList.remove('is-welcome');
    const bubble=element('div','c-demo-user-prompt',content);
    document.getElementById('demoUserMessage').replaceChildren(bubble);
    if(wasWelcome&&!reducedMotion)setTimeout(()=>{if(dock.isConnected)runDemo();},660);
    else runDemo();
  });
  const resizeDemoInput=()=>{composerInput.style.height='auto';composerInput.style.height=Math.min(composerInput.scrollHeight,130)+'px';};
  composerInput.addEventListener('input',()=>{composerSend.disabled=!composerInput.value.trim();resizeDemoInput();});
  resizeDemoInput();
  composerSend.disabled=true;
})();

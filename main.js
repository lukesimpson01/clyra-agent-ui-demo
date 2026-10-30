
(() => {
  'use strict';
  /**
   * CLYRA RESPONSE / AGENT-ACTIVITY DESIGN REFERENCE — INTEGRATOR CONTRACT
   * --------------------------------------------------------------------
   * This module runs a DEMO timeline. Its timeline, sample words, mocked tools,
   * scroll container and user-message placement are NOT intended for transfer.
   *
   * REUSE the presentation of response content and activity states ONLY:
   *   - addThinking / finishThinking: thought icon, dots, elapsed-time label
   *   - addActivity / completed: tool/status rows, icons, shimmer and transition
   *   - createEditReview: inline diff disclosures and review motion
   *   - createBrowserPreview: short, neutral viewport shimmer and action list
   *   - addWritingCard: rounded document artifact and editor toolbar
   *   - createPresentationCard / createMusicCard: artifact preview UI
   *   - createCommandView / createUniversalToolCard: execution statuses
   *   - addSourcesFooter / addFooter: citation strip and response actions
   *
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
    link:'<path d="M10 13a5 5 0 0 0 7 .5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>'
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

  function updateReconnectLabel(node,text){
    if(node.textContent===text)return;
    // Crossfade in place: the 1/5 counter does not roll, translate or change baseline.
    node.textContent=text;
    if(!reducedMotion)node.animate([{opacity:.38},{opacity:1}],{duration:380,easing:'cubic-bezier(.22,1,.36,1)'});
  }
  function addReconnecting(){
    const row=element('div','c-reconnect');row.setAttribute('role','status');
    // Each level lights a curved wireless arc; this deliberately avoids cellular-style bars.
    const bars=element('span','c-wifi-curves');bars.setAttribute('aria-hidden','true');
    bars.innerHTML='<svg viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">'+
      '<path class="c-wifi-arc is-live" d="M13 20.5h.01" stroke-width="3.6"/>'+
      '<path class="c-wifi-arc" d="M9.6 17.5a5 5 0 0 1 6.8 0"/>'+
      '<path class="c-wifi-arc" d="M6.5 14.2a9.5 9.5 0 0 1 13 0"/>'+
      '<path class="c-wifi-arc" d="M3.5 10.8a14 14 0 0 1 19 0"/>'+
      '<path class="c-wifi-arc" d="M1.8 7.8a18 18 0 0 1 22.4 0"/>'+'</svg>';
    const label=element('span','c-reconnect-label c-active-shimmer','Reconnecting · 1/5');
    const dots=element('span','c-dots');dots.setAttribute('aria-hidden','true');dots.innerHTML='<i></i><i></i><i></i>';
    row.append(bars,label,dots);paint(()=>assistant.appendChild(row));
    return {row,bars,label};
  }
  async function playReconnecting(token){
    const status=addReconnecting();
    // Every 3 seconds, one more Wi-Fi bar is restored. No accelerated or fake ticks.
    for(let n=2;n<=5;n++){
      await sleep(3000,token);
      paint(()=>{
        [...status.bars.querySelectorAll('.c-wifi-arc')].forEach((arc,i)=>arc.classList.toggle('is-live',i<n));
        updateReconnectLabel(status.label,'Reconnecting · '+n+'/5');
      });
    }
    await sleep(650,token);
    paint(()=>{
      status.row.classList.add('is-finished');
      status.bars.classList.add('is-connected');
      status.label.classList.remove('c-active-shimmer');
      updateReconnectLabel(status.label,'Reconnected');
    });
    return status;
  }
  function createBrowserPreview(){
    const outer=element('section','c-browser-unit');outer.setAttribute('aria-label','Browser agent activity');
    const header=element('button','c-browser-toggle');header.type='button';header.setAttribute('aria-expanded','true');
    header.innerHTML='<span class="c-action-icon">'+svg('browser')+'</span><span class="c-browser-label c-active-shimmer">Working in browser</span>'+svg('chevron','c-chevron');
    const shell=element('div','c-browser-detail-shell is-open');
    const clip=element('div','c-browser-detail-clip');const inside=element('div','c-browser-detail-inner');
    // Deliberately blank: this represents a live viewport before pixels are available.
    // No pretend app controls, cursor or made-up browser page.
    const placeholder=element('div','c-browser-placeholder');
    placeholder.setAttribute('role','img');placeholder.setAttribute('aria-label','Browser viewport loading, grey shimmer preview');
    placeholder.appendChild(element('div','c-browser-placeholder-shimmer'));
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
      paint(()=>actions.appendChild(row));return {row,name};
    }
    function finishAction(item,description){item.name.classList.remove('c-active-shimmer');item.row.classList.add('is-finished');updateLabel(item.name,description);}
    function finish(){placeholder.classList.add('is-complete');setLabel('Used browser · 5 actions',false);expand(false);}
    return {outer,header,shell,addAction,finishAction,finish};
  }
  async function playBrowserAgent(token,delay){
    const browser=createBrowserPreview();
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
    await delay(480);browser.finish();await delay(530);return browser;
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
    const icon=element('span','c-action-icon');icon.innerHTML=svg('filePen');
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
    const outer=element('div','c-sources-footer');
    const button=element('button','c-sources-trigger');button.type='button';button.setAttribute('aria-expanded','false');
    const panel=element('div','c-sources-panel');panel.hidden=true;
    panel.id='sources-panel';button.setAttribute('aria-controls',panel.id);
    const label=element('span','c-sources-title','Sources');
    const count=element('span','c-sources-count',String(SOURCES.length));
    const arrow=element('span','c-sources-arrow');arrow.innerHTML=svg('chevron','c-sources-arrow');
    button.append(websiteStack(SOURCES,false),label,count,arrow);
    panel.appendChild(element('div','c-sources-panel-heading','Sources'));
    SOURCES.forEach(source=>panel.appendChild(sourceLink(source)));
    let animation=null;
    button.addEventListener('click',()=>{
      if(animation){animation.cancel();animation=null;}
      const expand=panel.hidden;
      button.setAttribute('aria-expanded',String(expand));
      if(expand){
        paint(()=>{panel.hidden=false;});
        if(!reducedMotion){
          animation=panel.animate([
            {height:'0px',paddingTop:'0px',paddingBottom:'0px',opacity:0,transform:'translate3d(0,-4px,0)'},
            {height:panel.scrollHeight+'px',paddingTop:'12px',paddingBottom:'10px',opacity:1,transform:'translate3d(0,0,0)'}
          ],{duration:380,easing:'cubic-bezier(.22,1,.36,1)'});
          animation.onfinish=()=>{animation=null;};
        }
      }else if(reducedMotion){paint(()=>{panel.hidden=true;});}
      else{
        animation=panel.animate([
          {height:panel.getBoundingClientRect().height+'px',opacity:1,transform:'translate3d(0,0,0)'},
          {height:'0px',opacity:0,transform:'translate3d(0,-4px,0)'}
        ],{duration:300,easing:'cubic-bezier(.22,1,.36,1)'});
        animation.onfinish=()=>{animation=null;paint(()=>{panel.hidden=true;});};
      }
    });
    outer.append(button,panel);
    paint(()=>assistant.appendChild(outer));
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
    const headButton=(icon,label,text='')=>{
      const b=element('button','c-writing-head-btn');b.type='button';b.setAttribute('aria-label',label);b.title=label;
      b.innerHTML=svg(icon)+(text?'<span>'+text+'</span>':'');return b;
    };
    const copy=headButton('copy','Copy writing');
    const expand=headButton('expand','Expand writing');
    const edit=headButton('edit','Edit writing','Edit');edit.setAttribute('aria-pressed','false');
    actions.append(copy,expand,edit);header.append(title,actions);

    const toolbarShell=element('div','c-writing-toolbar-shell');toolbarShell.setAttribute('aria-hidden','true');
    const toolbarClip=element('div','c-writing-toolbar-clip');
    const toolbar=element('div','c-writing-toolbar');toolbar.setAttribute('role','toolbar');toolbar.setAttribute('aria-label','Document formatting');
    const font=element('select','c-writing-select');font.setAttribute('aria-label','Font family');
    [['system','System'],['serif','Serif'],['mono','Mono']].forEach(([val,txt])=>{const opt=element('option','',txt);opt.value=val;font.appendChild(opt);});
    const size=element('select','c-writing-select c-writing-size');size.setAttribute('aria-label','Font size');
    [13,14,15,16,18,20,22,24,28,32].forEach(n=>{const opt=element('option','',String(n));opt.value=String(n);if(n===16)opt.selected=true;size.appendChild(opt);});
    const sep=()=>element('span','c-writing-tool-divider');
    const makeFormat=(name,label)=>{const b=element('button','c-writing-format-btn');b.type='button';b.title=label;b.dataset.tooltip=label;b.setAttribute('aria-label',label);b.setAttribute('aria-pressed','false');b.innerHTML=svg(name);return b;};
    const buttons={};
    ['bold','italic','underline','strike','link','heading','quote','highlighter','palette','alignLeft','alignCenter','alignRight'].forEach(n=>{
      const labels={bold:'Bold',italic:'Italic',underline:'Underline',strike:'Strikethrough',link:'Insert link',heading:'Heading',quote:'Quote',highlighter:'Highlight',palette:'Text colour',alignLeft:'Align left',alignCenter:'Align centre',alignRight:'Align right'};
      buttons[n]=makeFormat(n,labels[n]);
    });
    toolbar.append(font,size,sep(),buttons.bold,buttons.italic,buttons.underline,buttons.strike,buttons.link,buttons.heading,buttons.quote,sep(),buttons.highlighter,buttons.palette,sep(),buttons.alignLeft,buttons.alignCenter,buttons.alignRight);
    toolbarClip.appendChild(toolbar);toolbarShell.appendChild(toolbarClip);
    const content=element('div','c-writing-content');content.style.fontSize='16px';
    content.innerHTML=''; // Reveal and type the mock artifact after its collapsed header arrives.
    content.setAttribute('contenteditable','false');content.setAttribute('role','textbox');content.setAttribute('aria-label','Document content');content.setAttribute('aria-multiline','true');
    const feedback=element('span','c-writing-feedback');feedback.hidden=true;
    card.classList.add('is-document-folded');card.append(header,toolbarShell,content,feedback);
    let editing=false;let feedbackTimeout;
    const notify=text=>{feedback.textContent=text;feedback.hidden=false;clearTimeout(feedbackTimeout);feedbackTimeout=setTimeout(()=>{feedback.hidden=true;},1350);};
    const exec=(cmd,val=null)=>{content.focus({preventScroll:true});try{document.execCommand(cmd,false,val);}catch(e){notify('Format unavailable');}};
    const setPressed=(button,next)=>button.setAttribute('aria-pressed',String(next));
    edit.addEventListener('click',()=>{
      editing=!editing;card.classList.toggle('is-editing',editing);
      toolbarShell.classList.toggle('is-open',editing);toolbarShell.setAttribute('aria-hidden',String(!editing));
      edit.innerHTML=editing?svg('check')+'<span>Done</span>':svg('edit')+'<span>Edit</span>';
      edit.setAttribute('aria-label',editing?'Finish editing writing':'Edit writing');
      edit.setAttribute('aria-pressed',String(editing));content.contentEditable=String(editing);
      if(editing)content.focus({preventScroll:true});else content.blur();
    });
    copy.addEventListener('click',async()=>{
      const ok=await writeClipboard(content.innerText.trim());
      if(ok){copy.innerHTML=svg('check');setTimeout(()=>{if(copy.isConnected)copy.innerHTML=svg('copy');},1250);}
      else notify('Copy unavailable');
    });
    expand.addEventListener('click',()=>{
      const expanded=card.classList.toggle('is-expanded');document.body.classList.toggle('c-document-expanded',expanded);
      expand.setAttribute('aria-label',expanded?'Minimise writing':'Expand writing');expand.title=expanded?'Minimise writing':'Expand writing';
    });
    window.addEventListener('keydown',e=>{if(e.key==='Escape'&&card.classList.contains('is-expanded')){
      card.classList.remove('is-expanded');document.body.classList.remove('c-document-expanded');
    }});
    font.addEventListener('change',()=>{content.style.fontFamily=font.value==='serif'?'Georgia,Times New Roman,serif':font.value==='mono'?'ui-monospace,SFMono-Regular,Menlo,monospace':'system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif';});
    size.addEventListener('change',()=>{content.style.fontSize=size.value+'px';});
    Object.values(buttons).forEach(b=>b.addEventListener('mousedown',e=>e.preventDefault()));
    const bind=(key,cmd,val=null)=>buttons[key].addEventListener('click',()=>{
      exec(cmd,val);setPressed(buttons[key],buttons[key].getAttribute('aria-pressed')!=='true');
    });
    bind('bold','bold');bind('italic','italic');bind('underline','underline');bind('strike','strikeThrough');
    bind('heading','formatBlock','h2');bind('quote','formatBlock','blockquote');
    bind('highlighter','hiliteColor','#fff3a1');bind('palette','foreColor','#245fc7');
    buttons.link.addEventListener('click',()=>{const selection=window.getSelection();if(!selection||selection.isCollapsed){notify('Select text to add a link');return;}
      const link=window.prompt('Link URL','https://');if(link){if(/^https?:\/\//i.test(link))exec('createLink',link);else notify('Enter an http(s) URL');}});
    for(const [key,command] of [['alignLeft','justifyLeft'],['alignCenter','justifyCenter'],['alignRight','justifyRight']]){
      buttons[key].addEventListener('click',()=>{
        exec(command);['alignLeft','alignCenter','alignRight'].forEach(k=>setPressed(buttons[k],k===key));
      });
    }
    setPressed(buttons.alignLeft,true);
    paint(()=>assistant.appendChild(card));
    // Only for demonstration: genuine writing artifacts must render real streamed document events.
    async function revealAndType(token,delay){
      await delay(380);
      card.classList.remove('is-document-folded');card.classList.add('is-document-opening');
      await delay(360);
      const sections=[
        ['h4','Product launch brief'],
        ['h5','One thoughtful workspace ✨'],
        ['p','Bring research, documents and connected tools together in a focused environment.'],
        ['p','Objective. Make complex workflows feel simple, clear and dependable.'],
        ['p','Approach. Plan, act and verify — with each step visible when you need it.']
      ];
      for(const [tag,text] of sections){
        const line=element(tag,'c-document-typed');content.append(line);
        const words=text.match(/\S+\s*/g)||[];
        for(const word of words){
          const span=element('span','c-document-word',word);line.append(span);
          await delay(28);
        }
        await delay(130);
      }
      card.classList.remove('is-document-opening');card.classList.add('is-document-ready');
    }
    return {card,revealAndType};
  }
  function addFooter(){
    const footer=element('div','c-footer-actions');footer.setAttribute('aria-label','Response actions');
    function action(name,label){
      const b=element('button','c-action-btn');b.type='button';b.title=label;b.dataset.tooltip=label;b.setAttribute('aria-label',label);b.innerHTML=svg(name);
      return b;
    }
    const copy=action('copy','Copy response');
    const like=action('thumbUp','Good response');
    const dislike=action('thumbDown','Bad response');
    const replay=action('replay','Regenerate response');
    const note=element('span','c-copy-note');
    copy.addEventListener('click',async()=>{
      const text=[...assistant.querySelectorAll('.c-stream-block p,.c-result-heading,.c-result-list li')].map(n=>n.textContent).join('\n');
      const ok=await writeClipboard(text);
      if(ok){note.textContent='Copied';copy.innerHTML=svg('check');clearTimeout(copyResetTimer);copyResetTimer=setTimeout(()=>{note.textContent='';if(copy.isConnected)copy.innerHTML=svg('copy');},1400);}
      else{note.textContent='Copy unavailable';}
    });
    function feedback(which,other){
      const enabled=which.getAttribute('aria-pressed')!=='true';
      which.setAttribute('aria-pressed',String(enabled));other.setAttribute('aria-pressed','false');
    }
    like.setAttribute('aria-pressed','false');dislike.setAttribute('aria-pressed','false');
    like.addEventListener('click',()=>feedback(like,dislike));
    dislike.addEventListener('click',()=>feedback(dislike,like));
    replay.addEventListener('click',()=>runDemo());
    footer.append(copy,like,dislike,replay,note);
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
    mark.innerHTML='<span class="c-todo-glyph c-todo-glyph-list">'+svg('listTodo')+'</span><span class="c-todo-glyph c-todo-glyph-complete">'+svg('check')+'</span>';
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
    let done=0,open=true;
    function setOpen(next){open=next;trigger.setAttribute('aria-expanded',String(open));disclosure.classList.toggle('is-open',open);}
    trigger.addEventListener('click',()=>setOpen(!open));
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
      mark.classList.toggle('is-all-done',all);
      if(all){setTimeout(()=>{if(done===items.length&&card.isConnected)setOpen(false);},600);}
      else if(!open)setOpen(true);
    }
    render();
    return {card,advance:()=>paint(()=>{done=Math.min(items.length,done+1);render();})};
  }
  async function playSkill(label,details,token,delay,kind='wand'){
    const group=addActivityGroup();
    const activity=addActivity(group,{label:'Using skill · '+label,icon:kind,disclose:true,details});
    activity.autoSetExpanded(true);
    await delay(900);
    completed(activity,'Used skill · '+label);
    await delay(170);
    activity.autoSetExpanded(false);
    return activity;
  }
  function createPresentationCard(){
    const card=element('section','c-presentation');card.setAttribute('aria-label','Presentation preview and style controls');
    const top=element('div','c-preview-top');const name=element('div','c-preview-name');name.innerHTML=svg('slides')+'<span>Launch presentation</span>';
    const editSlides=element('button','c-slide-action');editSlides.type='button';editSlides.innerHTML=svg('edit')+'<span>Edit</span>';editSlides.setAttribute('aria-pressed','false');
    const fullscreen=element('button','c-slide-action');fullscreen.type='button';fullscreen.innerHTML=svg('expand')+'<span>Full screen</span>';
    const closeFull=element('button','c-slide-close');closeFull.type='button';closeFull.innerHTML=svg('check')+'<span>Done</span>';closeFull.setAttribute('aria-label','Close full screen');
    const topActions=element('div','c-slide-top-actions');topActions.append(editSlides,fullscreen,closeFull);
    top.append(name,topActions);
    const stage=element('div','c-presentation-stage');
    const slides=[
      ['01 / INTRODUCTION','One workspace.','Research, create and act from one place.'],
      ['02 / PRODUCT','Focused by design.','Thoughtful tools, fast workflows and visible progress.'],
      ['03 / LAUNCH','Make ideas real.','From the first question to a finished deliverable.']
    ];
    let currentSlide=0;
    const slideNodes=slides.map((slide,i)=>{
      const s=element('div','c-presentation-slide'+(i===0?' is-selected':''));
      s.append(element('div','c-slide-eyebrow',slide[0]),element('div','c-slide-heading',slide[1]),element('div','c-slide-body',slide[2]),element('span','c-slide-rule'),element('span','c-slide-num',String(i+1).padStart(2,'0')));
      stage.append(s);return s;
    });
    const strip=element('div','c-slide-strip');
    slides.forEach((slide,i)=>{
      const btn=element('button','c-slide-thumb'+(i===0?' is-selected':''));btn.type='button';btn.title='Show slide '+(i+1);btn.setAttribute('aria-label','Show slide '+(i+1));
      btn.innerHTML='<span class="tiny-line"></span><span class="tiny-line"></span><span class="tiny-line"></span>';
      btn.addEventListener('click',()=>selectSlide(i));strip.append(element('span','c-slide-index',String(i+1)),btn);
    });
    function selectSlide(index){
      currentSlide=index;
      slideNodes.forEach((s,i)=>s.classList.toggle('is-selected',i===index));
      [...strip.querySelectorAll('button')].forEach((b,i)=>{b.classList.toggle('is-selected',i===index);b.setAttribute('aria-pressed',String(i===index));});
    }
    selectSlide(0);
    const controls=element('div','c-presentation-controls');
    controls.append(element('span','c-small-label','Style'));
    const style=element('select','c-style-picker');style.setAttribute('aria-label','Presentation visual style');
    [['minimal','Minimal'],['editorial','Editorial'],['dark','Dark']].forEach(([value,label])=>{const opt=element('option','',label);opt.value=value;style.append(opt);});
    style.addEventListener('change',()=>{stage.className='c-presentation-stage'+(style.value==='minimal'?'':' theme-'+style.value);});
    controls.append(style,element('span','c-small-label','Select a slide and edit its text in place')); 
    const editor=element('div','c-slide-editor');
    const titleLabel=element('label','c-slide-field');titleLabel.append(element('span','','Title'));
    const titleInput=element('input','c-slide-input');titleInput.type='text';titleInput.setAttribute('aria-label','Slide heading');titleLabel.append(titleInput);
    const descLabel=element('label','c-slide-field');descLabel.append(element('span','','Description'));
    const descInput=element('textarea','c-slide-input c-slide-textarea');descInput.setAttribute('aria-label','Slide body');descInput.rows=2;descLabel.append(descInput);
    const editingTools=element('div','c-slide-edit-toolbar');editingTools.append(element('span','','Size'));
    const titleSize=element('select','c-style-picker');titleSize.setAttribute('aria-label','Slide title size');
    [22,28,32,36,42,48].forEach(n=>{const option=element('option','',n+'px');option.value=n;titleSize.append(option);});titleSize.value='36';
    const textAlign=element('select','c-style-picker');textAlign.setAttribute('aria-label','Slide text alignment');
    [['left','Left'],['center','Centre'],['right','Right']].forEach(([v,t])=>{const opt=element('option','',t);opt.value=v;textAlign.append(opt);});
    editingTools.append(titleSize,textAlign);editor.append(titleLabel,descLabel,editingTools);
    function syncInputs(){titleInput.value=slideNodes[currentSlide].querySelector('.c-slide-heading').textContent;descInput.value=slideNodes[currentSlide].querySelector('.c-slide-body').textContent;}
    // Navigation and editor state share the same selected-slide model.
    const thumbButtons=[...strip.querySelectorAll('button')];
    thumbButtons.forEach((b,i)=>b.addEventListener('click',()=>{syncInputs();}));
    titleInput.addEventListener('input',()=>{slideNodes[currentSlide].querySelector('.c-slide-heading').textContent=titleInput.value;});
    descInput.addEventListener('input',()=>{slideNodes[currentSlide].querySelector('.c-slide-body').textContent=descInput.value;});
    titleSize.addEventListener('change',()=>{slideNodes[currentSlide].querySelector('.c-slide-heading').style.fontSize=titleSize.value+'px';});
    textAlign.addEventListener('change',()=>{slideNodes[currentSlide].style.textAlign=textAlign.value;slideNodes[currentSlide].style.alignItems=textAlign.value==='left'?'flex-start':textAlign.value==='center'?'center':'flex-end';});
    let editing=false;
    editSlides.addEventListener('click',()=>{editing=!editing;card.classList.toggle('is-slide-editing',editing);editSlides.setAttribute('aria-pressed',String(editing));editSlides.querySelector('span').textContent=editing?'Done':'Edit';if(editing)syncInputs();});
    const toggleFullscreen=(next)=>{card.classList.toggle('is-slide-fullscreen',next);document.body.classList.toggle('c-slide-fullscreen-active',next);fullscreen.querySelector('span').textContent=next?'Minimise':'Full screen';};
    fullscreen.addEventListener('click',()=>toggleFullscreen(!card.classList.contains('is-slide-fullscreen')));
    closeFull.addEventListener('click',()=>toggleFullscreen(false));
    window.addEventListener('keydown',e=>{if(e.key==='Escape'&&card.classList.contains('is-slide-fullscreen'))toggleFullscreen(false);});
    syncInputs();
    card.append(top,stage,strip,controls,editor);paint(()=>assistant.append(card));
    return {card,selectSlide,changeStyle:value=>{style.value=value;style.dispatchEvent(new Event('change'));}};
  }
  /** Light dynamic-island music presentation. A playback event, not a playlist.
   * Real integrations provide their own track metadata and playback state.
   * The disclosure and controls are visual only in this demo. */
  function createMusicCard(){
    const card=element('section','c-music-island');
    card.setAttribute('aria-label','Now playing — expandable music controls');
    const body=element('div','c-island-body');
    const art=element('button','c-island-art');art.type='button';art.setAttribute('aria-label','Show playback details');art.innerHTML=svg('music');
    const info=element('div','c-island-info');
    const title=element('div','c-island-track','Quiet Momentum');
    const artist=element('div','c-island-artist','Studio North');
    info.append(title,artist);
    const signal=element('span','c-island-signal');signal.setAttribute('aria-hidden','true');signal.innerHTML='<i></i><i></i><i></i><i></i>';
    const pause=element('button','c-island-control c-island-toggle');pause.type='button';pause.setAttribute('aria-label','Play music');pause.innerHTML=svg('play');
    const expand=element('button','c-island-control c-island-expand');expand.type='button';expand.setAttribute('aria-label','Expand music controls');expand.setAttribute('aria-expanded','false');expand.innerHTML=svg('chevron');
    body.append(art,info,signal,pause,expand);
    const detail=element('div','c-island-detail');
    // Only the music details change height. The compact header never moves or resizes.
    const detailInner=element('div','c-island-detail-inner');
    const progress=element('div','c-island-progress');progress.append(element('span'));
    const times=element('div','c-island-times');times.append(element('span','', '0:42'),element('span','', '3:12'));
    const actions=element('div','c-island-actions');
    const prev=element('button','c-island-skip');prev.type='button';prev.setAttribute('aria-label','Previous track');prev.innerHTML=svg('chevron');
    const next=element('button','c-island-skip');next.type='button';next.setAttribute('aria-label','Next track');next.innerHTML=svg('chevron');
    actions.append(prev,element('span','c-island-now','Now playing'),next);
    detailInner.append(progress,times,actions);detail.append(detailInner);
    card.append(body,detail);
    const tracks=[['Quiet Momentum','Studio North'],['Clear Horizons','The Ambient Room'],['Open Focus','Northline']];
    let current=0,playing=false;
    function setPlaying(index,enabled){
      current=(index+tracks.length)%tracks.length;playing=enabled;
      title.textContent=tracks[current][0];artist.textContent=tracks[current][1];
      card.classList.toggle('is-playing',playing);
      pause.innerHTML=svg(playing?'pause':'play');
      pause.setAttribute('aria-label',playing?'Pause music':'Play music');
      actions.querySelector('.c-island-now').textContent=playing?'Playing':'Paused';
    }
    let expanded=false;
    function setExpanded(open){
      if(open===expanded)return;
      expanded=open;
      const current=detail.getBoundingClientRect().height;
      // Measure the real content rather than animating to an arbitrary max-height.
      const target=open?detailInner.getBoundingClientRect().height:0;
      detail.style.height=current+'px';
      detail.style.opacity=open?'1':'0';
      card.classList.toggle('is-expanded',open);
      expand.setAttribute('aria-expanded',String(open));
      expand.setAttribute('aria-label',open?'Collapse music controls':'Expand music controls');
      if(reducedMotion){detail.style.height=open?'auto':'0px';return;}
      requestAnimationFrame(()=>{
        detail.style.height=target+'px';
      });
    }
    detail.addEventListener('transitionend',event=>{
      if(event.propertyName==='height'&&expanded)detail.style.height='auto';
    });
    pause.addEventListener('click',()=>setPlaying(current,!playing));
    expand.addEventListener('click',()=>setExpanded(!expanded));
    prev.addEventListener('click',()=>setPlaying(current-1,playing));
    next.addEventListener('click',()=>setPlaying(current+1,playing));
    art.addEventListener('click',()=>setExpanded(!expanded));
    art.setAttribute('title','Show playback details');
    paint(()=>assistant.append(card));
    return {card,setPlaying,setExpanded};
  }
  function createCommandView(command){
    const unit=element('div','c-command-unit');
    const header=element('button','c-command-head');header.type='button';header.setAttribute('aria-expanded','true');
    header.innerHTML='<span class="c-action-icon">'+svg('terminal')+'</span><span class="c-active-shimmer c-command-label">Running command</span>';
    header.append(element('code','c-command-text',command));header.insertAdjacentHTML('beforeend',svg('chevron','c-chevron'));
    header.setAttribute('aria-label','Command: '+command);
    const shell=element('div','c-command-shell is-open');const clip=element('div','c-command-clip');const terminal=element('div','c-terminal');
    terminal.append(element('div','c-terminal-command','$ '+command));clip.append(terminal);shell.append(clip);unit.append(header,shell);
    header.addEventListener('click',()=>{let open=header.getAttribute('aria-expanded')!=='true';header.setAttribute('aria-expanded',String(open));shell.classList.toggle('is-open',open);});
    paint(()=>assistant.append(unit));
    return {line:txt=>paint(()=>{const line=element('div','c-terminal-line');line.append(element('span','c-terminal-prompt','›'),document.createTextNode(txt));terminal.append(line);}),
      finish:()=>{header.querySelector('.c-command-label').classList.remove('c-active-shimmer');updateLabel(header.querySelector('.c-command-label'),'Ran command');header.setAttribute('aria-expanded','false');shell.classList.remove('is-open');}};
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
    document.body.classList.remove('c-document-expanded','c-plan-open');planToggle.setAttribute('aria-expanded','false');
    const delay=ms=>sleep(reducedMotion?Math.round(ms*.55):ms,token);
    try {
      await delay(320);
      const todo=createTodo([
        'Research the request and establish context',
        'Create and refine the deliverables',
        'Run connected actions and verify results'
      ]);

      // SECTION 1 / 3 — group web, browser and recovery activity under one phase.
      let think=addThinking();await delay(1820);finishThinking(think);
      await delay(220);
      await streamParagraph([
        'I’ll first review the relevant sources and inspect the current working environment, then use that information to shape the documents, presentation and connected actions. ',
        'I’ll keep the activity visible without splitting every small tool call into another section, and only surface expanded details where they add useful context.'
      ],token);
      await delay(270);
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
      await delay(270);
      const reading=addActivity(searchGroup,{label:'Reading 3 pages',icon:'book'});
      await delay(690);completed(reading,'Read 3 pages');completed(search,'Searched the web');
      await delay(260);
      addCitations();
      await streamParagraph([
        'The initial research confirms the direction: the interface should prioritise readable text, clear editing controls, and subtle motion that communicates progress without drawing attention to itself. ',
        'I’m also retaining a visible recovery state for interrupted connections, so an in-progress operation remains understandable rather than suddenly disappearing.'
      ],token);
      await delay(220);
      await playReconnecting(token);
      await delay(310);
      await playBrowserAgent(token,delay);
      todo.advance();

      // SECTION 2 / 3 — artifacts are not interspersed with decorative dividers.
      await delay(340);
      addStepDivider('Create & refine');
      think=addThinking();await delay(1370);finishThinking(think);
      await streamParagraph([
        'With the supporting information collected, I can turn the brief into a document and a small presentation. ',
        'The document uses a comfortable reading width and a rounded, open canvas. Its editing toolbar stays compact and stable, so choosing formatting options does not cause buttons or text to jump around.'
      ],token);
      await playSkill('Document Design',[
        'Arranged the information into a readable editorial hierarchy',
        'Applied restrained headings, generous paragraph spacing and neutral typography',
        'Prepared a document that can be copied, expanded or edited in place'
      ],token,delay,'filePen');
      const writing=addWritingCard();
      await writing.revealAndType(token,delay);
      await delay(340);
      await streamParagraph([
        'The accompanying presentation follows the same visual logic, but adapts the information to a sequence of simple slides rather than trying to squeeze a document into a slide template. ',
        'You can inspect each slide and switch the preview style; those visual controls are independent of the surrounding conversation.'
      ],token);
      await playSkill('Presentation Builder',[
        'Mapped the brief into a concise opening, product story and closing',
        'Selected consistent margins, type sizes and slide transitions',
        'Prepared a navigable preview with style options'
      ],token,delay,'slides');
      const slides=createPresentationCard();
      await delay(480);slides.selectSlide(1);
      await delay(440);slides.selectSlide(2);
      await streamParagraph([
        'I can also play a track through a connected music service. ',
        'The playback state is displayed as a compact, light music capsule. It stays out of the way, with the extra playback controls available only when expanded.'
      ],token);
      const musicGroup=addActivityGroup();
      const createMusic=addActivity(musicGroup,{label:'Opening music',icon:'music'});
      await delay(800);completed(createMusic,'Opened music');
      const music=createMusicCard();
      await delay(590);music.setPlaying(0,true);
      const playback=addActivity(musicGroup,{label:'Starting · Quiet Momentum',icon:'play'});
      completed(playback,'Started · Quiet Momentum');
      todo.advance();

      // SECTION 3 / 3 — file diffs, commands and connectors stay in one broad phase.
      await delay(350);
      addStepDivider('Execute & verify');
      await streamParagraph([
        'Next I’ll review the implementation changes and make the result inspectable. ',
        'File edits appear as lightweight rows while running; once complete they offer a rounded diff disclosure with line numbers, additions and removals. ',
        'Commands keep their exact text visible, and verification output collapses when the action ends so the response remains easy to scan.'
      ],token);
      const editGroup=addActivityGroup();
      const edit=createEditReview(editGroup,'src/components/LaunchPanel.tsx',DEMO_DIFF_COMPONENT);
      await delay(850);edit.complete();
      const styles=createEditReview(editGroup,'src/styles/launch.css',DEMO_DIFF_STYLES);
      await delay(810);styles.complete();
      const command=createCommandView('npm run typecheck');
      await delay(520);command.line('Checking 18 files');
      await delay(430);command.line('0 errors found');
      await delay(370);command.finish();
      const build=createCommandView('npm run build');
      await delay(510);build.line('Bundling client assets');
      await delay(490);build.line('Build completed');
      await delay(300);build.finish();
      await delay(230);
      await streamParagraph([
        'The revised implementation keeps related tool events together instead of adding status cards for every possible integration. ',
        'The result is easier to scan: file changes stay inspectable, executed commands retain their real output, and longer explanations connect the work without dividing the conversation into tiny fragments. ',
        'Additional integrations can use the same component patterns when genuine results are available.'
      ],token);
      think=addThinking();await delay(1230);finishThinking(think);
      await streamParagraph([
        'The demonstration is complete. The document, slide deck, compact music controls, browser activity, code edits and command checks are all represented above, with previews only where those previews are useful. ',
        'The compact task list stays separate from the response, while small activity rows show what happened inside the work. ',
        'In a real application, these components should react to genuine agent events and preserve the application’s existing chat bubbles, composer, scrolling and message lifecycle.'
      ],token);
      todo.advance();
      await delay(300);addSourcesFooter();
      await delay(210);addFooter();
      assistant.setAttribute('aria-busy','false');
    }catch(e){if(token===session){assistant.setAttribute('aria-busy','false');console.error(e);}}
  }
  // DEMO AUTO-PLAY ONLY. Host apps own execution and must not copy this call.
  if (window.CLYRA_DEMO_MODE !== false) runDemo();
})();


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
      paint(()=>{actions.appendChild(row);if(actions.children.length>3){actions.classList.add('is-scrollable');actions.scrollTo({top:actions.scrollHeight,behavior:reducedMotion?'instant':'smooth'});}});return {row,name};
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
    trigger.append(logos,element('span','c-sources-inline-heading','Sources'),element('span','c-sources-inline-count',String(SOURCES.length)));
    const clip=element('div','c-sources-inline-clip');clip.id='c-sources-inline-items-'+session;
    clip.setAttribute('aria-hidden','true');clip.inert=true;
    const links=element('div','c-sources-inline-links');
    SOURCES.forEach((source,index)=>{
      const slot=element('span','c-sources-inline-slot');
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
      clip.setAttribute('aria-hidden',String(!open));
      clip.inert=!open;
      paint(()=>root.classList.toggle('is-open',open));
    });
    paint(()=>assistant.append(root));
    return root;
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
    actions.append(copy,edit);header.append(title,actions);
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
    function setEditing(next){editing=next;card.classList.toggle('is-editing',editing);toolbarShell.classList.toggle('is-open',editing);toolbarShell.setAttribute('aria-hidden',String(!editing));edit.innerHTML=editing?svg('check')+'<span>Done</span>':svg('edit')+'<span>Edit</span>';edit.setAttribute('aria-label',editing?'Finish editing writing':'Edit writing');edit.setAttribute('aria-pressed',String(editing));content.contentEditable=String(editing);if(editing)content.focus({preventScroll:true});else{closePopup();content.blur();}}
    edit.addEventListener('click',()=>setEditing(!editing));
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
    let done=0,open=false;setOpen(false);
    // Begin as a single progress circle, then unfold the plan when work starts.
    setTimeout(()=>{if(card.isConnected&&done<items.length)setOpen(true);},480);
    function setOpen(next){open=next;trigger.setAttribute('aria-expanded',String(open));card.classList.toggle('is-open',open);disclosure.classList.toggle('is-open',open);}
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
      const fraction=items.length?done/items.length:0;
      mark.style.setProperty('--todo-percentage',Math.round(fraction*100)+'%');
      mark.querySelector('.c-todo-progress-value')?.style.setProperty('stroke-dashoffset',String(69.115*(1-fraction)));
      mark.classList.toggle('is-all-done',all);mark.classList.toggle('is-working',!all&&done<items.length);
      if(all){setTimeout(()=>{if(done===items.length&&card.isConnected)setOpen(false);},600);}
      // Keep the compact collapsed plan stable unless the user opens it.
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
    // A usable local slide editor for this visual fixture. Production apps MUST
    // reuse their own slide engine, file formats, collaboration and persistence.
    const card=element('section','c-presentation c-slides-v10 c-slides-v14');
    card.setAttribute('aria-label','Editable presentation');
    const top=element('div','c-preview-top');
    const name=element('div','c-preview-name');name.innerHTML=svg('slides')+'<span>Presentation</span>';
    const editBtn=element('button','c-slide-action');editBtn.type='button';editBtn.dataset.tooltip='Edit slides';editBtn.setAttribute('aria-label','Edit slides');editBtn.innerHTML=svg('edit')+'<span>Edit</span>';
    const fullBtn=element('button','c-slide-action');fullBtn.type='button';fullBtn.dataset.tooltip='Full screen';fullBtn.setAttribute('aria-label','Full screen');fullBtn.innerHTML=svg('expand')+'<span>Full screen</span>';
    const actions=element('div','c-slide-top-actions');actions.append(editBtn,fullBtn);top.append(name,actions);
    const editor=element('div','c-slide-workspace');
    const filmstrip=element('div','c-slide-filmstrip');filmstrip.setAttribute('aria-label','Slide thumbnails');
    const stage=element('div','c-presentation-stage');
    const canvas=element('div','c-slide-canvas');canvas.setAttribute('aria-label','Slide canvas');stage.append(canvas);
    const inspector=element('div','c-slide-inspector');const toolbar=element('div','c-slide-v10-toolbar c-slide-v14-toolbar');
    const controls=element('div','c-slide-v14-controls');
    const notes=element('textarea','c-slide-v14-notes');notes.placeholder='Add speaker notes…';notes.setAttribute('aria-label','Speaker notes');notes.rows=2;
    const imageInput=element('input','c-slide-image-picker');imageInput.type='file';imageInput.accept='image/png,image/jpeg,image/webp';imageInput.hidden=true;imageInput.setAttribute('aria-label','Choose image for slide');
    const layerPanel=element('div','c-slide-layer-panel');layerPanel.setAttribute('aria-label','Slide object layers');
    const stageWrap=element('div','c-slide-stage-wrap');stageWrap.append(stage,inspector);
    const slides=[
      {title:'One workspace.',body:'Research, create and act from one place.',eyebrow:'INTRODUCTION',theme:'minimal',objects:[],notes:''},
      {title:'Less friction.',body:'A quieter workflow for meaningful work.',eyebrow:'DIRECTION',theme:'minimal',objects:[],notes:''},
      {title:'Made to move.',body:'Bring documents and actions into focus.',eyebrow:'OUTCOME',theme:'minimal',objects:[],notes:''}
    ];
    let current=0,editing=false,selected={field:'title',id:null},showNotes=false;
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
    const fontSize=select('Font size',[[14,'14'],[16,'16'],[18,'18'],[24,'24'],[28,'28'],[32,'32'],[40,'40'],[48,'48'],[56,'56']]);
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
      snapshot();const obj={id:nextObjectId++,type,x:27,y:37,w:type==='text'?46:28,h:type==='text'?14:25,
        color:type==='text'?'#222228':'#d5dbe8',text:type==='text'?'New text box':''};
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
        item.classList.toggle('is-element-selected',editing&&selected.field===field);
      }
      canvas.append(eyebrow,title,body);
      slide.objects.forEach(obj=>{
        const el=element('div','c-slide-object c-slide-object-'+obj.type);
        el.dataset.field='object';el.dataset.objectId=obj.id;
        Object.assign(el.style,{left:obj.x+'%',top:obj.y+'%',width:obj.w+'%',height:obj.h+'%',background:obj.type==='text'?'transparent':obj.color,color:obj.color});
        if(obj.type==='text'){el.textContent=obj.text;el.contentEditable=String(editing);el.spellcheck=false;el.addEventListener('input',()=>{obj.text=el.innerText;});}
        else if(obj.type==='image'&&obj.src){const img=element('img','c-slide-object-image');img.src=obj.src;img.alt='Inserted slide image';img.draggable=false;el.append(img);}
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
    toolbar.append(
      toolbarGroup(tool('New slide','slides',addSlide),tool('Duplicate','copy',duplicateSlide),tool('Delete slide','file',removeSlide),tool('Move up','chevron',()=>moveSlide(-1)),tool('Move down','caret',()=>moveSlide(1))),
      toolbarGroup(tool('Undo','replay',undo),tool('Redo','replay',redo)),
      toolbarGroup(tool('Insert text box','type',()=>addObject('text')),tool('Insert rectangle','box',()=>addObject('rect')),tool('Insert ellipse','circle',()=>addObject('ellipse')),tool('Insert image','image',()=>imageInput.click()),tool('Duplicate object','copy',duplicateObject),tool('Bring object forward','layers',()=>moveObjectLayer(1)),tool('Send object backward','layers',()=>moveObjectLayer(-1)),tool('Remove selected object','x',removeObject)),
      toolbarGroup(fontFamily,fontSize,align),
      toolbarGroup(tool('Bold','bold',()=>{if(selected.field==='object')return;document.execCommand('bold');}),tool('Italic','italic',()=>{if(selected.field==='object')return;document.execCommand('italic');}),textColour,backgroundColour,theme),
      toolbarGroup(tool('Speaker notes','file',()=>{showNotes=!showNotes;notes.classList.toggle('is-visible',showNotes);}),tool('Export slides as JSON','download',()=>{
        const blob=new Blob([JSON.stringify(slides,null,2)],{type:'application/json'});
        const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='clyra-slides-demo.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
      }))
    );
    toolbar.addEventListener('mousedown',event=>{if(event.target.closest('button'))event.preventDefault();});
    fontSize.addEventListener('change',()=>applySelected('size',Number(fontSize.value)));
    fontFamily.addEventListener('change',()=>applySelected('font',fontFamily.value));
    align.addEventListener('change',()=>applySelected('align',align.value));
    textColour.addEventListener('input',()=>applySelected('color',textColour.value));
    backgroundColour.addEventListener('change',()=>{snapshot();slides[current].bg=backgroundColour.value;render();});
    backgroundColour.addEventListener('input',()=>{canvas.style.background=backgroundColour.value;});
    theme.addEventListener('change',()=>{snapshot();slides[current].theme=theme.value;render();});
    notes.addEventListener('input',()=>{slides[current].notes=notes.value;});
    inspector.append(element('p','c-slide-instructions','Select a slide, edit text, insert shapes or add speaker notes.'));
    inspector.append(toolbar,imageInput,layerPanel,notes);
    editor.append(filmstrip,stageWrap);stageWrap.append(inspector);card.append(top,editor);
    function setEditing(next){editing=next;card.classList.toggle('is-slide-editing',editing);editBtn.setAttribute('aria-pressed',String(editing));editBtn.querySelector('span').textContent=editing?'Done':'Edit';render();}
    editBtn.addEventListener('click',()=>setEditing(!editing));
    const setFullscreen=next=>{
      card.classList.toggle('is-slide-fullscreen',next);document.body.classList.toggle('c-slide-fullscreen-active',next);
      fullBtn.querySelector('span').textContent=next?'Minimise':'Full screen';render();
    };
    fullBtn.addEventListener('click',()=>setFullscreen(!card.classList.contains('is-slide-fullscreen')));
    window.addEventListener('keydown',event=>{
      if(event.key==='Escape'&&card.classList.contains('is-slide-fullscreen'))setFullscreen(false);
      if(!card.isConnected||!editing)return;
      // Let the native contenteditable engine undo/redo the user's text edits.
      if(event.target?.isContentEditable&&(event.metaKey||event.ctrlKey)&&['z','y'].includes(event.key.toLowerCase()))return;
      if((event.key==='Delete'||event.key==='Backspace')&&selected.field==='object'&&!event.target?.isContentEditable&&event.target?.tagName!=='INPUT'&&event.target?.tagName!=='TEXTAREA'){event.preventDefault();removeObject();}
      if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='d'&&selected.field==='object'&&!event.target?.isContentEditable){event.preventDefault();duplicateObject();}
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
    const card=element('section','c-music-island c-island-v10');card.setAttribute('aria-label','Now playing');
    const art=element('span','c-island-art');art.innerHTML=svg('music');
    const info=element('div','c-island-info');const title=element('span','c-island-track','Quiet Momentum');const artist=element('span','c-island-artist','Studio North');info.append(title,artist);
    const play=element('button','c-island-control c-island-toggle');play.type='button';play.dataset.tooltip='Play or pause';play.setAttribute('aria-label','Play music');play.innerHTML=svg('play');
    const scrub=element('input','c-island-scrubber');scrub.type='range';scrub.min='0';scrub.max='192';scrub.value='42';scrub.setAttribute('aria-label','Seek song playback');
    const elapsed=element('span','c-island-elapsed','0:42');const duration=element('span','c-island-duration','3:12');
    const time=element('div','c-island-time');time.append(elapsed,duration);
    const body=element('div','c-island-body');body.append(art,info,play);
    card.append(body,scrub,time);const tracks=[['Quiet Momentum','Studio North']];let playing=false,seconds=42;
    const update=()=>{card.classList.toggle('is-playing',playing);play.innerHTML=svg(playing?'pause':'play');play.setAttribute('aria-label',playing?'Pause music':'Play music');scrub.style.setProperty('--progress',(seconds/192*100)+'%');elapsed.textContent=Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0');};
    function setPlaying(index,enabled){playing=enabled;update();}
    play.addEventListener('click',()=>setPlaying(0,!playing));
    scrub.addEventListener('input',()=>{seconds=Number(scrub.value);update();});
    const ticker=setInterval(()=>{if(!card.isConnected){clearInterval(ticker);return;}if(playing){seconds=Math.min(192,seconds+1);scrub.value=String(seconds);if(seconds===192)playing=false;update();}},1000);
    update();paint(()=>assistant.append(card));return {card,setPlaying};
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
    document.body.classList.remove('c-document-expanded','c-plan-open');planToggle.setAttribute('aria-expanded','false');
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
        'Research the request and establish context',
        'Create and refine the deliverables',
        'Run connected actions and verify results'
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
    composerInput.value='';composerInput.style.height='auto';const bubble=element('div','c-demo-user-prompt',content);
    document.getElementById('demoUserMessage').replaceChildren(bubble);
    runDemo();
  });
  const resizeDemoInput=()=>{composerInput.style.height='auto';composerInput.style.height=Math.min(composerInput.scrollHeight,130)+'px';};
  composerInput.addEventListener('input',()=>{composerSend.disabled=!composerInput.value.trim();resizeDemoInput();});
  resizeDemoInput();
  composerSend.disabled=true;
})();

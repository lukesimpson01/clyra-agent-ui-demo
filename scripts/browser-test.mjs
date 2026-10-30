// Real Chromium interaction test. CI-only: Playwright is installed in the
// workflow; npm run dev remains dependency-free.
import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {spawn} from 'node:child_process';
import {setTimeout as pause} from 'node:timers/promises';
import {chromium} from 'playwright';
const port=52681,base='http://localhost:'+port;
const server=spawn(process.execPath,['server.js'],{cwd:new URL('../',import.meta.url),env:{...process.env,PORT:String(port)},stdio:['ignore','pipe','pipe']});
let log='';server.stderr.on('data',chunk=>log+=chunk);
let browser;
const errors=[];
const shots= fileURLToPath(new URL('../test-results/',import.meta.url));
mkdirSync(shots,{recursive:true});
try {
  let running=false;
  for(let i=0;i<60;i++){
    if(server.exitCode!==null)throw Error('npm server exited: '+log);
    try {if((await fetch(base+'/')).ok){running=true;break;}}catch{}
    await pause(100);
  }
  assert(running,'npm dev server must accept connections');
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const page=await browser.newPage({viewport:{width:1440,height:900}});
  page.on('pageerror',error=>errors.push(error.message));
  page.on('console',message=>{if(message.type()==='error'&&!/favicon\.ico|404 \(Not Found\)/i.test(message.text()))errors.push(message.text());});
  // Deterministic API fixtures validate UI states even if third-party services
  // are unavailable in CI. Production still uses real Open-Meteo/OSM endpoints.
  await page.route('https://geocoding-api.open-meteo.com/**',route=>route.fulfill({
    status:200,contentType:'application/json',body:JSON.stringify({results:[{
      name:'Sydney',admin1:'New South Wales',country:'Australia',latitude:-33.87,longitude:151.21
    }]})
  }));
  await page.route('https://api.open-meteo.com/**',route=>route.fulfill({
    status:200,contentType:'application/json',body:JSON.stringify({
      current:{temperature_2m:23.4,relative_humidity_2m:56,apparent_temperature:24.1,weather_code:2,wind_speed_10m:13.5,time:'2026-10-30T15:00'},
      daily:{time:['2026-10-30','2026-10-31','2026-11-01'],weather_code:[2,1,3],
        temperature_2m_max:[25,26,24],temperature_2m_min:[17,16,18]}
    })
  }));
  await page.goto(base+'/',{waitUntil:'domcontentloaded'});
  assert.equal(await page.title(),'Clyra — Response & Activity Design Kit');
  const welcome=await page.evaluate(()=>{const r=document.querySelector('#demoComposer').getBoundingClientRect();return {centerY:r.y+r.height/2,width:r.width,viewH:innerHeight}});
  assert(welcome.centerY>welcome.viewH*.32&&welcome.centerY<welcome.viewH*.68,'Welcome composer must start centred');
  assert(welcome.width<=590,'Welcome composer must be narrower than 760px chat lane');
  await page.screenshot({path:join(shots,'00-welcome-centered.png')});
  await page.locator('#demoInput').fill('Build a short report, slides and a small UI demo');
  await page.locator('#demoSend').click();
  assert(await page.locator('#demoComposerDock').evaluate(el=>el.classList.contains('is-active')),'Dock should enter active state after submission');
  await page.locator('.c-todo-v8-trigger').waitFor({timeout:15000});
  await page.waitForTimeout(700);
  assert(await page.locator('.c-todo-v8-trigger').getAttribute('aria-expanded')==='false','Todo starts collapsed and opens on hover or click');
  assert.equal(await page.locator('.c-todo-progress-svg .c-todo-progress-value').count(),1,'Circular SVG progress must be present');
  const geometry=await page.evaluate(()=>{
    const box=selector=>{const el=document.querySelector(selector);const r=el.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom};};
    return {dock:box('#demoComposerDock'),todo:box('.c-todo-v8'),composer:box('#demoComposer'),send:box('#demoSend'),hint:box('.c-demo-composer-hint')};
  });
  assert(Math.abs((geometry.todo.x+geometry.todo.width/2)-(geometry.composer.x+geometry.composer.width/2))<4,'Todo and composer must share center');
  assert(geometry.composer.y>=geometry.todo.bottom+5,'Todo must sit directly above the composer');
  assert(geometry.send.bottom<=geometry.composer.bottom-4&&geometry.send.y>=geometry.composer.y+3,'Send button must stay inside composer');
  assert(geometry.hint.bottom<=geometry.composer.bottom-3,'Keyboard hint must stay inside composer');
  await page.screenshot({path:join(shots,'01-desktop-composer-todo.png')});
  const todo=page.locator('.c-todo-v8-trigger');
  await page.mouse.move(15,15);await page.waitForTimeout(240);
  assert.equal(await todo.getAttribute('aria-expanded'),'false','Todo starts as horizontal pill');
  const todoWidth=await page.locator('.c-todo-v8').evaluate(el=>el.getBoundingClientRect().width);
  await todo.hover();
  assert.equal(await todo.getAttribute('aria-expanded'),'true','Mouse hover should temporarily reveal checklist');
  await page.mouse.move(15,15);
  assert.equal(await todo.getAttribute('aria-expanded'),'false','Mouse leave should collapse unpinned checklist');
  const collapsedWidth=await page.locator('.c-todo-v8').evaluate(el=>el.getBoundingClientRect().width);
  assert(Math.abs(todoWidth-collapsedWidth)<2,'Collapsed todo must retain horizontal pill width');
  assert(await page.locator('.c-todo-v8-title').isVisible(),'Collapsed todo must retain visible text label');
  const pillText=await page.locator('.c-todo-v8-title').evaluate(el=>({opacity:getComputedStyle(el).opacity,width:el.getBoundingClientRect().width}));
  assert(Number(pillText.opacity)>0.9&&pillText.width>25,'Collapsed plan label cannot be hidden');
  await todo.click();
  assert.equal(await todo.getAttribute('aria-expanded'),'true','Click pins plan');
  await page.mouse.move(15,15);
  assert.equal(await todo.getAttribute('aria-expanded'),'true','Pinned plan stays open after hover leaves');
  await page.mouse.click(15,15);
  assert.equal(await todo.getAttribute('aria-expanded'),'false','Clicking outside dismisses pinned plan');
  const browserViewport=page.locator('.c-browser-v18');
  await browserViewport.waitFor({state:'attached',timeout:120000});
  assert(!(await browserViewport.evaluate(el=>el.classList.contains('is-agent-working'))),'Browser preview must begin with grey shimmer');
  await browserViewport.locator('.c-browser-blue-field').waitFor({state:'attached'});
  await page.waitForTimeout(900);
  assert(!(await browserViewport.evaluate(el=>el.classList.contains('is-agent-working'))),'Grey shimmer must last approximately 3 seconds');
  await page.waitForFunction(()=>document.querySelector('.c-browser-v18')?.classList.contains('is-agent-working'),undefined,{timeout:7000});
  await page.screenshot({path:join(shots,'01-browser-blue-cursor.png')});
  await page.locator('.c-browser-action-list .c-browser-action').nth(3).waitFor({state:'attached',timeout:120000});
  await page.waitForTimeout(500);
  const browserScroll=await page.locator('.c-browser-action-list').evaluate(el=>({scroll:el.scrollTop,scrollHeight:el.scrollHeight,clientHeight:el.clientHeight}));
  assert(browserScroll.scrollHeight>browserScroll.clientHeight,'Browser actions should overflow after three rows');
  assert(browserScroll.scroll>0,'Browser action list should automatically follow later rows');
  assert.equal(await page.locator('.c-reconnect').count(),0,'Reconnect activity removed from demo');
  await page.locator('.c-writing-card').waitFor({state:'visible',timeout:220000});
  assert(await page.locator('.c-browser-toggle').getAttribute('aria-expanded')==='false','Browser preview should collapse after ~10s');
  const writing=page.locator('.c-writing-card');
  assert.equal(await writing.locator('[aria-label="Expand writing"]').count(),0,'No document expand dropdown');
  assert(!(await writing.evaluate(el=>el.classList.contains('is-document-folded'))),'Document is never folded');
  await writing.locator('[aria-label="Edit writing"]').click();
  assert(await writing.evaluate(el=>el.classList.contains('is-expanded')),'Editing enters fullscreen document');
  await page.screenshot({path:join(shots,'02-document-editor.png')});
  assert.equal(await writing.locator('[aria-label="Document content"]').getAttribute('contenteditable'),'true');
  await writing.locator('[aria-label="Document content"]').click();
  assert((await writing.locator('[aria-label="Document content"]').count())===1);
  await writing.locator('[aria-label="Finish editing writing"]').click();
  assert(!(await writing.evaluate(el=>el.classList.contains('is-expanded'))),'Done closes fullscreen document');
  await page.locator('.c-slides-v14').waitFor({state:'visible',timeout:170000});
  const slides=page.locator('.c-slides-v14');
  assert((await slides.locator('.c-slide-mini').count())>=3,'Miniature slide thumbnails exist');
  await slides.locator('[aria-label="Edit slides"]').click();
  assert(await slides.evaluate(el=>el.classList.contains('is-slide-fullscreen')),'Edit should enter fullscreen automatically');
  assert.equal(await slides.locator('.c-slide-menu-trigger').count(),9,'Nine Slides-like menus should be available');
  await slides.locator('[aria-label="File menu"]').click();
  // Wait for the menu's CSS visibility transition before checking the interactive item.
  const downloadJSON=slides.locator('.c-slide-menu-item.is-open [role="menuitem"]').filter({hasText:'Download JSON'});
  await downloadJSON.waitFor({state:'visible',timeout:6500});
  assert(await downloadJSON.isVisible(),'File menu should offer download');
  await slides.locator('[aria-label="File menu"]').click();
  await slides.locator('[aria-label="New slide"]').click();
  assert((await slides.locator('.c-slide-mini').count())>=4,'New slide inserted');
  await slides.locator('[aria-label="Shapes & tables"]').click();
  await slides.locator('[aria-label="Insert rectangle"]').click();
  assert((await slides.locator('.c-slide-object-rect').count())>=1,'Shape inserted');
  assert((await slides.locator('.c-slide-layer-item').count())>=1,'Object layers visible');
  await slides.locator('[aria-label="Objects"]').click();
  await slides.locator('[aria-label="Duplicate object"]').click();
  assert((await slides.locator('.c-slide-object-rect').count())>=2,'Shape duplication');
  await slides.locator('[aria-label="Objects"]').click();
  await slides.locator('[aria-label="Bring object forward"]').click();
  await slides.locator('[aria-label="Insert menu"]').click();
  await slides.locator('.c-slide-menu-item.is-open [role="menuitem"]').filter({hasText:'3 × 3 table'}).click();
  assert.equal(await slides.locator('.c-slide-native-cell').count(),9,'Insert table should create nine editable cells');
  await slides.locator('[aria-label="Slide menu"]').click();
  await slides.locator('.c-slide-menu-item.is-open [role="menuitem"]').filter({hasText:'Blank layout'}).click();
  assert.equal(await slides.locator('.c-slide-canvas').getAttribute('data-layout'),'blank','Slide layouts should change the actual canvas');
  await slides.locator('[aria-label="Insert image"]').click();
  const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRycAAAAASUVORK5CYII=','base64');
  await slides.locator('.c-slide-image-picker').setInputFiles({name:'test.png',mimeType:'image/png',buffer:png});
  await slides.locator('img.c-slide-object-image').waitFor({state:'attached',timeout:6000});
  assert((await slides.locator('img.c-slide-object-image').count())===1,'Image inserted');
  await page.screenshot({path:join(shots,'03-slide-editor.png')});
  await slides.locator('[aria-label="Speaker notes"]').click();
  assert(await slides.locator('.c-slide-v14-notes').evaluate(el=>el.classList.contains('is-visible')),'Notes opened');
  assert(await slides.evaluate(el=>el.classList.contains('is-slide-fullscreen')),'Editor remains full screen');
  await slides.locator('[aria-label="Close full screen"]').click();
  assert(!(await slides.evaluate(el=>el.classList.contains('is-slide-fullscreen'))),'Close X exits full screen');
  await page.locator('.c-music-island').waitFor({state:'visible',timeout:150000});
  const weather=page.locator('.c-weather-card');
  await weather.waitFor({state:'attached',timeout:30000});
  await weather.locator('.c-geo-search-input').fill('Sydney');
  await weather.locator('.c-geo-search button[type="submit"]').click();
  await weather.locator('.c-geo-choice').first().click();
  await page.waitForFunction(()=>document.querySelector('.c-weather-temperature')?.textContent==='23°',undefined,{timeout:6000});
  assert.equal(await weather.locator('.c-weather-day').count(),3,'Three weather forecast days should render');
  const map=page.locator('.c-location-card');await map.waitFor({state:'attached'});
  assert((await map.locator('iframe').getAttribute('src')).includes('openstreetmap.org/export/embed.html'),'Map must show a real OpenStreetMap URL');
  await map.locator('[aria-label="Expand map"]').click();
  assert(await map.evaluate(el=>el.classList.contains('is-map-fullscreen')),'Map expands to screen');
  await map.locator('[aria-label="Zoom in"]').click();
  await map.locator('[aria-label="Close map"]').click();
  assert(!(await map.evaluate(el=>el.classList.contains('is-map-fullscreen'))),'Map closes with X');
  await page.screenshot({path:join(shots,'07-weather-map.png')});
  const player=page.locator('.c-music-island');
  const initialTrack=await player.locator('.c-island-track').innerText();
  await player.locator('[aria-label="Show song queue"]').click();
  assert.equal(await player.locator('.c-music-queue-item').count(),3,'Song queue must render three selectable songs');
  await player.locator('[aria-label="Next track; hold to fast forward"]').click();
  assert.notEqual(await player.locator('.c-island-track').innerText(),initialTrack,'Music next skips to a different track');
  await player.locator('[aria-label="Previous track or restart; hold to rewind"]').click();
  assert.equal(await player.locator('.c-island-track').innerText(),initialTrack,'Music previous returns to prior track');
  assert.equal(await player.locator('.c-island-control[title],.c-island-control[data-tooltip]').count(),0,'Music must show no hover name box');
  await player.locator('.c-music-queue-item').nth(2).click();
  assert.equal(await player.locator('.c-island-track').innerText(),'Soft Focus','Queue selection changes the track');
  await player.locator('[aria-label="Hide song queue"]').click();
  await page.locator('.c-sources-inline-trigger').waitFor({state:'visible',timeout:220000});
  const sources=page.locator('.c-sources-inline-trigger');
  assert.equal(await sources.getAttribute('aria-expanded'),'false');
  await sources.click();
  assert.equal(await sources.getAttribute('aria-expanded'),'true');
  assert.equal(await sources.getAttribute('aria-label'),'Hide sources','Chevron control should announce collapse');
  assert((await page.locator('.c-sources-inline-link').count())>=3,'Sources render website links');
  await page.waitForTimeout(750); // Compare stable icon positions after the intentional reveal transition finishes.
  const beforeSlots=await page.locator('.c-sources-inline-slot').evaluateAll(els=>els.map(el=>Math.round(el.getBoundingClientRect().x)));
  await page.locator('.c-sources-inline-link').first().hover();
  await page.waitForTimeout(450);
  const pillWidth=await page.locator('.c-sources-inline-link').first().evaluate(el=>el.getBoundingClientRect().width);
  const afterSlots=await page.locator('.c-sources-inline-slot').evaluateAll(els=>els.map(el=>Math.round(el.getBoundingClientRect().x)));
  assert.deepEqual(afterSlots,beforeSlots,'Hovered source must not shift any neighbouring icons');
  await page.screenshot({path:join(shots,'04-sources-expanded.png')});
  const pill=page.locator('.c-sources-inline-site').first();
  assert(await pill.evaluate(el=>getComputedStyle(el).opacity)>0.5,'Website label pill must appear on hover');
  const href=await page.locator('.c-sources-inline-link').first().getAttribute('href');
  assert(href?.startsWith('https://'),'Sources have external URLs');
  await sources.click();
  assert.equal(await sources.getAttribute('aria-expanded'),'false');
  const rich=page.locator('.c-rich-response');await rich.waitFor({state:'attached',timeout:120000});
  assert((await rich.locator('math').count())>=4,'Math fractions, calculus, matrices and sums must render as MathML');
  assert((await rich.locator('.c-rich-table tbody tr').count())===3,'Structured table must contain rows');
  assert((await rich.locator('.c-rich-chart-row').count())===2,'Compact chart must render');
  await rich.locator('button').filter({hasText:'Try LaTeX'}).click();
  assert(await rich.locator('.c-rich-tex-input').isVisible(),'LaTeX editor opens on demand');
  await page.screenshot({path:join(shots,'06-rich-response-maths.png')});
  assert.equal(await page.locator('.c-footer-actions [aria-label="Regenerate response"]').count(),1);
  // Check responsive layout after completing the same live session.
  await page.setViewportSize({width:390,height:844});
  assert.equal(await page.locator('#demoComposer').count(),1,'Demo-only composer present');
  await page.waitForTimeout(300);
  const mobileDock=await page.evaluate(()=>{
    const c=document.querySelector('#demoComposer').getBoundingClientRect();
    const p=document.querySelector('.c-todo-v8').getBoundingClientRect();
    const send=document.querySelector('#demoSend').getBoundingClientRect();
    return {todoCenter:p.x+p.width/2,composerCenter:c.x+c.width/2,composerBottom:c.bottom,sendBottom:send.bottom,viewportHeight:innerHeight};
  });
  assert(Math.abs(mobileDock.todoCenter-mobileDock.composerCenter)<4,'Mobile todo/composer centered');
  assert(mobileDock.sendBottom<mobileDock.composerBottom&&mobileDock.composerBottom<=mobileDock.viewportHeight,'Mobile controls contained');
  await page.screenshot({path:join(shots,'05-mobile-composer-todo.png')});
  const sizes=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,inner:window.innerWidth}));
  assert(sizes.scroll<=sizes.inner+2,'Mobile document must not overflow horizontally: '+JSON.stringify(sizes));

  // v20: verify genuine resized document and presentation, not an isolated mock.
  const viewports=[[280,700],[320,568],[360,740],[390,844],[430,900],[600,800],
    [768,1024],[1024,768],[1440,900],[1920,1080],[800,360]];
  const fits=async(selector,label)=>{
    const b=await page.evaluate(s=>{
      const r=document.querySelector(s)?.getBoundingClientRect();
      return {w:innerWidth,scroll:document.documentElement.scrollWidth,
        x:r?.x,right:r?.right,width:r?.width};
    },selector);
    assert(b.scroll<=b.w+2,label+' horizontally scrolls: '+JSON.stringify(b));
    assert(b.width>0&&b.x>=-3&&b.right<=b.w+3,label+' outside screen: '+JSON.stringify(b));
  };
  await slides.locator('[aria-label="Full screen"]').click();
  for(const [width,height] of viewports){
    await page.setViewportSize({width,height});
    await page.waitForTimeout(80);
    await fits('.c-slides-v14.is-slide-fullscreen','Slides '+width+'x'+height);
    if([280,390,768,1440].includes(width))
      await page.screenshot({path:join(shots,'v20-slides-'+width+'.png')});
  }
  await slides.locator('[aria-label="Close full screen"]').click();
  await writing.locator('[aria-label="Full screen writing"]').click();
  for(const [width,height] of [[280,700],[320,568],[390,844],[800,360],[1440,900]]){
    await page.setViewportSize({width,height});
    await page.waitForTimeout(80);
    await fits('.c-writing-card.is-expanded','Document '+width+'x'+height);
    if([280,390,1440].includes(width))
      await page.screenshot({path:join(shots,'v20-doc-'+width+'.png')});
  }
  await page.keyboard.press('Escape');
  assert(!(await writing.evaluate(el=>el.classList.contains('is-expanded'))),
    'Escape closes fullscreen document');
  await page.setViewportSize({width:390,height:844});
  await fits('.c-weather-card','Mobile weather');
  await fits('.c-location-card','Mobile map');
  await page.locator('.c-location-card [aria-label="Expand map"]').click();
  await fits('.c-location-card.is-map-fullscreen','Fullscreen map');
  await page.keyboard.press('Escape');
  assert.equal(errors.length,0,'Uncaught browser errors: '+errors.join('\n'));
  console.log('PASS: desktop/mobile UI, task disclosure, composer, document, slide tools, source links, response actions, no runtime errors');
} finally {
  await browser?.close();
  server.kill('SIGTERM');
}

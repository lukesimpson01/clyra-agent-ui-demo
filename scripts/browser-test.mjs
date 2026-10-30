// Real Chromium interaction test. CI-only: Playwright is installed in the
// workflow; npm run dev remains dependency-free.
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {setTimeout as pause} from 'node:timers/promises';
import {chromium} from 'playwright';
const port=52681,base='http://localhost:'+port;
const server=spawn(process.execPath,['server.js'],{cwd:new URL('../',import.meta.url),env:{...process.env,PORT:String(port)},stdio:['ignore','pipe','pipe']});
let log='';server.stderr.on('data',chunk=>log+=chunk);
let browser;
const errors=[];
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
  page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
  await page.goto(base+'/',{waitUntil:'domcontentloaded'});
  assert.equal(await page.title(),'Clyra — Response & Activity Design Kit');
  await page.locator('#demoInput').fill('Build a short report, slides and a small UI demo');
  await page.locator('#demoSend').click();
  await page.locator('.c-todo-v8-trigger').waitFor({timeout:15000});
  await page.waitForTimeout(700);
  assert(await page.locator('.c-todo-v8-trigger').getAttribute('aria-expanded')==='true','Todo should unfold when task starts');
  const todo=page.locator('.c-todo-v8-trigger');
  await todo.click();
  assert.equal(await todo.getAttribute('aria-expanded'),'false');
  await todo.click();
  assert.equal(await todo.getAttribute('aria-expanded'),'true');
  await page.locator('.c-writing-card').waitFor({state:'visible',timeout:220000});
  const writing=page.locator('.c-writing-card');
  await writing.locator('[aria-label="Edit writing"]').click();
  assert.equal(await writing.locator('[aria-label="Document content"]').getAttribute('contenteditable'),'true');
  await writing.locator('[aria-label="Document content"]').click();
  assert((await writing.locator('[aria-label="Document content"]').count())===1);
  await writing.locator('[aria-label="Edit writing"]').click();
  await page.locator('.c-slides-v14').waitFor({state:'visible',timeout:170000});
  const slides=page.locator('.c-slides-v14');
  assert((await slides.locator('.c-slide-mini').count())>=3,'Miniature slide thumbnails exist');
  await slides.locator('[aria-label="Edit slides"]').click();
  await slides.locator('[aria-label="New slide"]').click();
  assert((await slides.locator('.c-slide-mini').count())>=4,'New slide inserted');
  await slides.locator('[aria-label="Insert rectangle"]').click();
  assert((await slides.locator('.c-slide-object-rect').count())>=1,'Shape inserted');
  await slides.locator('[aria-label="Speaker notes"]').click();
  assert(await slides.locator('.c-slide-v14-notes').evaluate(el=>el.classList.contains('is-visible')),'Notes opened');
  await slides.locator('[aria-label="Full screen"]').click();
  assert(await slides.evaluate(el=>el.classList.contains('is-slide-fullscreen')),'Slide fullscreen entered');
  await page.keyboard.press('Escape');
  assert(!(await slides.evaluate(el=>el.classList.contains('is-slide-fullscreen'))),'Escape exited fullscreen');
  await page.locator('.c-sources-inline-trigger').waitFor({state:'visible',timeout:220000});
  const sources=page.locator('.c-sources-inline-trigger');
  assert.equal(await sources.getAttribute('aria-expanded'),'false');
  await sources.click();
  assert.equal(await sources.getAttribute('aria-expanded'),'true');
  assert((await page.locator('.c-sources-inline-link').count())>=3,'Sources render website links');
  const href=await page.locator('.c-sources-inline-link').first().getAttribute('href');
  assert(href?.startsWith('https://'),'Sources have external URLs');
  await sources.click();
  assert.equal(await sources.getAttribute('aria-expanded'),'false');
  assert.equal(await page.locator('.c-footer-actions [aria-label="Regenerate response"]').count(),1);
  // Check responsive layout after completing the same live session.
  await page.setViewportSize({width:390,height:844});
  await page.waitForTimeout(300);
  const sizes=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,inner:window.innerWidth}));
  assert(sizes.scroll<=sizes.inner+2,'Mobile document must not overflow horizontally: '+JSON.stringify(sizes));
  assert.equal(errors.length,0,'Uncaught browser errors: '+errors.join('\n'));
  console.log('PASS: desktop/mobile UI, task disclosure, composer, document, slide tools, source links, response actions, no runtime errors');
} finally {
  await browser?.close();
  server.kill('SIGTERM');
}

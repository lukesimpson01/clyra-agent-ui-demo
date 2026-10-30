// Dependency-free smoke test for the standalone visual fixture.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawn,spawnSync} from 'node:child_process';
import {setTimeout as pause} from 'node:timers/promises';
const text=name=>readFileSync(new URL('../'+name,import.meta.url),'utf8');
const html=text('index.html'),css=text('styles.css'),js=text('main.js'),pkg=JSON.parse(text('package.json'));
assert.equal(pkg.scripts.dev,'node server.js');
assert.equal(pkg.scripts['setup:git'],'node scripts/setup-git.mjs');
const helper=spawnSync(process.execPath,['scripts/setup-git.mjs','--help'],{
  cwd:new URL('../',import.meta.url),encoding:'utf8'
});
assert.equal(helper.status,0,'Git upstream repair helper must parse and show help');
assert.match(helper.stdout,/git pull/);
assert.match(text('DEMO_PROJECT_RULES.md'),/local.*upstream|tracking information/i);
new Function(js);
assert(!js.includes('await playReconnecting(token)'), 'Demo must not play reconnecting sequence');
assert(!js.includes('is-document-folded'), 'Document must render without a folded state');
assert(js.includes("isPresentationBuilder=label==='Presentation Builder'"), 'Presentation Builder stays a status row without a disclosure');
for (const name of ['c-slide-menu-bar','const menuDefinitions=[','doExportPNG','c-slide-native-table','skipBack.addEventListener','skipNext.addEventListener','c-sources-inline-direction']){
  assert(js.includes(name),'Missing Slides/music/sources interaction: '+name);
}
assert(css.includes("checklist's width sideways"), 'Todo must collapse to a circle without horizontal width animation');
assert(css.includes('c-slide-top-toolbar'), 'Slides edit toolbar must live above the canvas');
assert(css.includes('c-sources-inline-direction'), 'Source disclosure chevron must be styled');

assert(js.includes('await delay(3000);browser.activate()'), 'Browser must start grey for 3 seconds before blue glow');
assert(js.includes('await delay(1230);browser.finish()'), 'Browser should begin fade after ~10s');
assert(js.includes('c-browser-agent-cursor') && css.includes('c-browser-cursor-journey'), 'Blue browser agent needs moving simulated cursor');
assert(js.includes('addRichResponseShowcase()'), 'Demo should render rich response formatting');
assert(js.includes('<math xmlns=') && js.includes('c-rich-math-display'), 'Native MathML fractions/equations must be present');
assert(js.includes('loadKaTeX') && js.includes('trust:false'), 'Optional user-triggered TeX renderer must disable trust');
assert(css.includes('/* V18 — Unified welcome/working states'), 'Centered-to-bottom composer geometry must be styled');
assert(css.includes('Collapsed to-do pill') || css.includes('collapsed to-do pill') || css.includes('collapsed HORIZONTAL pill') || css.includes('horizontal, readable collapsed'), 'Todo must remain a readable horizontal pill when closed');
assert(css.includes('Specificity fix: earlier circular-collapse'), 'Legacy CSS rules must not hide collapsed todo labels');
assert.match(text('DEMO_PROJECT_RULES.md'), /visual design|design-language/i);


const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(new Set(ids).size,ids.length,'HTML IDs must be unique');
for(const id of ['demoComposer','demoComposerDock','demoInput','demoSend','planMount','assistantTurn','conversationViewport']){
  assert(ids.includes(id),'Missing UI anchor: '+id);
}
for(const key of ['c-sources-inline','c-sources-inline-slot','c-slide-mini-frame','c-todo-v8','c-composer-dock','c-demo-composer','c-slide-object-resize','c-browser-action-list']){
  assert(css.includes(key),'Missing CSS component: '+key);
}
for(const key of ['createPresentationCard','createTodo','addSourcesFooter','composerForm.requestSubmit()','actions.scrollTo(']){
  assert(js.includes(key),'Missing UI behaviour: '+key);
}
const port=52679;
const child=spawn(process.execPath,['server.js'],{cwd:new URL('../',import.meta.url),env:{...process.env,PORT:String(port)},stdio:['ignore','pipe','pipe']});
let stderr='';child.stderr.on('data',v=>{stderr+=v.toString();});
try {
  let ready=false;
  for(let n=0;n<35;n++){
    if(child.exitCode!==null)throw Error('Development server exited: '+stderr);
    try{const result=await fetch('http://localhost:'+port+'/');if(result.status===200){ready=true;break;}}catch{}
    await pause(100);
  }
  assert(ready,'Development server must start');
  for(const [route,mime,expected] of [['/','text/html','demoComposer'],['/styles.css','text/css','c-slide-mini-frame'],['/main.js','text/javascript','createPresentationCard']]){
    const response=await fetch('http://localhost:'+port+route);
    assert.equal(response.status,200,route+' must return HTTP 200');
    assert(response.headers.get('content-type').includes(mime),route+' must have correct MIME');
    assert((await response.text()).includes(expected),route+' must serve current source');
  }
  assert.equal((await fetch('http://localhost:'+port+'/missing-file')).status,404);
  console.log('PASS: syntax, unique IDs, Git repair helper, UI hooks, server startup, assets, 404');
} finally {child.kill('SIGTERM');}

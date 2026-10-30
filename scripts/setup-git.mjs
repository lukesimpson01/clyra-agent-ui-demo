#!/usr/bin/env node
/**
 * One-time repair for THIS DEMO repository's local Git branch tracking.
 * Safe by design: never merges, resets, pulls, overwrites or changes source files.
 * Never transplant into Clyra or another host application.
 */
import {spawnSync} from 'node:child_process';
import {realpathSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';

const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const expected='lukesimpson01/clyra-agent-ui-demo';
const url='https://github.com/'+expected+'.git';
function git(...args){return spawnSync('git',args,{cwd:root,encoding:'utf8',maxBuffer:1024*1024});}
function value(result){return (result.stdout||'').trim();}
function fail(reason){console.error('\nCould not configure Git tracking: '+reason+'\n');process.exit(1);}
function normaliseRemote(remote){
  return remote.trim().replace(/^ssh:\/\/git@github\.com\//,'github.com/')
    .replace(/^git@github\.com:/,'github.com/')
    .replace(/^https?:\/\/github\.com\//,'github.com/')
    .replace(/^git:\/\/github\.com\//,'github.com/')
    .replace(/\.git\/?$/,'').replace(/\/$/,'').toLowerCase();
}
if(process.argv.includes('--help')||process.argv.includes('-h')){
  console.log('One-time demo checkout repair: npm run setup:git');
  console.log('Afterwards: git pull && npm run dev');process.exit(0);
}
if(git('--version').status!==0)fail('Git is not installed.');
const top=git('rev-parse','--show-toplevel');
if(top.status!==0)fail('This is not a Git checkout. Clone the repository first:\n  git clone '+url+'\n  cd clyra-agent-ui-demo');
if(realpathSync(value(top))!==realpathSync(root))fail('Refusing to change a different/enclosing repository. Open the cloned demo directory.');
const branch=git('symbolic-ref','--quiet','--short','HEAD');
if(branch.status!==0)fail('HEAD is detached. Switch to the existing main branch first.');
if(value(branch)!=='main')fail('Current branch is '+value(branch)+'. Switch to main first; no branches were changed.');
const origin=git('remote','get-url','origin');
if(origin.status===0){
  if(normaliseRemote(value(origin))!=='github.com/'+expected)fail('origin points to a different repository: '+value(origin)+'\nInspect your local project rather than overwriting this remote.');
}else{
  const added=git('remote','add','origin',url);
  if(added.status!==0)fail('Could not add origin: '+(added.stderr||'').trim());
  console.log('Added missing origin: '+url);
}
console.log('Fetching origin/main from the Clyra demo repository…');
const fetched=git('fetch','origin','main');
if(fetched.status!==0)fail('Fetch failed: '+(fetched.stderr||'').trim());
if(git('rev-parse','--verify','--quiet','refs/remotes/origin/main').status!==0)fail('Could not find origin/main after fetching. Check remote configuration.');
const set=git('branch','--set-upstream-to=origin/main','main');
if(set.status!==0)fail('Could not set tracking: '+(set.stderr||'').trim());
console.log('Success: local main tracks origin/main.');
const status=git('status','--porcelain');
if(value(status))console.log('Your working tree has local changes; they were preserved. Git pull may require committing/stashing them first.');
const ahead=git('rev-list','--left-right','--count','HEAD...origin/main');
if(ahead.status===0){
  const [local,remote]=value(ahead).split(/\s+/).map(Number);
  if(local&&remote)console.log('Branches diverged ('+local+' local, '+remote+' remote commits). Resolve them before pulling.');
  else if(local)console.log(local+' local commit(s) not on GitHub were preserved.');
  else if(remote)console.log(remote+' remote commit(s) are ready to pull.');
}
console.log('\nNow run:\n  git pull\n  npm run dev\n');

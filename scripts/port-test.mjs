// Dependency-free regression for the EADDRINUSE dev-server failure.
// Reserve one port, launch the real server and verify automatic fallback.
// Does not touch user processes, ports or files outside this test run.
import assert from 'node:assert/strict';
import net from 'node:net';
import { spawn } from 'node:child_process';
import { setTimeout as pause } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const occupy = net.createServer();
await new Promise((resolve, reject) => {
  occupy.once('error', reject);
  occupy.listen(0, 'localhost', resolve);
});
const busyPort = occupy.address().port;
const child = spawn(process.execPath, ['server.js'], {
  cwd: root, env: { ...process.env, PORT: String(busyPort) }, stdio: ['ignore', 'pipe', 'pipe']
});
let output = '';
child.stdout.on('data', data => { output += data.toString(); });
child.stderr.on('data', data => { output += data.toString(); });
try {
  let actualPort;
  for (let n = 0; n < 70; n++) {
    if (child.exitCode !== null) throw new Error('Dev server exited unexpectedly:\n' + output);
    const match = output.match(/Clyra UI Demo\s*→\s*http:\/\/localhost:(\d+)\//);
    if (match) { actualPort = Number(match[1]); break; }
    await pause(100);
  }
  assert(actualPort, 'Dev server should report an available fallback URL: ' + output);
  assert(actualPort > busyPort, 'Busy port must not be reused');
  assert.match(output, /already in use/, 'Should explain why the port changed');
  assert.match(output, /using \d+ instead/, 'Should identify the fallback port');
  const base = 'http://localhost:' + actualPort;
  for (const [route, expectedType] of [['/', 'text/html'], ['/styles.css', 'text/css'], ['/main.js', 'text/javascript']]) {
    const res = await fetch(base + route);
    assert.equal(res.status, 200, route + ' should return HTTP 200');
    assert(res.headers.get('content-type')?.includes(expectedType), 'Correct MIME type for ' + route);
  }
  assert.equal((await fetch(base + '/missing-file')).status, 404);
  console.log('PASS: busy port ' + busyPort + ' automatically moved to ' + actualPort + '; assets served');
} finally {
  child.kill('SIGTERM');
  await new Promise(resolve => occupy.close(resolve));
}

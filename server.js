// Dependency-free local development server. Run: npm run dev
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const requestedPort = process.env.PORT ? Number(process.env.PORT) : 5173;
const host = 'localhost';
const maxPortAttempts = 21; // Default port plus up to 20 fallback ports.
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
};

if (!Number.isInteger(requestedPort) || requestedPort < 1 || requestedPort > 65535) {
  console.error('Invalid PORT. Use a whole number from 1 to 65535.');
  process.exit(1);
}

function serve(req, res) {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400); res.end('Bad request'); return; }
  const filename = pathname === '/' ? 'index.html' : pathname.slice(1);
  const fullpath = path.resolve(root, filename);
  if (!fullpath.startsWith(root + path.sep) || !fs.existsSync(fullpath) || !fs.statSync(fullpath).isFile()) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
    return;
  }
  res.writeHead(200, {
    'Content-Type': mime[path.extname(fullpath)] || 'application/octet-stream',
    'Cache-Control': 'no-store',
  });
  fs.createReadStream(fullpath).pipe(res);
}

function start(attempt) {
  const port = requestedPort + attempt;
  if (attempt >= maxPortAttempts || port > 65535) {
    console.error('\nCould not start the Clyra demo: ports ' + requestedPort + ' through ' + Math.min(requestedPort + maxPortAttempts - 1, 65535) + ' are unavailable.');
    console.error('Stop an old development server with Ctrl+C or set PORT=5180 npm run dev.\n');
    process.exitCode = 1;
    return;
  }
  const server = http.createServer(serve);
  server.once('error', error => {
    if (error.code === 'EADDRINUSE') {
      if (attempt === 0) console.warn('\nPort ' + port + ' is already in use. Trying another available port…');
      start(attempt + 1);
      return;
    }
    console.error('\nCould not start Clyra demo: ' + error.message + '\n');
    process.exitCode = 1;
  });
  server.listen(port, host, () => {
    console.log('\n  Clyra UI Demo  →  http://' + host + ':' + port + '/');
    if (port !== requestedPort) console.log('  (Port ' + requestedPort + ' was busy; using ' + port + ' instead.)');
    console.log('');
  });
}
start(0);

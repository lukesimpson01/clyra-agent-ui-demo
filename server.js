// Dependency-free local development server. Run: npm run dev
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const port = Number(process.env.PORT) || 5173;
const host = 'localhost';
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
};

http.createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, `http://${host}:${port}`).pathname); }
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
}).listen(port, host, () => {
  console.log(`\n  Clyra UI Demo  →  http://${host}:${port}/\n`);
});

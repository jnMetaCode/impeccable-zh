#!/usr/bin/env node

import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'build', 'web');
const port = Number(process.env.PORT) || 4173;
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8' };

if (!fs.existsSync(path.join(root, 'index.html'))) {
  console.error('Web build not found. Run `npm run web:build` first.');
  process.exit(1);
}

const server = http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
  const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const target = path.resolve(root, relative);
  const insideRoot = target === root || target.startsWith(`${root}${path.sep}`);
  if (!insideRoot || !fs.existsSync(target) || !fs.statSync(target).isFile()) {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('Not found');
    return;
  }
  response.writeHead(200, {
    'content-type': types[path.extname(target)] || 'application/octet-stream',
    'cache-control': 'no-store',
  });
  fs.createReadStream(target).pipe(response);
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Impeccable 中文 Web 端：http://127.0.0.1:${port}`);
});

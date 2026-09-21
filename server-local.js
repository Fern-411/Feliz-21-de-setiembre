const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 3001;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg'
};

const server = http.createServer((req, res) => {
  const cleanUrl = decodeURI(req.url.split('?')[0]);
  let filePath = path.join(__dirname, cleanUrl === '/' ? 'index.html' : cleanUrl);

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Archivo no encontrado');
      } else {
        res.writeHead(500);
        res.end('Error interno del servidor: ' + err.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log('========================================================');
  console.log('🌻 FLORES AMARILLAS (21 DE SEPTIEMBRE) - ASHLEY Y NEDALLY');
  console.log('========================================================');
  console.log(`🚀 Servidor local activo en: ${url}`);
  console.log('Abriendo navegador automáticamente...');
  console.log('Presiona Ctrl + C en esta terminal cuando desees detener el servidor.');
  console.log('========================================================\n');

  // Abrir navegador en Windows
  exec(`start ${url}`);
});

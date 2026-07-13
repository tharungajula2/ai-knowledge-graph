const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3005;
const ROOT = path.join(__dirname, '..');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.md': 'text/markdown',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  console.log(`[HTTP Server] Request: ${req.url}`);
  
  // Parse URL and decode it
  let filePath = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  
  // Default to index.html if pointing to directories
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }
  
  if (!fs.existsSync(filePath)) {
    res.statusCode = 404;
    res.end('File Not Found');
    return;
  }
  
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  
  res.writeHead(200, { 
    'Content-Type': contentType,
    'Access-Control-Allow-Origin': '*' // Add CORS headers for safety
  });
  
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, () => {
  console.log(`================================================================`);
  console.log(` VIZIER Brain Graph served at:`);
  console.log(` http://localhost:${PORT}/brain/viewer/index.html`);
  console.log(`================================================================`);
});

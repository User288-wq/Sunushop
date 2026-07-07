const http = require('http');

const server = http.createServer((req, res) => {
  console.log('Requête reçue');
  res.writeHead(200);
  res.end('ok');
});

server.on('error', (err) => {
  console.error('Erreur serveur:', err.code, err.message);
  process.exit(1);
});

server.on('listening', () => {
  console.log('Événement listening émis');
});

server.listen(3000, '127.0.0.1', () => {
  console.log('Callback listen : serveur en écoute sur http://127.0.0.1:3000');
});

// Forcer la sortie en cas de blocage
setTimeout(() => {
  console.log('Timeout 5s : le serveur ne répond pas ?');
}, 5000);

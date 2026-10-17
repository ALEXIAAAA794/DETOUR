const http = require("node:http");

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.end("Bonjour depuis le serveur !");
});

server.listen(3001, "127.0.0.1", () => {
  console.log("Serveur démarré sur http://127.0.0.1:3001");
});
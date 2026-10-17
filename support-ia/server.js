const http = require("node:http");

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method === "GET" && req.url === "/api/support/health") {
    res.statusCode = 200;

    res.end(JSON.stringify({
      status: "ok",
      service: "detour-support-ia"
    }));

    return;
  }

  res.statusCode = 404;

  res.end(JSON.stringify({
    error: {
      code: "NOT_FOUND",
      message: "Route introuvable."
    }
  }));
});

server.listen(3001, "127.0.0.1", () => {
  console.log("Serveur démarré sur http://127.0.0.1:3001");
});
const http = require("node:http");
function envoyerJSON(res, statut, donnees) {
  res.statusCode = statut;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(donnees));
}

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method === "GET" && req.url === "/api/support/health") {
    envoyerJSON(res, 200, {
  status: "ok",
  service: "detour-support-ia"
});

    return;
  }

  if (req.method === "POST" && req.url === "/api/support/messages") {
  let corps = "";
  let tailleRecue = 0;
  let corpsTropGrand = false;
  const tailleMaximale = 16 * 1024;

  req.setEncoding("utf8");

  req.on("error", (erreur) => {
  corps = "";

  console.error("Erreur pendant la réception :", erreur.message);

  if (!res.headersSent && !res.destroyed) {
    envoyerJSON(res, 400, {
      error: {
        code: "INVALID_REQUEST",
        message: "La réception de la requête a échoué."
      }
    });
  }
});

  req.on("data", (morceau) => {
  if (corpsTropGrand) {
    return;
  }

  tailleRecue += Buffer.byteLength(morceau, "utf8");

  if (tailleRecue > tailleMaximale) {
    corpsTropGrand = true;
    corps = "";

    envoyerJSON(res, 413, {
      error: {
        code: "PAYLOAD_TOO_LARGE",
        message: "Le corps de la requête dépasse la limite de 16 Kio."
      }
    });

    return;
  }

  corps += morceau;
});

  req.on("end", () => {
    if (corpsTropGrand) {
  return;
}
  let donnees;

  try {
    donnees = JSON.parse(corps);
  } catch (erreur) {
    envoyerJSON(res, 400, {
      error: {
        code: "INVALID_REQUEST",
        message: "Le corps de la requête doit être un JSON valide."
      }
    });
    return;
  }

  if (
  donnees === null ||
  typeof donnees !== "object" ||
  Array.isArray(donnees) ||
  typeof donnees.message !== "string"
) {
  envoyerJSON(res, 400, {
    error: {
      code: "INVALID_MESSAGE",
      message: "La requête doit contenir un message de type texte."
    }
  });
  return;
}

const message = donnees.message.trim();

if (message.length === 0 || message.length > 2000) {
  envoyerJSON(res, 400, {
    error: {
      code: "INVALID_MESSAGE",
      message: "Le message doit contenir entre 1 et 2 000 caractères."
    }
  });
  return;
}

  envoyerJSON(res, 200, {
  reply: {
    role: "assistant",
    content: "Votre message a bien été reçu : " + message
  },
  needsHumanSupport: false
});
});

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
# DÉTOUR — Support IA

## État actuel
Serveur HTTP local avec une route de vérification de fonctionnement.
Gemini, PostgreSQL et l'interface React ne sont pas encore intégrés.

## Lancement
Depuis le dossier support-ia :

```powershell
node server.js
```

## Vérifications manuelles
- GET http://127.0.0.1:3001/api/support/health
  Retourne HTTP 200 avec status: "ok".
- GET http://127.0.0.1:3001/inconnue
  Retourne HTTP 404 avec le code NOT_FOUND.

## Arrêt
Dans le terminal du serveur : Ctrl + C.
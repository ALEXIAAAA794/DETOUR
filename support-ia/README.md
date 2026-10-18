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

## Réception et validation des messages — en cours

La route POST /api/support/messages :
- Lit le corps de la requête.
- Convertit le texte JSON en objet JavaScript.
- Vérifie que message est une chaîne de caractères.
- Retire les espaces au début et à la fin.
- Accepte une longueur comprise entre 1 et 2 000 unités UTF-16,
  mesurée avec JavaScript String.length.
- Renvoie provisoirement status: "validated" et receivedMessage.

Vérifications manuelles réalisées :
- JSON invalide : refusé avec INVALID_REQUEST.
- Message numérique : refusé avec INVALID_MESSAGE.
- Espaces uniquement : refusés avec INVALID_MESSAGE.
- Message entouré d'espaces : accepté et nettoyé.
- 2 000 lettres ASCII : acceptées.
- 2 001 lettres ASCII : refusées.

Cette route locale est une étape de développement.
La limite de taille totale du corps, la gestion des erreurs de réception,
l'authentification et la réponse de l'assistant restent à implémenter.
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
- Renvoie une réponse factice dans reply avec role et content,
  ainsi que needsHumanSupport: false.
- Cette réponse est construite localement, sans appel à Gemini.
- Les identifiants de conversation et de message ne sont pas
  encore implémentés.

Vérifications manuelles réalisées :
- JSON invalide : refusé avec INVALID_REQUEST.
- Message numérique : refusé avec INVALID_MESSAGE.
- Espaces uniquement : refusés avec INVALID_MESSAGE.
- Message entouré d'espaces : accepté et nettoyé.
- 2 000 lettres ASCII : acceptées.
- 2 001 lettres ASCII : refusées.

## Limite du corps de requête

- Le corps reçu est limité à 16 384 octets (16 Kio).
- Le dépassement renvoie HTTP 413 avec PAYLOAD_TOO_LARGE.
- Le serveur cesse alors de conserver les morceaux suivants.
- Test manuel : corps supérieur à 16 Kio refusé,
  puis message normal accepté sans redémarrage du serveur.

Cette route locale est une étape de développement.
La gestion des erreurs de réception,
l'authentification et la réponse générée par Gemini.

## Erreurs de réception

Un gestionnaire de l'événement error est présent sur la requête.
Il journalise l'erreur côté serveur et tente une réponse HTTP 400
si le flux de réponse le permet.

Une requête normale a été vérifiée après cet ajout.
Le cas d'une connexion interrompue reste à tester.

## Connaissances du support

- knowledge/faq.json contient les questions-réponses de référence.
- knowledge/instructions.md définit le comportement de l'assistant,
  notamment la réponse dans la langue de l'utilisateur.
- Ces fichiers sont chargés au démarrage du serveur.
- Toute modification nécessite un redémarrage.
- Ils ne sont pas encore transmis à Gemini.
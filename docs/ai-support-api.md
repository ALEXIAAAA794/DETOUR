# DÉTOUR — Contrat d'API du support IA

Statut : contrat retenu pour le bloc support IA.
L'authentification réelle est raccordée lors de l'intégration.

## 1. Convention générale

Préfixe : /api/support
Format des corps JSON : application/json
Dates : ISO 8601 en UTC
Identifiants : chaînes opaques générées par le serveur

Toutes les routes nécessitent une identité utilisateur vérifiée.

## 2. Raccordement à l'authentification

Un middleware commun vérifie le jeton avant l'exécution des routes
du support et fournit cette structure interne :

```js
req.auth = {
  userId: "identifiant-utilisateur-stable"
};
```

Cette structure est définie côté serveur.
Elle ne doit jamais être acceptée directement depuis un corps JSON,
un paramètre ou un en-tête choisi librement par le navigateur.

Le responsable de l'intégration adapte l'identité issue du système
d'authentification commun à ce format.

Le service AWS exact, le type de jeton et son transport seront
documentés lors du raccordement. Le bloc ne suppose pas que le
jeton est nécessairement un jeton Cognito.

Si req.auth.userId est absent ou invalide :
HTTP 401 / UNAUTHENTICATED.

Toute lecture, écriture ou suppression vérifie que la conversation
appartient à cet utilisateur.

## 3. Envoyer un message

POST /api/support/messages

### Requête

```json
{
  "conversationId": null,
  "message": "Comment demander un voyage ?"
}
```

- conversationId : null pour créer une conversation, sinon identifiant
  d'une conversation existante appartenant à l'utilisateur.
- message : chaîne de 1 à 2 000 caractères après suppression des espaces
  en début et fin.
- Le serveur récupère lui-même l'historique.
- Le navigateur ne fournit ni userId, ni rôle, ni instructions système.

### Réponse — HTTP 200

```json
{
  "conversationId": "identifiant-conversation",
  "reply": {
    "id": "identifiant-message-assistant",
    "role": "assistant",
    "content": "Vous pouvez soumettre votre demande depuis le formulaire client.",
    "createdAt": "2026-10-17T10:00:00Z"
  },
  "needsHumanSupport": false
}
```

needsHumanSupport indique qu'une intervention humaine est conseillée.
Ce champ ne signifie pas qu'un gestionnaire a été contacté.

### En cas d'échec du fournisseur IA

- La route renvoie HTTP 503 / AI_UNAVAILABLE.
- Aucun faux message de réussite n'est enregistré.
- L'échange utilisateur/assistant est enregistré après obtention
  d'une réponse exploitable.
- Un nouvel essai après cette erreur explicite ne doit donc pas
  dupliquer un message utilisateur déjà enregistré.

Le traitement des répétitions après une interruption réseau ambiguë
n'est pas garanti dans cette première version.

## 4. Lister les conversations

GET /api/support/conversations?limit=20&offset=0

- limit : entier de 1 à 100, valeur par défaut 20.
- offset : entier positif ou nul, valeur par défaut 0.
- Tri : updatedAt décroissant, puis id décroissant en cas d'égalité.
- Seules les conversations de l'utilisateur sont retournées.
- Les conversations expirées ne sont jamais retournées.

### Réponse — HTTP 200

```json
{
  "conversations": [
    {
      "id": "identifiant-conversation",
      "updatedAt": "2026-10-17T10:00:00Z"
    }
  ],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "hasMore": false
  }
}
```

## 5. Consulter les messages

GET /api/support/conversations/:conversationId/messages?limit=50&offset=0

- limit : entier de 1 à 100, valeur par défaut 50.
- offset : entier positif ou nul, valeur par défaut 0.
- Tri : createdAt croissant, puis ordre d'insertion en cas d'égalité.
- Les rôles exposés sont uniquement user et assistant.
- Les instructions internes ne sont pas retournées.

### Réponse — HTTP 200

```json
{
  "conversationId": "identifiant-conversation",
  "messages": [
    {
      "id": "identifiant-message",
      "role": "user",
      "content": "Comment demander un voyage ?",
      "createdAt": "2026-10-17T10:00:00Z"
    }
  ],
  "pagination": {
    "limit": 50,
    "offset": 0,
    "hasMore": false
  }
}
```

## 6. Supprimer une conversation

DELETE /api/support/conversations/:conversationId

Réponse : HTTP 204, sans corps.

- La conversation et ses messages sont supprimés.
- Seul son propriétaire peut effectuer cette opération.

## 7. Format commun des erreurs

```json
{
  "error": {
    "code": "INVALID_MESSAGE",
    "message": "Le message doit contenir entre 1 et 2 000 caractères."
  }
}
```

| HTTP | Code | Situation |
|---|---|---|
| 400 | INVALID_MESSAGE | Message absent, invalide ou trop long |
| 400 | INVALID_REQUEST | Identifiant ou paramètres de pagination invalides |
| 401 | UNAUTHENTICATED | Identité vérifiée absente ou invalide |
| 404 | CONVERSATION_NOT_FOUND | Conversation absente, expirée ou inaccessible |
| 429 | RATE_LIMITED | Limite de demandes atteinte |
| 503 | AI_UNAVAILABLE | Fournisseur IA indisponible ou réponse inexploitable |
| 500 | INTERNAL_ERROR | Erreur interne inattendue |

Les réponses d'erreur n'exposent ni clé, ni jeton, ni trace technique.

## 8. Conservation

- L'expiration est fixée à 30 jours après le dernier message enregistré.
- Une lecture ne prolonge pas ce délai.
- Une conversation expirée est immédiatement inaccessible via l'API.
- Une tâche quotidienne supprime les conversations expirées et leurs
  messages de la base.
- La suppression physique intervient donc au plus tard lors de
  l'exécution quotidienne suivante.
- Le fonctionnement de cette tâche doit être documenté et testé.

## 9. Mode de développement local

- Un mode explicitement activé peut fournir une identité fictive
  côté serveur.
- Il utilise uniquement une base de test.
- Il est désactivé par défaut.
- Le serveur refuse de démarrer en production si ce mode est activé.
- Aucun jeton fictif ne doit être accepté en fonctionnement normal.

## 10. Raccordement attendu à la livraison

Le responsable de l'intégration :
- Branche le middleware d'authentification avant les routes du support.
- Fournit req.auth.userId à partir d'une identité vérifiée.
- Configure le transport de l'authentification côté React.
- Vérifie l'intégration avec deux comptes distincts.

Le bloc support fournit :
- Les routes, le stockage et les contrôles de propriété.
- Le chat React et son client API.
- La configuration d'exemple sans secrets.
- Les tests et les instructions de lancement.
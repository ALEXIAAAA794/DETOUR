# DÉTOUR — Support IA

## Objectif

Aider les utilisateurs à comprendre le fonctionnement de DÉTOUR
à partir des informations de référence du projet.

## Périmètre du bloc

Le bloc comprend :
- Une interface de discussion React.
- Une API backend de support.
- Une connexion à l'API Gemini côté serveur.
- Une FAQ de référence et les instructions de l'assistant.
- Un historique des conversations dans PostgreSQL.
- La consultation et la suppression des conversations.
- La gestion des erreurs.
- Les tests et la documentation d'installation et d'intégration.

## Fonctionnalités de l'assistant

- Expliquer comment soumettre une demande de voyage.
- Expliquer les étapes de traitement d'une demande.
- Présenter le parcours de confirmation, paiement et facturation.
- Répondre aux questions générales couvertes par la FAQ.
- Conseiller de contacter le gestionnaire lorsqu'une intervention
  humaine ou une information supplémentaire est nécessaire.

## Limites de la première version

- Aucun accès aux réservations ou paiements réels.
- Aucune création, modification ou annulation de réservation.
- Aucune confirmation de prix, de disponibilité ou de paiement.
- Aucune personnalisation de voyage.
- Aucune politique commerciale inventée.
- Aucun contact automatique avec le gestionnaire.

## Comportement attendu

- Répondre clairement et poliment dans la langue de l'utilisateur.
- Respecter toute demande explicite de changement de langue.
- Pour un message ambigu, conserver la langue de la conversation.
- Demander une précision si la langue souhaitée est indéterminable.
- S'appuyer sur la FAQ pour les informations concernant DÉTOUR.
- Signaler lorsqu'une information manque.
- Recentrer les questions sans rapport avec le service.
- Ne pas inventer de coordonnées de contact.
- Ne pas demander de mot de passe ni de données bancaires.

Les instructions du modèle seront complétées par des tests :
elles ne garantissent pas, à elles seules, l'exactitude des réponses.

## Accès et confidentialité

- Le support est réservé aux utilisateurs connectés.
- Chaque utilisateur accède uniquement à ses conversations.
- Chaque utilisateur peut supprimer ses propres conversations.
- Les conversations et leurs messages sont supprimés automatiquement
  après 30 jours sans nouveau message.
- Cette règle concerne notre application, pas la conservation
  pratiquée par le fournisseur IA.
- La clé Gemini reste uniquement sur le serveur.

## Répartition des responsabilités

### Responsable du bloc support IA

- Développer le bloc de la base de données à l'écran React.
- Contrôler l'accès aux conversations selon l'identité vérifiée.
- Fournir un mode de démonstration local avec des données fictives.
- Documenter le raccordement au système d'authentification.
- Livrer les tests, la configuration d'exemple et les instructions
  de lancement.

### Responsable de l'intégration du projet

- Vérifier les jetons du système d'authentification commun.
- Fournir au bloc l'identité vérifiée de l'utilisateur.
- Raccorder l'interface et le backend au projet commun.
- Relire la contribution et vérifier la cohérence d'ensemble.

## Développement et démonstration

- Le bloc peut être développé sans attendre l'authentification commune.
- Un mode local explicite utilise une identité fictive côté serveur.
- Ce mode utilise uniquement des données de test.
- Il est désactivé par défaut et interdit en production.
- En fonctionnement normal, l'absence d'identité vérifiée entraîne
  un refus d'accès.

## Critères de livraison

- Le chat envoie une question et affiche une réponse.
- Les erreurs du fournisseur sont traitées sans exposer de secrets.
- L'historique est consultable par son propriétaire uniquement.
- La suppression manuelle et l'expiration sont testées.
- Les accès entre deux utilisateurs différents sont refusés.
- Les réponses sont testées sur des questions couvertes, inconnues
  et hors sujet.
- Le raccordement à l'authentification commune est documenté.
- Le README distingue les fonctions réalisées des raccordements
  restant à effectuer.
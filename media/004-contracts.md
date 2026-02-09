# 003-contracts.md

# Repo media-contracts — Organisation des contrats

Ce document décrit la structure et le rôle du repo `media-contracts`.
Ce repo est la source de vérité des interfaces entre services.

Approche : contract-first.

---

## Structure du repo

media-contracts/
├─ openapi/
│  ├─ media-api.yaml
│  └─ media-view.yaml
│
├─ events/
│  └─ MediaCreated.v1.json
│
├─ VERSIONING.md
└─ README.md

---

## OpenAPI

Deux APIs sont exposées :

- media-api (write)
- media-view (read)

Ces fichiers définissent :
- endpoints
- DTO
- erreurs
- pagination
- headers (correlationId)

Ces contrats servent à :
- générer le client TypeScript Angular
- valider les implémentations backend

---

## Events Kafka

Premier événement :

MediaCreated.v1

Contenu minimal :
- eventId
- correlationId
- occurredAt
- payload (media)

Ce schéma est utilisé par :
- media-api (publisher)
- media-worker (consumer)

---

## Versioning

Règles simples :

- v1 → version initiale
- v2 → modification non compatible
- ajout de champ → compatible
- suppression de champ → nouvelle version

Les événements sont immutables.

---

## Objectif du repo

Garantir :
- alignement entre services
- stabilité des interfaces
- génération automatique des clients
- évolution contrôlée des APIs et events

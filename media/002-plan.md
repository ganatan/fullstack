# Plan

---

## Étape 1 — Architecture

Document :
objectifs.md

Contient :
- vision de la plateforme
- services backend
- frontends Angular
- CQRS léger
- organisation multi-repo

---

## Étape 2 — Modélisation de données

Document :
003-domain-model.md

Contenu :
- entité Media
- champs métier
- structure de référence commune

Objectif :
définir le modèle de données utilisé par :
- PostgreSQL
- Kafka
- MongoDB
- OpenAPI
- Angular

---

## Étape 3 — Contracts

Créer le repo :

media-contracts

Contenu :
- openapi/media-api.yaml
- openapi/media-view.yaml
- events/MediaCreated.v1
- VERSIONING.md

Objectif :
définir les interfaces avant d’implémenter.

---

## Étape 4 — Vertical slice V1

Cas d’usage :
Admin crée un Media → User le consulte.

---

### media-api
- POST /media
- persistance PostgreSQL
- publication Kafka

---

### media-worker
- consommation Kafka
- projection Mongo
- idempotence

---

### media-view
- GET /media/{id}
- lecture Mongo

---

## Étape 5 — Front minimal

frontend-admin :
création d’un media

frontend-user :
consultation d’un media

frontend-lib :
client API généré depuis OpenAPI

---

## Étape 6 — Infrastructure dev

Repo :
media-infra

Contient :
- PostgreSQL
- Kafka
- MongoDB
- configuration locale

---

## Étape 7 — CI/CD

Pipeline :
- build
- tests
- Jacoco
- SonarQube
- Xray

Déploiement :
- Docker
- Kubernetes
- ArgoCD

---

## Résultat attendu

Une vertical slice fonctionnelle permettant :

POST /media
GET /media/{id}

avec projection Mongo via Kafka.

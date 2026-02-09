# 002-plan.md

# Plan de construction — Plateforme Media

Ce document décrit les étapes de construction de la plateforme Media
dans un ordre simple et progressif.

L’objectif est de construire une vertical slice fonctionnelle
avant d’ajouter du fonctionnel ou de la complexité.

---

## Étape 1 — Architecture

Document :
001-objectifs.md

Contient :
- vision de la plateforme
- services backend
- frontends Angular
- CQRS léger
- organisation multi-repo

---

## Étape 2 — Contracts

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

## Étape 3 — Vertical slice V1

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

## Étape 4 — Front minimal

frontend-admin :
création d’un media

frontend-user :
consultation d’un media

frontend-lib :
client API généré depuis OpenAPI

---

## Étape 5 — Infrastructure dev

Repo :
media-infra

Contient :
- PostgreSQL
- Kafka
- MongoDB
- configuration locale

---

## Étape 6 — CI/CD

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

# Plateforme Media — Architecture Fullstack CQRS

## Objectif
Construire une plateforme fullstack production‑ready basée sur :
Angular 21, Java 21, Spring Boot 3.5, Kafka, PostgreSQL, MongoDB,
Kubernetes, GitLab CI/CD, SonarQube, Xray et ArgoCD.

---

## Architecture générale

### Backend (CQRS léger)

Trois services Spring Boot :

- **media-api**
  - API REST d’écriture
  - persistance PostgreSQL
  - publication d’événements Kafka
- **media-worker**
  - consommation Kafka
  - projection vers MongoDB (read‑model)
  - idempotence et gestion d’erreurs
- **media-view**
  - API REST de lecture
  - recherche et pagination
  - MongoDB

Principes :
- SQL = source de vérité
- PostgreSQL = write model
- MongoDB = read‑model
- Kafka = journal d’événements
- services stateless
- correlationId pour la traçabilité

---

## Frontend (Angular 21)

Trois projets Angular :

- **frontend-admin**
  - écriture / administration
- **frontend-user**
  - consultation / recherche
- **frontend-lib**
  - composants UI
  - modèles DTO
  - client API généré depuis OpenAPI
  - guards et interceptors

---

## Organisation multi‑repo

frontend-admin
frontend-user
frontend-lib
media-api
media-worker
media-view
media-contracts
media-infra

---

## Contracts

Le repo **media-contracts** contient :
- OpenAPI media‑api
- OpenAPI media‑view
- schémas d’événements Kafka
- versioning des contrats

Approche contract‑first.

---

## Infrastructure

Le repo **media-infra** contient :
- manifests Kubernetes
- configuration ArgoCD
- environnement dev

Déploiement via GitOps.

---

## DevOps et qualité

Pipeline CI :
- build
- tests
- rapports JUnit
- Jacoco
- SonarQube
- import Xray

Déploiement :
- Docker
- Kubernetes
- ArgoCD

---

## Flux applicatif

Admin → media‑api → PostgreSQL
→ Kafka → media‑worker → MongoDB
→ media‑view → User

---

## Résultat attendu

Une plateforme démontrant :
- CQRS
- event‑driven architecture
- CI/CD entreprise
- GitOps
- Angular structuré
- MongoDB read‑model
- Kafka messaging


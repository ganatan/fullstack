# Plateforme Media — Architecture Fullstack CQRS

## Objectif
Construire une plateforme fullstack production‑ready basée sur :
Angular 21, Java 21, Spring Boot 3.5, Kafka, PostgreSQL, MongoDB,
Kubernetes, GitLab CI/CD, SonarQube, Xray et ArgoCD.

L’application **Media** sert de référence technique publique pour
démontrer une architecture entreprise simple, cohérente et réutilisable.

---

## Architecture générale

### Backend (CQRS léger)

Trois services Spring Boot :

- **media-command-service**
  - API REST d’écriture
  - persistance PostgreSQL
  - publication d’événements Kafka
- **media-projection-worker**
  - consommation Kafka
  - projection vers MongoDB (read‑model)
  - idempotence et gestion d’erreurs
- **media-query-service**
  - API REST de lecture
  - recherche et pagination
  - MongoDB

Principes :
- SQL = source de vérité
- MongoDB = read‑model
- Kafka = journal d’événements
- services stateless
- correlationId pour la traçabilité

---

## Frontend (Angular 21)

Trois projets Angular :

- **media-frontend-admin**
  - écriture / administration
- **media-frontend-user**
  - consultation / recherche
- **media-frontend-shared-lib**
  - composants UI
  - modèles DTO
  - client API généré depuis OpenAPI
  - guards et interceptors

---

## Organisation multi‑repo

media-frontend-admin
media-frontend-user
media-frontend-shared-lib
media-command-service
media-projection-worker
media-query-service
media-contracts
media-infra-gitops

---

## Contracts

Le repo **media-contracts** contient :
- OpenAPI command‑api
- OpenAPI query‑api
- schémas d’événements Kafka
- versioning des contrats

Approche contract‑first.

---

## Infrastructure

Le repo **media-infra-gitops** contient :
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

Admin → command‑service → PostgreSQL
→ Kafka → projection‑worker → MongoDB
→ query‑service → User

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

Cette application constitue le socle technique pour la déclinaison
du domaine **Credit** avec DB2 et contraintes métier supplémentaires.

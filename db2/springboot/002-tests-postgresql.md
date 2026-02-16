# Tests MongoDB — @DataMongoTest vs Mockito vs Testcontainers

## Objectif
Choisir une stratégie de tests cohérente pour une application Spring Boot qui utilise MongoDB.

---

## 1) Tests unitaires (Mockito)

### Ce que ça teste
- règles métier / validations / mapping (DTO -> modèle)
- orchestration (use cases / services)
- comportements d’erreur

### Ce que ça ne teste pas
- mapping Mongo (`@Document`, conversions)
- requêtes Spring Data (derivation method names)
- index, agrégations, performances

### Quand le choisir
- base de tests rapide et stable en CI
- idéal dès que tu as de la logique dans un service/use case

### Pattern
- mock du `Repository`
- assertions sur les appels et les retours
- pas de Mongo démarré

---

## 2) Tests d’intégration data (`@DataMongoTest`)

### Ce que ça teste
- mapping Mongo réel (`@Id`, `@Document`, converters)
- requêtes Spring Data (findBy..., custom queries)
- comportement proche prod (sur une DB Mongo)

### Quand le choisir
- dès que tu veux sécuriser le repository
- utile pour éviter les surprises de mapping/requêtes

### Caractéristiques
- Spring ne démarre que la “slice” Data Mongo
- plus lent que Mockito
- nécessite une Mongo accessible (local/CI) ou Testcontainers

---

## 3) Testcontainers (Mongo Docker) — le standard CI

### Pourquoi
- reproductible (Docker), pas dépendant de la machine
- se rapproche d’une vraie Mongo
- parfait pour `@DataMongoTest` ou tests d’intégration complets

### Niveau d’usage
- tests repository : `@DataMongoTest` + container Mongo
- tests end-to-end : `@SpringBootTest` + container Mongo

---

## 4) Stratégie recommandée (pragmatique)

### Base solide
- 80% tests unitaires Mockito (rapides, beaucoup de cas)
- 20% tests intégration Mongo (quelques tests repository critiques)

### Minimum viable en projet
- 1 suite Mockito sur tes services/use cases
- 1 suite `@DataMongoTest` sur chaque repository (happy path + 1 query)

---

## 5) Quel choix dans un générateur de code

- “Avec tests (@DataMongoTest)” :
  - génère des tests d’intégration de la couche Mongo
  - valide le mapping + requêtes
- “Avec tests (Mockito mock)” :
  - génère des tests unitaires de logique autour du repository
  - rapide, mais ne valide pas Mongo
- “Sans tests” :
  - aucun filet de sécurité

---

## 6) Aide au choix en 2 lignes
- CRUD simple + Spring MVC : Mockito d’abord + 1 `@DataMongoTest` pour sécuriser Mongo.
- WebFlux réactif : Mockito sur services + tests réactifs + 1 test containerisé sur repository.

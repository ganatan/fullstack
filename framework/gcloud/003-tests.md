# Architecture de Tests Angular / Spring Boot

## 1. Les différents niveaux de tests

### Tests unitaires

Objectif :

Tester une classe seule.

Angular :

- Composant
- Service
- Guard
- Interceptor
- Pipe

Spring Boot :

- Service
- Mapper
- Utilitaire
- Validator

Caractéristiques :

- Rapides
- Nombreux
- Dépendances mockées
- Pas de base de données
- Pas de serveur

Exemple :

```text
DocumentService
       |
       +--> Repository Mock
```

---

### Tests d'intégration

Objectif :

Tester plusieurs composants ensemble.

Angular :

```text
LoginComponent
       |
       v
AuthService
```

Spring Boot :

```text
DocumentController
       |
       v
DocumentService
       |
       v
DocumentRepository
```

Caractéristiques :

- Plusieurs couches réelles
- Peu ou pas de mocks
- Vérification des échanges entre composants

---

### Tests End-to-End (E2E)

Objectif :

Tester le système complet.

Exemple :

```text
Chrome
   |
frontend-admin
   |
api-gateway
   |
api-auth
   |
document-api
   |
MySQL
```

Caractéristiques :

- Simule un vrai utilisateur
- Teste l'ensemble de la plateforme
- Plus lents
- Moins nombreux

---

## 2. Outils utilisés

### Angular

Tests unitaires :

- Jasmine
- Karma
- Jest

Tests E2E :

- Cypress
- Playwright

Coverage :

- Istanbul

---

### Spring Boot

Tests unitaires :

- JUnit 5
- Mockito
- AssertJ

Tests intégration :

- SpringBootTest
- MockMvc
- Testcontainers

Coverage :

- JaCoCo

---

## 3. SonarQube

Objectif :

Mesurer :

- Coverage
- Bugs
- Vulnerabilities
- Code Smells
- Duplication

Flux :

```text
Tests
   |
Coverage
   |
SonarQube
```

Idéalement :

```text
Chaque développeur
       |
SonarQube local Docker
       |
GitLab CI
       |
SonarQube central
```

---

## 4. Architecture du projet

Applications :

```text
frontend-admin
frontend-view

api-gateway
api-auth

document-api
document-view
document-worker
```

Infrastructure :

```text
MySQL
RabbitMQ
```

Total :

```text
2 applications Angular
5 applications Spring Boot
```

---

## 5. Pipelines des applications

Chaque projet possède son propre pipeline.

### Angular

```text
install
lint
unit-test
integration-test
coverage
sonar
build
docker-build
docker-push
```

---

### Spring Boot

```text
compile
unit-test
integration-test
coverage
sonar
package
docker-build
docker-push
```

Résultat :

```text
Image Docker publiée
dans le GitLab Registry
```

---

## 6. Pourquoi Docker est indispensable

Avant Docker :

```text
Installer MySQL
Installer RabbitMQ
Installer Java
Installer Node
Configurer les ports
Démarrer les applications
```

Aujourd'hui :

```bash
docker compose up
```

Tout démarre automatiquement.

---

## 7. Les E2E ne vivent pas dans les applications

Les applications contiennent :

```text
Unit Tests
Integration Tests
Coverage
Sonar
```

Les E2E vivent généralement dans un repo dédié :

```text
document-platform-e2e
```

Structure :

```text
document-platform-e2e

.gitlab-ci.yml

docker-compose.yml

cypress/
  e2e/
    login.cy.ts
    document-create.cy.ts
    document-update.cy.ts
    document-delete.cy.ts
    logout.cy.ts
```

---

## 8. Fonctionnement des E2E

Important :

Cypress ne démarre rien.

Cypress suppose que tout fonctionne déjà.

Ordre réel :

### Étape 1

Les 7 pipelines applicatifs construisent leurs images Docker.

```text
frontend-admin
frontend-view

api-gateway
api-auth

document-api
document-view
document-worker
```

---

### Étape 2

Les images sont publiées.

```text
GitLab Registry
```

---

### Étape 3

Le pipeline E2E récupère les images.

```text
docker pull
```

---

### Étape 4

Toute la plateforme démarre.

```bash
docker compose up
```

---

### Étape 5

Cypress démarre.

```bash
npx cypress run
```

---

### Étape 6

Les scénarios métier sont exécutés.

```text
Connexion

Création document

Modification document

Suppression document

Consultation document

Déconnexion
```

---

## 9. Vision globale

```text
Développeur
     |
     v
Git Push
     |
     v

Unit Tests
     |
     v

Integration Tests
     |
     v

Coverage
     |
     v

SonarQube
     |
     v

Docker Build
     |
     v

Docker Registry
     |
     v

Docker Compose
     |
     v

Plateforme complète
     |
     v

Cypress E2E
     |
     v

Validation
```

---

## 10. Réponse entretien

Les tests unitaires vérifient une classe isolée à l'aide de mocks.

Les tests d'intégration vérifient plusieurs composants réels qui collaborent ensemble.

Les tests End-to-End vérifient le système complet déployé, depuis le navigateur jusqu'à la base de données.

Dans une architecture Angular / Spring Boot distribuée, chaque application exécute ses tests unitaires et d'intégration dans son propre pipeline GitLab. Les tests E2E sont exécutés dans un pipeline dédié après le déploiement complet de la plateforme via Docker Compose ou Kubernetes.

Les rapports Istanbul et JaCoCo sont remontés dans SonarQube afin de contrôler la qualité et la couverture du code.
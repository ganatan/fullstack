# 001-actuator.md

# Spring Boot Actuator — intégration (V1)

Objectif :
ajouter des endpoints techniques (health, info) à un service Spring Boot,
sans écrire de controller.

---

## 1) Ajouter la dépendance

### Maven (pom.xml)

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

---

## 2) Exposer les endpoints

Par défaut, Actuator expose peu d’endpoints.
On ouvre `health` et `info`.

### Option A — application.properties

```properties
management.endpoints.web.exposure.include=health,info
management.endpoint.health.show-details=always
```

### Option B — application.yml

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info
  endpoint:
    health:
      show-details: always
```

---

## 3) Démarrer l’application

```bash
mvn spring-boot:run
```

---

## 4) Tester

### Health

```bash
curl -i http://localhost:8080/actuator/health
```

Réponse attendue :

```json
{ "status": "UP" }
```

### Info

```bash
curl -i http://localhost:8080/actuator/info
```

---

## 5) Logs attendus

Au démarrage, Spring Boot affiche généralement :

- Exposing ... endpoint(s) beneath base path '/actuator'

---

## 6) Pourquoi c’est utile

- probes Kubernetes (liveness/readiness)
- monitoring
- diagnostic rapide
- standard entreprise

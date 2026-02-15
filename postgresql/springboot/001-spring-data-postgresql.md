# Spring Data MongoDB — Repository vs Reactive vs Template

## Objectif
Choisir le bon mécanisme d’accès MongoDB dans une application Spring Boot, selon le style d’I/O (MVC vs WebFlux) et la complexité des requêtes.

---

## 1) MongoRepository (Spring MVC / impératif)

### Quand l’utiliser
- Application Spring Boot REST classique (dépendance `spring-boot-starter-web`)
- CRUD standard
- Lecture/écriture synchrones

### API attendue
- `List<T>`, `Optional<T>`, `Page<T>`, `Slice<T>` (si pagination)
- Exceptions synchrones
- Transactions Mongo possibles (si cluster/replica set)

### Exemple minimal
```java
package com.ganatan.starter.api.continents;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface ContinentRepository extends MongoRepository<ContinentDoc, String> {
}
```

---

## 2) ReactiveMongoRepository (Spring WebFlux / réactif)

### Quand l’utiliser
- Application WebFlux (dépendance `spring-boot-starter-webflux`)
- Pipeline non-bloquant de bout en bout
- Gestion du backpressure, streaming, haute concurrence I/O

### API attendue
- `Mono<T>`, `Flux<T>`
- Opérateurs réactifs (`map`, `flatMap`, `filter`, `switchIfEmpty`)
- Tests réactifs via `StepVerifier`

### Exemple minimal
```java
package com.ganatan.starter.api.continents;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;

public interface ContinentRepository extends ReactiveMongoRepository<ContinentDoc, String> {
}
```

---

## 3) MongoTemplate (API bas niveau / requêtes avancées)

### Quand l’utiliser
- Requêtes complexes (criterias multiples dynamiques)
- Agrégations (`Aggregation`)
- Updates partiels (`updateFirst`, `updateMulti`)
- Optimisation fine (projection, hint, pipeline)

### Pattern recommandé
- Repository standard pour le CRUD
- + un composant dédié pour le “custom query” via `MongoTemplate`

### Exemple minimal
```java
package com.ganatan.starter.api.continents;

import java.util.List;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

@Component
public class ContinentQueries {

  private final MongoTemplate mongoTemplate;

  public ContinentQueries(MongoTemplate mongoTemplate) {
    this.mongoTemplate = mongoTemplate;
  }

  public List<ContinentDoc> findAll() {
    return mongoTemplate.findAll(ContinentDoc.class);
  }
}
```

---

## 4) Modèle Mongo : @Document, @Id, mapping

### Recommandations
- Document dédié infra (pas le domaine) si tu fais DDD/Clean
- Id en `String` (ObjectId) le plus simple
- Index explicites quand tu sais ce que tu requêtes

### Exemple
```java
package com.ganatan.starter.api.continents;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "continents")
public record ContinentDoc(
  @Id String id,
  String name
) {
}
```

---

## 5) Décision rapide
- Spring MVC + REST + CRUD → `MongoRepository`
- WebFlux → `ReactiveMongoRepository`
- Requêtes avancées → `MongoTemplate` (souvent en complément)

---

## 6) Dépendances (rappel)

### MVC + Mongo
- `spring-boot-starter-web`
- `spring-boot-starter-data-mongodb`

### WebFlux + Mongo réactif
- `spring-boot-starter-webflux`
- `spring-boot-starter-data-mongodb-reactive`

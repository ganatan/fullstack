# 005-media-api-implementation-v1.md

# Étape 5 — Implémentation media-api (V1)

Pré-requis :
- base PostgreSQL `backend_media` créée
- table `media` créée
- contrat OpenAPI `media-api.yaml` créé

Objectif :
implémenter le service `media-api` pour que `POST /admin/media` :
- insère un Media dans PostgreSQL
- retourne `{ id }` avec HTTP 201

---

## 1) Créer le repository `media-api`

Créer un nouveau projet Spring Boot (Java 21).

Dépendances minimales :
- spring-boot-starter-web
- spring-boot-starter-validation
- spring-boot-starter-data-jpa
- postgresql
- spring-boot-starter-test

---

## 2) Configurer la connexion PostgreSQL

Configurer `application.yml` (ou `application.properties`) :

- URL JDBC vers `backend_media`
- user / password
- driver PostgreSQL
- JPA en mode safe (pas de création auto des tables)

Recommandation :
- `spring.jpa.hibernate.ddl-auto=validate` (ou `none`)
- `spring.jpa.open-in-view=false`

---

## 3) Mapper la table `media` (JPA)

Créer une entité `MediaEntity` alignée sur la table SQL :

Champs :
- id : Long
- name : String
- releaseDate : LocalDate
- creationDate : OffsetDateTime (ou Instant)
- updateDate : OffsetDateTime (ou Instant)

Mapping :
- table : `media`
- colonnes : `release_date`, `creation_date`, `update_date`

---

## 4) Repository JPA

Créer `MediaRepository` :

- extends `JpaRepository<MediaEntity, Long>`

---

## 5) Service (use case create)

Créer `MediaService` :

- méthode `create(name, releaseDate)`
- validation métier simple (name non vide, releaseDate non null)
- `save()` en base
- retourner l’id créé

---

## 6) DTO API (alignés OpenAPI)

Créer :
- `MediaCreateRequestDto` : `name`, `release_date`
- `MediaCreateResponseDto` : `id`

---

## 7) Controller (contrat)

Créer un controller qui expose :

- `POST /admin/media`
- prend `MediaCreateRequestDto`
- appelle le service
- renvoie `201` avec `MediaCreateResponseDto`

---


## 8) Activation CORS (Swagger / Angular)

Swagger Editor et Angular exécutent les appels depuis un navigateur.
Le navigateur bloque les requêtes cross-origin si l’API n’autorise pas CORS.

Il faut donc ajouter une configuration CORS globale.

---

Créer le fichier :

src/main/java/com/ganatan/mediaapi/config/CorsConfig.java

```java
package com.ganatan.mediaapi.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

 @Override
 public void addCorsMappings(CorsRegistry registry) {
  registry.addMapping("/**")
    .allowedOrigins("https://editor.swagger.io", "http://localhost:4200")
    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
    .allowedHeaders("*");
 }
}
```

---

## Vérification

Redémarrer l’application Spring Boot.

Tester :
POST /admin/media via Swagger Editor.

Résultat attendu :

HTTP 201

## 9) Test manuel (Swagger)

Dans ton YAML OpenAPI, ajouter :

servers:
  - url: http://localhost:8080

Ouvrir Swagger Editor :
- coller le YAML
- sélectionner POST /admin/media
- Try it out

Body exemple :

{
  "name": "Inception",
  "release_date": "2010-07-16"
}

Résultat attendu :
- HTTP 201
- réponse : `{ "id": 1 }` (ou un autre id)

---

## 10) Vérification DB

Vérifier en SQL :

- la ligne existe dans la table `media`
- les colonnes `creation_date` et `update_date` sont remplies

---

## Fin de l’étape 5

L’étape est terminée quand :

- POST /admin/media fonctionne
- l’id est retourné
- la base contient le Media

Étape suivante :
- publier l’event Kafka `MediaCreated.v1` depuis `media-api`

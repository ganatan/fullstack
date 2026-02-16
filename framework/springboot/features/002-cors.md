# 002-cors.md

# CORS — Configuration dans Spring Boot

Objectif :
permettre à une application frontend (Swagger UI, Angular, etc.)
d’appeler une API Spring Boot depuis un autre domaine (origin).

Sans configuration CORS, le navigateur bloque les requêtes HTTP
cross-origin même si l’API fonctionne correctement.

Exemple :
Swagger Editor (https://editor.swagger.io)
→ appelle http://localhost:3000

Le navigateur bloque la requête si l’API ne renvoie pas
Access-Control-Allow-Origin.

---

## Solution recommandée — Configuration globale

Créer une configuration CORS pour toute l’application.

Fichier :
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

Cette configuration :
- autorise Swagger Editor
- autorise Angular local
- permet toutes les méthodes HTTP

---

## Alternative — Annotation sur un controller

```java
@CrossOrigin(origins = "https://editor.swagger.io")
@RestController
@RequestMapping("/admin/media")
public class MediaController {
}
```

Moins recommandé pour une API complète.

---

## Vérification

Redémarrer l’application Spring Boot.

Tester dans Swagger Editor :
POST /admin/media

Résultat attendu :
HTTP 201

---

## Bonnes pratiques

En développement :
autoriser localhost et Swagger Editor.

En production :
limiter strictement les origins autorisées.

Exemple production :

```java
.allowedOrigins("https://ganatan.com")
```

---

## Résumé

Postman fonctionne sans CORS.
Swagger UI et Angular nécessitent CORS.
Spring Boot doit explicitement autoriser les origins externes.

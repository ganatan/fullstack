# 004-springboot-cors.md — springboot-starter-cors

## Règle (5 lignes)

- Le navigateur bloque par défaut les appels **cross-origin** (même si le backend répond).
- CORS est une politique appliquée par le **navigateur**, pas par curl/Postman.
- Le backend doit renvoyer des headers : `Access-Control-Allow-Origin`, `Allow-Methods`, `Allow-Headers`.
- Les requêtes “complexes” déclenchent un **preflight** `OPTIONS`.
- Si le preflight échoue → la requête réelle n’est jamais envoyée.

---

## Objectif

Autoriser un frontend (ex: `http://localhost:4200`) à appeler l’API :

- `GET /api/ping`

CORS attendu :
- `Origin: http://localhost:4200` → OK (préflight + GET)
- autre origin → refusé par le navigateur

---

## Dépendances

### pom.xml

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-test</artifactId>
  <scope>test</scope>
</dependency>
```

---

## Controller

`src/main/java/com/ganatan/starter/api/cors/CorsController.java`

```java
package com.ganatan.starter.api.cors;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class CorsController {

    @GetMapping("/ping")
    public String ping() {
        return "pong";
    }
}
```

---

## Configuration CORS (globale)

`src/main/java/com/ganatan/starter/config/CorsConfig.java`

```java
package com.ganatan.starter.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:4200")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(false)
                .maxAge(3600);
    }
}
```

---

## Test

`src/test/java/com/ganatan/starter/api/cors/CorsControllerTests.java`

```java
package com.ganatan.starter.api.cors;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class CorsControllerTests {

    @Autowired
    private MockMvc mvc;

    @Test
    void preflight_ok_for_allowed_origin() throws Exception {
        mvc.perform(options("/api/ping")
                .header("Origin", "http://localhost:4200")
                .header("Access-Control-Request-Method", "GET"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:4200"))
                .andExpect(header().string("Vary", org.hamcrest.Matchers.containsString("Origin")));
    }

    @Test
    void get_ok_for_allowed_origin_has_cors_headers() throws Exception {
        mvc.perform(get("/api/ping")
                .header("Origin", "http://localhost:4200"))
                .andExpect(status().isOk())
                .andExpect(content().string("pong"))
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:4200"));
    }

    @Test
    void get_other_origin_no_allow_origin_header() throws Exception {
        mvc.perform(get("/api/ping")
                .header("Origin", "http://evil.local"))
                .andExpect(status().isOk())
                .andExpect(content().string("pong"))
                .andExpect(header().doesNotExist("Access-Control-Allow-Origin"));
    }
}
```

---

## Tester en ligne de commande

Preflight (simulate navigateur) :

```bash
curl -i -X OPTIONS http://localhost:3000/api/ping   -H "Origin: http://localhost:4200"   -H "Access-Control-Request-Method: GET"
```

GET avec Origin autorisée :

```bash
curl -i http://localhost:3000/api/ping -H "Origin: http://localhost:4200"
```

GET avec Origin non autorisée :

```bash
curl -i http://localhost:3000/api/ping -H "Origin: http://evil.local"
```

---

## Exécuter les tests

```bash
mvn -Dtest=CorsControllerTests test
```

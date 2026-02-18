# 007-springboot-profiles.md — springboot-starter-profiles (config + 2 approches controllers)

## Règle (5 lignes)

- Un **profile** Spring Boot active une config différente : `dev`, `prod`, etc.
- Le profile actif est `spring.profiles.active`.
- En YAML, tu peux mettre plusieurs blocs séparés par `---` (un par profile).
- En properties, tu utilises `application-dev.properties` / `application-prod.properties`.
- Tester = lancer en `dev` puis en `prod` et vérifier que les routes changent.

---

## Objectif

- `GET /api/profile` renvoie la valeur `app.profile-name` (dev/prod/default)
- Deux façons d’exposer des routes “profile-only” :
  - **Cas A** : 3 controllers différents, chargés uniquement sur leur profile
  - **Cas B** : 1 seul controller, qui renvoie 404 si le profile ne correspond pas

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

## Configuration (2 possibilités)

# Option 1 — application.yml (multi-documents)

`src/main/resources/application.yml`

```yml
server:
  port: 3000

spring:
  application:
    name: springboot-starter

app:
  profile-name: default

---

spring:
  config:
    activate:
      on-profile: dev

app:
  profile-name: dev

---

spring:
  config:
    activate:
      on-profile: prod

app:
  profile-name: prod
```

---

# Option 2 — application.properties + fichiers par profile

`src/main/resources/application.properties`

```properties
server.port=3000
spring.application.name=springboot-starter
app.profile-name=default
```

`src/main/resources/application-dev.properties`

```properties
app.profile-name=dev
```

`src/main/resources/application-prod.properties`

```properties
app.profile-name=prod
```

---

## Controller commun (dans les 2 cas)

`src/main/java/com/ganatan/starter/api/profiles/ProfileController.java`

```java
package com.ganatan.starter.api.profiles;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ProfileController {

    private final String profileName;

    public ProfileController(@Value("${app.profile-name}") String profileName) {
        this.profileName = profileName;
    }

    @GetMapping("/api/profile")
    public String profile() {
        return profileName;
    }
}
```

---

# Cas A — 3 controllers différents (chargés uniquement sur leur profile)

## Dev only

`src/main/java/com/ganatan/starter/api/profiles/ProfileDevController.java`

```java
package com.ganatan.starter.api.profiles;

import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Profile("dev")
public class ProfileDevController {

    @GetMapping("/api/profile-dev")
    public String devOnly() {
        return "dev";
    }
}
```

## Prod only

`src/main/java/com/ganatan/starter/api/profiles/ProfileProdController.java`

```java
package com.ganatan.starter.api.profiles;

import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Profile("prod")
public class ProfileProdController {

    @GetMapping("/api/profile-prod")
    public String prodOnly() {
        return "prod";
    }
}
```

## Default (ni dev ni prod)

`src/main/java/com/ganatan/starter/api/profiles/ProfileDefaultController.java`

```java
package com.ganatan.starter.api.profiles;

import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Profile("!dev & !prod")
public class ProfileDefaultController {

    @GetMapping("/api/profile-default")
    public String defaultOnly() {
        return "default";
    }
}
```

Attendu :
- profile `dev` : `/api/profile-dev` OK, `/api/profile-prod` 404, `/api/profile-default` 404
- profile `prod` : `/api/profile-prod` OK, autres 404
- sans profile : `/api/profile-default` OK, autres 404

---

# Cas B — 1 seul controller (routes toujours présentes, mais 404 si mauvais profile)

`src/main/java/com/ganatan/starter/api/profiles/ProfileRoutesController.java`

```java
package com.ganatan.starter.api.profiles;

import java.util.Set;

import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class ProfileRoutesController {

    private final Set<String> profiles;

    public ProfileRoutesController(Environment env) {
        this.profiles = Set.of(env.getActiveProfiles());
    }

    @GetMapping("/api/profile-dev")
    public String devOnly() {
        if (!profiles.contains("dev")) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "not-active-profile");
        }
        return "dev";
    }

    @GetMapping("/api/profile-prod")
    public String prodOnly() {
        if (!profiles.contains("prod")) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "not-active-profile");
        }
        return "prod";
    }

    @GetMapping("/api/profile-default")
    public String defaultOnly() {
        if (profiles.contains("dev") || profiles.contains("prod")) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "not-active-profile");
        }
        return "default";
    }
}
```

Attendu :
- les routes existent toujours, mais renvoient 404 si le profile ne matche pas

---

## Tests (simple et fiable : 2 classes)

## Dev

`src/test/java/com/ganatan/starter/api/profiles/ProfileControllerDevTests.java`

```java
package com.ganatan.starter.api.profiles;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("dev")
class ProfileControllerDevTests {

    @Autowired
    private MockMvc mvc;

    @Test
    void profile_returns_dev() throws Exception {
        mvc.perform(get("/api/profile"))
                .andExpect(status().isOk())
                .andExpect(content().string("dev"));
    }

    @Test
    void profile_dev_route_ok() throws Exception {
        mvc.perform(get("/api/profile-dev"))
                .andExpect(status().isOk())
                .andExpect(content().string("dev"));
    }

    @Test
    void profile_prod_route_404() throws Exception {
        mvc.perform(get("/api/profile-prod"))
                .andExpect(status().isNotFound());
    }

    @Test
    void profile_default_route_404() throws Exception {
        mvc.perform(get("/api/profile-default"))
                .andExpect(status().isNotFound());
    }
}
```

## Prod

`src/test/java/com/ganatan/starter/api/profiles/ProfileControllerProdTests.java`

```java
package com.ganatan.starter.api.profiles;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("prod")
class ProfileControllerProdTests {

    @Autowired
    private MockMvc mvc;

    @Test
    void profile_returns_prod() throws Exception {
        mvc.perform(get("/api/profile"))
                .andExpect(status().isOk())
                .andExpect(content().string("prod"));
    }

    @Test
    void profile_prod_route_ok() throws Exception {
        mvc.perform(get("/api/profile-prod"))
                .andExpect(status().isOk())
                .andExpect(content().string("prod"));
    }

    @Test
    void profile_dev_route_404() throws Exception {
        mvc.perform(get("/api/profile-dev"))
                .andExpect(status().isNotFound());
    }

    @Test
    void profile_default_route_404() throws Exception {
        mvc.perform(get("/api/profile-default"))
                .andExpect(status().isNotFound());
    }
}
```

## Default

`src/test/java/com/ganatan/starter/api/profiles/ProfileControllerDefaultTests.java`

```java
package com.ganatan.starter.api.profiles;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ProfileControllerDefaultTests {

    @Autowired
    private MockMvc mvc;

    @Test
    void profile_returns_default() throws Exception {
        mvc.perform(get("/api/profile"))
                .andExpect(status().isOk())
                .andExpect(content().string("default"));
    }

    @Test
    void profile_default_route_ok() throws Exception {
        mvc.perform(get("/api/profile-default"))
                .andExpect(status().isOk())
                .andExpect(content().string("default"));
    }

    @Test
    void profile_dev_route_404() throws Exception {
        mvc.perform(get("/api/profile-dev"))
                .andExpect(status().isNotFound());
    }

    @Test
    void profile_prod_route_404() throws Exception {
        mvc.perform(get("/api/profile-prod"))
                .andExpect(status().isNotFound());
    }
}
```

---

## Lancer (manuel)

Dev :

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

Prod :

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

---

## Tests

```bash
mvn -Dtest=ProfileControllerDevTests test
mvn -Dtest=ProfileControllerProdTests test
mvn -Dtest=ProfileControllerDefaultTests test
```

# 007-springboot-profiles-yml.md — springboot-starter-profiles (application.yml dev/prod)

## Règle (5 lignes)

- Un **profile** Spring Boot active une config différente : `dev`, `prod`, etc.
- Le profile actif est `spring.profiles.active`.
- `application.yml` peut contenir **plusieurs documents** séparés par `---` (un par profile).
- Les clés définies dans un profile **override** celles du bloc “default”.
- Tester = démarrer en `dev` puis en `prod` et vérifier que l’app renvoie une valeur différente.

---

## Objectif

- Même endpoint `GET /api/profile`
- En `dev` → renvoie `dev`
- En `prod` → renvoie `prod`

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

## Configuration (application.yml avec profiles)

`src/main/resources/application.yml`

```yml
server:
  port: 3000

app:
  profile-name: default

spring:
  application:
    name: springboot-starter

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

## Controller

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

## Test

`src/test/java/com/ganatan/starter/api/profiles/ProfileControllerTests.java`

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
class ProfileControllerTests {

    @Autowired
    private MockMvc mvc;

    @Test
    @ActiveProfiles("dev")
    void dev_profile_returns_dev() throws Exception {
        mvc.perform(get("/api/profile"))
                .andExpect(status().isOk())
                .andExpect(content().string("dev"));
    }

    @Test
    @ActiveProfiles("prod")
    void prod_profile_returns_prod() throws Exception {
        mvc.perform(get("/api/profile"))
                .andExpect(status().isOk())
                .andExpect(content().string("prod"));
    }
}
```

---

## Lancer et tester (manuel)

Dev :

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
curl -s http://localhost:3000/api/profile
```

Prod :

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=prod
curl -s http://localhost:3000/api/profile
```

---

## Exécuter les tests

```bash
mvn -Dtest=ProfileControllerTests test
```

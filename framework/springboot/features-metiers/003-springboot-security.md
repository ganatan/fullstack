# 003-springboot-security.md — springboot-starter-security (Basic Auth)

## Objectif

- `GET /api/public` : accessible sans authentification
- `GET /api/private` : nécessite une authentification (Basic Auth)

Credentials :

- user : `mulder`
- password : `Trustno1`

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
  <artifactId>spring-boot-starter-security</artifactId>
</dependency>

<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-test</artifactId>
  <scope>test</scope>
</dependency>

<dependency>
  <groupId>org.springframework.security</groupId>
  <artifactId>spring-security-test</artifactId>
  <scope>test</scope>
</dependency>
```

---

## Controller

`src/main/java/com/ganatan/starter/api/security/SecurityController.java`

```java
package com.ganatan.starter.api.security;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class SecurityController {

    @GetMapping("/public")
    public String publicEndpoint() {
        return "Public - accessible sans authentification";
    }

    @GetMapping("/private")
    public String privateEndpoint() {
        return "Private - authentification requise";
    }
}
```

---

## Configuration Security

`src/main/java/com/ganatan/starter/config/SecurityConfig.java`

```java
package com.ganatan.starter.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/public").permitAll()
                .anyRequest().authenticated()
            )
            .httpBasic(httpBasic -> {});

        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        var user = User.builder()
                .username("mulder")
                .password("{noop}Trustno1")
                .roles("USER")
                .build();

        return new InMemoryUserDetailsManager(user);
    }
}
```

---

## Test

`src/test/java/com/ganatan/starter/api/security/SecurityControllerTests.java`

```java
package com.ganatan.starter.api.security;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class SecurityControllerTests {

    @Autowired
    private MockMvc mvc;

    @Test
    void public_ok_without_credentials() throws Exception {
        mvc.perform(get("/api/public"))
                .andExpect(status().isOk())
                .andExpect(content().string("Public - accessible sans authentification"));
    }

    @Test
    void private_401_without_credentials() throws Exception {
        mvc.perform(get("/api/private"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void private_ok_with_basic_auth() throws Exception {
        mvc.perform(get("/api/private").with(httpBasic("mulder", "Trustno1")))
                .andExpect(status().isOk())
                .andExpect(content().string("Private - authentification requise"));
    }

    @Test
    void private_401_with_bad_password() throws Exception {
        mvc.perform(get("/api/private").with(httpBasic("mulder", "bad")))
                .andExpect(status().isUnauthorized());
    }
}
```

---

## Lancer et tester (curl)

```bash
curl -s http://localhost:3000/api/public
curl -i http://localhost:3000/api/private
curl -i -u mulder:Trustno1 http://localhost:3000/api/private
```

---

## Exécuter les tests

```bash
mvn -Dtest=SecurityControllerTests test
```

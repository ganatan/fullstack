# 008-testcontainers.md — Testcontainers (essentiels) — Controller + Test

## Objectif

Démarrer une vraie base PostgreSQL en test (Docker), injecter automatiquement l’URL JDBC dans Spring Boot, et tester un endpoint.

---

## Prérequis

- Docker Desktop (ou Docker Engine) en cours d’exécution
- Java 21
- Spring Boot

---

## Dépendances Maven (test)

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-jdbc</artifactId>
</dependency>

<dependency>
  <groupId>org.postgresql</groupId>
  <artifactId>postgresql</artifactId>
  <scope>runtime</scope>
</dependency>

<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-test</artifactId>
  <scope>test</scope>
</dependency>

<dependency>
  <groupId>org.testcontainers</groupId>
  <artifactId>junit-jupiter</artifactId>
  <scope>test</scope>
</dependency>

<dependency>
  <groupId>org.testcontainers</groupId>
  <artifactId>postgresql</artifactId>
  <scope>test</scope>
</dependency>
```

---

## Controller

`src/main/java/com/ganatan/starter/api/example/TestcontainersController.java`

```java
package com.ganatan.starter.api.example;

import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestcontainersController {

    private final JdbcTemplate jdbcTemplate;

    public TestcontainersController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/api/tc")
    public Map<String, Object> tc() {
        Integer count = jdbcTemplate.queryForObject("select count(*) from tc_item", Integer.class);
        return Map.of("ok", true, "count", count == null ? 0 : count);
    }
}
```

---

## Script SQL (création + données)

`src/test/resources/sql/tc-init.sql`

```sql
drop table if exists tc_item;

create table tc_item (
  id bigserial primary key,
  name varchar(255) not null
);

insert into tc_item(name) values ('a');
insert into tc_item(name) values ('b');
```

---

## Test

`src/test/java/com/ganatan/starter/api/example/TestcontainersControllerTest.java`

```java
package com.ganatan.starter.api.example;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.MockMvc;

import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Testcontainers
@SpringBootTest
@AutoConfigureMockMvc
@Sql(scripts = "classpath:sql/tc-init.sql")
class TestcontainersControllerTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine")
        .withDatabaseName("testdb")
        .withUsername("test")
        .withPassword("test");

    @DynamicPropertySource
    static void props(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.datasource.driver-class-name", postgres::getDriverClassName);
    }

    @Autowired
    private MockMvc mockMvc;

    @Test
    void should_return_count_from_real_postgres() throws Exception {
        mockMvc.perform(get("/api/tc"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.ok").value(true))
            .andExpect(jsonPath("$.count").value(2));
    }
}
```

---

## Commandes

```bash
mvn test
mvn -Dtest=TestcontainersControllerTest test
```

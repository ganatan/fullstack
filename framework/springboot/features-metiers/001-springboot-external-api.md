# 005-springboot-external-api.md — springboot-starter-external-api

## Objectif

Exposer `GET /api/albums` qui appelle `https://jsonplaceholder.typicode.com/albums` et retourne un JSON transformé.

---
## Test
Un seul Test

mvn -Dtest=ExternalApiControllerTests test

---

## Naming

Controller : **ExternalApiController** (intention fonctionnelle, pas la techno HTTP)

Package : `com.ganatan.starter.api.external`

---

## Dépendances

### Maven

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

`src/main/java/com/ganatan/starter/api/external/ExternalApiController.java`

```java
package com.ganatan.starter.api.external;

import java.util.List;
import java.util.Map;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;

@RestController
public class ExternalApiController {

    private static final String ALBUMS_URL = "https://jsonplaceholder.typicode.com/albums";

    private final RestClient restClient;

    public ExternalApiController(RestClient.Builder restClientBuilder) {
        this.restClient = restClientBuilder.build();
    }

    @GetMapping("/api/albums")
    public Map<String, Object> getAlbums() {
        List<Map<String, Object>> albums = restClient.get()
            .uri(ALBUMS_URL)
            .retrieve()
            .body(new ParameterizedTypeReference<>() {});

        List<Map<String, Object>> items = albums != null ? albums : List.of();

        return Map.of(
            "source", "jsonplaceholder",
            "count", items.size(),
            "items", items
        );
    }
}
```

---

## Bean RestClient

`src/main/java/com/ganatan/starter/config/RestClientConfig.java`

```java
package com.ganatan.starter.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {

    @Bean
    public RestClient restClient(RestClient.Builder builder) {
        return builder.build();
    }
}
```

---

## Test

`src/test/java/com/ganatan/starter/api/external/ExternalApiControllerTests.java`

```java
package com.ganatan.starter.api.external;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.client.RestClientTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;

import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

import static org.assertj.core.api.Assertions.assertThat;

@RestClientTest(ExternalApiController.class)
class ExternalApiControllerTests {

    @Autowired
    private ExternalApiController controller;

    @Autowired
    private MockRestServiceServer server;

    @Test
    void getAlbums_ok() {
        server.expect(requestTo("https://jsonplaceholder.typicode.com/albums"))
            .andRespond(withSuccess("""
                [{"id":1,"title":"Album 1"},{"id":2,"title":"Album 2"}]
                """, MediaType.APPLICATION_JSON));

        var result = controller.getAlbums();

        assertThat(result.get("source")).isEqualTo("jsonplaceholder");
        assertThat(result.get("count")).isEqualTo(2);

        server.verify();
    }

    @Test
    void getAlbums_nullBody_returns_empty() {
        server.expect(requestTo("https://jsonplaceholder.typicode.com/albums"))
            .andRespond(withSuccess("", MediaType.APPLICATION_JSON));

        var result = controller.getAlbums();

        assertThat(result.get("source")).isEqualTo("jsonplaceholder");
        assertThat(result.get("count")).isEqualTo(0);
        assertThat(result.get("items")).isEqualTo(java.util.List.of());

        server.verify();
    }
}
```

---

## Configuration (optionnelle)

Si tu veux imposer un port :

`src/main/resources/application.properties`

```properties
server.port=3000
```

---

## Test rapide

```bash
curl -s http://localhost:3000/api/albums
```

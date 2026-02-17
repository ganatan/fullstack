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

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;

@RestController
public class ExternalApiController {

    private static final String ALBUMS_URL = "https://jsonplaceholder.typicode.com/albums";

    private final RestClient restClient;

    public ExternalApiController(RestClient restClient) {
        this.restClient = restClient;
    }

    @GetMapping("/api/albums")
    public Map<String, Object> getAlbums() {
        List<Map<String, Object>> albums = restClient.get()
            .uri(ALBUMS_URL)
            .retrieve()
            .body(List.class);

        return Map.of(
            "source", "jsonplaceholder",
            "count", albums == null ? 0 : albums.size(),
            "items", albums == null ? List.of() : albums
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
    public RestClient restClient() {
        return RestClient.create();
    }
}
```

---

## Test

`src/test/java/com/ganatan/starter/api/external/ExternalApiControllerTest.java`

```java
package com.ganatan.starter.api.external;

import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.client.RestClientTest;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RestClientTest(ExternalApiController.class)
class ExternalApiControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private MockRestServiceServer server;

    @Test
    void getAlbums_should_call_external_api_and_wrap_response() throws Exception {
        server.expect(requestTo("https://jsonplaceholder.typicode.com/albums"))
            .andExpect(method(HttpMethod.GET))
            .andRespond(withSuccess("""
                [
                  {"userId": 1, "id": 1, "title": "a"},
                  {"userId": 1, "id": 2, "title": "b"}
                ]
                """, MediaType.APPLICATION_JSON));

        mockMvc.perform(get("/api/albums"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.source").value("jsonplaceholder"))
            .andExpect(jsonPath("$.count").value(2))
            .andExpect(jsonPath("$.items[0].id").value(1))
            .andExpect(jsonPath("$.items[0].title").value("a"))
            .andExpect(jsonPath("$.items[1].id").value(2))
            .andExpect(jsonPath("$.items[1].title").value("b"));

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

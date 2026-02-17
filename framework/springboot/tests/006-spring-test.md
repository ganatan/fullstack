# 006-spring-test.md — Spring Test (essentiels) — Controller + Tests

## Dépendance (déjà incluse via spring-boot-starter-test)

Spring Test est inclus via `spring-boot-starter-test`.

---

## Controller

`src/main/java/com/ganatan/starter/api/example/SpringTestController.java`

```java
package com.ganatan.starter.api.example;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SpringTestController {

    @GetMapping("/api/spring-test")
    public Map<String, Object> test() {
        return Map.of("ok", true);
    }
}
```

---

## Test 1 — @WebMvcTest (slice web, rapide)

`src/test/java/com/ganatan/starter/api/example/SpringTestWebMvcTest.java`

```java
package com.ganatan.starter.api.example;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(SpringTestController.class)
class SpringTestWebMvcTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void should_return_ok_true() throws Exception {
        mockMvc.perform(get("/api/spring-test"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.ok").value(true));
    }
}
```

---

## Test 2 — @SpringBootTest + @AutoConfigureMockMvc (intégration, contexte complet)

`src/test/java/com/ganatan/starter/api/example/SpringTestIntegrationTest.java`

```java
package com.ganatan.starter.api.example;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class SpringTestIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void should_return_ok_true() throws Exception {
        mockMvc.perform(get("/api/spring-test"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.ok").value(true));
    }
}
```

---

## Test 3 — @RestClientTest (mock d’API externe via MockRestServiceServer)

### Controller

`src/main/java/com/ganatan/starter/api/example/SpringTestExternalController.java`

```java
package com.ganatan.starter.api.example;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;

@RestController
public class SpringTestExternalController {

    private final RestClient restClient;

    public SpringTestExternalController(RestClient.Builder builder) {
        this.restClient = builder.build();
    }

    @GetMapping("/api/external/ping")
    public Map<String, Object> ping() {
        String body = restClient.get()
            .uri("https://example.org/ping")
            .retrieve()
            .body(String.class);

        return Map.of("ok", true, "body", body == null ? "" : body);
    }
}
```

### Test

`src/test/java/com/ganatan/starter/api/example/SpringTestRestClientTest.java`

```java
package com.ganatan.starter.api.example;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.client.RestClientTest;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RestClientTest(SpringTestExternalController.class)
class SpringTestRestClientTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private MockRestServiceServer server;

    @Test
    void should_mock_external_call() throws Exception {
        server.expect(requestTo("https://example.org/ping"))
            .andExpect(method(HttpMethod.GET))
            .andRespond(withSuccess("pong", MediaType.TEXT_PLAIN));

        mockMvc.perform(get("/api/external/ping"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.ok").value(true))
            .andExpect(jsonPath("$.body").value("pong"));

        server.verify();
    }
}
```

---

## Commandes

```bash
mvn test
mvn -Dtest=SpringTestWebMvcTest test
mvn -Dtest=SpringTestIntegrationTest test
mvn -Dtest=SpringTestRestClientTest test
```

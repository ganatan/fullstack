# 002-test-syntaxe.md — Spring Boot Tests — Syntaxe & mots-clés

## Objectif

Donner un mémo des annotations / mots-clés / imports les plus utilisés dans des tests Spring Boot, avec un exemple minimal :
- `ExampleTestController`
- `ExampleTestTests`

---

## Annotations JUnit 5

- `@Test` : déclare une méthode de test
- `@BeforeEach` : exécution avant chaque test
- `@AfterEach` : exécution après chaque test
- `@BeforeAll` : exécution une fois avant tous les tests (méthode `static`)
- `@AfterAll` : exécution une fois après tous les tests (méthode `static`)
- `@DisplayName` : nom lisible pour le test
- `@Disabled` : désactive un test

---

## Assertions JUnit

- `assertTrue(condition)`
- `assertFalse(condition)`
- `assertEquals(expected, actual)`
- `assertNotNull(value)`
- `assertNull(value)`
- `assertThrows(Exception.class, () -> ...)`

Imports typiques :
```java
import static org.junit.jupiter.api.Assertions.*;
```

---

## Annotations Spring Test (web)

- `@SpringBootTest` : charge tout le contexte Spring
- `@WebMvcTest(Controller.class)` : charge le web layer + MockMvc (slice)
- `@AutoConfigureMockMvc` : injecte `MockMvc` avec `@SpringBootTest`
- `@MockBean` : mock d’un bean Spring dans le contexte de test
- `@Autowired` : injection Spring dans le test

---

## MockMvc (tests HTTP)

Méthodes / mots-clés :
- `mockMvc.perform(get("/path"))`
- `andExpect(status().isOk())`
- `andExpect(jsonPath("$.field").value(...))`

Imports typiques :
```java
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
```

---

## Mocks (Mockito)

- `verify(mock).method(...)`
- `times(n)`
- `anyString()`, `eq(value)`

Imports typiques :
```java
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.*;
```

---

## Exemple minimal

### Controller

`src/main/java/com/ganatan/starter/api/example/ExampleTestController.java`

```java
package com.ganatan.starter.api.example;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ExampleTestController {

    @GetMapping("/api/test")
    public Map<String, Object> test() {
        return Map.of("ok", true, "message", "hello");
    }
}
```

### Test (WebMvcTest + MockMvc)

`src/test/java/com/ganatan/starter/api/example/ExampleTestTests.java`

```java
package com.ganatan.starter.api.example;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ExampleTestController.class)
class ExampleTestTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void should_return_ok_true() throws Exception {
        mockMvc.perform(get("/api/test"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.ok").value(true))
            .andExpect(jsonPath("$.message").value("hello"));
    }
}
```

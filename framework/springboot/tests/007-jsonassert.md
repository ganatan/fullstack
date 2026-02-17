# 007-jsonassert.md — JSONassert (essentiels) — Controller + Test

## Dépendance (déjà incluse via spring-boot-starter-test)

JSONassert est inclus via `spring-boot-starter-test`.

Imports typiques :
```java
import org.skyscreamer.jsonassert.JSONAssert;
import org.skyscreamer.jsonassert.JSONCompareMode;
```

---

## Controller

`src/main/java/com/ganatan/starter/api/example/JsonAssertController.java`

```java
package com.ganatan.starter.api.example;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class JsonAssertController {

    @GetMapping("/api/jsonassert")
    public Map<String, Object> jsonassert() {
        return Map.of(
            "ok", true,
            "count", 2,
            "items", new int[] {1, 2}
        );
    }
}
```

---

## Test (JSONassert essentiel)

`src/test/java/com/ganatan/starter/api/example/JsonAssertEssentialsTest.java`

```java
package com.ganatan.starter.api.example;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

import org.skyscreamer.jsonassert.JSONAssert;
import org.skyscreamer.jsonassert.JSONCompareMode;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(JsonAssertController.class)
class JsonAssertEssentialsTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void should_compare_json_response() throws Exception {
        String actual = mockMvc.perform(get("/api/jsonassert"))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();

        String expected = """
            {
              "ok": true,
              "count": 2,
              "items": [1, 2]
            }
            """;

        JSONAssert.assertEquals(expected, actual, JSONCompareMode.LENIENT);
    }
}
```

---

## Modes de comparaison

- `JSONCompareMode.STRICT` : mêmes champs + même ordre des tableaux
- `JSONCompareMode.LENIENT` : ordre des champs ignoré, champs supplémentaires autorisés

---

## Commande

```bash
mvn -Dtest=JsonAssertEssentialsTest test
```

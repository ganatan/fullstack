# 005-mockito.md — Mockito (essentiels) — Controller + Test

## Dépendance (déjà incluse via spring-boot-starter-test)

Mockito est inclus par défaut dans `spring-boot-starter-test`.

Imports typiques :
```java
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.*;
```

---

## Controller

`src/main/java/com/ganatan/starter/api/example/MockitoController.java`

```java
package com.ganatan.starter.api.example;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MockitoController {

    private final MockitoService service;

    public MockitoController(MockitoService service) {
        this.service = service;
    }

    @GetMapping("/api/mockito")
    public Map<String, Object> mockito() {
        String value = service.getValue("id-1");
        return Map.of("ok", true, "value", value);
    }
}
```

---

## Service (dépendance mockée)

`src/main/java/com/ganatan/starter/api/example/MockitoService.java`

```java
package com.ganatan.starter.api.example;

import org.springframework.stereotype.Service;

@Service
public class MockitoService {

    public String getValue(String id) {
        return "real-" + id;
    }
}
```

---

## Test (Mockito essentiel)

`src/test/java/com/ganatan/starter/api/example/MockitoEssentialsTest.java`

```java
package com.ganatan.starter.api.example;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(MockitoController.class)
class MockitoEssentialsTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MockitoService service;

    @Test
    void stubbing_and_verify() throws Exception {
        when(service.getValue(eq("id-1"))).thenReturn("mocked");

        mockMvc.perform(get("/api/mockito"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.ok").value(true))
            .andExpect(jsonPath("$.value").value("mocked"));

        verify(service, times(1)).getValue(eq("id-1"));
        verify(service, never()).getValue(eq("id-2"));
    }

    @Test
    void then_throw_example() throws Exception {
        when(service.getValue(anyString())).thenThrow(new IllegalArgumentException("boom"));

        mockMvc.perform(get("/api/mockito"))
            .andExpect(status().is5xxServerError());

        verify(service, atLeastOnce()).getValue(anyString());
    }
}
```

# 004-assertj.md — AssertJ (essentiels) — Controller + Test

## Dépendance (déjà incluse via spring-boot-starter-test)

AssertJ est inclus par défaut dans `spring-boot-starter-test`.

Import typique :
```java
import static org.assertj.core.api.Assertions.assertThat;
```

---

## Controller

`src/main/java/com/ganatan/starter/api/example/AssertjController.java`

```java
package com.ganatan.starter.api.example;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AssertjController {

    @GetMapping("/api/assertj")
    public Map<String, Object> assertj() {
        return Map.of("ok", true, "count", 2);
    }
}
```

---

## Test (AssertJ essentiel)

`src/test/java/com/ganatan/starter/api/example/AssertjEssentialsTest.java`

```java
package com.ganatan.starter.api.example;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.Assertions.assertThatCode;

class AssertjEssentialsTest {

    @Test
    void boolean_and_numbers() {
        assertThat(true).isTrue();
        assertThat(false).isFalse();
        assertThat(40 + 2).isEqualTo(42);
        assertThat(40 + 1).isNotEqualTo(42);
        assertThat(10).isGreaterThan(5).isLessThan(20);
    }

    @Test
    void null_checks() {
        Object a = null;
        Object b = new Object();
        assertThat(a).isNull();
        assertThat(b).isNotNull();
    }

    @Test
    void strings() {
        assertThat("hello").isEqualTo("hello");
        assertThat("hello").contains("ell");
        assertThat("hello").startsWith("he").endsWith("lo");
        assertThat("hello").matches("h.*o");
    }

    @Test
    void collections() {
        List<Integer> list = List.of(1, 2, 3);
        assertThat(list).hasSize(3);
        assertThat(list).contains(1, 2);
        assertThat(list).containsExactly(1, 2, 3);
        assertThat(list).doesNotContain(4);
    }

    @Test
    void maps() {
        Map<String, Object> map = Map.of("ok", true, "count", 2);
        assertThat(map).containsEntry("ok", true);
        assertThat(map).containsKey("count");
        assertThat(map).containsValue(2);
    }

    @Test
    void exceptions() {
        assertThatThrownBy(() -> {
            throw new IllegalArgumentException("boom");
        }).isInstanceOf(IllegalArgumentException.class)
          .hasMessage("boom");
    }

    @Test
    void does_not_throw() {
        assertThatCode(() -> {
            int x = 1 + 1;
        }).doesNotThrowAnyException();
    }
}
```

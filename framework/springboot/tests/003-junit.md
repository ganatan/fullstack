# 003-junit.md — JUnit 5 (essentiels) — Controller + Test

## Controller

`src/main/java/com/ganatan/starter/api/example/JunitController.java`

```java
package com.ganatan.starter.api.example;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class JunitController {

    @GetMapping("/api/junit")
    public Map<String, Object> junit() {
        return Map.of("ok", true);
    }
}
```

---

## Test (JUnit 5 essentiel)

`src/test/java/com/ganatan/starter/api/example/JunitEssentialsTest.java`

```java
package com.ganatan.starter.api.example;

import org.junit.jupiter.api.*;

import java.time.Duration;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class JunitEssentialsTest {

    @BeforeAll
    static void beforeAll() {
    }

    @AfterAll
    static void afterAll() {
    }

    @BeforeEach
    void beforeEach() {
    }

    @AfterEach
    void afterEach() {
    }

    @Test
    void assert_true_false() {
        assertTrue(1 < 2);
        assertFalse(2 < 1);
    }

    @Test
    void assert_equals_notEquals() {
        assertEquals(42, 40 + 2);
        assertNotEquals(42, 40 + 1);
    }

    @Test
    void assert_null_notNull() {
        Object a = null;
        Object b = new Object();
        assertNull(a);
        assertNotNull(b);
    }

    @Test
    void assert_same_notSame() {
        Object x = new Object();
        Object y = x;
        Object z = new Object();
        assertSame(x, y);
        assertNotSame(x, z);
    }

    @Test
    void assert_array_equals() {
        assertArrayEquals(new int[] {1, 2}, new int[] {1, 2});
    }

    @Test
    void assert_iterable_equals() {
        assertIterableEquals(List.of(1, 2), List.of(1, 2));
    }

    @Test
    void assert_throws() {
        assertThrows(IllegalArgumentException.class, () -> {
            throw new IllegalArgumentException("boom");
        });
    }

    @Test
    void assert_does_not_throw() {
        assertDoesNotThrow(() -> {
            int x = 1 + 1;
        });
    }

    @Test
    void assert_timeout() {
        assertTimeout(Duration.ofMillis(200), () -> {
        });
    }

    @Test
    void assert_all() {
        assertAll(
            () -> assertTrue(true),
            () -> assertEquals("a", "a"),
            () -> assertNotNull("x")
        );
    }

    @Test
    void fail_example() {
        if (false) {
            fail("should not happen");
        }
    }
}
```

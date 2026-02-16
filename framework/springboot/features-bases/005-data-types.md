# data-types – tous les cas de figure (Java)

Tous les exemples sont exécutables directement dans un contrôleur Spring Boot.

---

## Code

```java
package com.ganatan.starter.api.root;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.Period;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RootController {

  enum Status {
    CREATED,
    RUNNING,
    FAILED
  }

  record User(String name, int age) {}

  @GetMapping("/data-types")
  public Map<String, Object> root() {

    byte b = 1;
    short s = 2;
    int i = 3;
    long l = 4L;
    float f = 1.5f;
    double d = 2.5;
    char c = 'A';
    boolean bool = true;

    Byte wb = b;
    Short ws = s;
    Integer wi = i;
    Long wl = l;
    Float wf = f;
    Double wd = d;
    Character wc = c;
    Boolean wbool = bool;

    int[] intArray = {1, 2, 3};
    String[] stringArray = {"a", "b"};

    List<String> list = List.of("one", "two");
    Map<String, Integer> map = Map.of("a", 1, "b", 2);

    Optional<String> optional = Optional.of("value");

    BigInteger bigInteger = new BigInteger("123456789");
    BigDecimal bigDecimal = new BigDecimal("123.45");

    UUID uuid = UUID.randomUUID();

    Date legacyDate = new Date();
    Instant instant = Instant.now();
    LocalDate localDate = LocalDate.now();
    LocalTime localTime = LocalTime.now();
    LocalDateTime localDateTime = LocalDateTime.now();
    ZonedDateTime zonedDateTime = ZonedDateTime.now(ZoneId.of("Europe/Paris"));
    Duration duration = Duration.ofMinutes(90);
    Period period = Period.ofDays(10);

    Status status = Status.RUNNING;

    User user = new User("Alice", 30);

    return Map.of(
      "primitives", Map.of(
        "byte", b,
        "short", s,
        "int", i,
        "long", l,
        "float", f,
        "double", d,
        "char", String.valueOf(c),
        "boolean", bool
      ),
      "wrappers", Map.of(
        "Byte", wb,
        "Short", ws,
        "Integer", wi,
        "Long", wl,
        "Float", wf,
        "Double", wd,
        "Character", wc,
        "Boolean", wbool
      ),
      "arrays", Map.of(
        "intArray", intArray,
        "stringArray", stringArray
      ),
      "collections", Map.of(
        "list", list,
        "map", map
      ),
      "optional", optional.orElse(null),
      "big_numbers", Map.of(
        "BigInteger", bigInteger,
        "BigDecimal", bigDecimal
      ),
      "uuid", uuid.toString(),
      "date_time", Map.of(
        "legacy_date", legacyDate.toString(),
        "instant", instant.toString(),
        "local_date", localDate.toString(),
        "local_time", localTime.toString(),
        "local_date_time", localDateTime.toString(),
        "zoned_date_time", zonedDateTime.toString(),
        "duration", duration.toString(),
        "period", period.toString()
      ),
      "enum", status.name(),
      "record", user
    );
  }

  // Cas 1 : primitives
  static byte dtByte() { return 1; }
  static short dtShort() { return 2; }
  static int dtInt() { return 3; }
  static long dtLong() { return 4L; }
  static float dtFloat() { return 1.5f; }
  static double dtDouble() { return 2.5; }
  static char dtChar() { return 'A'; }
  static boolean dtBoolean() { return true; }

  // Cas 2 : wrappers (autoboxing)
  static Byte dtWrapperByte() { return (byte) 1; }
  static Short dtWrapperShort() { return (short) 2; }
  static Integer dtWrapperInteger() { return 3; }
  static Long dtWrapperLong() { return 4L; }
  static Float dtWrapperFloat() { return 1.5f; }
  static Double dtWrapperDouble() { return 2.5; }
  static Character dtWrapperCharacter() { return 'A'; }
  static Boolean dtWrapperBoolean() { return true; }

  // Cas 3 : arrays
  static int[] dtIntArray() { return new int[]{1, 2, 3}; }
  static String[] dtStringArray() { return new String[]{"a", "b"}; }

  // Cas 4 : collections
  static List<String> dtList() { return List.of("one", "two"); }
  static Map<String, Integer> dtMap() { return Map.of("a", 1, "b", 2); }

  // Cas 5 : Optional — présent et vide
  static Optional<String> dtOptionalPresent() { return Optional.of("value"); }
  static Optional<String> dtOptionalEmpty() { return Optional.empty(); }

  // Cas 6 : BigInteger et BigDecimal
  static BigInteger dtBigInteger() { return new BigInteger("123456789"); }
  static BigDecimal dtBigDecimal() { return new BigDecimal("123.45"); }

  // Cas 7 : UUID
  static String dtUuid() { return UUID.randomUUID().toString(); }

  // Cas 8 : date/time
  static Duration dtDuration() { return Duration.ofMinutes(90); }
  static Period dtPeriod() { return Period.ofDays(10); }
  static LocalDate dtLocalDate() { return LocalDate.of(2024, 1, 15); }
  static LocalTime dtLocalTime() { return LocalTime.of(10, 30, 0); }
  static LocalDateTime dtLocalDateTime() { return LocalDateTime.of(2024, 1, 15, 10, 30, 0); }

  // Cas 9 : enum
  static String dtEnum(Status status) { return status.name(); }

  // Cas 10 : record
  static User dtRecord(String name, int age) { return new User(name, age); }
}
```

---

## Test

```java
package com.ganatan.starter.api.root;

import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.Period;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.Test;

class RootControllerTests {

  private static final String APP = "springboot-starter";
  private static final String JAVA_PROP = "java.version";

  // --- root() global ---

  @Test
  void root_shouldReturnMapWithAllExpectedKeys() {
    RootController controller = new RootController();
    Map<String, Object> result = controller.root();

    assertNotNull(result);
    assertEquals(10, result.size());

    assertTrue(result.containsKey("primitives"));
    assertTrue(result.containsKey("wrappers"));
    assertTrue(result.containsKey("arrays"));
    assertTrue(result.containsKey("collections"));
    assertTrue(result.containsKey("optional"));
    assertTrue(result.containsKey("big_numbers"));
    assertTrue(result.containsKey("uuid"));
    assertTrue(result.containsKey("date_time"));
    assertTrue(result.containsKey("enum"));
    assertTrue(result.containsKey("record"));

    assertEquals("RUNNING", result.get("enum"));
    assertEquals("value", result.get("optional"));

    assertThrows(UnsupportedOperationException.class, () -> result.put("x", "y"));
  }

  @Test
  void root_primitives_shouldContainExpectedValues() {
    RootController controller = new RootController();
    Map<?, ?> primitives = (Map<?, ?>) controller.root().get("primitives");

    assertEquals((byte) 1, primitives.get("byte"));
    assertEquals((short) 2, primitives.get("short"));
    assertEquals(3, primitives.get("int"));
    assertEquals(4L, primitives.get("long"));
    assertEquals(1.5f, primitives.get("float"));
    assertEquals(2.5, primitives.get("double"));
    assertEquals("A", primitives.get("char"));
    assertEquals(true, primitives.get("boolean"));
  }

  @Test
  void root_wrappers_shouldContainExpectedValues() {
    RootController controller = new RootController();
    Map<?, ?> wrappers = (Map<?, ?>) controller.root().get("wrappers");

    assertEquals((byte) 1, wrappers.get("Byte"));
    assertEquals((short) 2, wrappers.get("Short"));
    assertEquals(3, wrappers.get("Integer"));
    assertEquals(4L, wrappers.get("Long"));
    assertEquals(1.5f, wrappers.get("Float"));
    assertEquals(2.5, wrappers.get("Double"));
    assertEquals('A', wrappers.get("Character"));
    assertEquals(true, wrappers.get("Boolean"));
  }

  @Test
  void root_bigNumbers_shouldContainExpectedValues() {
    RootController controller = new RootController();
    Map<?, ?> bigNumbers = (Map<?, ?>) controller.root().get("big_numbers");

    assertEquals(new BigInteger("123456789"), bigNumbers.get("BigInteger"));
    assertEquals(new BigDecimal("123.45"), bigNumbers.get("BigDecimal"));
  }

  @Test
  void root_uuid_shouldBeValidUuidFormat() {
    RootController controller = new RootController();
    String uuid = (String) controller.root().get("uuid");
    assertNotNull(uuid);
    assertTrue(uuid.matches(
      "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"
    ));
  }

  @Test
  void root_dateTime_shouldContainAllKeys() {
    RootController controller = new RootController();
    Map<?, ?> dateTime = (Map<?, ?>) controller.root().get("date_time");

    assertTrue(dateTime.containsKey("legacy_date"));
    assertTrue(dateTime.containsKey("instant"));
    assertTrue(dateTime.containsKey("local_date"));
    assertTrue(dateTime.containsKey("local_time"));
    assertTrue(dateTime.containsKey("local_date_time"));
    assertTrue(dateTime.containsKey("zoned_date_time"));
    assertEquals("PT1H30M", dateTime.get("duration"));
    assertEquals("P10D", dateTime.get("period"));
  }

  @Test
  void root_record_shouldContainUserFields() {
    RootController controller = new RootController();
    RootController.User user = (RootController.User) controller.root().get("record");
    assertEquals("Alice", user.name());
    assertEquals(30, user.age());
  }

  // --- Cas 1 : primitives ---

  @Test
  void dtByte_shouldReturnOne() { assertEquals((byte) 1, RootController.dtByte()); }

  @Test
  void dtShort_shouldReturnTwo() { assertEquals((short) 2, RootController.dtShort()); }

  @Test
  void dtInt_shouldReturnThree() { assertEquals(3, RootController.dtInt()); }

  @Test
  void dtLong_shouldReturnFour() { assertEquals(4L, RootController.dtLong()); }

  @Test
  void dtFloat_shouldReturnOnePointFive() { assertEquals(1.5f, RootController.dtFloat()); }

  @Test
  void dtDouble_shouldReturnTwoPointFive() { assertEquals(2.5, RootController.dtDouble()); }

  @Test
  void dtChar_shouldReturnA() { assertEquals('A', RootController.dtChar()); }

  @Test
  void dtBoolean_shouldReturnTrue() { assertTrue(RootController.dtBoolean()); }

  // --- Cas 2 : wrappers ---

  @Test
  void dtWrapperByte_shouldReturnOne() { assertEquals((byte) 1, RootController.dtWrapperByte()); }

  @Test
  void dtWrapperShort_shouldReturnTwo() { assertEquals((short) 2, RootController.dtWrapperShort()); }

  @Test
  void dtWrapperInteger_shouldReturnThree() { assertEquals(3, RootController.dtWrapperInteger()); }

  @Test
  void dtWrapperLong_shouldReturnFour() { assertEquals(4L, RootController.dtWrapperLong()); }

  @Test
  void dtWrapperFloat_shouldReturnOnePointFive() { assertEquals(1.5f, RootController.dtWrapperFloat()); }

  @Test
  void dtWrapperDouble_shouldReturnTwoPointFive() { assertEquals(2.5, RootController.dtWrapperDouble()); }

  @Test
  void dtWrapperCharacter_shouldReturnA() { assertEquals('A', RootController.dtWrapperCharacter()); }

  @Test
  void dtWrapperBoolean_shouldReturnTrue() { assertTrue(RootController.dtWrapperBoolean()); }

  // --- Cas 3 : arrays ---

  @Test
  void dtIntArray_shouldReturnExpectedValues() {
    assertArrayEquals(new int[]{1, 2, 3}, RootController.dtIntArray());
  }

  @Test
  void dtStringArray_shouldReturnExpectedValues() {
    assertArrayEquals(new String[]{"a", "b"}, RootController.dtStringArray());
  }

  // --- Cas 4 : collections ---

  @Test
  void dtList_shouldReturnImmutableListWithTwoElements() {
    List<String> result = RootController.dtList();
    assertEquals(List.of("one", "two"), result);
    assertThrows(UnsupportedOperationException.class, () -> result.add("three"));
  }

  @Test
  void dtMap_shouldReturnImmutableMapWithTwoEntries() {
    Map<String, Integer> result = RootController.dtMap();
    assertEquals(1, result.get("a"));
    assertEquals(2, result.get("b"));
    assertThrows(UnsupportedOperationException.class, () -> result.put("c", 3));
  }

  // --- Cas 5 : Optional ---

  @Test
  void dtOptionalPresent_shouldContainValue() {
    Optional<String> result = RootController.dtOptionalPresent();
    assertTrue(result.isPresent());
    assertEquals("value", result.get());
  }

  @Test
  void dtOptionalEmpty_shouldBeEmpty() {
    Optional<String> result = RootController.dtOptionalEmpty();
    assertFalse(result.isPresent());
    assertEquals("default", result.orElse("default"));
  }

  // --- Cas 6 : BigInteger / BigDecimal ---

  @Test
  void dtBigInteger_shouldReturnExpectedValue() {
    assertEquals(new BigInteger("123456789"), RootController.dtBigInteger());
  }

  @Test
  void dtBigDecimal_shouldReturnExpectedValue() {
    assertEquals(new BigDecimal("123.45"), RootController.dtBigDecimal());
  }

  // --- Cas 7 : UUID ---

  @Test
  void dtUuid_shouldBeValidFormat() {
    String uuid = RootController.dtUuid();
    assertNotNull(uuid);
    assertTrue(uuid.matches(
      "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"
    ));
  }

  @Test
  void dtUuid_shouldBeUniqueOnEachCall() {
    assertNotEquals(RootController.dtUuid(), RootController.dtUuid());
  }

  // --- Cas 8 : date/time ---

  @Test
  void dtDuration_shouldBe90Minutes() {
    assertEquals(Duration.ofMinutes(90), RootController.dtDuration());
    assertEquals("PT1H30M", RootController.dtDuration().toString());
  }

  @Test
  void dtPeriod_shouldBe10Days() {
    assertEquals(Period.ofDays(10), RootController.dtPeriod());
    assertEquals("P10D", RootController.dtPeriod().toString());
  }

  @Test
  void dtLocalDate_shouldReturnExpectedDate() {
    assertEquals(LocalDate.of(2024, 1, 15), RootController.dtLocalDate());
  }

  @Test
  void dtLocalTime_shouldReturnExpectedTime() {
    assertEquals(LocalTime.of(10, 30, 0), RootController.dtLocalTime());
  }

  @Test
  void dtLocalDateTime_shouldReturnExpectedDateTime() {
    assertEquals(LocalDateTime.of(2024, 1, 15, 10, 30, 0), RootController.dtLocalDateTime());
  }

  // --- Cas 9 : enum ---

  @Test
  void dtEnum_shouldReturnRunning() {
    assertEquals("RUNNING", RootController.dtEnum(RootController.Status.RUNNING));
  }

  @Test
  void dtEnum_shouldReturnCreated() {
    assertEquals("CREATED", RootController.dtEnum(RootController.Status.CREATED));
  }

  @Test
  void dtEnum_shouldReturnFailed() {
    assertEquals("FAILED", RootController.dtEnum(RootController.Status.FAILED));
  }

  // --- Cas 10 : record ---

  @Test
  void dtRecord_shouldReturnExpectedFields() {
    RootController.User user = RootController.dtRecord("Alice", 30);
    assertEquals("Alice", user.name());
    assertEquals(30, user.age());
  }

  @Test
  void dtRecord_shouldBeImmutable() {
    RootController.User u1 = RootController.dtRecord("Alice", 30);
    RootController.User u2 = RootController.dtRecord("Alice", 30);
    assertEquals(u1, u2);
  }
}
```

---

## Principes clés

- 8 types primitifs : `byte`, `short`, `int`, `long`, `float`, `double`, `char`, `boolean`
- chaque primitif a son wrapper (`Integer`, `Long`…) — l'autoboxing est automatique
- `int[]` vs `Integer[]` — les tableaux de primitifs ne peuvent pas contenir `null`
- `List.of()` et `Map.of()` retournent des collections immutables
- `Optional<T>` évite les `null` — préférer `orElse()` / `orElseThrow()` à `get()` seul
- `BigInteger` et `BigDecimal` pour les calculs financiers ou à précision arbitraire — ne jamais utiliser `double` pour la monnaie
- `UUID.randomUUID()` génère un identifiant unique — format `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
- `LocalDate` / `LocalTime` / `LocalDateTime` : sans fuseau horaire — API moderne (Java 8+)
- `ZonedDateTime` : avec fuseau — à préférer pour les APIs exposées à l'international
- `Duration` : durée en temps (heures, minutes, secondes) — `Period` : durée en dates (jours, mois, années)
- `Date` est legacy — à éviter dans tout nouveau code
- `record` : classe immuable, equals/hashCode/toString générés automatiquement
- `enum` : type sûr, exhaustif dans un `switch` expression

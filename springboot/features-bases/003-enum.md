# enum – tous les cas de figure (Java)

Tous les exemples sont exécutables directement dans un contrôleur Spring Boot.

---

## Code

```java
package com.ganatan.starter.api.root;

import java.util.EnumMap;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RootController {

  // Cas 1 : enum basique
  enum Day {
    MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY
  }

  // Cas 2 : enum avec champs et constructeur
  enum Planet {
    MERCURY(3.303e+23, 2.4397e6),
    VENUS(4.869e+24, 6.0518e6),
    EARTH(5.976e+24, 6.37814e6);

    private final double mass;
    private final double radius;

    Planet(double mass, double radius) {
      this.mass = mass;
      this.radius = radius;
    }

    double mass() {
      return mass;
    }

    double radius() {
      return radius;
    }
  }

  // Cas 3 : enum avec méthode
  enum Season {
    SPRING, SUMMER, AUTUMN, WINTER;

    boolean isWarm() {
      return this == SPRING || this == SUMMER;
    }
  }

  // Cas 4 : enum implémentant une interface
  interface Describable {
    String describe();
  }

  enum Priority implements Describable {
    LOW {
      @Override
      public String describe() {
        return "Low priority";
      }
    },
    MEDIUM {
      @Override
      public String describe() {
        return "Medium priority";
      }
    },
    HIGH {
      @Override
      public String describe() {
        return "High priority";
      }
    }
  }

  // Cas 5 : enum avec méthode abstraite par valeur
  enum Operation {
    ADD {
      @Override
      public int apply(int a, int b) {
        return a + b;
      }
    },
    SUBTRACT {
      @Override
      public int apply(int a, int b) {
        return a - b;
      }
    },
    MULTIPLY {
      @Override
      public int apply(int a, int b) {
        return a * b;
      }
    };

    public abstract int apply(int a, int b);
  }

  @GetMapping("/")
  public Map<String, Object> root() {
    String basicName = enumBasic(Day.WEDNESDAY);
    int basicOrdinal = enumOrdinal(Day.WEDNESDAY);
    Day basicValueOf = enumValueOf("FRIDAY");
    List<String> allValues = enumAllValues();
    double planetMass = enumWithFields(Planet.EARTH);
    boolean seasonWarm = enumWithMethod(Season.SUMMER);
    boolean seasonCold = enumWithMethod(Season.WINTER);
    String priorityLow = enumWithInterface(Priority.LOW);
    String priorityHigh = enumWithInterface(Priority.HIGH);
    int operationAdd = enumAbstractMethod(Operation.ADD, 10, 3);
    int operationMultiply = enumAbstractMethod(Operation.MULTIPLY, 10, 3);
    EnumSet<Day> weekend = enumSet();
    EnumMap<Season, String> seasonMap = enumMap();

    return Map.ofEntries(
      Map.entry("application", "springboot-starter"),
      Map.entry("status", "running"),
      Map.entry("java", System.getProperty("java.version")),
      Map.entry("enum_basic_name", basicName),
      Map.entry("enum_basic_ordinal", basicOrdinal),
      Map.entry("enum_basic_valueof", basicValueOf.name()),
      Map.entry("enum_all_values", allValues),
      Map.entry("enum_with_fields", planetMass),
      Map.entry("enum_with_method_warm", seasonWarm),
      Map.entry("enum_with_method_cold", seasonCold),
      Map.entry("enum_interface_low", priorityLow),
      Map.entry("enum_interface_high", priorityHigh),
      Map.entry("enum_abstract_add", operationAdd),
      Map.entry("enum_abstract_multiply", operationMultiply),
      Map.entry("enum_set", weekend.size()),
      Map.entry("enum_map", seasonMap.get(Season.SUMMER))
    );
  }

  // Cas 1 : name() — nom de la constante
  static String enumBasic(Day day) {
    return day.name();
  }

  // Cas 2 : ordinal() — position dans la déclaration (0-based)
  static int enumOrdinal(Day day) {
    return day.ordinal();
  }

  // Cas 3 : valueOf() — obtenir une constante depuis un String
  static Day enumValueOf(String name) {
    return Day.valueOf(name);
  }

  // Cas 4 : values() — itérer toutes les constantes
  static List<String> enumAllValues() {
    List<String> result = new java.util.ArrayList<>();
    for (Day day : Day.values()) {
      result.add(day.name());
    }
    return result;
  }

  // Cas 5 : enum avec champs et constructeur
  static double enumWithFields(Planet planet) {
    return planet.mass();
  }

  // Cas 6 : enum avec méthode instance
  static boolean enumWithMethod(Season season) {
    return season.isWarm();
  }

  // Cas 7 : enum implémentant une interface
  static String enumWithInterface(Priority priority) {
    return priority.describe();
  }

  // Cas 8 : enum avec méthode abstraite par valeur
  static int enumAbstractMethod(Operation operation, int a, int b) {
    return operation.apply(a, b);
  }

  // Cas 9 : EnumSet
  static EnumSet<Day> enumSet() {
    return EnumSet.of(Day.SATURDAY, Day.SUNDAY);
  }

  // Cas 10 : EnumMap
  static EnumMap<Season, String> enumMap() {
    EnumMap<Season, String> map = new EnumMap<>(Season.class);
    map.put(Season.SPRING, "Warm");
    map.put(Season.SUMMER, "Hot");
    map.put(Season.AUTUMN, "Cool");
    map.put(Season.WINTER, "Cold");
    return map;
  }
}
```

---

## Test

```java
package com.ganatan.starter.api.root;

import static org.junit.jupiter.api.Assertions.*;

import java.util.EnumMap;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;

class RootControllerTests {

  private static final String APP = "springboot-starter";
  private static final String STATUS = "running";
  private static final String JAVA_PROP = "java.version";

  // --- root() global ---

  @Test
  void root_shouldReturnMapWithAllExpectedKeysAndValues() {
    RootController controller = new RootController();
    Map<String, Object> result = controller.root();

    assertNotNull(result);
    assertEquals(15, result.size());

    assertEquals(APP, result.get("application"));
    assertEquals(STATUS, result.get("status"));
    assertEquals(System.getProperty(JAVA_PROP), result.get("java"));

    assertEquals("WEDNESDAY", result.get("enum_basic_name"));
    assertEquals(2, (Integer) result.get("enum_basic_ordinal"));
    assertEquals("FRIDAY", result.get("enum_basic_valueof"));
    assertEquals(7, ((List<?>) result.get("enum_all_values")).size());
    assertEquals(5.976e+24, (Double) result.get("enum_with_fields"));
    assertEquals(true, result.get("enum_with_method_warm"));
    assertEquals(false, result.get("enum_with_method_cold"));
    assertEquals("Low priority", result.get("enum_interface_low"));
    assertEquals("High priority", result.get("enum_interface_high"));
    assertEquals(13, (Integer) result.get("enum_abstract_add"));
    assertEquals(30, (Integer) result.get("enum_abstract_multiply"));
    assertEquals(2, (Integer) result.get("enum_set"));
    assertEquals("Hot", result.get("enum_map"));

    assertThrows(UnsupportedOperationException.class, () -> result.put("x", "y"));
  }

  // --- Cas 1 : enumBasic ---

  @Test
  void enumBasic_shouldReturnName() {
    assertEquals("MONDAY", RootController.enumBasic(RootController.Day.MONDAY));
  }

  @Test
  void enumBasic_shouldReturnWednesday() {
    assertEquals("WEDNESDAY", RootController.enumBasic(RootController.Day.WEDNESDAY));
  }

  // --- Cas 2 : enumOrdinal ---

  @Test
  void enumOrdinal_shouldReturnZero_forFirstConstant() {
    assertEquals(0, RootController.enumOrdinal(RootController.Day.MONDAY));
  }

  @Test
  void enumOrdinal_shouldReturnTwo_forWednesday() {
    assertEquals(2, RootController.enumOrdinal(RootController.Day.WEDNESDAY));
  }

  @Test
  void enumOrdinal_shouldReturnSix_forLastConstant() {
    assertEquals(6, RootController.enumOrdinal(RootController.Day.SUNDAY));
  }

  // --- Cas 3 : enumValueOf ---

  @Test
  void enumValueOf_shouldReturnCorrectConstant() {
    assertEquals(RootController.Day.FRIDAY, RootController.enumValueOf("FRIDAY"));
  }

  @Test
  void enumValueOf_shouldThrow_whenNameIsInvalid() {
    assertThrows(IllegalArgumentException.class, () -> RootController.enumValueOf("INVALID"));
  }

  // --- Cas 4 : enumAllValues ---

  @Test
  void enumAllValues_shouldReturnAllSevenDays() {
    List<String> result = RootController.enumAllValues();
    assertEquals(7, result.size());
    assertEquals("MONDAY", result.get(0));
    assertEquals("SUNDAY", result.get(6));
  }

  // --- Cas 5 : enumWithFields ---

  @Test
  void enumWithFields_shouldReturnEarthMass() {
    assertEquals(5.976e+24, RootController.enumWithFields(RootController.Planet.EARTH));
  }

  @Test
  void enumWithFields_shouldReturnMercuryMass() {
    assertEquals(3.303e+23, RootController.enumWithFields(RootController.Planet.MERCURY));
  }

  @Test
  void enumWithFields_shouldReturnVenusMass() {
    assertEquals(4.869e+24, RootController.enumWithFields(RootController.Planet.VENUS));
  }

  // --- Cas 6 : enumWithMethod ---

  @Test
  void enumWithMethod_shouldReturnTrue_whenWarm() {
    assertTrue(RootController.enumWithMethod(RootController.Season.SPRING));
    assertTrue(RootController.enumWithMethod(RootController.Season.SUMMER));
  }

  @Test
  void enumWithMethod_shouldReturnFalse_whenCold() {
    assertFalse(RootController.enumWithMethod(RootController.Season.AUTUMN));
    assertFalse(RootController.enumWithMethod(RootController.Season.WINTER));
  }

  // --- Cas 7 : enumWithInterface ---

  @Test
  void enumWithInterface_shouldReturnLowDescription() {
    assertEquals("Low priority", RootController.enumWithInterface(RootController.Priority.LOW));
  }

  @Test
  void enumWithInterface_shouldReturnMediumDescription() {
    assertEquals("Medium priority", RootController.enumWithInterface(RootController.Priority.MEDIUM));
  }

  @Test
  void enumWithInterface_shouldReturnHighDescription() {
    assertEquals("High priority", RootController.enumWithInterface(RootController.Priority.HIGH));
  }

  // --- Cas 8 : enumAbstractMethod ---

  @Test
  void enumAbstractMethod_shouldAdd() {
    assertEquals(13, RootController.enumAbstractMethod(RootController.Operation.ADD, 10, 3));
  }

  @Test
  void enumAbstractMethod_shouldSubtract() {
    assertEquals(7, RootController.enumAbstractMethod(RootController.Operation.SUBTRACT, 10, 3));
  }

  @Test
  void enumAbstractMethod_shouldMultiply() {
    assertEquals(30, RootController.enumAbstractMethod(RootController.Operation.MULTIPLY, 10, 3));
  }

  // --- Cas 9 : enumSet ---

  @Test
  void enumSet_shouldContainWeekend() {
    EnumSet<RootController.Day> result = RootController.enumSet();
    assertEquals(2, result.size());
    assertTrue(result.contains(RootController.Day.SATURDAY));
    assertTrue(result.contains(RootController.Day.SUNDAY));
    assertFalse(result.contains(RootController.Day.MONDAY));
  }

  // --- Cas 10 : enumMap ---

  @Test
  void enumMap_shouldContainAllSeasons() {
    EnumMap<RootController.Season, String> result = RootController.enumMap();
    assertEquals(4, result.size());
    assertEquals("Warm", result.get(RootController.Season.SPRING));
    assertEquals("Hot", result.get(RootController.Season.SUMMER));
    assertEquals("Cool", result.get(RootController.Season.AUTUMN));
    assertEquals("Cold", result.get(RootController.Season.WINTER));
  }
}
```

---

## Principes clés

- `enum` est un type à part entière en Java — pas juste une liste de constantes
- `name()` retourne le nom de la constante, `ordinal()` sa position (0-based)
- `valueOf()` convertit un `String` en constante — lève `IllegalArgumentException` si invalide
- `values()` retourne toutes les constantes dans l'ordre de déclaration
- un `enum` peut avoir des champs, un constructeur et des méthodes
- un `enum` peut implémenter une interface
- chaque constante peut avoir sa propre implémentation d'une méthode abstraite
- `EnumSet` et `EnumMap` sont des collections optimisées pour les enums

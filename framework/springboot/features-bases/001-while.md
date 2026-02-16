# while

Tous les exemples sont exécutables directement dans un contrôleur Spring Boot.

---

## Code

```java
package com.ganatan.starter.api.root;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RootController {

  @GetMapping("/")
  public Map<String, Object> root() {
    List<Integer> nominal = whileNominal(5);
    List<Integer> zeroIteration = whileZeroIteration(10, 5);
    List<Integer> breakCase = whileBreak(3);
    List<Integer> continueCase = whileContinue(6);
    int guardNoBreak = whileGuardedLoop(5, 50);
    int guardWithBreak = whileGuardedLoop(1000, 50);
    List<Integer> decrementCase = whileDecrement(5);
    List<Integer> nestedCase = whileNested(3, 2);
    List<Integer> nullGuardCaseNull = whileNullGuard(null);
    List<Integer> nullGuardCaseNonEmpty = whileNullGuard(new ArrayList<>(List.of(9, 8)));
    List<Integer> doWhileCase = doWhileNominal(3);
    List<Integer> doWhileZeroCase = doWhileNominal(0);
    int sumCase = whileSum(5);
    List<Integer> orConditionCase = whileOrCondition(3, 5);

    return Map.ofEntries(
      Map.entry("application", "springboot-starter"),
      Map.entry("status", "running"),
      Map.entry("java", System.getProperty("java.version")),
      Map.entry("while_nominal", nominal),
      Map.entry("while_zeroIteration", zeroIteration),
      Map.entry("while_break", breakCase),
      Map.entry("while_continue", continueCase),
      Map.entry("while_guard_no_break", guardNoBreak),
      Map.entry("while_guard_with_break", guardWithBreak),
      Map.entry("while_decrement", decrementCase),
      Map.entry("while_nested", nestedCase),
      Map.entry("while_null_guard_null", nullGuardCaseNull),
      Map.entry("while_null_guard_non_empty", nullGuardCaseNonEmpty),
      Map.entry("do_while_nominal", doWhileCase),
      Map.entry("do_while_zero", doWhileZeroCase),
      Map.entry("while_sum", sumCase),
      Map.entry("while_or_condition", orConditionCase)
    );
  }

  // Cas 1 : boucle nominale 0..n
  static List<Integer> whileNominal(int maxExclusive) {
    List<Integer> out = new ArrayList<>();
    int i = 0;
    while (i < maxExclusive) {
      out.add(i);
      i++;
    }
    return out;
  }

  // Cas 2 : zéro itération (condition fausse dès le départ)
  static List<Integer> whileZeroIteration(int start, int maxExclusive) {
    List<Integer> out = new ArrayList<>();
    int i = start;
    while (i < maxExclusive) {
      out.add(i);
      i++;
    }
    return out;
  }

  // Cas 3 : break
  static List<Integer> whileBreak(int breakAt) {
    List<Integer> out = new ArrayList<>();
    int i = 0;
    while (true) {
      if (i == breakAt) {
        break;
      }
      out.add(i);
      i++;
    }
    return out;
  }

  // Cas 4 : continue (filtre les pairs)
  static List<Integer> whileContinue(int maxExclusive) {
    List<Integer> out = new ArrayList<>();
    int i = 0;
    while (i < maxExclusive) {
      i++;
      if (i % 2 == 0) {
        continue;
      }
      out.add(i);
    }
    return out;
  }

  // Cas 5 : guard contre boucle infinie (deux branches : break déclenché ou non)
  static int whileGuardedLoop(int maxExclusive, int guardLimit) {
    int i = 0;
    int guard = 0;
    while (i < maxExclusive) {
      i++;
      guard++;
      if (guard > guardLimit) {
        break;
      }
    }
    return guard;
  }

  // Cas 6 : décrémentation
  static List<Integer> whileDecrement(int start) {
    List<Integer> out = new ArrayList<>();
    int i = start;
    while (i > 0) {
      out.add(i);
      i--;
    }
    return out;
  }

  // Cas 7 : boucles imbriquées
  static List<Integer> whileNested(int outerMaxInclusive, int innerMaxInclusive) {
    List<Integer> out = new ArrayList<>();
    int outer = 1;
    while (outer <= outerMaxInclusive) {
      int inner = 1;
      while (inner <= innerMaxInclusive) {
        out.add(outer * 10 + inner);
        inner++;
      }
      outer++;
    }
    return out;
  }

  // Cas 8 : null guard avec court-circuit &&
  static List<Integer> whileNullGuard(List<Integer> maybeNull) {
    List<Integer> out = new ArrayList<>();
    while (maybeNull != null && !maybeNull.isEmpty()) {
      out.add(maybeNull.remove(0));
    }
    return out;
  }

  // Cas 9 : do-while (corps exécuté au moins une fois même si condition fausse)
  static List<Integer> doWhileNominal(int maxExclusive) {
    List<Integer> out = new ArrayList<>();
    int i = 0;
    do {
      out.add(i);
      i++;
    } while (i < maxExclusive);
    return out;
  }

  // Cas 10 : accumulation / agrégat (réducteur)
  static int whileSum(int upToInclusive) {
    int sum = 0;
    int i = 1;
    while (i <= upToInclusive) {
      sum += i;
      i++;
    }
    return sum;
  }

  // Cas 11 : condition composée ||
  static List<Integer> whileOrCondition(int a, int b) {
    List<Integer> out = new ArrayList<>();
    int i = 0;
    while (i < a || i < b) {
      out.add(i);
      i++;
    }
    return out;
  }
}
```

---

## Test

```java
package com.ganatan.starter.api.root;

import static org.junit.jupiter.api.Assertions.*;

import java.util.ArrayList;
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
    assertEquals(17, result.size());

    assertEquals(APP, result.get("application"));
    assertEquals(STATUS, result.get("status"));
    assertEquals(System.getProperty(JAVA_PROP), result.get("java"));

    assertEquals(List.of(0, 1, 2, 3, 4), castList(result.get("while_nominal")));
    assertEquals(List.of(), castList(result.get("while_zeroIteration")));
    assertEquals(List.of(0, 1, 2), castList(result.get("while_break")));
    assertEquals(List.of(1, 3, 5), castList(result.get("while_continue")));
    assertEquals(5, (Integer) result.get("while_guard_no_break"));
    assertEquals(51, (Integer) result.get("while_guard_with_break"));
    assertEquals(List.of(5, 4, 3, 2, 1), castList(result.get("while_decrement")));
    assertEquals(List.of(11, 12, 21, 22, 31, 32), castList(result.get("while_nested")));
    assertEquals(List.of(), castList(result.get("while_null_guard_null")));
    assertEquals(List.of(9, 8), castList(result.get("while_null_guard_non_empty")));
    assertEquals(List.of(0, 1, 2), castList(result.get("do_while_nominal")));
    assertEquals(List.of(0), castList(result.get("do_while_zero")));
    assertEquals(15, (Integer) result.get("while_sum"));
    assertEquals(List.of(0, 1, 2, 3, 4), castList(result.get("while_or_condition")));

    assertThrows(UnsupportedOperationException.class, () -> result.put("x", "y"));
  }

  // --- Cas 1 : whileNominal ---

  @Test
  void whileNominal_shouldReturn0toN() {
    assertEquals(List.of(0, 1, 2, 3, 4), RootController.whileNominal(5));
  }

  @Test
  void whileNominal_shouldReturnEmpty_whenMaxIsZero() {
    assertEquals(List.of(), RootController.whileNominal(0));
  }

  // --- Cas 2 : whileZeroIteration ---

  @Test
  void whileZeroIteration_shouldReturnEmpty_whenStartAboveMax() {
    assertEquals(List.of(), RootController.whileZeroIteration(10, 5));
  }

  @Test
  void whileZeroIteration_shouldIterate_whenStartBelowMax() {
    assertEquals(List.of(0), RootController.whileZeroIteration(0, 1));
  }

  // --- Cas 3 : whileBreak ---

  @Test
  void whileBreak_shouldStopAtBreakAt() {
    assertEquals(List.of(0, 1, 2), RootController.whileBreak(3));
  }

  @Test
  void whileBreak_shouldReturnEmpty_whenBreakAtZero() {
    assertEquals(List.of(), RootController.whileBreak(0));
  }

  // --- Cas 4 : whileContinue ---

  @Test
  void whileContinue_shouldReturnOddNumbersOnly() {
    assertEquals(List.of(1, 3, 5), RootController.whileContinue(6));
  }

  @Test
  void whileContinue_shouldReturnEmpty_whenMaxIsZero() {
    assertEquals(List.of(), RootController.whileContinue(0));
  }

  @Test
  void whileContinue_shouldReturnSingleOdd_whenMaxIsTwo() {
    assertEquals(List.of(1), RootController.whileContinue(2));
  }

  // --- Cas 5 : whileGuardedLoop ---

  @Test
  void whileGuardedLoop_shouldReturnGuardCount_whenNoBreak() {
    assertEquals(5, RootController.whileGuardedLoop(5, 50));
  }

  @Test
  void whileGuardedLoop_shouldBreak_whenGuardLimitExceeded() {
    assertEquals(51, RootController.whileGuardedLoop(1000, 50));
  }

  @Test
  void whileGuardedLoop_shouldReturnZero_whenMaxIsZero() {
    assertEquals(0, RootController.whileGuardedLoop(0, 50));
  }

  // --- Cas 6 : whileDecrement ---

  @Test
  void whileDecrement_shouldReturnDescendingList() {
    assertEquals(List.of(5, 4, 3, 2, 1), RootController.whileDecrement(5));
  }

  @Test
  void whileDecrement_shouldReturnEmpty_whenStartIsZero() {
    assertEquals(List.of(), RootController.whileDecrement(0));
  }

  @Test
  void whileDecrement_shouldReturnSingleElement_whenStartIsOne() {
    assertEquals(List.of(1), RootController.whileDecrement(1));
  }

  // --- Cas 7 : whileNested ---

  @Test
  void whileNested_shouldReturnAllCombinations() {
    assertEquals(List.of(11, 12, 21, 22, 31, 32), RootController.whileNested(3, 2));
  }

  @Test
  void whileNested_shouldReturnEmpty_whenOuterIsZero() {
    assertEquals(List.of(), RootController.whileNested(0, 2));
  }

  @Test
  void whileNested_shouldReturnEmpty_whenInnerIsZero() {
    assertEquals(List.of(), RootController.whileNested(2, 0));
  }

  @Test
  void whileNested_shouldReturnSingleEntry_whenBothAreOne() {
    assertEquals(List.of(11), RootController.whileNested(1, 1));
  }

  // --- Cas 8 : whileNullGuard ---

  @Test
  void whileNullGuard_shouldReturnEmpty_whenSourceIsNull() {
    assertEquals(List.of(), RootController.whileNullGuard(null));
  }

  @Test
  void whileNullGuard_shouldDrainList_whenSourceIsNonEmpty() {
    List<Integer> src = new ArrayList<>(List.of(7, 6));
    assertEquals(List.of(7, 6), RootController.whileNullGuard(src));
    assertTrue(src.isEmpty());
  }

  @Test
  void whileNullGuard_shouldReturnEmpty_whenSourceIsEmptyList() {
    assertEquals(List.of(), RootController.whileNullGuard(new ArrayList<>()));
  }

  // --- Cas 9 : doWhileNominal ---

  @Test
  void doWhileNominal_shouldExecuteAtLeastOnce_evenWhenMaxIsZero() {
    assertEquals(List.of(0), RootController.doWhileNominal(0));
  }

  @Test
  void doWhileNominal_shouldReturn0toN() {
    assertEquals(List.of(0, 1, 2), RootController.doWhileNominal(3));
  }

  // --- Cas 10 : whileSum ---

  @Test
  void whileSum_shouldReturnSumUpToN() {
    assertEquals(15, RootController.whileSum(5));
  }

  @Test
  void whileSum_shouldReturnZero_whenUpToIsZero() {
    assertEquals(0, RootController.whileSum(0));
  }

  @Test
  void whileSum_shouldReturnOne_whenUpToIsOne() {
    assertEquals(1, RootController.whileSum(1));
  }

  // --- Cas 11 : whileOrCondition ---

  @Test
  void whileOrCondition_shouldIterateUpToMax_whenBDominates() {
    assertEquals(List.of(0, 1, 2, 3, 4), RootController.whileOrCondition(3, 5));
  }

  @Test
  void whileOrCondition_shouldIterateUpToMax_whenADominates() {
    assertEquals(List.of(0, 1, 2, 3, 4), RootController.whileOrCondition(5, 3));
  }

  @Test
  void whileOrCondition_shouldReturnEmpty_whenBothAreZero() {
    assertEquals(List.of(), RootController.whileOrCondition(0, 0));
  }

  // --- helper ---

  @SuppressWarnings("unchecked")
  private static List<Integer> castList(Object value) {
    assertNotNull(value);
    assertTrue(value instanceof List);
    List<?> list = (List<?>) value;
    for (Object o : list) {
      assertTrue(o instanceof Integer);
    }
    return (List<Integer>) value;
  }
}
```

---


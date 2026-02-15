# stream – tous les cas de figure (Java)

Tous les exemples sont exécutables directement dans un contrôleur Spring Boot.

---

## Code

```java
package com.ganatan.starter.api.root;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RootController {

  @GetMapping("/")
  public Map<String, Object> root() {
    List<Integer> filterResult       = streamFilter();
    List<Integer> mapResult          = streamMap();
    List<Integer> flatMapResult      = streamFlatMap();
    int reduceResult                 = streamReduce();
    List<Integer> sortedResult       = streamSorted();
    List<Integer> distinctResult     = streamDistinct();
    List<Integer> limitResult        = streamLimit();
    List<Integer> skipResult         = streamSkip();
    long countResult                 = streamCount();
    Optional<Integer> findFirstResult = streamFindFirst();
    boolean anyMatchResult           = streamAnyMatch();
    boolean allMatchResult           = streamAllMatch();
    boolean noneMatchResult          = streamNoneMatch();
    Optional<Integer> minResult      = streamMin();
    Optional<Integer> maxResult      = streamMax();
    int sumResult                    = streamSum();
    double averageResult             = streamAverage();
    Map<Boolean, List<Integer>> partitionResult = streamPartitionBy();
    Map<Integer, List<String>> groupByResult    = streamGroupBy();
    List<String> collectJoiningResult           = streamCollectJoining();
    List<Integer> peekResult                    = streamPeek();
    List<Integer> streamOfResult                = streamOf();

    return Map.ofEntries(
      Map.entry("application",        "springboot-starter"),
      Map.entry("status",             "running"),
      Map.entry("java",               System.getProperty("java.version")),
      Map.entry("stream_filter",      filterResult),
      Map.entry("stream_map",         mapResult),
      Map.entry("stream_flatmap",     flatMapResult),
      Map.entry("stream_reduce",      reduceResult),
      Map.entry("stream_sorted",      sortedResult),
      Map.entry("stream_distinct",    distinctResult),
      Map.entry("stream_limit",       limitResult),
      Map.entry("stream_skip",        skipResult),
      Map.entry("stream_count",       countResult),
      Map.entry("stream_findfirst",   findFirstResult.orElse(null)),
      Map.entry("stream_anymatch",    anyMatchResult),
      Map.entry("stream_allmatch",    allMatchResult),
      Map.entry("stream_nonematch",   noneMatchResult),
      Map.entry("stream_min",         minResult.orElse(null)),
      Map.entry("stream_max",         maxResult.orElse(null)),
      Map.entry("stream_sum",         sumResult),
      Map.entry("stream_average",     averageResult),
      Map.entry("stream_partition",   partitionResult.get(true)),
      Map.entry("stream_groupby",     groupByResult),
      Map.entry("stream_joining",     collectJoiningResult),
      Map.entry("stream_peek",        peekResult),
      Map.entry("stream_of",          streamOfResult)
    );
  }

  // Cas 1 : filter — garde les éléments qui satisfont le prédicat
  static List<Integer> streamFilter() {
    return List.of(1, 2, 3, 4, 5, 6)
      .stream()
      .filter(n -> n % 2 == 0)
      .collect(Collectors.toList());
  }

  // Cas 2 : map — transforme chaque élément
  static List<Integer> streamMap() {
    return List.of(1, 2, 3, 4, 5)
      .stream()
      .map(n -> n * 2)
      .collect(Collectors.toList());
  }

  // Cas 3 : flatMap — aplatit les collections imbriquées
  static List<Integer> streamFlatMap() {
    return List.of(List.of(1, 2), List.of(3, 4), List.of(5, 6))
      .stream()
      .flatMap(List::stream)
      .collect(Collectors.toList());
  }

  // Cas 4 : reduce — agrège en une seule valeur
  static int streamReduce() {
    return List.of(1, 2, 3, 4, 5)
      .stream()
      .reduce(0, Integer::sum);
  }

  // Cas 5 : sorted — tri naturel
  static List<Integer> streamSorted() {
    return List.of(5, 3, 1, 4, 2)
      .stream()
      .sorted()
      .collect(Collectors.toList());
  }

  // Cas 6 : distinct — supprime les doublons
  static List<Integer> streamDistinct() {
    return List.of(1, 2, 2, 3, 3, 3, 4)
      .stream()
      .distinct()
      .collect(Collectors.toList());
  }

  // Cas 7 : limit — tronque à n éléments
  static List<Integer> streamLimit() {
    return List.of(1, 2, 3, 4, 5)
      .stream()
      .limit(3)
      .collect(Collectors.toList());
  }

  // Cas 8 : skip — ignore les n premiers éléments
  static List<Integer> streamSkip() {
    return List.of(1, 2, 3, 4, 5)
      .stream()
      .skip(2)
      .collect(Collectors.toList());
  }

  // Cas 9 : count — compte les éléments
  static long streamCount() {
    return List.of(1, 2, 3, 4, 5)
      .stream()
      .filter(n -> n > 2)
      .count();
  }

  // Cas 10 : findFirst — retourne le premier élément
  static Optional<Integer> streamFindFirst() {
    return List.of(1, 2, 3, 4, 5)
      .stream()
      .filter(n -> n > 3)
      .findFirst();
  }

  // Cas 11 : anyMatch — vrai si au moins un élément satisfait le prédicat
  static boolean streamAnyMatch() {
    return List.of(1, 2, 3, 4, 5)
      .stream()
      .anyMatch(n -> n > 4);
  }

  // Cas 12 : allMatch — vrai si tous les éléments satisfont le prédicat
  static boolean streamAllMatch() {
    return List.of(2, 4, 6, 8)
      .stream()
      .allMatch(n -> n % 2 == 0);
  }

  // Cas 13 : noneMatch — vrai si aucun élément ne satisfait le prédicat
  static boolean streamNoneMatch() {
    return List.of(1, 3, 5, 7)
      .stream()
      .noneMatch(n -> n % 2 == 0);
  }

  // Cas 14 : min — retourne le minimum
  static Optional<Integer> streamMin() {
    return List.of(3, 1, 4, 1, 5, 9)
      .stream()
      .min(Comparator.naturalOrder());
  }

  // Cas 15 : max — retourne le maximum
  static Optional<Integer> streamMax() {
    return List.of(3, 1, 4, 1, 5, 9)
      .stream()
      .max(Comparator.naturalOrder());
  }

  // Cas 16 : sum via mapToInt
  static int streamSum() {
    return List.of(1, 2, 3, 4, 5)
      .stream()
      .mapToInt(Integer::intValue)
      .sum();
  }

  // Cas 17 : average via mapToInt
  static double streamAverage() {
    return List.of(1, 2, 3, 4, 5)
      .stream()
      .mapToInt(Integer::intValue)
      .average()
      .orElse(0.0);
  }

  // Cas 18 : partitioningBy — sépare en deux groupes
  static Map<Boolean, List<Integer>> streamPartitionBy() {
    return List.of(1, 2, 3, 4, 5, 6)
      .stream()
      .collect(Collectors.partitioningBy(n -> n % 2 == 0));
  }

  // Cas 19 : groupingBy — regroupe par critère
  static Map<Integer, List<String>> streamGroupBy() {
    return List.of("a", "bb", "cc", "ddd", "ee")
      .stream()
      .collect(Collectors.groupingBy(String::length));
  }

  // Cas 20 : joining — concatène en String
  static List<String> streamCollectJoining() {
    String joined = List.of("a", "b", "c")
      .stream()
      .collect(Collectors.joining(", "));
    return List.of(joined);
  }

  // Cas 21 : peek — inspecte sans modifier (debug)
  static List<Integer> streamPeek() {
    List<Integer> seen = new java.util.ArrayList<>();
    List<Integer> result = List.of(1, 2, 3)
      .stream()
      .peek(seen::add)
      .map(n -> n * 10)
      .collect(Collectors.toList());
    return result;
  }

  // Cas 22 : Stream.of — crée un stream depuis des valeurs
  static List<Integer> streamOf() {
    return Stream.of(10, 20, 30)
      .collect(Collectors.toList());
  }
}
```

---

## Test

```java
package com.ganatan.starter.api.root;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
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
    assertEquals(24, result.size());

    assertEquals(APP, result.get("application"));
    assertEquals(STATUS, result.get("status"));
    assertEquals(System.getProperty(JAVA_PROP), result.get("java"));

    assertEquals(List.of(2, 4, 6),           result.get("stream_filter"));
    assertEquals(List.of(2, 4, 6, 8, 10),    result.get("stream_map"));
    assertEquals(List.of(1, 2, 3, 4, 5, 6),  result.get("stream_flatmap"));
    assertEquals(15,                          result.get("stream_reduce"));
    assertEquals(List.of(1, 2, 3, 4, 5),     result.get("stream_sorted"));
    assertEquals(List.of(1, 2, 3, 4),        result.get("stream_distinct"));
    assertEquals(List.of(1, 2, 3),           result.get("stream_limit"));
    assertEquals(List.of(3, 4, 5),           result.get("stream_skip"));
    assertEquals(3L,                          result.get("stream_count"));
    assertEquals(4,                           result.get("stream_findfirst"));
    assertEquals(true,                        result.get("stream_anymatch"));
    assertEquals(true,                        result.get("stream_allmatch"));
    assertEquals(true,                        result.get("stream_nonematch"));
    assertEquals(1,                           result.get("stream_min"));
    assertEquals(9,                           result.get("stream_max"));
    assertEquals(15,                          result.get("stream_sum"));
    assertEquals(3.0,                         result.get("stream_average"));
    assertEquals(List.of(2, 4, 6),           result.get("stream_partition"));
    assertEquals(List.of("a, b, c"),          result.get("stream_joining"));
    assertEquals(List.of(10, 20, 30),         result.get("stream_peek"));
    assertEquals(List.of(10, 20, 30),         result.get("stream_of"));

    assertThrows(UnsupportedOperationException.class, () -> result.put("x", "y"));
  }

  // --- Cas 1 : streamFilter ---

  @Test
  void streamFilter_shouldReturnEvenNumbers() {
    assertEquals(List.of(2, 4, 6), RootController.streamFilter());
  }

  // --- Cas 2 : streamMap ---

  @Test
  void streamMap_shouldDoubleEachElement() {
    assertEquals(List.of(2, 4, 6, 8, 10), RootController.streamMap());
  }

  // --- Cas 3 : streamFlatMap ---

  @Test
  void streamFlatMap_shouldFlattenNestedLists() {
    assertEquals(List.of(1, 2, 3, 4, 5, 6), RootController.streamFlatMap());
  }

  // --- Cas 4 : streamReduce ---

  @Test
  void streamReduce_shouldReturnSum() {
    assertEquals(15, RootController.streamReduce());
  }

  // --- Cas 5 : streamSorted ---

  @Test
  void streamSorted_shouldReturnSortedList() {
    assertEquals(List.of(1, 2, 3, 4, 5), RootController.streamSorted());
  }

  // --- Cas 6 : streamDistinct ---

  @Test
  void streamDistinct_shouldRemoveDuplicates() {
    assertEquals(List.of(1, 2, 3, 4), RootController.streamDistinct());
  }

  // --- Cas 7 : streamLimit ---

  @Test
  void streamLimit_shouldTruncateToThreeElements() {
    assertEquals(List.of(1, 2, 3), RootController.streamLimit());
  }

  // --- Cas 8 : streamSkip ---

  @Test
  void streamSkip_shouldIgnoreFirstTwoElements() {
    assertEquals(List.of(3, 4, 5), RootController.streamSkip());
  }

  // --- Cas 9 : streamCount ---

  @Test
  void streamCount_shouldReturnNumberOfMatchingElements() {
    assertEquals(3L, RootController.streamCount());
  }

  // --- Cas 10 : streamFindFirst ---

  @Test
  void streamFindFirst_shouldReturnFirstMatchingElement() {
    Optional<Integer> result = RootController.streamFindFirst();
    assertTrue(result.isPresent());
    assertEquals(4, result.get());
  }

  // --- Cas 11 : streamAnyMatch ---

  @Test
  void streamAnyMatch_shouldReturnTrue_whenAtLeastOneMatches() {
    assertTrue(RootController.streamAnyMatch());
  }

  // --- Cas 12 : streamAllMatch ---

  @Test
  void streamAllMatch_shouldReturnTrue_whenAllMatch() {
    assertTrue(RootController.streamAllMatch());
  }

  // --- Cas 13 : streamNoneMatch ---

  @Test
  void streamNoneMatch_shouldReturnTrue_whenNoneMatch() {
    assertTrue(RootController.streamNoneMatch());
  }

  // --- Cas 14 : streamMin ---

  @Test
  void streamMin_shouldReturnSmallestElement() {
    Optional<Integer> result = RootController.streamMin();
    assertTrue(result.isPresent());
    assertEquals(1, result.get());
  }

  // --- Cas 15 : streamMax ---

  @Test
  void streamMax_shouldReturnLargestElement() {
    Optional<Integer> result = RootController.streamMax();
    assertTrue(result.isPresent());
    assertEquals(9, result.get());
  }

  // --- Cas 16 : streamSum ---

  @Test
  void streamSum_shouldReturnTotalSum() {
    assertEquals(15, RootController.streamSum());
  }

  // --- Cas 17 : streamAverage ---

  @Test
  void streamAverage_shouldReturnMeanValue() {
    assertEquals(3.0, RootController.streamAverage());
  }

  // --- Cas 18 : streamPartitionBy ---

  @Test
  void streamPartitionBy_shouldSeparateEvenAndOdd() {
    Map<Boolean, List<Integer>> result = RootController.streamPartitionBy();
    assertEquals(List.of(2, 4, 6), result.get(true));
    assertEquals(List.of(1, 3, 5), result.get(false));
  }

  // --- Cas 19 : streamGroupBy ---

  @Test
  void streamGroupBy_shouldGroupByStringLength() {
    Map<Integer, List<String>> result = RootController.streamGroupBy();
    assertEquals(List.of("a"), result.get(1));
    assertEquals(3, result.get(2).size());
    assertEquals(List.of("ddd"), result.get(3));
  }

  // --- Cas 20 : streamCollectJoining ---

  @Test
  void streamCollectJoining_shouldJoinWithSeparator() {
    List<String> result = RootController.streamCollectJoining();
    assertEquals("a, b, c", result.get(0));
  }

  // --- Cas 21 : streamPeek ---

  @Test
  void streamPeek_shouldNotAlterElements() {
    List<Integer> result = RootController.streamPeek();
    assertEquals(List.of(10, 20, 30), result);
  }

  // --- Cas 22 : streamOf ---

  @Test
  void streamOf_shouldCreateStreamFromValues() {
    assertEquals(List.of(10, 20, 30), RootController.streamOf());
  }
}
```

---

## Principes clés

- un `Stream` est un pipeline lazy — rien ne s'exécute avant une opération terminale
- opérations intermédiaires (lazy) : `filter`, `map`, `flatMap`, `sorted`, `distinct`, `limit`, `skip`, `peek`
- opérations terminales (déclenchent l'exécution) : `collect`, `reduce`, `count`, `findFirst`, `anyMatch`, `allMatch`, `noneMatch`, `min`, `max`, `forEach`
- un `Stream` ne peut être consommé qu'une seule fois — réutiliser la source, pas le stream
- `flatMap` : chaque élément produit un stream, tous les streams sont aplatis en un seul
- `mapToInt` / `mapToLong` / `mapToDouble` : donnent accès à `sum()`, `average()`, `min()`, `max()` sans boxing
- `Collectors.groupingBy` : regroupe en `Map<K, List<V>>`
- `Collectors.partitioningBy` : cas particulier de groupingBy avec prédicat booléen → `Map<Boolean, List<V>>`
- `Collectors.joining` : concatène les éléments en String avec séparateur optionnel
- `peek` : utile pour le debug — ne modifie pas les éléments

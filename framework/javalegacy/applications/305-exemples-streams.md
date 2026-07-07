# Java 8 - 10 exemples de traitements avec les Streams

Le projet de base ne change jamais.

Seule la classe **FileTxtLib.java** est remplacée.

Les exemples suivants utilisent toujours :

```java
try (Stream<String> lines = Files.lines(Paths.get(INPUT))) {

    ...

} catch (IOException e) {
    e.printStackTrace();
}
```

---

# Sommaire

1. Afficher toutes les lignes
2. Trier par ordre alphabétique
3. Trier par ordre inverse
4. Convertir en majuscules
5. Convertir en minuscules
6. Supprimer les lignes vides
7. Supprimer les doublons
8. Rechercher un mot
9. Afficher les 5 premiers éléments
10. Compter le nombre de lignes

---

# 1. Afficher toutes les lignes

```java
public void show() {

  try (Stream<String> lines = Files.lines(Paths.get(INPUT))) {

    lines
        .forEach(System.out::println);

  } catch (IOException e) {
    e.printStackTrace();
  }

}
```

---

# 2. Trier par ordre alphabétique

```java
public void show() {

  try (Stream<String> lines = Files.lines(Paths.get(INPUT))) {

    lines
        .sorted()
        .forEach(System.out::println);

  } catch (IOException e) {
    e.printStackTrace();
  }

}
```

---

# 3. Trier par ordre inverse

```java
public void show() {

  try (Stream<String> lines = Files.lines(Paths.get(INPUT))) {

    lines
        .sorted(Comparator.reverseOrder())
        .forEach(System.out::println);

  } catch (IOException e) {
    e.printStackTrace();
  }

}
```

Imports supplémentaires :

```java
import java.util.Comparator;
```

---

# 4. Convertir en majuscules

```java
public void show() {

  try (Stream<String> lines = Files.lines(Paths.get(INPUT))) {

    lines
        .map(String::toUpperCase)
        .forEach(System.out::println);

  } catch (IOException e) {
    e.printStackTrace();
  }

}
```

---

# 5. Convertir en minuscules

```java
public void show() {

  try (Stream<String> lines = Files.lines(Paths.get(INPUT))) {

    lines
        .map(String::toLowerCase)
        .forEach(System.out::println);

  } catch (IOException e) {
    e.printStackTrace();
  }

}
```

---

# 6. Supprimer les lignes vides

```java
public void show() {

  try (Stream<String> lines = Files.lines(Paths.get(INPUT))) {

    lines
        .filter(line -> !line.trim().isEmpty())
        .forEach(System.out::println);

  } catch (IOException e) {
    e.printStackTrace();
  }

}
```

---

# 7. Supprimer les doublons

```java
public void show() {

  try (Stream<String> lines = Files.lines(Paths.get(INPUT))) {

    lines
        .distinct()
        .forEach(System.out::println);

  } catch (IOException e) {
    e.printStackTrace();
  }

}
```

---

# 8. Rechercher un mot

Recherche des films contenant la lettre **a**.

```java
public void show() {

  try (Stream<String> lines = Files.lines(Paths.get(INPUT))) {

    lines
        .filter(movie -> movie.toLowerCase().contains("a"))
        .forEach(System.out::println);

  } catch (IOException e) {
    e.printStackTrace();
  }

}
```

---

# 9. Afficher les 5 premiers éléments

```java
public void show() {

  try (Stream<String> lines = Files.lines(Paths.get(INPUT))) {

    lines
        .limit(5)
        .forEach(System.out::println);

  } catch (IOException e) {
    e.printStackTrace();
  }

}
```

---

# 10. Compter le nombre de lignes

```java
public void show() {

  try (Stream<String> lines = Files.lines(Paths.get(INPUT))) {

    long total =
        lines.count();

    System.out.println(
        "Nombre de lignes : " +
        total);

  } catch (IOException e) {
    e.printStackTrace();
  }

}
```

---

# Conclusion

Ces dix exemples couvrent les opérations les plus courantes des Streams Java 8 :

- `forEach()`
- `sorted()`
- `map()`
- `filter()`
- `distinct()`
- `limit()`
- `count()`

Ils constituent une excellente base avant d'aborder les traitements plus avancés comme :

- `skip()`
- `collect()`
- `Collectors.toList()`
- `Collectors.groupingBy()`
- `Collectors.toMap()`
- `max()`
- `min()`
- `average()`
- `sum()`
- `reduce()`
# Static

---

## Version Simple – Java

```java
public class Main {

  static class Media {
    static String type = "FILM";  // champ static : partagé par toutes les instances
    String name;

    Media(String name) {
      this.name = name;
    }

    static void showType() {      // méthode static : appelée sans instance
      System.out.println("type : " + type);
    }
  }

  public static void main(String[] args) {

    Media.showType();                          // sans créer d'instance
    System.out.println(Media.type);            // accès direct au champ static

    Media media = new Media("Aliens");
    System.out.println("name : " + media.name);
    System.out.println("type : " + media.type); // accessible aussi via instance
  }
}
```

Résultat :
```
type : FILM
FILM
name : Aliens
type : FILM
```

---

## Version Détaillée – Java

```java
public class Main {

  // champ static : une seule valeur partagée par toutes les instances
  static class SharedField {
    static int count = 0;
    String name;

    SharedField(String name) {
      this.name = name;
      count++;  // chaque instance incrémente le même compteur
    }
  }

  // méthode static : appelée sans instance, n'accède pas aux champs d'instance
  static class StaticMethod {
    static String greet(String name) {
      return "Bonjour " + name;
    }
  }

  // constante static final : valeur fixe, partagée, jamais modifiable
  static class Constants {
    static final String APP_NAME = "java-starter";
    static final int MAX_SIZE = 100;
  }

  // static vs non-static : la différence
  static class Counter {
    static int total = 0;   // partagé par toutes les instances
    int personal = 0;       // propre à chaque instance

    void increment() {
      total++;
      personal++;
    }
  }

  // bloc static : exécuté une seule fois au chargement de la classe
  static class WithStaticBlock {
    static String config;

    static {
      config = "initialisé";
      System.out.println("bloc static exécuté");
    }
  }

  public static void main(String[] args) {

    // champ static partagé
    SharedField a = new SharedField("Inception");
    SharedField b = new SharedField("The Matrix");
    SharedField c = new SharedField("Interstellar");
    System.out.println("count : " + SharedField.count);  // 3

    // méthode static sans instance
    String message = StaticMethod.greet("Alice");
    System.out.println(message);

    // constantes
    System.out.println("app    : " + Constants.APP_NAME);
    System.out.println("max    : " + Constants.MAX_SIZE);

    // static vs non-static
    Counter c1 = new Counter();
    Counter c2 = new Counter();
    c1.increment();
    c1.increment();
    c2.increment();
    System.out.println("total    : " + Counter.total);    // 3 (partagé)
    System.out.println("c1       : " + c1.personal);     // 2 (propre à c1)
    System.out.println("c2       : " + c2.personal);     // 1 (propre à c2)

    // bloc static
    System.out.println("config : " + WithStaticBlock.config);
  }
}
```

Résultat :
```
bloc static exécuté
count : 3
Bonjour Alice
app    : java-starter
max    : 100
total    : 3
c1       : 2
c2       : 1
config : initialisé
```

---

## Version Détaillée – Spring Boot

```java
package com.ganatan.starter.api.root;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RootController {

  static class SharedField {
    static int count = 0;
    String name;
    SharedField(String name) { this.name = name; count++; }
  }

  static class StaticMethod {
    static String greet(String name) { return "Bonjour " + name; }
  }

  static class Constants {
    static final String APP_NAME = "java-starter";
    static final int MAX_SIZE = 100;
  }

  static class Counter {
    static int total = 0;
    int personal = 0;
    void increment() { total++; personal++; }
  }

  @GetMapping("/static")
  public Map<String, Object> root() {

    SharedField a = new SharedField("Inception");
    SharedField b = new SharedField("The Matrix");
    SharedField c = new SharedField("Interstellar");

    Counter c1 = new Counter();
    Counter c2 = new Counter();
    c1.increment();
    c1.increment();
    c2.increment();

    return Map.of(
      "sharedCount",  SharedField.count,
      "staticMethod", StaticMethod.greet("Alice"),
      "appName",      Constants.APP_NAME,
      "maxSize",      Constants.MAX_SIZE,
      "total",        Counter.total,
      "c1Personal",   c1.personal,
      "c2Personal",   c2.personal
    );
  }
}
```

Résultat :
```json
{
  "sharedCount":  3,
  "staticMethod": "Bonjour Alice",
  "appName":      "java-starter",
  "maxSize":      100,
  "total":        3,
  "c1Personal":   2,
  "c2Personal":   1
}
```

---

## La seule différence

| | Java pur | Spring Boot |
|---|---|---|
| Résultat | `System.out.println()` dans la console | `Map` retourné en JSON via HTTP |
| Les classes | identiques | identiques |
| La logique | identique | identique |

---

## Résumé

| | Déclaration | Appel | Partagé |
|---|---|---|---|
| Champ static | `static int count` | `Classe.count` | ✅ toutes les instances |
| Méthode static | `static void greet()` | `Classe.greet()` | ✅ sans instance |
| Constante | `static final int MAX` | `Classe.MAX` | ✅ jamais modifiable |
| Champ normal | `int personal` | `instance.personal` | ❌ propre à chaque instance |

# Class – Java pur vs Spring Boot

---

## Version 1 – Java pur

```java
public class Main {


  static class Media {
    String name;

    Media(String name) {
      this.name = name;
    }

    public void show() {
      System.out.println("00000000001");
    }
  }

  public static void main(String[] args) {

    Media media = new Media("Aliens");
    System.out.println("00000000001");
    System.out.println("00000000002:" + media.name);
  }
}
```
---


## Version 1 – Java pur

```java
public class Main {

  // classe simple : champs publics
  static class SimpleClass {
    String name;
    int value;
  }

  // classe avec constructeur
  static class ConstructorClass {
    String name;

    ConstructorClass(String name) {
      this.name = name;
    }
  }

  // encapsulation : champ privé, accès via méthode
  static class EncapsulatedClass {
    private int count;

    public int getCount() {
      return count;
    }

    public void increment() {
      count++;
    }
  }

  // classe statique : champ partagé
  static class StaticClass {
    static String type = "STATIC";
  }

  // classe abstraite : oblige les sous-classes à implémenter
  static abstract class AbstractClass {
    abstract String getType();
  }

  // classe concrète : implémente la classe abstraite
  static class ConcreteClass extends AbstractClass {
    @Override
    String getType() {
      return "CONCRETE";
    }
  }

  // interface : définit un contrat
  interface SampleInterface {
    String execute();
  }

  // implémentation de l'interface
  static class InterfaceImpl implements SampleInterface {
    @Override
    public String execute() {
      return "OK";
    }
  }

  // héritage : Child hérite de Parent
  static class Parent {
    String name = "parent";
  }

  static class Child extends Parent {
    String name = "child";

    String getNames() {
      return super.name + "-" + this.name;
    }
  }

  // immutabilité : la valeur ne peut pas changer après création
  static class ImmutableClass {
    private final String value;

    ImmutableClass(String value) {
      this.value = value;
    }

    public String getValue() {
      return value;
    }
  }

  public static void main(String[] args) {

    SimpleClass simple = new SimpleClass();
    simple.name = "simple";
    simple.value = 1;
    System.out.println("simple     : " + simple.name + ", " + simple.value);

    ConstructorClass constructor = new ConstructorClass("ctor");
    System.out.println("constructor: " + constructor.name);

    EncapsulatedClass encapsulated = new EncapsulatedClass();
    encapsulated.increment();
    System.out.println("encapsulated: " + encapsulated.getCount());

    System.out.println("static     : " + StaticClass.type);

    ConcreteClass concrete = new ConcreteClass();
    System.out.println("abstract   : " + concrete.getType());

    InterfaceImpl impl = new InterfaceImpl();
    System.out.println("interface  : " + impl.execute());

    Child child = new Child();
    System.out.println("inheritance: " + child.getNames());

    ImmutableClass immutable = new ImmutableClass("fixed");
    System.out.println("immutable  : " + immutable.getValue());
  }
}
```

Résultat :
```
simple     : simple, 1
constructor: ctor
encapsulated: 1
static     : STATIC
abstract   : CONCRETE
interface  : OK
inheritance: parent-child
immutable  : fixed
```

---

## Version 2 – Spring Boot

```java
package com.ganatan.starter.api.root;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RootController {

  static class SimpleClass {
    String name;
    int value;
  }

  static class ConstructorClass {
    String name;
    ConstructorClass(String name) { this.name = name; }
  }

  static class EncapsulatedClass {
    private int count;
    public int getCount() { return count; }
    public void increment() { count++; }
  }

  static class StaticClass {
    static String type = "STATIC";
  }

  static abstract class AbstractClass {
    abstract String getType();
  }

  static class ConcreteClass extends AbstractClass {
    @Override
    String getType() { return "CONCRETE"; }
  }

  interface SampleInterface {
    String execute();
  }

  static class InterfaceImpl implements SampleInterface {
    @Override
    public String execute() { return "OK"; }
  }

  static class Parent {
    String name = "parent";
  }

  static class Child extends Parent {
    String name = "child";
    String getNames() { return super.name + "-" + this.name; }
  }

  static class ImmutableClass {
    private final String value;
    ImmutableClass(String value) { this.value = value; }
    public String getValue() { return value; }
  }

  @GetMapping("/class")
  public Map<String, Object> root() {

    SimpleClass simple = new SimpleClass();
    simple.name = "simple";
    simple.value = 1;

    ConstructorClass constructor = new ConstructorClass("ctor");

    EncapsulatedClass encapsulated = new EncapsulatedClass();
    encapsulated.increment();

    ConcreteClass concrete = new ConcreteClass();
    InterfaceImpl impl = new InterfaceImpl();
    Child child = new Child();
    ImmutableClass immutable = new ImmutableClass("fixed");

    return Map.of(
      "simple",      Map.of("name", simple.name, "value", simple.value),
      "constructor", constructor.name,
      "encapsulated", encapsulated.getCount(),
      "static",      StaticClass.type,
      "abstract",    concrete.getType(),
      "interface",   impl.execute(),
      "inheritance", child.getNames(),
      "immutable",   immutable.getValue()
    );
  }
}
```

Résultat :
```json
{
  "simple":       { "name": "simple", "value": 1 },
  "constructor":  "ctor",
  "encapsulated": 1,
  "static":       "STATIC",
  "abstract":     "CONCRETE",
  "interface":    "OK",
  "inheritance":  "parent-child",
  "immutable":    "fixed"
}
```

---

## La seule différence

| | Java pur | Spring Boot |
|---|---|---|
| Résultat | `System.out.println()` dans la console | `Map` retourné en JSON via HTTP |
| Les classes | identiques | identiques |
| La logique | identique | identique |

Les classes internes doivent être `static` dans les deux cas pour pouvoir être instanciées sans instance de la classe parente.

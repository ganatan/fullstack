# class

---

## Code

```java
package com.ganatan.starter.api.root;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RootController {

  class SimpleClass {
    String name;
    int value;
  }

  class ConstructorClass {
    String name;

    ConstructorClass(String name) {
      this.name = name;
    }
  }

  class EncapsulatedClass {
    private int count;

    public int getCount() {
      return count;
    }

    public void increment() {
      count++;
    }
  }

  static class StaticClass {
    static String type = "STATIC";
  }

  abstract class AbstractClass {
    abstract String getType();
  }

  class ConcreteClass extends AbstractClass {
    @Override
    String getType() {
      return "CONCRETE";
    }
  }

  interface SampleInterface {
    String execute();
  }

  class InterfaceImpl implements SampleInterface {
    @Override
    public String execute() {
      return "OK";
    }
  }

  class Parent {
    String name = "parent";
  }

  class Child extends Parent {
    String name = "child";

    String getNames() {
      return super.name + "-" + this.name;
    }
  }

  class ImmutableClass {
    private final String value;

    ImmutableClass(String value) {
      this.value = value;
    }

    public String getValue() {
      return value;
    }
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
      "simple", Map.of("name", simple.name, "value", simple.value),
      "constructor", constructor.name,
      "encapsulated", encapsulated.getCount(),
      "static", StaticClass.type,
      "abstract", concrete.getType(),
      "interface", impl.execute(),
      "inheritance", child.getNames(),
      "immutable", immutable.getValue()
    );
  }
}
```

---

## Résumé

- `class` définit un type objet
- Champs + méthodes + constructeurs
- Encapsulation via `private` / `public`
- Héritage avec `extends`
- Abstraction via `abstract`
- Contrats via `interface`
- `static` partagé par la classe
- Immutabilité avec `final`

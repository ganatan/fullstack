# 003-coverage – Tests et couverture de code

## 🎯 Objectif

Mettre en place :
- JaCoCo pour la couverture
- des tests unitaires simples (socle technique)

Conventions : classes de tests au pluriel (Spring Initializr).

---

## 🧪 pom.xml – Plugin JaCoCo

À ajouter dans `<build><plugins>` :

```xml
<plugin>
  <groupId>org.jacoco</groupId>
  <artifactId>jacoco-maven-plugin</artifactId>
  <version>0.8.14</version>
  <executions>
    <execution>
      <goals>
        <goal>prepare-agent</goal>
      </goals>
    </execution>
    <execution>
      <id>report</id>
      <phase>test</phase>
      <goals>
        <goal>report</goal>
      </goals>
    </execution>
  </executions>
</plugin>
```

---

## 📁 Emplacement des tests

```
src/test/java
└── com/ganatan/starter/api
    ├── grouppurchase
    │   ├── GroupPurchaseControllerTests.java
    │   └── GroupPurchaseTests.java
    └── root
        └── RootControllerTests.java
```

---

## ✅ Code complet – GroupPurchaseControllerTests.java

```java
package com.ganatan.starter.api.grouppurchase;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.Collection;

import org.junit.jupiter.api.Test;

class GroupPurchaseControllerTests {

  @Test
  void getItemsReturnsGroupPurchases() {
    GroupPurchaseController controller = new GroupPurchaseController();
    Collection<GroupPurchase> result = controller.getItems();

    assertNotNull(result);
    assertFalse(result.isEmpty());
    assertEquals(4, result.size());
  }

}
```

---

## ✅ Code complet – GroupPurchaseTests.java

```java
package com.ganatan.starter.api.grouppurchase;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class GroupPurchaseTests {

  @Test
  void setsIdAndName() {
    GroupPurchase groupPurchase = new GroupPurchase(1L, "Computer");

    assertEquals(1L, groupPurchase.getId());
    assertEquals("Computer", groupPurchase.getName());
  }

}
```

---

## ✅ Code complet – RootControllerTests.java

```java
package com.ganatan.starter.api.root;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Map;

import org.junit.jupiter.api.Test;

class RootControllerTests {

  @Test
  void rootReturnsApplicationInfo() {
    RootController controller = new RootController();
    Map<String, Object> result = controller.root();

    assertNotNull(result);
    assertEquals("springboot-starter", result.get("application"));
    assertTrue(result.containsKey("java"));
  }

}
```

---

## ▶️ Exécution

```bash
mvn clean test
```

---

## 📊 Rapport de couverture

Rapport HTML JaCoCo :

```
target/site/jacoco/index.html
```

---

## ✅ Résultat attendu

- Tests OK
- Rapport JaCoCo généré
- Socle validé avant le MVP métier

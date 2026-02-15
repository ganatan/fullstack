# Quality setup — JaCoCo + Checkstyle (Spring Boot / Maven)

Cette documentation décrit **pas à pas**, de façon **essentielle**, comment ajouter :
- le **coverage avec JaCoCo**
- le **contrôle de style avec Checkstyle**
- des **tests unitaires simples**

dans une application **Spring Boot Maven**.

---

## 0) Pré-requis

```bash
mvn -v
```

---

## 1) Dépendances Spring Boot minimales

```xml
<dependencies>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
  </dependency>

  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
  </dependency>
</dependencies>
```

---

## 2) Coverage avec JaCoCo

### Plugin Maven

```xml
<plugin>
  <groupId>org.jacoco</groupId>
  <artifactId>jacoco-maven-plugin</artifactId>
  <version>0.8.14</version>
  <configuration>
    <excludes>
      <exclude>**/tools/**</exclude>
    </excludes>
  </configuration>
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

```bash
mvn clean test
```

Rapport :
```text
target/site/jacoco/index.html
```

---

## 3) Checkstyle

### Fichier `checkstyle.xml`

```xml
<?xml version="1.0"?>
<!DOCTYPE module PUBLIC
  "-//Checkstyle//DTD Checkstyle Configuration 1.3//EN"
  "https://checkstyle.org/dtds/configuration_1_3.dtd">

<module name="Checker">
  <module name="TreeWalker">
    <module name="AvoidStarImport"/>
    <module name="UnusedImports"/>
    <module name="RedundantImport"/>
    <module name="NeedBraces"/>
  </module>
</module>
```

### Plugin Maven

```xml
<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-checkstyle-plugin</artifactId>
  <version>3.6.0</version>
  <configuration>
    <configLocation>checkstyle.xml</configLocation>
    <consoleOutput>true</consoleOutput>
    <failsOnError>true</failsOnError>
  </configuration>
  <executions>
    <execution>
      <phase>verify</phase>
      <goals>
        <goal>check</goal>
      </goals>
    </execution>
  </executions>
</plugin>
```

---

## 🔧 Lint (Static Analysis)

Run Java static code analysis with **Checkstyle**:

```bash
mvn checkstyle:check
```

---

## 4) Tests ajoutés

### 4.1 Test du RootController

```java
package com.ganatan.starter.api.root;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Map;
import org.junit.jupiter.api.Test;

class RootControllerTests {

  private static final String APP = "springboot-starter";
  private static final String STATUS = "running";
  private static final String JAVA_PROP = "java.version";

  @Test
  void root_shouldReturnImmutableMap_withExpectedKeysAndValues() {
    RootController controller = new RootController();

    Map<String, Object> result = controller.root();

    assertNotNull(result);
    assertEquals(3, result.size());
    assertEquals(APP, result.get("application"));
    assertEquals(STATUS, result.get("status"));

    assertTrue(result.containsKey("java"));
    Object java = result.get("java");
    assertNotNull(java);
    assertTrue(java instanceof String);
    assertEquals(System.getProperty(JAVA_PROP), java);

    assertThrows(UnsupportedOperationException.class, () -> result.put("x", "y"));
  }

  @Test
  void info_shouldReturnRecord_withExpectedValues() {
    RootController controller = new RootController();

    RootController.ApiInfo info = controller.rootWithRecord();

    assertNotNull(info);
    assertEquals(APP, info.application());
    assertEquals(STATUS, info.status());

    String java = info.java();
    assertNotNull(java);
    assertFalse(java.isBlank());
    assertEquals(System.getProperty(JAVA_PROP), java);
  }

  @Test
  void status_shouldReturnMutableMap_withExpectedKeysAndValues() {
    RootController controller = new RootController();

    Map<String, Object> result = controller.rootWithHashMap();

    assertNotNull(result);
    assertEquals(3, result.size());
    assertEquals(APP, result.get("application"));
    assertEquals(STATUS, result.get("status"));

    assertTrue(result.containsKey("java"));
    Object java = result.get("java");
    assertNotNull(java);
    assertTrue(java instanceof String);
    assertEquals(System.getProperty(JAVA_PROP), java);

    assertDoesNotThrow(() -> result.put("x", "y"));
    assertEquals("y", result.get("x"));
  }

  @Test
  void allEndpoints_shouldBeConsistent_onCommonFields() {
    RootController controller = new RootController();

    Map<String, Object> root = controller.root();
    RootController.ApiInfo info = controller.rootWithRecord();
    Map<String, Object> status = controller.rootWithHashMap();

    String java = System.getProperty(JAVA_PROP);

    assertEquals(APP, root.get("application"));
    assertEquals(APP, status.get("application"));
    assertEquals(APP, info.application());

    assertEquals(STATUS, root.get("status"));
    assertEquals(STATUS, status.get("status"));
    assertEquals(STATUS, info.status());

    assertEquals(java, root.get("java"));
    assertEquals(java, status.get("java"));
    assertEquals(java, info.java());
  }
}
```

### 4.2 Test de démarrage Spring Boot

```java
package com.ganatan.starter;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class StarterApplicationTests {

  @Test
  void contextLoads() {
  }

  @Test
  void constructorTest() {
    new StarterApplication();
  }

  @Test
  void mainTest() {
    StarterApplication.main(new String[]{});
  }
}
```

---

## 5) Commande finale

```bash
mvn clean install
```

---

## Résumé

- dépendances Spring Boot minimales
- JaCoCo pour le coverage
- Checkstyle pour la qualité
- tests unitaires simples
- `mvn clean install` valide tout le projet

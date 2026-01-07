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

## 4) Tests ajoutés

### 4.1 Test du RootController

```java
package com.ganatan.starter.api.root;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Map;
import org.junit.jupiter.api.Test;

class RootControllerTest {

  @Test
  void root_shouldReturnAMap() {
    RootController controller = new RootController();
    Map<String, Object> result = controller.root();

    assertNotNull(result);
    assertEquals("springboot-starter", result.get("application"));
    assertEquals("running", result.get("status"));
    assertTrue(result.containsKey("java"));
    assertNotNull(result.get("java"));
  }

  @Test
  void root_shouldContainThreeKeys() {
    RootController controller = new RootController();
    Map<String, Object> result = controller.root();

    assertEquals(3, result.size());
  }

  @Test
  void root_shouldReturnCurrentJavaVersion() {
    RootController controller = new RootController();
    Map<String, Object> result = controller.root();

    assertEquals(System.getProperty("java.version"), result.get("java"));
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

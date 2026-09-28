# RootController

## ⚙️ Configuration Spring Boot

### application.properties

```text
spring.application.name=springboot-starter
server.port=3000
```

### application.yml

```yaml
spring:
  application:
    name: springboot-starter

server:
  port: 3000
```

## Refactor 

### Application

Renommer :

- `SpringbootStarterApplication` → `StarterApplication`

Chemin :

- `src/main/java/com/ganatan/starter/StarterApplication.java`

---

### Tests

Renommer :

- `SpringbootStarterApplicationTests` → `StarterApplicationTests`

Chemin :

- `src/test/java/com/ganatan/starter/StarterApplicationTests.java`

---

## Implémentation

### Classe

`com.ganatan.starter.api.root.RootController`

### Code

```java
package com.ganatan.starter.api.root;

import java.util.HashMap;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@SuppressWarnings("unused")
public class RootController {

  public record ApiInfo(String application, String status, String java) {}

  @GetMapping("/")
  public Map<String, Object> root() {
    return Map.of(
      "application", "springboot-starter",
      "status", "running",
      "java", System.getProperty("java.version")
    );
  }

  @GetMapping("/info")
  public ApiInfo rootWithRecord() {
    return new ApiInfo(
      "springboot-starter",
      "running",
      System.getProperty("java.version")
    );
  }

  @GetMapping("/status")
  public Map<String, Object> rootWithHashMap() {
    Map<String, Object> response = new HashMap<>();
    response.put("application", "springboot-starter");
    response.put("status", "running");
    response.put("java", System.getProperty("java.version"));
    return response;
  }

}
```

---

## Configuration Maven (pom.xml)

Mettre à jour les métadonnées du projet dans `pom.xml` :

```xml
<groupId>com.ganatan</groupId>
<artifactId>springboot-starter</artifactId>
<version>1.0.0</version>
<name>springboot-starter</name>
<description>Demo project for Spring Boot</description>
```

---

## Build & Exécution

```bash
mvn clean install                         # Nettoie, teste, compile et package l'application
mvn spring-boot:run                       # Lance l'application avec Maven
java -jar target/springboot-starter-1.0.0.jar # Lance l'application packagée
http://localhost:3000                     # Teste l'application
```

## Commandes Maven

```bash
mvn clean                                 # Nettoie le dossier target
mvn compile                               # Compile les sources
mvn test                                  # Exécute les tests
mvn package                               # Génère le fichier JAR
mvn install                               # Installe le JAR dans le repository Maven local
mvn dependency:tree                       # Affiche l'arbre des dépendances
mvn versions:display-dependency-updates   # Vérifie les mises à jour des dépendances
mvn versions:display-plugin-updates       # Vérifie les mises à jour des plugins Maven
mvn spring-boot:run                       # Lance l'application Spring Boot
```
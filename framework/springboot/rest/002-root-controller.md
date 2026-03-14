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

## Build & Tests

Compiler, exécuter les tests et packager l’application :

```bash
mvn clean install
```

Artefact généré :

```text
target/springboot-starter-1.0.0.jar
```

---

## Run

### Exécution via Maven

```bash
mvn spring-boot:run
```

### Exécution via Java

```bash
java -jar target/springboot-starter-1.0.0.jar
```

Accès :

http://localhost:3000/

---

## Résultat

Appel via navigateur ou curl :

http://localhost:3000/

Réponse JSON :

```json
{
  "application": "springboot-starter",
  "status": "running",
  "java": "21.0.x"
}
```



---

## 📦 Commandes Maven usuelles

```bash
mvn clean                   # nettoyage du dossier target
mvn compile                 # compilation des sources
mvn test                    # exécution des tests
mvn package                 # génération de l’artefact
mvn install                 # installation en repository local
mvn dependency:tree         # affichage de l’arbre de dépendances
mvn versions:display-dependency-updates
mvn versions:display-plugin-updates
mvn spring-boot:run         # exécution de l’application Spring Boot

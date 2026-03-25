# Tuto Spring Boot : charger une configuration différente selon le profil

## Objectif

Montrer concrètement qu’un profil Spring Boot change le comportement de l’application selon l’environnement :

- port différent
- nom d’application différent
- URL différente
- niveau de log différent

Le but est d’avoir une petite application simple qui permet de vérifier immédiatement quelle configuration est réellement chargée.

---

## Principe

Spring Boot peut charger :

- un fichier principal `application.yml`
- puis un fichier spécifique au profil actif :
  - `application-dev.yml`
  - `application-local.yml`
  - `application-prod.yml`

Le profil actif est choisi au lancement.

---

## Arborescence

```text
mon-projet/
├── src/
│   └── main/
│       └── resources/
│           ├── application.yml
│           ├── application-dev.yml
│           ├── application-local.yml
│           └── application-prod.yml
```

---

## Fichier principal `application.yml`

Ce fichier contient la configuration commune.

```yaml
spring:
  application:
    name: springboot-profile-demo

custom:
  api-url: http://default.local/api
  message: configuration par defaut

server:
  port: 8080

logging:
  level:
    root: INFO
```

---

## Fichier `application-dev.yml`

```yaml
spring:
  application:
    name: springboot-profile-demo-dev

custom:
  api-url: http://dev.local/api
  message: configuration du profil dev

server:
  port: 8001

logging:
  level:
    root: DEBUG
```

---

## Fichier `application-local.yml`

```yaml
spring:
  application:
    name: springboot-profile-demo-local

custom:
  api-url: http://localhost:9000/api
  message: configuration du profil local

server:
  port: 8082

logging:
  level:
    root: INFO
```

---

## Fichier `application-prod.yml`

```yaml
spring:
  application:
    name: springboot-profile-demo-prod

custom:
  api-url: https://api.ganatan.com
  message: configuration du profil prod

server:
  port: 9090

logging:
  level:
    root: WARN
```

---

## Controller `TestController`

```java
package com.example.demo.controllers;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    private final Environment environment;

    @Value("${spring.application.name}")
    private String applicationName;

    @Value("${server.port}")
    private String serverPort;

    @Value("${custom.api-url}")
    private String apiUrl;

    @Value("${custom.message}")
    private String message;

    @Value("${logging.level.root}")
    private String logLevel;

    public TestController(Environment environment) {
        this.environment = environment;
    }

    @GetMapping("/test/config")
    public Map<String, Object> getConfig() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("activeProfiles", Arrays.asList(environment.getActiveProfiles()));
        response.put("applicationName", applicationName);
        response.put("serverPort", serverPort);
        response.put("apiUrl", apiUrl);
        response.put("message", message);
        response.put("logLevel", logLevel);
        return response;
    }
}
```

---

## Classe principale

```java
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
```

---

## Résultat attendu selon le profil

## Avec `dev`

```json
{
  "activeProfiles": ["dev"],
  "applicationName": "springboot-profile-demo-dev",
  "serverPort": "8001",
  "apiUrl": "http://dev.local/api",
  "message": "configuration du profil dev",
  "logLevel": "DEBUG"
}
```

---

## Avec `local`

```json
{
  "activeProfiles": ["local"],
  "applicationName": "springboot-profile-demo-local",
  "serverPort": "8082",
  "apiUrl": "http://localhost:9000/api",
  "message": "configuration du profil local",
  "logLevel": "INFO"
}
```

---

## Avec `prod`

```json
{
  "activeProfiles": ["prod"],
  "applicationName": "springboot-profile-demo-prod",
  "serverPort": "9090",
  "apiUrl": "https://api.ganatan.com",
  "message": "configuration du profil prod",
  "logLevel": "WARN"
}
```

---

## Lancer avec le profil `dev`

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

---

## Lancer avec le profil `local`

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

---

## Lancer avec le profil `prod`

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

---

## Lancer le jar avec `dev`

```bash
java -jar target/demo-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev
```

---

## Lancer le jar avec `local`

```bash
java -jar target/demo-0.0.1-SNAPSHOT.jar --spring.profiles.active=local
```

---

## Lancer le jar avec `prod`

```bash
java -jar target/demo-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```

---

## Test dans le navigateur ou Postman

### Profil `dev`

```text
http://localhost:8001/test/config
```

### Profil `local`

```text
http://localhost:8082/test/config
```

### Profil `prod`

```text
http://localhost:9090/test/config
```

---

## Ce que montre ce tuto

Ce tuto prouve qu’en changeant uniquement le profil actif, on peut modifier :

- le port d’écoute
- le nom de l’application
- une URL métier
- le niveau de logs

C’est exactement le mécanisme utilisé pour adapter une application selon :

- le développement
- le test local
- la production

---

## Pourquoi c’est utile

En pratique :

- `dev` peut pointer vers des ressources de développement
- `local` peut pointer vers ton poste local
- `prod` vers les vraies URL de production

Tu gardes le même code Java, mais le comportement change par configuration.

---

## Variante avec un log au démarrage

Tu peux ajouter ce composant pour afficher les infos au démarrage.

```java
package com.example.demo.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class StartupLogger implements CommandLineRunner {

    @Value("${spring.application.name}")
    private String applicationName;

    @Value("${server.port}")
    private String serverPort;

    @Value("${custom.api-url}")
    private String apiUrl;

    @Override
    public void run(String... args) {
        System.out.println("applicationName = " + applicationName);
        System.out.println("serverPort = " + serverPort);
        System.out.println("apiUrl = " + apiUrl);
    }
}
```

---

## Résumé

- `application.yml` contient la base commune
- `application-dev.yml`, `application-local.yml`, `application-prod.yml` surchargent certaines valeurs
- le profil actif décide quelle configuration est utilisée
- le code Java ne change pas
- seul le comportement change selon l’environnement

---

## Suite logique

Le tuto suivant peut être :

- utiliser `@Profile` sur un `Service`
- activer un bean différent selon `dev`, `local`, `prod`
- comprendre l’ordre de priorité entre profils, variables d’environnement et arguments JVM
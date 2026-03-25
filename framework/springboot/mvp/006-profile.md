# Spring Boot : `TestController` avec profils dans le répertoire `config-local`

## Objectif

Créer un controller Spring Boot nommé `TestController` qui :

- lit le profil actif
- affiche les informations principales du profil chargé
- utilise des fichiers de configuration placés dans un répertoire externe `config-local`

---

## Arborescence

```text
mon-projet/
├── src/
│   └── main/
│       └── resources/
│           └── application.yml
├── config-local/
│   ├── application-dev.yml
│   └── application-local.yml
├── pom.xml
```

---

## Principe

Le fichier principal reste dans :

```text
src/main/resources/application.yml
```

Les profils spécifiques sont placés dans :

```text
config-local/
```

Spring Boot ne charge pas automatiquement ce dossier externe.

Il faut donc lui indiquer explicitement son emplacement au lancement.

---

## Fichier principal `src/main/resources/application.yml`

```yaml
spring:
  application:
    name: springboot-starter

server:
  port: 8080
```

---

## Fichier `config-local/application-dev.yml`

```yaml
spring:
  application:
    name: springboot-starter-dev

server:
  port: 8001

custom:
  env-name: environnement de developpement
  env-code: DEV
  env-message: profil dev charge depuis config-local
```

---

## Fichier `config-local/application-local.yml`

```yaml
spring:
  application:
    name: springboot-starter-local

server:
  port: 8082

custom:
  env-name: environnement local
  env-code: LOCAL
  env-message: profil local charge depuis config-local
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

    @Value("${spring.application.name:application-inconnue}")
    private String applicationName;

    @Value("${server.port:port-inconnu}")
    private String serverPort;

    @Value("${custom.env-name:non-defini}")
    private String envName;

    @Value("${custom.env-code:non-defini}")
    private String envCode;

    @Value("${custom.env-message:non-defini}")
    private String envMessage;

    public TestController(Environment environment) {
        this.environment = environment;
    }

    @GetMapping("/test/profile")
    public Map<String, Object> getProfileInfo() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("activeProfiles", Arrays.asList(environment.getActiveProfiles()));
        response.put("defaultProfiles", Arrays.asList(environment.getDefaultProfiles()));
        response.put("applicationName", applicationName);
        response.put("serverPort", serverPort);
        response.put("envName", envName);
        response.put("envCode", envCode);
        response.put("envMessage", envMessage);
        return response;
    }
}
```

---

## Lancement avec le profil `dev`

```bash
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Dspring.profiles.active=dev -Dspring.config.additional-location=./config-local/"
```

---

## Lancement avec le profil `local`

```bash
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Dspring.profiles.active=local -Dspring.config.additional-location=./config-local/"
```

---

## Lancement du jar avec `dev`

```bash
java -Dspring.profiles.active=dev -Dspring.config.additional-location=./config-local/ -jar target/demo-0.0.1-SNAPSHOT.jar
```

---

## Lancement du jar avec `local`

```bash
java -Dspring.profiles.active=local -Dspring.config.additional-location=./config-local/ -jar target/demo-0.0.1-SNAPSHOT.jar
```

---

## Configuration IntelliJ

Dans :

```text
Run > Edit Configurations
```

Ajouter dans `VM options` :

```bash
-Dspring.profiles.active=dev -Dspring.config.additional-location=./config-local/
```

ou :

```bash
-Dspring.profiles.active=local -Dspring.config.additional-location=./config-local/
```

---

## URL de test

### Profil `dev`

```text
http://localhost:8001/test/profile
```

### Profil `local`

```text
http://localhost:8082/test/profile
```

---

## Exemple de réponse JSON avec `dev`

```json
{
  "activeProfiles": ["dev"],
  "defaultProfiles": ["default"],
  "applicationName": "springboot-starter-dev",
  "serverPort": "8001",
  "envName": "environnement de developpement",
  "envCode": "DEV",
  "envMessage": "profil dev charge depuis config-local"
}
```

---

## Exemple de réponse JSON avec `local`

```json
{
  "activeProfiles": ["local"],
  "defaultProfiles": ["default"],
  "applicationName": "springboot-starter-local",
  "serverPort": "8082",
  "envName": "environnement local",
  "envCode": "LOCAL",
  "envMessage": "profil local charge depuis config-local"
}
```

---

## Point important sur `spring.config.additional-location`

Cette option dit à Spring Boot :

- va aussi chercher des fichiers de configuration dans ce dossier
- en plus de `src/main/resources`

Exemple :

```bash
-Dspring.config.additional-location=./config-local/
```

Le `/` final est important pour indiquer un répertoire.

---

## Variante avec un seul endpoint très simple

```java
package com.example.demo.controllers;

import java.util.Arrays;
import java.util.Map;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    private final Environment environment;

    public TestController(Environment environment) {
        this.environment = environment;
    }

    @GetMapping("/test/profile-simple")
    public Map<String, Object> getProfileSimple() {
        return Map.of(
            "activeProfiles", Arrays.asList(environment.getActiveProfiles()),
            "defaultProfiles", Arrays.asList(environment.getDefaultProfiles())
        );
    }
}
```

---

## Résumé

- `application.yml` reste dans `src/main/resources`
- `application-dev.yml` et `application-local.yml` sont dans `config-local`
- il faut lancer l'application avec `-Dspring.config.additional-location=./config-local/`
- le profil actif se définit avec `-Dspring.profiles.active=dev` ou `local`
- le controller peut afficher toutes les propriétés utiles pour vérifier le profil réellement chargé
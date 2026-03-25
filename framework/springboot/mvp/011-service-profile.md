# Tuto Spring Boot : utiliser `@Profile` sur un `@Service`

## Objectif

Montrer comment Spring Boot peut injecter automatiquement une implémentation différente d’un même service selon le profil actif.

Exemple :

- `TestServiceDev`
- `TestServiceLocal`
- `TestServiceProd`

Le but est de garder :

- une seule interface
- plusieurs implémentations
- un seul controller

Et laisser Spring choisir la bonne classe selon le profil chargé.

---

## Principe

On crée :

- une interface `TestService`
- trois implémentations annotées avec `@Profile`
- un controller qui dépend seulement de l’interface

Selon le profil actif :

- Spring instancie `TestServiceDev`
- ou `TestServiceLocal`
- ou `TestServiceProd`

---

## Structure du projet

```text
src/main/java/com/example/demo/
├── DemoApplication.java
├── controller/
│   └── TestController.java
├── service/
│   ├── TestService.java
│   ├── TestServiceDev.java
│   ├── TestServiceLocal.java
│   └── TestServiceProd.java
└── model/
    └── TestInfo.java
```

---

## Fichiers de configuration

```text
src/main/resources/
├── application.yml
├── application-dev.yml
├── application-local.yml
└── application-prod.yml
```

---

## `application.yml`

```yaml
spring:
  application:
    name: springboot-profile-service-demo

server:
  port: 8080
```

---

## `application-dev.yml`

```yaml
spring:
  application:
    name: springboot-profile-service-demo-dev

server:
  port: 8001
```

---

## `application-local.yml`

```yaml
spring:
  application:
    name: springboot-profile-service-demo-local

server:
  port: 8082
```

---

## `application-prod.yml`

```yaml
spring:
  application:
    name: springboot-profile-service-demo-prod

server:
  port: 9090
```

---

## Classe `TestInfo`

```java
package com.example.demo.model;

public class TestInfo {

    private String profile;
    private String applicationName;
    private String message;
    private String apiUrl;
    private String logLevel;

    public String getProfile() {
        return profile;
    }

    public void setProfile(String profile) {
        this.profile = profile;
    }

    public String getApplicationName() {
        return applicationName;
    }

    public void setApplicationName(String applicationName) {
        this.applicationName = applicationName;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getApiUrl() {
        return apiUrl;
    }

    public void setApiUrl(String apiUrl) {
        this.apiUrl = apiUrl;
    }

    public String getLogLevel() {
        return logLevel;
    }

    public void setLogLevel(String logLevel) {
        this.logLevel = logLevel;
    }
}
```

---

## Interface `TestService`

```java
package com.example.demo.service;

import com.example.demo.model.TestInfo;

public interface TestService {

    TestInfo getInfo();
}
```

---

## Implémentation `TestServiceDev`

```java
package com.example.demo.service;

import com.example.demo.model.TestInfo;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Service
@Profile("dev")
public class TestServiceDev implements TestService {

    @Override
    public TestInfo getInfo() {
        TestInfo info = new TestInfo();
        info.setProfile("dev");
        info.setApplicationName("springboot-profile-service-demo-dev");
        info.setMessage("service charge pour le profil dev");
        info.setApiUrl("http://dev.local/api");
        info.setLogLevel("DEBUG");
        return info;
    }
}
```

---

## Implémentation `TestServiceLocal`

```java
package com.example.demo.service;

import com.example.demo.model.TestInfo;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Service
@Profile("local")
public class TestServiceLocal implements TestService {

    @Override
    public TestInfo getInfo() {
        TestInfo info = new TestInfo();
        info.setProfile("local");
        info.setApplicationName("springboot-profile-service-demo-local");
        info.setMessage("service charge pour le profil local");
        info.setApiUrl("http://localhost:9000/api");
        info.setLogLevel("INFO");
        return info;
    }
}
```

---

## Implémentation `TestServiceProd`

```java
package com.example.demo.service;

import com.example.demo.model.TestInfo;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Service
@Profile("prod")
public class TestServiceProd implements TestService {

    @Override
    public TestInfo getInfo() {
        TestInfo info = new TestInfo();
        info.setProfile("prod");
        info.setApplicationName("springboot-profile-service-demo-prod");
        info.setMessage("service charge pour le profil prod");
        info.setApiUrl("https://api.ganatan.com");
        info.setLogLevel("WARN");
        return info;
    }
}
```

---

## `TestController`

```java
package com.example.demo.controller;

import com.example.demo.model.TestInfo;
import com.example.demo.service.TestService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    private final TestService testService;

    public TestController(TestService testService) {
        this.testService = testService;
    }

    @GetMapping("/test/profile-service")
    public TestInfo getProfileService() {
        return testService.getInfo();
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

## Résultat attendu

## Avec le profil `dev`

```json
{
  "profile": "dev",
  "applicationName": "springboot-profile-service-demo-dev",
  "message": "service charge pour le profil dev",
  "apiUrl": "http://dev.local/api",
  "logLevel": "DEBUG"
}
```

---

## Avec le profil `local`

```json
{
  "profile": "local",
  "applicationName": "springboot-profile-service-demo-local",
  "message": "service charge pour le profil local",
  "apiUrl": "http://localhost:9000/api",
  "logLevel": "INFO"
}
```

---

## Avec le profil `prod`

```json
{
  "profile": "prod",
  "applicationName": "springboot-profile-service-demo-prod",
  "message": "service charge pour le profil prod",
  "apiUrl": "https://api.ganatan.com",
  "logLevel": "WARN"
}
```

---

## Lancer avec `dev`

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

URL :

```text
http://localhost:8001/test/profile-service
```

---

## Lancer avec `local`

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

URL :

```text
http://localhost:8082/test/profile-service
```

---

## Lancer avec `prod`

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

URL :

```text
http://localhost:9090/test/profile-service
```

---

## Ce que fait Spring

Quand tu lances avec :

```bash
-Dspring.profiles.active=dev
```

Spring ne crée que le bean :

```java
TestServiceDev
```

Quand tu lances avec :

```bash
-Dspring.profiles.active=local
```

Spring ne crée que :

```java
TestServiceLocal
```

Quand tu lances avec :

```bash
-Dspring.profiles.active=prod
```

Spring ne crée que :

```java
TestServiceProd
```

Le controller ne change jamais.

Il dépend seulement de :

```java
TestService
```

---

## Pourquoi c’est utile

Cette approche sert à :

- changer de logique métier selon l’environnement
- brancher un faux service en dev
- brancher un service local de test
- brancher le vrai service externe en prod

Exemple réel :

- en `dev` tu renvoies des données mockées
- en `local` tu appelles un service local
- en `prod` tu appelles une vraie API externe

---

## Variante plus réaliste avec `@Value`

Au lieu de coder les valeurs en dur dans chaque service, tu peux injecter les propriétés du profil actif.

### `application-dev.yml`

```yaml
custom:
  message: service charge pour le profil dev
  api-url: http://dev.local/api
  log-level: DEBUG
```

### `application-local.yml`

```yaml
custom:
  message: service charge pour le profil local
  api-url: http://localhost:9000/api
  log-level: INFO
```

### `application-prod.yml`

```yaml
custom:
  message: service charge pour le profil prod
  api-url: https://api.ganatan.com
  log-level: WARN
```

---

## Exemple `TestServiceDev` avec `@Value`

```java
package com.example.demo.service;

import com.example.demo.model.TestInfo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Service
@Profile("dev")
public class TestServiceDev implements TestService {

    @Value("${spring.application.name}")
    private String applicationName;

    @Value("${custom.message}")
    private String message;

    @Value("${custom.api-url}")
    private String apiUrl;

    @Value("${custom.log-level}")
    private String logLevel;

    @Override
    public TestInfo getInfo() {
        TestInfo info = new TestInfo();
        info.setProfile("dev");
        info.setApplicationName(applicationName);
        info.setMessage(message);
        info.setApiUrl(apiUrl);
        info.setLogLevel(logLevel);
        return info;
    }
}
```

Tu peux faire pareil pour `local` et `prod`.

---

## Erreur fréquente

Si aucun profil actif ne correspond, Spring ne trouvera aucun bean `TestService`.

Exemple :

- tu n’actives ni `dev`, ni `local`, ni `prod`
- donc aucune implémentation n’est créée
- le démarrage échoue

Message typique :

```text
No qualifying bean of type 'com.example.demo.service.TestService' available
```

---

## Solution possible avec un profil par défaut

Tu peux définir une implémentation par défaut :

```java
@Service
@Profile("default")
public class TestServiceDefault implements TestService {
}
```

Ou bien définir :

```yaml
spring:
  profiles:
    default: local
```

---

## Résumé

- `@Profile` permet d’activer un bean selon l’environnement
- un même controller peut utiliser plusieurs implémentations sans changer
- Spring choisit automatiquement la bonne classe
- c’est très utile pour séparer dev, local et prod
- c’est une vraie base d’architecture propre

---

## Suite logique

Le tuto suivant peut être :

- activer un controller uniquement sur certains profils
- combiner `@Profile` avec des repositories ou des clients externes
- utiliser `spring.profiles.default`
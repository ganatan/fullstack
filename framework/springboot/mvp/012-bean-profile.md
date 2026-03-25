# Tuto Spring Boot : activer un controller ou un bean uniquement sur certains profils

## Objectif

Montrer comment exposer certains endpoints seulement sur des profils précis.

Exemples :

- endpoint disponible uniquement en `dev`
- endpoint disponible en `dev` et `local`
- bean créé seulement en `prod`

Le but est d’éviter d’exposer en production :

- des routes de test
- des routes de debug
- des routes internes
- des beans techniques temporaires

---

## Principe

Avec `@Profile`, Spring ne crée le bean que si le profil actif correspond.

Donc si tu mets `@Profile("dev")` sur un controller :

- le controller existe en `dev`
- il n’existe pas en `local`
- il n’existe pas en `prod`

Conséquence :

- les endpoints portés par ce controller n’existent pas non plus

---

## Structure du projet

```text
src/main/java/com/example/demo/
├── DemoApplication.java
├── controller/
│   ├── PublicController.java
│   ├── DevController.java
│   └── DevLocalController.java
├── service/
│   ├── TechnicalService.java
│   └── TechnicalServiceProd.java
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
    name: springboot-profile-controller-demo

server:
  port: 8080
```

---

## `application-dev.yml`

```yaml
server:
  port: 8001
```

---

## `application-local.yml`

```yaml
server:
  port: 8082
```

---

## `application-prod.yml`

```yaml
server:
  port: 9090
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

## Controller public toujours actif

Ce controller est chargé sur tous les profils.

```java
package com.example.demo.controller;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PublicController {

    @GetMapping("/public/hello")
    public Map<String, Object> hello() {
        return Map.of(
            "endpoint", "/public/hello",
            "message", "endpoint disponible sur tous les profils"
        );
    }
}
```

---

## Controller actif uniquement en `dev`

```java
package com.example.demo.controller;

import java.util.Map;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Profile("dev")
@RestController
public class DevController {

    @GetMapping("/dev/test")
    public Map<String, Object> test() {
        return Map.of(
            "endpoint", "/dev/test",
            "profile", "dev",
            "message", "endpoint disponible uniquement en dev"
        );
    }
}
```

---

## Controller actif en `dev` et `local`

```java
package com.example.demo.controller;

import java.util.Map;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Profile({ "dev", "local" })
@RestController
public class DevLocalController {

    @GetMapping("/internal/status")
    public Map<String, Object> status() {
        return Map.of(
            "endpoint", "/internal/status",
            "profiles", "dev, local",
            "message", "endpoint disponible en dev et local seulement"
        );
    }
}
```

---

## Bean actif uniquement en `prod`

On peut faire la même chose avec un service.

---

## Interface `TechnicalService`

```java
package com.example.demo.service;

public interface TechnicalService {

    String getMessage();
}
```

---

## Implémentation `TechnicalServiceProd`

```java
package com.example.demo.service;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Service
@Profile("prod")
public class TechnicalServiceProd implements TechnicalService {

    @Override
    public String getMessage() {
        return "service technique disponible uniquement en prod";
    }
}
```

---

## Controller utilisant un bean `prod` uniquement

Comme ce service n’existe qu’en `prod`, le plus simple est de créer un controller lui aussi limité à `prod`.

```java
package com.example.demo.controller;

import java.util.Map;
import com.example.demo.service.TechnicalService;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Profile("prod")
@RestController
public class ProdController {

    private final TechnicalService technicalService;

    public ProdController(TechnicalService technicalService) {
        this.technicalService = technicalService;
    }

    @GetMapping("/prod/info")
    public Map<String, Object> info() {
        return Map.of(
            "endpoint", "/prod/info",
            "profile", "prod",
            "message", technicalService.getMessage()
        );
    }
}
```

---

## Résultat attendu selon le profil

## Avec `dev`

Endpoints disponibles :

```text
/public/hello
/dev/test
/internal/status
```

Endpoint indisponible :

```text
/prod/info
```

---

## Avec `local`

Endpoints disponibles :

```text
/public/hello
/internal/status
```

Endpoints indisponibles :

```text
/dev/test
/prod/info
```

---

## Avec `prod`

Endpoints disponibles :

```text
/public/hello
/prod/info
```

Endpoints indisponibles :

```text
/dev/test
/internal/status
```

---

## Lancer avec `dev`

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

Tests :

```text
http://localhost:8001/public/hello
http://localhost:8001/dev/test
http://localhost:8001/internal/status
```

---

## Lancer avec `local`

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

Tests :

```text
http://localhost:8082/public/hello
http://localhost:8082/internal/status
```

---

## Lancer avec `prod`

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

Tests :

```text
http://localhost:9090/public/hello
http://localhost:9090/prod/info
```

---

## Ce qui se passe quand le controller n’existe pas

Si un controller n’est pas chargé à cause du profil :

- la route n’existe pas
- Spring Boot renvoie `404 Not Found`

Exemple :

- tu lances en `prod`
- tu appelles `/dev/test`
- tu obtiens une 404

C’est normal.

---

## Cas pratique très utile

Tu peux réserver à `dev` ou `local` des endpoints comme :

- reset de données
- génération de données de test
- affichage de configuration interne
- debug de connexion base de données
- endpoints de démonstration

Exemple :

```java
@Profile({ "dev", "local" })
@RestController
public class AdminDebugController {
}
```

---

## Exemple de controller de debug

```java
package com.example.demo.controller;

import java.util.Map;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RestController;

@Profile({ "dev", "local" })
@RestController
public class DebugController {

    @DeleteMapping("/debug/reset")
    public Map<String, Object> reset() {
        return Map.of(
            "message", "reset autorise uniquement en dev et local"
        );
    }
}
```

En `prod`, cette route n’existe pas.

---

## Variante avec expression de profil

Tu peux aussi écrire :

```java
@Profile("dev | local")
```

Exemple :

```java
package com.example.demo.controller;

import java.util.Map;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Profile("dev | local")
@RestController
public class InternalController {

    @GetMapping("/internal/ping")
    public Map<String, Object> ping() {
        return Map.of(
            "message", "endpoint disponible en dev ou local"
        );
    }
}
```

---

## Exclure un profil

Tu peux aussi faire l’inverse :

```java
@Profile("!prod")
```

Ce bean sera chargé partout sauf en production.

Exemple :

```java
package com.example.demo.controller;

import java.util.Map;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Profile("!prod")
@RestController
public class NonProdController {

    @GetMapping("/non-prod/info")
    public Map<String, Object> info() {
        return Map.of(
            "message", "endpoint indisponible en prod"
        );
    }
}
```

---

## Erreur fréquente

Attention :

si un controller injecte un service qui n’existe pas sur le profil courant, l’application ne démarre pas.

Exemple :

- controller actif sur tous les profils
- service actif seulement sur `prod`

Alors en `dev` :

- Spring crée le controller
- mais ne trouve pas le service
- démarrage en erreur

Donc il faut aligner les profils entre bean consommateur et bean injecté.

---

## Bonne pratique

Utiliser `@Profile` pour :

- les controllers de test
- les services de debug
- les clients techniques temporaires
- les initialisateurs de données
- les mocks

Ne pas s’en servir pour tout.

Pour la configuration simple, préfère les fichiers :

- `application-dev.yml`
- `application-local.yml`
- `application-prod.yml`

---

## Résumé

- `@Profile` peut être mis sur un controller, un service ou n’importe quel bean Spring
- si le profil ne correspond pas, le bean n’est pas créé
- si le bean est un controller, ses endpoints n’existent pas
- c’est idéal pour limiter certains endpoints à `dev` ou `local`
- en production, ces routes peuvent simplement disparaître

---

## Suite logique

Le tuto suivant peut être :

- profils et base de données différente
- profils avec MongoDB local, distant, TLS
- ordre de priorité entre `application.yml`, profils, variables d’environnement et JVM options
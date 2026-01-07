# RootController

## Objectif

Le `RootController` expose un endpoint HTTP à la racine de l’application.

Il permet :
- de vérifier que l’application Spring Boot démarre correctement
- d’avoir un point d’entrée simple pour les tests (navigateur, curl, healthcheck)
- d’exposer une information minimale de présentation au format JSON

---

## Principe

- URL exposée : /
- Méthode HTTP : GET
- Format de réponse : JSON
- Aucun accès base de données
- Aucun service métier
- Zéro dépendance technique inutile

---

## Implémentation

### Classe

com.ganatan.starter.root.RootController

### Code

```java
package com.ganatan.starter.root;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RootController {

  @GetMapping("/")
  public Map<String, Object> root() {
    return Map.of(
      "application", "springboot-starter",
      "status", "running",
      "java", System.getProperty("java.version")
    );
  }

}
```

---

## Résultat

Appel via navigateur ou curl :

http://localhost:8080/

Réponse JSON :

```json
{
  "application": "springboot-starter",
  "status": "running",
  "java": "21.0.x"
}
```

---

## Règles de conception

- Pas de logique métier
- Pas de DTO
- Pas de service
- Pas de repository
- Pas de configuration spécifique
- Le contrôleur doit rester stable dans le temps

---

## Évolution possible

Ce contrôleur peut évoluer vers :
- un endpoint /health
- un endpoint /info
- un point d’entrée pour un reverse-proxy
- un endpoint de monitoring simple

Sans jamais devenir un contrôleur métier.

---

## Position dans l’architecture

starter
├── SpringbootStarterApplication.java
└── root
    └── RootController.java

Le RootController appartient à la couche API / infrastructure.
Il ne doit jamais dépendre du domaine.

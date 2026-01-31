# 003-controllers – Root et GroupPurchase

## 🎯 Objectif

Mettre en place les premiers controllers de l’application Spring Boot :
- un endpoint racine purement technique
- un endpoint GroupPurchase servant de base au MVP

---

## 📦 Structure des packages

```
com.ganatan.starter.api
├── root
│   └── RootController.java
└── grouppurchase
    ├── GroupPurchase.java
    └── GroupPurchaseController.java
```

---

## 1️⃣ RootController (endpoint technique)

### Rôle

- Vérifier que l’application démarre
- Exposer des informations minimales
- Ne contient aucune logique métier

---

### Code

```java
package com.ganatan.starter.api.root;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RootController {

  @GetMapping("/")
  public Map<String, Object> root() {
    return Map.of(
      "application", "springboot-starter",
      "java", System.getProperty("java.version")
    );
  }

}
```

---

### Endpoint exposé

```
GET /
```

### Exemple de réponse

```json
{
  "application": "springboot-starter",
  "java": "25"
}
```

---

## 2️⃣ GroupPurchase (modèle simple)

### Rôle

Représente un achat groupé minimal.
Ce modèle est volontairement simple et sert de base au MVP.

---

### Code

```java
package com.ganatan.starter.api.grouppurchase;

public class GroupPurchase {

  private Long id;
  private String name;

  public GroupPurchase() {
  }

  public GroupPurchase(Long id, String name) {
    this.id = id;
    this.name = name;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

}
```

---

## 3️⃣ GroupPurchaseController (sandbox MVP)

### Rôle

- Exposer un endpoint simple pour tester le domaine GroupPurchase
- Servir de point d’entrée avant l’implémentation complète du MVP

---

### Code

```java
package com.ganatan.starter.api.grouppurchase;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GroupPurchaseController {

  private final List<GroupPurchase> groupPurchases = new ArrayList<>();
  private final AtomicLong counter = new AtomicLong(1);

  public GroupPurchaseController() {
    create(new GroupPurchase(null, "Computer"));
    create(new GroupPurchase(null, "Keyboard"));
    create(new GroupPurchase(null, "Smartphone"));
    create(new GroupPurchase(null, "Headphones"));
  }

  private void create(GroupPurchase groupPurchase) {
    groupPurchase.setId(counter.getAndIncrement());
    groupPurchases.add(groupPurchase);
  }

  @GetMapping("/group-purchases")
  public List<GroupPurchase> getItems() {
    return groupPurchases;
  }

}
```

---

## 🌐 Endpoint exposé

```
GET /group-purchases
```

---

## ✅ Résultat attendu

- L’application démarre correctement
- L’endpoint `/` répond avec des informations techniques
- L’endpoint `/group-purchases` retourne une liste de produits
- Le socle est prêt pour l’implémentation du MVP GroupPurchase

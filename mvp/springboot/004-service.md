# 004-group-purchase-service – Service et refactor controller

## 🎯 Objectif

Introduire un **service simple** pour :
- centraliser l’état in-memory
- rendre le controller stateless
- préparer l’implémentation du MVP

---

## 📦 Structure cible

```
src/main/java
└── com/ganatan/starter/api/grouppurchase
    ├── GroupPurchase.java
    ├── GroupPurchaseService.java
    └── GroupPurchaseController.java
```

---

## 1️⃣ Modèle : GroupPurchase

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

## 2️⃣ Service : GroupPurchaseService

Service in-memory responsable du stockage et de l’accès aux données.

```java
package com.ganatan.starter.api.grouppurchase;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Service;

@Service
public class GroupPurchaseService {

  private final Map<Long, GroupPurchase> store = new ConcurrentHashMap<>();
  private final AtomicLong counter = new AtomicLong(1);

  public GroupPurchaseService() {
    create(new GroupPurchase(null, "Computer"));
    create(new GroupPurchase(null, "Keyboard"));
    create(new GroupPurchase(null, "Smartphone"));
    create(new GroupPurchase(null, "Headphones"));
  }

  private GroupPurchase create(GroupPurchase groupPurchase) {
    Long id = counter.getAndIncrement();
    groupPurchase.setId(id);
    store.put(id, groupPurchase);
    return groupPurchase;
  }

  public List<GroupPurchase> getItems() {
    return new ArrayList<>(store.values());
  }

  public Optional<GroupPurchase> getItemById(long id) {
    return Optional.ofNullable(store.get(id));
  }

}
```

---

## 3️⃣ Controller : GroupPurchaseController

Controller stateless qui délègue entièrement au service.

```java
package com.ganatan.starter.api.grouppurchase;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GroupPurchaseController {

  private final GroupPurchaseService service;

  public GroupPurchaseController(GroupPurchaseService service) {
    this.service = service;
  }

  @GetMapping("/group-purchases")
  public List<GroupPurchase> getItems() {
    return service.getItems();
  }

  @GetMapping("/group-purchases/{id}")
  public ResponseEntity<GroupPurchase> getItemById(@PathVariable long id) {
    return service.getItemById(id)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

}
```

---

## ✅ Résultat attendu

- le controller ne contient plus d’état
- le service centralise le stockage
- `GET /group-purchases` retourne la liste
- `GET /group-purchases/{id}` retourne un élément ou 404
- socle prêt pour l’ajout des règles métier du MVP

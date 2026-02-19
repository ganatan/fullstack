# Controller – Exemple minimal sans base de données

---

## Le rôle du controller

Le controller reçoit les requêtes HTTP et retourne des réponses HTTP. C'est le point d'entrée de l'API.

```
Client HTTP  →  GET /media      →  Controller  →  retourne la liste
Client HTTP  →  POST /media     →  Controller  →  ajoute et retourne l'objet
Client HTTP  →  PUT /media/1    →  Controller  →  modifie et retourne l'objet
Client HTTP  →  DELETE /media/1 →  Controller  →  supprime, ne retourne rien
```

---

## Structure

```
com.ganatan.starter.api.media
└── MediaController.java
```

Un seul fichier.

---

## MediaController.java

```java
package com.ganatan.starter.api.media;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/media")
public class MediaController {

  // données en mémoire, pas de base de données
  private final Map<Long, String> store = new HashMap<>();
  private long nextId = 1;

  // GET /media → retourne tous les éléments
  @GetMapping
  public List<Map<String, Object>> getAll() {
    List<Map<String, Object>> result = new ArrayList<>();
    store.forEach((id, name) -> {
      Map<String, Object> item = new HashMap<>();
      item.put("id", id);
      item.put("name", name);
      result.add(item);
    });
    return result;
  }

  // GET /media/1 → retourne un élément par id
  @GetMapping("/{id}")
  public Map<String, Object> getById(@PathVariable Long id) {
    if (!store.containsKey(id)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Media non trouvé");
    }
    Map<String, Object> item = new HashMap<>();
    item.put("id", id);
    item.put("name", store.get(id));
    return item;
  }

  // POST /media → ajoute un élément, retourne 201
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Map<String, Object> create(@RequestBody Map<String, String> body) {
    Long id = nextId++;
    store.put(id, body.get("name"));
    Map<String, Object> item = new HashMap<>();
    item.put("id", id);
    item.put("name", body.get("name"));
    return item;
  }

  // PUT /media/1 → modifie un élément, retourne 200
  @PutMapping("/{id}")
  public Map<String, Object> update(@PathVariable Long id, @RequestBody Map<String, String> body) {
    if (!store.containsKey(id)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Media non trouvé");
    }
    store.put(id, body.get("name"));
    Map<String, Object> item = new HashMap<>();
    item.put("id", id);
    item.put("name", body.get("name"));
    return item;
  }

  // DELETE /media/1 → supprime un élément, retourne 204
  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id) {
    if (!store.containsKey(id)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Media non trouvé");
    }
    store.remove(id);
  }
}
```

---

## Les annotations expliquées

| Annotation          | Rôle                                              |
|---------------------|---------------------------------------------------|
| `@RestController`   | déclare que cette classe est un controller REST   |
| `@RequestMapping`   | préfixe de toutes les routes (`/media`)           |
| `@GetMapping`       | répond aux requêtes GET                           |
| `@PostMapping`      | répond aux requêtes POST                          |
| `@PutMapping`       | répond aux requêtes PUT                           |
| `@DeleteMapping`    | répond aux requêtes DELETE                        |
| `@PathVariable`     | récupère `{id}` dans l'URL                        |
| `@RequestBody`      | récupère le JSON envoyé dans le body              |
| `@ResponseStatus`   | force le code HTTP retourné (201, 204...)         |

---

## Résultats

### POST – créer

```
POST http://localhost:3000/media
{ "name": "Inception" }

→ 201 CREATED
{ "id": 1, "name": "Inception" }
```

### POST – créer un deuxième

```
POST http://localhost:3000/media
{ "name": "The Matrix" }

→ 201 CREATED
{ "id": 2, "name": "The Matrix" }
```

### GET – liste

```
GET http://localhost:3000/media

→ 200 OK
[
  { "id": 1, "name": "Inception" },
  { "id": 2, "name": "The Matrix" }
]
```

### GET – par id

```
GET http://localhost:3000/media/1

→ 200 OK
{ "id": 1, "name": "Inception" }
```

### GET – id inexistant

```
GET http://localhost:3000/media/99

→ 404 Not Found
```

### PUT – modifier

```
PUT http://localhost:3000/media/1
{ "name": "Inception 2" }

→ 200 OK
{ "id": 1, "name": "Inception 2" }
```

### DELETE – supprimer

```
DELETE http://localhost:3000/media/1

→ 204 No Content
```

---

## pom.xml – le minimum

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

Pas de JPA, pas de PostgreSQL, pas de validation. Juste `spring-boot-starter-web`.

---

## Résumé

```
@RestController   = cette classe gère des requêtes HTTP
@RequestMapping   = préfixe des routes
@GetMapping       = GET    → lire
@PostMapping      = POST   → créer   (201)
@PutMapping       = PUT    → modifier (200)
@DeleteMapping    = DELETE → supprimer (204)
```

Le controller reçoit une requête, fait quelque chose, retourne une réponse. C'est tout.

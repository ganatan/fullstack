# CRUD REST – ContinentController

## Création du package et des classes

Créer le package :

```
com.ganatan.starter.continents
```

Puis ajouter les classes :

- Continent
- ContinentController
- ContinentService
- ContinentRepository

Ensuite tester les endpoints sur :  
http://localhost:8080/continents

---

## Code du fichier `ContinentController.java`

```java
package com.ganatan.starter.continents;

import java.util.List;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/continents")
public class ContinentController {

  private final ContinentService service;

  public ContinentController(ContinentService service) {
    this.service = service;
  }

  @GetMapping
  public List<Continent> getAll() {
    return service.list();
  }

  @GetMapping("/{id}")
  public Continent getById(@PathVariable int id) {
    return service.get(id);
  }

  @PostMapping
  public void create(@RequestBody Continent body) {
    service.add(body);
  }

  @PutMapping("/{id}")
  public boolean update(@PathVariable int id, @RequestBody Continent body) {
    return service.update(id, body);
  }

  @DeleteMapping("/{id}")
  public boolean delete(@PathVariable int id) {
    return service.delete(id);
  }

}
```

---

## Endpoints exposés

| Verbe | URL | Action |
|-----|-----|-------|
| GET | /continents | Liste des continents |
| GET | /continents/{id} | Détail d’un continent |
| POST | /continents | Création |
| PUT | /continents/{id} | Mise à jour |
| DELETE | /continents/{id} | Suppression |

---

## Résumé

- Un controller REST est annoté avec `@RestController`.
- `@RequestMapping` définit la racine des endpoints.
- `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping` correspondent aux verbes REST.
- `@PathVariable` extrait un paramètre depuis l’URL.
- `@RequestBody` lit le contenu envoyé par le client.
- Toutes les méthodes exposées sont publiques.
- Le controller ne contient aucune logique métier.
- La logique métier est placée dans un `@Service`.
- Le stockage est géré par un `@Repository` (en mémoire).

---

## Explications

### `@RestController`
- Combine `@Controller` et `@ResponseBody`.
- Indique que la classe expose des endpoints REST.
- Chaque méthode retourne directement une réponse HTTP.

### `@RequestMapping("/continents")`
- Définit le préfixe commun à toutes les routes du controller.
- Centralise la racine des endpoints.

### `@GetMapping`
- Gère une requête HTTP GET.
- Utilisé pour récupérer une liste de ressources.

### `@GetMapping("/{id}")`
- Gère une requête GET sur une ressource identifiée.
- Le `{id}` est injecté via `@PathVariable`.

### `@PathVariable`
- Récupère une valeur directement depuis l’URL.
- Conversion automatique vers le type Java (`int` ici).

### `@PostMapping`
- Gère une requête HTTP POST.
- Utilisé pour la création d’une ressource.

### `@RequestBody`
- Lie le corps de la requête HTTP à un objet Java.
- Permet de recevoir du JSON envoyé par le client.

### `@PutMapping("/{id}")`
- Gère une requête HTTP PUT.
- Utilisé pour la mise à jour complète d’une ressource existante.

### `@DeleteMapping("/{id}")`
- Gère une requête HTTP DELETE.
- Utilisé pour la suppression d’une ressource.

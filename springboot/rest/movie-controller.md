# MovieController - CRUD REST

## Code Exemple

``` java
package com.ganatan.starter.movies;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

  @GetMapping
  public String getAll() {
    return "getAll";
  }

  @GetMapping("/{id}")
  public String getById(@PathVariable Long id) {
    return "getById " + id;
  }

  @PostMapping
  public String create(@RequestBody String body) {
    return "create " + body;
  }

  @PutMapping("/{id}")
  public String update(@PathVariable Long id, @RequestBody String body) {
    return "update " + id + " " + body;
  }

  @DeleteMapping("/{id}")
  public String delete(@PathVariable Long id) {
    return "delete " + id;
  }

}
```

------------------------------------------------------------------------


## Explications 

### `@RestController`
- Combine `@Controller` et `@ResponseBody`.
- Indique que la classe expose des endpoints REST.
- Chaque méthode retourne directement une réponse HTTP.

### `@RequestMapping("/api/movies")`
- Définit le préfixe commun à toutes les routes du controller.
- Centralise la racine des endpoints.

### `@GetMapping`
- Gère une requête HTTP **GET**.
- Utilisé pour récupérer des ressources.

### `@GetMapping("/{id}")`
- Gère une requête GET sur une ressource identifiée.
- Le `{id}` est injecté via `@PathVariable`.

### `@PathVariable`
- Récupère une valeur directement depuis l’URL.
- Conversion automatique vers le type Java (`Long` ici).

### `@PostMapping`
- Gère une requête HTTP **POST**.
- Utilisé pour la création d’une ressource.

### `@RequestBody`
- Lie le corps de la requête HTTP à un paramètre de méthode.
- Permet de recevoir du JSON ou du texte envoyé par le client.

### `@PutMapping("/{id}")`
- Gère une requête HTTP **PUT**.
- Utilisé pour la mise à jour d’une ressource existante.

### `@DeleteMapping("/{id}")`
- Gère une requête HTTP **DELETE**.
- Utilisé pour la suppression d’une ressource.

---

## Résumé 

- Un controller REST est annoté avec `@RestController`.
- `@RequestMapping` définit la racine des endpoints.
- `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping` correspondent aux verbes REST.
- `@PathVariable` extrait un paramètre depuis l’URL.
- `@RequestBody` lit le contenu envoyé par le client.
- Toutes les méthodes exposées sont **publiques**.
- Le controller ne contient **aucune logique métier**.
- La logique métier doit être placée dans un **@Service**.

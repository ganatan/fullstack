# Throw – Gérer les erreurs en Java

---

## Le principe

Sans `throw`, quand quelque chose se passe mal le code continue et produit des résultats incorrects.
Avec `throw`, on arrête immédiatement l'exécution et on signale l'erreur.

```
Code normal  →  continue ligne par ligne
throw        →  arrête tout, remonte jusqu'au premier catch
```

---

## Solution 1 – Débutant

`if` + `throw` avec un message simple. Une exception par cas d'erreur.

```java
public class MediaController {

  private ArrayList<Long> ids = new ArrayList<>();
  private ArrayList<String> names = new ArrayList<>();

  public String getById(Long id) {
    for (int i = 0; i < ids.size(); i++) {
      if (ids.get(i).equals(id)) {
        return names.get(i);
      }
    }
    throw new RuntimeException("Media non trouvé avec l'id : " + id);
  }

  public void delete(Long id) {
    boolean found = false;
    for (int i = 0; i < ids.size(); i++) {
      if (ids.get(i).equals(id)) {
        ids.remove(i);
        names.remove(i);
        found = true;
        break;
      }
    }
    if (!found) {
      throw new RuntimeException("Impossible de supprimer : id " + id + " introuvable");
    }
  }

  public String create(String name) {
    if (name == null) {
      throw new RuntimeException("Le nom ne peut pas être null");
    }
    if (name.isEmpty()) {
      throw new RuntimeException("Le nom ne peut pas être vide");
    }
    Long id = (long) (ids.size() + 1);
    ids.add(id);
    names.add(name);
    return "Créé avec l'id " + id;
  }
}
```

---

## Solution 2 – Intermédiaire

Classe `Media` simple. Exception personnalisée. `try/catch` pour attraper et afficher l'erreur.

```java
public class MediaController {

  static class Media {
    Long id;
    String name;
    Media(Long id, String name) {
      this.id = id;
      this.name = name;
    }
  }

  static class MediaNotFoundException extends RuntimeException {
    MediaNotFoundException(Long id) {
      super("Media non trouvé avec l'id : " + id);
    }
  }

  static class MediaInvalidException extends RuntimeException {
    MediaInvalidException(String message) {
      super(message);
    }
  }

  private List<Media> store = new ArrayList<>();
  private long nextId = 1;

  public Media getById(Long id) {
    for (Media media : store) {
      if (media.id.equals(id)) {
        return media;
      }
    }
    throw new MediaNotFoundException(id);
  }

  public Media create(String name) {
    if (name == null || name.isEmpty()) {
      throw new MediaInvalidException("Le nom est obligatoire");
    }
    Media media = new Media(nextId++, name);
    store.add(media);
    return media;
  }

  public void delete(Long id) {
    Media existing = getById(id); // lance MediaNotFoundException si introuvable
    store.remove(existing);
  }

  // exemple d'utilisation avec try/catch
  public static void main(String[] args) {
    MediaController controller = new MediaController();
    controller.create("Inception");

    try {
      controller.getById(99L);
    } catch (MediaNotFoundException e) {
      System.out.println("Erreur : " + e.getMessage());
      // affiche : Erreur : Media non trouvé avec l'id : 99
    }

    try {
      controller.create("");
    } catch (MediaInvalidException e) {
      System.out.println("Erreur : " + e.getMessage());
      // affiche : Erreur : Le nom est obligatoire
    }
  }
}
```

---

## Solution 3 – Confirmé

`HashMap` comme store. Méthode `findOrThrow` réutilisée partout. Exception avec code HTTP via Spring.

```java
@RestController
@RequestMapping("/media")
public class MediaController {

  static class Media {
    private Long id;
    private String name;

    Media(Long id, String name) {
      this.id = id;
      this.name = name;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
  }

  private final Map<Long, Media> store = new HashMap<>();
  private long nextId = 1;

  // méthode réutilisée dans getById, update, delete
  private Media findOrThrow(Long id) {
    Media media = store.get(id);
    if (media == null) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Media non trouvé");
    }
    return media;
  }

  private void validateName(String name) {
    if (name == null || name.isBlank()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le nom est obligatoire");
    }
    if (name.length() > 255) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le nom ne peut pas dépasser 255 caractères");
    }
  }

  @GetMapping("/{id}")
  public Media getById(@PathVariable Long id) {
    return findOrThrow(id);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Media create(@RequestBody Map<String, String> body) {
    String name = body.get("name");
    validateName(name);
    Long id = nextId++;
    Media media = new Media(id, name);
    store.put(id, media);
    return media;
  }

  @PutMapping("/{id}")
  public Media update(@PathVariable Long id, @RequestBody Map<String, String> body) {
    Media existing = findOrThrow(id);
    String name = body.get("name");
    validateName(name);
    existing.setName(name);
    return existing;
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id) {
    findOrThrow(id);
    store.remove(id);
  }
}
```

---

## Solution 4 – Senior

`record` immuable. `ConcurrentHashMap` thread-safe. `Optional` pour éviter les null. `@ControllerAdvice` pour centraliser tous les throws en un seul endroit.

```java
@RestController
@RequestMapping("/media")
public class MediaController {

  record Media(Long id, String name) {}

  sealed interface MediaError permits MediaError.NotFound, MediaError.Invalid {
    record NotFound(Long id) implements MediaError {}
    record Invalid(String reason) implements MediaError {}
  }

  static class MediaException extends RuntimeException {
    final MediaError error;
    MediaException(MediaError error) {
      super(error.toString());
      this.error = error;
    }
  }

  @RestControllerAdvice
  static class MediaExceptionHandler {
    @ExceptionHandler(MediaException.class)
    public ResponseEntity<Map<String, String>> handle(MediaException ex) {
      Map<String, String> body = new HashMap<>();
      HttpStatus status = switch (ex.error) {
        case MediaError.NotFound e -> {
          body.put("error", "Media non trouvé avec l'id : " + e.id());
          yield HttpStatus.NOT_FOUND;
        }
        case MediaError.Invalid e -> {
          body.put("error", e.reason());
          yield HttpStatus.BAD_REQUEST;
        }
      };
      return ResponseEntity.status(status).body(body);
    }
  }

  private final ConcurrentHashMap<Long, Media> store = new ConcurrentHashMap<>();
  private final AtomicLong nextId = new AtomicLong(1);

  private Media findOrThrow(Long id) {
    return Optional.ofNullable(store.get(id))
      .orElseThrow(() -> new MediaException(new MediaError.NotFound(id)));
  }

  private void validate(String name) {
    if (name == null || name.isBlank()) {
      throw new MediaException(new MediaError.Invalid("Le nom est obligatoire"));
    }
    if (name.length() > 255) {
      throw new MediaException(new MediaError.Invalid("Le nom ne peut pas dépasser 255 caractères"));
    }
  }

  @GetMapping
  public List<Media> getAll() {
    return new ArrayList<>(store.values());
  }

  @GetMapping("/{id}")
  public Media getById(@PathVariable Long id) {
    return findOrThrow(id);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Media create(@RequestBody Media body) {
    validate(body.name());
    Long id = nextId.getAndIncrement();
    Media media = new Media(id, body.name());
    store.put(id, media);
    return media;
  }

  @PutMapping("/{id}")
  public Media update(@PathVariable Long id, @RequestBody Media body) {
    findOrThrow(id);
    validate(body.name());
    Media updated = new Media(id, body.name());
    store.put(id, updated);
    return updated;
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id) {
    findOrThrow(id);
    store.remove(id);
  }
}
```

---

## Résumé de la progression

| | Exception utilisée | Validation | Gestion centralisée |
|---|---|---|---|
| **Débutant** | `RuntimeException` | `if` + `throw` en ligne | ❌ |
| **Intermédiaire** | classe custom `extends RuntimeException` | méthode séparée | `try/catch` local |
| **Confirmé** | `ResponseStatusException` Spring | méthode `validateName()` | ❌ |
| **Senior** | exception custom + `sealed interface` | méthode `validate()` | `@ControllerAdvice` |

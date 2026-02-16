# CRUD REST – ContinentController

Implémentation simple :
- un seul fichier
- aucun Service
- aucun Repository
- stockage en mémoire

---

## Structure

```
com.ganatan.starter.api.continent
├── ContinentController.java
└── ContinentControllerTests.java
```

---

## Endpoints exposés

| Méthode  | URL                   | Description           | Status succès  |
|----------|-----------------------|-----------------------|----------------|
| GET      | /continents           | Liste tous            | 200 OK         |
| GET      | /continents/{id}      | Trouve par id         | 200 OK         |
| POST     | /continents           | Crée un continent     | 201 CREATED    |
| PUT      | /continents/{id}      | Modifie un continent  | 200 OK         |
| DELETE   | /continents/{id}      | Supprime un continent | 204 NO CONTENT |

Base URL : `http://localhost:8080/continents`

---

## Principe

- Le controller expose les endpoints REST
- Les données sont stockées en mémoire dans une `List`
- Un identifiant est généré automatiquement via `AtomicInteger`
- Le modèle `Continent` est un `record` défini dans le controller
- Aucune logique externe

---

## Code – ContinentController.java

```java
package com.ganatan.starter.api.continent;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/continents")
public class ContinentController {

  private final AtomicInteger idCounter = new AtomicInteger(0);
  private final List<Continent> continentList = new ArrayList<>();

  public record Continent(int id, String name) {}

  public ContinentController() {
    createContinent(new Continent(0, "Africa"));
    createContinent(new Continent(0, "America"));
    createContinent(new Continent(0, "Asia"));
    createContinent(new Continent(0, "Europe"));
    createContinent(new Continent(0, "Oceania"));
    createContinent(new Continent(0, "Antarctica"));
  }

  @GetMapping
  public List<Continent> getAllContinents() {
    return continentList;
  }

  @GetMapping("/{id}")
  public Continent getContinentById(@PathVariable int id) {
    return findContinentById(id)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Continent createContinent(@RequestBody Continent newContinent) {
    int newId = idCounter.incrementAndGet();
    Continent created = new Continent(newId, newContinent.name());
    continentList.add(created);
    return created;
  }

  @PutMapping("/{id}")
  public Continent updateContinent(@PathVariable int id, @RequestBody Continent modified) {
    Continent existing = findContinentById(id)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

    Continent updated = new Continent(existing.id(), modified.name());
    continentList.set(continentList.indexOf(existing), updated);
    return updated;
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteContinent(@PathVariable int id) {
    Continent existing = findContinentById(id)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    continentList.remove(existing);
  }

  private Optional<Continent> findContinentById(int id) {
    return continentList.stream()
      .filter(c -> c.id() == id)
      .findFirst();
  }
}
```

---

## Test – ContinentControllerTests.java

```java
package com.ganatan.starter.api.continent;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

class ContinentControllerTests {

  private ContinentController controller;

  @BeforeEach
  void setUp() {
    controller = new ContinentController();
  }

  // --- GET /continents ---

  @Test
  void getAllContinents_shouldReturnSixContinents() {
    List<ContinentController.Continent> result = controller.getAllContinents();
    assertNotNull(result);
    assertEquals(6, result.size());
  }

  @Test
  void getAllContinents_shouldContainAfrica() {
    List<ContinentController.Continent> result = controller.getAllContinents();
    assertTrue(result.stream().anyMatch(c -> c.name().equals("Africa")));
  }

  @Test
  void getAllContinents_shouldHaveSequentialIds() {
    List<ContinentController.Continent> result = controller.getAllContinents();
    for (int i = 0; i < result.size(); i++) {
      assertEquals(i + 1, result.get(i).id());
    }
  }

  // --- GET /continents/{id} ---

  @Test
  void getContinentById_shouldReturnContinent_whenIdExists() {
    ContinentController.Continent result = controller.getContinentById(1);
    assertNotNull(result);
    assertEquals(1, result.id());
    assertEquals("Africa", result.name());
  }

  @Test
  void getContinentById_shouldThrowNotFound_whenIdDoesNotExist() {
    ResponseStatusException ex = assertThrows(
      ResponseStatusException.class,
      () -> controller.getContinentById(999)
    );
    assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
  }

  // --- POST /continents ---

  @Test
  void createContinent_shouldAddContinent_andReturnWithGeneratedId() {
    ContinentController.Continent input = new ContinentController.Continent(0, "Atlantis");
    ContinentController.Continent result = controller.createContinent(input);

    assertNotNull(result);
    assertEquals(7, result.id());
    assertEquals("Atlantis", result.name());
  }

  @Test
  void createContinent_shouldIncreaseSizeByOne() {
    int before = controller.getAllContinents().size();
    controller.createContinent(new ContinentController.Continent(0, "Atlantis"));
    assertEquals(before + 1, controller.getAllContinents().size());
  }

  @Test
  void createContinent_shouldIgnoreInputId_andGenerateNewOne() {
    ContinentController.Continent input = new ContinentController.Continent(999, "Atlantis");
    ContinentController.Continent result = controller.createContinent(input);
    assertNotEquals(999, result.id());
  }

  // --- PUT /continents/{id} ---

  @Test
  void updateContinent_shouldModifyName_whenIdExists() {
    ContinentController.Continent modified = new ContinentController.Continent(0, "Afrika");
    ContinentController.Continent result = controller.updateContinent(1, modified);

    assertEquals(1, result.id());
    assertEquals("Afrika", result.name());
  }

  @Test
  void updateContinent_shouldPreserveId_afterUpdate() {
    ContinentController.Continent modified = new ContinentController.Continent(0, "Afrika");
    ContinentController.Continent result = controller.updateContinent(1, modified);
    assertEquals(1, result.id());
  }

  @Test
  void updateContinent_shouldReflectChange_inGetAll() {
    controller.updateContinent(1, new ContinentController.Continent(0, "Afrika"));
    ContinentController.Continent found = controller.getContinentById(1);
    assertEquals("Afrika", found.name());
  }

  @Test
  void updateContinent_shouldThrowNotFound_whenIdDoesNotExist() {
    ResponseStatusException ex = assertThrows(
      ResponseStatusException.class,
      () -> controller.updateContinent(999, new ContinentController.Continent(0, "Unknown"))
    );
    assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
  }

  // --- DELETE /continents/{id} ---

  @Test
  void deleteContinent_shouldRemoveContinent_whenIdExists() {
    int before = controller.getAllContinents().size();
    controller.deleteContinent(1);
    assertEquals(before - 1, controller.getAllContinents().size());
  }

  @Test
  void deleteContinent_shouldMakeIdUnavailable_afterDeletion() {
    controller.deleteContinent(1);
    ResponseStatusException ex = assertThrows(
      ResponseStatusException.class,
      () -> controller.getContinentById(1)
    );
    assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
  }

  @Test
  void deleteContinent_shouldThrowNotFound_whenIdDoesNotExist() {
    ResponseStatusException ex = assertThrows(
      ResponseStatusException.class,
      () -> controller.deleteContinent(999)
    );
    assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
  }

  // --- record Continent ---

  @Test
  void continent_record_shouldExposeNameAndId() {
    ContinentController.Continent c = new ContinentController.Continent(42, "TestLand");
    assertEquals(42, c.id());
    assertEquals("TestLand", c.name());
  }

  @Test
  void continent_record_shouldImplementEquality() {
    ContinentController.Continent c1 = new ContinentController.Continent(1, "Africa");
    ContinentController.Continent c2 = new ContinentController.Continent(1, "Africa");
    assertEquals(c1, c2);
  }
}
```

---

## Principes clés

- `@RestController` + `@RequestMapping` : définit la base URL du controller
- `@GetMapping` / `@PostMapping` / `@PutMapping` / `@DeleteMapping` : mappe les verbes HTTP
- `@PathVariable` : extrait une variable depuis l'URL (`/continents/{id}`)
- `@RequestBody` : désérialise le corps JSON en objet Java
- `@ResponseStatus(HttpStatus.CREATED)` : force le code HTTP 201 sur le POST
- `@ResponseStatus(HttpStatus.NO_CONTENT)` : force le code HTTP 204 sur le DELETE
- `ResponseStatusException` : lève une erreur HTTP avec le status approprié
- `AtomicInteger` : génère des ids thread-safe sans base de données
- `record` : modèle immuable, equals/hashCode/toString générés automatiquement
- `Optional` + `stream().filter().findFirst()` : recherche propre sans boucle explicite
- stockage en mémoire : les données sont perdues au redémarrage

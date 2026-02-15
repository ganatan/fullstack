# CRUD REST — ContinentController (In-Memory)

Implémentation volontairement simple :
- 1 seul fichier
- aucun Service / Repository
- stockage en mémoire
- endpoints REST complets + tests

---

## Structure

```
src/main/java/com/ganatan/starter/continents
└── ContinentController.java

src/test/java/com/ganatan/starter/continents
└── ContinentControllerTests.java
```

---

## Endpoints exposés

- GET    `/continents`
- GET    `/continents/{id}`
- POST   `/continents`
- PUT    `/continents/{id}`
- DELETE `/continents/{id}`

Base URL :
`http://localhost:8080/continents`

---

## Principes

- Le controller expose les endpoints REST
- Les données sont stockées en mémoire dans une `List`
- Un identifiant est généré via `AtomicInteger`
- Le modèle `Continent` est un `record` interne
- Erreurs REST standards via `ResponseStatusException` :
  - 404 si ressource absente
  - 201 sur création
  - 204 sur suppression
  - 400 si payload invalide

---

## Code complet — ContinentController.java

```java
package com.ganatan.starter.continents;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
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
    Optional<Continent> found = findContinentById(id);
    if (found.isEmpty()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }
    return found.get();
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Continent createContinent(@RequestBody Continent newContinent) {
    if (newContinent == null || newContinent.name() == null || newContinent.name().isBlank()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    }
    int newId = idCounter.incrementAndGet();
    Continent created = new Continent(newId, newContinent.name().trim());
    continentList.add(created);
    return created;
  }

  @PutMapping("/{id}")
  public Continent updateContinent(@PathVariable int id, @RequestBody Continent modified) {
    Optional<Continent> existing = findContinentById(id);
    if (existing.isEmpty()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }
    if (modified == null || modified.name() == null || modified.name().isBlank()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    }
    Continent updated = new Continent(existing.get().id(), modified.name().trim());
    int position = continentList.indexOf(existing.get());
    continentList.set(position, updated);
    return updated;
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteContinent(@PathVariable int id) {
    Optional<Continent> existing = findContinentById(id);
    if (existing.isEmpty()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }
    continentList.remove(existing.get());
  }

  private Optional<Continent> findContinentById(int id) {
    for (Continent continent : continentList) {
      if (continent.id() == id) {
        return Optional.of(continent);
      }
    }
    return Optional.empty();
  }
}
```

---

## Tests — ContinentControllerTests.java

Tests MVC avec `MockMvc` :
- vérifie les status HTTP (200/201/204/404/400)
- vérifie le JSON retourné (liste, item, update)
- vérifie l’évolution de la liste (create/delete)

```java
package com.ganatan.starter.continents;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(ContinentController.class)
class ContinentControllerTests {

  @Autowired
  private MockMvc mvc;

  @Test
  void getAll_shouldReturnInitialSixContinents() throws Exception {
    mvc.perform(get("/continents"))
      .andExpect(status().isOk())
      .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
      .andExpect(jsonPath("$", hasSize(6)))
      .andExpect(jsonPath("$[0].id", is(1)))
      .andExpect(jsonPath("$[0].name", is("Africa")));
  }

  @Test
  void getById_shouldReturnContinent_whenExists() throws Exception {
    mvc.perform(get("/continents/1"))
      .andExpect(status().isOk())
      .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
      .andExpect(jsonPath("$.id", is(1)))
      .andExpect(jsonPath("$.name", is("Africa")));
  }

  @Test
  void getById_shouldReturn404_whenNotExists() throws Exception {
    mvc.perform(get("/continents/999"))
      .andExpect(status().isNotFound());
  }

  @Test
  void create_shouldReturn201_andAppendElement() throws Exception {
    mvc.perform(post("/continents")
        .contentType(MediaType.APPLICATION_JSON)
        .content("{\"id\":0,\"name\":\"Atlantis\"}"))
      .andExpect(status().isCreated())
      .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
      .andExpect(jsonPath("$.id", is(7)))
      .andExpect(jsonPath("$.name", is("Atlantis")));

    mvc.perform(get("/continents"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$", hasSize(7)))
      .andExpect(jsonPath("$[6].id", is(7)))
      .andExpect(jsonPath("$[6].name", is("Atlantis")));
  }

  @Test
  void create_shouldReturn400_whenNameMissingOrBlank() throws Exception {
    mvc.perform(post("/continents")
        .contentType(MediaType.APPLICATION_JSON)
        .content("{\"id\":0,\"name\":\"\"}"))
      .andExpect(status().isBadRequest());

    mvc.perform(post("/continents")
        .contentType(MediaType.APPLICATION_JSON)
        .content("{\"id\":0}"))
      .andExpect(status().isBadRequest());
  }

  @Test
  void update_shouldReturn200_andModifyElement() throws Exception {
    mvc.perform(put("/continents/1")
        .contentType(MediaType.APPLICATION_JSON)
        .content("{\"id\":123,\"name\":\"AFRICA\"}"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.id", is(1)))
      .andExpect(jsonPath("$.name", is("AFRICA")));

    mvc.perform(get("/continents/1"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.id", is(1)))
      .andExpect(jsonPath("$.name", is("AFRICA")));
  }

  @Test
  void update_shouldReturn404_whenNotExists() throws Exception {
    mvc.perform(put("/continents/999")
        .contentType(MediaType.APPLICATION_JSON)
        .content("{\"id\":0,\"name\":\"X\"}"))
      .andExpect(status().isNotFound());
  }

  @Test
  void update_shouldReturn400_whenNameBlank() throws Exception {
    mvc.perform(put("/continents/1")
        .contentType(MediaType.APPLICATION_JSON)
        .content("{\"id\":0,\"name\":\"  \"}"))
      .andExpect(status().isBadRequest());
  }

  @Test
  void delete_shouldReturn204_andRemoveElement() throws Exception {
    mvc.perform(delete("/continents/1"))
      .andExpect(status().isNoContent());

    mvc.perform(get("/continents/1"))
      .andExpect(status().isNotFound());

    mvc.perform(get("/continents"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$", hasSize(5)));
  }

  @Test
  void delete_shouldReturn404_whenNotExists() throws Exception {
    mvc.perform(delete("/continents/999"))
      .andExpect(status().isNotFound());
  }
}
```

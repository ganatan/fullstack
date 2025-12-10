# MovieController - CRUD REST

Controller REST minimal avec les 4 opérations :

-   GET
-   POST
-   PUT
-   DELETE

Endpoints :

    GET     /api/movies
    GET     /api/movies/{id}
    POST    /api/movies
    PUT     /api/movies/{id}
    DELETE  /api/movies/{id}

------------------------------------------------------------------------

## Code

``` java
package com.ganatan.starter.movies;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

  @GetMapping
  public String getAll() {
    System.out.println("00000000001:GetMapping");
    return "getAll";
  }

  @GetMapping("/{id}")
  public String getById(@PathVariable Long id) {
    System.out.println("00000000001:GetMapping("/{id}")");
    return "getById " + id;
  }

  @PostMapping
  public String create(@RequestBody String body) {
    System.out.println("00000000001:PostMapping");
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

Retour REST :\
[◀️ REST](./README.md)

Retour Springboot :\
[◀️ Springboot](../README.md)

Retour fullstack :\
[◀️ fullstack](../../README.md)

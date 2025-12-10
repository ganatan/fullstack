# MovieController - CRUD REST

``` java
package com.ganatan.starter.movies;

import org.springframework.web.bind.annotation.*;

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


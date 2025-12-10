# MovieController - CRUD REST

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


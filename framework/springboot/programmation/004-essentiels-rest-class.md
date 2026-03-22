### REST & CLASS
```java
package com.mvp.controllers;

public class Movie {

    private String title;
    private int budget;

    public Movie() {
    }

    public Movie(String title, int budget) {
        this.title = title;
        this.budget = budget;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getBudget() {
        return budget;
    }

    public void setBudget(int budget) {
        this.budget = budget;
    }

}
```

```java
package com.mvp.controllers;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MovieController {

    @GetMapping("/movies")
    public Movie getMovie() {
        Movie movie = new Movie();
        movie.setTitle("Dune");
        movie.setBudget(165000000);
        return movie;
    }

    @GetMapping("/movies/{title}/{budget}")
    public Movie getMovieByPath(
            @PathVariable String title,
            @PathVariable int budget) {

        Movie movie = new Movie();
        movie.setTitle(title);
        movie.setBudget(budget);

        System.out.println("@PathVariable title = " + title);
        System.out.println("@PathVariable budget = " + budget);

        return movie;
    }
    // GET http://localhost:3000/movies/Dune/165000000

    @GetMapping("/movies/search")
    public Movie getMovieByParams(
            @RequestParam String title,
            @RequestParam int budget) {

        Movie movie = new Movie();
        movie.setTitle(title);
        movie.setBudget(budget);

        System.out.println("@RequestParam title = " + title);
        System.out.println("@RequestParam budget = " + budget);

        return movie;
    }
    // GET http://localhost:3000/movies/search?title=Dune&budget=165000000

    @GetMapping("/movies/header")
    public String getMovieHeader(
            @RequestHeader("param1") String param1,
            @RequestHeader("param2") String param2) {

        System.out.println("@RequestHeader param1 = " + param1);
        System.out.println("@RequestHeader param2 = " + param2);

        return "param1 = " + param1 + ", param2 = " + param2;
    }
    // GET http://localhost:3000/movies/header
    // Headers à remplir :
    // param1: abc
    // param2: 123

    @PostMapping("/movies")
    public Movie createMovie(@RequestBody Movie movie) {
        System.out.println("@RequestBody title = " + movie.getTitle());
        System.out.println("@RequestBody budget = " + movie.getBudget());
        return movie;
    }
    // POST http://localhost:3000/movies
    // Body JSON à remplir :
    // {
    //   "title": "Alien",
    //   "budget": 11000000
    // }

    @PostMapping("/movies/{title}")
    public Movie createMovieWithPath(
            @PathVariable String title,
            @RequestBody Movie movie) {

        System.out.println("@PathVariable title = " + title);
        System.out.println("@RequestBody title = " + movie.getTitle());
        System.out.println("@RequestBody budget = " + movie.getBudget());

        movie.setTitle(title);
        return movie;
    }
    // POST http://localhost:3000/movies/BladeRunner
    // Body JSON à remplir :
    // {
    //   "title": "test",
    //   "budget": 28000000
    // }

    @DeleteMapping("/movies/{title}")
    public String deleteMovie(@PathVariable String title) {
        System.out.println("@DeleteMapping title = " + title);
        return "movie deleted = " + title;
    }
    // DELETE http://localhost:3000/movies/Dune
}
```
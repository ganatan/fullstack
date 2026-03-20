### enum
```java
public enum MovieName {
    ALIEN,
    ALIENS,
    GLADIATOR
}
```

### Constantes
```java
final int MOVIES_MAXIMUM = 10;
```

### HashMap
```java
@RestController
@RequestMapping
public class TestController {
    @GetMapping("/test")
    Map<String,Object> get() {
        Map<String,Object> movie;
        movie = new HashMap<>();
        movie.put("name","Alien");
        return movie;
    }
}
```

### LinkedHashMap
```java
@RestController
@RequestMapping
public class TestController {
    @GetMapping("/test")
    Map<String,Object> get() {
        Map<String,Object> movie;
        movie = new LinkedHashMap<>();
        movie.put("name","Alien");
        return movie;
    }
}
```

### Tableau

```java
@RestController
@RequestMapping
public class TestController {
    @GetMapping("/test")
    public String[] get() {
        String[] moviesList = new String[2];
        moviesList[0] = "Aliens";
        moviesList[1] = "Gladiator";
        return moviesList;
    }
}
```
### List
```java
@RestController
@RequestMapping
public class TestController {
    @GetMapping("/test")
    List<String> get() {
        List<String> moviesList;
        moviesList = new ArrayList<>();
        moviesList.add("Aliens");
        moviesList.add("Gladiator");
        return moviesList;
    }
}
```

### class
```java
public class Movie {
    private String name;
    private int budget;

    public Movie(String name, int budget) {
        this.name = name;
        this.budget = budget;
    }

    public String getName() {
        return name;
    }

    public int getBudget() {
        return budget;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setBudget(int budget) {
        this.budget = budget;
    }
}

@RestController
@RequestMapping
public class TestController {
    @GetMapping("/test")
    Movie get() {
        Movie movie = new Movie("Aliens",1111);
        movie.setName("Aliens2");
        movie.setBudget(2222);
        return movie;
    }
}
```


### for
```java
  for (int i = 0; i < 5; i++) {
  }
```

### swicth
```java
  switch (index) {
      case 0:
      case 1:
      default:
  }
```

### Comparateur String
```java
  String name1 = "Aliens";
  String name2 = "Gladiator";
  if (name1.equals(name2)) {
  }
```


### Comparateur int
```java
int budget1 = 1111;
int budget2 = 2222;

if (budget1 == budget2) {
} else {
}

if (budget1 != budget2) {
} else {
}
```

### Comparateur boolean
```java
boolean ok1 = true;
boolean ok2 = false;

if (ok1 == ok2) {
} else {
}

if (ok1 != ok2) {
} else {
}
```


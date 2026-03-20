### 

```java
@RestController
@RequestMapping
public class TestController {
    @GetMapping("/test")
    String[] get() {
        String[] moviesList;
        moviesList = new String[2];
        moviesList[0] = "Aliens";
        moviesList[1] = "Aliens";
        return moviesList;
    }
}
```
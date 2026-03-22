# HTTP

- `200 OK` : succès
- `201 Created` : ressource créée
- `204 No Content` : succès sans retour
- `400 Bad Request` : requête invalide
- `401 Unauthorized` : authentification requise
- `403 Forbidden` : accès interdit
- `404 Not Found` : ressource introuvable
- `500 Internal Server Error` : erreur serveur

### GetMapping
```java
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/param")
public class ParamController {
//    @GetMapping("items")
    @GetMapping("/items")
    String getItems() {
        System.out.println("00000000001:items");
        return "Items";
    }
}
```

```java
package com.mvp.controllers;

import java.util.Map;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/items")
public class ItemController {

    // GET /items
    @GetMapping
    public String getItems() {
        System.out.println("00000000001:GET:/items");
        return "GET:/items";
    }

    // GET /items/10
    @GetMapping("/{id}")
    public String getItemById(@PathVariable String id) {
        System.out.println("00000000001:@PathVariable:id = " + id);
        return "@PathVariable:id = " + id;

    }

    //    GET /items/search?title=Dune&budget=1234
    @GetMapping("/search")
    public String searchItem(
            @RequestParam String title,
            @RequestParam int budget) {
        System.out.println("00000000001:title = " + title);
        System.out.println("00000000002:budget = " + budget);
        return "00000000001:title = " + title + ":budget = " + budget;
    }

    // dans header param1: mvp
    @GetMapping("/header")
    public String getHeader(@RequestHeader("param1") String param1Name) {
        System.out.println("@RequestHeader param1 = " + param1Name);
        return "@RequestHeader param1 = " + param1Name;
    }

//    http://localhost:3000/items/allheaders
    @GetMapping("/allheaders")
    public String getHeaders(@RequestHeader Map<String, String> headers) {
        headers.forEach((key, value) ->
                System.out.println("00000000001:" + key + " = " + value)
        );
        return "getHeaders";
    }

//    {
//        "title": "Dune",
//            "director": "Denis Villeneuve",
//            "year": 2021
//    }
    @PostMapping
    public String createItem(@RequestBody String body) {
        System.out.println("RequestBody = " + body);
        return "OK";
    }

    //    {
//        "title": "Dune",
//            "director": "Denis Villeneuve",
//            "year": 2021
//    }
    @PostMapping("/json")
    public String createItemJson(@RequestBody Map<String, Object> body) {
        System.out.println("00000000001:RequestBody JSON = " + body);
        System.out.println("00000000001:title = " + body.get("title"));
        System.out.println("00000000001:director = " + body.get("director"));
        return "OK";
    }

//    http://localhost:3000/items/2
//    {
//        "title": "Dune",
//            "director": "Denis Villeneuve",
//            "year": 2021
//    }
    @PostMapping("/{id}")
    public String createItemWithPath(
            @PathVariable String id,
            @RequestBody String body) {
        System.out.println("PathVariable id = " + id);
        System.out.println("RequestBody = " + body);
        return "OK";
    }

    //  POST  /items/full/99?title=Alien
    @PostMapping("/full/{id}")
    public String createFull(
            @PathVariable String id,
            @RequestParam String title,
            @RequestHeader("param1") String clientName,
            @RequestBody String body) {
        System.out.println("PathVariable id = " + id);
        System.out.println("RequestParam title = " + title);
        System.out.println("RequestHeader param1 = " + clientName);
        System.out.println("RequestBody = " + body);
        return "OK";
    }

    @DeleteMapping("/{id}")
    public String deleteItem(@PathVariable String id) {
        System.out.println("DELETE PathVariable id = " + id);
        return "OK";
    }

    //  DELTE  /items/99
    @DeleteMapping
    public String deleteItemByParam(@RequestParam String id) {
        System.out.println("DELETE RequestParam id = " + id);
        return "OK";
    }

}
```
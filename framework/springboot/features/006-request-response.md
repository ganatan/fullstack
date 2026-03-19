# Cas simples pour tester une API Spring Boot

## Test simple de `@PathVariable` avec un GET

`@PathVariable` sert à lire une valeur directement dans l’URL.

## Import

```java
import org.springframework.web.bind.annotation.PathVariable;
```

## Exemple de controller

```java
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ParamController {

    @GetMapping("/produits/{code}")
    public String getProduit(@PathVariable String code) {
        return "code = " + code;
    }
}
```

## URL à tester

```text
http://localhost:3000/produits/REC0001
```

## Résultat attendu

```text
code = REC0001
```

---

## Test simple de `@RequestParam` avec un GET

`@RequestParam` sert à lire un paramètre passé dans l’URL après `?`.

## Import

```java
import org.springframework.web.bind.annotation.RequestParam;
```

## Exemple de controller

```java
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ParamController {

    @GetMapping("/rechercher-param")
    public String rechercher(@RequestParam String code) {
        return "code = " + code;
    }
}
```

## URL à tester

```text
http://localhost:3000/rechercher-param?code=REC0001
```

## Résultat attendu

```text
code = REC0001
```

---

## Test simple de plusieurs `@RequestParam` avec un GET

`@RequestParam` peut lire plusieurs paramètres dans la même URL.

## Import

```java
import org.springframework.web.bind.annotation.RequestParam;
```

## Exemple de controller

```java
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ParamController {

    @GetMapping("/rechercher-multi")
    public String rechercherMulti(@RequestParam String code, @RequestParam String type) {
        return "code = " + code + ", type = " + type;
    }
}
```

## URL à tester

```text
http://localhost:3000/rechercher-multi?code=REC0001&type=film
```

## Résultat attendu

```text
code = REC0001, type = film
```

---

## Test simple de `@RequestHeader` avec un POST

`@RequestHeader` sert à lire un header HTTP envoyé par le client.

## Import

```java
import org.springframework.web.bind.annotation.RequestHeader;
```

## Exemple de controller

```java
import java.util.Map;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ParamController {

    @PostMapping("/rechercher-header")
    public Map<String, Object> rechercher(@RequestHeader("aaaa") String aaaa) {
        return Map.of(
                "header", aaaa
        );
    }
}
```

## Header à envoyer

```text
aaaa: 1111
```

## URL à tester

```text
http://localhost:3000/rechercher-header
```

## Résultat attendu

```json
{
  "header": "1111"
}
```

---

## Test simple de `@RequestBody` avec un POST

`@RequestBody` sert à lire le JSON envoyé dans le body de la requête HTTP.

## Import

```java
import org.springframework.web.bind.annotation.RequestBody;
```

## Exemple de controller

```java
import java.util.Map;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ParamController {

    @PostMapping("/rechercher-body")
    public Map<String, Object> rechercher(@RequestBody Map<String, Object> body) {
        return Map.of(
                "message", "POST recu",
                "body", body
        );
    }
}
```

## Body JSON à envoyer

```json
{
  "code": "REC0001",
  "libelle": "Mon test"
}
```

## URL à tester

```text
http://localhost:3000/rechercher-body
```

## Résultat attendu

```json
{
  "message": "POST recu",
  "body": {
    "code": "REC0001",
    "libelle": "Mon test"
  }
}
```

---

## Test simple de `ResponseEntity` avec un GET

`ResponseEntity` sert à contrôler la réponse HTTP retournée.

## Import

```java
import org.springframework.http.ResponseEntity;
```

## Exemple de controller

```java
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ParamController {

    @GetMapping("/response")
    public ResponseEntity<String> response() {
        return ResponseEntity.ok("OK response");
    }
}
```

## URL à tester

```text
http://localhost:3000/response
```

## Résultat attendu

```text
OK response
```

---

## Test simple de `ResponseEntity` avec un POST et `@RequestBody`

`ResponseEntity` peut aussi retourner un JSON construit à partir du body reçu.

## Imports

```java
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
```

## Exemple de controller

```java
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ParamController {

    @PostMapping("/response-body")
    public ResponseEntity<Map<String, Object>> rechercher(@RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(
                Map.of(
                        "message", "POST recu",
                        "body", body
                )
        );
    }
}
```

## Body JSON à envoyer

```json
{
  "name": "Danny"
}
```

## URL à tester

```text
http://localhost:3000/response-body
```

## Résultat attendu

```json
{
  "message": "POST recu",
  "body": {
    "name": "Danny"
  }
}
```

---

## Test simple de `@RequestBody` et `@RequestHeader` avec un POST

On peut lire en même temps le body JSON et les headers HTTP.

## Imports

```java
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
```

## Exemple de controller

```java
import java.util.Map;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ParamController {

    @PostMapping("/rechercher-complet")
    public Map<String, Object> rechercher(
            @RequestBody Map<String, Object> body,
            @RequestHeader("aaaa") String aaaa) {
        return Map.of(
                "header", aaaa,
                "body", body
        );
    }
}
```

## Header à envoyer

```text
aaaa: 1111
```

## Body JSON à envoyer

```json
{
  "code": "REC0001",
  "libelle": "Mon test"
}
```

## URL à tester

```text
http://localhost:3000/rechercher-complet
```

## Résultat attendu

```json
{
  "header": "1111",
  "body": {
    "code": "REC0001",
    "libelle": "Mon test"
  }
}
```

---

## Test simple de `@PathVariable`, `@RequestParam`, `@RequestHeader` et `@RequestBody` avec un POST

Ce cas permet de voir toutes les entrées d’une requête HTTP au même endroit.

## Imports

```java
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.http.ResponseEntity;
```

## Exemple de controller

```java
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ParamController {

    @PostMapping("/objets/{code}")
    public ResponseEntity<Map<String, Object>> testComplet(
            @PathVariable String code,
            @RequestParam String type,
            @RequestHeader("aaaa") String aaaa,
            @RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(
                Map.of(
                        "code", code,
                        "type", type,
                        "header", aaaa,
                        "body", body
                )
        );
    }
}
```

## Header à envoyer

```text
aaaa: 1111
```

## Body JSON à envoyer

```json
{
  "libelle": "Mon test complet"
}
```

## URL à tester

```text
http://localhost:3000/objets/REC0001?type=film
```

## Résultat attendu

```json
{
  "code": "REC0001",
  "type": "film",
  "header": "1111",
  "body": {
    "libelle": "Mon test complet"
  }
}
```
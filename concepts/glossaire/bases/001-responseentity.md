# 001-responseentity.md — ResponseEntity (Spring) — très simple

## C’est quoi

`ResponseEntity` sert à renvoyer une réponse HTTP en contrôlant :

- le **code HTTP** (200, 404, 400…)
- les **headers**
- le **contenu**

---

## Sans ResponseEntity (simple)

Spring renvoie **200** automatiquement.

```java
@GetMapping("/hello")
public String hello() {
    return "ok";
}
```

Résultat :
- status : `200 OK`
- body : `ok`

---

## Avec ResponseEntity (contrôle)

Tu décides du code HTTP et du body.

```java
@GetMapping("/hello2")
public ResponseEntity<String> hello2() {
    return ResponseEntity.ok("ok");
}
```

---

## Exemple : renvoyer 404

```java
@GetMapping("/notfound")
public ResponseEntity<String> notfound() {
    return ResponseEntity.notFound().build();
}
```

---

# Détails (plus d’exemples)

## 1) Choisir un status (builder)

```java
@GetMapping("/created")
public ResponseEntity<String> created() {
    return ResponseEntity.status(201).body("created");
}
```

```java
@GetMapping("/badrequest")
public ResponseEntity<String> badrequest() {
    return ResponseEntity.badRequest().body("bad request");
}
```

---

## 2) Ajouter des headers

```java
@GetMapping("/with-headers")
public ResponseEntity<String> withHeaders() {
    return ResponseEntity.ok()
            .header("X-App", "demo")
            .header("Cache-Control", "no-store")
            .body("ok");
}
```

---

## 3) Spécifier le Content-Type

```java
@GetMapping("/text")
public ResponseEntity<String> text() {
    return ResponseEntity.ok()
            .contentType(org.springframework.http.MediaType.TEXT_PLAIN)
            .body("plain");
}
```

```java
@GetMapping("/json")
public ResponseEntity<String> json() {
    return ResponseEntity.ok()
            .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
            .body("{\"status\":\"ok\"}");
}
```

---

## 4) Retourner un objet (JSON automatique)

```java
record StatusResponse(String status) {}

@GetMapping("/status")
public ResponseEntity<StatusResponse> status() {
    return ResponseEntity.ok(new StatusResponse("ok"));
}
```

---

## 5) Retourner un body vide

```java
@GetMapping("/empty")
public ResponseEntity<Void> empty() {
    return ResponseEntity.ok().build();
}
```

---

## 6) Location header (souvent après création)

```java
@GetMapping("/location")
public ResponseEntity<Void> location() {
    return ResponseEntity.status(201)
            .header("Location", "/resource/123")
            .build();
}
```

---

## 7) Contrôle fin : HttpHeaders + ResponseEntity

```java
@GetMapping("/headers-object")
public ResponseEntity<String> headersObject() {
    var headers = new org.springframework.http.HttpHeaders();
    headers.add("X-Trace-Id", "abc123");
    headers.add("Cache-Control", "no-cache");

    return new ResponseEntity<>("ok", headers, org.springframework.http.HttpStatus.OK);
}
```

---

## 8) Gestion simple d’un paramètre

```java
@GetMapping("/param")
public ResponseEntity<String> param(@RequestParam(required = false) String q) {
    if (q == null || q.isBlank()) {
        return ResponseEntity.badRequest().body("missing q");
    }
    return ResponseEntity.ok("q=" + q);
}
```

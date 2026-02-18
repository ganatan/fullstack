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

# 002-cors.md — CORS — très simple

## C’est quoi

CORS (Cross-Origin Resource Sharing) est un mécanisme HTTP pour dire au navigateur :
- “ce site A a le droit d’appeler cette API B”
- sinon le navigateur bloque l’accès à la réponse

---

## Important

- CORS est appliqué par le **navigateur**.
- `curl` et Postman **ne bloquent pas** (ils ne font pas CORS).
- CORS = des **headers** `Access-Control-*` renvoyés par le serveur.
- Certaines requêtes déclenchent un **preflight** `OPTIONS`.

---

## Sans preflight (cas simple)

Requête simple (GET typiquement) :

- le navigateur envoie `Origin: http://localhost:4200`
- si le serveur répond avec `Access-Control-Allow-Origin`, le navigateur laisse passer

Header clé :

- `Access-Control-Allow-Origin: http://localhost:4200`

---

## Avec preflight (OPTIONS)

Avant la requête réelle, le navigateur envoie :

- `OPTIONS /api/...`
- `Origin: http://localhost:4200`
- `Access-Control-Request-Method: POST` (ou PUT/DELETE, etc.)

Le serveur doit répondre avec :

- `Access-Control-Allow-Origin`
- `Access-Control-Allow-Methods`
- (souvent) `Access-Control-Allow-Headers`

Sinon → le navigateur bloque.

---

## Test sans frontend (curl)

Test “GET + Origin” :

```bash
curl -i http://localhost:3000/api -H "Origin: http://localhost:4200"
```

Si tu vois `Access-Control-Allow-Origin` → CORS est en place.

Test “preflight OPTIONS” :

```bash
curl -i -X OPTIONS http://localhost:3000/api \
  -H "Origin: http://localhost:4200" \
  -H "Access-Control-Request-Method: GET"
```

---

# Avec Spring Boot

## 1) Exemple Controller

```java
@RestController
@RequestMapping("/api")
public class CorsController {

    @GetMapping
    public String ping() {
        return "pong";
    }
}
```

---

## 2) CORS global (recommandé)

`src/main/java/.../CorsConfig.java`

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:4200")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }
}
```

---

## 3) Tester CORS (sans frontend)

GET :

```bash
curl -i http://localhost:3000/api -H "Origin: http://localhost:4200"
```

Attendu (si CORS OK) :

- `Access-Control-Allow-Origin: http://localhost:4200`

OPTIONS (preflight) :

```bash
curl -i -X OPTIONS http://localhost:3000/api \
  -H "Origin: http://localhost:4200" \
  -H "Access-Control-Request-Method: GET"
```

Attendu :

- `Access-Control-Allow-Origin: http://localhost:4200`
- `Access-Control-Allow-Methods: ...`

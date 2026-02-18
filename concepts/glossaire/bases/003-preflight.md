# 003-preflight.md — Preflight CORS — très simple

## C’est quoi

Le **preflight** est une requête **OPTIONS** envoyée par le navigateur **avant** la requête réelle pour demander :
- “est-ce que j’ai le droit d’appeler cette URL avec cette méthode et ces headers ?”

---

## Quand ça arrive

Le navigateur déclenche un preflight si la requête n’est pas “simple”, par exemple :
- méthode **POST/PUT/DELETE/PATCH**
- ou headers custom (ex: `Authorization`)
- ou `Content-Type: application/json` (souvent)

---

## Ce que le navigateur envoie (OPTIONS)

Exemple :

```http
OPTIONS /api/ping HTTP/1.1
Origin: http://localhost:4200
Access-Control-Request-Method: GET
Access-Control-Request-Headers: Authorization, Content-Type
```

---

## Ce que le serveur doit répondre

Headers attendus (minimum) :

- `Access-Control-Allow-Origin: http://localhost:4200`
- `Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS`
- `Access-Control-Allow-Headers: Authorization, Content-Type`

Si ces headers ne sont pas bons → le navigateur bloque la requête réelle.

---

## Test rapide (sans frontend)

### 1) Simuler un preflight

```bash
curl -i -X OPTIONS http://localhost:3000/api/ping \
  -H "Origin: http://localhost:4200" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Authorization, Content-Type"
```

### 2) Vérifier dans la réponse

Tu dois voir au moins :

- `Access-Control-Allow-Origin: http://localhost:4200`
- `Access-Control-Allow-Methods: ...`
- `Access-Control-Allow-Headers: ...`

---

# Détails (plus d’exemples)

## 1) Preflight pour un POST JSON

```bash
curl -i -X OPTIONS http://localhost:3000/api/ping \
  -H "Origin: http://localhost:4200" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type"
```

---

## 2) Preflight pour Authorization (Bearer)

```bash
curl -i -X OPTIONS http://localhost:3000/api/ping \
  -H "Origin: http://localhost:4200" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Authorization"
```

---

## 3) Cas typique d’échec

Si le serveur répond sans :

- `Access-Control-Allow-Origin`
ou sans la bonne méthode/headers

Alors :
- le navigateur n’envoie **pas** la requête réelle
- tu vois une erreur CORS dans la console navigateur

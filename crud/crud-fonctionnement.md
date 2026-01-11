# Fonctionnement d’un CRUD (Continent)

Ce document donne **l’essentiel** d’un CRUD HTTP pour une seule ressource : **Continent**.

Objectif : avoir une référence simple pour :
- comprendre les verbes HTTP (GET, POST, PUT, DELETE)
- tester rapidement avec Postman
- rester compatible avec plusieurs backends (Spring Boot, NestJS, Express, Symfony, Django)

---

## Ressource : Continent

### Format JSON (réponse)

```json
{
  "id": 1,
  "name": "Europe"
}
```

### Contraintes minimales

- `id` : entier strictement positif, généré par le backend
- `name` : obligatoire, non vide, longueur max 50, trim côté backend

---

## Base URL

En local (exemples) :

```
http://localhost:3000
```

Si ton backend écoute sur un autre port (ex: 8080), remplace la base URL.

---

## 1) GET — Lire

### GET /continents (liste)

- Usage : récupérer tous les continents

**Request**
- Method: `GET`
- URL: `{{baseUrl}}/continents`

**Response 200**
```json
[
  { "id": 1, "name": "Africa" },
  { "id": 2, "name": "America" },
  { "id": 3, "name": "Asia" },
  { "id": 4, "name": "Europe" },
  { "id": 5, "name": "Oceania" },
  { "id": 6, "name": "Antarctica" }
]
```

---

### GET /continents/{id} (détail)

- Usage : récupérer un continent par id

**Request**
- Method: `GET`
- URL: `{{baseUrl}}/continents/4`

**Response 200**
```json
{ "id": 4, "name": "Europe" }
```

**Response 404**
```json
{ "error": "CONTINENT_NOT_FOUND" }
```

---

## 2) POST — Créer

### POST /continents

- Usage : créer un continent
- Le client envoie uniquement `name`

**Request**
- Method: `POST`
- URL: `{{baseUrl}}/continents`
- Headers:
  - `Content-Type: application/json`
- Body (raw / JSON) :
```json
{ "name": "Europe" }
```

**Response 201**
```json
{ "id": 7, "name": "Europe" }
```

**Response 400 (validation)**
```json
{
  "error": "VALIDATION_ERROR",
  "details": {
    "name": "must not be blank"
  }
}
```

---

## 3) PUT — Mettre à jour

### PUT /continents/{id}

- Usage : remplacer le nom d’un continent
- Le backend met à jour l’objet identifié par `{id}`

**Request**
- Method: `PUT`
- URL: `{{baseUrl}}/continents/4`
- Headers:
  - `Content-Type: application/json`
- Body (raw / JSON) :
```json
{ "name": "Europa" }
```

**Response 200**
```json
{ "id": 4, "name": "Europa" }
```

**Response 404**
```json
{ "error": "CONTINENT_NOT_FOUND" }
```

**Response 400 (validation)**
```json
{
  "error": "VALIDATION_ERROR",
  "details": {
    "name": "must not be blank"
  }
}
```

---

## 4) DELETE — Supprimer

### DELETE /continents/{id}

- Usage : supprimer un continent
- Réponse standard : **204 No Content**

**Request**
- Method: `DELETE`
- URL: `{{baseUrl}}/continents/4`

**Response 204**
(no content)

**Response 404**
```json
{ "error": "CONTINENT_NOT_FOUND" }
```

---

## Postman — variables recommandées

Dans Postman, crée une variable d’environnement :

- `baseUrl` = `http://localhost:3000`

Ensuite, utilise `{{baseUrl}}` dans toutes les URLs.

---

## Postman — templates rapides

### 1) GET all continents
- Method: `GET`
- URL: `{{baseUrl}}/continents`

### 2) GET continent by id
- Method: `GET`
- URL: `{{baseUrl}}/continents/1`

### 3) POST create continent
- Method: `POST`
- URL: `{{baseUrl}}/continents`
- Header: `Content-Type: application/json`
- Body:
```json
{ "name": "Europe" }
```

### 4) PUT update continent
- Method: `PUT`
- URL: `{{baseUrl}}/continents/1`
- Header: `Content-Type: application/json`
- Body:
```json
{ "name": "Europa" }
```

### 5) DELETE continent
- Method: `DELETE`
- URL: `{{baseUrl}}/continents/1`

---

## Mini check-list (tests rapides)

- GET all retourne un tableau JSON
- POST crée un nouvel `id`
- GET by id retourne 200 après création
- PUT modifie le `name`
- DELETE retourne 204
- GET by id après DELETE retourne 404

---

## Conclusion

Ce CRUD est volontairement simple :
- une ressource
- un id
- une propriété `name`

C’est une base stable pour comparer plusieurs backends avec exactement les mêmes tests Postman.

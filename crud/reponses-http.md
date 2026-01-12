# CRUD REST — Réponses HTTP

Référence **simple, visuelle et universelle** des réponses HTTP pour un CRUD REST.

Ressource d’exemple : `Continent`  
URL de base : `/continents`

Objectif :
- décider rapidement **quel code HTTP retourner**
- rester cohérent entre **Spring Boot, NestJS, Express, Symfony, Django**
- servir de **référence essentielle** dans une documentation technique

---

## CRUD REST — Réponses HTTP (référence condensée)

| Verbe | Situation | Code | Constante |
|------|-----------|------|-----------|
| GET | Lecture liste | 200 | `HttpStatus.OK` |
| GET | Lecture ressource | 200 | `HttpStatus.OK` |
| GET | Ressource inexistante | 404 | `HttpStatus.NOT_FOUND` |
| POST | Création réussie | 201 | `HttpStatus.CREATED` |
| POST | Requête invalide | 400 | `HttpStatus.BAD_REQUEST` |
| PUT | Mise à jour réussie | 200 | `HttpStatus.OK` |
| PUT | Ressource inexistante | 404 | `HttpStatus.NOT_FOUND` |
| DELETE | Suppression réussie | 204 | `HttpStatus.NO_CONTENT` |
| DELETE | Ressource inexistante | 404 | `HttpStatus.NOT_FOUND` |
| * | Verbe non autorisé | 405 | `HttpStatus.METHOD_NOT_ALLOWED` |
| * | Erreur interne | 500 | `HttpStatus.INTERNAL_SERVER_ERROR` |

---

## CRUD REST — Cas détaillés avec exemples

### GET

| Requête | Cas | Code | Exemple réponse |
|-------|----|----|----------------|
| `GET /continents` | Liste existante | 200 | `[{"id":1,"name":"Europe"}]` |
| `GET /continents/1` | Ressource trouvée | 200 | `{"id":1,"name":"Europe"}` |
| `GET /continents/1000` | Ressource absente | 404 | `{ "error": "NOT_FOUND" }` |

---

### POST

| Requête | Cas | Code | Exemple réponse |
|-------|----|----|----------------|
| `POST /continents` | Création réussie | 201 | `{"id":7,"name":"Asia"}` |
| `POST /continents` | Body invalide | 400 | `{ "error": "BAD_REQUEST" }` |
| `POST /continents` | Content-Type invalide | 415 | — |

**Body valide**
```json
{ "name": "Asia" }
```

---

### PUT

| Requête | Cas | Code | Exemple réponse |
|-------|----|----|----------------|
| `PUT /continents/1` | Mise à jour réussie | 200 | `{"id":1,"name":"Europa"}` |
| `PUT /continents/1000` | Ressource inexistante | 404 | `{ "error": "NOT_FOUND" }` |
| `PUT /continents/1` | Body invalide | 400 | `{ "error": "BAD_REQUEST" }` |

**Body valide**
```json
{ "name": "Europa" }
```

---

### DELETE

| Requête | Cas | Code | Réponse |
|-------|----|----|--------|
| `DELETE /continents/1` | Suppression réussie | 204 | *(aucun body)* |
| `DELETE /continents/1000` | Ressource inexistante | 404 | `{ "error": "NOT_FOUND" }` |

---

## Cas transverses

| Requête | Cas | Code |
|-------|----|----|
| `POST /continents/1` | Verbe HTTP interdit | 405 |
| * | Exception non gérée | 500 |

---

## Règles essentielles

- `200 OK` → lecture ou mise à jour réussie
- `201 Created` → création uniquement
- `204 No Content` → suppression sans body
- `400 Bad Request` → erreur client
- `404 Not Found` → ressource inexistante
- `405 Method Not Allowed` → mauvais verbe HTTP
- `500 Internal Server Error` → bug serveur uniquement

---

## Règle d’or

> **Le code HTTP décrit le résultat de la requête,  
> pas l’implémentation interne.**

---

## Conclusion

Ces deux tableaux suffisent pour :
- écrire un CRUD cohérent
- documenter une API proprement
- aligner Spring Boot et NestJS sans discussion

C’est la base minimale d’une API REST sérieuse.

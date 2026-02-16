# CRUD REST — Réponses HTTP

Référence simple, visuelle et universelle des réponses HTTP pour un CRUD REST.

Ressource d’exemple : `Continent`  
URL de base : `/continents`

---

## CRUD REST — Réponses HTTP (référence condensée)

| Verbe | Situation | Code | Constante |
|------|-----------|------|-----------|
| GET | Lecture liste | 200 | HttpStatus.OK |
| GET | Lecture ressource | 200 | HttpStatus.OK |
| GET | Ressource inexistante | 404 | HttpStatus.NOT_FOUND |
| GET | Requête invalide | 400 | HttpStatus.BAD_REQUEST |
| POST | Création réussie | 201 | HttpStatus.CREATED |
| POST | Requête invalide | 400 | HttpStatus.BAD_REQUEST |
| PUT | Mise à jour réussie | 200 | HttpStatus.OK |
| PUT | Ressource inexistante | 404 | HttpStatus.NOT_FOUND |
| PUT | Requête invalide | 400 | HttpStatus.BAD_REQUEST |
| DELETE | Suppression réussie | 204 | HttpStatus.NO_CONTENT |
| DELETE | Ressource inexistante | 404 | HttpStatus.NOT_FOUND |
| * | Verbe non autorisé | 405 | HttpStatus.METHOD_NOT_ALLOWED |
| * | Erreur interne | 500 | HttpStatus.INTERNAL_SERVER_ERROR |

---

## CRUD REST — Cas détaillés avec exemples

### GET

| Requête | Cas | Code |
|-------|----|----|
| GET /continents | Liste existante | 200 |
| GET /continents/1 | Ressource trouvée | 200 |
| GET /continents/1000 | Ressource inexistante | 404 |
| GET /continents/abc | Requête invalide | 400 |

---

### POST

| Requête | Cas | Code |
|-------|----|----|
| POST /continents | Création réussie | 201 |
| POST /continents | Body invalide | 400 |
| POST /continents | Content-Type invalide | 415 |

---

### PUT

| Requête | Cas | Code |
|-------|----|----|
| PUT /continents/1 | Mise à jour réussie | 200 |
| PUT /continents/1000 | Ressource inexistante | 404 |
| PUT /continents/abc | Requête invalide | 400 |

---

### DELETE

| Requête | Cas | Code |
|-------|----|----|
| DELETE /continents/1 | Suppression réussie | 204 |
| DELETE /continents/1000 | Ressource inexistante | 404 |
| DELETE /continents/abc | Requête invalide | 400 |

---

## Règle d’or

404 = ressource absente  
400 = requête invalide  
500 = bug serveur uniquement

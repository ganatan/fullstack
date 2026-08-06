# Codes d’erreur HTTP

Les trois applications doivent retourner exactement les mêmes codes HTTP et les mêmes payloads JSON.

---

## Format général

```json
{
  "error": "ERROR_CODE"
}
```

Pour une erreur de validation :

```json
{
  "error": "VALIDATION_ERROR",
  "details": {
    "field": "error message"
  }
}
```

---

# 400 — Bad Request

La requête envoyée est invalide.

## VALIDATION_ERROR

Une ou plusieurs propriétés du payload sont invalides.

```json
{
  "error": "VALIDATION_ERROR",
  "details": {
    "lastName": "must not be blank"
  }
}
```

Exemples :

* propriété obligatoire absente
* texte vide
* texte trop long
* identifiant invalide
* mauvais type de donnée

---

## INVALID_JSON

Le payload JSON est invalide.

```json
{
  "error": "INVALID_JSON"
}
```

Exemple de JSON invalide :

```json
{
  "name": "Paris",
}
```

---

## INVALID_ID

L’identifiant fourni dans l’URL est invalide.

```json
{
  "error": "INVALID_ID"
}
```

Exemples :

```text
/persons/abc
/persons/0
/persons/-1
```

---

## INVALID_CITY_ID

La propriété `cityId` est invalide.

```json
{
  "error": "INVALID_CITY_ID"
}
```

Exemples :

```json
{
  "firstName": "Steven",
  "lastName": "Spielberg",
  "cityId": 0
}
```

```json
{
  "firstName": "Steven",
  "lastName": "Spielberg",
  "cityId": -1
}
```

---

# 404 — Not Found

La ressource demandée n’existe pas.

## PERSON_NOT_FOUND

La personne demandée n’existe pas.

```json
{
  "error": "PERSON_NOT_FOUND"
}
```

Routes concernées :

```text
GET    /persons/{id}
PUT    /persons/{id}
DELETE /persons/{id}
```

---

## CITY_NOT_FOUND

La ville demandée n’existe pas.

```json
{
  "error": "CITY_NOT_FOUND"
}
```

Routes concernées :

```text
GET    /cities/{id}
PUT    /cities/{id}
DELETE /cities/{id}
```

Cette erreur est également retournée lorsque le `cityId` d’une personne ne correspond à aucune ville.

Exemple :

```json
{
  "firstName": "Steven",
  "lastName": "Spielberg",
  "cityId": 999
}
```

Réponse :

```json
{
  "error": "CITY_NOT_FOUND"
}
```

---

## ROUTE_NOT_FOUND

La route demandée n’existe pas.

```json
{
  "error": "ROUTE_NOT_FOUND"
}
```

Exemple :

```text
GET /unknown
```

---

# 405 — Method Not Allowed

## METHOD_NOT_ALLOWED

Le verbe HTTP n’est pas autorisé pour cette route.

```json
{
  "error": "METHOD_NOT_ALLOWED"
}
```

Exemple :

```text
PATCH /persons/1
```

Lorsque seules les méthodes suivantes sont disponibles :

```text
GET
POST
PUT
DELETE
```

---

# 409 — Conflict

La requête entre en conflit avec les données existantes.

## CITY_ALREADY_EXISTS

Une ville avec le même nom existe déjà.

```json
{
  "error": "CITY_ALREADY_EXISTS"
}
```

Exemple :

```json
{
  "name": "Los Angeles"
}
```

---

## PERSON_ALREADY_EXISTS

Une personne avec le même prénom et le même nom existe déjà.

```json
{
  "error": "PERSON_ALREADY_EXISTS"
}
```

Exemple :

```json
{
  "firstName": "Steven",
  "lastName": "Spielberg",
  "cityId": 1
}
```

---

## CITY_IN_USE

La ville ne peut pas être supprimée car elle est associée à une ou plusieurs personnes.

```json
{
  "error": "CITY_IN_USE"
}
```

Exemple :

```text
DELETE /cities/1
```

---

# 415 — Unsupported Media Type

## UNSUPPORTED_MEDIA_TYPE

Le format du payload n’est pas accepté.

```json
{
  "error": "UNSUPPORTED_MEDIA_TYPE"
}
```

Le header attendu pour les requêtes `POST` et `PUT` est :

```text
Content-Type: application/json
```

---

# 500 — Internal Server Error

## INTERNAL_SERVER_ERROR

Une erreur technique inattendue est survenue dans le backend.

```json
{
  "error": "INTERNAL_SERVER_ERROR"
}
```

Le détail technique de l’erreur ne doit pas être retourné au client.

Les informations techniques doivent uniquement apparaître dans les logs du backend.

---

## DATABASE_ERROR

Une erreur est survenue pendant la communication avec la base de données.

```json
{
  "error": "DATABASE_ERROR"
}
```

Exemples :

* base de données indisponible
* connexion impossible
* requête SQL en erreur
* transaction annulée

---

# Récapitulatif

```text
400 VALIDATION_ERROR
400 INVALID_JSON
400 INVALID_ID
400 INVALID_CITY_ID

404 PERSON_NOT_FOUND
404 CITY_NOT_FOUND
404 ROUTE_NOT_FOUND

405 METHOD_NOT_ALLOWED

409 CITY_ALREADY_EXISTS
409 PERSON_ALREADY_EXISTS
409 CITY_IN_USE

415 UNSUPPORTED_MEDIA_TYPE

500 INTERNAL_SERVER_ERROR
500 DATABASE_ERROR
```

---

# Payloads de référence

## Erreur simple

```json
{
  "error": "PERSON_NOT_FOUND"
}
```

## Erreur de validation

```json
{
  "error": "VALIDATION_ERROR",
  "details": {
    "firstName": "must not be blank",
    "lastName": "must not be blank",
    "cityId": "must be a positive integer"
  }
}
```

---

# Règle commune

Les backends suivants doivent retourner exactement les mêmes erreurs :

```text
springboot-backend
quarkus-backend
rust-backend
```

Une même requête invalide doit produire :

* le même statut HTTP
* le même code d’erreur
* la même structure JSON
* les mêmes noms de propriétés

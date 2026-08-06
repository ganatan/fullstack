# Principes d’un CRUD HTTP

Ce document présente les principes simples d’un CRUD HTTP avec deux ressources :

* `person`
* `city`

Une personne est associée à une ville avec la propriété `cityId`.

---

## 1. Verbes HTTP

Les principaux verbes HTTP sont :

* `GET` : lire des données
* `POST` : créer une donnée
* `PUT` : modifier une donnée
* `DELETE` : supprimer une donnée

---

## 2. Ressource City

Une ville contient :

```json
{
  "id": 1,
  "name": "Cincinnati"
}
```

### Propriétés

* `id` : identifiant généré par le backend
* `name` : nom de la ville

---

## 3. Ressource Person

Une personne contient :

```json
{
  "id": 1,
  "firstName": "Steven",
  "lastName": "Spielberg",
  "cityId": 1
}
```

### Propriétés

* `id` : identifiant généré par le backend
* `firstName` : prénom
* `lastName` : nom
* `cityId` : identifiant de la ville

---

# CRUD City

## GET /cities

Récupérer toutes les villes.

### Entrée

Aucun payload.

### Sortie

```json
[
  {
    "id": 1,
    "name": "Cincinnati"
  },
  {
    "id": 2,
    "name": "Knoxville"
  }
]
```

---

## GET /cities/{id}

Récupérer une ville par son identifiant.

### Entrée

```text
GET /cities/1
```

Aucun payload.

### Sortie

```json
{
  "id": 1,
  "name": "Cincinnati"
}
```

### Ville inexistante

```json
{
  "error": "CITY_NOT_FOUND"
}
```

---

## POST /cities

Créer une ville.

### Entrée

```json
{
  "name": "Cincinnati"
}
```

### Sortie

```json
{
  "id": 1,
  "name": "Cincinnati"
}
```

---

## PUT /cities/{id}

Modifier une ville.

### Entrée

```text
PUT /cities/1
```

```json
{
  "name": "Los Angeles"
}
```

### Sortie

```json
{
  "id": 1,
  "name": "Los Angeles"
}
```

---

## DELETE /cities/{id}

Supprimer une ville.

### Entrée

```text
DELETE /cities/1
```

Aucun payload.

### Sortie

```text
204 No Content
```

---

# CRUD Person

## GET /persons

Récupérer toutes les personnes.

### Entrée

Aucun payload.

### Sortie

```json
[
  {
    "id": 1,
    "firstName": "Steven",
    "lastName": "Spielberg",
    "cityId": 1
  },
  {
    "id": 2,
    "firstName": "Quentin",
    "lastName": "Tarantino",
    "cityId": 2
  }
]
```

---

## GET /persons/{id}

Récupérer une personne par son identifiant.

### Entrée

```text
GET /persons/1
```

Aucun payload.

### Sortie

```json
{
  "id": 1,
  "firstName": "Steven",
  "lastName": "Spielberg",
  "cityId": 1
}
```

### Personne inexistante

```json
{
  "error": "PERSON_NOT_FOUND"
}
```

---

## POST /persons

Créer une personne.

Le client ne fournit pas la propriété `id`.

### Entrée

```json
{
  "firstName": "Steven",
  "lastName": "Spielberg",
  "cityId": 1
}
```

### Sortie

```json
{
  "id": 1,
  "firstName": "Steven",
  "lastName": "Spielberg",
  "cityId": 1
}
```

---

## PUT /persons/{id}

Modifier une personne.

### Entrée

```text
PUT /persons/1
```

```json
{
  "firstName": "Steven",
  "lastName": "Spielberg",
  "cityId": 3
}
```

### Sortie

```json
{
  "id": 1,
  "firstName": "Steven",
  "lastName": "Spielberg",
  "cityId": 3
}
```

---

## DELETE /persons/{id}

Supprimer une personne.

### Entrée

```text
DELETE /persons/1
```

Aucun payload.

### Sortie

```text
204 No Content
```

---

# Codes HTTP principaux

## 200 OK

La lecture ou la modification a réussi.

```json
{
  "id": 1,
  "firstName": "Steven",
  "lastName": "Spielberg",
  "cityId": 1
}
```

---

## 201 Created

La création a réussi.

```json
{
  "id": 1,
  "firstName": "Steven",
  "lastName": "Spielberg",
  "cityId": 1
}
```

---

## 204 No Content

La suppression a réussi.

La réponse ne contient aucun payload.

---

## 400 Bad Request

Le payload envoyé est invalide.

```json
{
  "error": "VALIDATION_ERROR",
  "details": {
    "lastName": "must not be blank"
  }
}
```

---

## 404 Not Found

La ressource demandée n’existe pas.

```json
{
  "error": "PERSON_NOT_FOUND"
}
```

---

# Contraintes de validation

## City

* `name` obligatoire
* `name` non vide
* `name` limité à 100 caractères
* suppression des espaces avant et après le texte

### Payload invalide

```json
{
  "name": ""
}
```

### Réponse

```json
{
  "error": "VALIDATION_ERROR",
  "details": {
    "name": "must not be blank"
  }
}
```

---

## Person

* `firstName` obligatoire
* `firstName` non vide
* `lastName` obligatoire
* `lastName` non vide
* `cityId` obligatoire
* `cityId` doit correspondre à une ville existante
* suppression des espaces avant et après les textes

### Payload invalide

```json
{
  "firstName": "Steven",
  "lastName": "",
  "cityId": 1
}
```

### Réponse

```json
{
  "error": "VALIDATION_ERROR",
  "details": {
    "lastName": "must not be blank"
  }
}
```

---

# Données d’exemple

## Cities

```json
[
  {
    "id": 1,
    "name": "Cincinnati"
  },
  {
    "id": 2,
    "name": "Knoxville"
  },
  {
    "id": 3,
    "name": "New York"
  },
  {
    "id": 4,
    "name": "Atlanta"
  },
  {
    "id": 5,
    "name": "Flushing"
  },
  {
    "id": 6,
    "name": "Kapuskasing"
  },
  {
    "id": 7,
    "name": "San Francisco"
  }
]
```

---

## Persons

Sept réalisateurs américains sont utilisés comme données d’exemple.

```json
[
  {
    "id": 1,
    "firstName": "Steven",
    "lastName": "Spielberg",
    "cityId": 1
  },
  {
    "id": 2,
    "firstName": "Quentin",
    "lastName": "Tarantino",
    "cityId": 2
  },
  {
    "id": 3,
    "firstName": "Martin",
    "lastName": "Scorsese",
    "cityId": 3
  },
  {
    "id": 4,
    "firstName": "Spike",
    "lastName": "Lee",
    "cityId": 4
  },
  {
    "id": 5,
    "firstName": "Francis",
    "lastName": "Ford Coppola",
    "cityId": 5
  },
  {
    "id": 6,
    "firstName": "James",
    "lastName": "Cameron",
    "cityId": 6
  },
  {
    "id": 7,
    "firstName": "George",
    "lastName": "Lucas",
    "cityId": 7
  }
]
```

---

# Routes finales

## City

```text
GET    /cities
GET    /cities/{id}
POST   /cities
PUT    /cities/{id}
DELETE /cities/{id}
```

## Person

```text
GET    /persons
GET    /persons/{id}
POST   /persons
PUT    /persons/{id}
DELETE /persons/{id}
```

---

# Flux d’une requête

Chaque backend utilise la même organisation :

```text
HTTP Request
    ↓
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

## Controller

Le contrôleur :

* reçoit la requête HTTP
* récupère les paramètres et le payload
* appelle le service
* retourne la réponse HTTP

## Service

Le service :

* contient les règles métier
* valide les données
* vérifie l’existence des ressources
* appelle le repository

## Repository

Le repository :

* communique avec la base de données
* exécute les lectures
* exécute les insertions
* exécute les modifications
* exécute les suppressions

---

# Architecture commune

```text
modules/
├── city/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── entity/
│   └── dto/
└── person/
    ├── controller/
    ├── service/
    ├── repository/
    ├── entity/
    └── dto/
```

Cette architecture sera reproduite dans :

```text
springboot-backend
quarkus-backend
rust-backend
```

Les trois applications devront exposer les mêmes routes, accepter les mêmes payloads et retourner les mêmes réponses JSON.

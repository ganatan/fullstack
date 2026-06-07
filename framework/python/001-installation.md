# backend-django

## Objectif

Créer une API REST cinéma avec Django et Django REST Framework.

Cette API servira de référence pour les futurs projets :

- backend-symfony
- backend-cpp

Tous les backends exposeront les mêmes routes et les mêmes données.

---

# Version 1

Fonctionnalités :

- API REST
- SQLite
- Django REST Framework
- données seedées
- endpoints consultables avec curl ou Postman

---

# Stack technique

- Python
- Django
- Django REST Framework
- SQLite
- pytest
- pytest-django

---

# Création du projet

```bash
mkdir backend-django
cd backend-django

python -m venv .venv

.venv\Scripts\activate

pip install django djangorestframework pytest pytest-django

django-admin startproject config .

python manage.py startapp movies
```

---

# Structure cible

```text
backend-django/
├── config/
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
│
├── movies/
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   ├── admin.py
│   └── tests.py
│
├── manage.py
├── requirements.txt
└── README.md
```

---

# Domaine métier

Entités :

- Person
- Movie
- Genre
- Country

---

# Modèle Person

```text
id
firstName
lastName
birthDate
nationality
```

Exemple :

```json
{
  "id": 1,
  "firstName": "Christopher",
  "lastName": "Nolan",
  "nationality": "UK"
}
```

---

# Modèle Movie

```text
id
title
releaseYear
genreId
directorId
```

Exemple :

```json
{
  "id": 1,
  "title": "Inception",
  "releaseYear": 2010,
  "genreId": 1,
  "directorId": 1
}
```

---

# Modèle Genre

```text
id
name
```

Exemple :

```json
{
  "id": 1,
  "name": "Science Fiction"
}
```

---

# Modèle Country

```text
id
name
code
```

Exemple :

```json
{
  "id": 1,
  "name": "France",
  "code": "FR"
}
```

---

# API Version 1

## Health

```http
GET /api/health
```

---

## Persons

```http
GET /api/persons
GET /api/persons/{id}
```

---

## Movies

```http
GET /api/movies
GET /api/movies/{id}
```

---

## Genres

```http
GET /api/genres
GET /api/genres/{id}
```

---

## Countries

```http
GET /api/countries
GET /api/countries/{id}
```

---

# Étapes de développement

## Étape 1

Configurer Django.

---

## Étape 2

Configurer Django REST Framework.

---

## Étape 3

Créer les modèles :

- Person
- Movie
- Genre
- Country

---

## Étape 4

Créer les migrations.

```bash
python manage.py makemigrations
python manage.py migrate
```

---

## Étape 5

Créer les serializers.

---

## Étape 6

Créer les vues REST.

---

## Étape 7

Configurer les routes.

---

## Étape 8

Ajouter des données initiales.

Exemples :

- Christopher Nolan
- Ridley Scott
- Denis Villeneuve

Films :

- Inception
- Alien
- Blade Runner
- Dune

---

## Étape 9

Tester avec curl.

```bash
curl http://localhost:8000/api/health

curl http://localhost:8000/api/persons

curl http://localhost:8000/api/movies
```

---

# Livrables

- API REST fonctionnelle
- Base SQLite
- Données cinéma
- README
- Documentation
- Tests unitaires

---

# Étape suivante

Une fois backend-django terminé :

- backend-symfony
- backend-cpp

avec exactement les mêmes routes, les mêmes données et les mêmes réponses JSON.
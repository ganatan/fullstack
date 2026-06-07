# backend-django

## Objectif

Créer une implémentation Django de l'application **media**.

Cette implémentation fait partie du laboratoire **ganatan-labs** et doit exposer exactement les mêmes données et les mêmes routes que :

- backend-node
- backend-springboot
- backend-symfony
- backend-cpp

L'objectif est de comparer plusieurs technologies backend autour du même domaine métier.

---

# Architecture globale

```text
ganatan-labs/
│
├── frontend-angular/
├── frontend-react/
│
├── backend-node/
├── backend-springboot/
├── backend-django/
├── backend-symfony/
├── backend-cpp/
│
└── docs/
```

---

# Domaine métier

Application :

```text
media
```

Entités :

- Person
- Movie
- Genre
- Country

---

# Version 1

Fonctionnalités :

- API REST
- SQLite
- Django REST Framework
- données seedées
- endpoints testables avec curl
- réponses JSON compatibles avec les autres backends

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

python manage.py startapp media
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
├── media/
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

# Modèle Person

Attributs :

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

Attributs :

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

Attributs :

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

Attributs :

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

# Contrat API commun

Tous les backends doivent exposer exactement les mêmes routes.

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

# Données initiales

Réalisateurs :

- Christopher Nolan
- Ridley Scott
- Denis Villeneuve

Films :

- Inception
- Alien
- Blade Runner
- Dune

Genres :

- Science Fiction
- Thriller
- Action

Pays :

- France
- United Kingdom
- United States

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

Ajouter les données initiales.

---

## Étape 9

Tester les endpoints.

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

# Étapes suivantes

Créer les implémentations équivalentes :

- backend-symfony
- backend-cpp

avec :

- les mêmes routes
- les mêmes données
- les mêmes réponses JSON
- le même domaine métier
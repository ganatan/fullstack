# 007-routes-api-django-rest-framework.md

## Objectif

Déclarer les routes HTTP de l'API REST.

À ce stade :

- PostgreSQL est connecté
- les modèles Django sont mappés
- les serializers existent
- les vues API existent

Cette phase branche les URLs Django sur les vues API.

---

# Structure cible

Fichiers concernés :

```text
media/urls.py
config/urls.py
```

---

# Routes exposées

```text
GET /api/health

GET /api/continents
GET /api/continents/{id}

GET /api/countries
GET /api/countries/{id}

GET /api/cities
GET /api/cities/{id}

GET /api/persons
GET /api/persons/{id}

GET /api/professions
GET /api/professions/{id}

GET /api/media-types
GET /api/media-types/{id}

GET /api/media
GET /api/media/{id}
```

---

# Étape 1 - Créer media/urls.py

Créer le fichier :

```text
media/urls.py
```

Contenu :

```python
from django.urls import path

from .views import (
    cities,
    city_detail,
    continents,
    continent_detail,
    countries,
    country_detail,
    health,
    media,
    media_detail,
    media_types,
    media_type_detail,
    persons,
    person_detail,
    professions,
    profession_detail,
)

urlpatterns = [
    path("health", health),

    path("continents", continents),
    path("continents/<int:pk>", continent_detail),

    path("countries", countries),
    path("countries/<int:pk>", country_detail),

    path("cities", cities),
    path("cities/<int:pk>", city_detail),

    path("persons", persons),
    path("persons/<int:pk>", person_detail),

    path("professions", professions),
    path("professions/<int:pk>", profession_detail),

    path("media-types", media_types),
    path("media-types/<int:pk>", media_type_detail),

    path("media", media),
    path("media/<int:pk>", media_detail),
]
```

---

# Étape 2 - Modifier config/urls.py

Ouvrir :

```text
config/urls.py
```

Remplacer le contenu par :

```python
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("media.urls")),
]
```

---

# Étape 3 - Vérifier Django

Exécuter :

```bash
python manage.py check
```

Résultat attendu :

```text
System check identified no issues
```

---

# Étape 4 - Lancer le serveur

```bash
python manage.py runserver
```

Résultat attendu :

```text
Starting development server at http://127.0.0.1:8000/
```

---

# Étape 5 - Tester health

Dans un navigateur ou avec curl :

```bash
curl http://localhost:8000/api/health
```

Résultat attendu :

```json
{
  "status": "UP"
}
```

---

# Étape 6 - Tester les continents

```bash
curl http://localhost:8000/api/continents
```

Résultat attendu :

```json
[
  {
    "id": 1000,
    "code": "NA",
    "name": "North America",
    "wikipedia_link": "North_America",
    "area": 24709000,
    "population": 587615000,
    "countries_number": 23
  },
  {
    "id": 1001,
    "code": "EU",
    "name": "Europe",
    "wikipedia_link": "Europe",
    "area": 10180000,
    "population": 742648000,
    "countries_number": 45
  }
]
```

---

# Étape 7 - Tester les pays

```bash
curl http://localhost:8000/api/countries
```

Résultat attendu :

```json
[
  {
    "id": 1000,
    "name": "United States",
    "wikipedia_link": "United_States",
    "continent_id": 1000,
    "continent_name": "North America",
    "iso_numeric": "840",
    "iso_alpha2": "US",
    "iso_alpha3": "USA",
    "flag": "us.png"
  }
]
```

---

# Étape 8 - Tester les villes

```bash
curl http://localhost:8000/api/cities
```

---

# Étape 9 - Tester les personnes

```bash
curl http://localhost:8000/api/persons
```

Résultat attendu :

```json
[
  {
    "id": 1000,
    "name": "James Cameron",
    "wikipedia_link": "James_Cameron",
    "birth_date": "1954-08-16",
    "birth_city_id": 1000,
    "birth_city_name": "Kapuskasing",
    "birth_country_name": "Canada",
    "death_date": null,
    "gender_id": null,
    "image": "james-cameron.jpg",
    "nationalities": [
      "Canada"
    ],
    "professions": [
      "Director"
    ]
  }
]
```

---

# Étape 10 - Tester les médias

```bash
curl http://localhost:8000/api/media
```

Résultat attendu :

```json
[
  {
    "id": 1000,
    "title": "Terminator 2: Judgment Day",
    "slug": "terminator-2-judgment-day",
    "type_id": 1000,
    "type_name": "Movie",
    "release_year": 1991,
    "description": "Science-fiction action movie directed by James Cameron.",
    "persons": [
      "James Cameron"
    ]
  }
]
```

---

# Étape 11 - Tester un détail

```bash
curl http://localhost:8000/api/persons/1004
```

Résultat attendu :

```json
{
  "id": 1004,
  "name": "Christopher Nolan",
  "wikipedia_link": "Christopher_Nolan",
  "birth_date": "1970-07-30",
  "birth_city_id": 1004,
  "birth_city_name": "London",
  "birth_country_name": "United Kingdom",
  "death_date": null,
  "gender_id": null,
  "image": "christopher-nolan.jpg",
  "nationalities": [
    "United Kingdom"
  ],
  "professions": [
    "Director"
  ]
}
```

---

# Résultat

À la fin de cette phase :

```text
Les routes HTTP sont déclarées
L'API est accessible depuis /api
Les endpoints retournent du JSON
Django REST Framework expose les données PostgreSQL
```

---

# Phase suivante

```text
008-tests-api-django-rest-framework.md
```

Objectif :

Créer les tests des endpoints principaux.
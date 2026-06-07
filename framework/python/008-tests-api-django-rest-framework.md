# 008-tests-api-django-rest-framework.md

## Objectif

Créer les tests des endpoints principaux de l'API Django REST Framework.

À ce stade :

- PostgreSQL est connecté
- les modèles Django sont mappés
- les serializers existent
- les vues API existent
- les routes HTTP existent

Cette phase vérifie que l'API retourne bien les données attendues.

---

# Important

Les tables PostgreSQL existent déjà.

Les données PostgreSQL existent déjà.

Les tests utilisent la base PostgreSQL existante.

Dans cette version, on ne crée pas de données de test avec Django.

---

# Structure cible

Créer le dossier :

```text
media/tests/
```

Structure attendue :

```text
media/tests/
├── __init__.py
├── test_health.py
├── test_continents.py
├── test_countries.py
├── test_cities.py
├── test_persons.py
├── test_professions.py
├── test_media_types.py
└── test_media.py
```

---

# Étape 1 - Supprimer le fichier tests.py

Supprimer :

```text
media/tests.py
```

Créer le dossier :

```text
media/tests/
```

Créer :

```text
media/tests/__init__.py
```

---

# Étape 2 - Créer pytest.ini

Créer à la racine du projet :

```text
pytest.ini
```

Contenu :

```ini
[pytest]
DJANGO_SETTINGS_MODULE = config.settings
python_files = test_*.py
```

---

# Étape 3 - Créer test_health.py

Créer :

```text
media/tests/test_health.py
```

Contenu :

```python
import pytest


@pytest.mark.django_db
def test_health_endpoint(client):
    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.json() == {"status": "UP"}
```

---

# Étape 4 - Créer test_continents.py

Créer :

```text
media/tests/test_continents.py
```

Contenu :

```python
import pytest


@pytest.mark.django_db
def test_get_continents(client):
    response = client.get("/api/continents")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)
    assert len(data) >= 2
    assert data[0]["id"] >= 1000
    assert "code" in data[0]
    assert "name" in data[0]


@pytest.mark.django_db
def test_get_continent_detail(client):
    response = client.get("/api/continents/1000")

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == 1000
    assert "code" in data
    assert "name" in data
```

---

# Étape 5 - Créer test_countries.py

Créer :

```text
media/tests/test_countries.py
```

Contenu :

```python
import pytest


@pytest.mark.django_db
def test_get_countries(client):
    response = client.get("/api/countries")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)
    assert len(data) >= 3
    assert data[0]["id"] >= 1000
    assert "name" in data[0]
    assert "continent_id" in data[0]
    assert "continent_name" in data[0]
    assert "iso_alpha2" in data[0]


@pytest.mark.django_db
def test_get_country_detail(client):
    response = client.get("/api/countries/1000")

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == 1000
    assert "name" in data
    assert "iso_alpha2" in data
```

---

# Étape 6 - Créer test_cities.py

Créer :

```text
media/tests/test_cities.py
```

Contenu :

```python
import pytest


@pytest.mark.django_db
def test_get_cities(client):
    response = client.get("/api/cities")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)
    assert len(data) >= 10
    assert data[0]["id"] >= 1000
    assert "name" in data[0]
    assert "country_id" in data[0]
    assert "country_name" in data[0]


@pytest.mark.django_db
def test_get_city_detail(client):
    response = client.get("/api/cities/1000")

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == 1000
    assert "name" in data
    assert "country_name" in data
```

---

# Étape 7 - Créer test_persons.py

Créer :

```text
media/tests/test_persons.py
```

Contenu :

```python
import pytest


@pytest.mark.django_db
def test_get_persons(client):
    response = client.get("/api/persons")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)
    assert len(data) >= 10
    assert data[0]["id"] >= 1000
    assert "name" in data[0]
    assert "wikipedia_link" in data[0]
    assert "birth_date" in data[0]
    assert "birth_city_name" in data[0]
    assert "birth_country_name" in data[0]
    assert "nationalities" in data[0]
    assert "professions" in data[0]


@pytest.mark.django_db
def test_get_person_detail(client):
    response = client.get("/api/persons/1004")

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == 1004
    assert data["name"] == "Christopher Nolan"
    assert data["wikipedia_link"] == "Christopher_Nolan"
    assert data["birth_city_name"] == "London"
    assert data["birth_country_name"] == "United Kingdom"
    assert "United Kingdom" in data["nationalities"]
    assert "Director" in data["professions"]
```

---

# Étape 8 - Créer test_professions.py

Créer :

```text
media/tests/test_professions.py
```

Contenu :

```python
import pytest


@pytest.mark.django_db
def test_get_professions(client):
    response = client.get("/api/professions")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)
    assert len(data) >= 1
    assert data[0]["id"] >= 1000
    assert "name" in data[0]
    assert "slug" in data[0]


@pytest.mark.django_db
def test_get_profession_detail(client):
    response = client.get("/api/professions/1000")

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == 1000
    assert data["slug"] == "director"
```

---

# Étape 9 - Créer test_media_types.py

Créer :

```text
media/tests/test_media_types.py
```

Contenu :

```python
import pytest


@pytest.mark.django_db
def test_get_media_types(client):
    response = client.get("/api/media-types")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)
    assert len(data) >= 1
    assert data[0]["id"] >= 1000
    assert "name" in data[0]
    assert "slug" in data[0]


@pytest.mark.django_db
def test_get_media_type_detail(client):
    response = client.get("/api/media-types/1000")

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == 1000
    assert data["slug"] == "movie"
```

---

# Étape 10 - Créer test_media.py

Créer :

```text
media/tests/test_media.py
```

Contenu :

```python
import pytest


@pytest.mark.django_db
def test_get_media(client):
    response = client.get("/api/media")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)
    assert len(data) >= 10
    assert data[0]["id"] >= 1000
    assert "title" in data[0]
    assert "slug" in data[0]
    assert "type_id" in data[0]
    assert "type_name" in data[0]
    assert "release_year" in data[0]
    assert "description" in data[0]
    assert "persons" in data[0]


@pytest.mark.django_db
def test_get_media_detail(client):
    response = client.get("/api/media/1004")

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == 1004
    assert data["title"] == "Inception"
    assert data["slug"] == "inception"
    assert data["type_name"] == "Movie"
    assert data["release_year"] == 2010
    assert "Christopher Nolan" in data["persons"]
```

---

# Étape 11 - Lancer les tests

Exécuter :

```bash
pytest
```

Résultat attendu :

```text
15 passed
```

---

# Étape 12 - Lancer un test précis

Exemple :

```bash
pytest media/tests/test_health.py
```

Exemple :

```bash
pytest media/tests/test_persons.py
```

---

# Étape 13 - Attention importante

Ces tests dépendent des données PostgreSQL existantes.

Ils supposent que :

```text
continent.id = 1000
country.id = 1000
person Christopher Nolan id = 1004
media Inception id = 1004
profession director id = 1000
media_type movie id = 1000
```

Si les données changent, les tests peuvent échouer.

---

# Résultat

À la fin de cette phase :

```text
Les endpoints principaux sont testés
Les réponses JSON sont contrôlées
Les relations principales sont testées
L'API Django REST Framework est validée
```

---

# Phase suivante

```text
009-readme-backend-django.md
```

Objectif :

Rédiger le README final du backend Django avec installation, configuration, lancement, API et tests.
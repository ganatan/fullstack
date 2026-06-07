# 005-serializers-django-rest-framework.md

## Objectif

Créer les serializers Django REST Framework pour transformer les modèles Django en JSON.

À ce stade :

- PostgreSQL existe déjà
- les tables sont déjà créées
- les données sont déjà insérées
- les modèles Django sont déjà mappés avec `managed = False`

Cette phase ne crée aucune table.

Elle prépare uniquement la couche JSON de l'API REST.

---

# Structure cible

Créer le dossier :

```text
media/serializers/
```

Structure attendue :

```text
media/serializers/
├── __init__.py
├── continent.py
├── country.py
├── city.py
├── profession.py
├── media_type.py
├── person.py
└── media.py
```

---

# Étape 1 - Créer le dossier serializers

Dans le dossier `media`, créer :

```text
serializers/
```

Créer ensuite :

```text
media/serializers/__init__.py
```

---

# Étape 2 - Créer continent.py

Créer :

```text
media/serializers/continent.py
```

Contenu :

```python
from rest_framework import serializers

from media.models import Continent


class ContinentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Continent
        fields = [
            "id",
            "code",
            "name",
            "wikipedia_link",
            "area",
            "population",
            "countries_number",
        ]
```

---

# Étape 3 - Créer country.py

Créer :

```text
media/serializers/country.py
```

Contenu :

```python
from rest_framework import serializers

from media.models import Country


class CountrySerializer(serializers.ModelSerializer):
    continent_id = serializers.IntegerField(source="continent.id", read_only=True)
    continent_name = serializers.CharField(source="continent.name", read_only=True)

    class Meta:
        model = Country
        fields = [
            "id",
            "name",
            "wikipedia_link",
            "continent_id",
            "continent_name",
            "iso_numeric",
            "iso_alpha2",
            "iso_alpha3",
            "flag",
        ]
```

---

# Étape 4 - Créer city.py

Créer :

```text
media/serializers/city.py
```

Contenu :

```python
from rest_framework import serializers

from media.models import City


class CitySerializer(serializers.ModelSerializer):
    country_id = serializers.IntegerField(source="country.id", read_only=True)
    country_name = serializers.CharField(source="country.name", read_only=True)

    class Meta:
        model = City
        fields = [
            "id",
            "name",
            "wikipedia_link",
            "country_id",
            "country_name",
            "capital",
        ]
```

---

# Étape 5 - Créer profession.py

Créer :

```text
media/serializers/profession.py
```

Contenu :

```python
from rest_framework import serializers

from media.models import Profession


class ProfessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profession
        fields = [
            "id",
            "name",
            "slug",
        ]
```

---

# Étape 6 - Créer media_type.py

Créer :

```text
media/serializers/media_type.py
```

Contenu :

```python
from rest_framework import serializers

from media.models import MediaType


class MediaTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaType
        fields = [
            "id",
            "name",
            "slug",
        ]
```

---

# Étape 7 - Créer person.py

Créer :

```text
media/serializers/person.py
```

Contenu :

```python
from rest_framework import serializers

from media.models import Person


class PersonSerializer(serializers.ModelSerializer):
    birth_city_id = serializers.IntegerField(source="birth_city.id", read_only=True)
    birth_city_name = serializers.CharField(source="birth_city.name", read_only=True)
    birth_country_name = serializers.CharField(source="birth_city.country.name", read_only=True)
    nationalities = serializers.StringRelatedField(many=True, read_only=True)
    professions = serializers.StringRelatedField(many=True, read_only=True)

    class Meta:
        model = Person
        fields = [
            "id",
            "name",
            "wikipedia_link",
            "birth_date",
            "birth_city_id",
            "birth_city_name",
            "birth_country_name",
            "death_date",
            "gender_id",
            "image",
            "nationalities",
            "professions",
        ]
```

---

# Étape 8 - Créer media.py

Créer :

```text
media/serializers/media.py
```

Contenu :

```python
from rest_framework import serializers

from media.models import Media


class MediaSerializer(serializers.ModelSerializer):
    type_id = serializers.IntegerField(source="type.id", read_only=True)
    type_name = serializers.CharField(source="type.name", read_only=True)
    persons = serializers.StringRelatedField(many=True, read_only=True)

    class Meta:
        model = Media
        fields = [
            "id",
            "title",
            "slug",
            "type_id",
            "type_name",
            "release_year",
            "description",
            "persons",
        ]
```

---

# Étape 9 - Modifier __init__.py

Ouvrir :

```text
media/serializers/__init__.py
```

Contenu :

```python
from .city import CitySerializer
from .continent import ContinentSerializer
from .country import CountrySerializer
from .media import MediaSerializer
from .media_type import MediaTypeSerializer
from .person import PersonSerializer
from .profession import ProfessionSerializer
```

---

# Étape 10 - Vérifier Django

Exécuter :

```bash
python manage.py check
```

Résultat attendu :

```text
System check identified no issues
```

---

# Étape 11 - Tester un serializer dans le shell

Lancer :

```bash
python manage.py shell
```

Tester :

```python
from media.models import Person
from media.serializers import PersonSerializer

person = Person.objects.get(wikipedia_link="Christopher_Nolan")
serializer = PersonSerializer(person)

serializer.data
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

Tester un média :

```python
from media.models import Media
from media.serializers import MediaSerializer

movie = Media.objects.get(slug="inception")
serializer = MediaSerializer(movie)

serializer.data
```

Résultat attendu :

```json
{
  "id": 1004,
  "title": "Inception",
  "slug": "inception",
  "type_id": 1000,
  "type_name": "Movie",
  "release_year": 2010,
  "description": "Science-fiction thriller directed by Christopher Nolan.",
  "persons": [
    "Christopher Nolan"
  ]
}
```

---

# Résultat

À la fin de cette phase :

```text
Les serializers Django REST Framework existent
Les modèles sont transformables en JSON
Les relations principales sont lisibles
Aucune API n'est encore exposée
Aucune route n'est encore créée
```

---

# Phase suivante

```text
006-vues-api-django-rest-framework.md
```

Objectif :

Créer les vues API REST pour exposer les données PostgreSQL en JSON.
```
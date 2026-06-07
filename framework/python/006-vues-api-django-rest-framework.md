# 006-vues-api-django-rest-framework.md

## Objectif

Créer les vues API Django REST Framework.

À ce stade :

- Django est connecté à PostgreSQL
- les tables PostgreSQL existent déjà
- les modèles Django sont mappés sur les tables existantes
- les serializers existent déjà

Cette phase expose les données en JSON via des vues API.

---

# Structure cible

Créer le dossier :

```text
media/views/
```

Structure attendue :

```text
media/views/
├── __init__.py
├── health.py
├── continent.py
├── country.py
├── city.py
├── profession.py
├── media_type.py
├── person.py
└── media.py
```

---

# Étape 1 - Créer le dossier views

Dans le dossier `media`, créer :

```text
views/
```

Créer ensuite :

```text
media/views/__init__.py
```

---

# Étape 2 - Créer health.py

Créer :

```text
media/views/health.py
```

Contenu :

```python
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["GET"])
def health(request):
    return Response({"status": "UP"})
```

---

# Étape 3 - Créer continent.py

Créer :

```text
media/views/continent.py
```

Contenu :

```python
from rest_framework.decorators import api_view
from rest_framework.response import Response

from media.models import Continent
from media.serializers import ContinentSerializer


@api_view(["GET"])
def continents(request):
    queryset = Continent.objects.all().order_by("id")
    serializer = ContinentSerializer(queryset, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def continent_detail(request, pk):
    continent = Continent.objects.get(pk=pk)
    serializer = ContinentSerializer(continent)
    return Response(serializer.data)
```

---

# Étape 4 - Créer country.py

Créer :

```text
media/views/country.py
```

Contenu :

```python
from rest_framework.decorators import api_view
from rest_framework.response import Response

from media.models import Country
from media.serializers import CountrySerializer


@api_view(["GET"])
def countries(request):
    queryset = Country.objects.select_related("continent").all().order_by("id")
    serializer = CountrySerializer(queryset, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def country_detail(request, pk):
    country = Country.objects.select_related("continent").get(pk=pk)
    serializer = CountrySerializer(country)
    return Response(serializer.data)
```

---

# Étape 5 - Créer city.py

Créer :

```text
media/views/city.py
```

Contenu :

```python
from rest_framework.decorators import api_view
from rest_framework.response import Response

from media.models import City
from media.serializers import CitySerializer


@api_view(["GET"])
def cities(request):
    queryset = City.objects.select_related("country").all().order_by("id")
    serializer = CitySerializer(queryset, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def city_detail(request, pk):
    city = City.objects.select_related("country").get(pk=pk)
    serializer = CitySerializer(city)
    return Response(serializer.data)
```

---

# Étape 6 - Créer profession.py

Créer :

```text
media/views/profession.py
```

Contenu :

```python
from rest_framework.decorators import api_view
from rest_framework.response import Response

from media.models import Profession
from media.serializers import ProfessionSerializer


@api_view(["GET"])
def professions(request):
    queryset = Profession.objects.all().order_by("id")
    serializer = ProfessionSerializer(queryset, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def profession_detail(request, pk):
    profession = Profession.objects.get(pk=pk)
    serializer = ProfessionSerializer(profession)
    return Response(serializer.data)
```

---

# Étape 7 - Créer media_type.py

Créer :

```text
media/views/media_type.py
```

Contenu :

```python
from rest_framework.decorators import api_view
from rest_framework.response import Response

from media.models import MediaType
from media.serializers import MediaTypeSerializer


@api_view(["GET"])
def media_types(request):
    queryset = MediaType.objects.all().order_by("id")
    serializer = MediaTypeSerializer(queryset, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def media_type_detail(request, pk):
    media_type = MediaType.objects.get(pk=pk)
    serializer = MediaTypeSerializer(media_type)
    return Response(serializer.data)
```

---

# Étape 8 - Créer person.py

Créer :

```text
media/views/person.py
```

Contenu :

```python
from rest_framework.decorators import api_view
from rest_framework.response import Response

from media.models import Person
from media.serializers import PersonSerializer


@api_view(["GET"])
def persons(request):
    queryset = (
        Person.objects
        .select_related("birth_city", "birth_city__country")
        .prefetch_related("nationalities", "professions")
        .all()
        .order_by("id")
    )
    serializer = PersonSerializer(queryset, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def person_detail(request, pk):
    person = (
        Person.objects
        .select_related("birth_city", "birth_city__country")
        .prefetch_related("nationalities", "professions")
        .get(pk=pk)
    )
    serializer = PersonSerializer(person)
    return Response(serializer.data)
```

---

# Étape 9 - Créer media.py

Créer :

```text
media/views/media.py
```

Contenu :

```python
from rest_framework.decorators import api_view
from rest_framework.response import Response

from media.models import Media
from media.serializers import MediaSerializer


@api_view(["GET"])
def media(request):
    queryset = (
        Media.objects
        .select_related("type")
        .prefetch_related("persons")
        .all()
        .order_by("id")
    )
    serializer = MediaSerializer(queryset, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def media_detail(request, pk):
    item = (
        Media.objects
        .select_related("type")
        .prefetch_related("persons")
        .get(pk=pk)
    )
    serializer = MediaSerializer(item)
    return Response(serializer.data)
```

---

# Étape 10 - Modifier __init__.py

Ouvrir :

```text
media/views/__init__.py
```

Contenu :

```python
from .city import cities, city_detail
from .continent import continents, continent_detail
from .country import countries, country_detail
from .health import health
from .media import media, media_detail
from .media_type import media_types, media_type_detail
from .person import persons, person_detail
from .profession import professions, profession_detail
```

---

# Étape 11 - Vérifier Django

Exécuter :

```bash
python manage.py check
```

Résultat attendu :

```text
System check identified no issues
```

---

# Étape 12 - Tester une vue dans le shell

Lancer :

```bash
python manage.py shell
```

Tester :

```python
from media.models import Person
from media.serializers import PersonSerializer

queryset = (
    Person.objects
    .select_related("birth_city", "birth_city__country")
    .prefetch_related("nationalities", "professions")
    .all()
    .order_by("id")
)

serializer = PersonSerializer(queryset, many=True)

serializer.data
```

Résultat attendu :

```text
ReturnList(...)
```

---

# Résultat

À la fin de cette phase :

```text
Les vues API existent
Chaque vue lit PostgreSQL via les modèles Django
Chaque vue retourne une réponse JSON via un serializer
Aucune route HTTP n'est encore déclarée
```

---

# Phase suivante

```text
007-routes-api-django-rest-framework.md
```

Objectif :

Déclarer les routes HTTP de l'API dans `media/urls.py` et les brancher dans `config/urls.py`.
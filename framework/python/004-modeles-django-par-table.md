# 004-mapping-modeles-postgresql.md

## Objectif

Mapper les tables PostgreSQL existantes avec des modèles Django.

Le schéma PostgreSQL existe déjà.

Les tables existent déjà.

Les données sont déjà insérées.

Django ne doit pas créer les tables.

Django doit seulement lire les tables existantes via l'ORM.

---

# Règle importante

Ne pas exécuter :

```bash
python manage.py makemigrations
python manage.py migrate
```

Dans cette phase.

Les tables PostgreSQL sont déjà créées manuellement.

Chaque modèle Django doit contenir :

```python
class Meta:
    managed = False
    db_table = "nom_table"
```

---

# Structure cible

Dans l'application `media`, remplacer le fichier unique :

```text
media/models.py
```

par un package :

```text
media/models/
├── __init__.py
├── continent.py
├── country.py
├── city.py
├── profession.py
├── media_type.py
├── person.py
├── media.py
├── person_nationality.py
├── person_profession.py
└── media_person.py
```

---

# Étape 1 - Supprimer le fichier models.py

Supprimer :

```text
media/models.py
```

Créer le dossier :

```text
media/models/
```

Créer le fichier :

```text
media/models/__init__.py
```

---

# Étape 2 - Créer continent.py

Créer :

```text
media/models/continent.py
```

Contenu :

```python
from django.db import models


class Continent(models.Model):
    id = models.BigAutoField(primary_key=True)
    code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=255)
    wikipedia_link = models.CharField(max_length=255, blank=True, default="")
    area = models.IntegerField(default=0)
    population = models.BigIntegerField(default=0)
    countries_number = models.IntegerField(default=0)

    class Meta:
        managed = False
        db_table = "continent"

    def __str__(self):
        return self.name
```

---

# Étape 3 - Créer country.py

Créer :

```text
media/models/country.py
```

Contenu :

```python
from django.db import models

from .continent import Continent


class Country(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)
    wikipedia_link = models.CharField(max_length=255, blank=True, default="")
    continent = models.ForeignKey(
        Continent,
        db_column="continent_id",
        on_delete=models.DO_NOTHING,
        null=True,
        blank=True,
        related_name="countries",
    )
    iso_numeric = models.CharField(max_length=50)
    iso_alpha2 = models.CharField(max_length=50)
    iso_alpha3 = models.CharField(max_length=50)
    flag = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        managed = False
        db_table = "country"

    def __str__(self):
        return self.name
```

---

# Étape 4 - Créer city.py

Créer :

```text
media/models/city.py
```

Contenu :

```python
from django.db import models

from .country import Country


class City(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)
    wikipedia_link = models.CharField(max_length=255)
    country = models.ForeignKey(
        Country,
        db_column="country_id",
        on_delete=models.DO_NOTHING,
        null=True,
        blank=True,
        related_name="cities",
    )
    capital = models.BooleanField(default=False)

    class Meta:
        managed = False
        db_table = "city"

    def __str__(self):
        return self.name
```

---

# Étape 5 - Créer profession.py

Créer :

```text
media/models/profession.py
```

Contenu :

```python
from django.db import models


class Profession(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)
    slug = models.CharField(max_length=255, unique=True)

    class Meta:
        managed = False
        db_table = "profession"

    def __str__(self):
        return self.name
```

---

# Étape 6 - Créer media_type.py

Créer :

```text
media/models/media_type.py
```

Contenu :

```python
from django.db import models


class MediaType(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)
    slug = models.CharField(max_length=255, unique=True)

    class Meta:
        managed = False
        db_table = "media_type"

    def __str__(self):
        return self.name
```

---

# Étape 7 - Créer person.py

Créer :

```text
media/models/person.py
```

Contenu :

```python
from django.db import models

from .city import City
from .country import Country
from .profession import Profession


class Person(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)
    wikipedia_link = models.CharField(max_length=255)
    birth_date = models.DateField(null=True, blank=True)
    birth_city = models.ForeignKey(
        City,
        db_column="birth_city_id",
        on_delete=models.DO_NOTHING,
        null=True,
        blank=True,
        related_name="born_persons",
    )
    death_date = models.DateField(null=True, blank=True)
    death_city = models.ForeignKey(
        City,
        db_column="death_city_id",
        on_delete=models.DO_NOTHING,
        null=True,
        blank=True,
        related_name="dead_persons",
    )
    gender_id = models.BigIntegerField(null=True, blank=True)
    image = models.CharField(max_length=255, null=True, blank=True)
    nationalities = models.ManyToManyField(
        Country,
        through="PersonNationality",
        related_name="persons",
    )
    professions = models.ManyToManyField(
        Profession,
        through="PersonProfession",
        related_name="persons",
    )

    class Meta:
        managed = False
        db_table = "person"

    def __str__(self):
        return self.name
```

---

# Étape 8 - Créer media.py

Créer :

```text
media/models/media.py
```

Contenu :

```python
from django.db import models

from .media_type import MediaType
from .person import Person


class Media(models.Model):
    id = models.BigAutoField(primary_key=True)
    title = models.CharField(max_length=255)
    slug = models.CharField(max_length=255, unique=True)
    type = models.ForeignKey(
        MediaType,
        db_column="type_id",
        on_delete=models.DO_NOTHING,
        related_name="medias",
    )
    release_year = models.SmallIntegerField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    persons = models.ManyToManyField(
        Person,
        through="MediaPerson",
        related_name="medias",
    )

    class Meta:
        managed = False
        db_table = "media"

    def __str__(self):
        return self.title
```

---

# Étape 9 - Créer person_nationality.py

Créer :

```text
media/models/person_nationality.py
```

Contenu :

```python
from django.db import models

from .country import Country
from .person import Person


class PersonNationality(models.Model):
    person = models.ForeignKey(
        Person,
        db_column="person_id",
        on_delete=models.DO_NOTHING,
    )
    country = models.ForeignKey(
        Country,
        db_column="country_id",
        on_delete=models.DO_NOTHING,
    )

    class Meta:
        managed = False
        db_table = "person_nationality"
        unique_together = (("person", "country"),)

    def __str__(self):
        return f"{self.person} - {self.country}"
```

---

# Étape 10 - Créer person_profession.py

Créer :

```text
media/models/person_profession.py
```

Contenu :

```python
from django.db import models

from .person import Person
from .profession import Profession


class PersonProfession(models.Model):
    person = models.ForeignKey(
        Person,
        db_column="person_id",
        on_delete=models.DO_NOTHING,
    )
    profession = models.ForeignKey(
        Profession,
        db_column="profession_id",
        on_delete=models.DO_NOTHING,
    )

    class Meta:
        managed = False
        db_table = "person_profession"
        unique_together = (("person", "profession"),)

    def __str__(self):
        return f"{self.person} - {self.profession}"
```

---

# Étape 11 - Créer media_person.py

Créer :

```text
media/models/media_person.py
```

Contenu :

```python
from django.db import models

from .media import Media
from .person import Person
from .profession import Profession


class MediaPerson(models.Model):
    media = models.ForeignKey(
        Media,
        db_column="media_id",
        on_delete=models.DO_NOTHING,
    )
    person = models.ForeignKey(
        Person,
        db_column="person_id",
        on_delete=models.DO_NOTHING,
    )
    profession = models.ForeignKey(
        Profession,
        db_column="profession_id",
        on_delete=models.DO_NOTHING,
    )

    class Meta:
        managed = False
        db_table = "media_person"
        unique_together = (("media", "person", "profession"),)

    def __str__(self):
        return f"{self.media} - {self.person} - {self.profession}"
```

---

# Étape 12 - Modifier __init__.py

Ouvrir :

```text
media/models/__init__.py
```

Contenu :

```python
from .continent import Continent
from .country import Country
from .city import City
from .profession import Profession
from .media_type import MediaType
from .person import Person
from .media import Media
from .person_nationality import PersonNationality
from .person_profession import PersonProfession
from .media_person import MediaPerson
```

---

# Étape 13 - Vérifier Django

Exécuter :

```bash
python manage.py check
```

Résultat attendu :

```text
System check identified no issues
```

---

# Étape 14 - Tester les modèles

Lancer le shell Django :

```bash
python manage.py shell
```

Tester :

```python
from media.models import Continent, Country, City, Person, Profession, MediaType, Media

Continent.objects.count()
Country.objects.count()
City.objects.count()
Person.objects.count()
Profession.objects.count()
MediaType.objects.count()
Media.objects.count()
```

Résultat attendu :

```text
2
3
10
10
1
1
10
```

---

# Étape 15 - Tester les relations

Toujours dans le shell :

```python
person = Person.objects.get(wikipedia_link="Christopher_Nolan")
person.name
person.birth_city.name
person.birth_city.country.name
```

Résultat attendu :

```text
Christopher Nolan
London
United Kingdom
```

Tester un média :

```python
movie = Media.objects.get(slug="inception")
movie.title
movie.type.name
```

Résultat attendu :

```text
Inception
Movie
```

Tester les relations many-to-many :

```python
person.nationalities.all()
person.professions.all()
movie.persons.all()
```

---

# Étape 16 - Quitter le shell

```python
exit()
```

---

# Résultat

À la fin de cette phase :

```text
Django lit les tables PostgreSQL existantes
Chaque table possède son modèle Django
Les modèles sont séparés fichier par fichier
Aucune migration n'a été créée
Aucune table n'a été créée par Django
Les premières relations fonctionnent
```

---

# Phase suivante

```text
005-serializers-django-rest-framework.md
```

Objectif :

Créer les serializers Django REST Framework pour exposer les modèles en JSON.
# 003-integration-modele-media.md

## Objectif

Intégrer le modèle métier Media dans Django.

Le schéma PostgreSQL existe déjà.

Les données de référence existent déjà.

Aucun travail de modélisation n'est nécessaire.

L'objectif est de faire correspondre les modèles Django avec le schéma PostgreSQL existant.

---

# Entrées

Schéma PostgreSQL :

- continent
- country
- city
- person
- profession
- media_type
- media

Tables de liaison :

- person_nationality
- person_profession
- media_person

---

# Travail à réaliser

## Étape 1

Configurer PostgreSQL dans Django.

Installer :

```bash
pip install psycopg[binary]
```

---

## Étape 2

Configurer :

```python
DATABASES
```

dans :

```text
config/settings.py
```

---

## Étape 3

Créer les classes Django :

- Continent
- Country
- City
- Person
- Profession
- MediaType
- Media

---

## Étape 4

Créer les relations :

- Person ↔ Country
- Person ↔ Profession
- Media ↔ Person

---

## Étape 5

Mapper exactement les noms PostgreSQL.

Exemples :

```python
db_table = "continent"
```

```python
db_table = "country"
```

```python
db_table = "media"
```

---

## Étape 6

Tester la connexion PostgreSQL.

```bash
python manage.py shell
```

Puis :

```python
from media.models import Person

Person.objects.count()
```

Résultat attendu :

```text
10
```

---

# Livrable

Les modèles Django correspondent exactement au schéma PostgreSQL existant.

Aucune API REST.

Aucune vue.

Aucun serializer.

Seulement :

- PostgreSQL
- Django ORM
- Modèle métier
```

---

Ensuite seulement :

```text
Phase 4
Configuration Django REST Framework

Phase 5
Serializers

Phase 6
Views

Phase 7
Routes

Phase 8
Tests API
```

Là on est beaucoup plus proche d'un projet réel que d'un tutoriel Django académique.
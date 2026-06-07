# Phase 3 - Connecter Django à PostgreSQL

## Contexte

Le projet Django existe déjà.

Les tables PostgreSQL existent déjà.

Les données PostgreSQL sont déjà insérées.

Django ne doit pas créer les tables.

Django doit seulement se connecter à la base PostgreSQL existante.

---

# 1. Installer le driver PostgreSQL

Dans le dossier `backend-django`, avec l'environnement virtuel activé :

```bash
pip install psycopg[binary]
```

---

# 2. Mettre à jour requirements.txt

```bash
pip freeze > requirements.txt
```

---

# 3. Modifier config/settings.py

Ouvrir :

```text
config/settings.py
```

Remplacer le bloc `DATABASES` par :

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'media',
        'USER': 'postgres',
        'PASSWORD': 'Trustno1',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

---

# 4. Déclarer les applications Django

Dans `config/settings.py`, chercher :

```python
INSTALLED_APPS = [
```

Ajouter :

```python
'rest_framework',
'media',
```

Exemple :

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'rest_framework',
    'media',
]
```

---

# 5. Tester la configuration Django

```bash
python manage.py check
```

Résultat attendu :

```text
System check identified no issues
```

---

# 6. Tester la connexion PostgreSQL depuis Django

```bash
python manage.py dbshell
```

Résultat attendu :

```text
media=#
```

Tester une requête :

```sql
SELECT COUNT(*) FROM person;
```

Résultat attendu :

```text
10
```

Quitter PostgreSQL :

```sql
\q
```

---

# 7. Règle importante

Ne pas exécuter :

```bash
python manage.py makemigrations
python manage.py migrate
```

Pour l'instant.

Les tables existent déjà dans PostgreSQL.

Django doit simplement les utiliser.

---

# Résultat de la phase 3

À la fin de cette phase :

```text
Django est connecté à PostgreSQL
La base media est utilisée
L'utilisateur postgres fonctionne
Le mot de passe Trustno1 fonctionne
Les tables existantes sont accessibles
Aucune table Django n'a été créée
```

---

# Phase suivante

Phase 4 :

```text
Mapper les tables PostgreSQL existantes avec les modèles Django
```
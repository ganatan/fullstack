# Table Person

Création de la table `person` et insertion de 10 réalisateurs.

---

## Création de la table

```sql
DROP TABLE IF EXISTS person;

CREATE TABLE person (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    city_id INTEGER NOT NULL
);
```

---

## Insertion des données

```sql
INSERT INTO person (
    first_name,
    last_name,
    city_id
)
VALUES
    ('Steven', 'Spielberg', 1),
    ('Martin', 'Scorsese', 2),
    ('Francis', 'Ford Coppola', 3),
    ('George', 'Lucas', 4),
    ('Quentin', 'Tarantino', 5),
    ('David', 'Fincher', 6),
    ('Spike', 'Lee', 7),
    ('Christopher', 'Nolan', 8),
    ('James', 'Cameron', 9),
    ('Ridley', 'Scott', 10);
```

---

## Vérification

```sql
SELECT
    id,
    first_name,
    last_name,
    city_id
FROM person
ORDER BY id;
```

Résultat attendu :

```text
1  Steven       Spielberg       1
2  Martin       Scorsese        2
3  Francis      Ford Coppola    3
4  George       Lucas           4
5  Quentin      Tarantino       5
6  David        Fincher         6
7  Spike        Lee             7
8  Christopher  Nolan           8
9  James        Cameron         9
10 Ridley       Scott           10
```

---

# Manipulation des données

## Récupérer toutes les personnes

Récupérer toutes les lignes de la table `person`.

```sql
SELECT
    id,
    first_name,
    last_name,
    city_id
FROM person
ORDER BY id;
```

---

## Récupérer une personne par son identifiant

Récupérer uniquement la personne ayant l'identifiant `1`.

```sql
SELECT
    id,
    first_name,
    last_name,
    city_id
FROM person
WHERE id = 1;
```

---

## Rechercher une personne par son nom

Récupérer les personnes ayant le nom `Spielberg`.

```sql
SELECT
    id,
    first_name,
    last_name,
    city_id
FROM person
WHERE last_name = 'Spielberg';
```

---

## Ajouter une personne

Ajouter un nouveau réalisateur dans la table.

```sql
INSERT INTO person (
    first_name,
    last_name,
    city_id
)
VALUES (
    'Denis',
    'Villeneuve',
    11
);
```

---

## Ajouter une personne et récupérer son identifiant

Ajouter un réalisateur et retourner directement la ligne créée.

```sql
INSERT INTO person (
    first_name,
    last_name,
    city_id
)
VALUES (
    'Denis',
    'Villeneuve',
    11
)
RETURNING
    id,
    first_name,
    last_name,
    city_id;
```

---

## Modifier le prénom

Modifier uniquement le prénom de la personne ayant l'identifiant `1`.

```sql
UPDATE person
SET first_name = 'Steve'
WHERE id = 1;
```

---

## Modifier le nom

Modifier uniquement le nom de la personne ayant l'identifiant `1`.

```sql
UPDATE person
SET last_name = 'Spielberg Jr.'
WHERE id = 1;
```

---

## Modifier la ville

Modifier uniquement la ville associée à la personne ayant l'identifiant `1`.

```sql
UPDATE person
SET city_id = 3
WHERE id = 1;
```

---

## Modifier le prénom et le nom

Modifier simultanément le prénom et le nom d'une personne.

```sql
UPDATE person
SET
    first_name = 'Steven',
    last_name = 'Spielberg'
WHERE id = 1;
```

---

## Modifier toutes les propriétés

Modifier toutes les propriétés modifiables d'une personne.

```sql
UPDATE person
SET
    first_name = 'Steven',
    last_name = 'Spielberg',
    city_id = 1
WHERE id = 1;
```

---

## Modifier une personne et récupérer le résultat

Modifier une personne puis retourner directement la ligne mise à jour.

```sql
UPDATE person
SET
    first_name = 'Steven',
    last_name = 'Spielberg',
    city_id = 2
WHERE id = 1
RETURNING
    id,
    first_name,
    last_name,
    city_id;
```

---

## Supprimer une personne

Supprimer la personne ayant l'identifiant `10`.

```sql
DELETE FROM person
WHERE id = 10;
```

---

## Supprimer une personne et récupérer la ligne supprimée

Supprimer une personne tout en retournant les données supprimées.

```sql
DELETE FROM person
WHERE id = 10
RETURNING
    id,
    first_name,
    last_name,
    city_id;
```

---

## Supprimer toutes les personnes

Supprimer toutes les lignes sans supprimer la table.

```sql
DELETE FROM person;
```

---

## Compter les personnes

Compter le nombre total de personnes présentes dans la table.

```sql
SELECT COUNT(*)
FROM person;
```

---

## Récupérer les personnes d'une ville

Récupérer toutes les personnes associées à la ville `1`.

```sql
SELECT
    id,
    first_name,
    last_name,
    city_id
FROM person
WHERE city_id = 1
ORDER BY id;
```

---

## Trier par nom

Récupérer toutes les personnes triées alphabétiquement par nom.

```sql
SELECT
    id,
    first_name,
    last_name,
    city_id
FROM person
ORDER BY last_name, first_name;
```

---

## Rechercher partiellement un nom

Rechercher les personnes dont le nom contient `Scott` sans tenir compte de la casse.

```sql
SELECT
    id,
    first_name,
    last_name,
    city_id
FROM person
WHERE last_name ILIKE '%Scott%';
```

---

## Limiter le nombre de résultats

Récupérer uniquement les cinq premières personnes.

```sql
SELECT
    id,
    first_name,
    last_name,
    city_id
FROM person
ORDER BY id
LIMIT 5;
```

---

## Pagination

Récupérer cinq personnes à partir de la sixième ligne.

```sql
SELECT
    id,
    first_name,
    last_name,
    city_id
FROM person
ORDER BY id
LIMIT 5
OFFSET 5;
```

---

# Opérations CRUD principales

```text
CREATE  -> INSERT INTO
READ    -> SELECT
UPDATE  -> UPDATE
DELETE  -> DELETE
```

Exemples principaux :

```sql
INSERT INTO person (
    first_name,
    last_name,
    city_id
)
VALUES (
    'Denis',
    'Villeneuve',
    11
);
```

```sql
SELECT
    id,
    first_name,
    last_name,
    city_id
FROM person
WHERE id = 1;
```

```sql
UPDATE person
SET last_name = 'Spielberg'
WHERE id = 1;
```

```sql
DELETE FROM person
WHERE id = 1;
```

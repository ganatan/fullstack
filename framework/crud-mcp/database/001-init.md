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
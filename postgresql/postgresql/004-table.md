# PostgreSQL – table person (SQL pur pour pgAdmin)

```sql
-- Création de la table
CREATE TABLE person (
  id   BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

-- Insertion de données
INSERT INTO person (name) VALUES ('Alice');
INSERT INTO person (name) VALUES ('Bob');

-- Lecture de toutes les lignes
SELECT * FROM person;

-- Lecture avec filtre
SELECT * FROM person WHERE id = 1;

-- Mise à jour d’un champ
UPDATE person SET name = 'Alice Cooper' WHERE id = 1;

-- Renommer une colonne
ALTER TABLE person RENAME COLUMN name TO full_name;

-- Supprimer une colonne
ALTER TABLE person DROP COLUMN full_name;

-- Supprimer une ligne
DELETE FROM person WHERE id = 2;

-- Supprimer toutes les lignes (structure conservée)
DELETE FROM person;

-- Vider la table (rapide, reset des identifiants)
TRUNCATE TABLE person;

-- Vider la table avec dépendances
TRUNCATE TABLE person CASCADE;

-- Supprimer la table
DROP TABLE person;

-- Supprimer la table si elle existe
DROP TABLE IF EXISTS person;
```

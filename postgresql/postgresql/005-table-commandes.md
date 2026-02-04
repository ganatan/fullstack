# table-simple.md

```sql

-- Liste des tables du schéma courant
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE';

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

-- Suppression d’une ligne
DELETE FROM person WHERE id = 2;

-- Suppression de toutes les lignes (structure conservée)
DELETE FROM person;

-- Vidage rapide de la table (reset des identifiants)
TRUNCATE TABLE person;

-- Suppression de la table
DROP TABLE person;

-- Suppression de la table si elle existe
DROP TABLE IF EXISTS person;

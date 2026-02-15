# table-cle-etrangere.md

```sql
-- Création de la table de référence
CREATE TABLE city (
  id   BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

-- Insertion de données de référence
INSERT INTO city (name) VALUES ('Paris');
INSERT INTO city (name) VALUES ('Lyon');

-- Ajout de la colonne FK dans person
ALTER TABLE person
ADD COLUMN city_id BIGINT;

-- Ajout de la contrainte de clé étrangère
ALTER TABLE person
ADD CONSTRAINT fk_person_city
FOREIGN KEY (city_id) REFERENCES city(id);

-- Variante avec règles de propagation
ALTER TABLE person
DROP CONSTRAINT fk_person_city;

ALTER TABLE person
ADD CONSTRAINT fk_person_city
FOREIGN KEY (city_id) REFERENCES city(id)
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- Suppression de la contrainte FK
ALTER TABLE person
DROP CONSTRAINT fk_person_city;

-- Suppression de la colonne FK
ALTER TABLE person
DROP COLUMN city_id;

-- Lister les clés étrangères de la table person
SELECT
  conname,
  pg_get_constraintdef(c.oid) AS definition
FROM pg_constraint c
JOIN pg_class t ON t.oid = c.conrelid
WHERE t.relname = 'person'
  AND c.contype = 'f';
```

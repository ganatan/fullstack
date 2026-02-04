# table-contraintes-index.md

```sql
-- Contrainte UNIQUE
ALTER TABLE person
ADD CONSTRAINT unique_person_name UNIQUE (name);

-- Supprimer la contrainte UNIQUE
ALTER TABLE person
DROP CONSTRAINT unique_person_name;

-- Contrainte NOT NULL
ALTER TABLE person
ALTER COLUMN name SET NOT NULL;

-- Retirer NOT NULL
ALTER TABLE person
ALTER COLUMN name DROP NOT NULL;

-- Contrainte CHECK (ex: longueur du nom > 0)
ALTER TABLE person
ADD CONSTRAINT check_person_name_length
CHECK (LENGTH(name) > 0);

-- Supprimer la contrainte CHECK
ALTER TABLE person
DROP CONSTRAINT check_person_name_length;

-- Index simple
CREATE INDEX idx_person_name
ON person(name);

-- Index UNIQUE
CREATE UNIQUE INDEX idx_person_name_unique
ON person(name);

-- Index composite
CREATE INDEX idx_person_id_name
ON person(id, name);

-- Supprimer un index
DROP INDEX idx_person_name;

-- Supprimer un index s’il existe
DROP INDEX IF EXISTS idx_person_name;

-- Lister les index de la table
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'person';
```

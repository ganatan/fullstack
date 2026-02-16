# table-colonnes.md

```sql
-- Ajouter une colonne
ALTER TABLE person
ADD COLUMN email VARCHAR(255);

-- Ajouter une colonne avec valeur par défaut
ALTER TABLE person
ADD COLUMN is_active BOOLEAN DEFAULT true;

-- Renommer une colonne
ALTER TABLE person
RENAME COLUMN name TO full_name;

-- Changer le type d'une colonne
ALTER TABLE person
ALTER COLUMN full_name TYPE TEXT;

-- Définir une valeur par défaut
ALTER TABLE person
ALTER COLUMN full_name SET DEFAULT 'Unknown';

-- Retirer une valeur par défaut
ALTER TABLE person
ALTER COLUMN full_name DROP DEFAULT;

-- Ajouter une contrainte NOT NULL
ALTER TABLE person
ALTER COLUMN full_name SET NOT NULL;

-- Retirer NOT NULL
ALTER TABLE person
ALTER COLUMN full_name DROP NOT NULL;

-- Supprimer une colonne
ALTER TABLE person
DROP COLUMN email;

-- Supprimer une colonne si elle existe
ALTER TABLE person
DROP COLUMN IF EXISTS email;

-- Ajouter une colonne issue d'une séquence (auto-incrément)
ALTER TABLE person
ADD COLUMN code BIGSERIAL;

-- Renommer la table
ALTER TABLE person
RENAME TO person_v2;

-- Revenir au nom initial
ALTER TABLE person_v2
RENAME TO person;
```

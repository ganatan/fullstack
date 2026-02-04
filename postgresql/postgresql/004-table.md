# table-simple.md

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



-- Table complète avec la majorité des types PostgreSQL
CREATE TABLE person_complex (
  id                BIGSERIAL PRIMARY KEY,          -- identifiant
  uuid              UUID,                            -- identifiant universel
  name              VARCHAR(255) NOT NULL,           -- texte court
  description       TEXT,                            -- texte long

  age               INTEGER,                         -- entier
  salary            NUMERIC(12,2),                   -- décimal précis
  rating            REAL,                            -- flottant
  score             DOUBLE PRECISION,                -- flottant double

  is_active         BOOLEAN DEFAULT true,            -- booléen

  birth_date        DATE,                            -- date
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- date + heure
  updated_at        TIMESTAMPTZ,                      -- timestamp avec timezone
  login_time        TIME,                            -- heure seule

  email             VARCHAR(255) UNIQUE,             -- unique
  status            VARCHAR(50) DEFAULT 'NEW',       -- valeur métier

  tags              TEXT[],                          -- tableau
  metadata          JSON,                            -- JSON non typé
  metadata_b        JSONB,                            -- JSON indexable

  ip_address        INET,                            -- IP
  mac_address       MACADDR,                         -- MAC
  website           VARCHAR(255),                    -- URL

  binary_data       BYTEA                            -- données binaires
);
```

# table-simple.md

```sql
-- Création de la table simple
CREATE TABLE person (
  id   BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

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

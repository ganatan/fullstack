# PostgreSQL – table person (essentiel)

```sql
# Se connecter à la base
\c backend_media

# Créer la table
CREATE TABLE person (
  id   BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

# Lister les tables
\dt

# Voir la structure de la table
\d person

# Insérer des lignes
INSERT INTO person (name) VALUES ('Alice');
INSERT INTO person (name) VALUES ('Bob');

# Lire toutes les lignes
SELECT * FROM person;

# Lire avec filtre
SELECT * FROM person WHERE id = 1;

# Mettre à jour un champ (name)
UPDATE person SET name = 'Alice Cooper' WHERE id = 1;

# Supprimer une ligne
DELETE FROM person WHERE id = 2;

# Supprimer toutes les lignes (garde la table)
DELETE FROM person;

# Vider toutes les lignes (plus rapide, reset id)
TRUNCATE TABLE person;

# Vider toutes les lignes + dépendances (si FK)
TRUNCATE TABLE person CASCADE;

# Supprimer la table
DROP TABLE person;

# Supprimer la table si elle existe
DROP TABLE IF EXISTS person;
```

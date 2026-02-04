# PostgreSQL – commandes DATABASE (essentiel complet)

```bash
# Connexion au serveur PostgreSQL
psql -h localhost -p 5432 -U postgres
```

```sql
# Lister toutes les bases
\l

# Afficher la base courante
SELECT current_database();

# Créer une base
CREATE DATABASE backend_media;

# Créer une base avec encodage
CREATE DATABASE backend_media
  WITH ENCODING 'UTF8';

# Se connecter à une base
\c backend_media

# Revenir à la base postgres (obligatoire avant rename/drop)
\c postgres

# Renommer une base
ALTER DATABASE backend_media RENAME TO backend_media_v2;

# Changer le propriétaire d’une base
ALTER DATABASE backend_media OWNER TO postgres;

# Interdire les connexions à une base
ALTER DATABASE backend_media CONNECTION LIMIT 0;

# Autoriser de nouveau les connexions
ALTER DATABASE backend_media CONNECTION LIMIT -1;

# Lister les connexions actives sur une base
SELECT pid, usename, application_name, client_addr
FROM pg_stat_activity
WHERE datname = 'backend_media';

# Tuer toutes les connexions actives sur une base
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'backend_media';

# Supprimer une base
DROP DATABASE backend_media;

# Supprimer une base si elle existe
DROP DATABASE IF EXISTS backend_media;
```

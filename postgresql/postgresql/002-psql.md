# Test de la connection avec user postgres
psql -h localhost -p 5432 -U postgres

# Creation database
CREATE DATABASE backend_media;

# Rename database
ALTER DATABASE backend_media RENAME TO backend_media_2;

# Suppression de toutes les connections
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'backend_media';

# Suppression database
DROP DATABASE backend_media;


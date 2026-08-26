# ksqlDB

ksqlDB permet de traiter les données Kafka avec une syntaxe proche de SQL.
Il permet de créer des flux et des tables dérivés sans écrire directement une application Kafka Streams.

## Principe

```text
Kafka Topics
     ↓
   ksqlDB
     ↓
SQL streaming
     ↓
Nouveaux Topics
```

## Créer un stream

```sql
CREATE STREAM media_events (
  id BIGINT,
  type VARCHAR,
  name VARCHAR
)
WITH (
  KAFKA_TOPIC='media-events',
  VALUE_FORMAT='JSON'
);
```

## Lire les événements

```sql
SELECT *
FROM media_events
EMIT CHANGES;
```

## Filtrer

```sql
SELECT *
FROM media_events
WHERE type = 'MEDIA_CREATED'
EMIT CHANGES;
```

## Créer un stream dérivé

```sql
CREATE STREAM media_created AS
SELECT *
FROM media_events
WHERE type = 'MEDIA_CREATED'
EMIT CHANGES;
```

ksqlDB repose sur Kafka Streams pour exécuter les traitements.

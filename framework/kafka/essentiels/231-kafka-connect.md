# Kafka Connect

Kafka Connect permet de connecter Kafka à des systèmes externes sans écrire tout le code d'intégration.
Il fonctionne avec des connectors Source pour alimenter Kafka et des connectors Sink pour exporter les données.

## Principe

```text
Source externe
    ↓
Source Connector
    ↓
Kafka
    ↓
Sink Connector
    ↓
Système externe
```

Exemples :

```text
PostgreSQL → Kafka
Kafka → Elasticsearch
Kafka → S3
```

## Modes

Kafka Connect peut fonctionner en :

```text
standalone
distributed
```

Le mode `standalone` convient surtout au développement.

Le mode `distributed` permet :

```text
scalabilité
tolérance aux pannes
répartition des tâches
```

## Exemple de configuration

```json
{
  "name": "postgres-source",
  "config": {
    "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
    "tasks.max": "1",
    "topic.prefix": "media"
  }
}
```

## API REST

Lister les connectors :

```bash
curl http://localhost:8083/connectors
```

Créer un connector :

```bash
curl -X POST http://localhost:8083/connectors   -H "Content-Type: application/json"   -d @connector.json
```

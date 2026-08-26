# Réplication

La réplication permet de conserver plusieurs copies d'une partition sur différents brokers.
Elle améliore la tolérance aux pannes du cluster.

## Exemple

```text
Partition 0

Broker 1 → Leader
Broker 2 → Replica
Broker 3 → Replica
```

Avec :

```text
replication-factor = 3
```

trois copies existent.

## Création

```bash
kafka-topics.sh   --bootstrap-server localhost:9092   --create   --topic media-events   --partitions 3   --replication-factor 3
```

En local avec un seul broker, le facteur de réplication doit généralement rester à `1`.

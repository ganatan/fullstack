# Partition

Une partition est une subdivision ordonnée d'un topic Kafka.
Elle permet de distribuer les messages et d'augmenter le parallélisme.

## Principe

```text
Topic media-events

Partition 0
Partition 1
Partition 2
```

Chaque partition possède sa propre suite d'offsets.

## Exemple

```text
Partition 0 : 0 1 2 3
Partition 1 : 0 1 2
Partition 2 : 0 1 2 3 4
```

## Création

```bash
kafka-topics.sh   --bootstrap-server localhost:9092   --create   --topic media-events   --partitions 3   --replication-factor 1
```

Plus de partitions permettent davantage de consumers actifs dans un même consumer group.

# Clé de partitionnement

La clé d'un message permet notamment de déterminer dans quelle partition il sera écrit.
Des messages ayant la même clé sont normalement envoyés vers la même partition.

## Principe

```text
key = media-1001
```

Les événements concernant le même média peuvent ainsi rester dans le même ordre.

## Spring Kafka

```java
kafkaTemplate.send(
    "media-events",
    "media-1001",
    event
);
```

## Exemple

```text
media-1001 → Partition 2
media-1001 → Partition 2
media-1001 → Partition 2
```

La clé est donc importante lorsque l'ordre métier doit être préservé.

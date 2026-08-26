# Consumer Group

Un consumer group regroupe plusieurs consumers qui coopèrent pour lire un topic.
Dans un même groupe, une partition n'est lue que par un seul consumer à la fois.

## Principe

```text
Topic : 3 partitions

P0 → Consumer 1
P1 → Consumer 2
P2 → Consumer 3
```

Avec quatre consumers :

```text
Consumer 4 → inactif
```

car seulement trois partitions sont disponibles.

## Spring Kafka

```java
@KafkaListener(
    topics = "media-events",
    groupId = "media-api"
)
```

Deux groupes différents peuvent lire indépendamment les mêmes messages.

# Ordre des messages

Kafka garantit l'ordre des messages à l'intérieur d'une même partition.
Kafka ne garantit pas un ordre global entre plusieurs partitions.

## Exemple

```text
Partition 0 : A → B → C
Partition 1 : D → E → F
```

L'ordre est garanti dans chaque ligne mais pas entre les deux partitions.

## Pour préserver l'ordre métier

Utiliser une clé stable :

```java
kafkaTemplate.send(
    "media-events",
    String.valueOf(mediaId),
    event
);
```

Tous les événements d'un même `mediaId` sont alors dirigés vers la même partition.

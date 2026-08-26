# Performance

Les performances Kafka dépendent principalement du partitionnement, du batching, de la compression et du parallélisme.
Optimiser Kafka consiste généralement à privilégier le traitement par lots plutôt que les échanges unitaires.

## Producer

Paramètres importants :

```text
batch.size
linger.ms
compression.type
acks
```

Exemple :

```properties
spring.kafka.producer.properties.linger.ms=5
spring.kafka.producer.properties.compression.type=lz4
```

## Consumer

Paramètres utiles :

```text
fetch.min.bytes
fetch.max.wait.ms
max.poll.records
```

Avant d'optimiser, mesurer le débit, la latence et le consumer lag.

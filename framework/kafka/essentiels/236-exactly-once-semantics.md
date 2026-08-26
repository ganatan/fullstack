# Exactly-Once Semantics

Exactly-Once Semantics vise à produire un seul effet logique même lorsqu'un traitement est rejoué.
Kafka combine idempotence, transactions et lecture transactionnelle pour certains scénarios.

## Problème

```text
lecture message
    ↓
traitement
    ↓
écriture résultat
    ↓
crash avant commit offset
```

Le message peut être relu.

## Kafka

Un traitement transactionnel peut regrouper :

```text
lecture
transformation
écriture Kafka
commit offset
```

## Consumer transactionnel

```properties
spring.kafka.consumer.properties.isolation.level=read_committed
```

## Producer

```properties
spring.kafka.producer.transaction-id-prefix=media-
```

## Kafka Streams

Kafka Streams propose un mode exactly-once :

```properties
processing.guarantee=exactly_once_v2
```

Exactly-once ne signifie pas que tous les effets externes sont automatiquement idempotents.

Une base externe ou une API HTTP doit toujours être pensée séparément.

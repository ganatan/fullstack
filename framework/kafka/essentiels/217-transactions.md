# Transactions

Les transactions Kafka permettent de regrouper plusieurs écritures dans une unité atomique.
Elles sont utiles notamment pour certains scénarios consume-process-produce.

## Principe

```text
BEGIN
  ↓
message A
message B
offset
  ↓
COMMIT
```

En cas d'échec :

```text
ABORT
```

## Spring Kafka

Une configuration transactionnelle peut utiliser un préfixe :

```properties
spring.kafka.producer.transaction-id-prefix=media-
```

Puis :

```java
@Transactional
public void process() {
}
```

Les transactions Kafka doivent être utilisées lorsqu'une vraie atomicité Kafka est nécessaire.

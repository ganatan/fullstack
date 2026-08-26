# Batching Producer

Le producer Kafka regroupe plusieurs messages dans des batches avant leur envoi.
Le batching réduit le nombre de requêtes réseau et augmente fortement le débit.

## Principe

Sans batching :

```text
message → requête
message → requête
message → requête
```

Avec batching :

```text
message
message
message
   ↓
batch
   ↓
une requête
```

## Paramètres importants

```text
batch.size
linger.ms
```

## Spring Kafka

```properties
spring.kafka.producer.properties.batch.size=32768
spring.kafka.producer.properties.linger.ms=5
```

`batch.size` définit une taille cible de batch.

`linger.ms` autorise le producer à attendre brièvement pour regrouper davantage de messages.

## Avec compression

```properties
spring.kafka.producer.properties.compression.type=lz4
```

Batching et compression sont souvent utilisés ensemble.

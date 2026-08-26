# Compression

Kafka peut compresser les batches de messages produits afin de réduire le réseau et l'espace disque.
La compression est particulièrement efficace lorsque plusieurs messages similaires sont envoyés ensemble.

## Types courants

```text
none
gzip
snappy
lz4
zstd
```

## Configuration Producer

```properties
spring.kafka.producer.properties.compression.type=lz4
```

ou :

```properties
spring.kafka.producer.properties.compression.type=zstd
```

## Principe

```text
Messages
   ↓
Batch
   ↓
Compression
   ↓
Kafka
```

## Avantages

```text
moins de trafic réseau
moins d'espace disque
meilleur débit
```

## Contrepartie

```text
CPU supplémentaire
```

Pour de gros volumes, `lz4` et `zstd` constituent souvent de bons compromis.

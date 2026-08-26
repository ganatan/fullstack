# Architecture du Controller

Les controllers Kafka gèrent les métadonnées du cluster et coordonnent son état.
En mode KRaft, ils forment un quorum séparé ou combiné avec les brokers.

## Principe

```text
Controllers KRaft
      ↓
métadonnées cluster
      ↓
Brokers
```

Les métadonnées concernent notamment :

```text
topics
partitions
leaders
replicas
configuration cluster
```

## Rôles

Un nœud Kafka peut être :

```text
broker
controller
broker + controller
```

## Configuration locale

```properties
process.roles=broker,controller
```

## Production

Une architecture typique sépare :

```text
Controllers
    ↓
quorum KRaft

Brokers
    ↓
données utilisateurs
```

Cette séparation améliore la lisibilité et la résilience de l'architecture du cluster.

# MirrorMaker 2 / Multi-datacenter

MirrorMaker 2 permet de répliquer des topics Kafka entre plusieurs clusters.
Il est utilisé pour migration, réplication géographique et scénarios de reprise après sinistre.

## Principe

```text
Cluster A
   ↓
MirrorMaker 2
   ↓
Cluster B
```

MirrorMaker 2 repose sur Kafka Connect.

## Exemple

```text
Paris Kafka
    ↓
replication
    ↓
Marseille Kafka
```

## Configuration conceptuelle

```properties
clusters = A, B

A.bootstrap.servers = kafka-a:9092
B.bootstrap.servers = kafka-b:9092

A->B.enabled = true
A->B.topics = media-.*
```

## Cas d'usage

```text
disaster recovery
migration cluster
multi-région
centralisation de données
```

Il faut définir clairement quel cluster est source et comment gérer les bascules.

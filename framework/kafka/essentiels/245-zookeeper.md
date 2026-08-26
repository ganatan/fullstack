# ZooKeeper - historique

ZooKeeper était historiquement utilisé par Kafka pour gérer une partie des métadonnées et de la coordination du cluster.
Kafka moderne utilise KRaft et n'a plus besoin de ZooKeeper.

## Ancienne architecture

```text
Kafka Brokers
      ↓
ZooKeeper
```

ZooKeeper participait notamment à :

```text
coordination
métadonnées
élection du controller Kafka
gestion de certains états cluster
```

## Architecture moderne

```text
Kafka
  ↓
KRaft
  ↓
Controller Quorum
```

## Différence

Avant :

```text
Kafka + ZooKeeper
```

Maintenant :

```text
Kafka + KRaft
```

## Important

Pour un nouveau projet Kafka :

```text
KRaft
```

doit être privilégié.

ZooKeeper reste important à connaître pour comprendre et maintenir d'anciens clusters Kafka.

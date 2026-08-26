# Leader et Followers

Chaque partition possède un leader et éventuellement plusieurs replicas followers.
Les lectures et écritures passent normalement par le leader de la partition.

## Principe

```text
Partition 0

Broker 1 → Leader
Broker 2 → Follower
Broker 3 → Follower
```

Les followers répliquent les données du leader.

## En cas de panne

```text
Broker 1 indisponible
        ↓
nouveau leader
        ↓
Broker 2
```

Kafka peut alors continuer à servir la partition si une replica synchronisée est disponible.

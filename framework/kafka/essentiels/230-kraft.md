# KRaft

KRaft est le mode moderne de gestion des métadonnées Kafka sans ZooKeeper.
Kafka utilise alors son propre protocole de consensus basé sur Raft.

## Avant

```text
Kafka Brokers
     ↓
ZooKeeper
```

## KRaft

```text
Kafka Brokers
     ↓
Controllers KRaft
```

Les rôles peuvent être séparés :

```text
broker
controller
```

ou combinés pour un environnement local.

## Intérêt

```text
architecture simplifiée
moins de composants
gestion native des métadonnées
meilleure évolutivité
```

Pour un nouveau projet Kafka moderne, KRaft est le modèle à privilégier.

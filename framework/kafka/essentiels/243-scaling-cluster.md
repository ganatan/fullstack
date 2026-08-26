# Scaling du Cluster

Scaler Kafka consiste à augmenter la capacité de stockage, de traitement ou de consommation.
Le scaling implique généralement brokers, partitions et consumers.

## Scaling horizontal des brokers

```text
3 brokers
   ↓
ajout
   ↓
4 brokers
```

Ajouter un broker n'équilibre pas automatiquement toutes les partitions existantes.

Il faut redistribuer les replicas selon la stratégie d'exploitation choisie.

## Scaling des consumers

```text
3 partitions
   ↓
maximum utile
   ↓
3 consumers actifs par groupe
```

Pour utiliser davantage de consumers :

```text
augmenter le nombre de partitions
```

## Points à surveiller

```text
consumer lag
débit
CPU
réseau
disque
nombre de partitions
réplication
```

## Principe

```text
capacité cluster
=
brokers
+
partitions
+
réplication
+
consumers
```

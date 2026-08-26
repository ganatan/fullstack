# Stratégies de Partition Assignment

La stratégie d'assignation définit comment les partitions sont réparties entre les consumers d'un groupe.
Le choix influence l'équilibrage et l'impact des rebalances.

## RangeAssignor

Répartit les partitions topic par topic.

```text
P0 P1 → Consumer A
P2 P3 → Consumer B
```

Classe :

```text
org.apache.kafka.clients.consumer.RangeAssignor
```

## RoundRobinAssignor

Distribue les partitions de manière circulaire.

```text
P0 → A
P1 → B
P2 → A
P3 → B
```

Classe :

```text
org.apache.kafka.clients.consumer.RoundRobinAssignor
```

## StickyAssignor

Cherche à conserver les assignations existantes tout en équilibrant.

```text
org.apache.kafka.clients.consumer.StickyAssignor
```

## CooperativeStickyAssignor

Permet un rebalance coopératif et réduit les interruptions globales.

```text
org.apache.kafka.clients.consumer.CooperativeStickyAssignor
```

## Configuration

```properties
spring.kafka.consumer.properties.partition.assignment.strategy=org.apache.kafka.clients.consumer.CooperativeStickyAssignor
```

# Rebalancing

Un rebalance redistribue les partitions entre les consumers d'un même consumer group.
Il se produit notamment lorsqu'un consumer rejoint ou quitte le groupe.

## Avant

```text
P0 → Consumer A
P1 → Consumer A
P2 → Consumer B
```

## Après arrivée de Consumer C

```text
P0 → Consumer A
P1 → Consumer B
P2 → Consumer C
```

## Impact

Pendant certaines phases du rebalance, la consommation peut être temporairement interrompue.

Il faut donc surveiller :

```text
temps de traitement
session timeout
max poll interval
nombre de consumers
```

Un consumer trop lent peut provoquer des rebalances répétés.

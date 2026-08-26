# Delivery Semantics

Kafka permet plusieurs garanties de livraison selon la configuration du producer et du consumer.
Les trois notions classiques sont at-most-once, at-least-once et exactly-once.

## At-most-once

```text
0 ou 1 livraison
```

Un message peut être perdu mais n'est normalement pas retraité.

## At-least-once

```text
1 ou plusieurs livraisons
```

Un message n'est normalement pas perdu mais peut être traité plusieurs fois.

## Exactly-once

```text
1 effet logique
```

Kafka fournit des mécanismes transactionnels permettant des traitements exactly-once dans certains scénarios.

Dans les applications métier, l'idempotence reste souvent indispensable.

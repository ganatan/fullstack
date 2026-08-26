# Consumer Lag

Le consumer lag mesure l'écart entre le dernier message disponible et le dernier message traité par un consumer group.
C'est l'un des indicateurs les plus importants pour surveiller une consommation Kafka.

## Exemple

```text
Dernier offset Kafka : 10000
Offset consumer      : 9700

Lag = 300
```

## Commande

```bash
kafka-consumer-groups.sh   --bootstrap-server localhost:9092   --describe   --group media-api
```

## Interprétation

```text
lag faible et stable → normal
lag croissant        → consumer trop lent ou indisponible
```

Le lag doit être suivi dans l'observabilité.

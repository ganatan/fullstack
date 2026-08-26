# Observabilité

L'observabilité Kafka consiste à surveiller brokers, topics, producers, consumers et consumer lag.
Elle permet d'identifier rapidement saturation, erreurs et retards de traitement.

## Indicateurs essentiels

```text
consumer lag
débit entrant
débit sortant
erreurs producer
erreurs consumer
latence
ISR
espace disque
rebalances
```

## Logs

Avec Spring Boot :

```properties
logging.level.org.springframework.kafka=INFO
```

## Outils

On peut utiliser selon l'environnement :

```text
Prometheus
Grafana
JMX
Conduktor
outils Kafka CLI
```

Le consumer lag reste souvent la première métrique à examiner.

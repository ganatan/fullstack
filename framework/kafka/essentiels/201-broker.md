# Broker

Un broker Kafka est un serveur qui reçoit, stocke et distribue les messages.
Un cluster Kafka est composé d'un ou plusieurs brokers.

## Principe

Chaque broker possède un identifiant et héberge une partie des partitions du cluster.

```text
Producer
   ↓
Broker Kafka
   ↓
Consumer
```

## Mise en pratique

Un client Kafka se connecte à un ou plusieurs brokers via :

```properties
spring.kafka.bootstrap-servers=localhost:9092
```

Dans un cluster :

```text
broker-1:9092
broker-2:9092
broker-3:9092
```

Le client découvre ensuite automatiquement la topologie du cluster.

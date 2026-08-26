# Static Membership

La static membership permet de donner une identité stable à une instance de consumer.
Elle réduit certains rebalances provoqués par des redémarrages courts ou temporaires.

## Sans static membership

```text
Consumer redémarre
      ↓
nouveau membre
      ↓
rebalance
```

## Avec static membership

```text
Consumer
group.instance.id=media-consumer-1
```

Kafka reconnaît l'instance comme membre stable du groupe.

## Configuration

```properties
spring.kafka.consumer.properties.group.instance.id=media-consumer-1
```

Chaque instance doit posséder un identifiant unique.

Exemple :

```text
media-consumer-1
media-consumer-2
media-consumer-3
```

## Intérêt

```text
moins de rebalances inutiles
rolling restart plus stable
assignation plus durable
```

La static membership doit être associée à une gestion correcte des timeouts.

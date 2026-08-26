# Message

Un message Kafka est l'unité de donnée envoyée par un producer et lue par un consumer.
Il contient principalement une clé, une valeur, des headers et des métadonnées.

## Structure

```text
key
value
headers
timestamp
partition
offset
```

## Exemple JSON

```json
{
  "id": 1001,
  "type": "MEDIA_CREATED",
  "name": "Alien"
}
```

## Exemple Spring Kafka

```java
kafkaTemplate.send(
    "media-events",
    event
);
```

Kafka stocke le message dans une partition du topic.

# Headers de message

Les headers Kafka permettent d'ajouter des métadonnées à un message sans modifier son payload.
Ils sont utiles pour transporter correlation ID, version, type d'événement ou informations techniques.

## Structure

```text
key
value
headers
timestamp
partition
offset
```

## Exemple

```text
event-type = MEDIA_CREATED
correlation-id = 123456
version = 1
```

## Spring Kafka Producer

```java
Message<MediaEvent> message =
    MessageBuilder
        .withPayload(
            event
        )
        .setHeader(
            "event-type",
            "MEDIA_CREATED"
        )
        .build();

kafkaTemplate.send(
    message
);
```

## Consumer

```java
@KafkaListener(
    topics = "media-events"
)
public void consume(
    MediaEvent event,
    @Header("event-type")
    String eventType
) {
}
```

Les headers doivent rester des métadonnées et non remplacer le payload métier.

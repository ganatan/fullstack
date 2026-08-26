# Producer

Un producer publie des messages dans un ou plusieurs topics Kafka.
Il choisit directement ou indirectement la partition dans laquelle le message sera écrit.

## Principe

```text
Application
   ↓
Producer
   ↓
Kafka
```

## Spring Kafka

```java
@Service
public class MediaProducer {

  private final KafkaTemplate<String, MediaEvent> kafkaTemplate;

  public MediaProducer(
      KafkaTemplate<String, MediaEvent> kafkaTemplate
  ) {
    this.kafkaTemplate = kafkaTemplate;
  }

  public void send(MediaEvent event) {
    kafkaTemplate.send(
        "media-events",
        event
    );
  }

}
```

Le producer peut attendre un acknowledgement du broker avant de considérer l'envoi réussi.

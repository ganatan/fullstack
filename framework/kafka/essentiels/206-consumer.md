# Consumer

Un consumer lit les messages présents dans un topic Kafka.
Il lit les partitions qui lui sont attribuées et suit sa progression grâce aux offsets.

## Principe

```text
Kafka
   ↓
Consumer
   ↓
Application
```

## Spring Kafka

```java
@KafkaListener(
    topics = "media-events",
    groupId = "media-api"
)
public void consume(
    MediaEvent event
) {
  System.out.println(
      event
  );
}
```

Un consumer peut appartenir à un consumer group afin de partager les partitions avec d'autres instances.

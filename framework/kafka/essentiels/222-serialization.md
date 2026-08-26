# Serialization

Kafka transporte des bytes ; les objets doivent donc être sérialisés avant l'envoi et désérialisés à la lecture.
Le producer et le consumer doivent utiliser des formats compatibles.

## Exemple String

```properties
spring.kafka.producer.key-serializer=org.apache.kafka.common.serialization.StringSerializer
```

## JSON avec Spring Kafka

```properties
spring.kafka.producer.value-serializer=org.springframework.kafka.support.serializer.JsonSerializer
```

Consumer :

```properties
spring.kafka.consumer.value-deserializer=org.springframework.kafka.support.serializer.JsonDeserializer
```

## Flux

```text
MediaEvent
   ↓
Serializer
   ↓
bytes
   ↓
Kafka
   ↓
Deserializer
   ↓
MediaEvent
```

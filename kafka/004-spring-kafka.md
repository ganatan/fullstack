# spring-kafka.md

# Spring Boot + Kafka

Objectif :
envoyer et recevoir un message Kafka depuis Spring Boot.

---

## Dépendance Maven

```xml
<dependency>
  <groupId>org.springframework.kafka</groupId>
  <artifactId>spring-kafka</artifactId>
</dependency>
```

---

## application.properties

```properties
spring.kafka.bootstrap-servers=localhost:9092
spring.kafka.consumer.group-id=media-group
spring.kafka.consumer.auto-offset-reset=earliest
spring.kafka.consumer.key-deserializer=org.apache.kafka.common.serialization.StringDeserializer
spring.kafka.consumer.value-deserializer=org.apache.kafka.common.serialization.StringDeserializer
spring.kafka.producer.key-serializer=org.apache.kafka.common.serialization.StringSerializer
spring.kafka.producer.value-serializer=org.apache.kafka.common.serialization.StringSerializer
```

---

## application.yml

```yml
spring:
  kafka:
    bootstrap-servers: localhost:9092

    consumer:
      group-id: media-group
      auto-offset-reset: earliest
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.apache.kafka.common.serialization.StringDeserializer

    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.apache.kafka.common.serialization.StringSerializer

    listener:
      missing-topics-fatal: false
```

---

## Producer

```java
@Service
public class KafkaProducerService {

 private final KafkaTemplate<String, String> kafkaTemplate;

 public KafkaProducerService(KafkaTemplate<String, String> kafkaTemplate) {
  this.kafkaTemplate = kafkaTemplate;
 }

 public void send(String topic, String message) {
  kafkaTemplate.send(topic, message);
 }
}
```

---

## Consumer

```java
@Component
public class KafkaConsumerService {

 @KafkaListener(topics = "media-events", groupId = "media-group")
 public void listen(String message) {
  System.out.println(message);
 }
}
```

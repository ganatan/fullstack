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
package com.ganatan.mediaapi.kafka;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducerService {

  private final KafkaTemplate<String, String> kafkaTemplate;

  public KafkaProducerService(KafkaTemplate<String, String> kafkaTemplate) {
    this.kafkaTemplate = kafkaTemplate;
  }

  public void send(String message) {
    kafkaTemplate.send("media-events", message);
  }
}
```

---

## Controller

```java
package com.ganatan.mediaapi.kafka;

import com.ganatan.mediaapi.domain.MediaEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/kafka")
public class KafkaController {

  private final KafkaProducerService producer;

  public KafkaController(KafkaProducerService producer) {
    this.producer = producer;
  }

  @GetMapping
  public Map<String, Object> getAll() {
    String message = "Kafka Send Message on Get";
    producer.send( message);
    return Map.of(
      "kafka", "send message"
    );
  }

  @PostMapping
  public void send(@RequestBody String message) {
    producer.send(message);
  }
}
```

## Commande POST

```bash
curl -X POST "http://localhost:3000/kafka?topic=media-events&key=1" \
  -H "Content-Type: text/plain" \
  -d "hello"
```

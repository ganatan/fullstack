# 004-spring-kafka-payload.md

# Spring Boot + Kafka — publier un payload JSON (ObjectMapper)

Objectif :
- exposer un endpoint HTTP de test
- publier un message Kafka en JSON
- contrôler `topic` + `key`
- garder le code minimal

---

## 1) Pré-requis

### Kafka local
Broker dev :
- `localhost:9092`

Topic de test recommandé :
- `media-events`

### Dépendance Maven
```xml
<dependency>
  <groupId>org.springframework.kafka</groupId>
  <artifactId>spring-kafka</artifactId>
</dependency>
```

---

## 2) Configuration minimale

### application.yml
```yaml
spring:
  kafka:
    bootstrap-servers: localhost:9092
```

---

## 3) Producer JSON

Le producer sérialise l’objet Java en JSON via `ObjectMapper` puis envoie un `String` au broker.

### KafkaProducerService.java
```java
package com.ganatan.mediaapi.kafka;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducerService {

  private final KafkaTemplate<String, String> kafkaTemplate;
  private final ObjectMapper objectMapper;

  public KafkaProducerService(KafkaTemplate<String, String> kafkaTemplate, ObjectMapper objectMapper) {
    this.kafkaTemplate = kafkaTemplate;
    this.objectMapper = objectMapper;
  }

  public void sendJson(String topic, String key, Object event) {
    try {
      String json = objectMapper.writeValueAsString(event);
      kafkaTemplate.send(topic, key, json);
    } catch (JsonProcessingException e) {
      throw new RuntimeException(e);
    }
  }
}
```

---

## 4) Controller HTTP de test (publish + ping)

- `POST /kafka/publish` : publie le body JSON vers un topic choisi
- `POST /kafka/ping` : publie un message de test sur `media-events`

### KafkaController.java
```java
package com.ganatan.mediaapi.kafka;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/kafka")
public class KafkaController {

  private final KafkaProducerService producer;

  public KafkaController(KafkaProducerService producer) {
    this.producer = producer;
  }

  @PostMapping("/publish")
  @ResponseStatus(HttpStatus.ACCEPTED)
  public Map<String, Object> publish(
      @RequestParam String topic,
      @RequestParam(required = false) String key,
      @RequestBody Object payload
  ) {
    String messageKey = key != null ? key : UUID.randomUUID().toString();
    producer.sendJson(topic, messageKey, payload);
    return Map.of(
        "topic", topic,
        "key", messageKey,
        "status", "published"
    );
  }

  @PostMapping("/ping")
  @ResponseStatus(HttpStatus.ACCEPTED)
  public Map<String, Object> ping(
      @RequestParam(defaultValue = "media-events") String topic,
      @RequestParam(required = false) String key
  ) {
    String messageKey = key != null ? key : "ping";
    producer.sendJson(topic, messageKey, Map.of(
        "eventType", "Ping",
        "eventId", UUID.randomUUID().toString(),
        "occurredAt", Instant.now().toString()
    ));
    return Map.of(
        "topic", topic,
        "key", messageKey,
        "status", "published"
    );
  }
}
```

---

## 5) Tests (curl)

### 5.1 Ping
```bash
curl -X POST "http://localhost:3000/kafka/ping"
```

### 5.2 Publish JSON sur `media-events` avec key=1
```bash
curl -X POST "http://localhost:3000/kafka/publish?topic=media-events&key=1" \
  -H "Content-Type: application/json" \
  -d "{\"type\":\"MediaCreated\",\"id\":1,\"name\":\"Inception\",\"release_date\":\"2010-07-16\"}"
```

### 5.3 Publish JSON sur un autre topic (key auto)
```bash
curl -X POST "http://localhost:3000/kafka/publish?topic=test-events" \
  -H "Content-Type: application/json" \
  -d "{\"hello\":\"world\"}"
```

---

## 6) Format de message recommandé (pour `media-api`)

Pour un flux CQRS (PostgreSQL write → Kafka → Mongo read), utiliser une enveloppe versionnée :

```json
{
  "eventId": "uuid",
  "eventType": "MediaCreated",
  "occurredAt": "2026-01-01T10:00:00Z",
  "correlationId": "uuid",
  "aggregateId": "1",
  "version": "v1",
  "payload": {
    "id": 1,
    "name": "Inception",
    "release_date": "2010-07-16"
  }
}
```

Recommandations :
- topic : `media-events`
- key : `aggregateId` (ex: "1") pour garder l’ordre par média
- payload : uniquement les champs nécessaires pour la projection MongoDB

---

## 7) À garder en tête (prod)

- Kafka délivre typiquement at-least-once → le consumer Mongo doit être idempotent (upsert sur `_id=mediaId`)
- cohérence DB + Kafka : plus tard, passer par un Outbox pattern si nécessaire

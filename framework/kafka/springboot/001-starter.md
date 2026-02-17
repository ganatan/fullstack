# 001-starter.md — Kafka (Spring Boot 3.5 / Java 21) — Starter

## Objectif

- Exposer 3 endpoints HTTP pour publier dans Kafka
  - `GET /kafka` : envoi brut (string)
  - `GET /kafka/model` : envoi événement standard (enveloppe)
  - `GET /kafka/media` : envoi événement métier MediaCreated (projection Mongo)

Topic utilisé : `media.events.v1`

---

## Prérequis

- Java 21
- Spring Boot 3.5.x
- Docker + Docker Compose
- Kafka accessible sur `localhost:9092`

---

## Docker (Kafka + Kafka UI)

### Fichiers

```
docker/compose.kafka.yml
scripts/kafka-up.bat
```

### scripts/kafka-up.bat

```bat
@echo off
docker compose -f docker\compose.kafka.yml up -d
```

### docker/compose.kafka.yml

```yml
services:
  kafka:
    image: confluentinc/cp-kafka:7.6.1
    container_name: ganatan-kafka
    ports:
      - "9092:9092"
      - "29092:29092"
    environment:
      CLUSTER_ID: MkU3OEVBNTcwNTJENDM2Qk
      KAFKA_NODE_ID: 1
      KAFKA_PROCESS_ROLES: broker,controller
      KAFKA_CONTROLLER_QUORUM_VOTERS: 1@kafka:9093
      KAFKA_CONTROLLER_LISTENER_NAMES: CONTROLLER
      KAFKA_LISTENERS: PLAINTEXT://kafka:29092,PLAINTEXT_HOST://0.0.0.0:9092,CONTROLLER://kafka:9093
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:29092,PLAINTEXT_HOST://localhost:9092
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT,CONTROLLER:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: PLAINTEXT
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: 1
      KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: 1
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 0

  kafka-ui:
    image: provectuslabs/kafka-ui:latest
    container_name: ganatan-kafka-ui
    ports:
      - "8085:8080"
    environment:
      KAFKA_CLUSTERS_0_NAME: local
      KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS: kafka:29092
    depends_on:
      - kafka
```

### Démarrage

```bat
scripts\kafka-up.bat
```

Kafka UI :
- http://localhost:8085

---

## Dépendance Maven

```xml
<dependency>
  <groupId>org.springframework.kafka</groupId>
  <artifactId>spring-kafka</artifactId>
</dependency>
```

---

## Configuration (application.properties)

```properties
spring.kafka.bootstrap-servers=localhost:9092

spring.kafka.producer.key-serializer=org.apache.kafka.common.serialization.StringSerializer
spring.kafka.producer.value-serializer=org.apache.kafka.common.serialization.StringSerializer

spring.kafka.consumer.key-deserializer=org.apache.kafka.common.serialization.StringDeserializer
spring.kafka.consumer.value-deserializer=org.apache.kafka.common.serialization.StringDeserializer
spring.kafka.consumer.group-id=ganatan-group

app.kafka.consumer.enabled=false
```

---

## Code — Controller de test

`src/main/java/com/ganatan/starter/api/kafka/KafkaController.java`

```java
package com.ganatan.starter.api.kafka;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class KafkaController {

    private static final String TOPIC = "media.events.v1";

    private final KafkaTemplate<String, String> kafkaTemplate;

    public KafkaController(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @GetMapping("/kafka")
    public Map<String, Object> kafka() {
        kafkaTemplate.send(TOPIC, "test-key", "message");
        return Map.of("topic", TOPIC, "sent", true, "type", "raw");
    }

    @GetMapping("/kafka/model")
    public Map<String, Object> kafkaModel() {
        String key = "test-key";
        String json = """
            {
              "eventId": "%s",
              "eventType": "TestEvent",
              "schemaVersion": 1,
              "occurredAt": "%s",
              "producer": "starter-api",
              "payload": {
                "message": "hello"
              }
            }
            """.formatted(UUID.randomUUID(), Instant.now().toString());

        kafkaTemplate.send(TOPIC, key, json);

        return Map.of(
            "topic", TOPIC,
            "key", key,
            "sent", true,
            "type", "model"
        );
    }

    @GetMapping("/kafka/media")
    public Map<String, Object> kafkaMedia() {
        String key = "1001";
        String json = """
            {
              "eventId": "%s",
              "eventType": "MediaCreated",
              "schemaVersion": 1,
              "occurredAt": "%s",
              "producer": "media-api",
              "payload": {
                "id": 1001,
                "name": "Alien",
                "release_date": "1979-05-25"
              }
            }
            """.formatted(UUID.randomUUID(), Instant.now().toString());

        kafkaTemplate.send(TOPIC, key, json);

        return Map.of(
            "topic", TOPIC,
            "key", key,
            "sent", true,
            "type", "media"
        );
    }
}
```

---

## Contrat des messages

### 1) `/kafka` (raw)

- key : `test-key`
- value : `message`

### 2) `/kafka/model` (enveloppe standard)

- key : `test-key`
- value : JSON

Champs:
- `eventId` : UUID
- `eventType`
- `schemaVersion`
- `occurredAt`
- `producer`
- `payload`

### 3) `/kafka/media` (événement métier)

- key : `1001`
- value : JSON

Champs payload:
- `id`
- `name`
- `release_date`

---

## Tests

### Appel HTTP

```bash
curl -s http://localhost:3000/kafka
curl -s http://localhost:3000/kafka/model
curl -s http://localhost:3000/kafka/media
```

---

## Lecture console (optionnel)

```bash
kafka-console-consumer --bootstrap-server localhost:9092 --topic media.events.v1 --from-beginning --property print.key=true --property key.separator=" | "
```

---

## Projection Mongo (cible)

Collection `media` (exemple):

```json
{
  "_id": 1001,
  "name": "Alien",
  "release_date": "1979-05-25",
  "updatedAt": "2026-02-17T12:34:56.789Z"
}
```

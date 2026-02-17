# 008-scripts-kafka.md

# Scripts Kafka (Docker Compose) + scripts Windows

Structure :

```
004-SPRINGBOOT-KAFKA/
├─ docker/
│  └─ compose.kafka.yml
└─ scripts/
   ├─ kafka-up.bat
   ├─ kafka-down.bat
   ├─ kafka-clean.bat
   ├─ kafka-ps.bat
   ├─ kafka-logs-kafka.bat
   ├─ kafka-logs-ui.bat
   ├─ kafka-open-ui.bat
   └─ kafka-shell.bat
```

------------------------------------------------------------------------

# Docker Compose

## docker/compose.kafka.yml

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

------------------------------------------------------------------------

---

## Vérification

Kafka UI :
http://localhost:8085

Broker (pour apps hors Docker) :
localhost:9092

Spring Boot (dev local) :
```properties
spring.kafka.bootstrap-servers=localhost:9092
```

---

# Scripts Windows

## scripts/kafka-up.bat

```bat
@echo off
docker compose -f docker\compose.kafka.yml up -d
pause
```

## scripts/kafka-down.bat

```bat
@echo off
docker compose -f docker\compose.kafka.yml down
pause
```

## scripts/kafka-clean.bat

```bat
@echo off
docker compose -f docker\compose.kafka.yml down -v --remove-orphans
pause
```

## scripts/kafka-ps.bat

```bat
@echo off
docker compose -f docker\compose.kafka.yml ps
pause
```

## scripts/kafka-logs-kafka.bat

```bat
@echo off
docker compose -f docker\compose.kafka.yml logs -f --tail=200 kafka
pause
```

## scripts/kafka-logs-ui.bat

```bat
@echo off
docker compose -f docker\compose.kafka.yml logs -f --tail=200 kafka-ui
pause
```

## scripts/kafka-open-ui.bat

```bat
@echo off
start http://localhost:8085
```

## scripts/kafka-shell.bat

```bat
@echo off
docker exec -it ganatan-kafka bash
```

------------------------------------------------------------------------

# Workflow

Démarrer :

```bash
scripts\kafka-up.bat
scripts\kafka-ps.bat
scripts\kafka-open-ui.bat
```

Logs :

```bash
scripts\kafka-logs-kafka.bat
scripts\kafka-logs-ui.bat
```

Arrêter :

```bash
scripts\kafka-down.bat
```

Reset complet :

```bash
scripts\kafka-clean.bat
```

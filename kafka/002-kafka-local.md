# 002-kafka-local.md

# Kafka en local (Docker)

Objectif :
Démarrer Kafka en local pour le développement et les tests du service `media-api`.

---

## Fichier

infra/kafka/compose.yml

---

## compose.yml

services:
  zookeeper:
    image: confluentinc/cp-zookeeper:7.5.0
    container_name: ganatan-zookeeper
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
    ports:
      - "2181:2181"

  kafka:
    image: confluentinc/cp-kafka:7.5.0
    container_name: ganatan-kafka
    depends_on:
      - zookeeper
    ports:
      - "9092:9092"
      - "29092:29092"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_LISTENERS: PLAINTEXT://0.0.0.0:9092,PLAINTEXT_DOCKER://0.0.0.0:29092
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092,PLAINTEXT_DOCKER://kafka:29092
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_DOCKER:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: PLAINTEXT
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
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

---

## Démarrage

Depuis la racine du projet :

docker compose -f infra/kafka/compose.yml up -d

---

## Arrêt

docker compose -f infra/kafka/compose.yml down

---

## Vérification

Kafka UI :
http://localhost:8085

Broker local :
localhost:9092

Bootstrap server Spring Boot :
spring.kafka.bootstrap-servers=localhost:9092

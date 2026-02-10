# 002-kafka-local.md

# Kafka en local (Docker) — 2 variantes : Zookeeper ou KRaft

Objectif :
Démarrer Kafka en local pour le développement et les tests du service `media-api`.

Principe :
- **Les producteurs/consommateurs** se connectent au **broker Kafka** via un *bootstrap server* (ex: `localhost:9092`).
- **Zookeeper vs KRaft** ne change pas l’URL côté client : ça change uniquement **l’architecture interne** du cluster Kafka.

---

## Choix rapide

### Prendre Zookeeper si…
- tu veux coller à des clusters historiques (beaucoup d’entreprises en ont encore)
- tu veux comprendre l’architecture “legacy” Kafka
- tu réutilises des scripts/compose existants ZK

### Prendre KRaft si…
- tu veux une stack moderne (Kafka “sans Zookeeper”)
- tu veux moins de composants à opérer
- tu démarres un nouveau projet pédagogique long terme

---

## Règle d’accès (très important)

Ton compose expose **deux endpoints** :
- `localhost:9092` → pour les applis **hors Docker** (IDE, `mvn spring-boot:run`)
- `kafka:29092` → pour les applis **dans Docker** (kafka-ui, services dockerisés)

Donc :
- Spring Boot lancé sur ta machine : `spring.kafka.bootstrap-servers=localhost:9092`
- Spring Boot dockerisé sur le même network : `spring.kafka.bootstrap-servers=kafka:29092`

---

# Version A — Kafka + Zookeeper (classique)

## Fichier
`infra/kafka/compose.zookeeper.yml`

## compose.zookeeper.yml
```yaml
services:
  zookeeper:
    image: confluentinc/cp-zookeeper:7.5.0
    container_name: ganatan-zookeeper
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
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
```

---

# Version B — Kafka KRaft (sans Zookeeper)

## Fichier
`infra/kafka/compose.kraft.yml`

## compose.kraft.yml
```yaml
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

---

## Démarrage / Arrêt

### Démarrer Zookeeper
```bash
docker compose -f infra/kafka/compose.zookeeper.yml up -d
```

### Démarrer KRaft
```bash
docker compose -f infra/kafka/compose.kraft.yml up -d
```

### Arrêter (dans les deux cas)
```bash
docker compose -f infra/kafka/compose.zookeeper.yml down
```
ou
```bash
docker compose -f infra/kafka/compose.kraft.yml down
```

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

## En connaissance de cause

- **Côté application** (producer/consumer), tu gardes **la même config** (`localhost:9092` en dev local).
- **Côté infra**, tu choisis :
  - Zookeeper : plus “legacy”, 1 composant en plus
  - KRaft : plus moderne, plus simple, recommandé pour nouveaux clusters

Recommandation pour un repo pédagogique long terme : **KRaft**.

# Idempotence Producer

L'idempotence du producer évite que les retries créent plusieurs copies du même message dans une partition.
Kafka utilise des identifiants et des numéros de séquence pour détecter les doublons côté producer.

## Configuration

```properties
spring.kafka.producer.properties.enable.idempotence=true
```

Avec les versions modernes de Kafka, l'idempotence peut être activée automatiquement selon la configuration.

## Scénario

```text
Producer
   ↓
message envoyé
   ↓
ACK perdu
   ↓
retry
```

Sans protection, un doublon peut apparaître.

Avec l'idempotence :

```text
Kafka détecte le retry
        ↓
pas de duplication liée à cet envoi
```

Cela ne remplace pas l'idempotence métier du consumer.

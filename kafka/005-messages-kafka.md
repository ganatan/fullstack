# 005-messages-kafka.md

# Messages Kafka — format technique et exemple `media-api` → consumer MongoDB

Objectif :  
Décrire précisément le **format d’un message Kafka** (clé, valeur, headers, partition, offset, sérialisation) et illustrer un flux simple :
- `media-api` écrit `id`, `name`, `release_date` dans PostgreSQL (table `media`)
- `media-api` publie un événement Kafka
- un consumer (futur `media-worker`) consomme l’événement et écrit une projection dans MongoDB

---

## 1) Ce qu’est un message Kafka

Un message Kafka (un record) est un tuple :

- topic : canal logique (ex: `media-events`)
- partition : sous-flux ordonné (0..N-1)
- offset : position du record dans la partition (monotone croissant)
- timestamp : temps associé au record (create time ou log append time)
- key (optionnelle) : utilisée pour le partitionnement et l’ordering par clé
- value : le payload (String/JSON/Avro/Protobuf…)
- headers (optionnels) : métadonnées (correlationId, eventType, version, trace…)

Kafka garantit :
- ordre dans une partition
- distribution sur partitions (scalabilité)
- relecture via offsets (consumer groups)

---

## 2) La clé (key) : à quoi elle sert

La key détermine en général la partition via un hash.

Recommandation :
- utiliser une key stable liée à l’entité, ex : `mediaId`
- ainsi, tous les événements d’un même `mediaId` vont dans la même partition
- donc l’ordre des événements pour ce media est garanti

Exemple :
- key = "123"
- value = événement JSON `MediaCreated`

---

## 3) La valeur (value) : format du payload

La value est un tableau d’octets côté Kafka. Le “format” dépend de ta sérialisation.

### 3.1 String (démo simple)
Le payload est une chaîne, ex : "hello".

Avantage :
- ultra simple

Inconvénient :
- pas de structure
- pas de versioning
- pas de contrat stable

### 3.2 JSON (recommandé pour un projet pédagogique)
Le payload est du JSON. Exemple :

```json
{
  "eventType": "MediaCreated",
  "eventVersion": 1,
  "eventId": "2f7c6b3f-2c7a-4d7d-b5c4-4a1b6f10b3b2",
  "occurredAt": "2026-02-10T09:00:00Z",
  "data": {
    "id": 123,
    "name": "Alien",
    "releaseDate": "1979-05-25"
  }
}
```

Avantages :
- lisible
- facile à débugger (Kafka UI)
- compatible multi-technos

Inconvénients :
- pas de schéma strict
- attention à l’évolution (ajouts de champs OK, suppressions/renommages à éviter)

### 3.3 Avro/Protobuf (contrat fort, enterprise)
Payload binaire + schéma (Schema Registry).  
Avantages :
- compatibilité contrôlée
- taille réduite
- évolution maîtrisée

---

## 4) Headers : métadonnées utiles

Tu peux mettre (souvent) en headers :
- eventType
- eventVersion
- correlationId
- traceparent (OpenTelemetry)
- producer (service name)

Les headers évitent de parser la value pour router/filtrer.

---

## 5) Consumer group et offsets

Un consumer appartient à un groupId. Règles :
- un message (partition) est lu par un seul consumer du groupe
- si tu scales le consumer (N instances) Kafka répartit les partitions

Offsets :
- l’offset est le “curseur” du groupe sur chaque partition
- commit d’offset = “j’ai traité jusqu’ici”

---

# 6) Exemple : `media-api` PostgreSQL + événement Kafka

## 6.1 Modèle PostgreSQL (table `media`)

Colonnes :
- id (PK)
- name
- release_date

## 6.2 Flux logique

1. `media-api` reçoit la commande HTTP (ex: POST /media)
2. `media-api` écrit en base PostgreSQL la ligne `media`
3. `media-api` publie un événement `MediaCreated` sur `media-events`

La base PostgreSQL est le write model. Kafka transporte l’événement pour construire des projections (read model) ailleurs.

---

## 6.3 Producer actuel (String)
Ton producer publie une value String sur le topic `media-events` :

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

Avec ce producer, tu peux publier un JSON “à la main” (String JSON), ex :

```json
{"eventType":"MediaCreated","eventVersion":1,"data":{"id":123,"name":"Alien","releaseDate":"1979-05-25"}}
```

---

# 7) Consumer MongoDB (projection)

Objectif :
- consommer `MediaCreated`
- écrire une projection MongoDB (read model)

Exemple de document MongoDB `media_view` :

```json
{
  "_id": 123,
  "name": "Alien",
  "releaseDate": "1979-05-25",
  "updatedAt": "2026-02-10T09:00:00Z"
}
```

Règles côté consumer :
- idempotence : si l’event est rejoué, l’écriture doit être sans doublon
  - stratégie simple : `_id = mediaId` puis upsert
- at-least-once : Kafka livre typiquement au moins une fois, donc idempotence obligatoire
- DLQ : à ajouter ensuite (topic `media-events-dlq`) pour erreurs non récupérables

---

## 8) Contrat de message recommandé (minimum)

Topic :
- media-events

Key :
- mediaId en String (ex: "123")

Value (JSON) :
- enveloppe stable avec version :
  - eventType
  - eventVersion
  - eventId
  - occurredAt
  - data

Pourquoi une enveloppe :
- plusieurs types d’événements dans le même topic
- versioning maîtrisé
- traçabilité

---

## 9) Note cohérence DB + Kafka

Risque :
- DB commit OK
- publish Kafka KO

Solution classique (plus tard) :
- Outbox pattern (table outbox en PostgreSQL + publisher)

---

## 10) Test rapide

```bash
curl -X POST "http://localhost:3000/kafka?topic=media-events&key=123"   -H "Content-Type: text/plain"   -d "{"eventType":"MediaCreated","eventVersion":1,"data":{"id":123,"name":"Alien","releaseDate":"1979-05-25"}}"
```

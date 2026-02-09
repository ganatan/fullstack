# 004-contract-definition-v1.md

## Contract Definition V1 — Media

Ce document formalise les contrats utilisés par la vertical slice V1.

La V1 repose sur trois contrats :
- API Command
- API Query
- Event Kafka

Ces contrats sont définis dans le repository `media-contracts`.

Le modèle de données de référence est :

Media
- id (bigint)
- name (string)
- release_date (date)

---

## Command API (write)

Endpoint :

POST /admin/media

Request :
- name (string)
- release_date (date)

Response :
- id (integer / int64)

Responsabilité :
permettre la création d’un Media dans le write model (PostgreSQL).

Le Media est persistant dans la table :
media

---

## Query API (read)

Endpoint :

GET /media/{id}

Response :
- id (integer / int64)
- name (string)
- release_date (date)

Responsabilité :
exposer le read-model depuis MongoDB.

---

## Event Kafka

Event :
MediaCreated.v1

Envelope :
- eventId
- eventType
- occurredAt
- correlationId
- aggregateId (media id)
- version
- payload

Payload :
- id (integer / int64)
- name (string)
- release_date (date)

Responsabilité :
propager la création d’un Media vers le projection-worker.

---

## Alignement des contrats

Les trois contrats doivent rester cohérents :

Command API → SQL → Event → Mongo → Query API

Les champs doivent être identiques entre :
- la table SQL media
- l’event payload
- le document Mongo
- la réponse Query API

Les champs techniques (creation_date, update_date) restent internes au write model.

---

## Résultat attendu

À la fin de cette étape :
- les contrats V1 sont définis
- ils correspondent à la vertical slice
- ils sont alignés avec PostgreSQL
- ils peuvent être versionnés (v1.0.0)
- ils servent de base à l’implémentation backend

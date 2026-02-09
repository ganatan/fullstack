# 003-contract-definition-v1.md

## Contract Definition V1 — Media

Ce document formalise les contrats utilisés par la vertical slice V1.

La V1 repose sur trois contrats :
- API Command
- API Query
- Event Kafka

Ces contrats sont définis dans le repository `media-contracts`.

---

## Command API (write)

Endpoint :

POST /admin/media

Request :
- name
- release_date

Response :
- id

Responsabilité :
permettre la création d’un Media dans le write model (PostgreSQL).

---

## Query API (read)

Endpoint :

GET /media/{id}

Response :
- id
- name
- release_date

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
- aggregateId
- version
- payload

Payload :
- id
- name
- release_date

Responsabilité :
propager la création d’un Media vers le projection-worker.

---

## Alignement des contrats

Les trois contrats doivent rester cohérents :

Command API → SQL → Event → Mongo → Query API

Les champs doivent être identiques entre :
- la table SQL
- l’event payload
- le document Mongo
- la réponse Query API

---

## Résultat attendu

À la fin de cette étape :
- les contrats V1 sont définis
- ils correspondent à la vertical slice
- ils peuvent être versionnés (v1.0.0)
- ils servent de base à l’implémentation backend

# 004-data-model-v1.md

## Data Model V1 — Media

Après la définition des contrats et de la vertical slice, l’étape suivante consiste à définir le modèle de données minimal nécessaire pour implémenter la V1.

Objectif :
supporter le cas d’usage :

Admin crée un Media → User consulte un Media

Sans sur‑modélisation.

---

## Modèle conceptuel (MCD V1)

Entité unique : Media

Attributs :
- id (UUID)
- name (string)
- release_date (date)

Ce modèle est volontairement minimal pour permettre la validation de l’architecture CQRS.

---

## Modèle SQL (write model)

Base : PostgreSQL  
Table : media

Colonnes :
- id UUID PRIMARY KEY
- name VARCHAR(200) NOT NULL
- release_date DATE NOT NULL
- created_at TIMESTAMP NOT NULL

Rôle :
la table `media` constitue la source de vérité transactionnelle.

---

## Read-model MongoDB

Collection : media_view

Document :
- _id (UUID)
- name
- release_date

Rôle :
optimiser la lecture côté query-service.

Le read-model est reconstruit à partir des événements Kafka.

---

## Event lié au modèle

Event :
MediaCreated.v1

Payload :
- id
- name
- release_date

Cet événement est publié par le command-service et consommé par le projection-worker.

---

## Principe architectural

Write model :
PostgreSQL → transactionnel → command-service

Event bus :
Kafka → MediaCreated.v1

Projection :
projection-worker → MongoDB

Read model :
query-service → MongoDB

---

## Résultat attendu

À la fin de cette étape :
- la structure SQL est définie
- la structure Mongo est définie
- l’événement est aligné avec le modèle
- le command-service peut être implémenté

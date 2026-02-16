# principes.md

# Kafka — Principes fondamentaux

Objectif :
comprendre simplement le fonctionnement de Kafka
avant de l’intégrer dans une application Spring Boot.

---

## Kafka en une phrase

Kafka est un journal d’événements distribué (event log)
permettant de publier et consommer des messages de manière asynchrone.

---

## Métaphore simple

RabbitMQ → boîte aux lettres  
Kafka → bibliothèque d’événements

RabbitMQ :
le message disparaît après lecture.

Kafka :
le message reste disponible pendant une durée définie (retention).

Plusieurs consumers peuvent lire le même événement.

---

## Concepts principaux

### Producer
Application qui publie un événement dans Kafka.

Exemple :
media-api publie MediaCreated.v1

---

### Consumer
Application qui lit les événements.

Exemple :
media-worker consomme MediaCreated.v1

---

### Topic
Canal logique contenant des événements.

Exemple :
media-events

---

### Partition
Subdivision d’un topic permettant le parallélisme.

Permet :
- scalabilité
- traitement concurrent
- ordering par clé

---

### Offset
Position de lecture d’un consumer dans un topic.

Chaque consumer group a son offset.

---

### Consumer Group
Groupe de consumers partageant la charge de lecture.

Exemple :
media-worker-group

---

## Architecture typique

media-api (producer)
        |
        v
      Kafka
        |
        v
media-worker (consumer)
        |
        v
     MongoDB

---

## Ports usuels en local

2181  Zookeeper (coordination)
9092  Kafka broker
8085  Kafka UI

---

## Pourquoi Kafka

- communication asynchrone
- découplage des services
- tolérance aux pannes
- relecture des événements
- scalabilité horizontale

---

## Résumé

Kafka est :
- un event log distribué
- un broker de messages durable
- une base de l’architecture event‑driven

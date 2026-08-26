# Topic

Un topic est une catégorie logique dans laquelle les messages Kafka sont publiés.
Les producers écrivent dans un topic et les consumers lisent ce topic.

## Principe

```text
Producer
   ↓
media-events
   ↓
Consumer
```

Un topic peut contenir plusieurs partitions.

## Création

```bash
kafka-topics.sh   --bootstrap-server localhost:9092   --create   --topic media-events   --partitions 3   --replication-factor 1
```

## Lister les topics

```bash
kafka-topics.sh   --bootstrap-server localhost:9092   --list
```

## Description

```bash
kafka-topics.sh   --bootstrap-server localhost:9092   --describe   --topic media-events
```

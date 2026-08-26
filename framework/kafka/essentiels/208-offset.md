# Offset

Un offset est la position d'un message dans une partition Kafka.
Chaque partition possède sa propre séquence d'offsets.

## Exemple

```text
Partition 0

offset 0
offset 1
offset 2
offset 3
```

L'offset permet au consumer de savoir jusqu'où il a lu.

## Important

```text
Topic
  ↓
Partition
  ↓
Offset
```

Un offset n'est donc pas global au topic.

Kafka stocke également les offsets validés par les consumer groups.

# Schema Registry

Un Schema Registry centralise les schémas utilisés par les messages Kafka.
Il permet de contrôler leur évolution et leur compatibilité entre producers et consumers.

## Principe

```text
Producer
   ↓
Schema
   ↓
Schema Registry
   ↓
Kafka
   ↓
Consumer
```

Formats souvent utilisés :

```text
Avro
JSON Schema
Protobuf
```

## Intérêt

Le schema permet de faire évoluer :

```json
{
  "id": 1,
  "name": "Alien"
}
```

sans casser automatiquement les consumers existants.

La compatibilité peut être contrôlée selon une stratégie définie.

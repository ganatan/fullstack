# Retention

Kafka conserve les messages même après leur consommation.
La durée ou la taille de conservation est configurable par topic.

## Principe

```text
message produit
   ↓
stocké
   ↓
consommé
   ↓
reste dans Kafka
```

## Conservation par durée

Exemple :

```properties
retention.ms=604800000
```

soit environ sept jours.

## Conservation par taille

```properties
retention.bytes=1073741824
```

Kafka supprimera progressivement les anciens segments lorsque les limites applicables sont dépassées.

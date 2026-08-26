# Retries

Les retries permettent de retenter une opération Kafka après un échec temporaire.
Ils doivent être configurés avec prudence afin d'éviter les boucles infinies et la surcharge.

## Producer

Un producer peut automatiquement réessayer un envoi.

```properties
spring.kafka.producer.retries=3
```

## Consumer

Pour un traitement métier :

```text
message
  ↓
échec
  ↓
retry
  ↓
retry
  ↓
succès ou DLT
```

## Bon principe

Les retries conviennent surtout aux erreurs temporaires :

```text
service indisponible
timeout
connexion réseau
```

Une erreur métier permanente doit généralement être dirigée vers une autre stratégie.

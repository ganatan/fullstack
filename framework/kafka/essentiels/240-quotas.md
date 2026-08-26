# Quotas

Les quotas Kafka limitent la quantité de ressources qu'un client peut consommer.
Ils évitent qu'un producer ou consumer très actif dégrade l'ensemble du cluster.

## Types

```text
producer byte rate
consumer byte rate
request rate
```

## Principe

```text
Client
  ↓
Quota
  ↓
Broker
```

Si le quota est dépassé :

```text
throttling
```

Kafka ralentit le client plutôt que de laisser saturer les brokers.

## Exemple

Configurer un quota producer pour un client :

```bash
kafka-configs.sh   --bootstrap-server localhost:9092   --alter   --add-config 'producer_byte_rate=1048576'   --entity-type clients   --entity-name media-api
```

## Utilité

```text
cluster multi-tenant
protection réseau
protection CPU
isolation des applications
```

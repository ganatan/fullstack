# ACL et Authentification

L'authentification vérifie l'identité d'un client Kafka et les ACL définissent ce qu'il peut faire.
La sécurité Kafka combine généralement TLS, SASL et autorisation par ressources.

## Authentification

Mécanismes possibles :

```text
SASL/PLAIN
SASL/SCRAM
SASL/GSSAPI
SASL/OAUTHBEARER
mTLS
```

## Autorisation

Une ACL définit :

```text
principal
opération
ressource
permission
```

Exemple conceptuel :

```text
User:media-api
ALLOW
WRITE
Topic:media-events
```

## Ajouter une ACL

```bash
kafka-acls.sh   --bootstrap-server localhost:9092   --add   --allow-principal User:media-api   --operation Write   --topic media-events
```

## Lister

```bash
kafka-acls.sh   --bootstrap-server localhost:9092   --list
```

Les secrets ne doivent jamais être stockés directement dans Git.

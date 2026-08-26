# Acknowledgements

`acks` définit le niveau de confirmation attendu par le producer après l'envoi d'un message.
Le choix influence directement performance et durabilité.

## acks=0

```text
Producer → Broker
```

Le producer n'attend aucune confirmation.

## acks=1

Le leader confirme l'écriture.

```text
Producer → Leader → ACK
```

## acks=all

Les replicas synchronisées doivent confirmer selon la configuration du cluster.

```properties
spring.kafka.producer.acks=all
```

Pour des données importantes, `acks=all` est généralement le choix le plus sûr.

# Commit des offsets

Le commit indique jusqu'à quelle position un consumer group considère les messages comme traités.
Un mauvais moment de commit peut provoquer pertes ou retraitements.

## Principe

```text
lecture
  ↓
traitement
  ↓
commit offset
```

## Commit automatique

```properties
spring.kafka.consumer.enable-auto-commit=true
```

## Commit contrôlé

Dans de nombreux traitements métier, il est préférable que l'offset soit validé après réussite du traitement.

```text
Message reçu
   ↓
Traitement réussi
   ↓
Offset validé
```

Si le consumer tombe avant le commit, le message peut être relu.

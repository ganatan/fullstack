# Log Compaction

La log compaction conserve principalement la dernière valeur connue pour chaque clé.
Elle est adaptée aux topics représentant un état courant plutôt qu'un historique complet.

## Exemple

```text
key=1 value=A
key=1 value=B
key=1 value=C
```

Après compaction, Kafka peut conserver principalement :

```text
key=1 value=C
```

## Configuration

```properties
cleanup.policy=compact
```

## Cas d'usage

```text
état utilisateur
configuration
cache distribué
dernier état d'une entité
```

La compaction n'est pas instantanée.

# Dead Letter Topic

Un Dead Letter Topic reçoit les messages qui ne peuvent pas être traités après plusieurs tentatives.
Il évite qu'un message défectueux bloque durablement le flux principal.

## Principe

```text
media-events
     ↓
Consumer
     ↓
échec répété
     ↓
media-events.DLT
```

## Exemple Spring Kafka

```java
@Bean
DefaultErrorHandler errorHandler(
    KafkaTemplate<Object, Object> template
) {
  DeadLetterPublishingRecoverer recoverer =
      new DeadLetterPublishingRecoverer(
          template
      );

  return new DefaultErrorHandler(
      recoverer
  );
}
```

Le DLT doit être observé et traité, pas simplement ignoré.

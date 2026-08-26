# Kafka Streams

Kafka Streams est une bibliothèque Java permettant de traiter des flux Kafka directement dans une application.
Elle permet de filtrer, transformer, agréger et joindre des messages sans serveur de traitement séparé.

## Principe

```text
Topic IN
   ↓
Kafka Streams
   ↓
traitement
   ↓
Topic OUT
```

## Dépendance Maven

```xml
<dependency>
  <groupId>org.apache.kafka</groupId>
  <artifactId>kafka-streams</artifactId>
</dependency>
```

## Exemple

```java
StreamsBuilder builder =
    new StreamsBuilder();

KStream<String, String> stream =
    builder.stream(
        "media-events"
    );

stream
    .filter(
        (key, value) ->
            value.contains(
                "MEDIA_CREATED"
            )
    )
    .to(
        "media-created"
    );
```

## Cas d'usage

```text
filtrage
transformation
agrégation
jointure
fenêtrage
calcul temps réel
```

Kafka Streams fonctionne directement dans l'application Java.

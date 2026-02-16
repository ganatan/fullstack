# media-event.md

# Event MediaCreated.v1

Objectif :
définir l’événement publié par media-api et consommé par media-worker.

---

## Event name

MediaCreated.v1

---

## Envelope

```json
{
  "eventId": "uuid",
  "eventType": "MediaCreated",
  "occurredAt": "2026-01-01T10:00:00Z",
  "correlationId": "uuid",
  "aggregateId": "1",
  "version": "v1",
  "payload": {}
}
```

---

## Payload

```json
{
  "id": 1,
  "name": "Inception",
  "release_date": "2010-07-16"
}
```

---

## Topic recommandé

media-events

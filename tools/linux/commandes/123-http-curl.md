# HTTP et CURL

Commandes essentielles pour tester une API HTTP.

## Requête GET

```bash
curl http://localhost:3000
```

## Afficher les headers

```bash
curl -I http://localhost:3000
```

## Mode verbeux

```bash
curl -v http://localhost:3000
```

## GET API

```bash
curl http://localhost:3000/persons
```

## POST JSON

```bash
curl -X POST http://localhost:3000/persons \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Clint","lastName":"Eastwood","cityId":8}'
```

## DELETE

```bash
curl -X DELETE http://localhost:3000/persons/1
```

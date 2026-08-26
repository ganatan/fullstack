# HTTP Client

IntelliJ possède un client HTTP intégré pour tester des API REST.
Les requêtes peuvent être stockées dans des fichiers `.http`.

## Fichier

```text
api.http
```

## GET

```http
GET http://localhost:3000/persons
```

## POST

```http
POST http://localhost:3000/persons
Content-Type: application/json

{
  "firstName": "Clint",
  "lastName": "Eastwood",
  "cityId": 8
}
```

## Avantage

Les requêtes sont versionnables et réutilisables.

```text
curl
Postman
HTTP Client IntelliJ
```

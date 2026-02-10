# 001-installation.md

# Installation MongoDB (local Windows)

Guide rapide pour installer MongoDB Community Server, utiliser Compass et mongosh,
et effectuer les premières opérations CRUD.

---

# Installation

Télécharger MongoDB Community Server :
https://www.mongodb.com/try/download/community

Exemple :
mongodb-windows-x86_64-8.2.4-signed.msi

Installation :
- Complete
- Run service as Network Service user

Répertoires conseillés :
- Data : `D:\hal\MongoDB\Server\8.2\data\`
- Logs : `D:\hal\MongoDB\Server\8.2\log\`

---

# Principes

MongoDB est une base de données orientée documents.

Structure :
- Database
- Collection
- Document (JSON/BSON)

Exemple document :

```json
{
  "name": "Iron Man",
  "release_date": "2008-05-02",
  "movie": true,
  "boxoffice": 583000000.00
}
```

---

# Outils

## Compass
GUI MongoDB officielle.

Ajouter une connexion :

Sans authentification :
```
mongodb://localhost:27017
```

Avec authentification admin :
```
mongodb://admin:admin@localhost:27017/?authSource=admin
```

---

## mongosh

Shell officiel MongoDB.

---

# Création d'une collection

```javascript
use("ganatan")

db.createCollection("media_example", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "release_date", "movie"],
      properties: {
        name: { bsonType: "string" },
        release_date: { bsonType: "date" },
        movie: { bsonType: "bool" },
        boxoffice: { bsonType: "decimal" }
      }
    }
  }
})
```

---

# Suppression d'une collection

```javascript
use("ganatan")
db.media_example.drop()
```

---

# Vider une collection

```javascript
use("ganatan")
db.media_example.deleteMany({})
```

---

# Insertion

```javascript
use("ganatan")

db.media_example.insertOne({
  name: "Iron Man",
  release_date: new Date("2008-05-02"),
  movie: true,
  boxoffice: NumberDecimal("583000000.00")
})
```

---

# Requêtes

## Par nom
```javascript
db.media_example.find({ name: "Iron Man" })
db.media_example.find({ name: { $regex: "^iron", $options: "i" } })
```

## Par date
```javascript
db.media_example.find({ release_date: new Date("2008-05-02") })
db.media_example.find({
  release_date: {
    $gte: new Date("2008-01-01"),
    $lt: new Date("2009-01-01")
  }
})
```

## Booléen
```javascript
db.media_example.find({ movie: true })
db.media_example.find({ movie: false })
```

## Decimal
```javascript
db.media_example.find({ boxoffice: NumberDecimal("583000000.00") })
db.media_example.find({ boxoffice: { $gt: NumberDecimal("500000000") } })
```

## Projection
```javascript
db.media_example.find({}, {
  projection: {
    _id: 0,
    name: 1,
    release_date: 1,
    movie: 1,
    boxoffice: 1
  }
})
```

## Tri
```javascript
db.media_example.find().sort({ release_date: 1 })
db.media_example.find().sort({ boxoffice: -1 })
```

---

# Résumé

MongoDB :
- stocke des documents JSON
- collections sans schéma strict (optionnel via validator)
- très adapté aux read models et projections CQRS

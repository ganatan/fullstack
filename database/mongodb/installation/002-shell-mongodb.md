# 002-shell-mongodb.md

# mongosh — base backend_media + données minimales

------------------------------------------------------------------------

# Connexion

    mongosh

Ou :

    mongosh "mongodb://localhost:27017"

------------------------------------------------------------------------

# Base

```javascript
use("backend_media")
```

------------------------------------------------------------------------

# Collections

```javascript
db.createCollection("country")
db.createCollection("city")
db.createCollection("person")
db.createCollection("media")
```

------------------------------------------------------------------------

# Index

```javascript
db.country.createIndex({ countryId: 1 }, { unique: true })
db.city.createIndex({ cityId: 1 }, { unique: true })
db.person.createIndex({ personId: 1 }, { unique: true })
db.media.createIndex({ mediaId: 1 }, { unique: true })
db.media.createIndex({ releaseYear: -1 })
```

------------------------------------------------------------------------

# Données (seed)

```javascript
db.country.insertOne({ countryId: 1000, code: "FR", name: "France" })

db.city.insertOne({
  cityId: 1000,
  name: "Paris",
  country: { countryId: 1000, code: "FR", name: "France" }
})

db.person.insertOne({
  personId: 1000,
  name: "Christopher Nolan",
  city: { cityId: 1000, name: "Paris", country: { countryId: 1000, code: "FR", name: "France" } }
})

db.media.insertOne({
  mediaId: 1000,
  name: "Inception",
  releaseYear: 2010,
  persons: [{ personId: 1000, name: "Christopher Nolan" }]
})
```

------------------------------------------------------------------------

# Lecture

```javascript
db.media.find()
db.media.find({ mediaId: 1000 })
db.media.find().sort({ releaseYear: -1 })
```

------------------------------------------------------------------------

# Reset

```javascript
db.media.deleteMany({})
db.person.deleteMany({})
db.city.deleteMany({})
db.country.deleteMany({})
```

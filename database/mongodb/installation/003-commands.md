# 003-commands.md

# MongoDB mongosh --- Collection media_read

Documentation des commandes principales pour manipuler la collection
`media_read` utilisée comme read model dans l'architecture Ganatan.

------------------------------------------------------------------------

# Connexion

    mongosh

    use("media")

------------------------------------------------------------------------

# Création de la collection

    db.createCollection("media_read")

------------------------------------------------------------------------

# Insertion

## insertOne

``` javascript
db.media_read.insertOne({
  mediaId: 1,
  title: "Inception",
  type: "MOVIE",
  releaseYear: 2010,
  persons: []
})
```

## insertMany

``` javascript
db.media_read.insertMany([
  { mediaId: 2, title: "Interstellar", type: "MOVIE", releaseYear: 2014 },
  { mediaId: 3, title: "Tenet", type: "MOVIE", releaseYear: 2020 }
])
```

------------------------------------------------------------------------

# Lecture

## find all

``` javascript
db.media_read.find()
```

## pretty

``` javascript
db.media_read.find().pretty()
```

## find by id

``` javascript
db.media_read.find({ mediaId: 1 })
```

## projection

``` javascript
db.media_read.find({}, { _id: 0, title: 1 })
```

------------------------------------------------------------------------

# Update

## updateOne

``` javascript
db.media_read.updateOne(
  { mediaId: 1 },
  { $set: { title: "Inception (Updated)" } }
)
```

## updateMany

``` javascript
db.media_read.updateMany(
  { type: "MOVIE" },
  { $set: { category: "Cinema" } }
)
```

------------------------------------------------------------------------

# Delete

## deleteOne

``` javascript
db.media_read.deleteOne({ mediaId: 1 })
```

## deleteMany

``` javascript
db.media_read.deleteMany({ type: "MOVIE" })
```

------------------------------------------------------------------------

# Vider la collection

``` javascript
db.media_read.deleteMany({})
```

------------------------------------------------------------------------

# Supprimer la collection

``` javascript
db.media_read.drop()
```

------------------------------------------------------------------------

# Index

## index simple

``` javascript
db.media_read.createIndex({ mediaId: 1 })
```

## index composé

``` javascript
db.media_read.createIndex({ type: 1, releaseYear: -1 })
```

------------------------------------------------------------------------

# Comptage

``` javascript
db.media_read.countDocuments()
```

------------------------------------------------------------------------

# Tri

``` javascript
db.media_read.find().sort({ releaseYear: -1 })
```

------------------------------------------------------------------------

# Résumé

Collection MongoDB utilisée comme projection CQRS.

media-worker → écrit dans media_read\
media-view → lit media_read

MongoDB sert uniquement de read model.

# 002-mongosh-media.md

# Utilisation de mongosh avec le domaine media

Guide rapide pour créer une base MongoDB, une collection de projection
`media_projection` et manipuler les données utilisées par `media-worker`
et `media-view`.

------------------------------------------------------------------------

# Connexion

Lancer le shell MongoDB :

    mongosh

Ou :

    mongosh "mongodb://localhost:27017"

------------------------------------------------------------------------

# Base media

Créer / sélectionner la base :

``` javascript
use("media")
```

MongoDB crée la base automatiquement au premier insert.

------------------------------------------------------------------------

# Collection media_projection

Collection utilisée comme **read model CQRS**.

``` javascript
db.createCollection("media_projection")
```

------------------------------------------------------------------------

# Insertion d'un media

Simulation d'un événement produit par `media-worker`.

``` javascript
db.media_projection.insertOne({
  mediaId: 1,
  title: "Inception",
  type: "MOVIE",
  releaseYear: 2010
})
```

------------------------------------------------------------------------

# Lecture des projections

Utilisé par `media-view`.

``` javascript
db.media_projection.find()
```

Version lisible :

``` javascript
db.media_projection.find().pretty()
```

------------------------------------------------------------------------

# Requêtes

## Par identifiant

``` javascript
db.media_projection.find({ mediaId: 1 })
```

## Par type

``` javascript
db.media_projection.find({ type: "MOVIE" })
```

## Tri

``` javascript
db.media_projection.find().sort({ releaseYear: -1 })
```

------------------------------------------------------------------------

# Mise à jour

``` javascript
db.media_projection.updateOne(
  { mediaId: 1 },
  { $set: { title: "Inception (Updated)" } }
)
```

------------------------------------------------------------------------

# Suppression

``` javascript
db.media_projection.deleteOne({ mediaId: 1 })
```

------------------------------------------------------------------------

# Vider la collection

``` javascript
db.media_projection.deleteMany({})
```

------------------------------------------------------------------------

# Supprimer la collection

``` javascript
db.media_projection.drop()
```

------------------------------------------------------------------------

# Architecture Ganatan media

Flux réel :

    frontend-admin → media-api → PostgreSQL
                                      ↓
                                    Kafka
                                      ↓
                                media-worker → MongoDB
                                      ↓
    frontend-user → media-view → MongoDB

MongoDB contient uniquement : - projections - read models - données
optimisées pour la lecture

Jamais la source de vérité.

------------------------------------------------------------------------

# Résumé

mongosh permet de : - créer une base - créer une collection - insérer
des projections - requêter MongoDB - tester rapidement un read model
CQRS


# Installation de Mongodb
  
  https://www.mongodb.com/try/download/community


  Télécharger la version "MongoDB Community Server".

  mongodb-windows-x86_64-8.2.1-signed.msi
  
    Complete
    Run service as Network Service user

    D:\hal\MongoDB\Server\8.2\data\
    D:\hal\MongoDB\Server\8.2\log\

# Principes
  Compass = GUI MongoDB    

  Clique Add new connection.
  Dans URI mets au choix:
    Sans auth: mongodb://localhost:27017
    Avec auth admin: mongodb://admin:admin@localhost:27017/?authSource=admin

# Utilitaires
  mongosh = le shell officiel de MongoDB.

# Creation d'une collection
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

# Suppression d'une collection
  use("ganatan")
  db.media_example.drop()

# Vider une collection
  use("ganatan")
  db.media_example.deleteMany({})  

# Insertion d'un record  
  use("ganatan")

  db.media_example.insertOne({
    name: "Iron Man",
    release_date: new Date("2008-05-02"),
    movie: true,
    boxoffice: NumberDecimal("583000000.00")
  })

# Recherche
  use("ganatan")

  db.media_example.find({ name: "Iron Man" })
  db.media_example.find({ name: { $regex: "^iron", $options: "i" } })

  db.media_example.find({ release_date: new Date("2008-05-02") })
  db.media_example.find({ release_date: { $gte: new Date("2008-01-01"), $lt: new Date("2009-01-01") } })

  db.media_example.find({ movie: true })
  db.media_example.find({ movie: false })

  db.media_example.find({ boxoffice: NumberDecimal("583000000.00") })
  db.media_example.find({ boxoffice: { $gt: NumberDecimal("500000000") } })

  db.media_example.find({}, { projection: { _id: 0, name: 1, release_date: 1, movie: 1, boxoffice: 1 } })
  db.media_example.find().sort({ release_date: 1 })
  db.media_example.find().sort({ boxoffice: -1 })


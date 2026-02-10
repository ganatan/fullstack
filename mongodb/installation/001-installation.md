# 001-installation.md

# Installation MongoDB (local Windows)

Guide rapide pour installer **MongoDB Community Server**, **MongoDB
Shell (mongosh)** et utiliser **MongoDB Compass** pour inspecter la
base.

------------------------------------------------------------------------

# Installation MongoDB Server

Télécharger MongoDB Community Server :
https://www.mongodb.com/try/download/community

Exemple :

    mongodb-windows-x86_64-8.2.4-signed.msi

Installation : - Complete - Run service as Network Service user

Répertoires conseillés :

    Data : D:\hal\MongoDB\Server\8.2\data\
    Logs : D:\hal\MongoDB\Server\8.2\log\

Vérifier que MongoDB fonctionne :

    net start MongoDB

MongoDB écoute par défaut sur :

    localhost:27017

------------------------------------------------------------------------

# Installation MongoDB Shell (mongosh)

Depuis MongoDB 6+, le shell est séparé du serveur.

Télécharger : https://www.mongodb.com/try/download/shell

Choisir :

    MongoDB Shell — Windows x64 MSI

Installation standard.

Vérification :

    mongosh

Résultat attendu :

    test>

Connexion explicite :

    mongosh "mongodb://localhost:27017"

------------------------------------------------------------------------

# Principes MongoDB

MongoDB est une base de données orientée documents.

Structure : - Database - Collection - Document (JSON/BSON)

Exemple document :

``` json
{
  "name": "Iron Man",
  "release_date": "2008-05-02",
  "movie": true,
  "boxoffice": 583000000
}
```

------------------------------------------------------------------------

# Outils MongoDB

## Compass

Interface graphique MongoDB.

Usage : - visualiser les bases - visualiser les collections - inspecter
les documents - tester des requêtes - debug

Connexion locale :

    mongodb://localhost:27017

Compass = inspection visuelle.

------------------------------------------------------------------------

## mongosh

Client CLI MongoDB.

Usage : - créer des bases - créer des collections - insérer des
documents - requêter - tester rapidement

Exemple :

``` javascript
use("media")

db.media_projection.insertOne({
  title: "Interstellar",
  type: "MOVIE"
})

db.media_projection.find()
```

mongosh = interaction directe avec la base.

------------------------------------------------------------------------

# Résumé

MongoDB Server\
→ moteur de base de données

mongosh\
→ shell de commande MongoDB

Compass\
→ interface graphique MongoDB

Dans une architecture CQRS : - worker écrit dans MongoDB - view lit
MongoDB - Compass sert au debug - mongosh sert aux tests rapides

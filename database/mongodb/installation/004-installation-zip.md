# Installation MongoDB Server

Télécharger MongoDB Community Server :
https://www.mongodb.com/try/download/community


selection version zip


Télécharger : https://www.mongodb.com/try/download/shell



# MongoDB sur Windows via ZIP

## Répertoires

- serveur MongoDB : `D:\hal\mongodb\mongodb\bin`
- shell MongoDB : `D:\hal\mongodb\mongosh\bin`

## 1. Décompresser les ZIP

- décompresser MongoDB Server dans `D:\hal\mongodb\mongodb`
- décompresser mongosh dans `D:\hal\mongodb\mongosh`

## 2. Créer le dossier de données

```bash
mkdir D:\hal\mongodb\data
```

## 3. Lancer le serveur MongoDB

```bash
cd /d D:\hal\mongodb\mongodb\bin
mongod.exe --dbpath D:\hal\mongodb\data
```

## 4. Lancer le client mongosh

Dans une autre fenêtre :

```bash
cd /d D:\hal\mongodb\mongosh\bin
mongosh.exe
```

## 5. Warnings au démarrage

- `Access control is not enabled` = pas d’authentification activée
- `bound to localhost` = accessible seulement depuis ton PC
- ce ne sont pas des erreurs bloquantes en local

## 6. Commandes MongoDB minimales

Créer ou utiliser la base :

```javascript
use("media")
```

Créer la collection :

```javascript
db.createCollection("media_read")
```

Écrire un document :

```javascript
db.media_read.insertOne({
  title: "Alien"
})
```

Lire les documents :

```javascript
db.media_read.find()
```

Lire avec filtre :

```javascript
db.media_read.find({ title: "Alien" })
```

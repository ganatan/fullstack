# 006-connections.md

# MongoDB — Connexions et suppression de connexions

## Objectif

Cette note résume comment :
- se connecter à MongoDB
- enregistrer une connexion dans MongoDB Compass
- se déconnecter
- supprimer une connexion enregistrée
- utiliser TLS avec un certificat local `certificat-example.crt`

---

## 1. Format général d’une connexion MongoDB

Format standard :

    mongodb://[username:password@]host1[:port1],host2[:port2],host3[:port3]/?options

Points importants :
- plusieurs hôtes peuvent être fournis pour un replica set
- si le port n’est pas précisé, MongoDB utilise `27017`
- les options se mettent après `?`
- plusieurs options sont séparées par `&`

Exemple simple replica set :

    mongodb://USERNAME:PASSWORD@mongo1:27017,mongo2:27017,mongo3:27017/?replicaSet=p0001

---

## 2. Caractères spéciaux dans le login ou le mot de passe

Si le username ou le password contient des caractères spéciaux, ils doivent être encodés en URL.

Exemples utiles :
- `%3A` = `:`
- `%40` = `@`
- `%2F` = `/`
- `%3F` = `?`
- `%5C` = `\`

Exemple :

    mongodb://user:MonMotDePasse%40123@mongo1:27017/?replicaSet=p0001

---

## 3. Nouvelle connexion dans MongoDB Compass

Dans MongoDB Compass :
- ouvrir **New Connection**
- coller l’URI MongoDB
- ouvrir si besoin les options avancées
- tester la connexion
- enregistrer la connexion si souhaité

Exemple d’URI :

    mongodb://USERNAME:PASSWORD@mongod-exemple1:27017,mongod-exemple2:27017,mongod-exemple3:27017/?replicaSet=p0001

---

## 4. Déconnexion d’une connexion active

Dans MongoDB Compass :

- ouvrir le menu de la connexion active
- cliquer sur **Disconnect**

---

## 5. Suppression d’une connexion enregistrée

Dans la sidebar des connexions de MongoDB Compass :
- survoler la connexion
- clic droit ou menu `...`
- choisir **Remove**

Attention :
- **Disconnect** ferme la session en cours
- **Remove** supprime la connexion enregistrée dans Compass
- ce n’est pas la même chose

---

## 6. Connexion avec TLS

MongoDB supporte l’option `tls=true` dans l’URI.

Exemple :

    mongodb://USERNAME:PASSWORD@mongod-exemple1:27017,mongod-exemple2:27017,mongod-exemple3:27017/?replicaSet=p0001&tls=true

---

## 7. Utilisation d’un certificat CA local

On peut utiliser un certificat local `certificat-example.crt`.

Chemin Windows :

    D:\hal\mongo\certificat-example.crt

Dans une URL, le chemin doit être encodé.

Encodage :
- `:` devient `%3A`
- `\` devient `%5C`

Donc :

    D%3A%5Chal%5Cmongo%5Ccertificat-example.crt

Exemple complet d’URI :

    mongodb://USERNAME:PASSWORD@mongod-exemple1:27017,mongod-exemple2:27017,mongod-exemple3:27017/?replicaSet=p0001&tls=true&tlsCAFile=D%3A%5Chal%5Cmongo%5Ccertificat-example.crt

---

## 8. Variante avec certificat client

MongoDB supporte aussi :
- `tlsCertificateKeyFile`
- `tlsCertificateKeyFilePassword`

Ces options servent au certificat client et à sa clé privée.

Elles ne remplacent pas `tlsCAFile`, qui sert à valider le certificat du serveur.

---

## 9. Exemples prêts à adapter

Sans TLS :

    mongodb://USER_RO:PASSWORD@mongod-exemple1:27017,mongod-exemple2:27017,mongod-exemple3:27017/?replicaSet=p0001

Avec TLS :

    mongodb://USER_RO:PASSWORD@mongod-exemple1:27017,mongod-exemple2:27017,mongod-exemple3:27017/?replicaSet=p0001&tls=true

Avec TLS + certificat CA local :

    mongodb://USER_RO:PASSWORD@mongod-exemple1:27017,mongod-exemple2:27017,mongod-exemple3:27017/?replicaSet=p0001&tls=true&tlsCAFile=D%3A%5Chal%5Cmongo%5Ccertificat-example.crt

---

## 10. Résumé simple

Pour se connecter :
- ouvrir MongoDB Compass
- créer une **New Connection**
- coller l’URI
- ajouter `replicaSet` si nécessaire
- ajouter `tls=true` si TLS est requis
- ajouter `tlsCAFile` si un certificat CA local est demandé
- tester puis enregistrer la connexion

Pour supprimer une connexion enregistrée :
- ouvrir le menu de la connexion dans la sidebar
- choisir **Remove**

Pour se déconnecter :
- ouvrir le menu de la connexion active
- choisir **Disconnect**
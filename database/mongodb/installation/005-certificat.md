# Certificat `.crt` dans MongoDB Compass

- Un fichier `.crt` est un **certificat** utilisé pour sécuriser une connexion TLS/SSL. 
- Dans **MongoDB Compass**, il sert souvent à faire confiance au serveur MongoDB. 
- Le cas le plus courant est un **certificat CA**. 
- Si l’entreprise utilise des certificats internes ou auto-signés, Compass peut en avoir besoin pour se connecter. 
- `exemple.crt` est donc probablement le certificat de confiance de l’environnement **exemple**.
- Ce fichier ne contient pas tes données MongoDB.
- Ce fichier n’est pas une base de données.
- Ce fichier sert à **valider l’identité du serveur**.
- Sans ce certificat, Compass peut refuser la connexion TLS. 
- En pratique, dans Compass, on l’utilise dans les options **TLS / SSL**. 
- Résumé :
- `mongod` = serveur MongoDB
- `mongosh` = client en ligne de commande
- `Compass` = client graphique
- `exemple.crt` = certificat utilisé pour sécuriser la connexion

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


# Créer un certificat `.crt` et l’utiliser avec MongoDB

## Important

- pour du **dev local**, on peut utiliser un certificat auto-signé
- pour la **production**, il faut un certificat émis par une autorité de confiance
- MongoDB Compass peut utiliser un fichier `.crt` comme **CA certificate**
- un client MongoDB peut aussi utiliser un certificat client si l’infra l’exige

## 1. Créer un certificat auto-signé avec OpenSSL

Créer le certificat CA :

```bash
openssl req -x509 -nodes -sha256 -days 1825 -newkey rsa:4096 -keyout rootCA.key -out rootCA.crt -subj="/CN=ca.local"
```

Créer la clé et la demande de certificat du serveur :

```bash
openssl req -newkey rsa:4096 -keyout server.key -nodes -out server.csr -subj="/CN=localhost"
```

Créer le certificat serveur signé par la CA :

```bash
openssl x509 -req -in server.csr -CA rootCA.crt -CAkey rootCA.key -CAcreateserial -out server.crt -days 825 -sha256
```

Fusionner la clé privée et le certificat serveur dans un fichier PEM pour MongoDB :

```bash
type server.key server.crt > server.pem
```

## 2. Fichiers obtenus

- `rootCA.crt` = certificat de confiance à donner au client
- `rootCA.key` = clé privée de la CA
- `server.crt` = certificat du serveur MongoDB
- `server.key` = clé privée du serveur
- `server.pem` = certificat serveur + clé privée, utilisé par MongoDB

## 3. Utiliser le certificat côté serveur MongoDB

Exemple dans `mongod.cfg` :

```yaml
net:
  port: 27017
  bindIp: 127.0.0.1
  tls:
    mode: requireTLS
    certificateKeyFile: D:\hal\mongodb\certs\server.pem
    CAFile: D:\hal\mongodb\certs\rootCA.crt
storage:
  dbPath: D:\hal\mongodb\data
```

Puis lancer MongoDB :

```bash
mongod.exe --config D:\hal\mongodb\mongod.cfg
```

## 4. Utiliser le certificat avec mongosh

Connexion avec TLS :

```bash
mongosh.exe --tls --tlsCAFile D:\hal\mongodb\certs\rootCA.crt
```

## 5. Utiliser le certificat avec MongoDB Compass

Dans Compass :

- ouvrir la connexion
- aller dans l’onglet **TLS / SSL**
- activer **TLS / SSL**
- renseigner le fichier **CA Certificate**
- sélectionner `rootCA.crt`

Si l’infrastructure demande un certificat client :

- renseigner aussi le fichier **Client Certificate / Key**
- utiliser le certificat et la clé fournis par l’entreprise

## 6. Résumé simple

- `.crt` = certificat
- `rootCA.crt` = certificat de confiance
- `server.pem` = certificat serveur + clé privée
- MongoDB Server utilise `server.pem`
- Compass et `mongosh` utilisent souvent `rootCA.crt`

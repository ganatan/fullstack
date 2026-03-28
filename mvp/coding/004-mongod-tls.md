# MongoDB local TLS sous Windows avec CA locale et certificat serveur

## Objectif

Mettre en place un MongoDB local avec TLS sous Windows, de manière propre et compréhensible, avec :

- une **CA locale**
- un **certificat serveur**
- un **fichier `server.pem`** utilisé par MongoDB

Cette approche évite les erreurs classiques liées à l’utilisation d’un certificat auto-signé unique pour tout faire.

---

## Contexte local

### Exécutable MongoDB

```text
D:\hal\mongodb\mongodb\bin\mongod.exe
```

### Fichier de configuration MongoDB

```text
C:\Program Files\MongoDB\Server\8.2\bin\mongod.cfg
```

### Données MongoDB

```text
D:\hal\MongoDB\Server\8.2\data
```

### Logs MongoDB

```text
D:\hal\MongoDB\Server\8.2\log\mongod.log
```

### Répertoire des certificats

```text
D:\demo\mongo-certs-ca
```

---

## Principe

La structure correcte est la suivante :

- `ca.key` : clé privée de la CA locale
- `ca.crt` : certificat de la CA locale
- `server.key` : clé privée du serveur MongoDB
- `server.csr` : demande de certificat du serveur
- `server.crt` : certificat serveur signé par la CA
- `server.pem` : fichier combiné utilisé par MongoDB
- `server.ext` : fichier d’extensions OpenSSL pour les SAN

Le fichier `server.pem` doit contenir :

- la clé privée serveur
- le certificat serveur

Le fichier `ca.crt` sert de chaîne de confiance.

---

## Pourquoi cette méthode

Utiliser le même certificat auto-signé partout peut provoquer des erreurs côté MongoDB Windows, notamment quand :

- `certificateKeyFile` pointe sur un certificat auto-signé
- `CAFile` pointe sur ce même certificat

Cette méthode sépare clairement :

- l’autorité de confiance
- l’identité du serveur

C’est plus propre, plus lisible, et plus proche d’un vrai fonctionnement de prod.

---

## Important avant de commencer

Si tu veux te connecter en TLS avec :

- `localhost`
- ou `127.0.0.1`

alors ton certificat serveur doit contenir des **SAN** :

- `DNS:localhost`
- `IP:127.0.0.1`

Sinon tu auras une erreur du type :

```text
Hostname/IP does not match certificate's altnames
```

---

## Étape 1 — créer le dossier

```bat
mkdir D:\demo\mongo-certs-ca
```

---

## Étape 2 — créer la CA locale

### Clé privée de la CA

```bat
openssl genrsa -out D:\demo\mongo-certs-ca\ca.key 2048
```

### Certificat de la CA

```bat
openssl req -x509 -new -nodes -key D:\demo\mongo-certs-ca\ca.key -sha256 -days 36500 -out D:\demo\mongo-certs-ca\ca.crt -subj "/CN=MongoLocalCA"
```

---

## Étape 3 — créer la clé serveur

```bat
openssl genrsa -out D:\demo\mongo-certs-ca\server.key 2048
```

---

## Étape 4 — créer le fichier d’extensions SAN

```bat
(
echo authorityKeyIdentifier=keyid,issuer
echo basicConstraints=CA:FALSE
echo keyUsage=digitalSignature,keyEncipherment
echo extendedKeyUsage=serverAuth
echo subjectAltName=@alt_names
echo [alt_names]
echo DNS.1=localhost
echo IP.1=127.0.0.1
) > D:\demo\mongo-certs-ca\server.ext
```

---

## Étape 5 — créer la demande de certificat serveur

```bat
openssl req -new -key D:\demo\mongo-certs-ca\server.key -out D:\demo\mongo-certs-ca\server.csr -subj "/CN=localhost"
```

---

## Étape 6 — signer le certificat serveur avec la CA

```bat
openssl x509 -req -in D:\demo\mongo-certs-ca\server.csr -CA D:\demo\mongo-certs-ca\ca.crt -CAkey D:\demo\mongo-certs-ca\ca.key -CAcreateserial -out D:\demo\mongo-certs-ca\server.crt -days 36500 -sha256 -extfile D:\demo\mongo-certs-ca\server.ext
```

---

## Étape 7 — créer le fichier PEM pour MongoDB

```bat
copy /b D:\demo\mongo-certs-ca\server.key + D:\demo\mongo-certs-ca\server.crt D:\demo\mongo-certs-ca\server.pem
```

---

## Étape 8 — vérifier les fichiers obtenus

```bat
dir D:\demo\mongo-certs-ca
```

Tu dois obtenir au minimum :

- `ca.key`
- `ca.crt`
- `ca.srl`
- `server.key`
- `server.ext`
- `server.csr`
- `server.crt`
- `server.pem`

---

## Étape 9 — vérifier les SAN du certificat serveur

```bat
openssl x509 -in D:\demo\mongo-certs-ca\server.crt -text -noout
```

Tu dois voir quelque chose comme :

```text
X509v3 Subject Alternative Name:
    DNS:localhost, IP Address:127.0.0.1
```

---

## Rôle de chaque fichier

### CA locale

- `ca.key` : clé privée de l’autorité locale
- `ca.crt` : certificat public de l’autorité locale

### Serveur MongoDB

- `server.key` : clé privée du serveur
- `server.csr` : demande de certificat
- `server.crt` : certificat serveur signé par la CA
- `server.pem` : fichier final utilisé par MongoDB

### Fichiers techniques

- `server.ext` : extensions OpenSSL avec les SAN
- `ca.srl` : numéro de série généré par OpenSSL

---

## Étape 10 — configurer `mongod.cfg`

Fichier :

```text
C:\Program Files\MongoDB\Server\8.2\bin\mongod.cfg
```

### Version souple pour test local

Avec `preferTLS`, MongoDB accepte :

- les connexions sans TLS
- les connexions avec TLS

```yaml
storage:
  dbPath: D:\hal\MongoDB\Server\8.2\data

systemLog:
  destination: file
  logAppend: true
  path: D:\hal\MongoDB\Server\8.2\log\mongod.log

net:
  port: 27017
  bindIp: 127.0.0.1
  tls:
    mode: preferTLS
    certificateKeyFile: D:\demo\mongo-certs-ca\server.pem
    CAFile: D:\demo\mongo-certs-ca\ca.crt
    allowConnectionsWithoutCertificates: true

security:
  authorization: enabled
```

### Version stricte comme en prod

Avec `requireTLS`, MongoDB refuse toutes les connexions sans TLS.

```yaml
storage:
  dbPath: D:\hal\MongoDB\Server\8.2\data

systemLog:
  destination: file
  logAppend: true
  path: D:\hal\MongoDB\Server\8.2\log\mongod.log

net:
  port: 27017
  bindIp: 127.0.0.1
  tls:
    mode: requireTLS
    certificateKeyFile: D:\demo\mongo-certs-ca\server.pem
    CAFile: D:\demo\mongo-certs-ca\ca.crt
    allowConnectionsWithoutCertificates: true

security:
  authorization: enabled
```

---

## Explication des options TLS

### `certificateKeyFile`

Fichier présenté par le serveur MongoDB en TLS.

Ici :

```text
D:\demo\mongo-certs-ca\server.pem
```

### `CAFile`

Autorité de confiance utilisée pour la validation TLS.

Ici :

```text
D:\demo\mongo-certs-ca\ca.crt
```

### `allowConnectionsWithoutCertificates: true`

Le serveur exige TLS mais n’exige pas de certificat client.

Concrètement :

- la connexion est chiffrée
- `mongosh` peut se connecter avec `tls=true`
- l’authentification reste classique avec `admin / mot de passe`

Sans cette option, tu peux obtenir une erreur du type :

```text
No SSL certificate provided by peer; connection rejected
```

### `preferTLS`

Mode hybride :

- accepte TLS
- accepte aussi non-TLS

Pratique pour les premiers tests.

### `requireTLS`

Mode strict :

- TLS obligatoire
- une connexion simple sans TLS doit échouer

---

## Étape 11 — tester MongoDB à la main

Avant de relancer le service Windows, teste le démarrage manuel :

```bat
"D:\hal\mongodb\mongodb\bin\mongod.exe" --config "C:\Program Files\MongoDB\Server\8.2\bin\mongod.cfg"
```

Si le serveur démarre sans erreur bloquante, la configuration est correcte.

---

## Étape 12 — démarrer ou redémarrer le service MongoDB

```bat
net stop MongoDB
net start MongoDB
```

---

## Étape 13 — tester avec `mongosh`

## Cas 1 — mode `preferTLS`

### Connexion sans TLS

```bat
mongosh "mongodb://admin:Trustno1@localhost:27017/mvp?authSource=admin"
```

### Connexion avec TLS sur `localhost`

```bat
mongosh "mongodb://admin:Trustno1@localhost:27017/mvp?authSource=admin&tls=true&tlsCAFile=D:\demo\mongo-certs-ca\ca.crt"
```

### Connexion avec TLS sur `127.0.0.1`

```bat
mongosh "mongodb://admin:Trustno1@127.0.0.1:27017/mvp?authSource=admin&tls=true&tlsCAFile=D:\demo\mongo-certs-ca\ca.crt"
```

---

## Cas 2 — mode `requireTLS`

### Connexion sans TLS

Cette commande doit échouer :

```bat
mongosh "mongodb://admin:Trustno1@localhost:27017/mvp?authSource=admin"
```

### Connexion correcte avec TLS

```bat
mongosh "mongodb://admin:Trustno1@localhost:27017/mvp?authSource=admin&tls=true&tlsCAFile=D:\demo\mongo-certs-ca\ca.crt"
```

### Connexion correcte sur la base `admin`

```bat
mongosh "mongodb://admin:Trustno1@localhost:27017/admin?tls=true&tlsCAFile=D:\demo\mongo-certs-ca\ca.crt"
```

Cette commande doit fonctionner si :

- TLS est bien configuré
- le certificat serveur est bon
- `allowConnectionsWithoutCertificates: true` est présent
- l’utilisateur `admin` existe bien

---

## Si le nom d’hôte ne matche pas

Si tu obtiens une erreur du type :

```text
Hostname/IP does not match certificate's altnames
```

cela veut dire que le certificat serveur ne contient pas le bon SAN.

Exemple :

- tu te connectes à `127.0.0.1`
- mais le certificat contient seulement `localhost`

Dans ce cas :

- soit tu régénères correctement le certificat avec les SAN
- soit tu testes avec `localhost`
- soit tu contournes temporairement pour test local

Exemple de contournement temporaire :

```bat
mongosh "mongodb://admin:Trustno1@127.0.0.1:27017/mvp?authSource=admin&tls=true&tlsCAFile=D:\demo\mongo-certs-ca\ca.crt&tlsAllowInvalidHostnames=true"
```

À utiliser uniquement pour du test local.

---

## Si tu obtiens `read ECONNRESET`

Si `mongosh` affiche :

```text
MongoServerSelectionError: read ECONNRESET
```

alors il faut regarder le log MongoDB.

Commande utile :

```bat
powershell -Command "Get-Content 'D:\hal\MongoDB\Server\8.2\log\mongod.log' -Tail 100"
```

Si le log contient :

```text
No SSL certificate provided by peer; connection rejected
```

cela veut dire que MongoDB attend un certificat client.

La solution locale simple consiste à ajouter dans `mongod.cfg` :

```yaml
allowConnectionsWithoutCertificates: true
```

---

## Étape 14 — tester avec MongoDB Compass

### URI

```text
mongodb://admin:Trustno1@localhost:27017/admin?authSource=admin&tls=true
```

### Réglages Compass

- ouvrir **Advanced Connection Options**
- aller dans **TLS/SSL**
- activer **TLS/SSL**
- dans **Server CA Certificate**, sélectionner :

```text
D:\demo\mongo-certs-ca\ca.crt
```

### Si besoin

Si Compass refuse encore la connexion à cause du hostname :

- activer temporairement l’option de type :
  - `Allow invalid hostnames`
  - ou `Allow invalid certificates`

Mais normalement, si le certificat contient bien `localhost`, cela ne doit pas être nécessaire.

---

## Étape 15 — configurer Spring Boot

### URI locale propre avec TLS

```yaml
spring:
  data:
    mongodb:
      uri: mongodb://admin:Trustno1@localhost:27017/mvp?authSource=admin&tls=true&tlsCAFile=D:\demo\mongo-certs-ca\ca.crt&directConnection=true
```

### URI pour la base `admin`

```yaml
spring:
  data:
    mongodb:
      uri: mongodb://admin:Trustno1@localhost:27017/admin?authSource=admin&tls=true&tlsCAFile=D:\demo\mongo-certs-ca\ca.crt&directConnection=true
```

### Explication

- `tls=true` : active TLS
- `tlsCAFile=...` : indique la CA utilisée pour faire confiance au certificat serveur
- `directConnection=true` : adapté à une instance locale simple
- `authSource=admin` : utilisateur défini dans la base `admin`

### Variante de test simplifiée

Si tu veux contourner temporairement un problème de hostname en local :

```yaml
spring:
  data:
    mongodb:
      uri: mongodb://admin:Trustno1@127.0.0.1:27017/mvp?authSource=admin&tls=true&tlsCAFile=D:\demo\mongo-certs-ca\ca.crt&tlsAllowInvalidHostnames=true&directConnection=true
```

Cette variante sert seulement pour le local.

---

## Vérifier les dernières lignes du log

Si le service ne démarre pas :

```bat
powershell -Command "Get-Content 'D:\hal\MongoDB\Server\8.2\log\mongod.log' -Tail 100"
```

---

## Erreurs classiques

### 1. Mauvais chemin de config

Erreur :

```text
Error opening config file ... No such file or directory
```

Cause :

- mauvais chemin
- confusion entre `mongod.conf` et `mongod.cfg`

---

### 2. Pas de chaîne de confiance

Erreur :

```text
The use of TLS without specifying a chain of trust is no longer supported
```

Cause :

- `CAFile` absent

---

### 3. Même certificat utilisé comme serveur et comme CA

Erreur possible :

```text
CertAddCertificateContextToStore Failed
L’objet ou la propriété existe déjà.
```

Cause :

- même certificat utilisé pour :
  - `certificateKeyFile`
  - `CAFile`

Solution :

- créer une vraie CA locale
- signer un vrai certificat serveur avec cette CA

---

### 4. Impossible d’ouvrir le PEM

Erreur :

```text
Failed to open PEM file
```

Causes possibles :

- mauvais chemin
- droits insuffisants
- fichier absent
- contenu PEM invalide

---

### 5. Erreur de hostname

Erreur :

```text
Hostname/IP does not match certificate's altnames
```

Cause :

- certificat généré sans SAN corrects

Solution :

- ajouter `DNS:localhost`
- ajouter `IP:127.0.0.1`

---

### 6. Certificat client attendu

Erreur dans le log :

```text
No SSL certificate provided by peer; connection rejected
```

Cause :

- MongoDB attend un certificat TLS client

Solution locale simple :

```yaml
allowConnectionsWithoutCertificates: true
```

---

## Résumé simple

### MongoDB serveur utilise

- `server.pem`
- `ca.crt`

### `mongosh` utilise

- `tls=true`
- `tlsCAFile=...`

### Compass utilise

- l’URI MongoDB
- `ca.crt` dans les options TLS

### Spring Boot utilise

- une URI MongoDB avec `tls=true`
- `tlsCAFile=...`
- `authSource=admin`

### Structure finale propre

- `ca.crt` = autorité locale
- `server.crt` = certificat serveur signé par la CA
- `server.pem` = clé serveur + certificat serveur

---

## Résumé ultra court

1. créer une CA locale
2. créer une clé serveur
3. ajouter des SAN pour `localhost` et `127.0.0.1`
4. signer le certificat serveur avec la CA
5. créer `server.pem`
6. configurer `mongod.cfg`
7. ajouter `allowConnectionsWithoutCertificates: true`
8. tester `mongod.exe`
9. tester `mongosh`
10. tester Compass
11. configurer Spring Boot
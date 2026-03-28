## Commandes mongo

  mongosh

  show dbs
  use local
  show collections
  db.nomCollection.find({})
  db.nomCollection.countDocuments({})

## Creation compte Admin
  
  use admin

  db.createUser({
    user: "admin",
    pwd: "Trustno1",
    roles: [
      { role: "userAdminAnyDatabase", db: "admin" },
      { role: "readWriteAnyDatabase", db: "admin" }
    ]
  })  
  
  !!!!!!! Droits interdits sur local

  mongosh -u admin -p Trustno1 --authenticationDatabase admin
  
  mongosh "mongodb://admin:Trustno1@localhost:27017/admin?authSource=admin"

# Rajout de droits
  use admin

  db.updateUser("admin", {
    roles: [
      { role: "root", db: "admin" }
    ]
  })

  Possibilte de travailler sur local

# Creation dabatase
  use mvp

  db.test.insertOne({
    name: "demo"
  })

## `pom.xml`

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-mongodb</artifactId>
</dependency>
```

```xml
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-mongodb</artifactId>
        <exclusions>
            <exclusion>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-logging</artifactId>
            </exclusion>
        </exclusions>
    </dependency>
    <dependency>
        <groupId>org.springframework.data</groupId>
        <artifactId>spring-data-mongodb</artifactId>
    </dependency>
    <dependency>
        <groupId>org.mongodb</groupId>
        <artifactId>mongodb-driver-sync</artifactId>
    </dependency>
```xml

## Links

```text
http://localhost:3000/test-mongodb-controller
http://localhost:3001/test-mongodb-controller
```

## `application.yml`

```yaml
server:
  port: 3000

spring:
  application:
    name: mvp-starter
  data:
    mongodb:
      uri: mongodb://localhost:27017/local
```

## `application.properties`

```properties
server.port=3000
spring.application.name=mvp-starter
spring.data.mongodb.uri=mongodb://localhost:27017/local
```

## `Connection compass`
```text
mongodb://admin:Trustno1@localhost:27017/admin?authSource=admin&tls=true
```


## Controller

```java
package com.mvp.controller.prototypes;

import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
public class TestMongodbController {

    private final MongoTemplate mongoTemplate;

    public TestMongodbController(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @GetMapping("/test-mongodb-controller")
    public Map<String, Object> testConnection() {
        Map<String, Object> response = new LinkedHashMap<>();

        try {
            MongoDatabase database = mongoTemplate.getDb();
            Document pingResult = database.runCommand(new Document("ping", 1));
            List<String> collections = mongoTemplate.getCollectionNames().stream().sorted().toList();

            response.put("status", "OK");
            response.put("database", database.getName());
            response.put("pingOk", pingResult.get("ok"));
            response.put("collectionsCount", collections.size());
            response.put("collections", collections);
        } catch (Exception exception) {
            response.put("status", "ERROR");
            response.put("message", exception.getMessage());
        }

        return response;
    }
}
```



Verif du fichier de config

mongosh
db.adminCommand({ getCmdLineOpts: 1 })

'C:\\Program Files\\MongoDB\\Server\\8.2\\bin\\mongod.cfg',


# Résumé commandes TLS MongoDB local

## 1. Créer les fichiers certificat

```bat
openssl req -x509 -newkey rsa:2048 -nodes -keyout mongodb.key -out mongodb.crt -days 36500 -subj "/CN=localhost"
copy /b mongodb.key + mongodb.crt mongodb.pem
dir mongodb.*
```

## 2. Fichiers obtenus

- `mongodb.key` : clé privée
- `mongodb.crt` : certificat
- `mongodb.pem` : fichier combiné pour MongoDB

## 3. URI Spring Boot local avec TLS

```yaml
spring:
  data:
    mongodb:
      uri: mongodb://admin:Trustno1@localhost:27017/mvp?authSource=admin&tls=true&tlsAllowInvalidCertificates=true&directConnection=true
```

## 4. Config MongoDB serveur

```yaml
net:
  port: 27017
  bindIp: 127.0.0.1
  tls:
    mode: requireTLS
    certificateKeyFile: D:/chemin/vers/mongodb.pem

security:
  authorization: enabled
```

## 5. Compass

URI :

```text
mongodb://admin:Trustno1@localhost:27017/mvp?authSource=admin&tls=true
```

Puis :

- activer `TLS/SSL`
- choisir `Server CA Certificate`
- sélectionner `mongodb.crt`

## 6. Idée simple

- `mongodb.pem` côté serveur MongoDB
- `mongodb.crt` côté Compass
- Spring Boot en `tls=true`
- en local auto-signé : `tlsAllowInvalidCertificates=true`


# Variante avec mongodb.yml
## `application.yml`

```yaml
server:
  port: 3001

spring:
  application:
    name: mvp-starter-dev
  config:
    import: optional:file:./config-local/librairie/mongodb.yml

custom:
  api-url: http://localhost:3001/api
  message: configuration du profil dev
```

## `mongodb.yml`

```yaml
spring:
  config:
    activate:
      on-profile: local
  data:
    mongodb:
      uri: mongodb://localhost:27017/local
---
spring:
  config:
    activate:
      on-profile: dev
  data:
    mongodb:
      uri: mongodb://localhost:27017/mvp
```
# Tuto Spring Boot : tester une connexion MongoDB en local puis en TLS avec certificat `.crt`

## Objectif

Créer une application Spring Boot très simple qui :

- teste une connexion MongoDB locale sans sécurité
- teste une connexion MongoDB distante avec TLS
- utilise un certificat d’autorité `.crt`
- expose un endpoint HTTP pour vérifier rapidement que la connexion fonctionne

---

## Cas 1 : MongoDB local sans TLS

### Dépendance Maven

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-mongodb</artifactId>
</dependency>
```

---

## Fichier `application-local.yml`

```yaml
spring:
  application:
    name: springboot-mongodb-local
  data:
    mongodb:
      uri: mongodb://localhost:27017/testdb

server:
  port: 8080
```

---

## Classe principale

```java
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
```

---

## Controller de test

```java
package com.example.demo.controller;

import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestMongoController {

    private final MongoTemplate mongoTemplate;

    public TestMongoController(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @GetMapping("/test/mongo")
    public Map<String, Object> testMongo() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("database", mongoTemplate.getDb().getName());
        response.put("collections", mongoTemplate.getCollectionNames());
        response.put("ok", true);
        return response;
    }
}
```

---

## Lancement avec le profil local

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

---

## URL de test

```text
http://localhost:8080/test/mongo
```

---

## Réponse attendue

```json
{
  "database": "testdb",
  "collections": [],
  "ok": true
}
```

---

## Cas 2 : MongoDB avec TLS et certificat `.crt`

## Principe

Dans ce cas :

- MongoDB exige une connexion TLS
- le serveur présente un certificat
- ton application doit faire confiance à l’autorité de certification
- le fichier `.crt` sert souvent de certificat CA à faire charger côté client

Le plus simple en Java est souvent :

- soit convertir le `.crt` dans un truststore Java
- soit construire le `MongoClient` manuellement avec un `SSLContext`

Pour un tuto propre et stable, le plus clair est de faire un truststore Java.

---

## Arborescence conseillée

```text
mon-projet/
├── certs/
│   ├── mongo-ca.crt
│   └── truststore.p12
├── src/
│   └── main/
│       ├── java/
│       └── resources/
│           └── application-tls.yml
├── pom.xml
```

---

## Étape 1 : créer un truststore à partir du `.crt`

### Commande

```bash
keytool -importcert -trustcacerts -alias mongo-ca -file certs/mongo-ca.crt -keystore certs/truststore.p12 -storetype PKCS12
```

### Ce que fait cette commande

- importe le certificat `mongo-ca.crt`
- crée un truststore Java `truststore.p12`
- permettra à Java de valider le certificat présenté par MongoDB

---

## Étape 2 : fichier `application-tls.yml`

```yaml
spring:
  application:
    name: springboot-mongodb-tls
  data:
    mongodb:
      uri: mongodb://user:password@host1:27017/testdb?tls=true&authSource=admin

server:
  port: 8082
```

---

## Étape 3 : passer le truststore à la JVM

### Commande de lancement

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=tls -Dspring-boot.run.jvmArguments="-Djavax.net.ssl.trustStore=certs/truststore.p12 -Djavax.net.ssl.trustStorePassword=changeit -Djavax.net.ssl.trustStoreType=PKCS12"
```

---

## Variante avec jar

```bash
java -Dspring.profiles.active=tls -Djavax.net.ssl.trustStore=certs/truststore.p12 -Djavax.net.ssl.trustStorePassword=changeit -Djavax.net.ssl.trustStoreType=PKCS12 -jar target/demo-0.0.1-SNAPSHOT.jar
```

---

## Même controller de test

```java
package com.example.demo.controller;

import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestMongoController {

    private final MongoTemplate mongoTemplate;

    public TestMongoController(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @GetMapping("/test/mongo")
    public Map<String, Object> testMongo() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("database", mongoTemplate.getDb().getName());
        response.put("collections", mongoTemplate.getCollectionNames());
        response.put("ok", true);
        return response;
    }
}
```

---

## URL de test TLS

```text
http://localhost:8082/test/mongo
```

---

## Cas 3 : configuration Java manuelle avec `SSLContext`

Cette approche est utile si :

- tu veux charger directement un fichier `.crt`
- tu ne veux pas dépendre d’options JVM
- tu veux maîtriser complètement la connexion Mongo

---

## Configuration Java TLS MongoDB

```java
package com.example.demo.config;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import java.io.FileInputStream;
import java.security.KeyStore;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManagerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MongoTlsConfig {

    @Value("${custom.mongodb.uri}")
    private String mongoUri;

    @Value("${custom.mongodb.ca-file}")
    private String caFile;

    @Bean
    public MongoClient mongoClient() throws Exception {
        CertificateFactory certificateFactory = CertificateFactory.getInstance("X.509");
        X509Certificate caCertificate;
        try (FileInputStream inputStream = new FileInputStream(caFile)) {
            caCertificate = (X509Certificate) certificateFactory.generateCertificate(inputStream);
        }

        KeyStore keyStore = KeyStore.getInstance(KeyStore.getDefaultType());
        keyStore.load(null, null);
        keyStore.setCertificateEntry("mongo-ca", caCertificate);

        TrustManagerFactory trustManagerFactory = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
        trustManagerFactory.init(keyStore);

        SSLContext sslContext = SSLContext.getInstance("TLS");
        sslContext.init(null, trustManagerFactory.getTrustManagers(), null);

        ConnectionString connectionString = new ConnectionString(mongoUri);

        MongoClientSettings settings = MongoClientSettings.builder()
            .applyConnectionString(connectionString)
            .applyToSslSettings(builder -> {
                builder.enabled(true);
                builder.context(sslContext);
            })
            .build();

        return MongoClients.create(settings);
    }
}
```

---

## Fichier `application-tls.yml` pour cette variante

```yaml
spring:
  application:
    name: springboot-mongodb-tls-manuel
  data:
    mongodb:
      database: testdb

custom:
  mongodb:
    uri: mongodb://user:password@host1:27017/testdb?tls=true&authSource=admin
    ca-file: certs/mongo-ca.crt

server:
  port: 8082
```

---

## Remarque importante

Si tu crées toi-même le bean `MongoClient`, Spring Boot l’utilisera à la place de l’auto-configuration standard.

---

## Exemple complet minimal de test avec ping MongoDB

## Service

```java
package com.example.demo.service;

import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

@Service
public class TestMongoService {

    private final MongoTemplate mongoTemplate;

    public TestMongoService(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    public Document ping() {
        return mongoTemplate.getDb().runCommand(new Document("ping", 1));
    }
}
```

---

## Controller

```java
package com.example.demo.controller;

import java.util.LinkedHashMap;
import java.util.Map;
import org.bson.Document;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.demo.service.TestMongoService;

@RestController
public class TestMongoController {

    private final TestMongoService testMongoService;

    public TestMongoController(TestMongoService testMongoService) {
        this.testMongoService = testMongoService;
    }

    @GetMapping("/test/mongo/ping")
    public Map<String, Object> pingMongo() {
        Document result = testMongoService.ping();
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("ok", result.get("ok"));
        response.put("result", result);
        return response;
    }
}
```

---

## Réponse attendue

```json
{
  "ok": 1.0,
  "result": {
    "ok": 1.0
  }
}
```

---

## Profils conseillés

- `local` pour MongoDB sur `localhost`
- `tls` pour MongoDB sécurisé avec certificat
- `prod` plus tard pour la vraie infra

---

## Exemple de fichiers de profils

### `application.yml`

```yaml
spring:
  application:
    name: springboot-mongodb-demo
```

### `application-local.yml`

```yaml
spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/testdb

server:
  port: 8080
```

### `application-tls.yml`

```yaml
spring:
  data:
    mongodb:
      uri: mongodb://user:password@host1:27017/testdb?tls=true&authSource=admin

server:
  port: 8082
```

---

## Problèmes fréquents

## 1. `PKIX path building failed`

Cause :

- Java ne fait pas confiance au certificat serveur

Solution :

- importer le `.crt` dans un truststore
- ou construire un `SSLContext` correct

---

## 2. `SSLHandshakeException`

Cause :

- certificat invalide
- mauvais certificat CA
- hostname du certificat différent du host appelé

Solution :

- vérifier le CN ou SAN du certificat
- vérifier le host dans l’URI MongoDB
- vérifier que le bon `.crt` est utilisé

---

## 3. `Connection refused`

Cause :

- mauvais host
- mauvais port
- MongoDB non démarré
- firewall

---

## 4. `Authentication failed`

Cause :

- mauvais login
- mauvais mot de passe
- mauvais `authSource`

Exemple courant :

```text
authSource=admin
```

---

## 5. le `.crt` seul ne suffit pas toujours

Très important :

- un `.crt` est souvent un certificat d’autorité ou serveur
- Java attend souvent un truststore
- le plus robuste est donc de convertir ce certificat en `truststore.p12`

---

## Tuto vidéo possible en 4 épisodes

## Épisode 1

Tester MongoDB local avec Spring Boot et `MongoTemplate`

## Épisode 2

Ajouter un endpoint `/ping` pour vérifier la connexion

## Épisode 3

Configurer une connexion TLS avec un certificat `.crt`

## Épisode 4

Comprendre les erreurs SSL les plus fréquentes

---

## Résumé pratique

- en local : une simple URI MongoDB suffit
- en TLS : ajoute `tls=true`
- avec un `.crt` : crée de préférence un truststore Java
- passe le truststore à la JVM
- teste la connexion avec `MongoTemplate` et un endpoint `/test/mongo/ping`

---

## Commandes utiles

### Local

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

### TLS avec truststore

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=tls -Dspring-boot.run.jvmArguments="-Djavax.net.ssl.trustStore=certs/truststore.p12 -Djavax.net.ssl.trustStorePassword=changeit -Djavax.net.ssl.trustStoreType=PKCS12"
```

### Création truststore

```bash
keytool -importcert -trustcacerts -alias mongo-ca -file certs/mongo-ca.crt -keystore certs/truststore.p12 -storetype PKCS12
```
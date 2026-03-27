## Commandes mongo

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

  mongosh -u admin -p Trustno1 --authenticationDatabase admin
  
  mongosh "mongodb://admin:Trustno1@localhost:27017/admin?authSource=admin"

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


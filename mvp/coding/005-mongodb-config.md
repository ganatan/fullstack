## config

```java
package com.mvp.config.mongodb;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;

@Configuration
@EnableConfigurationProperties(MongodbProperties.class)
public class MongodbConfig extends AbstractMongoClientConfiguration {

    private final MongodbProperties mongodbProperties;

    public MongodbConfig(MongodbProperties mongodbProperties) {
        this.mongodbProperties = mongodbProperties;
        System.out.println("00000000004:MongodbConfig chargee");
        System.out.println("00000000004:testenabled = " + mongodbProperties.isTestenabled());
        System.out.println("00000000004:username = " + mongodbProperties.getUsername());
        System.out.println("00000000004:password = " + mongodbProperties.getPassword());
        System.out.println("00000000004:hosts = " + mongodbProperties.getHosts());
        System.out.println("00000000004:database = " + mongodbProperties.getDatabase());
        System.out.println("00000000004:options = " + mongodbProperties.getOptions());
    }

    @Override
    protected String getDatabaseName() {
        System.out.println("00000000004:getDatabaseName() appelee");
        System.out.println("00000000004:database retournee = " + mongodbProperties.getDatabase());
        return mongodbProperties.getDatabase();
    }

    @Override
    public MongoClient mongoClient() {
        System.out.println("00000000004:mongoClient() appelee");
        String uri = buildUri();
        System.out.println("00000000004:URI Mongo construite = " + uri);

        ConnectionString connectionString = new ConnectionString(uri);
        MongoClientSettings settings = MongoClientSettings.builder()
                .applyConnectionString(connectionString)
                .build();

        System.out.println("00000000004:MongoClientSettings construits");
        MongoClient mongoClient = MongoClients.create(settings);
        System.out.println("00000000004:MongoClient cree");

        return mongoClient;
    }

    private String buildUri() {
        System.out.println("00000000004:buildUri() appelee");

        if (mongodbProperties.isTestenabled()) {
            String testUri = "mongodb://" + mongodbProperties.getHosts() + "/" + mongodbProperties.getDatabase();
            System.out.println("00000000004:mode test active");
            System.out.println("00000000004:testUri = " + testUri);
            return testUri;
        }

        StringBuilder uri = new StringBuilder();
        uri.append("mongodb://");

        String username = mongodbProperties.getUsername();
        String password = mongodbProperties.getPassword();

        System.out.println("00000000004:username present = " + hasText(username));
        System.out.println("00000000004:password present = " + hasText(password));

        if (hasText(username) && hasText(password)) {
            uri.append(username).append(":").append(password).append("@");
            System.out.println("00000000004:credentials ajoutees a l URI");
        }

        uri.append(mongodbProperties.getHosts());
        uri.append("/").append(mongodbProperties.getDatabase());

        if (hasText(mongodbProperties.getOptions())) {
            uri.append("?").append(mongodbProperties.getOptions());
            System.out.println("00000000004:options ajoutees a l URI");
        } else {
            System.out.println("00000000004:aucune option ajoutee a l URI");
        }

        String finalUri = uri.toString();
        System.out.println("00000000004:finalUri = " + finalUri);

        return finalUri;
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }
}
```

## Config properties

```java
package com.mvp.config.mongodb;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "spring.data.mongodb")
public class MongodbProperties {

    private boolean testenabled;
    private String username;
    private String password;
    private String hosts;
    private String database;
    private String options;

    public boolean isTestenabled() {
        return testenabled;
    }

    public void setTestenabled(boolean testenabled) {
        this.testenabled = testenabled;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getHosts() {
        return hosts;
    }

    public void setHosts(String hosts) {
        this.hosts = hosts;
    }

    public String getDatabase() {
        return database;
    }

    public void setDatabase(String database) {
        this.database = database;
    }

    public String getOptions() {
        return options;
    }

    public void setOptions(String options) {
        this.options = options;
    }
}
```


## Test Mongodb config

```java
package com.mvp.controller.prototypes;

import com.mongodb.client.MongoDatabase;
import com.mvp.config.mongodb.MongodbProperties;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
public class TestMongodbConfigController {

    private final MongoTemplate mongoTemplate;
    private final MongodbProperties mongodbProperties;

    public TestMongodbConfigController(MongoTemplate mongoTemplate, MongodbProperties mongodbProperties) {
        this.mongoTemplate = mongoTemplate;
        this.mongodbProperties = mongodbProperties;
    }

    @GetMapping("/test-mongodb-config")
    public Map<String, Object> testMongodbConfig() {
        Map<String, Object> response = new LinkedHashMap<>();

        try {
            MongoDatabase database = mongoTemplate.getDb();
            Document pingResult = database.runCommand(new Document("ping", 1));
            List<String> collections = mongoTemplate.getCollectionNames().stream().sorted().toList();

            response.put("status", "OK");
            response.put("databaseConnected", database.getName());
            response.put("pingOk", pingResult.get("ok"));
            response.put("collectionsCount", collections.size());
            response.put("collections", collections);

            Map<String, Object> properties = new LinkedHashMap<>();
            properties.put("testenabled", mongodbProperties.isTestenabled());
            properties.put("username", mongodbProperties.getUsername());
            properties.put("hosts", mongodbProperties.getHosts());
            properties.put("database", mongodbProperties.getDatabase());
            properties.put("options", mongodbProperties.getOptions());

            response.put("mongodbProperties", properties);
        } catch (Exception exception) {
            response.put("status", "ERROR");
            response.put("message", exception.getMessage());
        }

        return response;
    }
}
```


## Test Mongodb template

```java
package com.mvp.controller.prototypes;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestMongoSimpleController {

    private final MongoTemplate mongoTemplate;

    public TestMongoSimpleController(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
        System.out.println("00000000005:TestMongoSimpleController charge");
    }

    @GetMapping("/test-mongo-simple")
    public String testMongoSimple() {
        System.out.println("00000000005:/test-mongo-simple appele");
        System.out.println("00000000005:database = " + mongoTemplate.getDb().getName());
        System.out.println("00000000005:collections = " + mongoTemplate.getCollectionNames());
        return mongoTemplate.getCollectionNames().toString();
    }
}
```


# mondobd.yml

```yaml
spring:
  config:
    activate:
      on-profile: local
  data:
    mongodb:
      testenabled: true
      username:
      password:
      hosts: localhost:27017
      database: local
      options:

---
spring:
  config:
    activate:
      on-profile: dev
  data:
    mongodb:
      testenabled: false
      username: admin
      password: Trustno1
      hosts: localhost:27017
      database: mvp
      options: authSource=admin
```



```text
# LOCAL
http://localhost:3002
http://localhost:3002/test
http://localhost:3002/test-profile-controller
http://localhost:3002/test-mongodb-controller
http://localhost:3002/test-mongodb-config
http://localhost:3002/test-mongo-simple

# DEV
http://localhost:3001
http://localhost:3001/test
http://localhost:3001/test-profile-controller
http://localhost:3001/test-mongodb-controller
http://localhost:3001/test-mongodb-config
http://localhost:3001/test-mongo-simple
```
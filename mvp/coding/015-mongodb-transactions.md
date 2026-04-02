# Test mongodb en replica

  net stop mongodb  
  net start mongodb

  
  rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "127.0.0.1:27017" }
  ]
})

  rs.status()
  

Modifier le fichier de conf

```text
storage:
  dbPath: C:\Program Files\MongoDB\Server\8.2\data

systemLog:
  destination: file
  logAppend: true
  path: C:\Program Files\MongoDB\Server\8.2\log\mongod.log

net:
  port: 27017
  bindIp: 127.0.0.1

replication:
  replSetName: rs0
```


```java
package com.mvp.config.mongodb;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.MongoTransactionManager;

@Configuration
public class MongodbTransactionConfig {

    @Bean
    public MongoTransactionManager mongoTransactionManager(MongoDatabaseFactory mongoDatabaseFactory) {
        return new MongoTransactionManager(mongoDatabaseFactory);
    }
}
```


```java
package com.mvp.controller.prototypes;

import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
public class TestMongodbTransactionsController {

    private final MongoTemplate mongoTemplate;
    private final TestMongodbTransactionsService testMongodbTransactionsService;

    public TestMongodbTransactionsController(
            MongoTemplate mongoTemplate,
            TestMongodbTransactionsService testMongodbTransactionsService
    ) {
        this.mongoTemplate = mongoTemplate;
        this.testMongodbTransactionsService = testMongodbTransactionsService;
        System.out.println("00000000009:TestMongodbTransactionsController charge");
    }

    @GetMapping("/test-media-transactions")
    public Map<String, Object> testMediaTransactions() {
        System.out.println("00000000009:/test-media-transactions appele");

        Map<String, Object> response = new LinkedHashMap<>();

        try {
            MongoDatabase database = mongoTemplate.getDb();
            Document pingResult = database.runCommand(new Document("ping", 1));

            List<String> collectionNames = mongoTemplate.getCollectionNames().stream().sorted().toList();
            List<Map<String, Object>> collections = new ArrayList<>();

            for (String collectionName : collectionNames) {
                long documentCount = mongoTemplate.getCollection(collectionName).countDocuments();

                Map<String, Object> collection = new LinkedHashMap<>();
                collection.put("name", collectionName);
                collection.put("documents", documentCount);

                collections.add(collection);
            }

            response.put("status", "OK");
            response.put("database", database.getName());
            response.put("ping", pingResult.get("ok"));
            response.put("collectionsCount", collectionNames.size());
            response.put("collections", collections);
            response.put("mediaCollection", testMongodbTransactionsService.getCollectionName());
            response.put("mediaCollectionExists", mongoTemplate.collectionExists(testMongodbTransactionsService.getCollectionName()));
            response.put("mediaCollectionCount", testMongodbTransactionsService.countAll());
        } catch (Exception exception) {
            response.put("status", "ERROR");
            response.put("message", exception.getMessage());
        }

        return response;
    }

    @GetMapping("/test-media-transactions-create-7")
    public Map<String, Object> testMediaTransactionsCreate7() {
        System.out.println("00000000009:/test-media-transactions-create-7 appele");

        Map<String, Object> response = new LinkedHashMap<>();

        try {
            String transactionId = testMongodbTransactionsService.create7();

            response.put("status", "OK");
            response.put("mode", "COMMIT");
            response.put("transactionId", transactionId);
            response.put("countForTransactionId", testMongodbTransactionsService.countByTransactionId(transactionId));
            response.put("totalCount", testMongodbTransactionsService.countAll());
            response.put("sampleDocuments", testMongodbTransactionsService.findByTransactionId(transactionId));
        } catch (Exception exception) {
            response.put("status", "ERROR");
            response.put("mode", "COMMIT");
            response.put("message", exception.getMessage());
        }

        return response;
    }

    @GetMapping("/test-media-transactions-rollback-7")
    public Map<String, Object> testMediaTransactionsRollback7() {
        System.out.println("00000000009:/test-media-transactions-rollback-7 appele");

        Map<String, Object> response = new LinkedHashMap<>();

        try {
            String transactionId = testMongodbTransactionsService.rollback7();

            response.put("status", "OK");
            response.put("mode", "ROLLBACK");
            response.put("transactionId", transactionId);
        } catch (Exception exception) {
            String message = exception.getMessage();
            String transactionId = extractTransactionId(message);

            response.put("status", "ERROR");
            response.put("mode", "ROLLBACK");
            response.put("message", message);
            response.put("transactionId", transactionId);
            response.put("countForTransactionIdAfterRollback", transactionId != null ? testMongodbTransactionsService.countByTransactionId(transactionId) : null);
            response.put("totalCountAfterRollback", testMongodbTransactionsService.countAll());
        }

        return response;
    }

    @GetMapping("/test-media-transactions-details")
    public Map<String, Object> testMediaTransactionsDetails() {
        System.out.println("00000000009:/test-media-transactions-details appele");

        Map<String, Object> response = new LinkedHashMap<>();

        try {
            List<Document> documents = testMongodbTransactionsService.findAll(20);

            response.put("status", "OK");
            response.put("collection", testMongodbTransactionsService.getCollectionName());
            response.put("count", testMongodbTransactionsService.countAll());
            response.put("documents", documents);
        } catch (Exception exception) {
            response.put("status", "ERROR");
            response.put("message", exception.getMessage());
        }

        return response;
    }

    private String extractTransactionId(String message) {
        if (message == null) {
            return null;
        }

        String token = "transactionId=";
        int index = message.indexOf(token);

        if (index < 0) {
            return null;
        }

        return message.substring(index + token.length()).trim();
    }
}
```

```java
package com.mvp.controller.prototypes;

import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class TestMongodbTransactionsService {

    private static final String COLLECTION_NAME = "Media";

    private final MongoTemplate mongoTemplate;

    public TestMongodbTransactionsService(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
        System.out.println("00000000010:TestMongodbTransactionsService charge");
    }

    @Transactional
    public String create7() {
        String transactionId = UUID.randomUUID().toString();

        mongoTemplate.insert(buildMediaDocument("Dune", "Film", 2021, transactionId), COLLECTION_NAME);
        mongoTemplate.insert(buildMediaDocument("Inception", "Film", 2010, transactionId), COLLECTION_NAME);
        mongoTemplate.insert(buildMediaDocument("Interstellar", "Film", 2014, transactionId), COLLECTION_NAME);
        mongoTemplate.insert(buildMediaDocument("Tenet", "Film", 2020, transactionId), COLLECTION_NAME);
        mongoTemplate.insert(buildMediaDocument("Blade Runner 2049", "Film", 2017, transactionId), COLLECTION_NAME);
        mongoTemplate.insert(buildMediaDocument("Arrival", "Film", 2016, transactionId), COLLECTION_NAME);
        mongoTemplate.insert(buildMediaDocument("The Dark Knight", "Film", 2008, transactionId), COLLECTION_NAME);

        return transactionId;
    }

    @Transactional
    public String rollback7() {
        String transactionId = UUID.randomUUID().toString();

        mongoTemplate.insert(buildMediaDocument("Dune", "Film", 2021, transactionId), COLLECTION_NAME);
        mongoTemplate.insert(buildMediaDocument("Inception", "Film", 2010, transactionId), COLLECTION_NAME);
        mongoTemplate.insert(buildMediaDocument("Interstellar", "Film", 2014, transactionId), COLLECTION_NAME);
        mongoTemplate.insert(buildMediaDocument("Tenet", "Film", 2020, transactionId), COLLECTION_NAME);
        mongoTemplate.insert(buildMediaDocument("Blade Runner 2049", "Film", 2017, transactionId), COLLECTION_NAME);
        mongoTemplate.insert(buildMediaDocument("Arrival", "Film", 2016, transactionId), COLLECTION_NAME);
        mongoTemplate.insert(buildMediaDocument("The Dark Knight", "Film", 2008, transactionId), COLLECTION_NAME);

        throw new RuntimeException("rollback volontaire apres insertion de 7 documents media transactionId=" + transactionId);
    }

    public long countAll() {
        return mongoTemplate.collectionExists(COLLECTION_NAME)
                ? mongoTemplate.getCollection(COLLECTION_NAME).countDocuments()
                : 0;
    }

    public long countByTransactionId(String transactionId) {
        return mongoTemplate.collectionExists(COLLECTION_NAME)
                ? mongoTemplate.getCollection(COLLECTION_NAME).countDocuments(new Document("transactionId", transactionId))
                : 0;
    }

    public List<Document> findByTransactionId(String transactionId) {
        return mongoTemplate.collectionExists(COLLECTION_NAME)
                ? mongoTemplate.getCollection(COLLECTION_NAME)
                .find(new Document("transactionId", transactionId))
                .into(new ArrayList<>())
                : new ArrayList<>();
    }

    public List<Document> findAll(int limit) {
        return mongoTemplate.collectionExists(COLLECTION_NAME)
                ? mongoTemplate.getCollection(COLLECTION_NAME)
                .find()
                .limit(limit)
                .into(new ArrayList<>())
                : new ArrayList<>();
    }

    public String getCollectionName() {
        return COLLECTION_NAME;
    }

    private Document buildMediaDocument(String nom, String type, int annee, String transactionId) {
        Document document = new Document();
        document.put("nom", nom);
        document.put("type", type);
        document.put("annee", annee);
        document.put("transactionId", transactionId);
        document.put("createdAt", Instant.now().toString());
        return document;
    }
}
```

```text
# LOCAL
http://localhost:3002/test-media-transactions
http://localhost:3002/test-media-transactions-create-7
http://localhost:3002/test-media-transactions-rollback-7
http://localhost:3002/test-media-transactions-details

# DEV
http://localhost:3001/test-media-transactions
http://localhost:3001/test-media-transactions-create-7
http://localhost:3001/test-media-transactions-rollback-7
http://localhost:3001/test-media-transactions-details
```


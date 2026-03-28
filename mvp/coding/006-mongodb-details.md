```java
package com.mvp.controller.prototypes;

import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
public class TestMongoDetailsController {

    private final MongoTemplate mongoTemplate;

    public TestMongoDetailsController(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
        System.out.println("00000000007:TestMongoDetailsController charge");
    }

    @GetMapping("/test-mongo-details")
    public Map<String, Object> testMongoSummary() {
        System.out.println("00000000007:/test-mongo-details appele");

        Map<String, Object> response = new LinkedHashMap<>();

        try {
            MongoDatabase database = mongoTemplate.getDb();
            Document pingResult = database.runCommand(new Document("ping", 1));
            Document dbStats = database.runCommand(new Document("dbStats", 1));

            List<String> collectionNames = mongoTemplate.getCollectionNames().stream().sorted().toList();
            List<Map<String, Object>> collections = new ArrayList<>();

            for (String collectionName : collectionNames) {
                long documentCount = mongoTemplate.getCollection(collectionName).countDocuments();

                Document collStats;
                try {
                    collStats = database.runCommand(new Document("collStats", collectionName));
                } catch (Exception exception) {
                    collStats = new Document();
                }

                Map<String, Object> collection = new LinkedHashMap<>();
                collection.put("name", collectionName);
                collection.put("documents", documentCount);
                collection.put("size", collStats.get("size"));
                collection.put("storageSize", collStats.get("storageSize"));
                collection.put("indexes", collStats.get("nindexes"));

                collections.add(collection);
            }

            response.put("status", "OK");
            response.put("database", database.getName());
            response.put("ping", pingResult.get("ok"));
            response.put("collectionsCount", collectionNames.size());
            response.put("dataSize", dbStats.get("dataSize"));
            response.put("storageSize", dbStats.get("storageSize"));
            response.put("indexes", dbStats.get("indexes"));
            response.put("collections", collections);
        } catch (Exception exception) {
            response.put("status", "ERROR");
            response.put("message", exception.getMessage());
        }

        return response;
    }

    @GetMapping("/test-mongo-details/{collectionName}")
    public Map<String, Object> testMongoCollectionDetails(@PathVariable String collectionName) {
        System.out.println("00000000007:/test-mongo-details/" + collectionName + " appele");

        Map<String, Object> response = new LinkedHashMap<>();

        try {
            MongoDatabase database = mongoTemplate.getDb();

            if (!mongoTemplate.collectionExists(collectionName)) {
                response.put("status", "ERROR");
                response.put("message", "collection introuvable");
                response.put("collection", collectionName);
                return response;
            }

            long documentCount = mongoTemplate.getCollection(collectionName).countDocuments();

            Document collStats;
            try {
                collStats = database.runCommand(new Document("collStats", collectionName));
            } catch (Exception exception) {
                collStats = new Document();
            }

            List<Document> samples = mongoTemplate.getCollection(collectionName)
                    .find()
                    .limit(5)
                    .into(new ArrayList<>());

            response.put("status", "OK");
            response.put("database", database.getName());
            response.put("collection", collectionName);
            response.put("documents", documentCount);
            response.put("size", collStats.get("size"));
            response.put("storageSize", collStats.get("storageSize"));
            response.put("indexes", collStats.get("nindexes"));
            response.put("samples", samples);
        } catch (Exception exception) {
            response.put("status", "ERROR");
            response.put("message", exception.getMessage());
        }

        return response;
    }
}
```java

```text
# LOCAL
http://localhost:3002
http://localhost:3002/test
http://localhost:3002/test-profile-controller
http://localhost:3002/test-mongodb-controller
http://localhost:3002/test-mongodb-config
http://localhost:3002/test-mongo-simple
http://localhost:3002/test-mongo-details
http://localhost:3002/test-mongo-details/Produit

# DEV
http://localhost:3001
http://localhost:3001/test
http://localhost:3001/test-profile-controller
http://localhost:3001/test-mongodb-controller
http://localhost:3001/test-mongodb-config
http://localhost:3001/test-mongo-simple
http://localhost:3001/test-mongo-details
http://localhost:3001/test-mongo-details/Produit
```
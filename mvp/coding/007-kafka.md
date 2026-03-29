```xml
        <dependency>
            <groupId>org.springframework.kafka</groupId>
            <artifactId>spring-kafka</artifactId>
        </dependency>
        <dependency>
            <groupId>org.apache.kafka</groupId>
            <artifactId>kafka-clients</artifactId>
            <version>4.1.1</version>
        </dependency>

        <dependency>
            <groupId>io.confluent</groupId>
            <artifactId>kafka-avro-serializer</artifactId>
            <version>8.1.1</version>
        </dependency>
        <dependency>
            <groupId>io.micrometer</groupId>
            <artifactId>micrometer-core</artifactId>
        </dependency>
```


# Commande
```text
docker compose -f docker-compose.kafka.yml up -d
```

```text
http://localhost:8085
```

```text
créer un topic de test
Topics puis :
bouton Create topic
nom : test-topic
partitions : 1
replication factor : 1
```

# application-dev.yml
```yaml
server:
  port: 3001

spring:
  application:
    name: mvp-starter-dev
  config:
    import:
      - optional:file:./config-local/librairie/mongodb.yml
      - optional:file:./config-local/librairie/kafka-dmon.yml

custom:
  api-url: http://localhost:3001/api
  message: configuration du profil dev

```

# kafka-dmon.yml
```yaml
spring:
  config:
    activate:
      on-profile: dev
  kafka:
    consumer:
      auto-offset-reset: earliest

bootstrap.servers: localhost:9092

consumer.sasl.mechanism: SCRAM-SHA-512
consumer.sasl.jaas.config: ""

schema.registry.url: http://localhost:8081
schema.registry.basic.auth.user.info: ""

kafka:
  record:
    concurrency: 1
    backoff:
      interval: 1000
      maxAttempts: 1
```


```java
package com.mvp.controller.prototypes;

import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestKafkaConfigController {

    @Value("${bootstrap.servers}")
    private String bootstrapServers;

    @Value("${consumer.sasl.mechanism}")
    private String saslMechanism;

    @Value("${consumer.sasl.jaas.config}")
    private String saslJaasConfig;

    @Value("${schema.registry.url}")
    private String schemaRegistryUrl;

    @Value("${schema.registry.basic.auth.user.info}")
    private String schemaRegistryUserInfo;

    @Value("${kafka.record.concurrency}")
    private Integer concurrency;

    @Value("${kafka.record.backoff.interval}")
    private Long backoffInterval;

    @Value("${kafka.record.backoff.maxAttempts}")
    private Long maxAttempts;

    @Value("${spring.kafka.consumer.auto-offset-reset}")
    private String autoOffsetReset;

    @GetMapping("/test-kafka-config")
    public Map<String, Object> getKafkaConfig() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("bootstrap.servers", bootstrapServers);
        response.put("consumer.sasl.mechanism", saslMechanism);
        response.put("consumer.sasl.jaas.config", saslJaasConfig);
        response.put("schema.registry.url", schemaRegistryUrl);
        response.put("schema.registry.basic.auth.user.info", schemaRegistryUserInfo);
        response.put("kafka.record.concurrency", concurrency);
        response.put("kafka.record.backoff.interval", backoffInterval);
        response.put("kafka.record.backoff.maxAttempts", maxAttempts);
        response.put("spring.kafka.consumer.auto-offset-reset", autoOffsetReset);
        return response;
    }
}
```


```java
package com.mvp.controller.prototypes;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Properties;
import java.util.concurrent.TimeUnit;
import org.apache.kafka.clients.admin.AdminClient;
import org.apache.kafka.clients.admin.DescribeClusterResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestKafkaConnectionController {

    @Value("${bootstrap.servers}")
    private String bootstrapServers;

    @Value("${consumer.sasl.mechanism}")
    private String saslMechanism;

    @Value("${consumer.sasl.jaas.config}")
    private String saslJaasConfig;

    @GetMapping("/test-kafka-connection")
    public Map<String, Object> testKafkaConnection() {
        Map<String, Object> response = new LinkedHashMap<>();

        Properties props = new Properties();
        props.put("bootstrap.servers", bootstrapServers);
        props.put("request.timeout.ms", "3000");
        props.put("default.api.timeout.ms", "3000");
        props.put("socket.connection.setup.timeout.ms", "2000");
        props.put("socket.connection.setup.timeout.max.ms", "3000");
        props.put("connections.max.idle.ms", "3000");
        props.put("retries", "0");

        if (saslMechanism != null && !saslMechanism.isBlank()) {
            props.put("security.protocol", "SASL_SSL");
            props.put("sasl.mechanism", saslMechanism);
        }

        if (saslJaasConfig != null && !saslJaasConfig.isBlank()) {
            props.put("sasl.jaas.config", saslJaasConfig);
        }

        try (AdminClient adminClient = AdminClient.create(props)) {
            DescribeClusterResult clusterResult = adminClient.describeCluster();

            String clusterId = clusterResult.clusterId().get(3, TimeUnit.SECONDS);
            int nodeCount = clusterResult.nodes().get(3, TimeUnit.SECONDS).size();

            response.put("success", true);
            response.put("message", "Connexion Kafka OK");
            response.put("bootstrap.servers", bootstrapServers);
            response.put("clusterId", clusterId);
            response.put("nodeCount", nodeCount);
            return response;
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Connexion Kafka KO");
            response.put("bootstrap.servers", bootstrapServers);
            response.put("error", e.getClass().getSimpleName());
            response.put("details", e.getMessage());
            return response;
        }
    }
}
```

```java
package com.mvp.controller.prototypes;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Properties;
import java.util.Set;
import java.util.TreeSet;
import java.util.concurrent.TimeUnit;
import org.apache.kafka.clients.admin.AdminClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestKafkaTopicsController {

    @Value("${bootstrap.servers}")
    private String bootstrapServers;

    @Value("${consumer.sasl.mechanism}")
    private String saslMechanism;

    @Value("${consumer.sasl.jaas.config}")
    private String saslJaasConfig;

    @GetMapping("/test-kafka-topics")
    public Map<String, Object> getKafkaTopics() {
        Map<String, Object> response = new LinkedHashMap<>();

        Properties props = new Properties();
        props.put("bootstrap.servers", bootstrapServers);
        props.put("request.timeout.ms", "3000");
        props.put("default.api.timeout.ms", "3000");
        props.put("socket.connection.setup.timeout.ms", "2000");
        props.put("socket.connection.setup.timeout.max.ms", "3000");
        props.put("retries", "0");

        if (saslMechanism != null && !saslMechanism.isBlank()) {
            props.put("security.protocol", "SASL_SSL");
            props.put("sasl.mechanism", saslMechanism);
        }

        if (saslJaasConfig != null && !saslJaasConfig.isBlank()) {
            props.put("sasl.jaas.config", saslJaasConfig);
        }

        try (AdminClient adminClient = AdminClient.create(props)) {
            Set<String> topics = new TreeSet<>(adminClient.listTopics().names().get(3, TimeUnit.SECONDS));

            response.put("success", true);
            response.put("message", "Lecture des topics OK");
            response.put("bootstrap.servers", bootstrapServers);
            response.put("count", topics.size());
            response.put("topics", topics);
            return response;
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Lecture des topics KO");
            response.put("bootstrap.servers", bootstrapServers);
            response.put("error", e.getClass().getSimpleName());
            response.put("details", e.getMessage());
            return response;
        }
    }
}
```

```text
http://localhost:3001
http://localhost:3001/test
http://localhost:3001/test-profile-controller
http://localhost:3001/test-mongodb-controller
http://localhost:3001/test-mongodb-config
http://localhost:3001/test-mongo-simple
http://localhost:3001/test-mongo-details
http://localhost:3001/test-mongo-details/Produit
http://localhost:3001/test-kafka-config
http://localhost:3001/test-kafka-connection
http://localhost:3001/test-kafka-topics
```





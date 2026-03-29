# Commande
```text
docker compose -f docker-compose.kafka.yml up -d
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




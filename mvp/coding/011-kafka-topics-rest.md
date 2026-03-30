```text
http://localhost:3001/test-kafka-details/XXXX
```

```json
{"id":"motif-001","type":"MOTIF","code":"MOT66666","valeur":"OM toto Créé","timestamp":"2026-03-30T10:00:00"}
```

```text
# DEV
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
http://localhost:3001/test-mongodb-rest
http://localhost:3001/test-mongodb-service
http://localhost:3001//test-mongodb-implement
http://localhost:3001/test-mongodb-repository
http://localhost:3001/test-mongodb-dto
http://localhost:3001/test-kafka-details/topic-name
http://localhost:3001/test-kafka-topics-rest/read
http://localhost:3001/test-kafka-topics-rest/create/topic-name-test
http://localhost:3001/test-kafka-topics-rest/read/topic-name-test
```

```java
package com.mvp.controller.prototypes;

import java.time.Duration;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.UUID;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestKafkaDetailsController {

    @Value("${bootstrap.servers}")
    private String bootstrapServers;

    @Value("${consumer.sasl.mechanism:}")
    private String saslMechanism;

    @Value("${consumer.sasl.jaas.config:}")
    private String saslJaasConfig;

    @GetMapping("/test-kafka-details/{topic}")
    public Map<String, Object> getKafkaDetails(@PathVariable String topic) {
        Map<String, Object> response = new LinkedHashMap<>();

        Properties props = new Properties();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "test-kafka-details-" + UUID.randomUUID());
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, "false");
        props.put(ConsumerConfig.REQUEST_TIMEOUT_MS_CONFIG, "3000");
        props.put(ConsumerConfig.DEFAULT_API_TIMEOUT_MS_CONFIG, "3000");
        props.put(ConsumerConfig.SESSION_TIMEOUT_MS_CONFIG, "3000");

        if (saslMechanism != null && !saslMechanism.isBlank()) {
            props.put("security.protocol", "SASL_SSL");
            props.put("sasl.mechanism", saslMechanism);
        }

        if (saslJaasConfig != null && !saslJaasConfig.isBlank()) {
            props.put("sasl.jaas.config", saslJaasConfig);
        }

        try (KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props)) {
            consumer.subscribe(List.of(topic));

            ConsumerRecords<String, String> records = consumer.poll(Duration.ofSeconds(3));

            List<Map<String, Object>> messages = new ArrayList<>();

            for (ConsumerRecord<String, String> record : records) {
                Map<String, Object> message = new LinkedHashMap<>();
                message.put("topic", record.topic());
                message.put("partition", record.partition());
                message.put("offset", record.offset());
                message.put("timestamp", record.timestamp());
                message.put("key", record.key());
                message.put("value", record.value());
                messages.add(message);
            }

            response.put("success", true);
            response.put("message", "Lecture des messages OK");
            response.put("bootstrap.servers", bootstrapServers);
            response.put("topic", topic);
            response.put("count", messages.size());
            response.put("messages", messages);
            return response;
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Lecture des messages KO");
            response.put("bootstrap.servers", bootstrapServers);
            response.put("topic", topic);
            response.put("error", e.getClass().getSimpleName());
            response.put("details", e.getMessage());
            return response;
        }
    }
}
```
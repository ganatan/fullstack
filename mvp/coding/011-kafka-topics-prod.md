```yml
bootstrap:
  servers: localhost:9092

producer:
  topic:
    media: media-topic
```

```java
package com.mvp.controller.prototypes;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Properties;
import java.util.Set;
import java.util.TreeSet;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import org.apache.kafka.clients.admin.AdminClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestKafkaTopicsController {

    private final KafkaTemplate<String, String> kafkaTemplate;

    @Value("${bootstrap.servers}")
    private String bootstrapServers;

    @Value("${producer.topic.media}")
    private String mediaTopic;

    @Value("${consumer.sasl.mechanism:}")
    private String saslMechanism;

    @Value("${consumer.sasl.jaas.config:}")
    private String saslJaasConfig;

    public TestKafkaTopicsController(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @GetMapping("/test-kafka-topics-producer")
    public Map<String, Object> writeKafkaTopic() {
        Map<String, Object> response = new LinkedHashMap<>();

        String id = UUID.randomUUID().toString();
        String payload = """
            {
              "id": "%s",
              "nom": "Inception",
              "type": "FILM"
            }
            """.formatted(id);

        try {
            kafkaTemplate.send(mediaTopic, id, payload).get();

            response.put("success", true);
            response.put("message", "Ecriture topic media OK");
            response.put("topic", mediaTopic);
            response.put("key", id);
            response.put("payload", payload);
            return response;
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Ecriture topic media KO");
            response.put("topic", mediaTopic);
            response.put("error", e.getClass().getSimpleName());
            response.put("details", e.getMessage());
            return response;
        }
    }

    @GetMapping("/test-kafka-topics-consumer")
    public Map<String, Object> readKafkaTopics() {
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
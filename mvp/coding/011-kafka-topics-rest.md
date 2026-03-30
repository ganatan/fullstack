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
http://localhost:3001/test-kafka-topics-rest
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
import java.util.Set;
import java.util.TreeSet;
import java.util.concurrent.TimeUnit;
import org.apache.kafka.clients.admin.AdminClient;
import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.common.TopicPartition;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestKafkaTopicsRestController {

    @Value("${bootstrap.servers}")
    private String bootstrapServers;

    @GetMapping("/test-kafka-topics-rest")
    public Map<String, Object> getKafkaTopics() {
        Map<String, Object> response = new LinkedHashMap<>();

        Properties props = new Properties();
        props.put("bootstrap.servers", bootstrapServers);

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

    @GetMapping("/test-kafka-topics-rest/create/{topic}")
    public Map<String, Object> createKafkaTopic(@PathVariable String topic) {
        Map<String, Object> response = new LinkedHashMap<>();

        Properties props = new Properties();
        props.put("bootstrap.servers", bootstrapServers);

        try (AdminClient adminClient = AdminClient.create(props)) {
            NewTopic newTopic = new NewTopic(topic, 1, (short) 1);
            adminClient.createTopics(List.of(newTopic)).all().get(3, TimeUnit.SECONDS);

            response.put("success", true);
            response.put("message", "Création du topic OK");
            response.put("bootstrap.servers", bootstrapServers);
            response.put("topic", topic);
            return response;
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Création du topic KO");
            response.put("bootstrap.servers", bootstrapServers);
            response.put("topic", topic);
            response.put("error", e.getClass().getSimpleName());
            response.put("details", e.getMessage());
            return response;
        }
    }

    @GetMapping("/test-kafka-topics-rest/read/{topic}")
    public Map<String, Object> readKafkaTopic(@PathVariable String topic) {
        Map<String, Object> response = new LinkedHashMap<>();

        Properties props = new Properties();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "test-kafka-topics-read");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, "false");

        try (KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props)) {
            TopicPartition partition = new TopicPartition(topic, 0);

            consumer.assign(List.of(partition));
            consumer.seekToBeginning(List.of(partition));

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
            response.put("message", "Lecture du topic OK");
            response.put("bootstrap.servers", bootstrapServers);
            response.put("topic", topic);
            response.put("count", messages.size());
            response.put("messages", messages);
            return response;
        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Lecture du topic KO");
            response.put("bootstrap.servers", bootstrapServers);
            response.put("topic", topic);
            response.put("error", e.getClass().getSimpleName());
            response.put("details", e.getMessage());
            return response;
        }
    }
}
```
# 008-springboot-logging-elk.md — Spring Boot → ELK (2 approches) — ElkLoggingController / LogstashLoggingController

## Règle (5 lignes)

- ELK = Elasticsearch (stockage + search) + Kibana (UI) + Logstash (ingestion).
- Écrire “direct” dans Elasticsearch = simple à comprendre, utile pour tests/démos.
- En prod, on envoie plutôt les logs vers Logstash/Agent, qui normalise puis indexe.
- Un controller `GET` sert juste à déclencher un log et vérifier le pipeline.
- Tester = appeler l’endpoint puis vérifier l’index via `curl _search`.

---

## Objectif

Avoir 2 endpoints de test :

1) **Direct Elasticsearch**
- `GET /api/log/elk` → écrit un document dans Elasticsearch (index `app-logs`)

2) **Via Logstash**
- `GET /api/log/logstash` → envoie un JSON à Logstash (HTTP), Logstash écrit dans Elasticsearch (index `app-logs`)

---

## Prérequis

- Docker + Docker Compose
- Java 21
- Spring Boot 3.5.x
- Ports libres :
  - Elasticsearch : `9200`
  - Kibana : `5601`
  - Logstash (HTTP input) : `8088`

---

## Docker (Elasticsearch + Kibana + Logstash)

### Fichiers

```
docker/compose.elk.yml
docker/logstash/pipeline/logstash.conf
```

### docker/compose.elk.yml

```yml
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.12.2
    container_name: ganatan-elasticsearch
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - ES_JAVA_OPTS=-Xms512m -Xmx512m
    ports:
      - "9200:9200"
      - "9300:9300"

  kibana:
    image: docker.elastic.co/kibana/kibana:8.12.2
    container_name: ganatan-kibana
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch

  logstash:
    image: docker.elastic.co/logstash/logstash:8.12.2
    container_name: ganatan-logstash
    environment:
      - xpack.monitoring.enabled=false
      - LS_JAVA_OPTS=-Xms256m -Xmx256m
    ports:
      - "8088:8088"
      - "9600:9600"
    volumes:
      - ./logstash/pipeline:/usr/share/logstash/pipeline
    depends_on:
      - elasticsearch
```

### docker/logstash/pipeline/logstash.conf

- Input HTTP : `POST http://localhost:8088/log`
- Output Elasticsearch : index `app-logs`

```conf
input {
  http {
    port => 8088
    additional_codecs => { "application/json" => "json" }
    response_code => 200
  }
}

output {
  elasticsearch {
    hosts => ["http://elasticsearch:9200"]
    index => "app-logs"
  }
}
```

Démarrer :

```bash
docker compose -f docker/compose.elk.yml up -d
```

Vérifier :

```bash
curl -s http://localhost:9200
```

Kibana :
- http://localhost:5601

---

## Dépendances Maven

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-test</artifactId>
  <scope>test</scope>
</dependency>
```

---

## Configuration

`src/main/resources/application.properties`

```properties
server.port=3000
app.elasticsearch.url=http://localhost:9200
app.logstash.url=http://localhost:8088
```

---

## Controller 1 — Direct Elasticsearch

`src/main/java/com/ganatan/starter/api/logging/ElkLoggingController.java`

```java
package com.ganatan.starter.api.logging;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;

@RestController
public class ElkLoggingController {

    private static final String INDEX = "app-logs";
    private static final ParameterizedTypeReference<Map<String, Object>> MAP = new ParameterizedTypeReference<>() {};

    private final RestClient es;

    public ElkLoggingController(@Value("${app.elasticsearch.url}") String baseUrl, RestClient.Builder builder) {
        this.es = builder.baseUrl(baseUrl).build();
    }

    @GetMapping("/api/log/elk")
    public Map<String, Object> writeToElasticsearch() {
        String id = UUID.randomUUID().toString();

        Map<String, Object> doc = Map.of(
                "@timestamp", Instant.now().toString(),
                "level", "INFO",
                "source", "elk-controller",
                "message", "hello from springboot",
                "traceId", "abc123"
        );

        Map<String, Object> resp = es.post()
                .uri("/" + INDEX + "/_doc/" + id)
                .contentType(MediaType.APPLICATION_JSON)
                .body(doc)
                .retrieve()
                .body(MAP);

        return Map.of("index", INDEX, "id", id, "result", resp);
    }
}
```

---

## Controller 2 — Via Logstash (HTTP)

`src/main/java/com/ganatan/starter/api/logging/LogstashLoggingController.java`

```java
package com.ganatan.starter.api.logging;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;

@RestController
public class LogstashLoggingController {

    private static final ParameterizedTypeReference<Map<String, Object>> MAP = new ParameterizedTypeReference<>() {};

    private final RestClient logstash;

    public LogstashLoggingController(@Value("${app.logstash.url}") String baseUrl, RestClient.Builder builder) {
        this.logstash = builder.baseUrl(baseUrl).build();
    }

    @GetMapping("/api/log/logstash")
    public Map<String, Object> writeToLogstash() {
        String id = UUID.randomUUID().toString();

        Map<String, Object> doc = Map.of(
                "@timestamp", Instant.now().toString(),
                "level", "INFO",
                "source", "logstash-controller",
                "message", "hello via logstash",
                "traceId", "abc123",
                "eventId", id
        );

        Map<String, Object> resp = logstash.post()
                .uri("/log")
                .contentType(MediaType.APPLICATION_JSON)
                .body(doc)
                .retrieve()
                .body(MAP);

        return Map.of("sent", true, "eventId", id, "logstashResponse", resp);
    }
}
```

---

## Vérification Elasticsearch (les 2 approches écrivent dans `app-logs`)

Lister index :

```bash
curl -s "http://localhost:9200/_cat/indices?v"
```

Rechercher :

```bash
curl -s "http://localhost:9200/app-logs/_search?pretty"   -H "Content-Type: application/json"   -d "{"size":10,"sort":[{"@timestamp":{"order":"desc"}}],"query":{"match_all":{}}}"
```

---

## Test rapide (manuel)

1) Direct ES :

```bash
curl -s http://localhost:3000/api/log/elk
```

2) Via Logstash :

```bash
curl -s http://localhost:3000/api/log/logstash
```

3) Vérifier dans ES :

```bash
curl -s "http://localhost:9200/app-logs/_search?pretty" -H "Content-Type: application/json" -d "{"query":{"match_all":{}}}"
```

---

## Tests (Mock) — 1 test par controller

### Test 1 — ElkLoggingControllerTests

`src/test/java/com/ganatan/starter/api/logging/ElkLoggingControllerTests.java`

```java
package com.ganatan.starter.api.logging;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.client.RestClientTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.client.MockRestServiceServer;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.http.HttpMethod.POST;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

@RestClientTest(ElkLoggingController.class)
@TestPropertySource(properties = "app.elasticsearch.url=http://localhost:9200")
class ElkLoggingControllerTests {

    @Autowired
    private ElkLoggingController controller;

    @Autowired
    private MockRestServiceServer server;

    @Test
    void writeToElasticsearch_posts_doc() {
        server.expect(requestTo(org.hamcrest.Matchers.matchesPattern(".*/app-logs/_doc/.*")))
                .andExpect(method(POST))
                .andRespond(withSuccess("{"result":"created"}", MediaType.APPLICATION_JSON));

        var result = controller.writeToElasticsearch();

        assertThat(result.get("index")).isEqualTo("app-logs");
        assertThat(result.get("id")).isNotNull();
        assertThat(String.valueOf(result.get("result"))).contains("created");

        server.verify();
    }
}
```

### Test 2 — LogstashLoggingControllerTests

`src/test/java/com/ganatan/starter/api/logging/LogstashLoggingControllerTests.java`

```java
package com.ganatan.starter.api.logging;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.client.RestClientTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.client.MockRestServiceServer;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.http.HttpMethod.POST;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

@RestClientTest(LogstashLoggingController.class)
@TestPropertySource(properties = "app.logstash.url=http://localhost:8088")
class LogstashLoggingControllerTests {

    @Autowired
    private LogstashLoggingController controller;

    @Autowired
    private MockRestServiceServer server;

    @Test
    void writeToLogstash_posts_to_log_endpoint() {
        server.expect(requestTo("http://localhost:8088/log"))
                .andExpect(method(POST))
                .andRespond(withSuccess("{"ok":true}", MediaType.APPLICATION_JSON));

        var result = controller.writeToLogstash();

        assertThat(result.get("sent")).isEqualTo(true);
        assertThat(result.get("eventId")).isNotNull();
        assertThat(String.valueOf(result.get("logstashResponse"))).contains("true");

        server.verify();
    }
}
```

Exécuter :

```bash
mvn -Dtest=ElkLoggingControllerTests test
mvn -Dtest=LogstashLoggingControllerTests test
```

---

## Kibana (option)

1) http://localhost:5601  
2) Stack Management → Data Views → Create data view  
3) Pattern : `app-logs*`  
4) Timestamp : `@timestamp`  
5) Discover → tu vois tes docs

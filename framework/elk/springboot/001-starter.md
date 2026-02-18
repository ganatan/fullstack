# 002-springboot-elk-springboot.md — ELK + Spring Boot — test minimal avec ElasticController

## Objectif

- Lancer Elasticsearch + Kibana en local (Docker)
- Depuis Spring Boot : indexer un document dans Elasticsearch + faire une recherche
- Endpoints :
  - `GET /api/elastic/index` : crée un document dans l’index `logs-starter`
  - `GET /api/elastic/search` : retourne les derniers documents

---

## Prérequis

- Docker + Docker Compose
- Java 21
- Spring Boot 3.5.x
- Ports libres : Elasticsearch `9200`, Kibana `5601`

---

## Docker (Elasticsearch + Kibana)

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
```

---

## Controller

`src/main/java/com/ganatan/starter/api/elk/ElasticController.java`

```java
package com.ganatan.starter.api.elk;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;

@RestController
public class ElasticController {

    private static final String INDEX = "logs-starter";

    private final RestClient restClient;

    public ElasticController(@Value("${app.elasticsearch.url}") String baseUrl, RestClient.Builder builder) {
        this.restClient = builder.baseUrl(baseUrl).build();
    }

    @GetMapping("/api/elastic/index")
    public Map<String, Object> index() {
        String id = UUID.randomUUID().toString();

        Map<String, Object> doc = Map.of(
                "@timestamp", Instant.now().toString(),
                "level", "INFO",
                "service", "springboot-starter",
                "message", "hello elk",
                "traceId", "abc123"
        );

        Map<String, Object> resp = restClient.post()
                .uri("/" + INDEX + "/_doc/" + id)
                .contentType(MediaType.APPLICATION_JSON)
                .body(doc)
                .retrieve()
                .body(Map.class);

        return Map.of(
                "index", INDEX,
                "id", id,
                "result", resp
        );
    }

    @GetMapping("/api/elastic/search")
    public Map<String, Object> search() {
        Map<String, Object> query = Map.of(
                "size", 10,
                "sort", java.util.List.of(Map.of("@timestamp", Map.of("order", "desc"))),
                "query", Map.of("match_all", Map.of())
        );

        Map<String, Object> resp = restClient.post()
                .uri("/" + INDEX + "/_search")
                .contentType(MediaType.APPLICATION_JSON)
                .body(query)
                .retrieve()
                .body(Map.class);

        return Map.of(
                "index", INDEX,
                "response", resp
        );
    }
}
```

---

## Test (1 seul test)

But : vérifier que le controller appelle bien Elasticsearch sur les bonnes URLs.

`src/test/java/com/ganatan/starter/api/elk/ElasticControllerTests.java`

```java
package com.ganatan.starter.api.elk;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.client.RestClientTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;
import static org.springframework.http.HttpMethod.POST;

@RestClientTest(ElasticController.class)
class ElasticControllerTests {

    @Autowired
    private ElasticController controller;

    @Autowired
    private MockRestServiceServer server;

    @Test
    void index_calls_elasticsearch_and_returns_result() {
        server.expect(requestTo(org.hamcrest.Matchers.matchesPattern(".*/logs-starter/_doc/.*")))
                .andExpect(method(POST))
                .andRespond(withSuccess("{"result":"created"}", MediaType.APPLICATION_JSON));

        var result = controller.index();

        assertThat(result.get("index")).isEqualTo("logs-starter");
        assertThat(result.get("id")).isNotNull();
        assertThat(result.get("result").toString()).contains("created");

        server.verify();
    }
}
```

---

## Test rapide (manuel)

Indexer :

```bash
curl -s http://localhost:3000/api/elastic/index
```

Chercher :

```bash
curl -s http://localhost:3000/api/elastic/search
```

---

## Kibana (voir les documents)

1) http://localhost:5601
2) Stack Management → Data Views → Create data view
3) Pattern : `logs-starter*`
4) Timestamp : `@timestamp`
5) Discover → tu vois tes docs

---

## Exécuter le test

```bash
mvn -Dtest=ElasticControllerTests test
```

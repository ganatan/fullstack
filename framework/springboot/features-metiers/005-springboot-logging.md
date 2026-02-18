# 006-springboot-logging-json.md — springboot-starter-logging-json (Logback prod)

## Règle (5 lignes)

- En prod, tu veux des logs **JSON** pour ingestion ELK / Loki / Datadog.
- Logback est le logger par défaut Spring Boot (via SLF4J).
- Le JSON se fait proprement avec **logstash-logback-encoder**.
- Ici, en profil `prod`, on écrit **dans un fichier** (`./logs/app.json`).
- Tester = appeler `/api/log` puis vérifier le fichier.

---

## Objectif

- Profil `dev` : logs texte (console lisible)
- Profil `prod` : logs JSON dans `./logs/app.json`

Endpoint de démo :
- `GET /api/log` : écrit un log applicatif + renvoie `ok`

---

## Dépendances

### pom.xml

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<dependency>
  <groupId>net.logstash.logback</groupId>
  <artifactId>logstash-logback-encoder</artifactId>
  <version>8.0</version>
</dependency>

<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-test</artifactId>
  <scope>test</scope>
</dependency>
```

---

## Controller

`src/main/java/com/ganatan/starter/api/logging/LoggingController.java`

```java
package com.ganatan.starter.api.logging;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoggingController {

    private static final Logger log = LoggerFactory.getLogger(LoggingController.class);

    @GetMapping("/api/log")
    public String logSomething() {
        log.info("demo-log message={} user={}", "hello", "mulder");
        return "ok";
    }
}
```

---

## Logback (dev vs prod)

`src/main/resources/logback-spring.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>

  <springProperty scope="context" name="APP_NAME" source="spring.application.name" defaultValue="springboot-starter"/>
  <property name="LOG_DIR" value="./logs"/>

  <springProfile name="dev,default">
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
      <encoder>
        <pattern>%d{yyyy-MM-dd'T'HH:mm:ss.SSS} %-5level [%thread] %logger{36} - %msg%n</pattern>
      </encoder>
    </appender>

    <root level="INFO">
      <appender-ref ref="CONSOLE"/>
    </root>
  </springProfile>

  <springProfile name="prod">

    <appender name="JSON_FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
      <file>${LOG_DIR}/app.json</file>

      <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
        <fileNamePattern>${LOG_DIR}/app.%d{yyyy-MM-dd}.json</fileNamePattern>
        <maxHistory>14</maxHistory>
      </rollingPolicy>

      <encoder class="net.logstash.logback.encoder.LoggingEventCompositeJsonEncoder">
        <providers>
          <timestamp>
            <fieldName>@timestamp</fieldName>
            <timeZone>UTC</timeZone>
          </timestamp>
          <logLevel>
            <fieldName>level</fieldName>
          </logLevel>
          <threadName>
            <fieldName>thread</fieldName>
          </threadName>
          <loggerName>
            <fieldName>logger</fieldName>
          </loggerName>
          <message/>
          <mdc/>
          <arguments/>
          <stackTrace/>
          <pattern>
            <pattern>
              {
                "service":"${APP_NAME}"
              }
            </pattern>
          </pattern>
        </providers>
      </encoder>
    </appender>

    <root level="INFO">
      <appender-ref ref="JSON_FILE"/>
    </root>
  </springProfile>

</configuration>
```

---

## Configuration

`src/main/resources/application.properties`

```properties
server.port=3000
spring.application.name=springboot-starter
```

---

## Test

But : vérifier qu’en profil `prod` une ligne JSON est écrite dans `./logs/app.json`.

`src/test/java/com/ganatan/starter/api/logging/LoggingControllerTests.java`

```java
package com.ganatan.starter.api.logging;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("prod")
class LoggingControllerTests {

    @Autowired
    private MockMvc mvc;

    private final Path logFile = Path.of("./logs/app.json");

    @AfterEach
    void cleanup() throws Exception {
        Files.deleteIfExists(logFile);
    }

    @Test
    void logs_are_written_to_json_file() throws Exception {
        Files.createDirectories(logFile.getParent());
        Files.deleteIfExists(logFile);

        mvc.perform(get("/api/log"))
                .andExpect(status().isOk())
                .andExpect(content().string("ok"));

        String content = waitForFileContent(logFile, Duration.ofSeconds(2));

        assertThat(content).contains(""level":"INFO"");
        assertThat(content).contains(""logger":"com.ganatan.starter.api.logging.LoggingController"");
        assertThat(content).contains(""message":"demo-log message=hello user=mulder"");
        assertThat(content).contains(""service":"springboot-starter"");
    }

    private static String waitForFileContent(Path file, Duration timeout) throws Exception {
        long deadline = System.currentTimeMillis() + timeout.toMillis();
        while (System.currentTimeMillis() < deadline) {
            if (Files.exists(file) && Files.size(file) > 0) {
                return Files.readString(file, StandardCharsets.UTF_8);
            }
            Thread.sleep(50);
        }
        return Files.exists(file) ? Files.readString(file, StandardCharsets.UTF_8) : "";
    }
}
```

---

## Lancer et vérifier (manuel)

Prod (JSON fichier) :

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

Appel :

```bash
curl -s http://localhost:3000/api/log
```

Vérifier :
- fichier : `./logs/app.json`
- rotation : `./logs/app.YYYY-MM-DD.json`

---

## Exécuter les tests

```bash
mvn -Dtest=LoggingControllerTests test
```

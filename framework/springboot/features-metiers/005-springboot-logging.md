# 006-springboot-logging-json.md — springboot-starter-logging-json (Logback prod)

## Règle (5 lignes)

- En prod, tu veux des logs **JSON** pour ingestion ELK / Loki / Datadog.
- Logback est le logger par défaut Spring Boot (via SLF4J).
- Le JSON se fait proprement avec **logstash-logback-encoder**.
- On garde du log “lisible” en dev, et du JSON en prod via `logback-spring.xml`.
- Tester = démarrer avec `--spring.profiles.active=prod` et vérifier une ligne JSON.

---

## Objectif

- Profil `dev` : logs texte (console lisible)
- Profil `prod` : logs JSON (une ligne = un JSON)

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
    <appender name="JSON_CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
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
      <appender-ref ref="JSON_CONSOLE"/>
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

But : vérifier qu’en profil `prod` le log contient un JSON (présence de champs clés).

`src/test/java/com/ganatan/starter/api/logging/LoggingControllerProdJsonTests.java`

```java
package com.ganatan.starter.api.logging;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.system.CapturedOutput;
import org.springframework.boot.test.system.OutputCaptureExtension;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import org.junit.jupiter.api.extension.ExtendWith;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("prod")
@ExtendWith(OutputCaptureExtension.class)
class LoggingControllerProdJsonTests {

    @Autowired
    private MockMvc mvc;

    @Test
    void logs_are_json_in_prod(CapturedOutput output) throws Exception {
        mvc.perform(get("/api/log"))
                .andExpect(status().isOk())
                .andExpect(content().string("ok"));

        String out = output.getOut();
        assertThat(out).contains(""level":"INFO"");
        assertThat(out).contains(""logger":"com.ganatan.starter.api.logging.LoggingController"");
        assertThat(out).contains(""message":"demo-log message=hello user=mulder"");
        assertThat(out).contains(""service":"springboot-starter"");
    }
}
```

---

## Lancer et vérifier (manuel)

Dev (texte) :

```bash
mvn spring-boot:run
```

Prod (JSON) :

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

Appel :

```bash
curl -s http://localhost:3000/api/log
```

Attendu en prod : une ligne JSON dans la console, avec `@timestamp`, `level`, `logger`, `message`, `service`.

---

## Exécuter les tests

```bash
mvn -Dtest=LoggingControllerProdJsonTests test
```

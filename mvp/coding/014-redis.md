# Commande
```text
docker compose -f docker-compose.redis.yml up -d
```

```yaml
server:
  port: 3000

spring:
  application:
    name: mvp-starter-default
  data:
    mongodb:
      uri: mongodb://localhost:27017/local
    redis:
      host: 127.0.0.1
      port: 6379
  session:
    store-type: redis

custom:
  api-url: http://localhost:3000/api
  message: configuration du profil default
  param: param profil default uniquement
```


```java
package com.mvp.controller.prototypes;

import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestRedisController {

    private final StringRedisTemplate redisTemplate;
    private final RedisConnectionFactory redisConnectionFactory;

    public TestRedisController(StringRedisTemplate redisTemplate, RedisConnectionFactory redisConnectionFactory) {
        this.redisTemplate = redisTemplate;
        this.redisConnectionFactory = redisConnectionFactory;
    }

    @GetMapping("/test-redis-controller")
    public Map<String, Object> testConnection() {
        Map<String, Object> response = new LinkedHashMap<>();

        try (RedisConnection connection = redisConnectionFactory.getConnection()) {
            String ping = connection.ping();

            redisTemplate.opsForValue().set("test:redis:controller", "ok");
            String value = redisTemplate.opsForValue().get("test:redis:controller");

            Long dbSize = connection.dbSize();
            Boolean exists = connection.keyCommands().exists("test:redis:controller".getBytes(StandardCharsets.UTF_8));

            response.put("status", "OK");
            response.put("host", "127.0.0.1");
            response.put("port", 6379);
            response.put("ping", ping);
            response.put("key", "test:redis:controller");
            response.put("value", value);
            response.put("exists", exists);
            response.put("dbSize", dbSize);
        } catch (Exception exception) {
            response.put("status", "ERROR");
            response.put("message", exception.getMessage());
        }

        return response;
    }
}
```
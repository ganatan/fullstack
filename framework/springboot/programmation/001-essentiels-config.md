
## application.properties
```properties
server.port=8080
spring.application.name=media-api
spring.datasource.url=jdbc:postgresql://localhost:5432/backend_media
```

## application.yml

```yaml
server:
  port: 8080

spring:
  application:
    name: media-api
  datasource:
    url: jdbc:postgresql://localhost:5432/backend_media
    username: postgres
    password: postgres
```

### Constantes
```java
package com.mvp.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
public class RootController {
    @GetMapping
    public String root() {
        return "root";
    }

    @GetMapping("/test")
    public String rootTest() {
        return "rootTest";
    }
}
```
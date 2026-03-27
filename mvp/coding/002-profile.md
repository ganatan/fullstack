# Configuration
mvp-starter/
  config-local/
    application-dev.yml
    application-local.yml
  src/
    main/
      resources/
        application.yml

# Application
```properties
server.port=8080
spring.application.name=media-api
spring.datasource.url=jdbc:postgresql://localhost:5432/backend_media
```


```yaml
server:
  port: 3000

spring:
  application:
    name: mvp-starter-default

custom:
  api-url: http://localhost:3000/api
  message: configuration du profil default
  param: param profil default uniquement
```


# Parametre Intellij
    
  Run > Edit Configurations
  Modify Options
    options :

      pour profile dev
        -Dspring.profiles.active=dev -Dspring.config.additional-location=./config-local/
      pour profile local
        -Dspring.profiles.active=local -Dspring.config.additional-location=./config-local/

# Execution Maven        
  
  mvn spring-boot:run
  mvn spring-boot:run "-Dspring-boot.run.profiles=dev" "-Dspring-boot.run.arguments=--spring.config.additional-location=./config-local/"
  mvn spring-boot:run "-Dspring-boot.run.profiles=local" "-Dspring-boot.run.arguments=--spring.config.additional-location=./config-local/"



```java
package com.mvp.controller.prototypes;

import org.springframework.core.env.Environment;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestProfileController {

    private final Environment environment;

    @Value("${spring.application.name}")
    private String applicationName;

    @Value("${server.port}")
    private String serverPort;

    @Value("${custom.api-url}")
    private String apiUrl;

    @Value("${custom.message}")
    private String message;

    @Value("${custom.param}")
    private String param;

    public TestProfileController(Environment environment) {
        this.environment = environment;
    }

    @GetMapping("/test-profile-controller")
    public Map<String, Object> getConfig() {

        List<String> activeProfiles = Arrays.asList(environment.getActiveProfiles());

        List<String> configFiles = new ArrayList<>();
        configFiles.add("application.yml");
        for (String profile : activeProfiles) {
            configFiles.add("application-" + profile + ".yml");
        }

        Map<String, Object> applicationConfig = new LinkedHashMap<>();
        applicationConfig.put("applicationName", applicationName);
        applicationConfig.put("serverPort", serverPort);
        applicationConfig.put("apiUrl", apiUrl);
        applicationConfig.put("message", message);
        applicationConfig.put("param", param);

        Map<String, Object> runtimeInfo = new LinkedHashMap<>();
        runtimeInfo.put("activeProfiles", activeProfiles);
        runtimeInfo.put("configFiles", configFiles);
        runtimeInfo.put("additionalLocation", environment.getProperty("spring.config.additional-location"));
        runtimeInfo.put("javaVersion", environment.getProperty("java.version"));
        runtimeInfo.put("javaHome", environment.getProperty("java.home"));
        runtimeInfo.put("workingDirectory", environment.getProperty("user.dir"));
        runtimeInfo.put("timezone", environment.getProperty("user.timezone"));
        runtimeInfo.put("osName", environment.getProperty("os.name"));

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("applicationConfig", applicationConfig);
        response.put("runtimeInfo", runtimeInfo);

        return response;
    }
}
```



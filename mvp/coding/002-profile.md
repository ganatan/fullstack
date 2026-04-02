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
server.port=3000
spring.application.name=mvp-starter-default
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


```yaml
server:
  port: 3001

spring:
  application:
    name: mvp-starter-dev

custom:
  api-url: http://localhost:3001/api
  message: configuration du profil dev
```

```yaml
server:
  port: 3002

spring:
  application:
    name: mvp-starter-local

custom:
  api-url: http://localhost:3002/api
  message: configuration du profil local
```

# Links

# LOCAL
http://localhost:3000
http://localhost:3000/test
http://localhost:3000/test-profile-controller

# DEV
http://localhost:3001
http://localhost:3001/test
http://localhost:3001/test-profile-controller

# Parametre Eclipse
    
  Run > run configuration
  Java Application
    projects : 009-mvp-starter-kafka-topics
    Main Class : com.mvp.Application

  Arguments
    VM Arguments
      pour profile dev
        -Dspring.profiles.active=dev -Dspring.config.additional-location=./config-local/
      pour profile local
        -Dspring.profiles.active=local -Dspring.config.additional-location=./config-local/

# Parametre Intellij
    
  Run > Edit Configurations
  Modify Options
    options :

      pour profile dev
        -Dspring.profiles.active=dev -Dspring.config.additional-location=./config-local/
      pour profile local
        -Dspring.profiles.active=local -Dspring.config.additional-location=./config-local/


# Parametre SDK 
  File > Project Structure > Project
    projet Java 21 → Project SDK = JDK 21
    projet Java 25 → Project SDK = JDK 25
  Settings > Build, Execution, Deployment > Build Tools > Maven
    Importing
    projet Java 21 → JDK for importer = JDK 21
    projet Java 25 → JDK for importer = JDK 25
  Maven Runner JRE
    Settings > Build, Execution, Deployment > Build Tools > Maven
      Runner
      projet Java 21 → JRE = JDK 21
      projet Java 25 → JRE = JDK 25

C’est ce réglage Runner qui est souvent le vrai problème quand Lifecycle > compile part avec le mauvais Java. Parce que le bouton Maven d’IntelliJ exécute un runner Maven, et ce runner a son propre JDK.

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



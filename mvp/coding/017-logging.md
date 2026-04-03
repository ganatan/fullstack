```java
package com.mvp;

import com.mvp.controller.logger.TestLoggerController;
import com.mvp.logger.LoggerService;
import org.slf4j.Logger;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {

	private static final Logger LOG = LoggerService.getLogger(TestLoggerController.class);

	public static void main(String[] args) {

		LOG.info("00000000001:TestLoggerController - trace");
		
		System.out.println("00000000001");
		SpringApplication.run(Application.class, args);

	}

}
```

```java
package com.mvp.controller.logger;

import java.util.LinkedHashMap;
import java.util.Map;

import com.mvp.logger.LoggerService;
import org.slf4j.Logger;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/test-logger")
public class TestLoggerController {

    private static final Logger LOG = LoggerService.getLogger(TestLoggerController.class);

    @GetMapping
    public Map<String, Object> testLogger() {
        LOG.trace("TestLoggerController - trace");
        LOG.debug("TestLoggerController - debug");
        LOG.info("TestLoggerController - info");
        LOG.warn("TestLoggerController - warn");
        LOG.error("TestLoggerController - error");

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("controller", "TestLoggerController");
        response.put("status", "OK");
        response.put("message", "logs envoyes");
        return response;
    }
}
```

```java
package com.mvp.logger;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public final class LoggerService {

    private LoggerService() {
    }

    public static Logger getLogger(Class<?> clazz) {
        return LoggerFactory.getLogger(clazz);
    }
}
```
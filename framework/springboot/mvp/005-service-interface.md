# Application Spring Boot très simple avec `TestController` et `TestService`

## Objectif

Créer une application Spring Boot minimale avec :

- une classe `Test`
- une interface `TestService`
- une classe `TestServiceImpl` qui implémente l’interface
- un `TestController`
- un endpoint `GET /test`
- une réponse JSON :

```json
{
  "name": "Dune",
  "budget": 165000000
}
```

---

## Arborescence

```text
src/main/java/com/example/demo/
  DemoApplication.java
  controller/
    TestController.java
  model/
    Test.java
  service/
    TestService.java
    TestServiceImpl.java
```

---

## Dépendance Maven

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

---

## Classe `Test`

```java
package com.example.demo.model;

public class Test {
    private String name;
    private int budget;

    public Test() {
    }

    public Test(String name, int budget) {
        this.name = name;
        this.budget = budget;
    }

    public String getName() {
        return name;
    }

    public int getBudget() {
        return budget;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setBudget(int budget) {
        this.budget = budget;
    }
}
```

---

## Interface `TestService`

```java
package com.example.demo.service;

import com.example.demo.model.Test;

public interface TestService {
    Test getTest();
}
```

---

## Implémentation `TestServiceImpl`

```java
package com.example.demo.service;

import com.example.demo.model.Test;
import org.springframework.stereotype.Service;

@Service
public class TestServiceImpl implements TestService {

    @Override
    public Test getTest() {
        return new Test("Dune", 165000000);
    }
}
```

---

## Controller `TestController`

```java
package com.example.demo.controller;

import com.example.demo.model.Test;
import com.example.demo.service.TestService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    private final TestService testService;

    public TestController(TestService testService) {
        this.testService = testService;
    }

    @GetMapping("/test")
    public Test getTest() {
        return testService.getTest();
    }
}
```

---

## Classe principale

```java
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
```

---

## Test

Lancer l’application puis appeler :

```text
http://localhost:8080/test
```

---

## Réponse attendue

```json
{
  "name": "Dune",
  "budget": 165000000
}
```
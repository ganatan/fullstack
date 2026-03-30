# Prototype Spring Boot `test-exceptions`

## Objectif

Créer un endpoint simple :

```text
http://localhost:3001/test-exceptions
```

avec plusieurs cas d’erreurs pour comprendre :

- `throw`
- `try / catch`
- gestion centralisée des erreurs avec `@RestControllerAdvice`

---

## Principe

Il y a 2 façons de gérer les erreurs :

- gérer l’erreur directement avec `try / catch`
- lever l’erreur avec `throw` puis la centraliser dans un handler global

Pour un vrai projet Spring Boot, le plus propre est :

- le controller appelle le service
- le service fait `throw`
- un `@RestControllerAdvice` intercepte l’erreur

---

## URL de test

### Cas normal

```text
http://localhost:3001/test-exceptions
```

ou

```text
http://localhost:3001/test-exceptions?type=ok
```

### Erreur not found

```text
http://localhost:3001/test-exceptions?type=notfound
```

### Erreur paramètre invalide

```text
http://localhost:3001/test-exceptions?type=illegal
```

### Erreur null

```text
http://localhost:3001/test-exceptions?type=null
```

### Erreur runtime

```text
http://localhost:3001/test-exceptions?type=runtime
```

### Erreur métier

```text
http://localhost:3001/test-exceptions?type=business
```

---

## Controller

```java
package com.mvp.controller.prototypes;

import com.mvp.service.prototypes.TestExceptionsService;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestExceptionsController {

    private final TestExceptionsService testExceptionsService;

    public TestExceptionsController(TestExceptionsService testExceptionsService) {
        this.testExceptionsService = testExceptionsService;
    }

    @GetMapping("/test-exceptions")
    public Map<String, Object> testExceptions(@RequestParam(defaultValue = "ok") String type) {
        return testExceptionsService.execute(type);
    }
}
```

---

## Service

```java
package com.mvp.service.prototypes;

import com.mvp.exception.BusinessException;
import com.mvp.exception.ResourceNotFoundException;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class TestExceptionsService {

    public Map<String, Object> execute(String type) {
        if ("notfound".equals(type)) {
            throw new ResourceNotFoundException("Media introuvable");
        }

        if ("illegal".equals(type)) {
            throw new IllegalArgumentException("Parametre type invalide");
        }

        if ("null".equals(type)) {
            String value = null;
            value.length();
        }

        if ("runtime".equals(type)) {
            throw new RuntimeException("Erreur technique inattendue");
        }

        if ("business".equals(type)) {
            throw new BusinessException("Regle metier invalide");
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("message", "Aucune erreur");
        response.put("type", type);
        return response;
    }
}
```

---

## Exception personnalisée `ResourceNotFoundException`

```java
package com.mvp.exception;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
```

---

## Exception personnalisée `BusinessException`

```java
package com.mvp.exception;

public class BusinessException extends RuntimeException {

    public BusinessException(String message) {
        super(message);
    }
}
```

---

## Gestion globale des erreurs

```java
package com.mvp.exception;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public Map<String, Object> handleResourceNotFound(ResourceNotFoundException e) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", false);
        response.put("status", HttpStatus.NOT_FOUND.value());
        response.put("error", "NOT_FOUND");
        response.put("message", e.getMessage());
        response.put("timestamp", Instant.now().toString());
        return response;
    }

    @ExceptionHandler(BusinessException.class)
    public Map<String, Object> handleBusiness(BusinessException e) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", false);
        response.put("status", HttpStatus.BAD_REQUEST.value());
        response.put("error", "BUSINESS_ERROR");
        response.put("message", e.getMessage());
        response.put("timestamp", Instant.now().toString());
        return response;
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public Map<String, Object> handleIllegalArgument(IllegalArgumentException e) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", false);
        response.put("status", HttpStatus.BAD_REQUEST.value());
        response.put("error", "BAD_REQUEST");
        response.put("message", e.getMessage());
        response.put("timestamp", Instant.now().toString());
        return response;
    }

    @ExceptionHandler(Exception.class)
    public Map<String, Object> handleGeneric(Exception e) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", false);
        response.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        response.put("error", "INTERNAL_SERVER_ERROR");
        response.put("message", e.getMessage());
        response.put("timestamp", Instant.now().toString());
        return response;
    }
}
```

---

## Ce que fait chaque type

### `type=ok`

Retour normal :

```json
{
  "success": true,
  "message": "Aucune erreur",
  "type": "ok"
}
```

### `type=notfound`

Le service fait :

```java
throw new ResourceNotFoundException("Media introuvable");
```

Le handler global retourne une réponse `404`.

### `type=illegal`

Le service fait :

```java
throw new IllegalArgumentException("Parametre type invalide");
```

Le handler global retourne une réponse `400`.

### `type=null`

Le service déclenche volontairement un `NullPointerException`.

Le handler global retourne une réponse `500`.

### `type=runtime`

Le service déclenche :

```java
throw new RuntimeException("Erreur technique inattendue");
```

Le handler global retourne une réponse `500`.

### `type=business`

Le service déclenche :

```java
throw new BusinessException("Regle metier invalide");
```

Le handler global retourne une réponse `400`.

---

## Différence entre `throw` et `try / catch`

### `throw`

`throw` sert à lever une erreur.

Exemple :

```java
throw new IllegalArgumentException("Parametre invalide");
```

### `try / catch`

`try / catch` sert à intercepter une erreur.

Exemple :

```java
try {
    throw new RuntimeException("Erreur");
} catch (Exception e) {
    System.out.println(e.getMessage());
}
```

---

## Exemple simple avec `try / catch` direct

Cette version marche, mais elle est moins propre qu’un handler global.

```java
package com.mvp.service.prototypes;

import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class TestExceptionsTryCatchService {

    public Map<String, Object> execute(String type) {
        Map<String, Object> response = new LinkedHashMap<>();

        try {
            if ("illegal".equals(type)) {
                throw new IllegalArgumentException("Parametre invalide");
            }

            if ("runtime".equals(type)) {
                throw new RuntimeException("Erreur technique");
            }

            response.put("success", true);
            response.put("message", "Aucune erreur");
            response.put("type", type);
            return response;
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("error", "BAD_REQUEST");
            response.put("message", e.getMessage());
            return response;
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "INTERNAL_SERVER_ERROR");
            response.put("message", e.getMessage());
            return response;
        }
    }
}
```

---

## Conclusion

Pour un prototype simple :

- `try / catch` est acceptable

Pour un projet Spring Boot propre :

- `throw` dans le service
- `@RestControllerAdvice` pour centraliser la gestion des erreurs

C’est la solution la plus claire, la plus maintenable et la plus professionnelle.
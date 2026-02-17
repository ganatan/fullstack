# 002-principes.md — Tests Java / Spring Boot — Principes d’usage des libs

## Dépendance standard

Spring Boot regroupe l’essentiel via `spring-boot-starter-test` (scope test) :
- JUnit Jupiter (JUnit 5) : framework de test
- Spring Test : intégration Spring + web tests (MockMvc, slices)
- AssertJ : assertions fluentes
- Mockito : mocks/stubs/verify
- JSONassert / JsonPath : assertions JSON
- (optionnel) Testcontainers : intégration infra (DB, Kafka, etc.)

Maven :
```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-test</artifactId>
  <scope>test</scope>
</dependency>
```

---

## JUnit 5 (JUnit Jupiter)

Rôle : exécuter les tests, gérer le cycle de vie, fournir les assertions de base.

- Annotation : `@Test`
- Cycle de vie : `@BeforeEach`, `@AfterEach`
- Assertions : `Assertions.*` (ex: `assertTrue`, `assertEquals`, `assertThrows`)

Imports typiques :
```java
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
```

---

## AssertJ

Rôle : assertions plus lisibles et puissantes (collections, maps, exceptions, champs).

Exemples :
- `assertThat(value).isNotNull()`
- `assertThat(list).hasSize(2)`
- `assertThat(map).containsEntry("count", 2)`

Import typique :
```java
import static org.assertj.core.api.Assertions.assertThat;
```

---

## Mockito

Rôle : remplacer des dépendances par des mocks, contrôler les retours, vérifier les appels.

Concepts :
- Stub : `when(mock.method()).thenReturn(x)`
- Exception : `when(...).thenThrow(...)`
- Vérif : `verify(mock).method()`, `verify(mock, times(2))...`

Imports typiques :
```java
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.*;
```

Dans Spring :
- `@MockBean` : remplace un bean Spring par un mock Mockito dans le contexte de test.

---

## Spring Test : stratégies de chargement du contexte

### 1) Test “slice” (rapide) : `@WebMvcTest`
- Charge uniquement le web layer (controllers + MVC)
- Injecte `MockMvc`
- Les dépendances du controller se mockent via `@MockBean`

Usage : tester endpoints HTTP sans démarrer tout Spring.

### 2) Test “client HTTP externe” : `@RestClientTest`
- Slice orientée RestClient/RestTemplate
- Fournit `MockRestServiceServer` pour simuler l’API externe
- Tu évites les appels réseau réels

Usage : controller/service qui appelle une API externe via `RestClient`.

### 3) Test intégration complet : `@SpringBootTest`
- Charge toute l’application
- Plus lent, mais utile pour valider wiring/config complète
- Souvent combiné avec `@AutoConfigureMockMvc` si tu veux MockMvc

---

## Tests HTTP avec MockMvc

Rôle : simuler une requête HTTP sur ton controller (sans serveur réel).

- `mockMvc.perform(get("/api/test"))`
- `andExpect(status().isOk())`
- `andExpect(jsonPath("$.ok").value(true))`

Imports typiques :
```java
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
```

---

## Mock d’API externe (RestClient) : MockRestServiceServer

Principe :
- On intercepte l’appel HTTP sortant
- On renvoie une réponse contrôlée (body JSON, status, headers)
- On vérifie que l’URL et la méthode ont été utilisées

Avec `@RestClientTest`, Spring configure `MockRestServiceServer` automatiquement.

Points clés :
- Le test ne doit jamais appeler le réseau
- Les valeurs attendues viennent du JSON mocké

---

## Bonnes pratiques minimales

- Utiliser un slice (`@WebMvcTest`, `@RestClientTest`) dès que possible
- Éviter `@SpringBootTest` par défaut (plus lent)
- Un test = un scénario (positif / négatif)
- Ne pas dépendre d’un service externe réel (toujours mocker)
- Garder les assertions simples : status + champs essentiels

---

## Exemple minimal (structure)

- `src/main/java/.../api/example/ExampleTestController.java`
- `src/test/java/.../api/example/ExampleTestTests.java`

Controller :
- retourne un JSON simple

Test :
- vérifie `200 OK` + `$.ok == true`

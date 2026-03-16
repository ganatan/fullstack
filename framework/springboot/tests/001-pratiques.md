# Tests Spring Boot — essentiels

## Objectif

Dans un projet Spring Boot, les tests servent à vérifier :

- le code métier
- les services
- les contrôleurs
- l’intégration Spring
- le chargement du contexte

En pratique, il faut distinguer :

- **tests unitaires**
- **tests d’intégration**

---

## Dépendance principale

Avec Spring Boot, la base est généralement :

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-test</artifactId>
  <scope>test</scope>
</dependency>
```

Cette dépendance apporte en général :

- JUnit 5
- Spring Test
- AssertJ
- Mockito
- JSONassert
- MockMvc

---

## Structure classique

Convention courante :

```text
src
 ├─ main
 │   └─ java
 └─ test
     └─ java
```

Les classes de test vont dans :

```text
src/test/java
```

---

## Types de tests

## 1. Test unitaire

But :

- tester une classe seule
- sans démarrer Spring
- sans base
- sans serveur

Exemple typique :

- tester un service métier simple
- tester une méthode utilitaire
- tester une transformation DTO

Exemple :

```java
class CalculatorServiceTest {

  @Test
  void shouldAddTwoNumbers() {
    CalculatorService service = new CalculatorService();
    int result = service.add(2, 3);
    assertEquals(5, result);
  }
}
```

---

## 2. Test d’intégration Spring

But :

- démarrer le contexte Spring
- vérifier que les beans sont bien créés
- tester plusieurs couches ensemble

Annotation classique :

```java
@SpringBootTest
```

Exemple :

```java
@SpringBootTest
class DemoApplicationTests {

  @Test
  void contextLoads() {
  }
}
```

Ce test vérifie que l’application démarre correctement.

---

## 3. Test web MVC

But :

- tester un contrôleur
- sans démarrer toute l’application
- avec `MockMvc`

Annotation classique :

```java
@WebMvcTest(MyController.class)
```

Exemple :

```java
@WebMvcTest(HelloController.class)
class HelloControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Test
  void shouldReturnHello() throws Exception {
    mockMvc.perform(get("/hello"))
      .andExpect(status().isOk())
      .andExpect(content().string("hello"));
  }
}
```

---

## 4. Test avec mock

But :

- isoler une classe
- simuler ses dépendances

Exemple avec Mockito :

```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

  @Mock
  private UserRepository repository;

  @InjectMocks
  private UserService service;

  @Test
  void shouldReturnUser() {
    when(repository.findById(1L)).thenReturn(Optional.of(new User(1L, "Bob")));
    User user = service.findById(1L);
    assertEquals("Bob", user.getName());
  }
}
```

---

## Annotations essentielles

### JUnit

- `@Test`
- `@BeforeEach`
- `@AfterEach`
- `@DisplayName`

### Spring

- `@SpringBootTest`
- `@WebMvcTest`
- `@DataJpaTest`
- `@AutoConfigureMockMvc`

### Mockito

- `@Mock`
- `@InjectMocks`
- `@MockBean`

---

## Tester toute l’application

Pour lancer tous les tests du projet :

```bash
mvn test
```

Cette commande exécute tous les tests unitaires et d’intégration reconnus par Maven.

Autre commande fréquente :

```bash
mvn clean test
```

Elle nettoie d’abord le projet puis exécute les tests.

---

## Tester une seule classe de test

Pour exécuter une seule classe :

```bash
mvn -Dtest=UserServiceTest test
```

Exemple :

```bash
mvn -Dtest=DemoApplicationTests test
```

---

## Tester une seule méthode

Pour exécuter une seule méthode de test :

```bash
mvn -Dtest=UserServiceTest#shouldReturnUser test
```

Exemple :

```bash
mvn -Dtest=HelloControllerTest#shouldReturnHello test
```

---

## Lancer les tests depuis IntelliJ

### Tous les tests d’une classe

- ouvrir la classe de test
- cliquer sur l’icône verte à gauche
- choisir `Run`

### Une seule méthode

- cliquer sur l’icône verte à gauche de la méthode
- choisir `Run`

---

## Nommage conseillé

Convention simple :

- `UserServiceTest`
- `OrderControllerTest`
- `CustomerRepositoryTest`

Nom de méthode explicite :

- `shouldReturnUserWhenIdExists`
- `shouldThrowExceptionWhenUserNotFound`
- `shouldCreateOrder`

---

## Bonnes pratiques essentielles

- tester le comportement, pas l’implémentation interne
- faire des tests courts
- séparer test unitaire et test Spring
- mocker les dépendances externes si besoin
- garder des noms de tests clairs
- avoir un test `contextLoads()` au minimum dans un projet Spring Boot

---

## Exemple minimal complet

Classe métier :

```java
public class GreetingService {

  public String greet(String name) {
    return "Hello " + name;
  }
}
```

Test :

```java
import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

class GreetingServiceTest {

  @Test
  void shouldReturnGreeting() {
    GreetingService service = new GreetingService();
    String result = service.greet("Danny");
    assertEquals("Hello Danny", result);
  }
}
```

---

## Résumé

### Pour tout tester

```bash
mvn test
```

ou

```bash
mvn clean test
```

### Pour une seule classe

```bash
mvn -Dtest=NomClasseTest test
```

### Pour une seule méthode

```bash
mvn -Dtest=NomClasseTest#nomMethode test
```

---

## Commandes essentielles

```bash
mvn test
mvn clean test
mvn -Dtest=UserServiceTest test
mvn -Dtest=UserServiceTest#shouldReturnUser test
```
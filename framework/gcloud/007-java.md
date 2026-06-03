# Java - Révision Rapide Entretien

## Les 4 piliers de l'objet

### Encapsulation

Masquer les données internes.

```java
private String name;
```

Accès via :

```java
getters
setters
```

---

### Héritage

Réutiliser le code d'une classe parent.

```java
class Animal {
}

class Dog extends Animal {
}
```

---

### Polymorphisme

Manipuler plusieurs objets via le même type.

```java
Animal animal = new Dog();
```

Appel :

```java
animal.speak();
```

Java exécute la méthode de Dog.

---

### Abstraction

Masquer les détails d'implémentation.

```java
abstract class Animal {
    abstract void speak();
}
```

ou

```java
interface Animal {
    void speak();
}
```

---

# Classe abstraite

Peut contenir :

```java
Attributs

Méthodes concrètes

Méthodes abstraites
```

Exemple :

```java
abstract class Vehicle {

    public void start() {
    }

    public abstract void move();
}
```

---

# Interface

Décrit un contrat.

```java
interface Vehicle {
    void move();
}
```

Une classe peut implémenter plusieurs interfaces.

```java
class Car implements Vehicle, Serializable {
}
```

---

# Singleton

Une seule instance dans toute l'application.

Utilisation :

```text
Configuration

Cache

Logger

Factory
```

Exemple :

```java
public class Singleton {

    private static final Singleton INSTANCE =
            new Singleton();

    private Singleton() {
    }

    public static Singleton getInstance() {
        return INSTANCE;
    }
}
```

---

# Bean Spring

Objet géré par Spring.

Exemples :

```java
@Service

@Repository

@Component

@Controller

@RestController
```

Spring crée automatiquement l'objet.

Injection :

```java
@Service
public class UserService {
}
```

```java
@RestController
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }
}
```

---

# Injection de dépendances

Spring fournit automatiquement les objets nécessaires.

```java
Controller
      |
      v
Service
      |
      v
Repository
```

---

# POJO

Plain Old Java Object.

Classe Java simple.

```java
public class User {

    private Long id;

    private String name;
}
```

Sans dépendance Spring.

---

# Record

Introduit pour les objets immuables.

```java
public record User(
        Long id,
        String name
) {
}
```

Equivalent à :

```java
Constructeur

Getter

equals()

hashCode()

toString()
```

générés automatiquement.

---

# equals() et hashCode()

equals :

```java
Compare le contenu
```

hashCode :

```java
Utilisé par HashMap
HashSet
```

Toujours redéfinir ensemble.

---

# == versus equals

```java
==
```

Compare les références mémoire.

---

```java
equals()
```

Compare le contenu.

Exemple :

```java
String a = new String("Java");
String b = new String("Java");
```

```java
a == b
```

false

---

```java
a.equals(b)
```

true

---

# Collections

## ArrayList

```java
ArrayList<String>
```

Accès rapide par index.

---

## LinkedList

```java
LinkedList<String>
```

Insertion rapide.

---

## HashSet

```java
HashSet<String>
```

Pas de doublons.

---

## HashMap

```java
HashMap<Long, User>
```

Clé / Valeur.

---

# Génériques

Permettent de typer les collections.

```java
List<String>
```

Évite les cast.

---

# Optional

Évite les NullPointerException.

```java
Optional<User>
```

Exemple :

```java
return Optional.of(user);
```

---

# Exceptions

## Checked

Obligation de gérer.

```java
IOException
SQLException
```

---

## Unchecked

Runtime.

```java
NullPointerException

IndexOutOfBoundsException

IllegalArgumentException
```

---

# Annotations Spring importantes

## Injection

```java
@Component

@Service

@Repository

@Controller

@RestController
```

---

## Configuration

```java
@Configuration

@Bean

@Value
```

---

## Web

```java
@RequestMapping

@GetMapping

@PostMapping

@PutMapping

@DeleteMapping
```

---

## Validation

```java
@Valid

@NotNull

@NotBlank

@Size
```

---

## Sécurité

```java
@PreAuthorize

@Secured
```

---

# Design Patterns à connaître

## Singleton

Une seule instance.

---

## Factory

Création d'objets.

```java
UserFactory.create()
```

---

## Strategy

Changer un comportement dynamiquement.

```java
PaymentStrategy

PaypalStrategy

CreditCardStrategy
```

---

## Observer

Notification d'événements.

Exemple :

```text
RabbitMQ

Kafka

Event Listener
```

---

## Builder

Construction d'objets complexes.

```java
User.builder()
    .name("Danny")
    .build();
```

---

# JVM

Composants :

```text
JVM
 |
 +-- Heap
 |
 +-- Stack
 |
 +-- Garbage Collector
```

---

## Heap

Stockage des objets.

```java
new User()
```

---

## Stack

Variables locales.

```java
String name = "Danny";
```

---

# Garbage Collector

Libère automatiquement la mémoire inutilisée.

---

# Long identifiant dont on parle souvent

Très probablement :

```java
serialVersionUID
```

Utilisé pour :

```java
Serializable
```

Exemple :

```java
private static final long serialVersionUID = 1L;
```

Permet de vérifier la compatibilité des objets sérialisés.

---

# Réponse entretien rapide

Java est un langage orienté objet reposant sur l'encapsulation, l'héritage, le polymorphisme et l'abstraction. Spring repose fortement sur l'injection de dépendances et les Beans. Les concepts importants à maîtriser sont les interfaces, les classes abstraites, les collections, les génériques, les exceptions, les design patterns comme Singleton, Factory, Strategy, Builder et Observer, ainsi que les notions JVM, Heap, Stack et Garbage Collector.
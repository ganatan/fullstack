# 001 - Accès PostgreSQL avec Spring Boot + Hibernate

## Stack
- Java 21
- Spring Boot 3.5.x
- Spring Data JPA
- Hibernate 6
- PostgreSQL

## Dépendances Maven
```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<dependency>
  <groupId>org.postgresql</groupId>
  <artifactId>postgresql</artifactId>
  <scope>runtime</scope>
</dependency>
```

## Configuration (application.properties)
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/starterdb
spring.datasource.username=starter
spring.datasource.password=starter

spring.jpa.hibernate.ddl-auto=update
spring.jpa.open-in-view=false
spring.jpa.show-sql=true
```

## Modèle JPA
```java
@Entity
@Table(name = "person")
public class PersonEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String name;
}
```

## Repository
```java
public interface PersonRepository extends JpaRepository<PersonEntity, Long> {
}
```

## Service
```java
@Service
public class PersonService {

  private final PersonRepository repository;

  public PersonService(PersonRepository repository) {
    this.repository = repository;
  }

  @Transactional(readOnly = true)
  public List<PersonEntity> findAll() {
    return repository.findAll();
  }

  @Transactional
  public PersonEntity create(String name) {
    return repository.save(new PersonEntity(name));
  }
}
```

## Controller REST
```java
@RestController
public class PersonController {

  private final PersonService service;

  public PersonController(PersonService service) {
    this.service = service;
  }

  @GetMapping("/persons")
  public List<PersonEntity> getAll() {
    return service.findAll();
  }

  @PostMapping("/persons")
  public PersonEntity create(@RequestBody PersonCreateRequest request) {
    return service.create(request.getName());
  }
}
```

## Endpoints
- GET /persons
- POST /persons

## Points clés
- Hibernate est le provider JPA par défaut
- ddl-auto=update uniquement pour prototypage
- Transactions au niveau service
- Controller sans logique métier

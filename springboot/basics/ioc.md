# Spring Boot – IoC (ultra mémo)

```java
@SpringBootApplication
public class StarterApplication {}
```
→ point d’entrée, IoC + scan

```java
public interface ContinentRepository {}
```
→ contrat

```java
@Repository
@Profile("inmemory")
public class InMemoryContinentRepository
  implements ContinentRepository {}
```
→ implémentation active si profil `inmemory`

```java
@Service
public class ContinentService {

  public ContinentService(ContinentRepository repository) {}
}
```
→ besoin injecté

```properties
spring.profiles.active=inmemory
```
→ sélection de l’implémentation

Règle finale  
→ interface demandée, implémentation choisie par profil, Spring assemble

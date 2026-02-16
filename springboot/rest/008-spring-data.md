## Architecture Spring Boot – Controller / Service / Repository / Hibernate

- **Controller**
  - Rôle : couche HTTP, exposition des endpoints REST, validation des entrées, mapping DTO ↔ domaine
  - Libs : `spring-boot-starter-web` (Spring MVC, Jackson)

- **Service**
  - Rôle : logique métier, orchestration des règles, gestion transactionnelle
  - Aucune dépendance HTTP ou persistence
  - Libs : Spring Core, Spring Context (`@Service`, `@Transactional`)

- **Repository**
  - Rôle : accès aux données, abstraction de la persistence, aucune logique métier
  - Libs : `spring-boot-starter-data-jpa`, `JpaRepository`

- **JPA**
  - Rôle : contrat standard de persistence (annotations, cycle de vie)
  - Libs : Jakarta Persistence API (`@Entity`, `@Id`, `@OneToMany`, etc.)

- **Hibernate**
  - Rôle : implémentation JPA, ORM, mapping objets ↔ tables, génération SQL
  - Libs : Hibernate Core (amené par `starter-data-jpa`)

- **Transactions**
  - Gestion automatique via AOP
  - Libs : Spring TX, Hibernate

- **Datasource / Pool**
  - Gestion et optimisation des connexions JDBC
  - Libs : HikariCP

- **Base de données**
  - PostgreSQL
  - Libs : `org.postgresql:postgresql` (scope runtime)

- **Flux global**
  - Controller → Service → Repository → Hibernate → Base de données

- **Principe clé**
  - Métier centralisé dans le Service, HTTP et SQL strictement isolés

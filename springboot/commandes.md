# springboot-starter

Starter **Spring Boot** packagé en **JAR** et construit avec **Maven**.  
Base minimale pour démarrer proprement : build, tests, couverture, qualité, exécution.

---

## Prérequis

- **Java 25**
- **Maven 3.9+**

Vérification :

```bash
java -version
mvn -v
```

---

## Installation

```bash
mvn clean install
```

Artefact généré :

```text
target/springboot-starter-1.0.0.jar
```

---

## Commandes essentielles

### Build (tests + qualité + packaging)

```bash
mvn clean install
```

### Tests

```bash
mvn test
```

### Coverage (JaCoCo)

```bash
mvn test
```

Rapport HTML :

```text
target/site/jacoco/index.html
```

### Qualité (Checkstyle)

```bash
mvn verify
```

---

## Exécution

### Via Maven

```bash
mvn spring-boot:run
```

### Via Java (jar)

```bash
java -jar target/springboot-starter-1.0.0.jar
```

Accès :

```text
http://localhost:8080
```

---

## Dépendances (audit)

```bash
mvn versions:display-dependency-updates
mvn versions:display-plugin-updates
mvn dependency:tree
```

---

## Structure

```text
.
├── pom.xml
├── checkstyle.xml
└── src
    ├── main
    │   ├── java
    │   │   └── com/ganatan/starter
    │   │       ├── StarterApplication.java
    │   │       └── api/root/RootController.java
    │   └── resources
    │       └── application.properties
    └── test
        └── java
            └── com/ganatan/starter/StarterApplicationTests.java
```

---

## Notes

- Rapport JaCoCo : `target/site/jacoco/`
- Configuration qualité : `checkstyle.xml`

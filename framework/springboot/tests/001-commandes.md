# Spring Boot Tests

## Tests

### 1) Lancer tous les tests

```bash
mvn test
```

### 2) Lancer un seul test (classe)

```bash
mvn -Dtest=ExternalApiControllerTests test
```

### 3) Lancer un seul test (méthode)

```bash
mvn -Dtest=ExternalApiControllerTests#tru test
```

### 4) Tests + couverture (JaCoCo si configuré)

```bash
mvn test jacoco:report
```

---

## Nettoyage

```bash
mvn clean
mvn clean test
mvn clean package
```

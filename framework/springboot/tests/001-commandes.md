# 001-commandes.md — Spring Boot (Maven) — Commandes

## Démarrage simple

### 1) Lancer l’application (Maven)

```bash
mvn spring-boot:run
```

### 2) Lancer l’application (Jar)

```bash
mvn -DskipTests package
java -jar target/*.jar
```

### 3) Changer le port (optionnel)

```bash
mvn spring-boot:run -Dspring-boot.run.arguments=--server.port=3000
```

---

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

## Vérification rapide HTTP (si ton app tourne)

### Endpoint simple

```bash
curl -i http://localhost:3000/actuator/health
```

### Endpoint métier (exemple)

```bash
curl -s http://localhost:3000/api/albums
```

---

## Nettoyage

```bash
mvn clean
mvn clean test
mvn clean package
```

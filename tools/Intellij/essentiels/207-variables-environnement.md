# Variables d'environnement

IntelliJ permet de définir des variables d'environnement propres à une Run Configuration.
Elles sont injectées uniquement lors du lancement de cette configuration.

## Configuration

```text
Run
→ Edit Configurations
→ Environment variables
```

## Exemple

```text
DB_URL=jdbc:postgresql://localhost:5432/app
DB_USERNAME=postgres
DB_PASSWORD=postgres
```

## Java

```java
String value =
    System.getenv(
        "DB_URL"
    );
```

## Important

Ne pas stocker de secrets réels dans Git.

Préférer :

```text
variables locales
.env non versionné
gestionnaire de secrets
```

# Import et synchronisation projet

IntelliJ doit synchroniser son modèle interne avec Maven ou Gradle.
Une mauvaise synchronisation peut provoquer des erreurs visibles uniquement dans l'IDE.

## Maven

```text
Maven
→ Reload All Maven Projects
```

## Gradle

```text
Gradle
→ Reload All Gradle Projects
```

## Vérification terminal

Maven :

```bash
mvn clean test
```

Gradle :

```bash
./gradlew test
```

## Diagnostic

Si le terminal compile mais pas IntelliJ :

```text
recharger le build
vérifier le SDK
vérifier le module
vérifier les caches
```

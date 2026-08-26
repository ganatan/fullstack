# Classpath

Le classpath indique à Java où trouver les classes et bibliothèques nécessaires.
IntelliJ le construit à partir des modules, dépendances Maven/Gradle et SDK.

## Diagnostic

Si une classe n'est pas trouvée :

```text
Cannot resolve symbol
ClassNotFoundException
NoClassDefFoundError
```

Vérifier :

```text
pom.xml
build.gradle
Project Structure
Dependencies
```

## Maven

```bash
mvn dependency:tree
```

## IntelliJ

```text
File
→ Project Structure
→ Modules
→ Dependencies
```

Une dépendance présente dans le build doit aussi être correctement importée dans l'IDE.

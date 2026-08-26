# Run Configuration

Une Run Configuration décrit comment IntelliJ démarre une application.
Elle définit la classe principale, le module, les arguments et l'environnement.

## Accès

```text
Run
→ Edit Configurations
```

## Paramètres importants

```text
Main class
Use classpath of module
Program arguments
VM options
Environment variables
Working directory
```

## Exemple

```text
Main class:
com.ganatan.Application
```

## Variables

```text
DB_URL=jdbc:postgresql://localhost:5432/app
DB_USERNAME=postgres
DB_PASSWORD=postgres
```

Une configuration peut être sauvegardée et réutilisée.

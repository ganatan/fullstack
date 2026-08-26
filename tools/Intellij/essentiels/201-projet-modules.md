# Projet et modules

Un projet IntelliJ peut contenir un ou plusieurs modules.
Chaque module possède ses sources, dépendances, SDK et configuration de build.

## Voir la structure

Menu :

```text
File
→ Project Structure
```

Raccourci :

```text
Ctrl + Alt + Shift + S
```

## Vérifier

```text
Project
Modules
Libraries
SDKs
```

## Cas multi-modules

```text
application
├── api
├── service
└── persistence
```

Chaque module peut avoir son propre `pom.xml` ou `build.gradle`.

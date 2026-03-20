# `pom.xml` et utilisation du parent

Le fichier `pom.xml` est le fichier principal d’un projet Maven.

Il décrit notamment :

- l’identité du projet : `groupId`, `artifactId`, `version`
- les dépendances
- les plugins
- les propriétés
- la configuration du build

## Parent Maven

Un `pom.xml` peut déclarer un parent :

```xml
<parent>
    <groupId>fr.com.ganatan</groupId>
    <artifactId>pom-parent</artifactId>
    <version>5.0.0</version>
</parent>
```

Cela signifie que le projet hérite de la configuration du parent.

Le parent peut fournir :

- `java.version`
- `maven.compiler.source`
- `maven.compiler.target`
- versions de dépendances
- plugins communs
- règles de build

## Comment Maven trouve le parent

Maven lit le bloc `<parent>` puis cherche ce parent :

- dans le projet local si un parent existe au-dessus
- dans le dépôt local Maven `.m2`
- puis dans les repositories distants si besoin

Sous Windows, le dépôt local est en général ici :

```text
C:\Users\<user>\.m2\repository
```

Exemple de chemin possible :

```text
C:\Users\<user>\.m2\repository\fr\com\ganatan\pom-parent\5.0.0\
```

Dans ce dossier, on trouve souvent le fichier :

```text
pom-parent-5.0.0.pom
```

## Important

Le parent est défini dans le `pom.xml`, pas dans `settings.xml`.

`settings.xml` sert seulement à aider Maven à accéder aux repositories, avec mirror, login, mot de passe, proxy, etc.

## Dans ton cas

Si le parent contient :

```xml
<java.version>25</java.version>
```

alors le projet enfant compile en Java 25, sauf surcharge locale.
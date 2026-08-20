# Initialisation d'une application Java avec IntelliJ IDEA sans Maven

Création d'une application **Java classique**, sans Maven, sans Spring Boot et sans framework.

Objectifs :

* créer un projet Java avec IntelliJ IDEA ;
* utiliser directement le JDK ;
* compiler et exécuter une classe Java ;
* lancer l'application en mode Run et Debug ;
* ne pas utiliser de `pom.xml`.

---

## Prérequis

Installer un JDK Java.

Version utilisée :

```text
Java 25
```

Vérifier l'installation :

```bash
java --version
javac --version
```

---

## Création du projet

Dans IntelliJ IDEA :

```text
File
New
Project
```

Sélectionner :

```text
Java
```

Configurer :

```text
Name         : java-basic
Location     : dossier du projet
Build system : IntelliJ
JDK          : 25
```

Ne pas sélectionner :

```text
Maven
Gradle
```

Cliquer sur :

```text
Create
```

---

## Structure du projet

La structure minimale est :

```text
java-basic/
├── .idea/
├── src/
│   └── Main.java
└── java-basic.iml
```

Il n'existe pas de fichier :

```text
pom.xml
```

Le projet est directement géré par IntelliJ et le JDK.

---

## Création de la classe principale

Créer :

```text
src/Main.java
```

Code :

```java
public class Main {

  public static void main(
      String[] args
  ) {
    System.out.println(
        "Hello Java"
    );
  }

}
```

---

## Exécution avec IntelliJ IDEA

Ouvrir :

```text
Main.java
```

Cliquer sur l'icône :

```text
▶
```

à côté de :

```java
public static void main(
    String[] args
)
```

Sélectionner :

```text
Run 'Main.main()'
```

Résultat :

```text
Hello Java
```

---

## Debug avec IntelliJ IDEA

Placer un breakpoint dans le code.

Cliquer sur l'icône à côté de la méthode `main`, puis sélectionner :

```text
Debug 'Main.main()'
```

Le debugger IntelliJ permet alors :

```text
Step Over
Step Into
Step Out
Resume
Variables
Evaluate Expression
```

---

## Compilation avec javac

Il est également possible de compiler l'application directement depuis un terminal.

Se placer dans :

```text
src
```

Puis :

```bash
javac Main.java
```

Le compilateur génère :

```text
Main.class
```

Structure :

```text
src/
├── Main.java
└── Main.class
```

---

## Exécution avec java

Toujours depuis le dossier `src` :

```bash
java Main
```

Résultat :

```text
Hello Java
```

---

## Compilation dans un dossier séparé

Il est préférable de séparer les sources des fichiers compilés.

Depuis la racine du projet :

```bash
javac -d out src/Main.java
```

Structure obtenue :

```text
java-basic/
├── src/
│   └── Main.java
└── out/
    └── Main.class
```

Exécuter :

```bash
java -cp out Main
```

Résultat :

```text
Hello Java
```

---

## Ajouter un package

Créer la structure :

```text
src/
└── com/
    └── ganatan/
        └── basic/
            └── Main.java
```

Code :

```java
package com.ganatan.basic;

public class Main {

  public static void main(
      String[] args
  ) {
    System.out.println(
        "Hello Java"
    );
  }

}
```

Compiler :

```bash
javac -d out src/com/ganatan/basic/Main.java
```

Exécuter :

```bash
java -cp out com.ganatan.basic.Main
```

---

## Ajouter une classe

Structure :

```text
src/
└── com/
    └── ganatan/
        └── basic/
            ├── Main.java
            └── Person.java
```

### Person.java

```java
package com.ganatan.basic;

public record Person(
    int id,
    String firstName,
    String lastName
) {
}
```

### Main.java

```java
package com.ganatan.basic;

public class Main {

  public static void main(
      String[] args
  ) {

    Person person = new Person(
        1,
        "Steven",
        "Spielberg"
    );

    System.out.println(
        person
    );

  }

}
```

Compiler :

```bash
javac -d out src/com/ganatan/basic/*.java
```

Exécuter :

```bash
java -cp out com.ganatan.basic.Main
```

---

## Arguments de ligne de commande

La méthode :

```java
public static void main(
    String[] args
)
```

permet de récupérer les arguments transmis au programme.

Exemple :

```java
public class Main {

  public static void main(
      String[] args
  ) {

    for (String arg : args) {
      System.out.println(arg);
    }

  }

}
```

Compilation :

```bash
javac -d out src/Main.java
```

Exécution :

```bash
java -cp out Main hello java
```

Résultat :

```text
hello
java
```

---

## Différence avec Maven

Sans Maven :

```text
Java
↓
javac
↓
.class
↓
java
```

Avec Maven :

```text
Java
↓
pom.xml
↓
Maven
↓
compilation
↓
tests
↓
dépendances
↓
packaging
```

Dans ce projet :

```text
aucun pom.xml
aucun Maven
aucun framework
aucun serveur HTTP
aucune base de données
```

---

## Commandes principales

Compiler :

```bash
javac -d out src/Main.java
```

Exécuter :

```bash
java -cp out Main
```

Avec package :

```bash
javac -d out src/com/ganatan/basic/*.java
```

```bash
java -cp out com.ganatan.basic.Main
```

---

## Architecture

```text
Code Java
   ↓
javac
   ↓
bytecode .class
   ↓
JVM
   ↓
java
```

---

## Configuration retenue

```text
Application : java-basic
Language    : Java
Java        : 25
IDE         : IntelliJ IDEA
Build Tool  : aucun
Maven       : non
Gradle      : non
Framework   : aucun
API HTTP    : aucune
Database    : aucune
```

Cette première étape permet de comprendre une application Java classique avant d'introduire Maven, Spring Boot, Quarkus ou une API HTTP.

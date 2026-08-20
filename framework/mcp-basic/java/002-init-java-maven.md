# Initialisation d'une application Java avec IntelliJ IDEA et Maven

Création d'une application **Java classique avec Maven**, sans Spring Boot, sans Quarkus et sans framework.

Objectifs :

* créer un projet Java avec IntelliJ IDEA ;
* utiliser Maven comme outil de build ;
* comprendre le fichier `pom.xml` ;
* compiler et exécuter l'application ;
* générer un fichier JAR ;
* lancer l'application en mode Run et Debug.

---

## Prérequis

Installer :

```text
Java 25
Maven
IntelliJ IDEA
```

Vérifier Java :

```bash
java --version
javac --version
```

Vérifier Maven :

```bash
mvn --version
```

---

# Création du projet

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
Name         : java-maven
Build system : Maven
JDK          : 25
```

Configurer les coordonnées Maven :

```text
GroupId    : com.ganatan
ArtifactId : java-maven
```

Cliquer sur :

```text
Create
```

---

# Structure du projet

La structure standard Maven est :

```text
java-maven/
├── src/
│   ├── main/
│   │   └── java/
│   │       └── com/
│   │           └── ganatan/
│   │               └── maven/
│   │                   └── Main.java
│   └── test/
│       └── java/
├── pom.xml
└── target/
```

Le dossier :

```text
target/
```

est créé automatiquement lors de la compilation.

---

# pom.xml

Le fichier :

```text
pom.xml
```

décrit le projet Maven.

Exemple :

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">

  <modelVersion>4.0.0</modelVersion>

  <groupId>com.ganatan</groupId>
  <artifactId>java-maven</artifactId>
  <version>1.0.0</version>

  <properties>
    <maven.compiler.release>25</maven.compiler.release>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
  </properties>

  <build>
    <plugins>

      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-jar-plugin</artifactId>
        <version>3.4.2</version>

        <configuration>
          <archive>
            <manifest>
              <mainClass>com.ganatan.maven.Main</mainClass>
            </manifest>
          </archive>
        </configuration>

      </plugin>

    </plugins>
  </build>

</project>
```

---

# Coordonnées Maven

Les trois informations principales sont :

```text
groupId
artifactId
version
```

Pour ce projet :

```text
groupId    : com.ganatan
artifactId : java-maven
version    : 1.0.0
```

Elles identifient l'application Maven.

---

# Classe principale

## Chemin

```text
src/main/java/com/ganatan/maven/Main.java
```

## Code

```java
package com.ganatan.maven;

public class Main {

  public static void main(
      String[] args
  ) {

    System.out.println(
        "Hello Java Maven"
    );

  }

}
```

---

# Exécution avec IntelliJ IDEA

Ouvrir :

```text
Main.java
```

Cliquer sur :

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
Hello Java Maven
```

---

# Debug avec IntelliJ IDEA

Placer un breakpoint dans :

```text
Main.java
```

Cliquer sur l'icône à côté de la méthode `main`, puis sélectionner :

```text
Debug 'Main.main()'
```

Le debugger permet notamment :

```text
Step Over
Step Into
Step Out
Resume
Variables
Evaluate Expression
```

---

# Compilation avec Maven

Se placer dans le dossier contenant :

```text
pom.xml
```

Puis exécuter :

```bash
mvn compile
```

Maven compile les fichiers présents dans :

```text
src/main/java/
```

et génère les fichiers `.class` dans :

```text
target/classes/
```

---

# Exécution après compilation

Après :

```bash
mvn compile
```

exécuter :

```bash
java -cp target/classes com.ganatan.maven.Main
```

Résultat :

```text
Hello Java Maven
```

---

# Nettoyage

Supprimer tous les fichiers générés par Maven :

```bash
mvn clean
```

Le dossier :

```text
target/
```

est supprimé.

---

# Packaging

Compiler et générer le fichier JAR :

```bash
mvn clean package
```

Le fichier généré est :

```text
target/java-maven-1.0.0.jar
```

---

# Exécution du JAR

Le `pom.xml` configure :

```text
com.ganatan.maven.Main
```

comme classe principale.

L'application peut donc être lancée avec :

```bash
java -jar target/java-maven-1.0.0.jar
```

Résultat :

```text
Hello Java Maven
```

---

# Cycle Maven

Maven utilise différentes phases.

```text
validate
   ↓
compile
   ↓
test
   ↓
package
   ↓
verify
   ↓
install
```

---

## compile

Compiler le code :

```bash
mvn compile
```

---

## test

Exécuter les tests :

```bash
mvn test
```

---

## package

Compiler, tester et créer le JAR :

```bash
mvn package
```

---

## verify

Exécuter toutes les vérifications du projet :

```bash
mvn verify
```

---

## install

Compiler, tester, créer le JAR et installer l'artefact dans le repository Maven local :

```bash
mvn install
```

L'artefact est installé dans :

```text
~/.m2/repository/
```

---

# Nettoyage et build

Commande courante :

```bash
mvn clean package
```

Elle réalise :

```text
suppression de target/
        ↓
compilation
        ↓
tests
        ↓
création du JAR
```

---

# Repository Maven local

Maven stocke les dépendances téléchargées dans :

```text
~/.m2/repository/
```

Sous Windows, cela correspond généralement à :

```text
C:\Users\<user>\.m2\repository
```

Une dépendance n'est donc normalement téléchargée qu'une seule fois.

---

# Ajouter une dépendance

L'un des principaux intérêts de Maven est la gestion automatique des dépendances.

Exemple avec Jackson :

```xml
<dependency>
  <groupId>com.fasterxml.jackson.core</groupId>
  <artifactId>jackson-databind</artifactId>
  <version>2.20.0</version>
</dependency>
```

La dépendance est ajoutée dans :

```xml
<dependencies>

  <dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.20.0</version>
  </dependency>

</dependencies>
```

Maven télécharge automatiquement la bibliothèque et ses dépendances.

---

# Afficher les dépendances

```bash
mvn dependency:tree
```

Exemple :

```text
com.ganatan:java-maven:jar:1.0.0
└── com.fasterxml.jackson.core:jackson-databind
```

---

# Ajouter une classe

Structure :

```text
src/main/java/com/ganatan/maven/
├── Main.java
└── Person.java
```

## Person.java

```java
package com.ganatan.maven;

public record Person(
    int id,
    String firstName,
    String lastName
) {
}
```

## Main.java

```java
package com.ganatan.maven;

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
mvn compile
```

Puis exécuter :

```bash
java -cp target/classes com.ganatan.maven.Main
```

---

# Arguments de ligne de commande

La méthode :

```java
public static void main(
    String[] args
)
```

permet de récupérer les arguments transmis au programme.

Exemple :

```java
package com.ganatan.maven;

public class Main {

  public static void main(
      String[] args
  ) {

    for (String arg : args) {
      System.out.println(
          arg
      );
    }

  }

}
```

Compiler :

```bash
mvn compile
```

Exécuter :

```bash
java -cp target/classes com.ganatan.maven.Main hello java
```

Résultat :

```text
hello
java
```

---

# Différence avec Java sans Maven

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
 ↓
JAR
```

---

# Différence de structure

Sans Maven :

```text
java-basic/
├── src/
│   └── Main.java
└── out/
```

Avec Maven :

```text
java-maven/
├── src/
│   ├── main/
│   │   └── java/
│   └── test/
│       └── java/
├── pom.xml
└── target/
```

---

# Commandes Maven principales

```bash
mvn clean
mvn compile
mvn test
mvn package
mvn verify
mvn install
mvn dependency:tree
```

Commande de build classique :

```bash
mvn clean package
```

Exécution du JAR :

```bash
java -jar target/java-maven-1.0.0.jar
```

---

# Architecture

```text
Code Java
   ↓
pom.xml
   ↓
Maven
   ↓
javac
   ↓
target/classes
   ↓
JAR
   ↓
JVM
```

---

# Configuration retenue

```text
Application : java-maven
Language    : Java
Java        : 25
IDE         : IntelliJ IDEA
Build Tool  : Maven
Packaging   : JAR
Framework   : aucun
API HTTP    : aucune
Database    : aucune
```

Cette étape permet de comprendre **Maven et la structure standard d'un projet Java** avant d'introduire Spring Boot, Quarkus ou une API HTTP.

# 014-premier-projet-maven-java8.md

# Utilisation de Maven avec Java 8

## Objectif

Découvrir Maven progressivement en reprenant exactement notre exemple :

```text
Main.java
MathUtils.java
```

Nous allons découvrir :

```text
Compilation Maven
↓
Packaging Maven
↓
Manifest Maven
↓
Dépendances Maven
```

afin de comprendre ce que Maven automatise réellement.

---

# 1. Vérifier Maven

Commande :

```bash
mvn -version
```

Résultat attendu :

```text
Apache Maven 3.x.x

Java version: 1.8
```

---

# 2. Créer l'arborescence Maven

Créer :

```text
D:\demo\app-java8-maven
│
├── pom.xml
│
└── src
    └── main
        └── java
            ├── Main.java
            └── MathUtils.java
```

---

# 3. Créer la classe métier

Fichier :

```text
src\main\java\MathUtils.java
```

Code :

```java
public class MathUtils {

  int sum(int numb1, int numb2) {
    int result = numb1 + numb2;
    System.out.println("00000000001:MathUtils:sum");
    return result;
  }
}
```

---

# 4. Créer l'application

Fichier :

```text
src\main\java\Main.java
```

Code :

```java
public class Main {

  public static void main(String[] args) {

    MathUtils item = new MathUtils();

    int result = item.sum(10, 110);

    System.out.println("00000000001:");
    System.out.println("00000000001:sum:" + result);
  }
}
```

---

# 5. Créer le premier pom.xml

Fichier :

```text
pom.xml
```

Contenu :

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         https://maven.apache.org/xsd/maven-4.0.0.xsd">

  <modelVersion>4.0.0</modelVersion>

  <groupId>com.ganatan</groupId>
  <artifactId>app-java8-maven</artifactId>
  <version>1.0.0</version>

  <properties>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
  </properties>

</project>
```

---

# 6. Compiler le projet

Commande :

```bash
mvn compile
```

Résultat :

```text
BUILD SUCCESS
```

---

# 7. Observer le répertoire target

Résultat :

```text
target
│
└── classes
    ├── Main.class
    └── MathUtils.class
```

Maven a remplacé :

```bash
javac Main.java
```

par :

```bash
mvn compile
```

---

# 8. Créer le JAR Maven

Commande :

```bash
mvn package
```

Résultat :

```text
target
└── app-java8-maven-1.0.0.jar
```

---

# 9. Vérifier le contenu du JAR

Commande :

```bash
jar tf target\app-java8-maven-1.0.0.jar
```

Résultat :

```text
META-INF/
META-INF/MANIFEST.MF
Main.class
MathUtils.class
```

---

# 10. Essayer d'exécuter le JAR

Commande :

```bash
java -jar target\app-java8-maven-1.0.0.jar
```

Résultat :

```text
aucun attribut manifeste principal
```

ou :

```text
no main manifest attribute
```

---

# Pourquoi ?

Maven a créé automatiquement :

```text
META-INF/MANIFEST.MF
```

mais il ne connaît pas :

```text
la classe principale
```

---

# 11. Ajouter Main-Class dans le manifest

Modifier le pom.xml.

Ajouter :

```xml
<build>
  <plugins>

    <plugin>
      <groupId>org.apache.maven.plugins</groupId>
      <artifactId>maven-jar-plugin</artifactId>
      <version>3.4.2</version>

      <configuration>
        <archive>
          <manifest>
            <mainClass>Main</mainClass>
          </manifest>
        </archive>
      </configuration>

    </plugin>

  </plugins>
</build>
```

---

# 12. Recompiler

Commande :

```bash
mvn clean package
```

---

# 13. Exécuter le JAR

Commande :

```bash
java -jar target\app-java8-maven-1.0.0.jar
```

Résultat :

```text
00000000001:MathUtils:sum
00000000001:
00000000001:sum:120
```

Cette fois Maven a généré :

```text
Main-Class: Main
```

dans le manifest.

---

# 14. Ajouter des dépendances Maven

Modifier Main.java.

Code :

```java
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;

import java.io.File;

public class Main {

  public static void main(String[] args) throws Exception {

    MathUtils item = new MathUtils();

    int result = item.sum(10, 110);

    String value = "   ";

    System.out.println(
      "00000000001:isBlank:" +
      StringUtils.isBlank(value)
    );

    File file = new File("sample.txt");

    FileUtils.writeStringToFile(
      file,
      "sum=" + result,
      "UTF-8"
    );

    String content =
      FileUtils.readFileToString(
        file,
        "UTF-8"
      );

    System.out.println(
      "00000000001:file:" +
      content
    );
  }
}
```

---

# 15. Ajouter les dépendances au pom.xml

Ajouter :

```xml
<dependencies>

  <dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-lang3</artifactId>
    <version>3.12.0</version>
  </dependency>

  <dependency>
    <groupId>commons-io</groupId>
    <artifactId>commons-io</artifactId>
    <version>2.11.0</version>
  </dependency>

</dependencies>
```

---

# 16. Compiler

Commande :

```bash
mvn clean package
```

Résultat :

```text
BUILD SUCCESS
```

Maven télécharge automatiquement :

```text
commons-lang3
commons-io
```

dans :

```text
C:\Users\<user>\.m2\repository
```

---

# 17. Exécuter le JAR

Commande :

```bash
java -jar target\app-java8-maven-1.0.0.jar
```

Résultat :

```text
NoClassDefFoundError
```

ou :

```text
ClassNotFoundException
```

---

# Pourquoi ?

Le JAR contient :

```text
Main.class
MathUtils.class
```

mais ne contient pas :

```text
commons-lang3.jar
commons-io.jar
```

---

# 18. Ce que Maven a apporté

Avant Maven :

```text
Télécharger les JAR
Créer lib
Configurer le classpath
```

manuellement.

---

Avec Maven :

```xml
<dependency>
```

suffit.

Maven :

```text
Télécharge
Versionne
Configure le classpath
Compile
Package
```

automatiquement.

---

# 19. Où sont les librairies ?

Maven stocke les dépendances dans :

```text
C:\Users\<user>\.m2\repository
```

Exemple :

```text
.m2
└── repository
    ├── commons-io
    └── org
        └── apache
            └── commons
```

---

# Résumé

Maven remplace progressivement :

```text
javac
jar
manifest.txt
classpath
lib
```

par :

```text
pom.xml
mvn compile
mvn package
.m2/repository
```

Le cycle complet devient :

```text
Code Java
↓
pom.xml
↓
mvn compile
↓
mvn package
↓
JAR Maven
```

Limitation actuelle :

```text
Le JAR ne contient pas encore les dépendances externes.
```

La prochaine étape sera la création d'un :

```text
Fat JAR
```

contenant :

```text
Main.class
MathUtils.class
commons-lang3
commons-io
```

dans un unique fichier exécutable.
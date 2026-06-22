# 014-premier-projet-maven-java8.md

# Utilisation de Maven avec Java 8

## Objectif

Découvrir Maven progressivement en repartant de notre application Java composée de :

```text
Main.java
MathUtils.java
```

Nous allons voir successivement :

```text
Compilation Maven
↓
Création d'un JAR
↓
Manifest Maven
↓
Dépendances Maven
↓
Fat JAR
```

afin de comprendre précisément ce que Maven automatise.

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

# 3. Créer la classe MathUtils

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

# 4. Créer la classe Main

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

# 5. Premier pom.xml

Créer :

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

Maven génère :

```text
target
└── classes
    ├── Main.class
    └── MathUtils.class
```

---

# 7. Créer le JAR Maven

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

# 8. Vérifier le contenu du JAR

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

# 9. Exécuter le JAR

Commande :

```bash
java -jar target\app-java8-maven-1.0.0.jar
```

Résultat :

```text
aucun attribut manifeste principal
```

---

# Pourquoi ?

Maven crée bien un fichier :

```text
META-INF/MANIFEST.MF
```

mais il ne sait pas quelle classe contient :

```java
public static void main(...)
```

---

# 10. Deuxième pom.xml

Nous allons maintenant préciser la classe principale.

Remplacer le pom.xml par :

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

</project>
```

---

# 11. Recompiler

Commande :

```bash
mvn clean package
```

---

# 12. Exécuter le JAR

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

Maven a maintenant ajouté :

```text
Main-Class: Main
```

dans le manifest.

---

# 13. Ajouter des librairies externes

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

# 14. Troisième pom.xml

Ajouter les dépendances Maven.

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

</project>
```

---

# 15. Recompiler

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

# 16. Exécuter le JAR

Commande :

```bash
java -jar target\app-java8-maven-1.0.0.jar
```

Résultat :

```text
NoClassDefFoundError
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
commons-lang3
commons-io
```

---

# 17. Créer un Fat JAR

Nous allons maintenant construire un JAR contenant :

```text
Application
+
Toutes les dépendances
```

---

# 18. Quatrième pom.xml

Remplacer le pom.xml par :

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

      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-assembly-plugin</artifactId>
        <version>3.7.1</version>

        <configuration>

          <archive>
            <manifest>
              <mainClass>Main</mainClass>
            </manifest>
          </archive>

          <descriptorRefs>
            <descriptorRef>jar-with-dependencies</descriptorRef>
          </descriptorRefs>

        </configuration>

        <executions>

          <execution>
            <id>make-assembly</id>
            <phase>package</phase>

            <goals>
              <goal>single</goal>
            </goals>

          </execution>

        </executions>

      </plugin>

    </plugins>

  </build>

</project>
```

---

# 19. Générer le Fat JAR

Commande :

```bash
mvn clean package
```

Résultat :

```text
target
│
├── app-java8-maven-1.0.0.jar
│
└── app-java8-maven-1.0.0-jar-with-dependencies.jar
```

---

# 20. Vérifier le contenu

Commande :

```bash
jar tf target\app-java8-maven-1.0.0-jar-with-dependencies.jar
```

On retrouve notamment :

```text
Main.class
MathUtils.class

org/apache/commons/lang3/StringUtils.class

org/apache/commons/io/FileUtils.class
```

Cette fois les dépendances sont intégrées.

---

# 21. Exécuter le Fat JAR

Commande :

```bash
java -jar target\app-java8-maven-1.0.0-jar-with-dependencies.jar
```

Résultat :

```text
00000000001:MathUtils:sum
00000000001:isBlank:true
00000000001:file:sum=120
```

---

# Résumé

Sans Maven :

```text
javac
jar
manifest.txt
classpath
lib
```

Avec Maven :

```text
pom.xml
mvn compile
mvn package
dependency
plugin
```

Avec le Fat JAR :

```text
Application
+
Toutes les dépendances
=
Un seul fichier exécutable
```

Commande finale :

```bash
java -jar target\app-java8-maven-1.0.0-jar-with-dependencies.jar
```

Nous avons maintenant couvert l'ensemble du cycle Maven classique :

```text
Code Java
↓
Compilation
↓
Packaging
↓
Manifest
↓
Dépendances
↓
Fat JAR
```

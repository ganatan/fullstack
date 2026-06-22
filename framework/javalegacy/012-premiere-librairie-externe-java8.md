# 012-premieres-librairies-externes-java8.md

# Utilisation de plusieurs librairies externes en Java 8

## Objectif

Découvrir comment utiliser plusieurs librairies externes sans Maven.

Nous allons utiliser :

```text
Apache Commons Lang
Apache Commons IO
```

et les classes :

```java
StringUtils
FileUtils
```

Très utilisées dans les applications Java.

---

# 1. Télécharger les librairies

Télécharger :

```text
commons-lang3-3.12.0.jar
```

depuis :

```text
https://repo1.maven.org/maven2/org/apache/commons/commons-lang3/3.12.0/
```

Télécharger :

```text
commons-io-2.11.0.jar
```

depuis :

```text
https://repo1.maven.org/maven2/commons-io/commons-io/2.11.0/
```

---

# 2. Créer l'arborescence

Créer :

```text
D:\demo
│
├── Main.java
│
└── lib
```

Copier les deux fichiers :

```text
commons-lang3-3.12.0.jar
commons-io-2.11.0.jar
```

dans :

```text
D:\demo\lib
```

Résultat :

```text
D:\demo
│
├── Main.java
│
└── lib
    ├── commons-lang3-3.12.0.jar
    └── commons-io-2.11.0.jar
```

---

# 3. Créer l'application

Fichier :

```text
Main.java
```

Code :

```java
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;

import java.io.File;

public class Main {

  public static void main(String[] args) throws Exception {

    String value = "   ";

    System.out.println(
      StringUtils.isBlank(value)
    );

    File file = new File("sample.txt");

    FileUtils.writeStringToFile(
      file,
      "Hello Danny",
      "UTF-8"
    );

    String content =
      FileUtils.readFileToString(
        file,
        "UTF-8"
      );

    System.out.println(content);
  }
}
```

---

# 4. Compiler sans les librairies

Commande :

```bash
javac Main.java
```

Résultat :

```text
package org.apache.commons.lang3 does not exist
package org.apache.commons.io does not exist
```

Java ne trouve pas les classes.

---

# 5. Compiler avec plusieurs librairies

Commande :

```bash
javac -cp "lib/*" Main.java
```

Résultat :

```text
Main.class
```

La compilation fonctionne.

---

# 6. Exécuter avec plusieurs librairies

Commande :

```bash
java -cp ".;lib/*" Main
```

Résultat :

```text
true
Hello Danny
```

Un fichier :

```text
sample.txt
```

est créé automatiquement.

---

# 7. Comprendre le classpath

Compilation :

```bash
javac -cp "lib/*" Main.java
```

Exécution :

```bash
java -cp ".;lib/*" Main
```

Signification :

```text
.
=
répertoire courant

lib/*
=
tous les JAR du répertoire lib
```

---

# 8. Les classes utilisées

Apache Commons Lang :

```java
StringUtils
```

Exemple :

```java
StringUtils.isBlank(value);
```

---

Apache Commons IO :

```java
FileUtils
```

Exemple :

```java
FileUtils.writeStringToFile(...)
FileUtils.readFileToString(...)
```

---

# 9. Pourquoi utiliser ces librairies ?

Sans Apache Commons Lang :

```java
boolean result =
  value == null ||
  value.trim().length() == 0;
```

Avec :

```java
StringUtils.isBlank(value);
```

---

Sans Apache Commons IO :

```java
FileWriter
FileReader
BufferedReader
```

Avec :

```java
FileUtils.writeStringToFile(...)
FileUtils.readFileToString(...)
```

Le code est beaucoup plus simple.

---

# 10. Ce qu'est réellement une librairie externe

Chaque fichier :

```text
commons-lang3-3.12.0.jar
commons-io-2.11.0.jar
```

contient des centaines de classes compilées.

Par exemple :

```text
StringUtils.class
RandomStringUtils.class
NumberUtils.class
ArrayUtils.class
```

et :

```text
FileUtils.class
IOUtils.class
FilenameUtils.class
```

---

# 11. Différence avec les librairies standard

Librairie standard :

```java
import java.util.List;
import java.util.ArrayList;
```

Compilation :

```bash
javac Main.java
```

Aucune configuration supplémentaire.

---

Librairies externes :

```java
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.io.FileUtils;
```

Compilation :

```bash
javac -cp "lib/*" Main.java
```

Les JAR doivent être téléchargés et ajoutés au classpath.

---

# 12. Pourquoi Maven existe ?

Sans Maven :

```text
lib
├── commons-lang3.jar
├── commons-io.jar
├── jackson.jar
├── log4j.jar
├── junit.jar
├── mockito.jar
└── ...
```

Il faut :

```text
Télécharger
Copier
Configurer le classpath
```

manuellement.

---

Avec Maven :

```xml
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
```

Maven télécharge automatiquement :

```text
commons-lang3.jar
commons-io.jar
```

et configure le classpath.

---

# Résumé

Télécharger :

```text
commons-lang3-3.12.0.jar
commons-io-2.11.0.jar
```

Copie :

```text
D:\demo\lib
```

Compilation :

```bash
javac -cp "lib/*" Main.java
```

Exécution :

```bash
java -cp ".;lib/*" Main
```

Différence fondamentale :

```text
Librairie standard
=
incluse dans le JDK

Librairie externe
=
JAR supplémentaire à télécharger
```

Une application Java réelle est généralement composée de :

```text
Votre code
+
Plusieurs librairies externes
+
Classpath
```

C'est exactement ce que Maven automatise.
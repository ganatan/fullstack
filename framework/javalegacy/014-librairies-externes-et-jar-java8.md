# 013-creer-et-executer-un-jar-avec-librairies-externes-java8.md

# Créer et exécuter un JAR avec des librairies externes en Java 8

## Objectif

Partir d'une application Java simple :

```text
Main.java
MathUtils.java
```

utilisant deux librairies externes :

```text
Apache Commons Lang
Apache Commons IO
```

puis :

```text
Compiler
↓
Créer un JAR
↓
Exécuter l'application
```

Sans Maven.

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

```text
D:\demo\app-java-8
│
├── lib
│   ├── commons-lang3-3.12.0.jar
│   └── commons-io-2.11.0.jar
│
└── src
    ├── Main.java
    └── MathUtils.java
```

---

# 3. Créer la classe métier

## MathUtils.java

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

## Main.java

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

# 5. Compiler l'application

Se placer dans :

```bash
cd D:\demo\app-java-8\src
```

Compiler :

```bash
javac -cp "..\lib\*" Main.java MathUtils.java
```

Résultat :

```text
Main.class
MathUtils.class
```

---

# 6. Vérifier l'exécution

Commande :

```bash
java -cp ".;..\lib\*" Main
```

Résultat :

```text
00000000001:MathUtils:sum
00000000001:isBlank:true
00000000001:file:sum=120
```

---

# 7. Créer le manifeste

Créer :

```text
manifest.txt
```

Contenu :

```text
Main-Class: Main
```

Attention :

```text
Une ligne vide doit être présente à la fin du fichier.
```

---

# 8. Créer le JAR

Commande :

```bash
jar cfm app.jar manifest.txt Main.class MathUtils.class
```

Résultat :

```text
app.jar
```

---

# 9. Vérifier le contenu du JAR

Commande :

```bash
jar tf app.jar
```

Résultat :

```text
META-INF/
META-INF/MANIFEST.MF
Main.class
MathUtils.class
```

---

# 10. Essayer d'exécuter le JAR seul

Commande :

```bash
java -jar app.jar
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
commons-lang3-3.12.0.jar
commons-io-2.11.0.jar
```

---

# 11. Exécuter avec les librairies

Commande :

```bash
java -cp "app.jar;..\lib\*" Main
```

Résultat :

```text
00000000001:MathUtils:sum
00000000001:isBlank:true
00000000001:file:sum=120
```

Cette fois Java trouve :

```text
app.jar
+
commons-lang3.jar
+
commons-io.jar
```

---

# 12. Comprendre ce qui se passe

Compilation :

```bash
javac -cp "..\lib\*" Main.java MathUtils.java
```

Java utilise :

```text
commons-lang3.jar
commons-io.jar
```

pour compiler.

---

Création du JAR :

```bash
jar cfm app.jar manifest.txt Main.class MathUtils.class
```

Le JAR contient uniquement :

```text
Main.class
MathUtils.class
```

---

Exécution :

```bash
java -cp "app.jar;..\lib\*" Main
```

Java charge :

```text
app.jar
commons-lang3.jar
commons-io.jar
```

---

# 13. Limite de cette approche

L'application est composée de :

```text
app.jar
commons-lang3.jar
commons-io.jar
```

Il faut distribuer :

```text
3 fichiers
```

ensemble.

---

# 14. Pourquoi Maven existe ?

Sans Maven :

```text
app.jar
commons-lang3.jar
commons-io.jar
jackson.jar
log4j.jar
junit.jar
mockito.jar
...
```

Il faut :

```text
Télécharger
Copier
Configurer le classpath
```

manuellement.

---

# Résumé

Compiler :

```bash
javac -cp "..\lib\*" Main.java MathUtils.java
```

Exécuter :

```bash
java -cp ".;..\lib\*" Main
```

Créer le manifeste :

```text
Main-Class: Main
```

Créer le JAR :

```bash
jar cfm app.jar manifest.txt Main.class MathUtils.class
```

Afficher le contenu :

```bash
jar tf app.jar
```

Exécuter avec les librairies :

```bash
java -cp "app.jar;..\lib\*" Main
```

Cycle complet :

```text
Main.java
MathUtils.java
↓
javac
↓
Main.class
MathUtils.class
↓
jar
↓
app.jar
↓
commons-lang3.jar
commons-io.jar
↓
java -cp
↓
Application
```

Important :

```text
Un JAR classique ne contient pas automatiquement ses dépendances.
```

C'est un problème que Maven et Spring Boot résolvent plus tard avec les "fat jars" ou "uber jars".
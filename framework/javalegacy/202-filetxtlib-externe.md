# Utilisation d'une librairie externe en Java 8

---

# 1. Télécharger la librairie

Télécharger :

```text
commons-lang3-3.12.0.jar
```

https://repo1.maven.org/maven2/org/apache/commons/commons-lang3/3.12.0/

---

# 2. Créer l'arborescence

```text
D:\demo\app-java-8
│
├── lib
│   └── commons-lang3-3.12.0.jar
│
└── src
    ├── Main.java
    └── FileTxtLib.java
```

---

# 3. Créer la classe métier

Fichier :

```text
src\FileTxtLib.java
```

Code :

```java
public class FileTxtLib {

  FileTxtLib() {
    System.out.println("FileTxtLib:constructor");
  }

  void show() {
    System.out.println("FileTxtLib:show");
  }

}
```

---

# 4. Créer l'application

Fichier :

```text
src\Main.java
```

Code :

```java
import org.apache.commons.lang3.StringUtils;

public class Main {

  public static void main(String[] args) {

    System.out.println("Main:");

    FileTxtLib fileTxtLib = new FileTxtLib();

    fileTxtLib.show();

    String value = "   ";

    System.out.println(
      "StringUtils.isBlank = " +
      StringUtils.isBlank(value)
    );

  }

}
```

---

# 5. Compiler sans la librairie

Commande :

```bash
javac src\*.java
```

Résultat :

```text
package org.apache.commons.lang3 does not exist
```

Java ne trouve pas la librairie externe.

---

# 6. Compiler avec la librairie

Commande :

```bash
javac -cp ".\lib\*" src\*.java
```

---

# 7. Exécuter

Commande :

```bash
java -cp ".\lib\*;src" Main
```

Résultat :

```text
Main:
FileTxtLib:constructor
FileTxtLib:show
StringUtils.isBlank = true
```

---

# 8. Créer un JAR exécutable

Créer le JAR :

```bash
jar cfe filetxtlib.jar Main -C src .
```

Vérifier son contenu :

```bash
jar tf filetxtlib.jar
```

Résultat :

```text
META-INF/
META-INF/MANIFEST.MF
Main.class
FileTxtLib.class
```

Exécuter le JAR :

```bash
java -jar filetxtlib.jar
```

Résultat :

```text
Main:
FileTxtLib:constructor
FileTxtLib:show
```

---

# Résumé

Compilation :

```bash
javac -cp ".\lib\*" src\*.java
```

Exécution :

```bash
java -cp ".\lib\*;src" Main
```

Création du JAR :

```bash
jar cfe filetxtlib.jar Main -C src .
jar tf filetxtlib.jar
java -jar filetxtlib.jar
```

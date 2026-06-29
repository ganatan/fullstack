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
FileTxtLib.java
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
Main.java
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

# 5. Se placer dans le répertoire `src`

```bash
cd D:\demo\app-java-8\src
```

---

# 6. Compiler sans la librairie

Commande :

```bash
javac *.java
```

Résultat :

```text
package org.apache.commons.lang3 does not exist
```

Java ne trouve pas la librairie externe.

---

# 7. Compiler avec la librairie

Commande :

```bash
javac -cp ".\lib\*" *.java
```

---

# 8. Exécuter

Commande :

```bash
java -cp ".;.\lib\*" Main
```

Résultat :

```text
Main:
FileTxtLib:constructor
FileTxtLib:show
StringUtils.isBlank = true
```

---

# 9. Créer un JAR exécutable

Créer le JAR :

```bash
jar cfe filetxtlib.jar Main *.class
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
javac -cp ".\lib\*" *.java
```

Exécution :

```bash
java -cp ".;.\lib\*" Main
```

Création du JAR :

```bash
jar cfe filetxtlib.jar Main *.class
jar tf filetxtlib.jar
java -jar filetxtlib.jar
```

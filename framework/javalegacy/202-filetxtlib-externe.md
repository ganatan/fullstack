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

# 5. Se placer dans le répertoire src

```bash
cd D:\demo\app-java-8\src
```

---

# 6. Compiler sans la librairie

```bash
javac Main.java FileTxtLib.java
```

Résultat :

```text
package org.apache.commons.lang3 does not exist
```

Java ne trouve pas la librairie externe.

---

# 7. Compiler avec la librairie

```bash
javac -cp "..\lib\*" Main.java FileTxtLib.java
```

---

# 8. Exécuter

```bash
java -cp ".;..\lib\*" Main
```

Résultat :

```text
Main:
FileTxtLib:constructor
FileTxtLib:show
StringUtils.isBlank = true
```

---

# 9. Comprendre le classpath

Compilation :

```bash
javac -cp "..\lib\*" Main.java FileTxtLib.java
```

Exécution :

```bash
java -cp ".;..\lib\*" Main
```

Le classpath indique à Java où trouver :

- les classes du projet (`.`)
- les librairies externes (`..\lib\*`)

---

# 10. Les classes utilisées

Notre code :

```java
FileTxtLib
```

Librairie externe :

```java
StringUtils
```

Exemple :

```java
StringUtils.isBlank(value);
```

---


---

# Résumé

Compilation :

```bash
cd D:\demo\app-java-8\src

javac -cp "..\lib\*" Main.java FileTxtLib.java
```

Exécution :

```bash
java -cp ".;..\lib\*" Main
```


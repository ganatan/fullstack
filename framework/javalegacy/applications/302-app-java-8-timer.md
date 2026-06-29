# Analyse d'un répertoire avec un Timer en Java 8

---

# 1. Créer l'arborescence

```text
D:\demo\app-java-8-timer
│
├── input
│   ├── hello.txt
│   ├── java.txt
│   ├── spring.txt
│   └── angular.txt
│
└── src
    ├── Main.java
    └── FileTxtLib.java
```

---

# 2. Créer quelques fichiers

Créer le répertoire :

```text
input
```

Puis ajouter quelques fichiers texte :

```text
hello.txt
java.txt
spring.txt
angular.txt
```

Le contenu des fichiers n'a pas d'importance.

---

# 3. Créer la classe métier

Fichier :

```text
FileTxtLib.java
```

Code :

```java
import java.io.File;
import java.util.Timer;
import java.util.TimerTask;

public class FileTxtLib {

  private static final String INPUT = "../input";

  public FileTxtLib() {
    System.out.println("FileTxtLib:constructor");
  }

  public void start() {

    Timer timer = new Timer();

    timer.scheduleAtFixedRate(new TimerTask() {

      @Override
      public void run() {

        File directory = new File(INPUT);

        File[] files = directory.listFiles();

        System.out.println("-----------------------------");

        if (files == null || files.length == 0) {
          System.out.println("No file");
          return;
        }

        System.out.println("Files : " + files.length);

        for (File file : files) {
          if (file.isFile()) {
            System.out.println(file.getName());
          }
        }

      }

    }, 0, 10000);

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
public class Main {

  public static void main(String[] args) {

    System.out.println("Main:");

    FileTxtLib fileTxtLib = new FileTxtLib();

    fileTxtLib.start();

  }

}
```

---

# 5. Se placer dans le répertoire `src`

```bash
cd D:\demo\app-java-8-timer\src
```

---

# 6. Compiler

```bash
javac *.java
```

---

# 7. Exécuter

```bash
java Main
```

Résultat :

```text
Main:
FileTxtLib:constructor

-----------------------------
Files : 4
angular.txt
hello.txt
java.txt
spring.txt

-----------------------------
Files : 4
angular.txt
hello.txt
java.txt
spring.txt

-----------------------------
Files : 4
angular.txt
hello.txt
java.txt
spring.txt
```

Toutes les **10 secondes**, le programme affiche la liste des fichiers présents dans le répertoire `input`.

---

# 8. Ajouter un fichier

Créer par exemple :

```text
marvel.txt
```

Résultat après quelques secondes :

```text
-----------------------------
Files : 5
angular.txt
hello.txt
java.txt
marvel.txt
spring.txt
```

Le nouveau fichier est automatiquement détecté.

---

# Résumé

Compilation :

```bash
javac *.java
```

Exécution :

```bash
java Main
```

Le programme :

* crée un `Timer`
* exécute une tâche toutes les **10 secondes**
* analyse le répertoire `input`
* récupère la liste des fichiers
* affiche leur nombre
* affiche le nom de chaque fichier présent.

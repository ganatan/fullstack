# Lecture d'un fichier texte en Java 8

---

# 1. Créer l'arborescence

```text
D:\demo\app-java-8-read-file
│
├── input
│   └── files.txt
│
├── output
│
└── src
    ├── Main.java
    └── FileTxtLib.java
```

---

# 2. Créer le fichier d'entrée

Fichier :

```text
input\files.txt
```

Contenu :

```text
hello,Hello World
java,Java 8
spring,Spring Boot
angular,Angular 20
```

---

# 3. Créer la classe métier

Fichier :

```text
FileTxtLib.java
```

Code :

```java
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

public class FileTxtLib {

  private static final String INPUT = "../input/files.txt";
  private static final String OUTPUT = "../output";

  public FileTxtLib() {
    System.out.println("FileTxtLib:constructor");
  }

  public void generate() {

    File directory = new File(OUTPUT);

    if (!directory.exists()) {
      directory.mkdirs();
    }

    try (BufferedReader reader = new BufferedReader(new FileReader(INPUT))) {

      String line;

      while ((line = reader.readLine()) != null) {

        if (line.trim().isEmpty()) {
          continue;
        }

        String[] values = line.split(",", 2);

        if (values.length != 2) {
          continue;
        }

        String fileName = values[0].trim();
        String content = values[1].trim();

        File file = new File(directory, fileName + ".txt");

        try (BufferedWriter writer = new BufferedWriter(new FileWriter(file))) {
          writer.write(content);
        }

        System.out.println("Created : " + file.getName());

      }

    } catch (IOException e) {
      e.printStackTrace();
    }

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

    fileTxtLib.generate();

  }

}
```

---

# 5. Se placer dans le répertoire `src`

```bash
cd D:\demo\app-java-8-read-file\src
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
Created : hello.txt
Created : java.txt
Created : spring.txt
Created : angular.txt
```

---

# 8. Vérifier le répertoire `output`

```text
output
├── hello.txt
├── java.txt
├── spring.txt
└── angular.txt
```

---

# 9. Vérifier le contenu

Fichier :

```text
output\hello.txt
```

Contenu :

```text
Hello World
```

Fichier :

```text
output\java.txt
```

Contenu :

```text
Java 8
```

Fichier :

```text
output\spring.txt
```

Contenu :

```text
Spring Boot
```

Fichier :

```text
output\angular.txt
```

Contenu :

```text
Angular 20
```

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

* lit le fichier `input/files.txt`
* parcourt chaque ligne
* découpe chaque ligne avec `split(",")`
* crée un fichier texte dans le répertoire `output`
* écrit le contenu associé dans ce fichier.

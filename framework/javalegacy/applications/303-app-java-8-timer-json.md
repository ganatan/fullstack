# Lecture d'un fichier JSON en Java 8

---

# 1. Créer l'arborescence

```text
D:\demo\app-java-8-json
│
├── input
│   └── movies.json
│
├── output
│
├── lib
│   ├── jackson-core-2.20.0.jar
│   ├── jackson-databind-2.20.0.jar
│   └── jackson-annotations-2.20.0.jar
│
└── src
    ├── Main.java
    ├── FileTxtLib.java
    ├── Item.java
    └── Movie.java
```

---

# 2. Créer le fichier JSON

Fichier :

```text
input\movies.json
```

Contenu :

```json
[
  {
    "filename": "aliens.json",
    "data": {
      "name": "Aliens",
      "boxoffice": 10000
    }
  },
  {
    "filename": "avatar.json",
    "data": {
      "name": "Avatar",
      "boxoffice": 20000
    }
  }
]
```

---

# 3. Créer la classe Movie

Fichier :

```text
Movie.java
```

Code :

```java
public class Movie {

  public String name;

  public int boxoffice;

}
```

---

# 4. Créer la classe Item

Fichier :

```text
Item.java
```

Code :

```java
public class Item {

  public String filename;

  public Movie data;

}
```

---

# 5. Créer la classe métier

Fichier :

```text
FileTxtLib.java
```

Code :

```java
import java.io.File;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

public class FileTxtLib {

  private static final String INPUT = "../input/movies.json";

  private static final String OUTPUT = "../output";

  public FileTxtLib() {
    System.out.println("FileTxtLib:constructor");
  }

  public void generate() {

    try {

      File directory = new File(OUTPUT);

      if (!directory.exists()) {
        directory.mkdirs();
      }

      ObjectMapper mapper = new ObjectMapper();

      mapper.enable(SerializationFeature.INDENT_OUTPUT);

      Item[] items =
          mapper.readValue(
              new File(INPUT),
              Item[].class);

      for (Item item : items) {

        File output =
            new File(
                directory,
                item.filename);

        mapper.writeValue(
            output,
            item.data);

        System.out.println(
            "Created : " +
            item.filename);

      }

    } catch (Exception e) {
      e.printStackTrace();
    }

  }

}
```

---

# 6. Créer l'application

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

# 7. Se placer dans le répertoire `src`

```bash
cd D:\demo\app-java-8-json\src
```

---

# 8. Compiler

```bash
javac -cp ".\lib\*" *.java
```

---

# 9. Exécuter

```bash
java -cp ".;.\lib\*" Main
```

Résultat :

```text
Main:
FileTxtLib:constructor
Created : aliens.json
Created : avatar.json
```

---

# 10. Vérifier le répertoire `output`

```text
output
├── aliens.json
└── avatar.json
```

---

# 11. Vérifier le contenu

Fichier :

```text
output\aliens.json
```

Contenu :

```json
{
  "name" : "Aliens",
  "boxoffice" : 10000
}
```

Fichier :

```text
output\avatar.json
```

Contenu :

```json
{
  "name" : "Avatar",
  "boxoffice" : 20000
}
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

Le programme :

* lit le fichier `input/movies.json`
* désérialise le tableau JSON avec Jackson
* parcourt chaque élément
* crée un fichier JSON dans le répertoire `output`
* écrit le contenu de l'objet `data` dans ce fichier.

# Lecture d'un fichier texte avec les Streams en Java 8

---

# Objectif

Découvrir les **Streams Java 8** en lisant un fichier texte puis en effectuant quelques traitements simples.

Le programme va :

- lire un fichier texte ;
- supprimer les lignes vides ;
- convertir les lignes en majuscules ;
- trier les lignes par ordre alphabétique ;
- afficher le résultat.

---

# 1. Créer l'arborescence

```text
D:\demo\app-java-8-streams

│
├── input
│   └── movies.txt
│
└── src
    ├── Main.java
    └── FileTxtLib.java
```

---

# 2. Créer le fichier texte

Fichier :

```text
input\movies.txt
```

Contenu :

```text
Alien
Titanic

Avatar
Dune
Batman
Gladiator
```

---

# 3. Créer la classe métier

Fichier :

```text
FileTxtLib.java
```

Code :

```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.stream.Stream;

public class FileTxtLib {

  private static final String INPUT = "../input/movies.txt";

  public FileTxtLib() {
    System.out.println("FileTxtLib:constructor");
  }

  public void show() {

    try (Stream<String> lines = Files.lines(Paths.get(INPUT))) {

      lines
          .filter(line -> !line.trim().isEmpty())
          .map(String::toUpperCase)
          .sorted()
          .forEach(System.out::println);

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

    fileTxtLib.show();

  }

}
```

---

# 5. Se placer dans le répertoire `src`

```bash
cd D:\demo\app-java-8-streams\src
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

---

# Résultat

```text
Main:
FileTxtLib:constructor
ALIEN
AVATAR
BATMAN
DUNE
GLADIATOR
TITANIC
```

---

# Explication des Streams

## Lecture du fichier

```java
Files.lines(Paths.get(INPUT))
```

Retourne un flux (`Stream<String>`) contenant toutes les lignes du fichier.

---

## filter()

Supprime les lignes vides.

```java
.filter(line -> !line.trim().isEmpty())
```

---

## map()

Transforme chaque ligne.

```java
.map(String::toUpperCase)
```

Résultat :

```text
Alien
```

devient

```text
ALIEN
```

---

## sorted()

Trie les éléments.

```java
.sorted()
```

---

## forEach()

Affiche chaque élément.

```java
.forEach(System.out::println)
```

---

# Le pipeline Stream

```
movies.txt

        │
        ▼

Files.lines()

        │
        ▼

filter()

        │
        ▼

map()

        │
        ▼

sorted()

        │
        ▼

forEach()

        │
        ▼

Console
```

---

# Les principales opérations Stream

Filtrer :

```java
.filter(...)
```

Transformer :

```java
.map(...)
```

Trier :

```java
.sorted()
```

Limiter :

```java
.limit(5)
```

Ignorer :

```java
.skip(2)
```

Compter :

```java
.count()
```

Collecter dans une liste :

```java
.collect(Collectors.toList())
```

Afficher :

```java
.forEach(...)
```

---

# À retenir

Les **Streams** permettent de traiter des collections ou des fichiers de manière **déclarative**, sans écrire de boucles `for` explicites.

Dans cet exemple :

- `Files.lines()` lit le fichier ligne par ligne ;
- `filter()` supprime les lignes vides ;
- `map()` transforme les données ;
- `sorted()` trie les résultats ;
- `forEach()` affiche le résultat.

Ce type de traitement est l'une des principales nouveautés introduites par **Java 8**.
# Java Starter – IntelliJ

---

## 1. Vérifier Java

```bash
java -version
javac -version
```

Résultat attendu :
```
java version "21.0.x"
javac 21.0.x
```

Si Java n'est pas installé : https://www.oracle.com/java/technologies/downloads/

---

## 2. Créer le projet IntelliJ

```
File → New → Project

Name        : java-starter
Location    : choisir un dossier
Build system: IntelliJ
JDK         : 21
```

Cliquer sur **Create**.

---

## 3. Structure du projet

```
java-starter
└── src
    └── Main.java
```

---

## 4. Premier programme

Ouvrir `src/Main.java` et remplacer le contenu par :

```java
public class Main {

  public static void main(String[] args) {
    System.out.println("Bonjour Java");
  }
}
```

Cliquer sur le bouton ▶ vert à gauche de `main` ou appuyer sur **Shift + F10**.

Résultat dans la console :
```
Bonjour Java
```

---

## 5. Variables

```java
public class Main {

  public static void main(String[] args) {

    // types primitifs
    int age = 25;
    double prix = 9.99;
    boolean actif = true;
    char lettre = 'A';

    // String
    String nom = "Inception";

    System.out.println(age);
    System.out.println(prix);
    System.out.println(actif);
    System.out.println(lettre);
    System.out.println(nom);
  }
}
```

Résultat :
```
25
9.99
true
A
Inception
```

---

## 6. Conditions

```java
public class Main {

  public static void main(String[] args) {

    int age = 20;

    if (age >= 18) {
      System.out.println("majeur");
    } else {
      System.out.println("mineur");
    }
  }
}
```

Résultat :
```
majeur
```

---

## 7. Boucle for

```java
public class Main {

  public static void main(String[] args) {

    for (int i = 0; i < 5; i++) {
      System.out.println("ligne " + i);
    }
  }
}
```

Résultat :
```
ligne 0
ligne 1
ligne 2
ligne 3
ligne 4
```

---

## 8. ArrayList

```java
import java.util.ArrayList;

public class Main {

  public static void main(String[] args) {

    ArrayList<String> films = new ArrayList<>();

    films.add("Inception");
    films.add("The Matrix");
    films.add("Interstellar");

    System.out.println(films.size());    // 3
    System.out.println(films.get(0));    // Inception
    System.out.println(films.get(1));    // The Matrix

    films.remove(0);
    System.out.println(films.size());    // 2

    for (int i = 0; i < films.size(); i++) {
      System.out.println(films.get(i));
    }
  }
}
```

Résultat :
```
3
Inception
The Matrix
2
The Matrix
Interstellar
```

---

## 9. Méthode

```java
public class Main {

  public static void main(String[] args) {
    String resultat = direBonjour("Alice");
    System.out.println(resultat);

    int total = additionner(3, 5);
    System.out.println(total);
  }

  private static String direBonjour(String nom) {
    return "Bonjour " + nom;
  }

  private static int additionner(int a, int b) {
    return a + b;
  }
}
```

Résultat :
```
Bonjour Alice
8
```

---

## 10. Classe

```java
public class Main {

  static class Film {
    String nom;
    int annee;

    Film(String nom, int annee) {
      this.nom = nom;
      this.annee = annee;
    }
  }

  public static void main(String[] args) {
    Film film = new Film("Inception", 2010);
    System.out.println(film.nom);
    System.out.println(film.annee);
  }
}
```

Résultat :
```
Inception
2010
```

---

## 11. Throw

```java
public class Main {

  public static void main(String[] args) {

    // sans erreur
    try {
      process(false);
      System.out.println("status : ok");
    } catch (RuntimeException e) {
      System.out.println("status : error");
    }

    // avec erreur
    try {
      process(true);
      System.out.println("status : ok");
    } catch (RuntimeException e) {
      System.out.println("status : error");
      System.out.println("message : " + e.getMessage());
    }
  }

  private static void process(boolean fail) {
    if (fail) {
      throw new RuntimeException("quelque chose s'est mal passé");
    }
  }
}
```

Résultat :
```
status : ok
status : error
message : quelque chose s'est mal passé
```

---

## Raccourcis IntelliJ utiles

| Raccourci | Action |
|---|---|
| `Shift + F10` | lancer le programme |
| `Ctrl + Z` | annuler |
| `Ctrl + /` | commenter une ligne |
| `Shift + F6` | renommer une variable |
| `Ctrl + D` | dupliquer une ligne |
| `sout + Tab` | génère `System.out.println()` |

# 001-main.md — Java `main()` (Hello World)

## Objectif
Comprendre le point d’entrée d’un programme Java : la méthode `main`.

---

## Le code

```java
package java_starter;

public class Main {

  public static void main(String[] args) {
    System.out.println("Bonjour Java");
  }

}
```

---

## `package java_starter;`
- Le **package** est le **namespace** Java (organisation logique).
- Il doit correspondre au chemin du fichier source.

Exemple de structure attendue :

```
src/
  java_starter/
    Main.java
```

Si le package ne correspond pas au dossier, `javac`/l’IDE va lever des erreurs.

---

## `public class Main`
- En Java, le code vit dans des **classes**.
- `public` : classe accessible depuis n’importe où.
- Nom de classe = nom du fichier (ici `Main.java`) en Java “classique”.

---

## `public static void main(String[] args)`
C’est **le point d’entrée** : la JVM appelle cette méthode au démarrage.

### Détail mot par mot
- `public` : la JVM doit pouvoir l’appeler.
- `static` : pas besoin de créer une instance de `Main` pour lancer le programme.
- `void` : ne renvoie rien.
- `main` : nom imposé.
- `String[] args` : arguments de ligne de commande.

Exemple :
```bash
java java_starter.Main salut 123
```
Alors :
- `args[0] = "salut"`
- `args[1] = "123"`

---

## `System.out.println(...)`
- `System` : classe utilitaire (package `java.lang` importé automatiquement).
- `out` : flux de sortie standard (console).
- `println` : affiche le texte + un saut de ligne.

Variante sans saut de ligne :
```java
System.out.print("Bonjour");
```

---

## Exécuter en ligne de commande (JDK installé)

### 1) Compiler
Place-toi au niveau du dossier `src` :

```bash
javac java_starter/Main.java
```

### 2) Lancer
Toujours depuis `src` :

```bash
java java_starter.Main
```

Résultat :
```
Bonjour Java
```

---

## Exécuter avec un IDE (IntelliJ / Eclipse / VSCode)
- Crée un projet Java.
- Place `Main.java` dans `src/java_starter/`.
- Clique **Run** sur la classe.

L’IDE gère :
- le classpath
- la compilation
- l’exécution

---

## À retenir
- **`main`** = démarrage du programme.
- **`static`** = pas d’objet à créer pour démarrer.
- **`package`** = doit matcher le dossier.
- **`System.out.println`** = console.

# Créer et exécuter un JAR exécutable

## Code

```java
public class Main {

  public static void main(String[] args) {
    System.out.println("Main:");
    FileTxtLib fileTxtLib = new FileTxtLib();
    fileTxtLib.show();
  }

}

public class FileTxtLib {

  FileTxtLib() {
    System.out.println("FileTxtLib:constructor");
  }

  void show() {
    System.out.println("FileTxtLib:show");
  }

}
```

## Compilation

Compiler toutes les classes Java :

```bash
javac *.java
```

## Création du JAR

Créer un JAR exécutable en indiquant la classe principale et en ajoutant toutes les classes compilées :

```bash
jar cfe filetxtlib.jar Main *.class
```

## Vérification

Afficher le contenu du JAR :

```bash
jar tf filetxtlib.jar
```

Résultat attendu :

```text
META-INF/
META-INF/MANIFEST.MF
Main.class
FileTxtLib.class
```

## Exécution

Lancer le JAR :

```bash
java -jar filetxtlib.jar
```

## Résultat

```text
Main:
FileTxtLib:constructor
FileTxtLib:show
```

## À retenir

* `javac *.java` compile toutes les classes du projet.
* `jar cfe` crée un JAR exécutable et définit la classe principale (`Main-Class`).
* Toutes les classes utilisées par `Main` doivent être incluses dans le JAR (`*.class`), sinon une erreur `NoClassDefFoundError` est levée lors de l'exécution.

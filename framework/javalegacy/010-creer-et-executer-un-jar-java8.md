# 010-creer-et-executer-un-jar-java8.md

# Créer et exécuter un JAR en Java 8

## Objectif

Partir d'une application Java simple :

```text
Main.java
MathUtils.java
```

puis :

```text
Compiler
↓
Créer un JAR
↓
Exécuter le JAR
```

Sans Maven.

---

# 1. Créer les fichiers

## MathUtils.java

```java
public class MathUtils {

  int sum(int numb1,int numb2) {
    int result = numb1 + numb2;
    System.out.println("00000000001:MathUtils:sum");
    return result;
  }
}
```

---

## Main.java

```java
public class Main {

  public static void main(String[] args) {

    MathUtils item = new MathUtils();

    int result = item.sum(10, 110);

    System.out.println("00000000001:");
    System.out.println("00000000001:sum:" + result);
  }
}
```

---

# 2. Compiler l'application

Commande :

```bash
javac Main.java
```

Résultat :

```text
Main.class
MathUtils.class
```

Même si seule la classe Main est compilée explicitement :

```bash
javac Main.java
```

Java compile automatiquement :

```text
MathUtils.java
```

car elle est utilisée par Main.

---

# 3. Exécuter l'application

Commande :

```bash
java Main
```

Résultat :

```text
00000000001:MathUtils:sum
00000000001:
00000000001:sum:120
```

---

# 4. Créer le manifeste

Créer le fichier :

```text
manifest.txt
```

Contenu :

```text
Main-Class: Main
```

Attention :

```text
Une ligne vide doit être présente à la fin du fichier.
```

---

# 5. Créer le JAR

Commande :

```bash
jar cfm app.jar manifest.txt Main.class MathUtils.class
```

Résultat :

```text
app.jar
```

---

# 6. Vérifier le contenu du JAR

Commande :

```bash
jar tf app.jar
```

Résultat :

```text
META-INF/
META-INF/MANIFEST.MF
Main.class
MathUtils.class
```

---

# 7. Exécuter le JAR

Commande :

```bash
java -jar app.jar
```

Résultat :

```text
00000000001:MathUtils:sum
00000000001:
00000000001:sum:120
```

---

# Comprendre ce qui se passe

## Compilation

```bash
javac Main.java
```

génère :

```text
Main.class
MathUtils.class
```

---

## Création du JAR

```bash
jar cfm app.jar manifest.txt Main.class MathUtils.class
```

regroupe les classes dans :

```text
app.jar
```

---

## Manifest

```text
Main-Class: Main
```

indique à Java :

```text
Quelle classe contient la méthode main()
```

---

## Exécution

```bash
java -jar app.jar
```

Java :

```text
Lit le manifest
↓
Trouve Main
↓
Exécute Main.main()
```

---

# Résumé

Compiler :

```bash
javac Main.java
```

Exécuter :

```bash
java Main
```

Créer le manifeste :

```text
Main-Class: Main
```

Créer le JAR :

```bash
jar cfm app.jar manifest.txt Main.class MathUtils.class
```
ou
```bash
jar cfm app.jar manifest.txt *.class
```

Afficher le contenu :

```bash
jar tf app.jar
```

Exécuter le JAR :

```bash
java -jar app.jar
```

Cycle complet :

```text
Main.java
MathUtils.java
↓
javac
↓
Main.class
MathUtils.class
↓
jar
↓
app.jar
↓
java -jar app.jar
```
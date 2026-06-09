# 002-compilation-et-execution-java8.md

## Objectif

Comprendre le cycle complet d'un programme Java :

```text
Code source (.java)
↓
Compilation (javac)
↓
Bytecode (.class)
↓
Exécution (java)
↓
JVM
```

Avant d'utiliser IntelliJ, il est important de comprendre ce qui se passe réellement derrière les boutons Build et Run.

---

## 1. Créer le répertoire

Créer :

```text
D:\hal\workspace-java8\hello-world
```

---

## 2. Créer le fichier

Créer :

```text
HelloWorld.java
```

Contenu :

```java
public class HelloWorld {

    public static void main(String[] args) {
        System.out.println("Bonjour Danny");
    }
}
```

---

## 3. Ouvrir un terminal

Se positionner dans le répertoire :

```bash
cd D:\hal\workspace-java8\hello-world
```

---

## 4. Vérifier Java

```bash
java -version
```

Résultat attendu :

```text
java version "1.8.0_202"
Java(TM) SE Runtime Environment
Java HotSpot(TM) 64-Bit Server VM
```

---

## 5. Vérifier le compilateur

```bash
javac -version
```

Résultat attendu :

```text
javac 1.8.0_202
```

---

## 6. Compiler

```bash
javac HelloWorld.java
```

Aucune erreur ne doit apparaître.

---

## 7. Vérifier le résultat

```bash
dir
```

Résultat :

```text
HelloWorld.java
HelloWorld.class
```

Le fichier :

```text
HelloWorld.class
```

est le bytecode Java produit par le compilateur.

---

## 8. Exécuter

```bash
java HelloWorld
```

Résultat :

```text
Bonjour Danny
```

---

## 9. Vérifier la JVM utilisée

Modifier le programme :

```java
public class HelloWorld {

    public static void main(String[] args) {
        System.out.println(System.getProperty("java.version"));
    }
}
```

Compiler :

```bash
javac HelloWorld.java
```

Exécuter :

```bash
java HelloWorld
```

Résultat :

```text
1.8.0_202
```

---

## Résumé

Compilation :

```text
HelloWorld.java
↓
javac
↓
HelloWorld.class
```

Exécution :

```text
HelloWorld.class
↓
java
↓
JVM
↓
Bonjour Danny
```

---

## Compétences acquises

* Vérifier la version de Java
* Vérifier la version du compilateur
* Compiler un programme Java
* Générer un fichier .class
* Exécuter un programme Java
* Comprendre le rôle de la JVM
* Vérifier la version Java utilisée par l'application

---

## Prochaine étape

```text
003-premier-projet-intellij-java8.md
```

Objectifs :

* Créer un projet IntelliJ
* Configurer le SDK Java 8
* Comprendre Build et Run
* Générer automatiquement les fichiers .class
* Déboguer une application Java

```
```

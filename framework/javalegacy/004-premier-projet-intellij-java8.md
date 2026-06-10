# 003-premier-projet-intellij-java8.md

## Objectif

Créer un véritable projet Java 8 avec IntelliJ.

Comprendre ce que fait IntelliJ automatiquement :

```text id="rgg0s3"
Code source
↓
Build
↓
Compilation
↓
Exécution
```

---

## 1. Lancer IntelliJ

Choisir :

```text id="t6qg3z"
New Project
```

---

## 2. Créer le projet

Sélectionner :

```text id="xpg7mk"
Java
```

Choisir le SDK :

```text id="bgc3q8"
D:\hal\java\jdk-08
```

Nom :

```text id="xbd7yu"
java8-training
```

Répertoire :

```text id="tnt9k8"
D:\hal\workspace-java8\java8-training
```

Cliquer :

```text id="3ps0c0"
Create
```

---

## 3. Vérifier la configuration Java 8

Menu :

```text id="hfcfx9"
File
Project Structure
```

Vérifier :

```text id="sv2n4j"
Project SDK : 1.8
```

et :

```text id="9okj0v"
Language Level : 8
```

---

## 4. Vérifier le compilateur

Menu :

```text id="j6q5g3"
File
Settings
Build, Execution, Deployment
Compiler
Java Compiler
```

Vérifier :

```text id="1fjzlc"
Target bytecode version : 8
```

---

## 5. Créer Main.java

Dans :

```text id="0o4n5q"
src
```

Créer :

```text id="h53ygm"
Main.java
```

Code :

```java id="rkf5gx"
public class Main {

    public static void main(String[] args) {

        System.out.println("Bonjour Danny");

    }
}
```

---

## 6. Exécuter

Clic droit :

```text id="dqls6w"
Run Main.main()
```

ou :

```text id="3m2o4p"
Shift + F10
```

Résultat :

```text id="dn9xzd"
Bonjour Danny
```

---

## 7. Comprendre l'arborescence

Après compilation :

```text id="e9k5vv"
java8-training
|
+-- src
|    |
|    +-- Main.java
|
+-- out
     |
     +-- production
          |
          +-- java8-training
               |
               +-- Main.class
```

---

## 8. Localiser le .class

Le compilateur IntelliJ a généré :

```text id="lgx8z3"
Main.class
```

sans que tu lances :

```bash id="z7tq9g"
javac
```

manuellement.

---

## 9. Vérifier la JVM

Modifier :

```java id="wx1yyq"
public class Main {

    public static void main(String[] args) {

        System.out.println(System.getProperty("java.version"));

    }
}
```

Exécuter.

Résultat attendu :

```text id="4vms8e"
1.8.0_202
```

---

## 10. Utiliser le débogueur

Ajouter :

```java id="40a7lr"
public class Main {

    public static void main(String[] args) {

        String name = "Danny";

        System.out.println(name);

    }
}
```

Cliquer dans la marge :

```text id="pph3gl"
Breakpoint
```

Puis :

```text id="qjl3lb"
Debug Main.main()
```

ou :

```text id="s2bd9w"
Shift + F9
```

---

## Compétences acquises

* Créer un projet IntelliJ
* Utiliser Java 8
* Configurer le SDK
* Configurer le compilateur
* Exécuter une application
* Comprendre les fichiers .class
* Utiliser le débogueur

---

## Prochaine étape

```text id="my8mvl"
004-variables-types-et-operateurs-java8.md
```

Objectifs :

* String
* int
* long
* double
* boolean
* constantes
* opérateurs
* affichage console

```
```

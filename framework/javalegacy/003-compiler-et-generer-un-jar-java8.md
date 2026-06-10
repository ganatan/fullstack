# 003-compiler-et-generer-un-jar-java8.md

# Compiler et générer un JAR Java 8

## Objectif

Comprendre :

```text
.java
↓
.class
↓
.jar
↓
Linux
```

et vérifier la promesse Java :

```text
Write Once
Run Anywhere
```

---

# 1. Projet de départ

Nous disposons du projet :

```text
java8-training
|
+-- src
    |
    +-- HelloWorld.java
```

Code :

```java
public class HelloWorld {

    public static void main(String[] args) {
        System.out.println("Bonjour Danny");
    }
}
```

---

# 2. Compilation IntelliJ

Lancer :

```text
Build
Build Project
```

ou :

```text
Ctrl + F9
```

IntelliJ crée automatiquement :

```text
out
|
+-- production
    |
    +-- java8-training
        |
        +-- HelloWorld.class
```

---

# 3. Comprendre le fichier .class

Le fichier :

```text
HelloWorld.class
```

n'est pas :

```text
Windows
Linux
Mac
```

Il contient :

```text
Bytecode Java
```

Ce bytecode est compris par n'importe quelle JVM.

---

# 4. Exécuter le .class

Ouvrir un terminal.

Se placer dans :

```text
out\production\java8-training
```

Puis :

```bash
java HelloWorld
```

Résultat :

```text
Bonjour Danny
```

---

# 5. Pourquoi créer un JAR

Un projet réel contient souvent :

```text
50
100
500
1000 classes
```

On regroupe alors toutes les classes dans :

```text
application.jar
```

---

# 6. Créer un JAR exécutable

Depuis :

```text
out\production\java8-training
```

Exécuter :

```bash
jar cfe hello.jar HelloWorld HelloWorld.class
```

---

# 7. Vérifier le JAR

Le fichier apparaît :

```text
hello.jar
```

Vérifier son contenu :

```bash
jar tf hello.jar
```

Résultat :

```text
META-INF/
META-INF/MANIFEST.MF
HelloWorld.class
```

---

# 8. Exécuter le JAR

Depuis le même dossier :

```bash
java -jar hello.jar
```

Résultat :

```text
Bonjour Danny
```

---

# 9. Copier vers Linux

Copie :

```text
hello.jar
```

sur une machine Linux.

Par exemple :

```bash
scp hello.jar user@linux:/home/user
```

---

# 10. Vérifier Java sous Linux

Connexion :

```bash
ssh user@linux
```

Puis :

```bash
java -version
```

Exemple :

```text
openjdk version "1.8"
```

---

# 11. Exécuter sous Linux

Dans le dossier contenant :

```text
hello.jar
```

Exécuter :

```bash
java -jar hello.jar
```

Résultat :

```text
Bonjour Danny
```

---

# 12. Ce qui vient de se passer

Compilation Windows :

```text
HelloWorld.java
↓
HelloWorld.class
↓
hello.jar
```

Exécution Linux :

```text
hello.jar
↓
JVM Linux
↓
Bonjour Danny
```

Le code n'a jamais été recompilé.

C'est la JVM qui assure la portabilité.

---

# Résumé

Création des classes :

```bash
javac HelloWorld.java
```

Exécution des classes :

```bash
java HelloWorld
```

Création du JAR :

```bash
jar cfe hello.jar HelloWorld HelloWorld.class
```

Exécution du JAR :

```bash
java -jar hello.jar
```

Même JAR :

```text
Windows
Linux
Mac
```

si une JVM compatible est installée.
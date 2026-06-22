# Installation Java 8 Ancien Monde avec IntelliJ

## 1. Télécharger Oracle JDK 8

Archive Oracle :

https://www.oracle.com/java/technologies/javase/javase8-archive-downloads.html

Compte Oracle nécessaire.

Télécharger :

```text
jdk-8u202-windows-x64.exe
```

Version :

```text
Java 8 Update 202
1.8.0_202
```

---

## Alternative

Si l'accès Oracle pose problème :

https://adoptium.net/temurin/releases/?version=8

Choisir :

```text
Operating System : Windows
Architecture : x64
Package Type : JDK
```

---

## 2. Créer l'arborescence

Créer :

```text
D:\hal\java
```

---

## 3. Installer le JDK

Lancer :

```text
jdk-8u202-windows-x64.exe
```

Installer dans :

```text
D:\hal\java\jdk-08
```

---

## 4. Installer le JRE

Conserver l'installation du JRE.

Installer dans :

```text
D:\hal\java\jre-08
```

Résultat :

```text
D:\hal\java
|
+-- jdk-08
|
+-- jre-08
```

---

## 5. Configurer JAVA_HOME

Créer la variable système :

```text
JAVA_HOME
```

Valeur :

```text
D:\hal\java\jdk-08
```

---

## 6. Configurer PATH

Ajouter :

```text
%JAVA_HOME%\bin
```

Supprimer toute référence à :

```text
C:\Program Files\Common Files\Oracle\Java\javapath
```

ou

```text
javapath
```

afin d'éviter que Windows utilise une autre version de Java.

---

## 7. Vérifier JAVA_HOME

Ouvrir un nouveau terminal :

```bash
echo %JAVA_HOME%
```

Résultat attendu :

```text
D:\hal\java\jdk-08
```

---

## 8. Vérifier Java

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

## 9. Vérifier le compilateur

```bash
javac -version
```

Résultat attendu :

```text
javac 1.8.0_202
```

---

## 10. Vérifier les exécutables utilisés

```bash
where java
```

Résultat attendu :

```text
D:\hal\java\jdk-08\bin\java.exe
```

Puis :

```bash
where javac
```

Résultat attendu :

```text
D:\hal\java\jdk-08\bin\javac.exe
```

---

## 11. Installer IntelliJ Community

Télécharger :

https://www.jetbrains.com/idea/download/

Choisir :

```text
IntelliJ IDEA Community Edition
```

Installer dans :

```text
D:\hal\intellij
```

---

## 12. Créer un Workspace

Créer :

```text
D:\hal\workspace-java8
```

---

## 13. Créer le premier projet

Lancer IntelliJ.

```text
New Project
```

Choisir :

```text
Java
```

Sélectionner le JDK :

```text
D:\hal\java\jdk-08
```

Nom du projet :

```text
java8-training
```

Emplacement :

```text
D:\hal\workspace-java8\java8-training
```

---

## 14. Vérifier la configuration Java 8

Dans IntelliJ :

```text
File
Settings
Project Structure
```

Vérifier :

```text
Project SDK : 1.8
Project language level : 8
```

Puis :

```text
Settings
Build, Execution, Deployment
Compiler
Java Compiler
```

Vérifier :

```text
Target bytecode version : 8
```

---

## 15. Premier programme

Créer :

```text
src\HelloWorld.java
```

```java
public class HelloWorld {

    public static void main(String[] args) {
        System.out.println("Bonjour Danny");
    }
}
```

---

## 16. Exécuter

Dans IntelliJ :

```text
Run
```

ou

```text
Shift + F10
```

Résultat attendu :

```text
Bonjour Danny
```

---

## Environnement 

```text
D:\hal\java\jdk-08
D:\hal\java\jre-08
D:\hal\intellij
D:\hal\workspace-java8

Java 8u202
IntelliJ Community
Maven
SVN
Tomcat 8
```

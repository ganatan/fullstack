# Installation Java 8 Ancien Monde

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

## 3. Installer

Lancer :

```text
jdk-8u202-windows-x64.exe
```

Modifier le répertoire proposé par Oracle :

```text
D:\hal\java\jdk-08
```

---

## 4. Configurer JAVA_HOME

Créer la variable système :

```text
JAVA_HOME
```

Valeur :

```text
D:\hal\java\jdk-08
```

---

## 5. Modifier PATH

Ajouter :

```text
%JAVA_HOME%\bin
```

---

## 6. Vérifier JAVA_HOME

Ouvrir un terminal :

```bash
echo %JAVA_HOME%
```

Résultat :

```text
D:\hal\java\jdk-08
```

---

## 7. Vérifier Java

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

## 8. Vérifier le compilateur

```bash
javac -version
```

Résultat attendu :

```text
javac 1.8.0_202
```

---

## 9. Installer Eclipse

https://www.eclipse.org/downloads/

Choisir :

```text
Eclipse IDE for Java Developers
```

Installer dans :

```text
D:\hal\eclipse
```

---

## 10. Créer un Workspace

```text
D:\hal\workspace-java8
```

---

## 11. Premier programme

Créer :

```text
HelloWorld.java
```

```java
public class HelloWorld {

    public static void main(String[] args) {
        System.out.println("Bonjour Danny");
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
Bonjour Danny
```

---

## Environnement Naval Group

```text
D:\hal\java\jdk-08
D:\hal\eclipse
D:\hal\workspace-java8

Java 8u202
Eclipse
Maven
SVN
Tomcat 8
```

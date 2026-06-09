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

Important :

Supprimer toute référence à :

```text
C:\Program Files\Common Files\Oracle\Java\javapath
```

ou

```text
javapath
```

car ce répertoire prend souvent la priorité et fait pointer Windows vers une autre version de Java (Java 21, Java 25, Java 26, etc.).

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

## 11. Installer Eclipse

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

## 12. Créer un Workspace

```text
D:\hal\workspace-java8
```

---

## 13. Premier programme

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
D:\hal\java\jre-08
D:\hal\eclipse
D:\hal\workspace-java8

Java 8u202
Eclipse
Maven
SVN
Tomcat 8
```

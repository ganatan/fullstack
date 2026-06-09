# Installation Java 8 Ancien Monde

## Objectif

Installer un environnement proche des projets Java 8 historiques :

* Oracle JDK 8u202
* Eclipse
* Maven
* SVN

---

# 1. Télécharger Oracle JDK 8

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

# Alternative

Si l'accès Oracle pose problème :

https://adoptium.net/temurin/releases/?version=8

Choisir :

```text
Operating System : Windows
Architecture : x64
Package Type : JDK
```

Pour un entretien Java 8, aucune différence pratique.

---

# 2. Installer

Lancer :

```text
jdk-8u202-windows-x64.exe
```

Installer dans :

```text
C:\Program Files\Java\jdk1.8.0_202
```

---

# 3. Configurer JAVA_HOME

Créer :

```text
JAVA_HOME
```

Valeur :

```text
C:\Program Files\Java\jdk1.8.0_202
```

---

# 4. Modifier PATH

Ajouter :

```text
%JAVA_HOME%\bin
```

---

# 5. Vérifier

Ouvrir un terminal :

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

# 6. Vérifier le compilateur

```bash
javac -version
```

Résultat attendu :

```text
javac 1.8.0_202
```

---

# 7. Vérifier JAVA_HOME

```bash
echo %JAVA_HOME%
```

Résultat :

```text
C:\Program Files\Java\jdk1.8.0_202
```

---

# 8. Installer Eclipse

https://www.eclipse.org/downloads/

Choisir :

```text
Eclipse IDE for Java Developers
```

---

# 9. Premier programme

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

# Environnement cible Naval Group

```text
Windows
Oracle JDK 8u202
Eclipse
Maven 3.x
SVN
Tomcat 8
```

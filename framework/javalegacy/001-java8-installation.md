# Installation Oracle JDK 8u202 (Ancien Monde)

## 1. Télécharger

Télécharger :

```text
Oracle JDK 8 Update 202
jdk-8u202-windows-x64.exe
```

Version :

```text
1.8.0_202
```

---

## 2. Installer

Exécuter :

```text
jdk-8u202-windows-x64.exe
```

Conserver le répertoire proposé :

```text
C:\Program Files\Java\jdk1.8.0_202
```

---

## 3. Créer JAVA_HOME

Variables d'environnement :

```text
JAVA_HOME
```

Valeur :

```text
C:\Program Files\Java\jdk1.8.0_202
```

---

## 4. Modifier PATH

Ajouter :

```text
%JAVA_HOME%\bin
```

---

## 5. Vérifier

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

## 6. Vérifier le compilateur

```bash
javac -version
```

Résultat attendu :

```text
javac 1.8.0_202
```

---

## 7. Vérifier JAVA_HOME

```bash
echo %JAVA_HOME%
```

Résultat :

```text
C:\Program Files\Java\jdk1.8.0_202
```

---

## 8. Premier programme

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

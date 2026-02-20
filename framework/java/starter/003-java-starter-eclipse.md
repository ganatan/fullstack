# Java Starter – Eclipse

---

## Installation Java

```bash
java -version
javac -version
```

---

## Téléchargement Eclipse

https://www.eclipse.org/downloads/

Fichier utilisé :

```
eclipse-inst-jre-win64.exe
```

Choisir : **Eclipse IDE for Java Developers**

---

## Création projet Eclipse

```
File → New → Project → Java → Java Project

Project name : java_starter
JRE          : Use default JRE (jdk-21)
```
Décocher **Use Default Location**.
Indiquer D:\demo


Cliquer sur **Finish**.

Open Perspective

---

## Structure projet

```
java-starter
└── src
    └── Main.java
```

---

## Créer Main.java

Clic droit sur `src` → New → Class

```
Package : (laisser vide)
Name    : Main
```

Cocher **public static void main(String[] args)**

Cliquer sur **Finish**.

---

## Premier programme Java

```java
public class Main {

  public static void main(String[] args) {
    System.out.println("Bonjour Java");
  }
}
```

---

## Exécution

Clic droit dans l'éditeur → **Run As → Java Application**

Ou raccourci :

```
Ctrl + F11
```

Résultat dans la console en bas :

```
Bonjour Java
```

---

## Raccourcis utiles Eclipse

| Raccourci | Action |
|---|---|
| `Ctrl + F11` | lancer le programme |
| `F11` | lancer en mode debug |
| `Ctrl + Z` | annuler |
| `Ctrl + /` | commenter une ligne |
| `Ctrl + Shift + F` | formater le code |
| `Alt + Shift + R` | renommer une variable |
| `syso + Ctrl + Espace` | génère `System.out.println()` |

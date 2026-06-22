# 010-creer-et-executer-un-jar-java8.md

# Créer et exécuter un fichier JAR en Java 8

## Objectif

À partir d'une application Java simple :

```text
Main
↓
Compilation
↓
.class
↓
JAR
↓
Exécution
```

Sans Maven.

---

# 1. Création du projet

Créer :

```text
D:\demo\jar-demo
│
├── Main.java
└── MathUtils.java
```

---

# 2. Classe MathUtils

Fichier :

```text
MathUtils.java
```

Code :

```java
public class MathUtils {

  int sum(int numb1, int numb2) {
    int result = numb1 + numb2;
    System.out.println("00000000001:MathUtils:sum");
    return result;
  }
}
```

---

# 3. Classe Main

Fichier :

```text
Main.java
```

Code :

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

# 4. Compilation

Se placer dans :

```text
D:\demo\jar-demo
```

Compiler :

```bash
javac Main.java MathUtils.java
```

Résultat :

```text
Main.class
MathUtils.class
```

Arborescence :

```text
jar-demo
│
├── Main.java
├── MathUtils.java
├── Main.class
└── MathUtils.class
```

---

# 5. Exécution sans JAR

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

# 6. Création du manifeste

Créer :

```text
manifest.txt
```

Contenu :

```text
Main-Class: Main
```

Attention :

```text
Une ligne vide doit exister à la fin du fichier.
```

---

# 7. Création du JAR

Commande :

```bash
jar cfm app.jar manifest.txt Main.class MathUtils.class
```

Résultat :

```text
app.jar
```

Arborescence :

```text
jar-demo
│
├── Main.java
├── MathUtils.java
├── Main.class
├── MathUtils.class
├── manifest.txt
└── app.jar
```

---

# 8. Vérifier le contenu du JAR

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

# 9. Exécuter le JAR

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

# 10. Ce qu'est réellement un JAR

Un JAR est simplement une archive ZIP contenant :

```text
.class
```

et éventuellement :

```text
META-INF/MANIFEST.MF
```

Exemple :

```text
app.jar
│
├── META-INF
│   └── MANIFEST.MF
│
├── Main.class
└── MathUtils.class
```

---

# 11. Afficher le manifeste

Commande :

```bash
jar xf app.jar META-INF/MANIFEST.MF
```

Contenu :

```text
Manifest-Version: 1.0
Main-Class: Main
```

---

# 12. Différence entre .class et .jar

Un fichier :

```text
Main.class
```

est une seule classe compilée.

Un fichier :

```text
app.jar
```

regroupe plusieurs classes compilées.

---

# 13. Pourquoi utiliser un JAR ?

Sans JAR :

```text
Main.class
MathUtils.class
AutreClasse.class
...
```

Avec JAR :

```text
app.jar
```

Un seul fichier à distribuer.

---

# Résumé

Compiler :

```bash
javac Main.java MathUtils.java
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

Vérifier :

```bash
jar tf app.jar
```

Exécuter :

```bash
java -jar app.jar
```

Cycle complet :

```text
Code Java
↓
Compilation
↓
.class
↓
JAR
↓
java -jar
```
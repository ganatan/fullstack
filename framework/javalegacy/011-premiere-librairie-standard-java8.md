# 011-premiere-librairie-standard-java8.md

# Utilisation d'une librairie standard Java 8

## Objectif

Découvrir l'utilisation d'une librairie standard Java.

Nous allons conserver notre application :

```text
Main
MathUtils
```

et utiliser une classe provenant de :

```text
java.util
```

---

# 1. Classe MathUtils

Fichier :

```text
MathUtils.java
```

Code :

```java
public class MathUtils {

  int sum(int numb1,int numb2) {
    int result = numb1 + numb2;
    System.out.println("00000000001:MathUtils:sum");
    return result;
  }
}
```

---

# 2. Classe Main

Fichier :

```text
Main.java
```

Code :

```java
import java.util.ArrayList;
import java.util.List;

public class Main {

  public static void main(String[] args) {

    MathUtils item = new MathUtils();

    List<Integer> results = new ArrayList<>();

    results.add(item.sum(10, 110));
    results.add(item.sum(20, 220));
    results.add(item.sum(30, 330));

    System.out.println("00000000001:");

    for (Integer result : results) {
      System.out.println("00000000001:sum:" + result);
    }
  }
}
```

---

# 3. Compiler

Commande :

```bash
javac Main.java
```

Résultat :

```text
Main.class
MathUtils.class
```

---

# 4. Exécuter

Commande :

```bash
java Main
```

Résultat :

```text
00000000001:MathUtils:sum
00000000001:MathUtils:sum
00000000001:MathUtils:sum
00000000001:
00000000001:sum:120
00000000001:sum:240
00000000001:sum:360
```

---

# 5. Où est la librairie ?

Ces lignes :

```java
import java.util.ArrayList;
import java.util.List;
```

utilisent une librairie fournie par Java.

Le package :

```text
java.util
```

fait partie du JDK.

Aucun téléchargement n'est nécessaire.

---

# 6. Les classes utilisées

Interface :

```java
List<Integer>
```

Implémentation :

```java
ArrayList<Integer>
```

Création :

```java
List<Integer> results = new ArrayList<>();
```

Ajout d'un élément :

```java
results.add(item.sum(10, 110));
```

Lecture :

```java
for (Integer result : results) {
  System.out.println(result);
}
```

---

# 7. Pourquoi utiliser une librairie ?

Sans la librairie :

```java
int result1 = item.sum(10, 110);
int result2 = item.sum(20, 220);
int result3 = item.sum(30, 330);
```

Avec la librairie :

```java
List<Integer> results = new ArrayList<>();
```

on peut stocker autant de résultats que nécessaire.

---

# 8. Ce qu'est réellement une librairie standard

Lorsque l'on écrit :

```java
import java.util.List;
import java.util.ArrayList;
```

on utilise des classes déjà présentes dans le JDK.

Ces classes sont fournies par Oracle avec Java.

Aucun téléchargement n'est nécessaire.

---

# 9. Exemples de librairies standard Java

Package :

```text
java.lang
```

Classes :

```java
String
Math
System
Integer
Double
```

---

Package :

```text
java.util
```

Classes :

```java
List
ArrayList
Map
HashMap
Scanner
```

---

Package :

```text
java.io
```

Classes :

```java
File
BufferedReader
PrintWriter
```

---

Package :

```text
java.time
```

Classes :

```java
LocalDate
LocalDateTime
Duration
```

---

# 10. Différence avec une librairie externe

Librairie standard :

```java
import java.util.List;
import java.util.ArrayList;
```

Compilation :

```bash
javac Main.java
```

Aucune configuration.

---

Librairie externe :

```java
import org.apache.commons.lang3.StringUtils;
```

Compilation :

```bash
javac -cp lib\commons-lang3-3.12.0.jar Main.java
```

Le JAR doit être téléchargé et ajouté au classpath.

---

# Résumé

Code métier :

```java
MathUtils
```

Librairie standard :

```java
import java.util.List;
import java.util.ArrayList;
```

Compilation :

```bash
javac Main.java
```

Exécution :

```bash
java Main
```

Première utilisation d'une librairie Java :

```java
List<Integer> results = new ArrayList<>();
```

provenant du package :

```text
java.util
```

Différence fondamentale :

```text
Librairie standard
=
incluse dans le JDK

Librairie externe
=
JAR supplémentaire à télécharger
```
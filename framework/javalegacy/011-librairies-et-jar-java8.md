# 010-librairies-et-jar-java8.md

# Librairies et fichiers JAR en Java 8

## Objectif

Comprendre :

```text
Classe Java
↓
Compilation
↓
.class
↓
JAR
↓
Librairie
↓
Classpath
↓
Utilisation dans une autre application
```

Sans Maven.

---

# 1. Qu'est-ce qu'une librairie ?

Une librairie Java est simplement un ensemble de classes réutilisables.

Exemple :

```java
public class MathUtils {

  public int sum(int numb1, int numb2) {
    return numb1 + numb2;
  }
}
```

Cette classe peut être utilisée dans plusieurs applications.

Une fois compilée et regroupée dans un JAR, elle devient une librairie.

---

# 2. Création de la librairie

Créer l'arborescence :

```text
D:\demo
│
└── library
    └── MathUtils.java
```

Code :

```java
public class MathUtils {

  public int sum(int numb1, int numb2) {
    int result = numb1 + numb2;
    System.out.println("MathUtils:sum");
    return result;
  }
}
```

---

# 3. Compilation de la librairie

Se placer dans :

```text
D:\demo\library
```

Compiler :

```bash
javac MathUtils.java
```

Résultat :

```text
MathUtils.class
```

Arborescence :

```text
library
├── MathUtils.java
└── MathUtils.class
```

---

# 4. Création du fichier JAR

Créer le JAR :

```bash
jar cf math-utils.jar MathUtils.class
```

Résultat :

```text
math-utils.jar
```

Arborescence :

```text
library
├── MathUtils.java
├── MathUtils.class
└── math-utils.jar
```

---

# 5. Vérification du contenu du JAR

Commande :

```bash
jar tf math-utils.jar
```

Résultat :

```text
META-INF/
META-INF/MANIFEST.MF
MathUtils.class
```

---

# 6. Création d'une application

Créer :

```text
D:\demo\application
```

Créer :

```text
D:\demo\application\Main.java
```

Code :

```java
public class Main {

  public static void main(String[] args) {

    MathUtils item = new MathUtils();

    int result = item.sum(10, 110);

    System.out.println("sum:" + result);
  }
}
```

---

# 7. Ajout de la librairie

Créer :

```text
D:\demo\application\lib
```

Copier :

```text
math-utils.jar
```

dans :

```text
D:\demo\application\lib
```

Résultat :

```text
application
│
├── Main.java
│
└── lib
    └── math-utils.jar
```

---

# 8. Compilation de l'application

Se placer dans :

```text
D:\demo\application
```

Compiler :

```bash
javac -cp lib\math-utils.jar Main.java
```

Résultat :

```text
Main.class
```

---

# 9. Exécution de l'application

Exécuter :

```bash
java -cp .;lib\math-utils.jar Main
```

Résultat :

```text
MathUtils:sum
sum:120
```

---

# 10. Qu'est-ce qu'un fichier JAR ?

Un JAR est un fichier contenant des classes compilées.

Exemple :

```text
math-utils.jar
```

Contient :

```text
MathUtils.class
```

Le JAR est l'équivalent Java d'une bibliothèque réutilisable.

---

# 11. Qu'est-ce que le Classpath ?

Le classpath indique à Java où trouver les classes.

Compilation :

```bash
javac -cp lib\math-utils.jar Main.java
```

Exécution :

```bash
java -cp .;lib\math-utils.jar Main
```

Signification :

```text
.
=
répertoire courant

lib\math-utils.jar
=
librairie externe
```

---

# 12. Librairies du JDK

Lorsque l'on utilise :

```java
String name = "Danny";
```

ou :

```java
List<String> names = new ArrayList<>();
```

on utilise déjà des librairies fournies par Java :

```text
java.lang
java.util
java.io
java.net
```

Ces librairies sont intégrées au JDK.

---

# 13. Librairies externes

Exemple :

```java
import org.apache.commons.lang3.StringUtils;
```

Cette classe ne fait pas partie du JDK.

Elle provient d'une librairie externe :

```text
commons-lang3.jar
```

---

# 14. Exemples de librairies courantes

```text
commons-lang3.jar
```

Manipulation des chaînes de caractères.

```text
log4j.jar
```

Gestion des logs.

```text
jackson-databind.jar
```

Manipulation du JSON.

```text
junit.jar
```

Tests unitaires.

```text
mockito.jar
```

Mocks pour les tests.

---

# 15. Avant Maven

Avant Maven, les projets ressemblaient souvent à ceci :

```text
project
│
├── src
│
├── lib
│   ├── commons-lang3.jar
│   ├── log4j.jar
│   └── junit.jar
│
└── bin
```

Toutes les dépendances étaient copiées manuellement.

---

# 16. Avec Maven

Aujourd'hui Maven télécharge automatiquement les librairies :

```xml
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-lang3</artifactId>
    <version>3.12.0</version>
</dependency>
```

Mais il est important de comprendre d'abord ce qu'est réellement un JAR.

---

# Résumé

Une librairie Java est :

```text
Une ou plusieurs classes compilées
```

regroupées dans :

```text
un fichier JAR
```

Les étapes sont :

```text
Code Java
↓
Compilation
↓
.class
↓
JAR
↓
Classpath
↓
Utilisation dans une autre application
```

Commandes importantes :

```bash
javac MathUtils.java
```

```bash
jar cf math-utils.jar MathUtils.class
```

```bash
javac -cp lib\math-utils.jar Main.java
```

```bash
java -cp .;lib\math-utils.jar Main
```
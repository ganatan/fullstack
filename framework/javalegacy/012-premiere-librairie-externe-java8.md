# 012-premiere-librairie-externe-java8.md

# Utilisation d'une librairie externe en Java 8

## Objectif

Découvrir comment utiliser une librairie externe sans Maven.

Nous allons utiliser :

```text
Apache Commons Lang
```

et sa classe :

```java
StringUtils
```

Très utilisée dans les applications Java.

---

# 1. Télécharger la librairie

Télécharger :

```text
commons-lang3-3.12.0.jar
```

Puis créer :

```text
D:\demo
│
├── Main.java
│
└── lib
    └── commons-lang3-3.12.0.jar
```

---

# 2. Créer l'application

Fichier :

```text
Main.java
```

Code :

```java
import org.apache.commons.lang3.StringUtils;

public class Main {

  public static void main(String[] args) {

    String value1 = null;
    String value2 = "";
    String value3 = "   ";
    String value4 = "Danny";

    System.out.println(StringUtils.isBlank(value1));
    System.out.println(StringUtils.isBlank(value2));
    System.out.println(StringUtils.isBlank(value3));
    System.out.println(StringUtils.isBlank(value4));
  }
}
```

---

# 3. Compiler sans la librairie

Commande :

```bash
javac Main.java
```

Résultat :

```text
package org.apache.commons.lang3 does not exist
cannot find symbol StringUtils
```

Java ne trouve pas la classe.

---

# 4. Compiler avec la librairie

Commande Windows :

```bash
javac -cp lib\commons-lang3-3.12.0.jar Main.java
```

Résultat :

```text
Main.class
```

La compilation fonctionne.

---

# 5. Exécuter avec la librairie

Commande Windows :

```bash
java -cp .;lib\commons-lang3-3.12.0.jar Main
```

Résultat :

```text
true
true
true
false
```

---

# 6. Comprendre le classpath

Compilation :

```bash
javac -cp lib\commons-lang3-3.12.0.jar Main.java
```

Exécution :

```bash
java -cp .;lib\commons-lang3-3.12.0.jar Main
```

Signification :

```text
.
=
répertoire courant

lib\commons-lang3-3.12.0.jar
=
librairie externe
```

---

# 7. Pourquoi utiliser StringUtils ?

Sans la librairie :

```java
String value = "   ";

boolean result =
  value == null ||
  value.trim().length() == 0;
```

Avec la librairie :

```java
boolean result =
  StringUtils.isBlank(value);
```

Le code est plus simple.

---

# 8. Ce qu'est réellement une librairie externe

Le fichier :

```text
commons-lang3-3.12.0.jar
```

contient des centaines de classes compilées.

Par exemple :

```text
StringUtils.class
RandomStringUtils.class
NumberUtils.class
ArrayUtils.class
```

Toutes regroupées dans un seul JAR.

---

# 9. Différence avec les librairies standard

Librairie standard :

```java
import java.util.List;
import java.util.ArrayList;
```

Compilation :

```bash
javac Main.java
```

Aucune configuration supplémentaire.

---

Librairie externe :

```java
import org.apache.commons.lang3.StringUtils;
```

Compilation :

```bash
javac -cp lib\commons-lang3-3.12.0.jar Main.java
```

Le JAR doit être ajouté au classpath.

---

# 10. Pourquoi Maven existe ?

Sans Maven :

```text
lib
├── commons-lang3.jar
├── jackson.jar
├── log4j.jar
├── junit.jar
└── mockito.jar
```

Il faut :

```text
Télécharger
Copier
Configurer le classpath
```

manuellement.

---

Avec Maven :

```xml
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-lang3</artifactId>
    <version>3.12.0</version>
</dependency>
```

Maven télécharge automatiquement :

```text
commons-lang3.jar
```

et configure le classpath.

---

# Résumé

Librairie utilisée :

```text
Apache Commons Lang
```

Classe utilisée :

```java
StringUtils
```

Compilation :

```bash
javac -cp lib\commons-lang3-3.12.0.jar Main.java
```

Exécution :

```bash
java -cp .;lib\commons-lang3-3.12.0.jar Main
```

Différence fondamentale :

```text
Librairie standard
=
déjà présente dans le JDK

Librairie externe
=
JAR supplémentaire à fournir
```

C'est exactement le problème que Maven résout automatiquement.
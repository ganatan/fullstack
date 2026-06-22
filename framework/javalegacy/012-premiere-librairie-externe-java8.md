# 012-premieres-librairies-externes-java8.md

# Utilisation de plusieurs librairies externes en Java 8

## Objectif

Découvrir comment utiliser plusieurs librairies externes sans Maven.

Nous allons utiliser :

```text
Apache Commons Lang
Apache Commons IO
```

et les classes :

```java
StringUtils
FileUtils
```

Tout en conservant notre code métier :

```java
MathUtils
```

---

# 1. Télécharger les librairies

Télécharger :

```text
commons-lang3-3.12.0.jar
```

depuis :

```text
https://repo1.maven.org/maven2/org/apache/commons/commons-lang3/3.12.0/
```

Télécharger :

```text
commons-io-2.11.0.jar
```

depuis :

```text
https://repo1.maven.org/maven2/commons-io/commons-io/2.11.0/
```

---

# 2. Créer l'arborescence

Créer :

```text
D:\demo\app-java-8
│
├── lib
│   ├── commons-lang3-3.12.0.jar
│   └── commons-io-2.11.0.jar
│
└── src
    ├── Main.java
    └── MathUtils.java
```

---

# 3. Créer la classe métier

Fichier :

```text
src\MathUtils.java
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

# 4. Créer l'application

Fichier :

```text
src\Main.java
```

Code :

```java
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;

import java.io.File;

public class Main {

  public static void main(String[] args) throws Exception {

    MathUtils item = new MathUtils();

    int result = item.sum(10, 110);

    String value = "   ";

    System.out.println(
      "00000000001:isBlank:" +
      StringUtils.isBlank(value)
    );

    File file = new File("sample.txt");

    FileUtils.writeStringToFile(
      file,
      "sum=" + result,
      "UTF-8"
    );

    String content =
      FileUtils.readFileToString(
        file,
        "UTF-8"
      );

    System.out.println(
      "00000000001:file:" +
      content
    );
  }
}
```

---

# 5. Se placer dans le répertoire src

Commande :

```bash
cd D:\demo\app-java-8\src
```

---

# 6. Compiler sans les librairies

Commande :

```bash
javac Main.java MathUtils.java
```

Résultat :

```text
package org.apache.commons.lang3 does not exist
package org.apache.commons.io does not exist
```

Java ne trouve pas les librairies externes.

---

# 7. Compiler avec les librairies

Commande :

```bash
javac -cp "..\lib\*" Main.java MathUtils.java
```

Résultat :

```text
Main.class
MathUtils.class
```

La compilation fonctionne.

---

# 8. Exécuter l'application

Commande :

```bash
java -cp ".;..\lib\*" Main
```

Résultat :

```text
00000000001:MathUtils:sum
00000000001:isBlank:true
00000000001:file:sum=120
```

---

# 9. Vérifier le fichier créé

Le programme crée :

```text
sample.txt
```

Contenu :

```text
sum=120
```

---

# 10. Comprendre le classpath

Compilation :

```bash
javac -cp "..\lib\*" Main.java MathUtils.java
```

Exécution :

```bash
java -cp ".;..\lib\*" Main
```

Signification :

```text
.
=
répertoire courant (src)

..\lib\*
=
toutes les librairies du répertoire lib
```

---

# 11. Les classes utilisées

Code métier :

```java
MathUtils
```

Notre propre code.

---

Apache Commons Lang :

```java
StringUtils
```

Exemple :

```java
StringUtils.isBlank(value);
```

---

Apache Commons IO :

```java
FileUtils
```

Exemples :

```java
FileUtils.writeStringToFile(...)
FileUtils.readFileToString(...)
```

---

# 12. Différence avec une librairie standard

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
import org.apache.commons.io.FileUtils;
```

Compilation :

```bash
javac -cp "..\lib\*" Main.java MathUtils.java
```

Les JAR doivent être téléchargés et ajoutés au classpath.

---

# 13. Pourquoi Maven existe ?

Sans Maven :

```text
lib
├── commons-lang3.jar
├── commons-io.jar
├── jackson.jar
├── log4j.jar
├── junit.jar
├── mockito.jar
└── ...
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

<dependency>
    <groupId>commons-io</groupId>
    <artifactId>commons-io</artifactId>
    <version>2.11.0</version>
</dependency>
```

Maven télécharge automatiquement les JAR et configure le classpath.

---

# Résumé

Arborescence :

```text
app-java-8
│
├── lib
│
└── src
```

Compilation :

```bash
cd D:\demo\app-java-8\src

javac -cp "..\lib\*" Main.java MathUtils.java
```

Exécution :

```bash
java -cp ".;..\lib\*" Main
```

Une application Java réelle est généralement composée de :

```text
Votre code
+
Librairies standard du JDK
+
Librairies externes
```

C'est exactement ce que Maven automatise.
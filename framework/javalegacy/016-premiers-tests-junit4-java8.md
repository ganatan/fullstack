# 015-premiers-tests-junit4-java8.md

# Premiers tests unitaires en Java 8

## Objectif

Tester notre classe :

```text
MathUtils.java
```

avec :

```text
JUnit 4
```

Sans Maven.

---

# 1. Application à tester

## MathUtils.java

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

## Main.java

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

# 2. Télécharger JUnit 4

Télécharger :

```text
https://repo1.maven.org/maven2/junit/junit/4.13.2/
```

Fichier :

```text
junit-4.13.2.jar
```

Télécharger également :

```text
https://repo1.maven.org/maven2/org/hamcrest/hamcrest-core/1.3/
```

Fichier :

```text
hamcrest-core-1.3.jar
```

---

# 3. Arborescence

```text
D:\demo\app-java8
│
├── lib
│   ├── junit-4.13.2.jar
│   └── hamcrest-core-1.3.jar
│
├── Main.java
├── MathUtils.java
│
└── MathUtilsTest.java
```

---

# 4. Créer le test

## MathUtilsTest.java

```java
import org.junit.Assert;
import org.junit.Test;

public class MathUtilsTest {

  @Test
  public void shouldSumNumbers() {

    MathUtils item = new MathUtils();

    int result = item.sum(10, 110);

    Assert.assertEquals(120, result);
  }
}
```

---

# 5. Compiler l'application

```bash
javac Main.java
```

---

# 6. Compiler le test

```bash
javac -cp ".;lib/*" MathUtilsTest.java
```

Résultat :

```text
MathUtilsTest.class
```

---

# 7. Exécuter le test

```bash
java -cp ".;lib/*" org.junit.runner.JUnitCore MathUtilsTest
```

Résultat :

```text
JUnit version 4.13.2

.
Time: 0.001

OK (1 test)
```

---

# 8. Faire échouer le test

Modifier :

```java
Assert.assertEquals(100, result);
```

Puis relancer :

```bash
java -cp ".;lib/*" org.junit.runner.JUnitCore MathUtilsTest
```

Résultat :

```text
FAILURES!!!
Tests run: 1
Failures: 1
```

---

# 9. Pourquoi teste-t-on MathUtils ?

MathUtils contient :

```java
int sum(int numb1, int numb2)
```

Cette méthode :

```text
prend des données
↓
retourne un résultat
```

Elle est idéale pour un test unitaire.

---

# 10. Pourquoi ne teste-t-on pas Main ?

Main contient :

```java
public static void main(String[] args)
```

Son rôle est simplement :

```text
Démarrer l'application
```

Dans les projets professionnels :

```text
MathUtils
Service
Repository
Business
```

sont testés.

---

```text
Main
Application
Bootstrap
```

sont généralement ignorés.

---

# Résumé

Téléchargements :

```text
junit-4.13.2.jar
hamcrest-core-1.3.jar
```

Compilation :

```bash
javac -cp ".;lib/*" MathUtilsTest.java
```

Exécution :

```bash
java -cp ".;lib/*" org.junit.runner.JUnitCore MathUtilsTest
```

Premier test :

```java
Assert.assertEquals(120, result);
```

Objectif :

```text
Vérifier automatiquement que
MathUtils.sum(10,110)
retourne 120.
```

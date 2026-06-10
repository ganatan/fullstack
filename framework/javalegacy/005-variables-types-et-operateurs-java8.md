# 004-variables-types-et-operateurs-java8.md

## Objectif

Découvrir les types primitifs Java 8 et les opérations de base.

À la fin de ce tutoriel, vous saurez manipuler :

```text
String
int
long
double
boolean
char
final
```

et utiliser les principaux opérateurs.

---

## 1. Créer Main.java

```java
public class Main {

    public static void main(String[] args) {

        System.out.println("Java 8");

    }
}
```

---

## 2. String

```java
public class Main {

    public static void main(String[] args) {

        String name = "Danny";

        System.out.println(name);

    }
}
```

Résultat :

```text
Danny
```

---

## 3. int

```java
public class Main {

    public static void main(String[] args) {

        int age = 60;

        System.out.println(age);

    }
}
```

Résultat :

```text
60
```

---

## 4. long

```java
public class Main {

    public static void main(String[] args) {

        long population = 8000000000L;

        System.out.println(population);

    }
}
```

Résultat :

```text
8000000000
```

Le suffixe :

```text
L
```

indique un type long.

---

## 5. double

```java
public class Main {

    public static void main(String[] args) {

        double salary = 54000.50;

        System.out.println(salary);

    }
}
```

Résultat :

```text
54000.5
```

---

## 6. boolean

```java
public class Main {

    public static void main(String[] args) {

        boolean active = true;

        System.out.println(active);

    }
}
```

Résultat :

```text
true
```

---

## 7. char

```java
public class Main {

    public static void main(String[] args) {

        char grade = 'A';

        System.out.println(grade);

    }
}
```

Résultat :

```text
A
```

---

## 8. Constante

```java
public class Main {

    public static void main(String[] args) {

        final int MAX_USERS = 100;

        System.out.println(MAX_USERS);

    }
}
```

Résultat :

```text
100
```

---

## 9. Addition

```java
public class Main {

    public static void main(String[] args) {

        int a = 10;
        int b = 5;

        int result = a + b;

        System.out.println(result);

    }
}
```

Résultat :

```text
15
```

---

## 10. Soustraction

```java
public class Main {

    public static void main(String[] args) {

        int result = 10 - 5;

        System.out.println(result);

    }
}
```

Résultat :

```text
5
```

---

## 11. Multiplication

```java
public class Main {

    public static void main(String[] args) {

        int result = 10 * 5;

        System.out.println(result);

    }
}
```

Résultat :

```text
50
```

---

## 12. Division

```java
public class Main {

    public static void main(String[] args) {

        int result = 10 / 2;

        System.out.println(result);

    }
}
```

Résultat :

```text
5
```

---

## 13. Modulo

```java
public class Main {

    public static void main(String[] args) {

        int result = 10 % 3;

        System.out.println(result);

    }
}
```

Résultat :

```text
1
```

---

## 14. Comparaison

```java
public class Main {

    public static void main(String[] args) {

        int age = 60;

        System.out.println(age > 18);

    }
}
```

Résultat :

```text
true
```

---

## 15. Concaténation

```java
public class Main {

    public static void main(String[] args) {

        String firstName = "Danny";
        String lastName = "Collodet";

        String fullName = firstName + " " + lastName;

        System.out.println(fullName);

    }
}
```

Résultat :

```text
Danny Collodet
```

---

## Résumé

Types primitifs :

```text
int
long
double
boolean
char
```

Objet :

```text
String
```

Constante :

```text
final
```

Opérateurs :

```text
+
-
*
/
%
==
!=
>
<
>=
<=
```

---

## Compétences acquises

* Déclarer des variables
* Utiliser les types primitifs
* Déclarer une constante
* Effectuer des calculs
* Comparer des valeurs
* Concaténer des chaînes de caractères

---

## Prochaine étape

```text
005-conditions-et-boucles-java8.md
```

Objectifs :

* if
* else
* switch
* for
* while
* break
* continue

```
```

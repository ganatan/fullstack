# 005-conditions-et-boucles-java8.md

## Objectif

Comprendre les structures de contrôle Java 8.

À la fin de ce tutoriel, vous saurez utiliser :

```text
if
else
switch
for
while
break
continue
```

---

## 1. if

```java
public class Main {

    public static void main(String[] args) {

        int age = 60;

        if (age >= 18) {
            System.out.println("Majeur");
        }

    }
}
```

Résultat :

```text
Majeur
```

---

## 2. if / else

```java
public class Main {

    public static void main(String[] args) {

        int age = 15;

        if (age >= 18) {
            System.out.println("Majeur");
        } else {
            System.out.println("Mineur");
        }

    }
}
```

Résultat :

```text
Mineur
```

---

## 3. if / else if / else

```java
public class Main {

    public static void main(String[] args) {

        int note = 15;

        if (note >= 16) {
            System.out.println("Très bien");
        } else if (note >= 14) {
            System.out.println("Bien");
        } else if (note >= 10) {
            System.out.println("Passable");
        } else {
            System.out.println("Échec");
        }

    }
}
```

Résultat :

```text
Bien
```

---

## 4. switch

```java
public class Main {

    public static void main(String[] args) {

        int month = 3;

        switch (month) {

            case 1:
                System.out.println("Janvier");
                break;

            case 2:
                System.out.println("Février");
                break;

            case 3:
                System.out.println("Mars");
                break;

            default:
                System.out.println("Inconnu");
        }

    }
}
```

Résultat :

```text
Mars
```

---

## 5. for

```java
public class Main {

    public static void main(String[] args) {

        for (int i = 1; i <= 5; i++) {
            System.out.println(i);
        }

    }
}
```

Résultat :

```text
1
2
3
4
5
```

---

## 6. while

```java
public class Main {

    public static void main(String[] args) {

        int i = 1;

        while (i <= 5) {

            System.out.println(i);

            i++;
        }

    }
}
```

Résultat :

```text
1
2
3
4
5
```

---

## 7. do / while

```java
public class Main {

    public static void main(String[] args) {

        int i = 1;

        do {

            System.out.println(i);

            i++;

        } while (i <= 5);

    }
}
```

Résultat :

```text
1
2
3
4
5
```

---

## 8. break

```java
public class Main {

    public static void main(String[] args) {

        for (int i = 1; i <= 10; i++) {

            if (i == 5) {
                break;
            }

            System.out.println(i);
        }

    }
}
```

Résultat :

```text
1
2
3
4
```

---

## 9. continue

```java
public class Main {

    public static void main(String[] args) {

        for (int i = 1; i <= 5; i++) {

            if (i == 3) {
                continue;
            }

            System.out.println(i);
        }

    }
}
```

Résultat :

```text
1
2
4
5
```

---

## 10. Boucle imbriquée

```java
public class Main {

    public static void main(String[] args) {

        for (int i = 1; i <= 3; i++) {

            for (int j = 1; j <= 2; j++) {

                System.out.println(i + " - " + j);

            }
        }

    }
}
```

Résultat :

```text
1 - 1
1 - 2
2 - 1
2 - 2
3 - 1
3 - 2
```

---

## Exercice

Afficher :

```text
Nom : Danny
Âge : 60
```

uniquement si :

```java
age >= 18
```

Puis afficher les nombres :

```text
1
2
3
4
5
```

à l'aide d'une boucle.

---

## Résumé

Conditions :

```text
if
else
else if
switch
```

Boucles :

```text
for
while
do while
```

Contrôle :

```text
break
continue
```

---

## Compétences acquises

* Écrire des conditions
* Utiliser switch
* Parcourir avec for
* Parcourir avec while
* Arrêter une boucle
* Ignorer une itération

---

## Prochaine étape

```text
006-classes-objets-et-constructeurs-java8.md
```

Objectifs :

* class
* object
* constructor
* this
* getter
* setter
* encapsulation
* héritage

```
```

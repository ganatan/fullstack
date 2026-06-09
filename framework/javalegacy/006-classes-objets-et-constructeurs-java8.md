# 006-classes-objets-et-constructeurs-java8.md

## Objectif

Comprendre les fondements de la programmation orientée objet (POO).

À la fin de ce tutoriel, vous saurez utiliser :

```text
class
object
constructor
this
getter
setter
encapsulation
```

---

## 1. Première classe

Créer :

```text
Person.java
```

```java
public class Person {

}
```

---

## 2. Créer un objet

Créer :

```text
Main.java
```

```java
public class Main {

    public static void main(String[] args) {

        Person person = new Person();

        System.out.println(person);

    }
}
```

Résultat :

```text
Person@xxxxxxxx
```

Java affiche l'adresse mémoire de l'objet.

---

## 3. Ajouter des attributs

```java
public class Person {

    String name;
    int age;

}
```

---

## 4. Utiliser les attributs

```java
public class Main {

    public static void main(String[] args) {

        Person person = new Person();

        person.name = "Danny";
        person.age = 60;

        System.out.println(person.name);
        System.out.println(person.age);

    }
}
```

Résultat :

```text
Danny
60
```

---

## 5. Constructeur

```java
public class Person {

    String name;
    int age;

    public Person(String name, int age) {

        this.name = name;
        this.age = age;

    }
}
```

---

## 6. Utiliser le constructeur

```java
public class Main {

    public static void main(String[] args) {

        Person person = new Person("Danny", 60);

        System.out.println(person.name);
        System.out.println(person.age);

    }
}
```

Résultat :

```text
Danny
60
```

---

## 7. this

```java
this.name = name;
this.age = age;
```

Signifie :

```text
attribut de l'objet = paramètre reçu
```

---

## 8. Encapsulation

Mauvaise pratique :

```java
person.name = "Danny";
```

Bonne pratique :

```java
private String name;
private int age;
```

---

## 9. Getter

```java
public String getName() {
    return name;
}
```

```java
public int getAge() {
    return age;
}
```

---

## 10. Setter

```java
public void setName(String name) {
    this.name = name;
}
```

```java
public void setAge(int age) {
    this.age = age;
}
```

---

## 11. Classe complète

```java
public class Person {

    private String name;
    private int age;

    public Person(String name, int age) {

        this.name = name;
        this.age = age;

    }

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setAge(int age) {
        this.age = age;
    }
}
```

---

## 12. Utilisation

```java
public class Main {

    public static void main(String[] args) {

        Person person = new Person("Danny", 60);

        System.out.println(person.getName());
        System.out.println(person.getAge());

    }
}
```

Résultat :

```text
Danny
60
```

---

## 13. Plusieurs objets

```java
public class Main {

    public static void main(String[] args) {

        Person person1 =
            new Person("Danny", 60);

        Person person2 =
            new Person("Lina", 35);

        System.out.println(person1.getName());
        System.out.println(person2.getName());

    }
}
```

Résultat :

```text
Danny
Lina
```

---

## Exercice

Créer :

```text
Movie
```

avec :

```text
title
year
```

Créer :

```text
Director
```

avec :

```text
name
age
```

Créer les constructeurs.

Afficher :

```text
Christopher Nolan
55
Inception
2010
```

---

## Résumé

POO :

```text
Class
Object
Constructor
this
```

Protection :

```text
private
getter
setter
```

Création :

```java
Person person =
    new Person("Danny", 60);
```

---

## Compétences acquises

* Créer une classe
* Créer un objet
* Utiliser un constructeur
* Utiliser this
* Encapsuler les données
* Utiliser getter et setter

---

## Prochaine étape

```text
007-heritage-polymorphisme-java8.md
```

Objectifs :

```text
extends
super
override
polymorphisme
instanceof
```

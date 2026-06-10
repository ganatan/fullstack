# 007-heritage-polymorphisme-java8.md

## Objectif

Comprendre les mécanismes fondamentaux de l'héritage et du polymorphisme.

À la fin de ce tutoriel, vous saurez utiliser :

```text
extends
super
@Override
polymorphisme
instanceof
```

---

## 1. Classe parent

Créer :

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
}
```

---

## 2. Classe enfant

Créer :

```java
public class Employee extends Person {

    private String company;

    public Employee(
            String name,
            int age,
            String company) {

        super(name, age);

        this.company = company;

    }

    public String getCompany() {
        return company;
    }
}
```

---

## 3. Utilisation

```java
public class Main {

    public static void main(String[] args) {

        Employee employee =
            new Employee(
                "Danny",
                60,
                "Naval Group");

        System.out.println(employee.getName());
        System.out.println(employee.getAge());
        System.out.println(employee.getCompany());

    }
}
```

Résultat :

```text
Danny
60
Naval Group
```

---

## 4. extends

```java
public class Employee extends Person
```

Signifie :

```text
Employee est une Person
```

Relation :

```text
IS-A
```

---

## 5. super

```java
super(name, age);
```

Appelle le constructeur de la classe parent.

Sans :

```java
super(...)
```

la classe ne compile pas.

---

## 6. Ajout d'une méthode

Dans Person :

```java
public void display() {

    System.out.println(
        getName() + " - " + getAge());

}
```

---

## 7. Héritage de méthode

```java
Employee employee =
    new Employee(
        "Danny",
        60,
        "Naval Group");

employee.display();
```

Résultat :

```text
Danny - 60
```

---

## 8. Redéfinition

Dans Employee :

```java
@Override
public void display() {

    System.out.println(
        getName()
        + " - "
        + getAge()
        + " - "
        + company);

}
```

---

## 9. Utilisation

```java
employee.display();
```

Résultat :

```text
Danny - 60 - Naval Group
```

---

## 10. @Override

```java
@Override
```

Indique :

```text
Je remplace une méthode du parent
```

Le compilateur vérifie automatiquement.

---

## 11. Polymorphisme

```java
Person person =
    new Employee(
        "Danny",
        60,
        "Naval Group");
```

Valide.

Pourquoi ?

```text
Employee IS-A Person
```

---

## 12. Exécution

```java
person.display();
```

Résultat :

```text
Danny - 60 - Naval Group
```

Java exécute la méthode réelle de l'objet.

---

## 13. Référence vs objet

```java
Person person =
    new Employee(
        "Danny",
        60,
        "Naval Group");
```

Référence :

```text
Person
```

Objet réel :

```text
Employee
```

---

## 14. instanceof

```java
if (person instanceof Employee) {

    System.out.println("Employee");

}
```

Résultat :

```text
Employee
```

---

## 15. Cast

```java
Employee employee =
    (Employee) person;
```

Puis :

```java
System.out.println(
    employee.getCompany());
```

Résultat :

```text
Naval Group
```

---

## Exemple métier

```text
Person
|
+-- Employee
|
+-- Customer
|
+-- Director
```

Tous peuvent être manipulés via :

```java
Person
```

---

## Exercice

Créer :

```text
MoviePerson
```

Puis :

```text
Director
```

et :

```text
Actor
```

avec :

```java
extends MoviePerson
```

Ajouter :

```java
display()
```

et redéfinir la méthode dans les classes enfants.

---

## Résumé

Héritage :

```java
extends
```

Constructeur parent :

```java
super(...)
```

Redéfinition :

```java
@Override
```

Vérification :

```java
instanceof
```

Conversion :

```java
(Employee) person
```

Polymorphisme :

```java
Person person =
    new Employee(...)
```

---

## Compétences acquises

* Créer une hiérarchie de classes
* Utiliser extends
* Utiliser super
* Redéfinir une méthode
* Comprendre le polymorphisme
* Utiliser instanceof
* Réaliser un cast

---

## Prochaine étape

```text
008-interfaces-et-classes-abstraites-java8.md
```

Objectifs :

```text
interface
implements
abstract
classe abstraite
contrat
polymorphisme avancé
```

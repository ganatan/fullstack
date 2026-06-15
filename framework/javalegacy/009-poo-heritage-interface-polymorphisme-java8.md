# 008-poo-heritage-interface-polymorphisme-java8.md

# Héritage, Interface et Polymorphisme en Java 8

## Objectif

Comprendre les concepts fondamentaux de la programmation orientée objet :

- Classe
- Objet
- Constructeur
- Héritage
- Interface
- Override
- Polymorphisme
- Méthode statique
- Factory Method simple

---

# Code complet

## Main.java

```java
public class Main {

  public static void main(String[] args) {

    Media item1 = getMedia(1);
    item1.name = "Aliens";

    Media item2 = getMedia(2);
    item2.name = "Legend";

    item1.loadTitle();
    item2.loadTitle();

    item1.showMandatory();
  }

  public static Media getMedia(int param) {

    if (param == 1) {
      return new Movie();
    }

    return new Show();
  }
}
```

---

## MediaRules.java

```java
public interface MediaRules {

  void showMandatory();

}
```

---

## Media.java

```java
public class Media implements MediaRules {

  public String name;

  public Media() {
    System.out.println("Media constructor");
  }

  public void showMandatory() {
    System.out.println("Media:ShowMandatory");
  }

  public void loadTitle() {
    System.out.println("Media:LoadTitle -> " + this.name);
  }
}
```

---

## Movie.java

```java
public class Movie extends Media {

  public Movie() {
    super();
    System.out.println("Movie constructor");
  }

  @Override
  public void loadTitle() {
    super.loadTitle();
    System.out.println("Movie:LoadTitle -> " + this.name);
  }

  @Override
  public void showMandatory() {
    super.showMandatory();
    System.out.println("Movie:ShowMandatory");
  }
}
```

---

## Show.java

```java
public class Show extends Media {

  public Show() {
    super();
    System.out.println("Show constructor");
  }

}
```

---

# Concept 1 : Classe

Une classe est un modèle permettant de créer des objets.

Exemple :

```java
public class Media {
}
```

La classe décrit :

- les données
- les comportements

---

# Concept 2 : Objet

Un objet est une instance d'une classe.

Exemple :

```java
new Movie();
```

ou

```java
new Show();
```

Chaque objet possède son propre état.

---

# Concept 3 : Attribut

Un attribut représente une donnée de l'objet.

Exemple :

```java
public String name;
```

Utilisation :

```java
item1.name = "Aliens";
item2.name = "Legend";
```

---

# Concept 4 : Méthode

Une méthode représente un comportement.

Exemple :

```java
public void loadTitle() {
}
```

Une méthode peut :

- afficher
- calculer
- modifier des données
- appeler d'autres méthodes

---

# Concept 5 : Interface

Une interface définit un contrat.

Exemple :

```java
public interface MediaRules {

  void showMandatory();

}
```

L'interface indique :

"toute classe qui implémente MediaRules doit posséder la méthode showMandatory()"

---

# Concept 6 : Implémentation d'interface

Exemple :

```java
public class Media implements MediaRules
```

Media s'engage à fournir :

```java
showMandatory()
```

---

# Concept 7 : Héritage

Exemple :

```java
public class Movie extends Media
```

et

```java
public class Show extends Media
```

On dit que :

```text
Movie est un Media
Show est un Media
```

Le mot-clé utilisé est :

```java
extends
```

---

# Concept 8 : Constructeur

Le constructeur est appelé lors de la création de l'objet.

Exemple :

```java
public Movie() {
}
```

Lors d'un :

```java
new Movie();
```

Java appelle automatiquement le constructeur.

---

# Concept 9 : super()

Exemple :

```java
super();
```

Permet d'appeler le constructeur parent.

Lors de :

```java
new Movie();
```

Java exécute :

```text
Media()
Movie()
```

Dans cet ordre.

---

# Concept 10 : Méthode statique

Exemple :

```java
public static Media getMedia(int param)
```

Une méthode statique appartient à la classe.

Elle peut être appelée sans créer d'objet.

Exemple :

```java
Media item = getMedia(1);
```

---

# Concept 11 : Factory Method simple

La méthode :

```java
public static Media getMedia(int param)
```

choisit quel objet créer :

```java
return new Movie();
```

ou

```java
return new Show();
```

Ce principe est une version simplifiée du Factory Pattern.

---

# Concept 12 : Override

Exemple :

```java
@Override
public void loadTitle()
```

Movie remplace le comportement hérité de Media.

On parle de redéfinition de méthode.

---

# Concept 13 : Appel du parent

Exemple :

```java
super.loadTitle();
```

Permet d'exécuter le code de la classe parent.

Ordre d'exécution :

```text
Media.loadTitle()
Movie.loadTitle()
```

---

# Concept 14 : Polymorphisme de référence

Exemple :

```java
Media item1 = new Movie();
```

La variable est :

```java
Media
```

L'objet réel est :

```java
Movie
```

Même chose :

```java
Media item2 = new Show();
```

La variable est :

```java
Media
```

L'objet réel est :

```java
Show
```

---

# Concept 15 : Polymorphisme dynamique

Exemple :

```java
item1.loadTitle();
```

Java regarde :

```text
Type déclaré : Media
Type réel    : Movie
```

Il exécute donc :

```java
Movie.loadTitle()
```

et non :

```java
Media.loadTitle()
```

Autre exemple :

```java
item2.loadTitle();
```

Java regarde :

```text
Type déclaré : Media
Type réel    : Show
```

Comme Show ne redéfinit pas loadTitle(), Java utilise :

```java
Media.loadTitle()
```

---

# Concept 16 : Liaison dynamique

Cette ligne :

```java
item1.loadTitle();
```

n'est résolue qu'à l'exécution.

Java choisit automatiquement la bonne méthode selon le type réel de l'objet.

On appelle cela :

```text
Dynamic Dispatch
Late Binding
Polymorphisme dynamique
```

---

# Schéma global

```text
           MediaRules
                ^
                |
             Media
             /   \
            /     \
        Movie     Show
```

---

# Ce que démontre cet exemple

✓ Classe

✓ Objet

✓ Attribut

✓ Méthode

✓ Interface

✓ Implémentation d'interface

✓ Héritage

✓ Constructeur

✓ super()

✓ Override

✓ Polymorphisme de référence

✓ Polymorphisme dynamique

✓ Liaison dynamique

✓ Méthode statique

✓ Factory Method simple

Cet exemple couvre l'essentiel de la programmation orientée objet en Java 8.
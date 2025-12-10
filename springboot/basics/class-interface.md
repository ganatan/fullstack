# Exemple complet Classe + Interface + Héritage + Polymorphisme (Spring Boot)

``` java
package com.ganatan.starter;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

interface MovieInterface {
  void delete();
}

class MovieModel implements MovieInterface {

  public String name = "default";

  public void show() {
    System.out.println("MovieModel:show " + name);
  }

  @Override
  public void delete() {
    System.out.println("MovieModel:delete");
  }

}

class Movie extends MovieModel {

  @Override
  public void show() {
    this.name = "Movie";
    super.show();
    System.out.println("Movie:show");
  }

  @Override
  public void delete() {
    super.delete();
    System.out.println("Movie:delete");
  }

}

@SpringBootApplication
public class SpringbootStarterApplication {

  public static void main(String[] args) {

    MovieInterface movie = new Movie();
    movie.delete();

    Movie realMovie = new Movie();
    realMovie.show();

    SpringApplication.run(SpringbootStarterApplication.class, args);
  }

}
```

------------------------------------------------------------------------

# Explications

## `interface MovieInterface`

-   Définit un contrat.
-   Impose la méthode `delete()` à toute classe qui l'implémente.
-   Toutes les méthodes d'une interface sont implicitement
    `public abstract`.
-   Sert de type d'abstraction pour le polymorphisme.

## `class MovieModel implements MovieInterface`

-   Implémente obligatoirement la méthode `delete()`.
-   Contient un attribut d'instance `name`.
-   Définit une méthode propre `show()`.
-   C'est une classe concrète.
-   Elle respecte le contrat de l'interface.

## `class Movie extends MovieModel`

-   Hérite de `MovieModel` avec `extends`.
-   Redéfinit `show()` et `delete()`.
-   Utilise `super.show()` et `super.delete()` pour appeler le
    comportement du parent.
-   Illustre le polymorphisme par héritage.

## `@Override`

-   Indique au compilateur que la méthode :
    -   implémente une méthode d'interface
    -   ou redéfinit une méthode du parent.
-   Sécurise la compilation contre les erreurs de signature.

## Polymorphisme dans le `main`

``` java
MovieInterface movie = new Movie();
movie.delete();
```

-   Le type de la variable est l'interface.
-   L'objet réel est une implémentation concrète (`Movie`).
-   C'est la version `Movie.delete()` qui est exécutée.
-   Aucun cast.

## Instanciation directe

``` java
Movie realMovie = new Movie();
realMovie.show();
```

-   Instanciation directe d'une classe concrète.
-   Permet d'accéder aux méthodes spécifiques (`show()`).
-   Deux objets distincts existent en mémoire.

## `SpringApplication.run(...)`

-   Initialise le contexte Spring Boot.
-   Démarre le serveur embarqué.
-   Lance l'application Spring.

------------------------------------------------------------------------

# Résumé 

-   Une interface définit un contrat.
-   Une classe qui `implements` une interface doit implémenter toutes
    ses méthodes.
-   `extends` permet l'héritage de classe.
-   `@Override` sécurise les redéfinitions.
-   `super` appelle le comportement de la classe parente.
-   Le polymorphisme permet d'utiliser une implémentation via un type
    abstrait.
-   `SpringApplication.run()` démarre l'application Spring Boot.

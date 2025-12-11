# Classe Movie – Exemple complet dans un seul fichier

## Exemple de code

```java
package com.ganatan.starter;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.Date;

class Movie {
  private String name;
  private Date releaseDate;
  private boolean franchise;
  private Number budget;

  public Movie() {}

  public Movie(String name, Date releaseDate, boolean franchise, Number budget) {
    this.name = name;
    this.releaseDate = releaseDate;
    this.franchise = franchise;
    this.budget = budget;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Date getReleaseDate() {
    return releaseDate;
  }

  public void setReleaseDate(Date releaseDate) {
    this.releaseDate = releaseDate;
  }

  public boolean isFranchise() {
    return franchise;
  }

  public void setFranchise(boolean franchise) {
    this.franchise = franchise;
  }

  public Number getBudget() {
    return budget;
  }

  public void setBudget(Number budget) {
    this.budget = budget;
  }

  public void show() {
    System.out.println("name : " + name);
    System.out.println("releaseDate : " + releaseDate);
    System.out.println("franchise : " + franchise);
    System.out.println("budget : " + budget);
  }
}

@SpringBootApplication
public class SpringbootStarterApplication {

  public static void main(String[] args) {

    Movie movie = new Movie();
    movie.setName("Aliens");
    movie.setReleaseDate(new Date());
    movie.setFranchise(true);
    movie.setBudget(18500000);
    movie.show();

    SpringApplication.run(SpringbootStarterApplication.class, args);
  }

}
```

---

## Résumé

- Une classe Java possède des propriétés privées accessibles via des getters et setters.
- Le constructeur permet d’instancier un objet complet avec toutes ses valeurs.
- La méthode `show()` affiche l’état courant de l’objet.

---

## Explications

### Propriétés privées
Les attributs `name`, `releaseDate`, `franchise` et `budget` sont privés, ce qui impose l’encapsulation.

### Getters et Setters
Ils permettent d’accéder et de modifier les propriétés tout en conservant un contrôle strict sur l’état de l’objet.  

### Constructeurs
- Constructeur vide pour créer un objet puis l’initialiser via des setters.
- Constructeur complet pour créer l’objet en une seule instruction.

### Méthode show()
Affiche l’objet sous forme de texte simple, utile pour tester ou déboguer.


# Static

`static` veut dire : **c’est à la classe**, pas à l’objet.

- `static` = **une seule valeur** pour toute la classe (partagée)
- non `static` = **une valeur par objet** (chacun la sienne)

---

## Exemple (Media)

- `totalViews` : compteur **global** pour tous les médias
- `views` : compteur **local** pour un seul média

```java
package java_starter;

public class Main {

  static class Media {
    static int totalViews = 0;
    int views = 0;

    void view() {
      totalViews = totalViews + 1;
      views = views + 1;
      System.out.println("totalViews=" + totalViews + " views=" + views);
    }
  }

  public static void main(String[] args) {
    Media aliens = new Media();
    Media matrix = new Media();

    aliens.view();
    aliens.view();

    matrix.view();
    matrix.view();

    System.out.println("final totalViews=" + Media.totalViews);
    System.out.println("final aliens.views=" + aliens.views);
    System.out.println("final matrix.views=" + matrix.views);
  }
}
```

---

## Explication “comme à un enfant”

Imagine que tu as **deux films** : `aliens` et `matrix`.

### `views` (pas static)
C’est le **compteur collé sur chaque film**.

- `aliens` a son compteur
- `matrix` a son compteur
Ils ne se mélangent pas.

### `totalViews` (static)
C’est le **grand panneau au cinéma** qui compte toutes les vues, tous films confondus.

- Quand tu regardes `aliens`, le panneau monte
- Quand tu regardes `matrix`, le panneau monte aussi
C’est le même panneau pour tout le monde.

---

## Résultat attendu (idée)

- `aliens.view()` : `totalViews=1 views=1`
- `aliens.view()` : `totalViews=2 views=2`
- `matrix.view()` : `totalViews=3 views=1`
- `matrix.view()` : `totalViews=4 views=2`

À la fin :
- `Media.totalViews = 4` (global, partagé)
- `aliens.views = 2` (propre à aliens)
- `matrix.views = 2` (propre à matrix)

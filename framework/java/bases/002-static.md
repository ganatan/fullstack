# Static

`static` est un mot-clé Java qui indique qu'un membre appartient à la classe et non à une instance.
Un champ static est partagé par toutes les instances de la classe.
Une méthode static s'appelle directement via le nom de la classe, sans créer d'objet.
`static final` définit une constante : partagée et non modifiable.
Un bloc static s'exécute une seule fois au chargement de la classe.

---

## Version Simple – Java

```java
package java_starter;

public class Main {

  static class Media {
    static int compteurGlobal = 0;
    int compteurParObjet = 0;

    void play() {
      compteurGlobal = compteurGlobal + 1;
      compteurParObjet = compteurParObjet + 1;

      System.out.println("global=" + compteurGlobal + " objet=" + compteurParObjet);
    }
  }

  public static void main(String[] args) {
    Media a = new Media();
    Media b = new Media();

    a.play();
    a.play();

    b.play();
    b.play();

    System.out.println("Final global=" + Media.compteurGlobal);
    System.out.println("Final a=" + a.compteurParObjet);
    System.out.println("Final b=" + b.compteurParObjet);
  }
}
```

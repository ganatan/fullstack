# Class vs Instance

Une classe est un modèle.
Une instance est un objet créé à partir de ce modèle.
`new` crée une instance.
On peut créer autant d'instances qu'on veut à partir d'une même classe.
Chaque instance a ses propres valeurs.

---

## Version Simple – Java

```java
public class Main {

  static class Media {
    String name;  // chaque instance a son propre name

    Media(String name) {
      this.name = name;
    }
  }

  public static void main(String[] args) {

    // Media est la classe (le modèle)
    // media1 et media2 sont deux instances distinctes

    Media media1 = new Media("Inception");
    Media media2 = new Media("The Matrix");

    System.out.println(media1.name);  // Inception
    System.out.println(media2.name);  // The Matrix

    // modifier une instance ne modifie pas l'autre
    media1.name = "Aliens";
    System.out.println(media1.name);  // Aliens
    System.out.println(media2.name);  // The Matrix (inchangé)
  }
}
```

Résultat :
```
Inception
The Matrix
Aliens
The Matrix
```

---

## La différence en une image

```
Classe Media        ← le modèle, existe une seule fois
├── media1          ← instance 1 : name = "Inception"
├── media2          ← instance 2 : name = "The Matrix"
└── media3          ← instance 3 : name = "Aliens"
```

Modifier `media1.name` ne touche pas `media2.name` ni `media3.name`.

---

## Résumé

| | Classe | Instance |
|---|---|---|
| Définition | le modèle | l'objet créé |
| Existe | une seule fois | autant que voulu |
| Création | `class Media {}` | `new Media("Inception")` |
| Valeurs | partagées si `static` | propres à chaque instance |

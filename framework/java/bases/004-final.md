# Final

`final` veut dire : **ça ne peut plus changer**.

- `final` sur une variable = **valeur fixée une fois pour toutes**
- `final` sur une méthode = **ne peut pas être redéfinie** dans une sous-classe
- `final` sur une classe = **ne peut pas être héritée**

---

## Exemple (Media)

- `id` : identifiant **fixé à la création**, jamais modifiable
- `name` : nom **modifiable** à tout moment

```java
package java_starter;

public class Main {

  static class Media {
    final int id;
    String name;

    Media(int id, String name) {
      this.id = id;
      this.name = name;
    }
  }

  public static void main(String[] args) {
    Media aliens = new Media(1, "Aliens");
    Media matrix = new Media(2, "The Matrix");

    System.out.println("id=" + aliens.id + " name=" + aliens.name);
    System.out.println("id=" + matrix.id + " name=" + matrix.name);

    // on peut changer le name
    aliens.name = "Aliens 2";
    System.out.println("id=" + aliens.id + " name=" + aliens.name);

    // aliens.id = 99; ← ERREUR de compilation : id est final
  }
}
```

---

## Explication "comme à un enfant"

Imagine que tu as **deux films** : `aliens` et `matrix`.

### `name` (pas final)
C'est le **titre sur l'affiche**.

On peut changer l'affiche quand on veut.
- `aliens.name = "Aliens 2"` → ça marche

### `id` (final)
C'est le **numéro gravé dans le béton** à la création du film.

Une fois gravé, impossible de le changer.
- `aliens.id = 99` → erreur, Java refuse

---

## Résultat attendu

```
id=1 name=Aliens
id=2 name=The Matrix
id=1 name=Aliens 2
```

À noter :
- `aliens.id` reste `1` même après modification du `name`
- Tenter de modifier `id` provoque une **erreur de compilation**

---

## final + static ensemble

`static final` = constante globale, partagée et non modifiable.

```java
static class Config {
  static final String APP_NAME = "java-starter";
  static final int MAX_SIZE = 100;
}
```

```
Config.APP_NAME = "autre";  // ← ERREUR de compilation
Config.MAX_SIZE = 200;      // ← ERREUR de compilation
```

---

## Résumé

| | Modifiable | Partagé |
|---|---|---|
| `name` | ✅ | ❌ propre à chaque instance |
| `final int id` | ❌ fixé à la création | ❌ propre à chaque instance |
| `static int total` | ✅ | ✅ toutes les instances |
| `static final int MAX` | ❌ jamais | ✅ toutes les instances |

# IntelliJ IDEA — Débogage

## Lancer en mode debug

Raccourci :

```
Shift + F9
```

Ou cliquer sur l'icône 🐛 à côté du bouton ▶

---

## Breakpoint

### Ajouter un breakpoint

Cliquer dans la marge gauche à côté du numéro de ligne.

Un point rouge apparaît :

```
● 12  int age = 25;
```

### Supprimer un breakpoint

Cliquer à nouveau sur le point rouge.

### Désactiver tous les breakpoints

Run → View Breakpoints → Mute Breakpoints

Raccourci :

```
Ctrl + Shift + F8
```

---

## Contrôles de navigation

| Raccourci | Bouton | Action |
|---|---|---|
| `F8` | ⬇ Step Over | exécute la ligne, ne rentre pas dans la méthode |
| `F7` | ↘ Step Into | entre dans la méthode appelée |
| `Shift + F8` | ↗ Step Out | sort de la méthode courante |
| `F9` | ▶ Resume | continue jusqu'au prochain breakpoint |
| `Alt + F9` | ⏩ Run to Cursor | continue jusqu'à la ligne du curseur |

---

## Fenêtre Variables

Affiche toutes les variables et leurs valeurs au moment du breakpoint.

```
Variables
├── args = []
├── age  = 25
├── nom  = "Inception"
└── actif = true
```

Accessible dans l'onglet **Debug** en bas d'IntelliJ.

---

## Evaluate Expression

Exécuter une expression Java à la volée pendant le debug.

Raccourci :

```
Alt + F8
```

Exemple : taper `age + 10` → affiche `35`

---

## Watches

Surveiller une variable ou expression en continu pendant toute l'exécution.

Dans la fenêtre Debug → onglet **Watches** → cliquer sur **+**

Exemple : ajouter `film.nom` → la valeur se met à jour à chaque step.

---

## Exemple concret

```java
public class Main {

  public static void main(String[] args) {
    String nom = "Inception";         // ← breakpoint ici
    int annee = 2010;
    boolean actif = true;

    if (actif) {
      System.out.println(nom + " - " + annee);
    }
  }
}
```

### Déroulé pas à pas

```
F9  → programme démarre, s'arrête sur le breakpoint ligne 4
F8  → nom = "Inception" est assigné, Variables affiche nom = "Inception"
F8  → annee = 2010 est assigné, Variables affiche annee = 2010
F8  → actif = true est assigné
F8  → entre dans le if (actif = true)
F8  → System.out.println exécuté, affiche dans la console
F9  → programme termine
```

---

## Conditional Breakpoint

S'arrêter uniquement si une condition est vraie.

Clic droit sur le point rouge → **Edit Breakpoint**

```
Condition : annee == 2010
```

Le programme ne s'arrête que si `annee` vaut `2010`.

---

## Debug avec ArrayList

```java
import java.util.ArrayList;

public class Main {

  public static void main(String[] args) {
    ArrayList<String> films = new ArrayList<>();
    films.add("Inception");           // ← breakpoint ici
    films.add("The Matrix");
    films.add("Interstellar");

    for (int i = 0; i < films.size(); i++) {
      String film = films.get(i);     // ← breakpoint ici
      System.out.println(film);
    }
  }
}
```

Dans la fenêtre Variables pendant la boucle :

```
Variables
├── films = ["Inception", "The Matrix", "Interstellar"]
├── i     = 0
└── film  = "Inception"
```

À chaque `F8`, `i` et `film` se mettent à jour.

---

## Debug avec throw

```java
public class Main {

  public static void main(String[] args) {
    try {
      process(true);                          // ← breakpoint ici
      System.out.println("status : ok");
    } catch (RuntimeException e) {
      System.out.println("status : error");   // ← breakpoint ici
    }
  }

  private static void process(boolean fail) {
    if (fail) {
      throw new RuntimeException("erreur");   // ← breakpoint ici
    }
  }
}
```

### Déroulé :

```
F9  → s'arrête sur process(true)
F7  → entre dans process(), Variables affiche fail = true
F8  → entre dans le if
F8  → throw exécuté, exception lancée
F9  → s'arrête sur le catch, Variables affiche e.message = "erreur"
F8  → System.out.println("status : error") exécuté
```

---

## Raccourcis résumé

| Raccourci | Action |
|---|---|
| `Shift + F9` | lancer en mode debug |
| `F8` | step over |
| `F7` | step into |
| `Shift + F8` | step out |
| `F9` | resume |
| `Alt + F9` | run to cursor |
| `Alt + F8` | evaluate expression |
| `Ctrl + Shift + F8` | gérer les breakpoints |

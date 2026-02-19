# Eclipse — Débogage



## Resume
---

| Raccourci | Bouton | Action |
|---|---|---|

| `F11` | ▶ Main | Lance le debugage |
| `F8` | ▶ Resume | continue jusqu'au prochain breakpoint |
| `F6` | ⬇ Step Over | exécute la ligne, ne rentre pas dans la méthode |
| `F5` | ↘ Step Into | entre dans la méthode appelée |

---


## Lancer en mode debug

Raccourci :

```
F11
```

Ou clic droit dans l'éditeur → **Debug As → Java Application**

---

## Breakpoint

### Ajouter un breakpoint

Double-cliquer dans la marge gauche à côté du numéro de ligne.

Un point bleu apparaît :

```
● 12  int age = 25;
```

### Supprimer un breakpoint

Double-cliquer à nouveau sur le point bleu.

### Gérer tous les breakpoints

Run → **Breakpoints**

---

## Contrôles de navigation

| Raccourci | Bouton | Action |
|---|---|---|
| `F6` | ⬇ Step Over | exécute la ligne, ne rentre pas dans la méthode |
| `F5` | ↘ Step Into | entre dans la méthode appelée |
| `F7` | ↗ Step Return | sort de la méthode courante |
| `F8` | ▶ Resume | continue jusqu'au prochain breakpoint |
| `Ctrl + R` | ⏩ Run to Line | continue jusqu'à la ligne du curseur |

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

Accessible dans l'onglet **Variables** en haut à droite en vue Debug.

---

## Display / Evaluate Expression

Exécuter une expression Java à la volée pendant le debug.

```
Window → Show View → Display
```

Taper l'expression, sélectionner le texte, puis :

```
Ctrl + Shift + D
```

Exemple : taper `age + 10` → affiche `35`

---

## Expressions (Watches)

Surveiller une variable ou expression en continu.

Dans l'onglet **Expressions** → cliquer sur **Add new expression**

Exemple : ajouter `film` → la valeur se met à jour à chaque step.

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
F11 → programme démarre, s'arrête sur le breakpoint ligne 4
F6  → nom = "Inception" est assigné, Variables affiche nom = "Inception"
F6  → annee = 2010 est assigné, Variables affiche annee = 2010
F6  → actif = true est assigné
F6  → entre dans le if (actif = true)
F6  → System.out.println exécuté, affiche dans la console
F8  → programme termine
```

---

## Conditional Breakpoint

S'arrêter uniquement si une condition est vraie.

Clic droit sur le point bleu → **Breakpoint Properties**

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

À chaque `F6`, `i` et `film` se mettent à jour.

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
F11 → s'arrête sur process(true)
F5  → entre dans process(), Variables affiche fail = true
F6  → entre dans le if
F6  → throw exécuté, exception lancée
F8  → s'arrête sur le catch, Variables affiche e = RuntimeException
F6  → System.out.println("status : error") exécuté
```

---

## Raccourcis résumé

| Raccourci | Action |
|---|---|
| `F11` | lancer en mode debug |
| `F6` | step over |
| `F5` | step into |
| `F7` | step return (out) |
| `F8` | resume |
| `Ctrl + R` | run to line |
| `Ctrl + Shift + D` | evaluate expression |

---

## IntelliJ vs Eclipse

| Action | IntelliJ | Eclipse |
|---|---|---|
| Lancer debug | `Shift + F9` | `F11` |
| Step Over | `F8` | `F6` |
| Step Into | `F7` | `F5` |
| Step Out | `Shift + F8` | `F7` |
| Resume | `F9` | `F8` |
| Run to cursor | `Alt + F9` | `Ctrl + R` |
| Breakpoint | clic marge gauche (point rouge) | double-clic marge gauche (point bleu) |

# Utilisation des tableaux en Rust

Un tableau permet de stocker plusieurs valeurs du même type.  
Sa taille est fixe et connue au moment de la compilation.

Le type d’un tableau utilise la syntaxe suivante :

```rust
[T; N]
```

- `T` représente le type des éléments ;
- `N` représente le nombre d’éléments.

Chaque exemple peut être utilisé directement dans le fichier `src/main.rs`.

Exécution :

```bash
cargo run
```

---

## 1. Créer un tableau d’entiers

Un tableau contient plusieurs valeurs du même type.  
Le type `[i32; 4]` indique quatre valeurs de type `i32`.

```rust
fn main() {
    let nombres: [i32; 4] = [10, 20, 30, 40];

    println!("{nombres:?}");
}
```

Résultat :

```text
[10, 20, 30, 40]
```

---

## 2. Créer un tableau avec inférence de type

Rust peut déterminer automatiquement le type et la taille du tableau.  
Tous les éléments doivent néanmoins posséder un type compatible.

```rust
fn main() {
    let langages = ["Rust", "Java", "TypeScript"];

    println!("{langages:?}");
}
```

Résultat :

```text
["Rust", "Java", "TypeScript"]
```

---

## 3. Créer un tableau avec une valeur répétée

La syntaxe `[valeur; taille]` répète une même valeur plusieurs fois.  
Elle est pratique pour initialiser rapidement un tableau.

```rust
fn main() {
    let nombres = [0; 5];

    println!("{nombres:?}");
}
```

Résultat :

```text
[0, 0, 0, 0, 0]
```

---

## 4. Accéder à un élément avec son index

L’index permet d’accéder directement à un élément du tableau.  
Le premier élément possède l’index `0`.

```rust
fn main() {
    let langages = ["Rust", "Java", "TypeScript"];

    println!("Premier : {}", langages[0]);
    println!("Deuxième : {}", langages[1]);
    println!("Troisième : {}", langages[2]);
}
```

Résultat :

```text
Premier : Rust
Deuxième : Java
Troisième : TypeScript
```

---

## 5. Accéder à un élément avec `get`

La méthode `get()` permet un accès sécurisé avec un index.  
Elle retourne `Some` si l’élément existe et `None` dans le cas contraire.

```rust
fn main() {
    let nombres = [10, 20, 30];

    match nombres.get(5) {
        Some(nombre) => println!("Nombre : {nombre}"),
        None => println!("Index invalide"),
    }
}
```

Résultat :

```text
Index invalide
```

---

## 6. Modifier un élément du tableau

Le tableau doit être déclaré avec `mut` pour être modifié.  
Une nouvelle valeur peut ensuite être affectée à un index précis.

```rust
fn main() {
    let mut nombres = [10, 20, 30];

    nombres[1] = 200;

    println!("{nombres:?}");
}
```

Résultat :

```text
[10, 200, 30]
```

---

## 7. Obtenir la taille d’un tableau

La méthode `len()` retourne le nombre d’éléments du tableau.  
Cette taille reste fixe pendant toute la durée d’exécution.

```rust
fn main() {
    let nombres = [10, 20, 30, 40, 50];

    let taille = nombres.len();

    println!("Taille : {taille}");
}
```

Résultat :

```text
Taille : 5
```

---

## 8. Parcourir les valeurs d’un tableau

La boucle `for` permet de parcourir directement chaque élément.  
La variable reçoit successivement toutes les valeurs du tableau.

```rust
fn main() {
    let nombres = [10, 20, 30, 40];

    for nombre in nombres {
        println!("{nombre}");
    }
}
```

Résultat :

```text
10
20
30
40
```

---

## 9. Parcourir un tableau avec les index

La méthode `enumerate()` fournit l’index et la valeur de chaque élément.  
Elle doit être utilisée sur un itérateur comme celui produit par `iter()`.

```rust
fn main() {
    let langages = ["Rust", "Java", "TypeScript"];

    for (index, langage) in langages.iter().enumerate() {
        println!("{index} : {langage}");
    }
}
```

Résultat :

```text
0 : Rust
1 : Java
2 : TypeScript
```

---

## 10. Extraire une partie du tableau avec une slice

Une slice représente une vue sur une partie du tableau.  
Elle emprunte les éléments sans les copier.

```rust
fn main() {
    let nombres = [10, 20, 30, 40, 50];
    let partie: &[i32] = &nombres[1..4];

    println!("{partie:?}");
}
```

Résultat :

```text
[20, 30, 40]
```

---

# Type et taille d’un tableau

Le type d’un tableau contient le type des valeurs et sa taille :

```rust
fn main() {
    let nombres: [i32; 3] = [10, 20, 30];
    let prix: [f64; 2] = [19.99, 29.99];
    let actifs: [bool; 3] = [true, false, true];

    println!("{nombres:?}");
    println!("{prix:?}");
    println!("{actifs:?}");
}
```

Les types suivants sont différents :

```text
[i32; 3]
[i32; 4]
```

Un tableau de trois éléments ne peut pas être affecté à une variable attendant un tableau de quatre éléments.

---

# Tableau de taille zéro

Rust permet de créer un tableau ne contenant aucun élément.  
Son type contient une taille égale à zéro.

```rust
fn main() {
    let nombres: [i32; 0] = [];

    println!("Taille : {}", nombres.len());
    println!("Tableau vide : {}", nombres.is_empty());
}
```

Résultat :

```text
Taille : 0
Tableau vide : true
```

---

# Points essentiels

- un tableau utilise le type `[T; N]` ;
- `T` représente le type des éléments ;
- `N` représente le nombre d’éléments ;
- tous les éléments doivent posséder le même type ;
- la taille du tableau est fixe ;
- le premier index est `0` ;
- `tableau[index]` accède directement à un élément ;
- `get(index)` réalise un accès sécurisé ;
- `len()` retourne le nombre d’éléments ;
- `is_empty()` vérifie si le tableau est vide ;
- `mut` permet de modifier les éléments ;
- `for` permet de parcourir les valeurs ;
- `iter().enumerate()` fournit les index et les valeurs ;
- une slice `&[T]` représente une vue empruntée sur une partie du tableau.
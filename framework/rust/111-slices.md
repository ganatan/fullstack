# Utilisation des slices en Rust

Une slice représente une vue sur une partie ou sur la totalité d’une collection.

Elle ne possède pas les données : elle emprunte celles d’un tableau, d’un vecteur ou d’une autre slice.

Les principaux types sont :

```rust
&[T]
&mut [T]
```

- `&[T]` représente une slice en lecture seule ;
- `&mut [T]` représente une slice modifiable ;
- `T` représente le type des éléments ;
- la taille d’une slice est déterminée pendant l’exécution.

Chaque exemple peut être utilisé directement dans le fichier `src/main.rs`.

Exécution :

```bash
cargo run
```

---

## 1. Créer une slice depuis un tableau

La syntaxe `&tableau[..]` crée une slice contenant tout le tableau.  
La slice emprunte les éléments sans les copier.

```rust
fn main() {
    let nombres = [10, 20, 30, 40];
    let slice: &[i32] = &nombres[..];

    println!("{slice:?}");
}
```

Résultat :

```text
[10, 20, 30, 40]
```

---

## 2. Créer une slice depuis un vecteur

Une slice peut également emprunter les éléments d’un vecteur.  
Le vecteur reste propriétaire des données.

```rust
fn main() {
    let nombres = vec![10, 20, 30, 40];
    let slice: &[i32] = &nombres[..];

    println!("{slice:?}");
    println!("Vecteur : {nombres:?}");
}
```

Résultat :

```text
[10, 20, 30, 40]
Vecteur : [10, 20, 30, 40]
```

---

## 3. Extraire une partie d’un tableau

La syntaxe `debut..fin` sélectionne une plage d’éléments.  
L’index de début est inclus et l’index de fin est exclu.

```rust
fn main() {
    let nombres = [10, 20, 30, 40, 50];
    let slice = &nombres[1..4];

    println!("{slice:?}");
}
```

Résultat :

```text
[20, 30, 40]
```

---

## 4. Utiliser les différentes syntaxes de plages

L’index de début ou de fin peut être omis.  
La syntaxe `..` sélectionne toute la collection.

```rust
fn main() {
    let nombres = [10, 20, 30, 40, 50];

    let debut = &nombres[..3];
    let fin = &nombres[2..];
    let totalite = &nombres[..];

    println!("Début : {debut:?}");
    println!("Fin : {fin:?}");
    println!("Totalité : {totalite:?}");
}
```

Résultat :

```text
Début : [10, 20, 30]
Fin : [30, 40, 50]
Totalité : [10, 20, 30, 40, 50]
```

---

## 5. Passer une slice à une fonction

Le type `&[i32]` permet à une fonction de recevoir différentes collections.  
La même fonction peut accepter un tableau, un vecteur ou une autre slice.

```rust
fn afficher_nombres(nombres: &[i32]) {
    for nombre in nombres {
        println!("{nombre}");
    }
}

fn main() {
    let tableau = [10, 20, 30];
    let vecteur = vec![40, 50, 60];

    afficher_nombres(&tableau);
    afficher_nombres(&vecteur);
}
```

Résultat :

```text
10
20
30
40
50
60
```

---

## 6. Calculer la somme d’une slice

Une fonction peut parcourir une slice sans connaître sa taille à l’avance.  
Elle travaille uniquement avec les éléments qui lui sont transmis.

```rust
fn calculer_somme(nombres: &[i32]) -> i32 {
    let mut somme = 0;

    for nombre in nombres {
        somme += nombre;
    }

    somme
}

fn main() {
    let nombres = [10, 20, 30, 40];

    let somme_complete = calculer_somme(&nombres);
    let somme_partielle = calculer_somme(&nombres[1..3]);

    println!("Somme complète : {somme_complete}");
    println!("Somme partielle : {somme_partielle}");
}
```

Résultat :

```text
Somme complète : 100
Somme partielle : 50
```

---

## 7. Modifier les éléments avec une slice mutable

Le type `&mut [T]` permet de modifier les éléments empruntés.  
La collection originale doit être déclarée avec `mut`.

```rust
fn multiplier(nombres: &mut [i32]) {
    for nombre in nombres {
        *nombre *= 2;
    }
}

fn main() {
    let mut nombres = [10, 20, 30, 40];

    multiplier(&mut nombres[1..3]);

    println!("{nombres:?}");
}
```

Résultat :

```text
[10, 40, 60, 40]
```

---

## 8. Accéder aux éléments d’une slice

Un index permet un accès direct mais peut provoquer une panique.  
La méthode `get()` retourne un `Option` et permet un accès sécurisé.

```rust
fn main() {
    let nombres = [10, 20, 30, 40];
    let slice = &nombres[..];

    println!("Premier élément : {}", slice[0]);

    match slice.get(10) {
        Some(nombre) => println!("Nombre : {nombre}"),
        None => println!("Index invalide"),
    }
}
```

Résultat :

```text
Premier élément : 10
Index invalide
```

---

## 9. Récupérer le premier et le dernier élément

Les méthodes `first()` et `last()` retournent un `Option<&T>`.  
Elles fonctionnent également lorsque la slice est vide.

```rust
fn main() {
    let nombres = [10, 20, 30, 40];
    let slice = &nombres[..];

    match slice.first() {
        Some(nombre) => println!("Premier : {nombre}"),
        None => println!("Slice vide"),
    }

    match slice.last() {
        Some(nombre) => println!("Dernier : {nombre}"),
        None => println!("Slice vide"),
    }
}
```

Résultat :

```text
Premier : 10
Dernier : 40
```

---

## 10. Vérifier la taille et le contenu

La méthode `len()` retourne le nombre d’éléments de la slice.  
Les méthodes `is_empty()` et `contains()` vérifient son état et son contenu.

```rust
fn main() {
    let nombres = [10, 20, 30, 40];
    let slice = &nombres[1..3];

    println!("Taille : {}", slice.len());
    println!("Slice vide : {}", slice.is_empty());
    println!("Contient 20 : {}", slice.contains(&20));
    println!("Contient 40 : {}", slice.contains(&40));
}
```

Résultat :

```text
Taille : 2
Slice vide : false
Contient 20 : true
Contient 40 : false
```

---

## 11. Séparer une slice avec `split_at`

La méthode `split_at()` divise une slice en deux parties.  
La position indiquée appartient à la seconde slice.

```rust
fn main() {
    let nombres = [10, 20, 30, 40, 50];
    let slice = &nombres[..];

    let (gauche, droite) = slice.split_at(2);

    println!("Gauche : {gauche:?}");
    println!("Droite : {droite:?}");
}
```

Résultat :

```text
Gauche : [10, 20]
Droite : [30, 40, 50]
```

---

## 12. Modifier deux parties avec `split_at_mut`

La méthode `split_at_mut()` crée deux slices mutables distinctes.  
Rust garantit que les deux parties ne se chevauchent pas.

```rust
fn main() {
    let mut nombres = [10, 20, 30, 40];

    let (gauche, droite) = nombres.split_at_mut(2);

    gauche[0] = 100;
    droite[0] = 300;

    println!("{nombres:?}");
}
```

Résultat :

```text
[100, 20, 300, 40]
```

---

## 13. Parcourir une slice avec `iter`

La méthode `iter()` retourne des références immuables vers les éléments.  
La slice et sa collection originale restent utilisables après le parcours.

```rust
fn main() {
    let nombres = [10, 20, 30, 40];
    let slice = &nombres[..];

    for nombre in slice.iter() {
        println!("{nombre}");
    }

    println!("Taille : {}", slice.len());
}
```

Résultat :

```text
10
20
30
40
Taille : 4
```

---

## 14. Parcourir avec les index

La méthode `enumerate()` associe chaque élément à son index.  
Elle est utilisée sur l’itérateur produit par `iter()`.

```rust
fn main() {
    let langages = ["Rust", "Java", "TypeScript"];
    let slice = &langages[..];

    for (index, langage) in slice.iter().enumerate() {
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

## 15. Découper une slice en groupes avec `chunks`

La méthode `chunks()` découpe une slice en groupes successifs.  
Le dernier groupe peut contenir moins d’éléments que les autres.

```rust
fn main() {
    let nombres = [10, 20, 30, 40, 50];

    for groupe in nombres.chunks(2) {
        println!("{groupe:?}");
    }
}
```

Résultat :

```text
[10, 20]
[30, 40]
[50]
```

---

## 16. Créer des fenêtres avec `windows`

La méthode `windows()` retourne des groupes qui se chevauchent.  
Elle est utile pour comparer des éléments voisins.

```rust
fn main() {
    let nombres = [10, 20, 30, 40];

    for fenetre in nombres.windows(2) {
        println!("{fenetre:?}");
    }
}
```

Résultat :

```text
[10, 20]
[20, 30]
[30, 40]
```

---

## 17. Trier une slice mutable

Une slice mutable peut être triée avec la méthode `sort()`.  
Le tri modifie directement la collection originale.

```rust
fn main() {
    let mut nombres = [40, 10, 30, 20];

    nombres[..].sort();

    println!("{nombres:?}");
}
```

Résultat :

```text
[10, 20, 30, 40]
```

---

## 18. Inverser une slice mutable

La méthode `reverse()` inverse directement l’ordre des éléments.  
Elle peut être appliquée à tout ou partie d’une collection.

```rust
fn main() {
    let mut nombres = [10, 20, 30, 40, 50];

    nombres[1..4].reverse();

    println!("{nombres:?}");
}
```

Résultat :

```text
[10, 40, 30, 20, 50]
```

---

## 19. Copier une slice avec `copy_from_slice`

La méthode `copy_from_slice()` copie les éléments d’une slice vers une autre.  
Les deux slices doivent avoir exactement la même longueur.

```rust
fn main() {
    let source = [10, 20, 30];
    let mut destination = [0, 0, 0];

    destination.copy_from_slice(&source);

    println!("{destination:?}");
}
```

Résultat :

```text
[10, 20, 30]
```

---

## 20. Rechercher une valeur avec `binary_search`

La méthode `binary_search()` recherche rapidement une valeur dans une slice triée.  
Elle retourne l’index trouvé ou la position où la valeur pourrait être insérée.

```rust
fn main() {
    let nombres = [10, 20, 30, 40, 50];

    match nombres.binary_search(&30) {
        Ok(index) => println!("Valeur trouvée à l'index {index}"),
        Err(index) => println!("Valeur absente, insertion possible à {index}"),
    }
}
```

Résultat :

```text
Valeur trouvée à l'index 2
```

---

# Différence entre tableau et slice

## Tableau

Un tableau possède ses données et sa taille fait partie de son type.

```rust
let nombres: [i32; 4] = [10, 20, 30, 40];
```

Son type est :

```text
[i32; 4]
```

## Slice

Une slice emprunte une suite d’éléments et sa taille est connue pendant l’exécution.

```rust
let slice: &[i32] = &nombres[1..3];
```

Son type est :

```text
&[i32]
```

---

# Points essentiels

- une slice utilise le type `&[T]` ;
- une slice mutable utilise le type `&mut [T]` ;
- une slice ne possède pas les éléments ;
- elle emprunte les données d’une autre collection ;
- une slice peut référencer un tableau ou un vecteur ;
- `&collection[..]` crée une slice complète ;
- `&collection[debut..fin]` crée une slice partielle ;
- l’index de début est inclus ;
- l’index de fin est exclu ;
- `get()` permet un accès sécurisé ;
- `first()` récupère le premier élément ;
- `last()` récupère le dernier élément ;
- `split_at()` sépare une slice en deux ;
- `chunks()` crée des groupes non superposés ;
- `windows()` crée des groupes qui se chevauchent ;
- `sort()` trie une slice mutable ;
- `reverse()` inverse une slice mutable ;
- `copy_from_slice()` copie des éléments entre slices de même taille ;
- une fonction acceptant `&[T]` peut recevoir un tableau, un vecteur ou une slice.
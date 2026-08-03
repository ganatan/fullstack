# Utilisation des fonctions en Rust

Une fonction permet de regrouper du code réutilisable sous un nom.  
En Rust, une fonction est déclarée avec le mot-clé `fn`.

Chaque exemple peut être utilisé directement dans le fichier `src/main.rs`.

Exécution :

```bash
cargo run
```

---

## 1. Créer une fonction simple

Une fonction peut exécuter plusieurs instructions sans recevoir de paramètre.  
Elle est appelée depuis `main()` en utilisant son nom suivi de parenthèses.

```rust
fn afficher_message() {
    println!("Bonjour Rust");
}

fn main() {
    afficher_message();
}
```

Résultat :

```text
Bonjour Rust
```

---

## 2. Créer une fonction avec un paramètre

Les paramètres sont déclarés entre les parenthèses de la fonction.  
Le type de chaque paramètre doit obligatoirement être indiqué.

```rust
fn afficher_nombre(nombre: i32) {
    println!("Nombre : {nombre}");
}

fn main() {
    afficher_nombre(42);
}
```

Résultat :

```text
Nombre : 42
```

---

## 3. Créer une fonction avec plusieurs paramètres

Une fonction peut recevoir plusieurs paramètres séparés par des virgules.  
Chaque paramètre possède son propre nom et son propre type.

```rust
fn afficher_utilisateur(nom: &str, age: u8) {
    println!("{nom} a {age} ans");
}

fn main() {
    afficher_utilisateur("Alice", 30);
}
```

Résultat :

```text
Alice a 30 ans
```

---

## 4. Retourner une valeur

Le type de retour est indiqué après la flèche `->`.  
La dernière expression sans point-virgule devient automatiquement la valeur retournée.

```rust
fn addition(a: i32, b: i32) -> i32 {
    a + b
}

fn main() {
    let resultat = addition(10, 20);

    println!("Résultat : {resultat}");
}
```

Résultat :

```text
Résultat : 30
```

---

## 5. Retourner une valeur avec `return`

Le mot-clé `return` permet de quitter immédiatement la fonction.  
Il est utile lorsqu’une fonction peut se terminer à plusieurs endroits.

```rust
fn valeur_absolue(nombre: i32) -> i32 {
    if nombre < 0 {
        return -nombre;
    }

    nombre
}

fn main() {
    let resultat = valeur_absolue(-42);

    println!("Valeur absolue : {resultat}");
}
```

Résultat :

```text
Valeur absolue : 42
```

---

## 6. Retourner plusieurs valeurs avec un tuple

Une fonction peut retourner plusieurs valeurs regroupées dans un tuple.  
Le tuple peut ensuite être déstructuré dans plusieurs variables.

```rust
fn calculer(a: i32, b: i32) -> (i32, i32) {
    let somme = a + b;
    let produit = a * b;

    (somme, produit)
}

fn main() {
    let (somme, produit) = calculer(10, 5);

    println!("Somme : {somme}");
    println!("Produit : {produit}");
}
```

Résultat :

```text
Somme : 15
Produit : 50
```

---

## 7. Passer une chaîne par référence

Une référence `&String` permet de lire une chaîne sans en prendre possession.  
La variable originale reste utilisable après l’appel de la fonction.

```rust
fn afficher_longueur(texte: &String) {
    println!("Longueur : {}", texte.len());
}

fn main() {
    let message = String::from("Bonjour Rust");

    afficher_longueur(&message);

    println!("Message : {message}");
}
```

Résultat :

```text
Longueur : 12
Message : Bonjour Rust
```

---

## 8. Modifier une valeur avec une référence mutable

Une référence `&mut` permet à une fonction de modifier une valeur existante.  
La variable d’origine doit également être déclarée avec `mut`.

```rust
fn ajouter_langage(texte: &mut String) {
    texte.push_str(" Rust");
}

fn main() {
    let mut message = String::from("Bonjour");

    ajouter_langage(&mut message);

    println!("{message}");
}
```

Résultat :

```text
Bonjour Rust
```

---

## 9. Utiliser une slice comme paramètre

Le type `&[i32]` représente une référence vers une portion de collection.  
Il permet à la même fonction d’accepter un tableau, un vecteur ou une slice.

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
    let resultat = calculer_somme(&nombres);

    println!("Somme : {resultat}");
}
```

Résultat :

```text
Somme : 100
```

---

## 10. Retourner une valeur optionnelle avec `Option`

Une fonction peut retourner `Option<T>` lorsqu’une valeur peut être absente.  
`Some` contient une valeur et `None` représente l’absence de résultat.

```rust
fn division(a: i32, b: i32) -> Option<i32> {
    if b == 0 {
        None
    } else {
        Some(a / b)
    }
}

fn main() {
    let resultat = division(10, 2);

    match resultat {
        Some(valeur) => println!("Résultat : {valeur}"),
        None => println!("Division impossible"),
    }
}
```

Résultat :

```text
Résultat : 5
```

---

# Points essentiels

- une fonction est déclarée avec `fn` ;
- les paramètres sont placés entre parenthèses ;
- le type de chaque paramètre doit être indiqué ;
- le type de retour est placé après `->` ;
- la dernière expression sans point-virgule est retournée ;
- `return` quitte immédiatement la fonction ;
- un tuple permet de retourner plusieurs valeurs ;
- `&T` permet d’emprunter une valeur sans la modifier ;
- `&mut T` permet d’emprunter et de modifier une valeur ;
- `&[T]` permet de recevoir une portion de collection ;
- `Option<T>` représente une valeur potentiellement absente.
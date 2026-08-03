# Types et manipulation des nombres en Rust

Rust possède deux grandes familles de nombres :

- les nombres entiers signés : `i8`, `i16`, `i32`, `i64`, `i128`, `isize` ;
- les nombres entiers non signés : `u8`, `u16`, `u32`, `u64`, `u128`, `usize` ;
- les nombres décimaux : `f32`, `f64`.

Les entiers signés peuvent contenir des valeurs négatives.

Les entiers non signés commencent à zéro et ne peuvent pas contenir de valeur négative.

Chaque exemple peut être copié directement dans le fichier `src/main.rs`, puis exécuté avec :

```bash
cargo run
```

---

## 1. Utiliser le type `i8`

Le type `i8` représente un entier signé codé sur 8 bits.  
Il accepte des valeurs comprises entre `-128` et `127`.

```rust
fn main() {
    let temperature: i8 = -10;

    println!("Température : {temperature}");
}
```

---

## 2. Utiliser le type `i16`

Le type `i16` représente un entier signé codé sur 16 bits.  
Il accepte des valeurs comprises entre `-32 768` et `32 767`.

```rust
fn main() {
    let altitude: i16 = -500;

    println!("Altitude : {altitude}");
}
```

---

## 3. Utiliser le type `i32`

Le type `i32` représente un entier signé codé sur 32 bits.  
Il s’agit du type entier utilisé par défaut par Rust.

```rust
fn main() {
    let nombre: i32 = 42;

    println!("Nombre : {nombre}");
}
```

---

## 4. Utiliser le type `i64`

Le type `i64` représente un entier signé codé sur 64 bits.  
Il permet de stocker des valeurs beaucoup plus grandes que `i32`.

```rust
fn main() {
    let population: i64 = 8_000_000_000;

    println!("Population : {population}");
}
```

---

## 5. Utiliser le type `i128`

Le type `i128` représente un entier signé codé sur 128 bits.  
Il permet de manipuler des valeurs entières extrêmement grandes.

```rust
fn main() {
    let tres_grand_nombre: i128 =
        100_000_000_000_000_000_000;

    println!("Nombre : {tres_grand_nombre}");
}
```

---

## 6. Utiliser le type `isize`

Le type `isize` dépend de l’architecture du système utilisé.  
Il est codé sur 32 bits ou 64 bits selon la plateforme.

```rust
fn main() {
    let position: isize = -4;

    println!("Position : {position}");
}
```

---

## 7. Utiliser le type `u8`

Le type `u8` représente un entier non signé codé sur 8 bits.  
Il accepte des valeurs comprises entre `0` et `255`.

```rust
fn main() {
    let couleur_rouge: u8 = 255;

    println!("Rouge : {couleur_rouge}");
}
```

---

## 8. Utiliser le type `u16`

Le type `u16` représente un entier non signé codé sur 16 bits.  
Il accepte des valeurs comprises entre `0` et `65 535`.

```rust
fn main() {
    let port: u16 = 8080;

    println!("Port : {port}");
}
```

---

## 9. Utiliser le type `u32`

Le type `u32` représente un entier non signé codé sur 32 bits.  
Il est souvent utilisé pour les identifiants et les compteurs positifs.

```rust
fn main() {
    let identifiant: u32 = 1_000_000;

    println!("Identifiant : {identifiant}");
}
```

---

## 10. Utiliser le type `u64`

Le type `u64` représente un entier non signé codé sur 64 bits.  
Il permet de manipuler de très grandes valeurs positives.

```rust
fn main() {
    let nombre_visites: u64 = 10_000_000_000;

    println!("Visites : {nombre_visites}");
}
```

---

## 11. Utiliser le type `u128`

Le type `u128` représente un entier non signé codé sur 128 bits.  
Il permet de stocker des valeurs positives extrêmement grandes.

```rust
fn main() {
    let tres_grand_nombre: u128 =
        300_000_000_000_000_000_000;

    println!("Nombre : {tres_grand_nombre}");
}
```

---

## 12. Utiliser le type `usize`

Le type `usize` représente un entier non signé adapté à l’architecture.  
Il est principalement utilisé pour les tailles et les index de collections.

```rust
fn main() {
    let valeurs = [10, 20, 30, 40];
    let index: usize = 2;

    println!("Valeur : {}", valeurs[index]);
}
```

---

## 13. Utiliser le type `f32`

Le type `f32` représente un nombre décimal codé sur 32 bits.  
Il offre moins de précision que le type `f64`.

```rust
fn main() {
    let temperature: f32 = 21.5;

    println!("Température : {temperature}");
}
```

---

## 14. Utiliser le type `f64`

Le type `f64` représente un nombre décimal codé sur 64 bits.  
Il s’agit du type décimal utilisé par défaut par Rust.

```rust
fn main() {
    let prix: f64 = 19.99;

    println!("Prix : {prix}");
}
```

---

## 15. Utiliser l’inférence de type

Rust détermine automatiquement le type d’une variable selon sa valeur.  
Un entier est généralement considéré comme `i32` et un décimal comme `f64`.

```rust
fn main() {
    let entier = 42;
    let decimal = 12.5;

    println!("Entier : {entier}");
    println!("Décimal : {decimal}");
}
```

---

## 16. Ajouter un suffixe de type

Le type d’un nombre peut être précisé directement après sa valeur.  
Cette syntaxe évite d’ajouter explicitement le type après le nom de variable.

```rust
fn main() {
    let petit_nombre = 100u8;
    let grand_nombre = 10_000u64;
    let decimal = 12.5f32;

    println!("{petit_nombre}");
    println!("{grand_nombre}");
    println!("{decimal}");
}
```

---

## 17. Utiliser différentes bases numériques

Rust permet d’écrire des nombres en décimal, hexadécimal, octal et binaire.  
Toutes ces écritures produisent une valeur numérique entière.

```rust
fn main() {
    let decimal = 255;
    let hexadecimal = 0xff;
    let octal = 0o377;
    let binaire = 0b1111_1111;

    println!("Décimal : {decimal}");
    println!("Hexadécimal : {hexadecimal}");
    println!("Octal : {octal}");
    println!("Binaire : {binaire}");
}
```

---

## 18. Séparer les chiffres avec des underscores

Les underscores améliorent la lisibilité des grands nombres.  
Ils ne changent pas la valeur numérique représentée.

```rust
fn main() {
    let population = 68_000_000;
    let budget = 1_500_000_000;

    println!("Population : {population}");
    println!("Budget : {budget}");
}
```

---

## 19. Déclarer une constante numérique

Une constante est déclarée avec le mot-clé `const`.  
Son type doit obligatoirement être indiqué et sa valeur ne peut pas changer.

```rust
const TAUX_TVA: f64 = 0.20;

fn main() {
    let prix = 100.0;
    let montant_tva = prix * TAUX_TVA;

    println!("TVA : {montant_tva}");
}
```

---

## 20. Effectuer des opérations arithmétiques

Rust fournit les opérateurs `+`, `-` et `*` pour les opérations courantes.  
Les deux opérandes doivent généralement posséder le même type.

```rust
fn main() {
    let a = 20;
    let b = 5;

    let addition = a + b;
    let soustraction = a - b;
    let multiplication = a * b;

    println!("Addition : {addition}");
    println!("Soustraction : {soustraction}");
    println!("Multiplication : {multiplication}");
}
```

---

## 21. Effectuer une division entière

La division de deux nombres entiers retourne un nombre entier.  
La partie décimale du résultat est supprimée.

```rust
fn main() {
    let dividende = 10;
    let diviseur = 3;
    let resultat = dividende / diviseur;

    println!("Résultat : {resultat}");
}
```

---

## 22. Calculer le reste d’une division

L’opérateur `%` retourne le reste d’une division entière.  
Il est notamment utilisé pour vérifier si un nombre est pair ou impair.

```rust
fn main() {
    let nombre = 10;
    let reste = nombre % 3;

    println!("Reste : {reste}");
    println!("Nombre pair : {}", nombre % 2 == 0);
}
```

---

## 23. Effectuer une division décimale

La division de nombres décimaux conserve la partie décimale.  
Les valeurs doivent être de type `f32` ou `f64`.

```rust
fn main() {
    let dividende: f64 = 10.0;
    let diviseur: f64 = 3.0;
    let resultat = dividende / diviseur;

    println!("Résultat : {resultat}");
}
```

---

## 24. Utiliser les opérateurs d’affectation

Les opérateurs `+=`, `-=`, `*=`, `/=` et `%=` modifient directement une variable.  
La variable doit être déclarée avec le mot-clé `mut`.

```rust
fn main() {
    let mut nombre = 10;

    nombre += 5;
    println!("Après addition : {nombre}");

    nombre -= 3;
    println!("Après soustraction : {nombre}");

    nombre *= 2;
    println!("Après multiplication : {nombre}");

    nombre /= 4;
    println!("Après division : {nombre}");
}
```

---

## 25. Comparer des nombres

Les opérateurs de comparaison retournent une valeur booléenne.  
Rust propose notamment `==`, `!=`, `<`, `>`, `<=` et `>=`.

```rust
fn main() {
    let a = 10;
    let b = 20;

    println!("Égaux : {}", a == b);
    println!("Différents : {}", a != b);
    println!("a inférieur à b : {}", a < b);
    println!("a supérieur à b : {}", a > b);
}
```

---

## 26. Obtenir le minimum, le maximum et limiter une valeur

Les méthodes `min()` et `max()` comparent deux nombres.  
La méthode `clamp()` limite une valeur entre un minimum et un maximum.

```rust
fn main() {
    let a: i32 = 10;
    let b: i32 = 20;
    let valeur: i32 = 150;

    println!("Minimum : {}", a.min(b));
    println!("Maximum : {}", a.max(b));
    println!("Valeur limitée : {}", valeur.clamp(0, 100));
}
```

---

## 27. Obtenir la valeur absolue

La méthode `abs()` transforme une valeur négative en valeur positive.  
Elle est disponible sur les entiers signés et les nombres décimaux.

```rust
fn main() {
    let entier: i32 = -42;
    let decimal: f64 = -12.5;

    println!("Entier absolu : {}", entier.abs());
    println!("Décimal absolu : {}", decimal.abs());
}
```

---

## 28. Déterminer le signe d’un nombre

La méthode `signum()` retourne `-1`, `0` ou `1` pour un entier signé.  
Pour un nombre décimal, elle retourne généralement `-1.0` ou `1.0`.

```rust
fn main() {
    let negatif: i32 = -42;
    let positif: i32 = 42;
    let decimal: f64 = -12.5;

    println!("Signe négatif : {}", negatif.signum());
    println!("Signe positif : {}", positif.signum());
    println!("Signe décimal : {}", decimal.signum());
}
```

---

## 29. Calculer une puissance entière

La méthode `pow()` élève un entier à une puissance entière positive.  
L’exposant utilisé est une valeur de type `u32`.

```rust
fn main() {
    let base: i32 = 2;
    let resultat = base.pow(8);

    println!("Résultat : {resultat}");
}
```

---

## 30. Calculer une racine carrée

La méthode `sqrt()` calcule la racine carrée d’un nombre décimal.  
Elle retourne une valeur du même type décimal.

```rust
fn main() {
    let nombre: f64 = 81.0;
    let resultat = nombre.sqrt();

    println!("Racine carrée : {resultat}");
}
```

---

## 31. Calculer des puissances décimales

La méthode `powi()` utilise un exposant entier signé.  
La méthode `powf()` utilise un exposant décimal.

```rust
fn main() {
    let nombre: f64 = 4.0;

    let puissance_entiere = nombre.powi(3);
    let puissance_decimale = nombre.powf(0.5);

    println!("Puissance entière : {puissance_entiere}");
    println!("Puissance décimale : {puissance_decimale}");
}
```

---

## 32. Arrondir un nombre décimal

La méthode `round()` arrondit vers l’entier le plus proche.  
Les méthodes `floor()` et `ceil()` arrondissent respectivement vers le bas et le haut.

```rust
fn main() {
    let nombre: f64 = 12.7;

    println!("Arrondi : {}", nombre.round());
    println!("Arrondi inférieur : {}", nombre.floor());
    println!("Arrondi supérieur : {}", nombre.ceil());
}
```

---

## 33. Séparer la partie entière et décimale

La méthode `trunc()` retourne la partie entière d’un nombre décimal.  
La méthode `fract()` retourne uniquement sa partie décimale.

```rust
fn main() {
    let nombre: f64 = 12.75;

    let partie_entiere = nombre.trunc();
    let partie_decimale = nombre.fract();

    println!("Partie entière : {partie_entiere}");
    println!("Partie décimale : {partie_decimale}");
}
```

---

## 34. Convertir une chaîne en nombre

La méthode `parse()` tente de convertir une chaîne en un type numérique.  
Elle retourne un `Result` contenant la valeur ou une erreur.

```rust
fn main() {
    let entier_texte = "42";
    let decimal_texte = "19.99";

    let entier = entier_texte.parse::<i32>();
    let decimal = decimal_texte.parse::<f64>();

    match entier {
        Ok(valeur) => println!("Entier : {valeur}"),
        Err(erreur) => println!("Erreur : {erreur}"),
    }

    match decimal {
        Ok(valeur) => println!("Décimal : {valeur}"),
        Err(erreur) => println!("Erreur : {erreur}"),
    }
}
```

---

## 35. Convertir un nombre avec `as`

L’opérateur `as` permet de convertir une valeur vers un autre type numérique.  
Cette conversion peut perdre des informations ou tronquer la valeur.

```rust
fn main() {
    let entier: i32 = 42;
    let decimal = entier as f64;

    let prix: f64 = 19.99;
    let prix_entier = prix as i32;

    println!("Décimal : {decimal}");
    println!("Prix entier : {prix_entier}");
}
```

---

## 36. Effectuer une conversion vérifiée avec `TryFrom`

`TryFrom` vérifie qu’une valeur peut être représentée par le type cible.  
La conversion retourne un `Result` au lieu de tronquer silencieusement la valeur.

```rust
use std::convert::TryFrom;

fn main() {
    let valeur: i32 = 200;
    let resultat = u8::try_from(valeur);

    match resultat {
        Ok(nombre) => println!("Conversion réussie : {nombre}"),
        Err(erreur) => println!("Conversion impossible : {erreur}"),
    }
}
```

---

## 37. Détecter un dépassement avec `checked_add`

La méthode `checked_add()` effectue une addition vérifiée.  
Elle retourne `None` lorsque le résultat dépasse les limites du type.

```rust
fn main() {
    let nombre: u8 = 250;
    let resultat = nombre.checked_add(10);

    match resultat {
        Some(valeur) => println!("Résultat : {valeur}"),
        None => println!("Dépassement numérique"),
    }
}
```

---

## 38. Limiter un dépassement avec `saturating_add`

La méthode `saturating_add()` bloque le résultat à la limite du type.  
Elle ne provoque pas d’erreur lorsque la valeur maximale est dépassée.

```rust
fn main() {
    let nombre: u8 = 250;
    let resultat = nombre.saturating_add(10);

    println!("Résultat : {resultat}");
}
```

---

## 39. Reboucler après un dépassement avec `wrapping_add`

La méthode `wrapping_add()` reboucle lorsque la limite du type est dépassée.  
Pour un `u8`, la valeur suivant `255` redevient `0`.

```rust
fn main() {
    let nombre: u8 = 250;
    let resultat = nombre.wrapping_add(10);

    println!("Résultat : {resultat}");
}
```

---

## 40. Détecter un dépassement avec `overflowing_add`

La méthode `overflowing_add()` retourne le résultat rebouclé et un booléen.  
Le booléen indique si un dépassement numérique s’est produit.

```rust
fn main() {
    let nombre: u8 = 250;
    let (resultat, depassement) = nombre.overflowing_add(10);

    println!("Résultat : {resultat}");
    println!("Dépassement : {depassement}");
}
```

---

# Limites des types numériques

Chaque type numérique expose les constantes `MIN` et `MAX`.

```rust
fn main() {
    println!("i8 : {} à {}", i8::MIN, i8::MAX);
    println!("i16 : {} à {}", i16::MIN, i16::MAX);
    println!("i32 : {} à {}", i32::MIN, i32::MAX);
    println!("i64 : {} à {}", i64::MIN, i64::MAX);
    println!("i128 : {} à {}", i128::MIN, i128::MAX);
    println!("isize : {} à {}", isize::MIN, isize::MAX);

    println!("u8 : {} à {}", u8::MIN, u8::MAX);
    println!("u16 : {} à {}", u16::MIN, u16::MAX);
    println!("u32 : {} à {}", u32::MIN, u32::MAX);
    println!("u64 : {} à {}", u64::MIN, u64::MAX);
    println!("u128 : {} à {}", u128::MIN, u128::MAX);
    println!("usize : {} à {}", usize::MIN, usize::MAX);

    println!("f32 minimum : {}", f32::MIN);
    println!("f32 maximum : {}", f32::MAX);
    println!("f64 minimum : {}", f64::MIN);
    println!("f64 maximum : {}", f64::MAX);
}
```

---

# Points essentiels

- `i8`, `i16`, `i32`, `i64`, `i128` et `isize` sont des entiers signés ;
- `u8`, `u16`, `u32`, `u64`, `u128` et `usize` sont des entiers non signés ;
- `f32` et `f64` représentent les nombres décimaux ;
- `i32` est le type entier utilisé par défaut ;
- `f64` est le type décimal utilisé par défaut ;
- `usize` est principalement utilisé pour les tailles et les index ;
- les opérandes d’une opération doivent généralement avoir le même type ;
- la division entre deux entiers supprime la partie décimale ;
- l’opérateur `%` retourne le reste d’une division ;
- `as` réalise une conversion directe pouvant perdre des informations ;
- `TryFrom` réalise une conversion vérifiée ;
- `checked_add()` détecte un dépassement ;
- `saturating_add()` bloque le résultat à la limite ;
- `wrapping_add()` reboucle après la limite ;
- `overflowing_add()` retourne le résultat et indique le dépassement ;
- les constantes `MIN` et `MAX` indiquent les limites d’un type.
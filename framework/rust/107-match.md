# Utilisation de `match` en Rust

Rust ne possède pas de mot-clé `switch`.

La structure `match` permet de comparer une valeur avec plusieurs motifs.  
Elle doit obligatoirement gérer tous les cas possibles.

Chaque exemple peut être utilisé directement dans le fichier `src/main.rs`.

Exécution :

```bash
cargo run
```

---

## 1. Comparer plusieurs valeurs entières

Chaque branche compare la valeur avec un motif précis.  
Le symbole `_` représente tous les autres cas.

```rust
fn main() {
    let nombre = 2;

    match nombre {
        1 => println!("Un"),
        2 => println!("Deux"),
        3 => println!("Trois"),
        _ => println!("Autre nombre"),
    }
}
```

Résultat :

```text
Deux
```

---

## 2. Regrouper plusieurs valeurs

L’opérateur `|` permet d’associer plusieurs valeurs à une même branche.  
Il joue un rôle similaire à plusieurs `case` partageant le même traitement.

```rust
fn main() {
    let nombre = 3;

    match nombre {
        1 | 2 | 3 => println!("Entre un et trois"),
        4 | 5 | 6 => println!("Entre quatre et six"),
        _ => println!("Autre valeur"),
    }
}
```

Résultat :

```text
Entre un et trois
```

---

## 3. Utiliser des plages de valeurs

La syntaxe `..=` permet de définir une plage inclusive.  
Elle est pratique pour classer une valeur dans une catégorie.

```rust
fn main() {
    let age = 25;

    match age {
        0..=12 => println!("Enfant"),
        13..=17 => println!("Adolescent"),
        18..=64 => println!("Adulte"),
        _ => println!("Senior"),
    }
}
```

Résultat :

```text
Adulte
```

---

## 4. Retourner une valeur avec `match`

`match` est une expression et peut directement produire une valeur.  
Toutes les branches doivent retourner un type compatible.

```rust
fn main() {
    let code = 404;

    let message = match code {
        200 => "Succès",
        400 => "Requête incorrecte",
        404 => "Ressource introuvable",
        500 => "Erreur serveur",
        _ => "Code inconnu",
    };

    println!("{message}");
}
```

Résultat :

```text
Ressource introuvable
```

---

## 5. Utiliser une condition avec un garde

Une branche peut ajouter une condition avec le mot-clé `if`.  
Cette condition supplémentaire est appelée un garde de correspondance.

```rust
fn main() {
    let nombre = 12;

    match nombre {
        valeur if valeur < 0 => println!("Nombre négatif"),
        valeur if valeur == 0 => println!("Zéro"),
        valeur if valeur % 2 == 0 => println!("Nombre positif pair"),
        _ => println!("Nombre positif impair"),
    }
}
```

Résultat :

```text
Nombre positif pair
```

---

## 6. Déstructurer un tuple

`match` peut extraire directement les valeurs contenues dans un tuple.  
Chaque branche décrit une forme possible du tuple.

```rust
fn main() {
    let position = (0, 10);

    match position {
        (0, 0) => println!("Origine"),
        (0, y) => println!("Sur l'axe vertical à {y}"),
        (x, 0) => println!("Sur l'axe horizontal à {x}"),
        (x, y) => println!("Position : {x}, {y}"),
    }
}
```

Résultat :

```text
Sur l'axe vertical à 10
```

---

## 7. Gérer une valeur `Option`

Le type `Option<T>` représente une valeur présente avec `Some` ou absente avec `None`.  
`match` permet de gérer explicitement les deux situations.

```rust
fn main() {
    let utilisateur: Option<&str> = Some("Alice");

    match utilisateur {
        Some(nom) => println!("Utilisateur : {nom}"),
        None => println!("Aucun utilisateur"),
    }
}
```

Résultat :

```text
Utilisateur : Alice
```

---

## 8. Gérer un résultat avec `Result`

Le type `Result<T, E>` représente une réussite avec `Ok` ou une erreur avec `Err`.  
Il est fréquemment utilisé pour les opérations susceptibles d’échouer.

```rust
fn main() {
    let texte = "42";
    let resultat = texte.parse::<i32>();

    match resultat {
        Ok(nombre) => println!("Nombre converti : {nombre}"),
        Err(erreur) => println!("Erreur de conversion : {erreur}"),
    }
}
```

Résultat :

```text
Nombre converti : 42
```

---

## 9. Utiliser `match` avec une énumération

Une énumération définit un ensemble limité de valeurs possibles.  
Rust oblige `match` à traiter toutes les variantes de l’énumération.

```rust
enum Statut {
    EnAttente,
    EnCours,
    Termine,
    Annule,
}

fn main() {
    let statut = Statut::EnCours;

    match statut {
        Statut::EnAttente => println!("En attente"),
        Statut::EnCours => println!("En cours"),
        Statut::Termine => println!("Terminé"),
        Statut::Annule => println!("Annulé"),
    }
}
```

Résultat :

```text
En cours
```

---

## 10. Capturer une valeur avec `@`

L’opérateur `@` permet de vérifier un motif tout en conservant la valeur correspondante.  
Il évite de perdre la valeur lorsqu’une plage ou un motif est utilisé.

```rust
fn main() {
    let age = 16;

    match age {
        valeur @ 0..=12 => {
            println!("Enfant de {valeur} ans");
        }
        valeur @ 13..=17 => {
            println!("Adolescent de {valeur} ans");
        }
        valeur @ 18..=64 => {
            println!("Adulte de {valeur} ans");
        }
        valeur => {
            println!("Senior de {valeur} ans");
        }
    }
}
```

Résultat :

```text
Adolescent de 16 ans
```

---

# Points essentiels

- `match` est l’équivalent amélioré de `switch` ;
- chaque branche utilise la syntaxe `motif => expression` ;
- `_` représente tous les cas non traités précédemment ;
- `|` permet de regrouper plusieurs motifs ;
- `..=` permet de définir une plage inclusive ;
- `match` peut retourner une valeur ;
- un garde `if` ajoute une condition à une branche ;
- `match` peut déstructurer des tuples et des structures ;
- `match` est souvent utilisé avec `Option` et `Result` ;
- `match` doit obligatoirement gérer tous les cas possibles ;
- l’opérateur `@` permet de tester et de capturer une valeur.
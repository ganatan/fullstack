# Tests et couverture de code en Rust

Rust intègre nativement l’exécution des tests avec Cargo.

La couverture de code peut être générée avec `cargo-llvm-cov`, qui utilise l’instrumentation LLVM du compilateur Rust.

---

## 1. Structure du projet

```text
rust-starter/
├── .cargo/
│   └── config.toml
├── src/
│   ├── lib.rs
│   └── main.rs
├── tests/
│   └── calculs.rs
├── Cargo.toml
├── clippy.toml
└── rustfmt.toml
```

Le projet est déclaré dans `Cargo.toml` avec le nom suivant :

```toml
[package]
name = "rust-starter"
version = "0.1.0"
edition = "2024"
```

Dans le code Rust, les tirets du nom du package sont remplacés par des underscores :

```text
rust-starter → rust_starter
```

L’import correct est donc :

```rust
use rust_starter::{addition, division};
```

---

# Code à tester

## 2. Créer la bibliothèque

Créer le fichier `src/lib.rs` :

```rust
pub fn addition(a: i32, b: i32) -> i32 {
    a + b
}

pub fn division(a: i32, b: i32) -> Option<i32> {
    if b == 0 {
        None
    } else {
        Some(a / b)
    }
}
```

Le mot-clé `pub` rend les fonctions accessibles depuis :

- `src/main.rs` ;
- les tests d’intégration ;
- les autres crates utilisant cette bibliothèque.

---

## 3. Utiliser la bibliothèque dans le programme

Fichier `src/main.rs` :

```rust
use rust_starter::{addition, division};

fn main() {
    let resultat = addition(10, 20);

    println!("Addition : {resultat}");

    match division(10, 2) {
        Some(valeur) => println!("Division : {valeur}"),
        None => println!("Division impossible"),
    }
}
```

Exécuter le programme :

```bash
cargo run
```

Résultat attendu :

```text
Addition : 30
Division : 5
```

---

# Tests unitaires

## 4. Ajouter les tests unitaires

Les tests unitaires sont généralement placés dans le même fichier que le code testé.

Modifier `src/lib.rs` :

```rust
pub fn addition(a: i32, b: i32) -> i32 {
    a + b
}

pub fn division(a: i32, b: i32) -> Option<i32> {
    if b == 0 {
        None
    } else {
        Some(a / b)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn additionne_deux_nombres() {
        assert_eq!(addition(10, 20), 30);
    }

    #[test]
    fn divise_deux_nombres() {
        assert_eq!(division(10, 2), Some(5));
    }

    #[test]
    fn refuse_la_division_par_zero() {
        assert_eq!(division(10, 0), None);
    }
}
```

L’attribut suivant indique que le module doit uniquement être compilé pendant les tests :

```rust
#[cfg(test)]
```

L’attribut suivant transforme une fonction en test :

```rust
#[test]
```

L’instruction suivante importe les éléments du module parent :

```rust
use super::*;
```

---

## 5. Exécuter les tests

```bash
cargo test
```

Résultat attendu :

```text
running 3 tests
test tests::additionne_deux_nombres ... ok
test tests::divise_deux_nombres ... ok
test tests::refuse_la_division_par_zero ... ok

test result: ok. 3 passed; 0 failed
```

---

## 6. Macros d’assertion

### Vérifier une condition

```rust
assert!(resultat > 0);
```

### Vérifier une égalité

```rust
assert_eq!(resultat, 30);
```

### Vérifier une différence

```rust
assert_ne!(resultat, 40);
```

Exemple :

```rust
#[test]
fn verifie_une_addition() {
    let resultat = addition(10, 20);

    assert_eq!(resultat, 30);
    assert_ne!(resultat, 40);
    assert!(resultat > 0);
}
```

Un test réussit lorsqu’il se termine normalement.

Il échoue lorsqu’une assertion est fausse ou lorsqu’une panique non attendue se produit.

---

## 7. Exécuter un test précis

```bash
cargo test additionne_deux_nombres
```

Cargo utilise la valeur fournie comme filtre sur le nom des tests.

Plusieurs tests peuvent être exécutés si leurs noms correspondent au filtre.

---

## 8. Afficher les sorties des tests

Par défaut, les sorties produites avec `println!` sont masquées lorsque le test réussit.

```bash
cargo test -- --nocapture
```

Exemple :

```rust
#[test]
fn affiche_le_resultat() {
    let resultat = addition(10, 20);

    println!("Résultat du test : {resultat}");

    assert_eq!(resultat, 30);
}
```

---

## 9. Exécuter les tests séquentiellement

Les tests sont exécutés en parallèle par défaut.

Pour utiliser un seul thread :

```bash
cargo test -- --test-threads=1
```

Cette option est utile lorsque les tests partagent une même ressource :

- un fichier ;
- une base de données ;
- un port réseau ;
- une variable globale.

Les arguments placés après `--` sont transmis au programme d’exécution des tests.

---

# Tests d’intégration

## 10. Créer un test d’intégration

Créer le fichier `tests/calculs.rs` :

```rust
use rust_starter::{addition, division};

#[test]
fn execute_plusieurs_calculs() {
    let somme = addition(10, 20);
    let resultat = division(somme, 2);

    assert_eq!(resultat, Some(15));
}

#[test]
fn gere_une_division_invalide() {
    assert_eq!(division(100, 0), None);
}
```

Les tests d’intégration utilisent l’API publique de la bibliothèque.

Chaque fichier placé directement dans le répertoire `tests` est compilé comme une crate indépendante.

C’est pour cette raison que les fonctions testées doivent être publiques.

---

## 11. Exécuter tous les tests

```bash
cargo test
```

Cette commande exécute notamment :

- les tests unitaires ;
- les tests d’intégration ;
- les tests de documentation.

---

## 12. Exécuter uniquement un fichier de tests d’intégration

Pour exécuter le fichier `tests/calculs.rs` :

```bash
cargo test --test calculs
```

Le nom utilisé correspond au nom du fichier sans l’extension `.rs`.

---

## 13. Exécuter toutes les cibles

```bash
cargo test --all-targets
```

Cette commande peut inclure :

- la bibliothèque ;
- le programme principal ;
- les tests ;
- les exemples ;
- les benchmarks.

Avec toutes les fonctionnalités Cargo :

```bash
cargo test --all-targets --all-features
```

---

# Tests provoquant une erreur

## 14. Tester une fonction qui doit provoquer une panique

Ajouter une fonction dans `src/lib.rs` :

```rust
pub fn division_obligatoire(a: i32, b: i32) -> i32 {
    if b == 0 {
        panic!("Division par zéro impossible");
    }

    a / b
}
```

Ajouter le test suivant :

```rust
#[test]
#[should_panic]
fn panique_sur_une_division_par_zero() {
    division_obligatoire(10, 0);
}
```

Pour vérifier également le message de la panique :

```rust
#[test]
#[should_panic(expected = "Division par zéro impossible")]
fn panique_avec_le_message_attendu() {
    division_obligatoire(10, 0);
}
```

---

# Tests retournant un résultat

## 15. Utiliser `Result` dans un test

Un test peut retourner un `Result`.

```rust
#[test]
fn teste_une_addition_avec_resultat() -> Result<(), String> {
    let resultat = addition(10, 20);

    if resultat == 30 {
        Ok(())
    } else {
        Err(format!("Résultat incorrect : {resultat}"))
    }
}
```

Le test réussit lorsqu’il retourne :

```rust
Ok(())
```

Le test échoue lorsqu’il retourne :

```rust
Err(...)
```

---

# Couverture de code

Rust ne fournit pas directement de commande native `cargo coverage`.

L’outil `cargo-llvm-cov` permet de générer la couverture du code en utilisant LLVM.

---

## 16. Installer les outils LLVM

```bash
rustup component add llvm-tools-preview
```

Ce composant fournit les outils LLVM compatibles avec la version de Rust installée.

---

## 17. Installer `cargo-llvm-cov`

```bash
cargo install cargo-llvm-cov --locked
```

Vérifier l’installation :

```bash
cargo llvm-cov --version
```

---

## 18. Générer la couverture

À la racine du projet :

```bash
cargo llvm-cov
```

Cette commande :

1. compile le projet avec l’instrumentation de couverture ;
2. exécute les tests ;
3. affiche le rapport dans le terminal.

Exemple de résultat :

```text
Filename        Regions    Missed Regions    Cover
--------------------------------------------------
src/lib.rs           12                 0  100.00%
src/main.rs           8                 8    0.00%
--------------------------------------------------
TOTAL                 20                 8   60.00%
```

Le résultat dépend du code et des tests réellement exécutés.

---

## 19. Couvrir uniquement la bibliothèque

Le fichier `src/main.rs` peut apparaître avec une couverture faible ou nulle, car les tests exécutent principalement le code de la bibliothèque.

Pour mesurer uniquement la bibliothèque :

```bash
cargo llvm-cov --lib
```

Cette commande est adaptée au contrôle de la couverture du code métier placé dans `src/lib.rs`.

---

## 20. Générer un rapport HTML

```bash
cargo llvm-cov --html
```

Le rapport est généré dans :

```text
target/llvm-cov/html/index.html
```

Pour générer puis ouvrir directement le rapport :

```bash
cargo llvm-cov --open
```

Pour limiter le rapport à la bibliothèque :

```bash
cargo llvm-cov --lib --open
```

---

## 21. Générer un rapport texte

```bash
cargo llvm-cov --text
```

---

## 22. Générer un rapport JSON

```bash
cargo llvm-cov --json --output-path coverage.json
```

Fichier généré :

```text
coverage.json
```

---

## 23. Générer un rapport LCOV

```bash
cargo llvm-cov --lcov --output-path lcov.info
```

Le format LCOV peut notamment être utilisé avec :

- SonarQube ;
- Codecov ;
- Coveralls ;
- certaines extensions d’éditeur ;
- des pipelines CI/CD.

---

## 24. Analyser toutes les fonctionnalités

```bash
cargo llvm-cov --all-features
```

Pour un workspace complet :

```bash
cargo llvm-cov --workspace
```

Pour analyser tout le workspace avec toutes les fonctionnalités :

```bash
cargo llvm-cov --workspace --all-features
```

Avec un rapport HTML :

```bash
cargo llvm-cov --workspace --all-features --html
```

---

## 25. Imposer un minimum de couverture

Pour imposer une couverture minimale de `80 %` sur les lignes :

```bash
cargo llvm-cov --lib --fail-under-lines 80
```

La commande échoue lorsque la couverture totale des lignes est inférieure à `80 %`.

Pour un workspace complet :

```bash
cargo llvm-cov --workspace --all-features --fail-under-lines 80
```

Pour imposer une couverture minimale sur les fonctions :

```bash
cargo llvm-cov --lib --fail-under-functions 80
```

Ces commandes sont adaptées aux chaînes CI/CD.

---

## 26. Nettoyer les données de couverture

```bash
cargo llvm-cov clean --workspace
```

Cette commande supprime les anciennes données et les artefacts de couverture.

---

# Alias Cargo

## 27. Créer le fichier de configuration

Créer le fichier `.cargo/config.toml` :

```text
rust-starter/
├── .cargo/
│   └── config.toml
├── src/
│   ├── lib.rs
│   └── main.rs
├── tests/
│   └── calculs.rs
├── Cargo.toml
├── clippy.toml
└── rustfmt.toml
```

Contenu de `.cargo/config.toml` :

```toml
[alias]
test-all = "test --all-targets --all-features"
coverage = "llvm-cov --lib"
coverage-all = "llvm-cov --workspace --all-features"
coverage-html = "llvm-cov --lib --html"
coverage-open = "llvm-cov --lib --open"
coverage-check = "llvm-cov --lib --fail-under-lines 80"
```

---

## 28. Utiliser les alias

Exécuter tous les tests :

```bash
cargo test-all
```

Afficher la couverture de la bibliothèque :

```bash
cargo coverage
```

Afficher la couverture complète :

```bash
cargo coverage-all
```

Générer le rapport HTML :

```bash
cargo coverage-html
```

Générer puis ouvrir le rapport HTML :

```bash
cargo coverage-open
```

Vérifier le seuil minimal de couverture :

```bash
cargo coverage-check
```

---

# Configuration finale

## Fichier `src/lib.rs`

```rust
pub fn addition(a: i32, b: i32) -> i32 {
    a + b
}

pub fn division(a: i32, b: i32) -> Option<i32> {
    if b == 0 {
        None
    } else {
        Some(a / b)
    }
}

pub fn division_obligatoire(a: i32, b: i32) -> i32 {
    if b == 0 {
        panic!("Division par zéro impossible");
    }

    a / b
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn additionne_deux_nombres() {
        assert_eq!(addition(10, 20), 30);
    }

    #[test]
    fn divise_deux_nombres() {
        assert_eq!(division(10, 2), Some(5));
    }

    #[test]
    fn refuse_la_division_par_zero() {
        assert_eq!(division(10, 0), None);
    }

    #[test]
    #[should_panic(expected = "Division par zéro impossible")]
    fn panique_sur_une_division_par_zero() {
        division_obligatoire(10, 0);
    }
}
```

---

## Fichier `src/main.rs`

```rust
use rust_starter::{addition, division};

fn main() {
    let resultat = addition(10, 20);

    println!("Addition : {resultat}");

    match division(10, 2) {
        Some(valeur) => println!("Division : {valeur}"),
        None => println!("Division impossible"),
    }
}
```

---

## Fichier `tests/calculs.rs`

```rust
use rust_starter::{addition, division};

#[test]
fn execute_plusieurs_calculs() {
    let somme = addition(10, 20);
    let resultat = division(somme, 2);

    assert_eq!(resultat, Some(15));
}

#[test]
fn gere_une_division_invalide() {
    assert_eq!(division(100, 0), None);
}
```

---

## Fichier `.cargo/config.toml`

```toml
[alias]
test-all = "test --all-targets --all-features"
coverage = "llvm-cov --lib"
coverage-all = "llvm-cov --workspace --all-features"
coverage-html = "llvm-cov --lib --html"
coverage-open = "llvm-cov --lib --open"
coverage-check = "llvm-cov --lib --fail-under-lines 80"
```

---

# Commandes essentielles

## Tests

```bash
cargo test
cargo test additionne_deux_nombres
cargo test --test calculs
cargo test -- --nocapture
cargo test -- --test-threads=1
cargo test --all-targets --all-features
```

## Installation de la couverture

```bash
rustup component add llvm-tools-preview
cargo install cargo-llvm-cov --locked
```

## Couverture

```bash
cargo llvm-cov
cargo llvm-cov --lib
cargo llvm-cov --html
cargo llvm-cov --open
cargo llvm-cov --lib --fail-under-lines 80
cargo llvm-cov clean --workspace
```

## Alias

```bash
cargo test-all
cargo coverage
cargo coverage-all
cargo coverage-html
cargo coverage-open
cargo coverage-check
```
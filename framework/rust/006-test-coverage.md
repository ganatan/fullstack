# Tests et couverture de code en Rust

Rust intègre nativement un système de tests avec Cargo.

La commande `cargo test` compile et exécute :

* les tests unitaires ;
* les tests d’intégration ;
* les tests présents dans la documentation.

Les fonctions de test sont identifiées avec l’attribut `#[test]`.

---

## 1. Structure du projet

Pour séparer correctement le code métier du programme principal, créer un fichier `src/lib.rs`.

```text
hello-rust/
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

---

## 2. Créer les fonctions à tester

Fichier `src/lib.rs` :

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

Les fonctions sont déclarées avec `pub` afin qu’elles puissent être utilisées depuis `main.rs` et depuis les tests d’intégration.

---

## 3. Utiliser les fonctions

Fichier `src/main.rs` :

```rust
use hello_rust::{addition, division};

fn main() {
    let resultat = addition(10, 20);

    println!("Addition : {resultat}");

    match division(10, 2) {
        Some(valeur) => println!("Division : {valeur}"),
        None => println!("Division impossible"),
    }
}
```

Le nom du package `hello-rust` devient `hello_rust` dans le code Rust.

Exécuter le programme :

```bash
cargo run
```

Résultat :

```text
Addition : 30
Division : 5
```

---

# Tests unitaires

## 4. Ajouter les tests unitaires

Les tests unitaires sont généralement placés directement dans le fichier contenant le code testé.

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

Les tests unitaires sont habituellement placés dans les fichiers du répertoire `src`. Ils peuvent tester les éléments publics et privés du module parent.

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

## 6. Les macros d’assertion

### Vérifier une condition

```rust
assert!(resultat);
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

Un test réussit lorsqu’il se termine normalement. Il échoue lorsqu’une assertion provoque une panique.

---

## 7. Exécuter un test précis

```bash
cargo test additionne_deux_nombres
```

Cargo utilise le texte fourni comme filtre sur le nom des tests.

---

## 8. Afficher les sorties des tests

Par défaut, les sorties produites par `println!` sont masquées lorsque le test réussit.

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

Cette option est utile lorsque plusieurs tests utilisent une même ressource externe :

* un fichier ;
* une base de données ;
* un port réseau ;
* une variable globale.

Les arguments placés après `--` sont transmis au programme chargé d’exécuter les tests.

---

# Tests d’intégration

## 10. Créer un test d’intégration

Les tests d’intégration sont placés dans le répertoire `tests`.

Créer le fichier `tests/calculs.rs` :

```rust
use hello_rust::{addition, division};

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

Les tests d’intégration utilisent uniquement l’API publique de la bibliothèque.

Chaque fichier placé directement dans `tests` est compilé comme une crate indépendante.

---

## 11. Exécuter tous les tests

```bash
cargo test
```

Cette commande exécute les tests unitaires et les tests d’intégration.

---

## 12. Exécuter uniquement un fichier d’intégration

Pour le fichier suivant :

```text
tests/calculs.rs
```

Exécuter :

```bash
cargo test --test calculs
```

---

## 13. Exécuter toutes les cibles et fonctionnalités

```bash
cargo test --all-targets --all-features
```

Cette commande peut notamment inclure :

* la bibliothèque ;
* le programme principal ;
* les tests unitaires ;
* les tests d’intégration ;
* les exemples ;
* les fonctionnalités Cargo.

---

# Couverture de code

Rust ne fournit pas directement une commande `cargo coverage`.

L’outil `cargo-llvm-cov` permet de générer la couverture du code en utilisant l’instrumentation LLVM du compilateur Rust.

---

## 14. Installer les outils LLVM

```bash
rustup component add llvm-tools-preview
```

Le composant `llvm-tools-preview` fournit les outils LLVM compatibles avec la toolchain Rust installée.

---

## 15. Installer `cargo-llvm-cov`

```bash
cargo install cargo-llvm-cov --locked
```

Vérifier l’installation :

```bash
cargo llvm-cov --version
```

L’option `--locked` utilise les versions exactes des dépendances enregistrées par le projet `cargo-llvm-cov`.

---

## 16. Calculer la couverture

À la racine du projet :

```bash
cargo llvm-cov
```

Cette commande :

1. compile le projet avec l’instrumentation de couverture ;
2. exécute les tests ;
3. affiche le résumé de couverture dans le terminal.

Par défaut, `cargo llvm-cov` exécute les tests avec `cargo test`, puis génère le rapport.

Exemple de résultat :

```text
Filename        Regions    Missed Regions    Cover
--------------------------------------------------
src/lib.rs           12                 0  100.00%
src/main.rs           8                 8    0.00%
--------------------------------------------------
TOTAL                 20                 8   60.00%
```

Le résultat exact dépend de la version de Rust, de LLVM et du code analysé.

---

## 17. Générer un rapport HTML

```bash
cargo llvm-cov --html
```

Le rapport est généré dans :

```text
target/llvm-cov/html/index.html
```

Pour générer et ouvrir directement le rapport :

```bash
cargo llvm-cov --open
```

Ces commandes sont fournies directement par `cargo-llvm-cov`.

---

## 18. Générer un rapport texte

```bash
cargo llvm-cov --text
```

---

## 19. Générer un rapport JSON

```bash
cargo llvm-cov --json --output-path coverage.json
```

Fichier généré :

```text
coverage.json
```

---

## 20. Générer un rapport LCOV

```bash
cargo llvm-cov --lcov --output-path lcov.info
```

Le format LCOV peut être utilisé avec :

* SonarQube ;
* Codecov ;
* Coveralls ;
* certaines extensions d’éditeur ;
* des pipelines CI/CD.

Les formats HTML, texte, JSON et LCOV sont pris en charge par `cargo-llvm-cov`.

---

## 21. Analyser tout le workspace

```bash
cargo llvm-cov --workspace
```

Avec toutes les fonctionnalités :

```bash
cargo llvm-cov --workspace --all-features
```

Avec un rapport HTML :

```bash
cargo llvm-cov --workspace --all-features --html
```

---

## 22. Imposer un minimum de couverture

Pour imposer une couverture minimale de `80 %` sur les lignes :

```bash
cargo llvm-cov --workspace --all-features --fail-under-lines 80
```

La commande retourne une erreur lorsque la couverture totale des lignes est inférieure à `80 %`.

Cette règle est particulièrement utile dans une chaîne CI/CD. `cargo-llvm-cov` prend également en charge des seuils sur les fonctions et les régions.

Exemple avec une couverture minimale de fonctions :

```bash
cargo llvm-cov --workspace --all-features --fail-under-functions 80
```

---

## 23. Nettoyer les anciennes données de couverture

```bash
cargo llvm-cov clean --workspace
```

Cette commande supprime les anciens artefacts pouvant fausser le rapport.

`cargo-llvm-cov` effectue normalement un nettoyage automatique, sauf avec certaines options comme `--no-clean` ou `--no-report`.

---

# Configuration des commandes

## 24. Ajouter des alias Cargo

Créer le fichier `.cargo/config.toml` :

```text
hello-rust/
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

Contenu du fichier `.cargo/config.toml` :

```toml
[alias]
test-all = "test --all-targets --all-features"
coverage = "llvm-cov --workspace --all-features"
coverage-html = "llvm-cov --workspace --all-features --html"
coverage-open = "llvm-cov --workspace --all-features --open"
coverage-check = "llvm-cov --workspace --all-features --fail-under-lines 80"
```

La table `[alias]` permet de créer des commandes Cargo personnalisées.

---

## 25. Utiliser les alias

Exécuter tous les tests :

```bash
cargo test-all
```

Afficher la couverture :

```bash
cargo coverage
```

Générer le rapport HTML :

```bash
cargo coverage-html
```

Générer et ouvrir le rapport :

```bash
cargo coverage-open
```

Vérifier le seuil minimal de `80 %` :

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

## Fichier `src/main.rs`

```rust
use hello_rust::{addition, division};

fn main() {
    let resultat = addition(10, 20);

    println!("Addition : {resultat}");

    match division(10, 2) {
        Some(valeur) => println!("Division : {valeur}"),
        None => println!("Division impossible"),
    }
}
```

## Fichier `tests/calculs.rs`

```rust
use hello_rust::{addition, division};

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

## Fichier `.cargo/config.toml`

```toml
[alias]
test-all = "test --all-targets --all-features"
coverage = "llvm-cov --workspace --all-features"
coverage-html = "llvm-cov --workspace --all-features --html"
coverage-open = "llvm-cov --workspace --all-features --open"
coverage-check = "llvm-cov --workspace --all-features --fail-under-lines 80"
```

---

# Commandes essentielles

```bash
cargo test
cargo test additionne_deux_nombres
cargo test --test calculs
cargo test -- --nocapture
cargo test --all-targets --all-features

rustup component add llvm-tools-preview
cargo install cargo-llvm-cov --locked

cargo llvm-cov
cargo llvm-cov --html
cargo llvm-cov --open
cargo llvm-cov --workspace --all-features
cargo llvm-cov --workspace --all-features --fail-under-lines 80
```

Avec les alias :

```bash
cargo test-all
cargo coverage
cargo coverage-html
cargo coverage-open
cargo coverage-check
```

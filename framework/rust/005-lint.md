# Analyse du code Rust avec `cargo clippy`

Clippy est l’outil officiel de linting de Rust.

Il analyse le code sans l’exécuter afin de détecter :

* les erreurs courantes ;
* le code inutile ;
* les mauvaises pratiques ;
* les problèmes de performance ;
* les constructions pouvant être simplifiées.

Clippy complète le compilateur Rust avec des règles supplémentaires appelées **lints**.

---

## 1. Vérifier l’installation de Clippy

```bash
cargo clippy --version
```

Clippy est généralement installé automatiquement avec Rust lorsque Rust est installé avec `rustup`.

S’il n’est pas disponible :

```bash
rustup component add clippy
```

---

## 2. Analyser le projet

À la racine du projet :

```bash
cargo clippy
```

Clippy compile et analyse le projet, puis affiche les avertissements détectés.

---

## 3. Exemple de code à améliorer

Fichier `src/main.rs` :

```rust
fn addition(a: i32, b: i32) -> i32 {
    return a + b;
}

fn main() {
    let resultat = addition(10, 20);

    println!("Résultat : {}", resultat);
}
```

Exécuter :

```bash
cargo clippy
```

Clippy signale que le mot-clé `return` est inutile à la fin de la fonction.

Le code peut être simplifié :

```rust
fn addition(a: i32, b: i32) -> i32 {
    a + b
}

fn main() {
    let resultat = addition(10, 20);

    println!("Résultat : {}", resultat);
}
```

En Rust, la dernière expression d’une fonction est automatiquement retournée lorsqu’elle ne se termine pas par un point-virgule.

---

## 4. Transformer les avertissements en erreurs

```bash
cargo clippy -- -D warnings
```

L’option `-D warnings` transforme tous les avertissements en erreurs.

La commande échoue dès qu’un avertissement Rust ou Clippy est détecté. Elle est particulièrement utile dans une chaîne CI/CD.

---

## 5. Corriger automatiquement certains problèmes

```bash
cargo clippy --fix
```

Clippy applique automatiquement les corrections qu’il considère comme sûres. Cette commande implique également l’analyse de toutes les cibles du projet.

Il est recommandé de vérifier les modifications avec Git :

```bash
git diff
```

---

## 6. Configurer Clippy

Créer un fichier `clippy.toml` à la racine du projet :

```text
hello-rust/
├── Cargo.toml
├── clippy.toml
├── rustfmt.toml
└── src/
    └── main.rs
```

Clippy recherche un fichier nommé `clippy.toml` ou `.clippy.toml` dans le projet et ses répertoires parents. Seules certaines règles peuvent être configurées dans ce fichier.

---

## 7. Limiter le nombre d’arguments d’une fonction

Fichier `clippy.toml` :

```toml
too-many-arguments-threshold = 4
```

Cette règle indique qu’une fonction ne doit pas avoir plus de quatre arguments.

La valeur par défaut de Clippy est `7`.

Exemple :

```rust
fn creer_utilisateur(
    nom: &str,
    prenom: &str,
    age: u8,
    ville: &str,
    pays: &str,
) {
    println!(
        "{} {} a {} ans et habite à {}, {}.",
        prenom, nom, age, ville, pays
    );
}

fn main() {
    creer_utilisateur(
        "Dupont",
        "Alice",
        30,
        "Paris",
        "France",
    );
}
```

Exécuter :

```bash
cargo clippy
```

Clippy signale que la fonction possède trop d’arguments.

Une meilleure solution consiste à utiliser une structure :

```rust
struct Utilisateur<'a> {
    nom: &'a str,
    prenom: &'a str,
    age: u8,
    ville: &'a str,
    pays: &'a str,
}

fn creer_utilisateur(utilisateur: &Utilisateur) {
    println!(
        "{} {} a {} ans et habite à {}, {}.",
        utilisateur.prenom,
        utilisateur.nom,
        utilisateur.age,
        utilisateur.ville,
        utilisateur.pays
    );
}

fn main() {
    let utilisateur = Utilisateur {
        nom: "Dupont",
        prenom: "Alice",
        age: 30,
        ville: "Paris",
        pays: "France",
    };

    creer_utilisateur(&utilisateur);
}
```

---

## 8. Activer les règles strictes

Clippy propose un groupe de règles supplémentaires nommé `pedantic`.

```bash
cargo clippy -- -W clippy::pedantic
```

Ces règles sont plus strictes et peuvent parfois produire des avertissements discutables ou des faux positifs.

Pour transformer ces avertissements en erreurs :

```bash
cargo clippy -- -D clippy::pedantic
```

---

## 9. Désactiver une règle ponctuellement

Pour une fonction précise :

```rust
#[allow(clippy::too_many_arguments)]
fn creer_utilisateur(
    nom: &str,
    prenom: &str,
    age: u8,
    ville: &str,
    pays: &str,
) {
    println!(
        "{} {} a {} ans et habite à {}, {}.",
        prenom, nom, age, ville, pays
    );
}
```

L’attribut `allow` désactive uniquement la règle indiquée sur l’élément concerné.

Pour transformer une règle en avertissement :

```rust
#[warn(clippy::too_many_arguments)]
```

Pour transformer une règle en erreur :

```rust
#[deny(clippy::too_many_arguments)]
```

Clippy permet d’utiliser les niveaux `allow`, `warn` et `deny` sur l’ensemble du projet, un module ou une fonction.

---

## 10. Analyser toutes les cibles

```bash
cargo clippy --all-targets
```

Cette commande analyse notamment :

* le programme principal ;
* les bibliothèques ;
* les tests ;
* les exemples ;
* les benchmarks.

Pour analyser également toutes les fonctionnalités Cargo :

```bash
cargo clippy --all-targets --all-features
```

---

## Commandes essentielles

```bash
cargo clippy
cargo clippy --fix
cargo clippy -- -D warnings
cargo clippy -- -W clippy::pedantic
cargo clippy --all-targets
cargo clippy --all-targets --all-features
```

* `cargo clippy` : analyse le projet.
* `cargo clippy --fix` : applique certaines corrections automatiquement.
* `cargo clippy -- -D warnings` : transforme les avertissements en erreurs.
* `cargo clippy -- -W clippy::pedantic` : active les règles strictes.
* `cargo clippy --all-targets` : analyse toutes les cibles.
* `cargo clippy --all-targets --all-features` : analyse toutes les cibles et fonctionnalités.

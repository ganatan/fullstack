# Analyse du code Rust avec Clippy

Clippy est l’outil officiel de linting de Rust.

Il analyse le code sans l’exécuter afin de détecter :

* les erreurs courantes ;
* le code inutile ;
* les mauvaises pratiques ;
* les constructions pouvant être simplifiées ;
* certains problèmes de performance ;
* les conventions Rust non respectées.

Clippy complète les vérifications réalisées par le compilateur Rust.

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

La commande échoue dès qu’un avertissement Rust ou Clippy est détecté.

Cette commande est particulièrement utile dans une chaîne CI/CD.

---

## 5. Corriger automatiquement certains problèmes

```bash
cargo clippy --fix
```

Clippy applique automatiquement certaines corrections considérées comme sûres.

Pour analyser toutes les cibles lors de la correction :

```bash
cargo clippy --fix --all-targets
```

Après la correction, vérifier les modifications :

```bash
git diff
```

---

## 6. Configurer Clippy

Clippy peut utiliser deux fichiers de configuration différents :

```text
hello-rust/
├── Cargo.toml
├── clippy.toml
├── rustfmt.toml
└── src/
    └── main.rs
```

Le fichier `clippy.toml` configure les paramètres de certaines règles.

Le fichier `Cargo.toml` permet d’activer les règles Clippy et de définir leur niveau.

---

## 7. Ajouter une règle spécifique

Nous allons limiter à quatre le nombre maximal d’arguments autorisés dans une fonction.

Créer le fichier `clippy.toml` à la racine du projet :

```toml
too-many-arguments-threshold = 4
```

Cette configuration modifie le seuil de la règle :

```text
clippy::too_many_arguments
```

Par défaut, Clippy autorise davantage d’arguments avant de déclencher cette règle.

---

## 8. Activer la règle dans `Cargo.toml`

Modifier le fichier `Cargo.toml` :

```toml
[package]
name = "hello-rust"
version = "0.1.0"
edition = "2024"

[lints.clippy]
too_many_arguments = "deny"
```

Le niveau `deny` transforme la détection en erreur de compilation Clippy.

Les principaux niveaux disponibles sont :

```text
allow
warn
deny
forbid
```

* `allow` : désactive la règle ;
* `warn` : affiche un avertissement ;
* `deny` : transforme le problème en erreur ;
* `forbid` : transforme le problème en erreur et empêche sa désactivation localement.

---

## 9. Exemple détecté par la règle

Fichier `src/main.rs` :

```rust
fn creer_utilisateur(
    nom: &str,
    prenom: &str,
    age: u8,
    ville: &str,
    pays: &str,
) {
    println!("{prenom} {nom}, {age} ans, {ville}, {pays}");
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

La fonction contient cinq arguments alors que la limite configurée est de quatre.

Exécuter :

```bash
cargo clippy
```

Clippy retourne une erreur liée à la règle :

```text
clippy::too_many_arguments
```

---

## 10. Corriger avec une structure

Une meilleure solution consiste à regrouper les données dans une structure.

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
        "{} {}, {} ans, {}, {}",
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

La fonction ne reçoit désormais qu’un seul argument.

---

## 11. Désactiver une règle ponctuellement

Une règle peut être désactivée uniquement pour une fonction précise :

```rust
#[allow(clippy::too_many_arguments)]
fn creer_utilisateur(
    nom: &str,
    prenom: &str,
    age: u8,
    ville: &str,
    pays: &str,
) {
    println!("{prenom} {nom}, {age} ans, {ville}, {pays}");
}
```

Pour afficher uniquement un avertissement :

```rust
#[warn(clippy::too_many_arguments)]
```

Pour transformer la détection en erreur :

```rust
#[deny(clippy::too_many_arguments)]
```

Pour empêcher toute désactivation locale :

```rust
#[forbid(clippy::too_many_arguments)]
```

---

## 12. Activer les règles strictes

Clippy propose un groupe de règles supplémentaires nommé `pedantic`.

```bash
cargo clippy -- -W clippy::pedantic
```

Pour transformer ces avertissements en erreurs :

```bash
cargo clippy -- -D clippy::pedantic
```

Le groupe `pedantic` est volontairement strict et peut produire des recommandations qui ne sont pas adaptées à tous les projets.

Il peut aussi être activé dans `Cargo.toml` :

```toml
[lints.clippy]
pedantic = "warn"
too_many_arguments = "deny"
```

---

## 13. Analyser toutes les cibles

```bash
cargo clippy --all-targets
```

Cette commande analyse notamment :

* le programme principal ;
* les bibliothèques ;
* les tests ;
* les exemples ;
* les benchmarks.

Pour analyser toutes les fonctionnalités Cargo :

```bash
cargo clippy --all-targets --all-features
```

Pour transformer tous les avertissements en erreurs :

```bash
cargo clippy --all-targets --all-features -- -D warnings
```

---

## 14. Configuration finale du projet

Structure :

```text
hello-rust/
├── Cargo.toml
├── clippy.toml
├── rustfmt.toml
└── src/
    └── main.rs
```

Fichier `clippy.toml` :

```toml
too-many-arguments-threshold = 4
```

Fichier `Cargo.toml` :

```toml
[package]
name = "hello-rust"
version = "0.1.0"
edition = "2024"

[lints.clippy]
pedantic = "warn"
too_many_arguments = "deny"
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
cargo clippy --all-targets --all-features -- -D warnings
```

* `cargo clippy` : analyse le projet ;
* `cargo clippy --fix` : applique certaines corrections automatiquement ;
* `cargo clippy -- -D warnings` : transforme tous les avertissements en erreurs ;
* `cargo clippy -- -W clippy::pedantic` : active les règles strictes ;
* `cargo clippy --all-targets` : analyse toutes les cibles ;
* `cargo clippy --all-targets --all-features` : analyse toutes les cibles et fonctionnalités.

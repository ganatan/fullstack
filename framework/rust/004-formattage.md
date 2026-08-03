# Formatage du code Rust avec `cargo fmt`

Rust fournit `rustfmt`, l’outil officiel de formatage automatique du code source.

La commande `cargo fmt` permet de formater tous les fichiers Rust d’un projet selon les conventions officielles du langage.

---

## 1. Vérifier l’installation de `rustfmt`

```bash
rustfmt --version
```

Si `rustfmt` n’est pas installé :

```bash
rustup component add rustfmt
```

---

## 2. Exemple de code mal formaté

Fichier `src/main.rs` :

```rust
fn main(){
let message="Bonjour Rust !";
println!("{}",message);
}
```

---

## 3. Formater le projet

À la racine du projet :

```bash
cargo fmt
```

Le code devient automatiquement :

```rust
fn main() {
    let message = "Bonjour Rust !";
    println!("{}", message);
}
```

---

## 4. Vérifier le formatage sans modifier les fichiers

```bash
cargo fmt --check
```

Cette commande vérifie que le code est correctement formaté sans modifier les fichiers.

Elle est particulièrement utile dans une chaîne CI/CD.

---

## 5. Configurer `rustfmt`

Créer un fichier `rustfmt.toml` à la racine du projet :

```text
hello-rust/
├── Cargo.toml
├── rustfmt.toml
└── src/
    └── main.rs
```

Contenu du fichier `rustfmt.toml` :

```toml
max_width = 80
```

Cette règle indique que les lignes doivent idéalement rester limitées à `80` caractères.

---

## 6. Exemple avec la règle `max_width`

Avant formatage :

```rust
fn afficher_message(prenom: &str, langage: &str) {
    println!("Bonjour {}, tu es actuellement en train d'apprendre le langage {}.", prenom, langage);
}
```

Exécuter :

```bash
cargo fmt
```

Après formatage :

```rust
fn afficher_message(prenom: &str, langage: &str) {
    println!(
        "Bonjour {}, tu es actuellement en train d'apprendre le langage {}.",
        prenom, langage
    );
}
```

---

## 7. Formater un workspace complet

```bash
cargo fmt --all
```

Vérifier tout le workspace sans modifier les fichiers :

```bash
cargo fmt --all --check
```

---

## Commandes essentielles

```bash
cargo fmt
cargo fmt --check
cargo fmt --all
cargo fmt --all --check
```

* `cargo fmt` : formate le projet.
* `cargo fmt --check` : vérifie le formatage.
* `cargo fmt --all` : formate tous les packages du workspace.
* `cargo fmt --all --check` : vérifie tout le workspace.

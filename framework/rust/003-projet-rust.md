# Rust — Premier projet

## Vérifier l'installation

```bash
rustc --version
cargo --version
```

## Créer le projet

```bash
cargo new rust-starter
```

## Ouvrir le projet

```bash
cd rust-starter
```

Structure créée :

```text
rust-starter/
├── Cargo.toml
└── src/
    └── main.rs
```

## Fichier `src/main.rs`

```rust
fn main() {
    println!("Hello, Rust!");
}
```

## Exécuter le projet

```bash
cargo run
```

Résultat :

```text
Hello, Rust!
```

## Vérifier le code

```bash
cargo check
```

Cette commande vérifie le code sans générer l'exécutable final.

## Compiler le projet

```bash
cargo build
```

L'exécutable est généré dans :

```text
target/debug/
```

Sous Windows :

```text
target/debug/rust-starter.exe
```

Sous Linux :

```text
target/debug/rust-starter
```

## Compiler en version optimisée

```bash
cargo build --release
```

L'exécutable optimisé est généré dans :

```text
target/release/
```

Sous Windows :

```text
target/release/rust-starter.exe
```

Sous Linux :

```text
target/release/rust-starter
```

## Fichier `Cargo.toml`

```toml
[package]
name = "rust-starter"
version = "0.1.0"
edition = "2024"

[dependencies]
```

## Commandes essentielles

```bash
cargo new rust-starter
cd rust-starter
cargo check
cargo run
cargo build
cargo build --release
```

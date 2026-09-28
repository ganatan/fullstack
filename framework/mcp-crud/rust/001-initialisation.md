# Projet Rust CRUD

## Création

```bash
cargo new rust-crud
cd rust-crud
```

## Dépendances

```bash
cargo add axum
cargo add tokio --features full
cargo add serde --features derive
cargo add serde_json
```

## Cargo.toml

```toml
[package]
name = "rust-crud"
version = "0.1.0"
edition = "2024"

[dependencies]
axum = "0.8"
serde = { version = "1", features = ["derive"] }
serde_json = "1"
tokio = { version = "1", features = ["full"] }
```

## src/main.rs

```rust
use axum::{routing::get, Router};

#[tokio::main]
async fn main() {
    let app = Router::new().route("/", get(root));
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn root() -> &'static str {
    "Rust backend"
}
```

## Lancement

```bash
cargo run
```

```text
http://localhost:3000
```

Réponse :

```text
Rust backend
```

## Compilation

```bash
cargo build            # Build développement
cargo build --release  # Build production
```

## Exécutable

```text
target/debug/rust-crud.exe
target/release/rust-crud.exe
```

## Structure

```text
rust-crud/
├── src/
│   └── main.rs
├── Cargo.lock
└── Cargo.toml
```

## Architecture CRUD cible

```text
src/
├── modules/
│   ├── city/
│   │   ├── controller.rs
│   │   ├── dto.rs
│   │   ├── entity.rs
│   │   ├── repository.rs
│   │   ├── service.rs
│   │   └── mod.rs
│   └── person/
│       ├── controller.rs
│       ├── dto.rs
│       ├── entity.rs
│       ├── repository.rs
│       ├── service.rs
│       └── mod.rs
├── modules.rs
└── main.rs
```
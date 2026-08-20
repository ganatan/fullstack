# RootController

## ⚙️ Configuration Rust

Rust ne possède pas de fichier natif équivalent à :

```text
application.properties
```

La configuration simple de l’application sera placée dans :

```text
src/config.rs
```

### config.rs

```rust
pub const APPLICATION_NAME: &str = "rust-starter";
pub const APPLICATION_STATUS: &str = "running";
pub const RUST_EDITION: &str = "2024";
pub const SERVER_ADDRESS: &str = "0.0.0.0:3000";
```

---

## 📦 Dépendances

Ajouter les dépendances nécessaires :

```bash
cargo add axum
cargo add tokio --features macros,rt-multi-thread,net
cargo add serde --features derive
cargo add serde_json
```

---

## Configuration Cargo

Mettre à jour les métadonnées et les dépendances dans :

```text
Cargo.toml
```

```toml
[package]
name = "rust-starter"
version = "1.0.0"
edition = "2024"
description = "Demo project for Rust"

[dependencies]
axum = "0.8"
serde = { version = "1", features = ["derive"] }
serde_json = "1"
tokio = { version = "1", features = ["macros", "rt-multi-thread", "net"] }
```

---

## Architecture

Créer la structure suivante :

```text
rust-starter/
├── src/
│   ├── api/
│   │   ├── root/
│   │   │   ├── controller.rs
│   │   │   └── mod.rs
│   │   └── mod.rs
│   ├── config.rs
│   └── main.rs
├── Cargo.lock
└── Cargo.toml
```

---

## Implémentation

### Module API

Chemin :

```text
src/api/mod.rs
```

Code :

```rust
pub mod root;
```

---

### Module Root

Chemin :

```text
src/api/root/mod.rs
```

Code :

```rust
pub mod controller;
```

---

### RootController

Chemin :

```text
src/api/root/controller.rs
```

Code :

```rust
use std::collections::HashMap;

use axum::{
    Json,
    Router,
    routing::get,
};
use serde::Serialize;
use serde_json::{
    Value,
    json,
};

use crate::config::{
    APPLICATION_NAME,
    APPLICATION_STATUS,
    RUST_EDITION,
};

#[derive(Serialize)]
pub struct ApiInfo {
    application: &'static str,
    status: &'static str,
    rust: &'static str,
}

pub fn routes() -> Router {
    Router::new()
        .route("/", get(root))
        .route("/info", get(root_with_struct))
        .route("/status", get(root_with_hash_map))
}

async fn root() -> Json<Value> {
    Json(json!({
        "application": APPLICATION_NAME,
        "status": APPLICATION_STATUS,
        "rust": RUST_EDITION
    }))
}

async fn root_with_struct() -> Json<ApiInfo> {
    Json(ApiInfo {
        application: APPLICATION_NAME,
        status: APPLICATION_STATUS,
        rust: RUST_EDITION,
    })
}

async fn root_with_hash_map() -> Json<HashMap<&'static str, &'static str>> {
    let mut response = HashMap::new();

    response.insert("application", APPLICATION_NAME);
    response.insert("status", APPLICATION_STATUS);
    response.insert("rust", RUST_EDITION);

    Json(response)
}
```

---

## Application

Chemin :

```text
src/main.rs
```

Code :

```rust
mod api;
mod config;

use tokio::net::TcpListener;

use api::root::controller;
use config::SERVER_ADDRESS;

#[tokio::main]
async fn main() {
    let app = controller::routes();

    let listener = TcpListener::bind(SERVER_ADDRESS)
        .await
        .expect("Impossible de démarrer le serveur");

    println!("Application disponible sur http://localhost:3000");

    axum::serve(listener, app)
        .await
        .expect("Erreur pendant l'exécution du serveur");
}
```

---

## Build et tests

Vérifier le code sans générer l’exécutable :

```bash
cargo check
```

Compiler l’application :

```bash
cargo build
```

Exécuter les tests :

```bash
cargo test
```

Compiler la version optimisée :

```bash
cargo build --release
```

### Artefact Windows

```text
target/release/rust-starter.exe
```

### Artefact Linux

```text
target/release/rust-starter
```

---

## Run

### Exécution via Cargo

```bash
cargo run
```

### Exécution de la version debug sous Windows

```powershell
.\target\debug\rust-starter.exe
```

### Exécution de la version debug sous Linux

```bash
./target/debug/rust-starter
```

### Exécution de la version release sous Windows

```powershell
.\target\release\rust-starter.exe
```

### Exécution de la version release sous Linux

```bash
./target/release/rust-starter
```

---

## Accès

### Root

```text
http://localhost:3000/
```

### Info

```text
http://localhost:3000/info
```

### Status

```text
http://localhost:3000/status
```

---

## Résultat

Appel via navigateur ou curl :

```text
http://localhost:3000/
```

Réponse JSON :

```json
{
  "application": "rust-starter",
  "status": "running",
  "rust": "2024"
}
```

Rust ne fournit pas directement une propriété standard équivalente à :

```java
System.getProperty("java.version")
```

Dans cette première version, la réponse expose donc l’édition Rust utilisée par le projet.

---

## Test avec curl

### Root

```bash
curl http://localhost:3000/
```

### Info

```bash
curl http://localhost:3000/info
```

### Status

```bash
curl http://localhost:3000/status
```

---

## 📦 Commandes Cargo usuelles

### Vérification rapide

```bash
cargo check
```

### Compilation

```bash
cargo build
```

### Compilation optimisée

```bash
cargo build --release
```

### Exécution

```bash
cargo run
```

### Exécution des tests

```bash
cargo test
```

### Nettoyage

```bash
cargo clean
```

### Formatage

```bash
cargo fmt
```

### Analyse du code

```bash
cargo clippy
```

### Affichage des dépendances

```bash
cargo tree
```

### Mise à jour des dépendances

```bash
cargo update
```

### Affichage de la documentation locale

```bash
cargo doc --open
```
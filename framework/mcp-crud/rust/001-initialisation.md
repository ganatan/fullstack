# Initialisation du projet Rust

## 🎯 Génération du projet Rust avec Cargo

Rust ne possède pas de générateur graphique équivalent à Spring Initializr ou Quarkus Code.

Le projet est créé directement avec `cargo`.

---

## 🏗️ Projet

* **Build Tool** : Cargo
* **Language** : Rust
* **Toolchain** : Stable
* **Edition** : 2024
* **Project Type** : Binary
* **Artifact** : `rust-starter`

Rust ne possède pas les notions Java suivantes :

* Group
* Package Name
* Packaging JAR

Le nom du projet devient directement le nom du package Rust.

---

## 🔍 Vérification de Rust

```bash
rustc --version
cargo --version
```

---

## 📥 Génération

Créer le projet :

```bash
cargo new rust-starter
```

Entrer dans le projet :

```bash
cd rust-starter
```

---

## 📦 Dépendances à ajouter

### Axum

Framework HTTP utilisé pour créer les contrôleurs et les routes REST.

```bash
cargo add axum
```

### Tokio

Runtime asynchrone utilisé par Axum.

```bash
cargo add tokio --features full
```

### Serde

Sérialisation et désérialisation des structures Rust.

```bash
cargo add serde --features derive
```

### Serde JSON

Gestion des payloads JSON.

```bash
cargo add serde_json
```

---

## 📄 Fichier Cargo.toml

Après l’ajout des dépendances, le fichier contient une structure similaire à celle-ci :

```toml
[package]
name = "rust-starter"
version = "0.1.0"
edition = "2024"

[dependencies]
axum = "0.8"
serde = { version = "1", features = ["derive"] }
serde_json = "1"
tokio = { version = "1", features = ["full"] }
```

Les numéros de versions exacts peuvent évoluer selon la date de création du projet.

---

## 📄 Premier serveur HTTP

Remplacer le contenu du fichier :

```text
src/main.rs
```

par :

```rust
use axum::{
    routing::get,
    Router,
};

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/", get(root));

    let listener = tokio::net::TcpListener::bind(
        "0.0.0.0:3000",
    )
    .await
    .unwrap();

    axum::serve(listener, app)
        .await
        .unwrap();
}

async fn root() -> &'static str {
    "Rust backend"
}
```

---

## ▶️ Lancement du projet

```bash
cargo run
```

L’application est disponible à l’adresse suivante :

```text
http://localhost:3000
```

---

## 🔍 Vérification

Ouvrir dans le navigateur :

```text
http://localhost:3000
```

Réponse attendue :

```text
Rust backend
```

---

## 📦 Compilation du projet

### Compilation de développement

```bash
cargo build
```

Le programme est généré dans :

```text
target/debug
```

### Compilation de production

```bash
cargo build --release
```

Le programme optimisé est généré dans :

```text
target/release
```

---

## ▶️ Lancement de l’exécutable

### Windows

```powershell
.\target\release\rust-starter.exe
```

### Linux

```bash
./target/release/rust-starter
```

---

## 📁 Structure minimale

```text
rust-starter/
├── src/
│   └── main.rs
├── target/
├── Cargo.lock
└── Cargo.toml
```

---

## 📁 Architecture finale prévue

```text
rust-starter/
├── src/
│   ├── modules/
│   │   ├── city/
│   │   │   ├── controller.rs
│   │   │   ├── dto.rs
│   │   │   ├── entity.rs
│   │   │   ├── repository.rs
│   │   │   ├── service.rs
│   │   │   └── mod.rs
│   │   └── person/
│   │       ├── controller.rs
│   │       ├── dto.rs
│   │       ├── entity.rs
│   │       ├── repository.rs
│   │       ├── service.rs
│   │       └── mod.rs
│   ├── modules.rs
│   └── main.rs
├── Cargo.lock
└── Cargo.toml
```

Les dépendances PostgreSQL et SQLx seront ajoutées lors de la configuration de la base de données.

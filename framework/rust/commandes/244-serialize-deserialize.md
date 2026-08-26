# Serialize / Deserialize

`serde` permet de sérialiser et désérialiser les structures Rust.

## Dépendance

```toml
serde = { version = "1", features = ["derive"] }
```

## Structure

```rust
use serde::{
    Deserialize,
    Serialize,
};

#[derive(Serialize, Deserialize)]
struct Person {
    id: i32,
    name: String,
}
```

## Sérialisation

```rust
let json = serde_json::to_string(&person)?;
```

## Désérialisation

```rust
let person: Person = serde_json::from_str(json)?;
```

## Renommer un champ

```rust
#[serde(rename = "firstName")]
first_name: String,
```

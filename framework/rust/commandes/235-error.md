# Error

Gestion essentielle des erreurs en Rust.

## Result

```rust
fn read() -> Result<String, std::io::Error> {
    std::fs::read_to_string("file.txt")
}
```

## Propager avec ?

```rust
fn load() -> Result<String, std::io::Error> {
    let content = std::fs::read_to_string("file.txt")?;
    Ok(content)
}
```

## panic!

```rust
panic!("Erreur critique");
```

## expect

```rust
let content = std::fs::read_to_string("file.txt")
    .expect("Impossible de lire le fichier");
```

## unwrap

```rust
let content = std::fs::read_to_string("file.txt").unwrap();
```

`unwrap` est à éviter lorsque l'erreur doit être gérée proprement.

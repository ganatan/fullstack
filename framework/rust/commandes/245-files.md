# Files

Lecture et écriture de fichiers en Rust.

## Lire un fichier

```rust
let content = std::fs::read_to_string("file.txt")?;
```

## Écrire un fichier

```rust
std::fs::write("file.txt", "Hello")?;
```

## Lire des bytes

```rust
let data = std::fs::read("file.bin")?;
```

## Créer un fichier

```rust
use std::fs::File;

let file = File::create("file.txt")?;
```

## Vérifier l'existence

```rust
let exists = std::path::Path::new("file.txt").exists();
```

## Supprimer

```rust
std::fs::remove_file("file.txt")?;
```

# Path

`Path` et `PathBuf` permettent de manipuler les chemins.

## Path

```rust
use std::path::Path;

let path = Path::new("src/main.rs");
```

## Existence

```rust
let exists = path.exists();
```

## Nom du fichier

```rust
let name = path.file_name();
```

## Extension

```rust
let extension = path.extension();
```

## PathBuf

```rust
use std::path::PathBuf;

let mut path = PathBuf::from("src");
path.push("main.rs");
```

## Afficher

```rust
println!("{}", path.display());
```

# HashSet

`HashSet` stocke des valeurs uniques.

## Import

```rust
use std::collections::HashSet;
```

## Création

```rust
let mut values = HashSet::new();
```

## Ajouter

```rust
values.insert("Java");
values.insert("Rust");
```

## Vérifier une valeur

```rust
let exists = values.contains("Rust");
```

## Supprimer

```rust
values.remove("Java");
```

## Parcourir

```rust
for value in &values {
    println!("{value}");
}
```

## Taille

```rust
let size = values.len();
```

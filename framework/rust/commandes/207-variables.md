# Variables

Déclaration et modification des variables en Rust.

## Variable immutable

```rust
let name = "Rust";
```

## Variable mutable

```rust
let mut count = 0;
count += 1;
```

## Type explicite

```rust
let age: i32 = 60;
```

## Shadowing

```rust
let value = 10;
let value = value + 5;
```

## Décomposition

```rust
let (x, y) = (10, 20);
```

## Variable inutilisée

```rust
let _unused = 10;
```

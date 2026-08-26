# Tableaux

Les tableaux Rust ont une taille fixe.

## Déclaration

```rust
let values = [10, 20, 30];
```

## Type explicite

```rust
let values: [i32; 3] = [10, 20, 30];
```

## Valeur répétée

```rust
let values = [0; 5];
```

## Accès

```rust
let first = values[0];
```

## Taille

```rust
let size = values.len();
```

## Parcours

```rust
for value in values {
    println!("{value}");
}
```

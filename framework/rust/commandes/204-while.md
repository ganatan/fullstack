# While

Boucle `while` en Rust.

## Exemple simple

```rust
let mut i = 0;

while i < 5 {
    println!("{i}");
    i += 1;
}
```

## Condition booléenne

```rust
let mut running = true;

while running {
    running = false;
}
```

## Parcours inversé

```rust
let mut i = 5;

while i > 0 {
    println!("{i}");
    i -= 1;
}
```

## Avec break

```rust
while true {
    break;
}
```

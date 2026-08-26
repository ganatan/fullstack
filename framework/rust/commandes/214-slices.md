# Slices

Une slice représente une vue sur une partie d'une collection.

## Slice de tableau

```rust
let values = [10, 20, 30, 40];
let slice = &values[1..3];
```

## Slice complète

```rust
let slice = &values[..];
```

## Début jusqu'à index

```rust
let slice = &values[..2];
```

## Index jusqu'à la fin

```rust
let slice = &values[2..];
```

## Paramètre de fonction

```rust
fn display(values: &[i32]) {
    println!("{:?}", values);
}
```

## Slice de String

```rust
let text = String::from("Rust");
let slice = &text[..];
```

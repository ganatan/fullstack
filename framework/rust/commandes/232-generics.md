# Generics

Les generics permettent d'écrire du code réutilisable pour plusieurs types.

## Fonction générique

```rust
fn first<T>(values: &[T]) -> Option<&T> {
    values.first()
}
```

## Structure générique

```rust
struct Wrapper<T> {
    value: T,
}
```

## Utilisation

```rust
let number = Wrapper { value: 10 };
let text = Wrapper { value: "Rust" };
```

## Avec contrainte

```rust
fn display<T: std::fmt::Display>(value: T) {
    println!("{value}");
}
```

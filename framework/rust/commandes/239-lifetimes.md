# Lifetimes

Les lifetimes décrivent la durée de validité des références.

## Cas simple

Rust déduit généralement les lifetimes automatiquement.

```rust
fn length(value: &str) -> usize {
    value.len()
}
```

## Lifetime explicite

```rust
fn longest<'a>(
    a: &'a str,
    b: &'a str,
) -> &'a str {
    if a.len() >= b.len() {
        a
    } else {
        b
    }
}
```

## Dans une structure

```rust
struct Person<'a> {
    name: &'a str,
}
```

Les lifetimes n'allongent pas la durée de vie des données.

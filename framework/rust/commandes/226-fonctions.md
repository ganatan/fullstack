# Fonctions

Déclaration et utilisation des fonctions en Rust.

## Fonction simple

```rust
fn hello() {
    println!("Hello");
}
```

## Paramètre

```rust
fn hello(name: &str) {
    println!("Hello {name}");
}
```

## Retour

```rust
fn add(a: i32, b: i32) -> i32 {
    a + b
}
```

## Retour explicite

```rust
fn add(a: i32, b: i32) -> i32 {
    return a + b;
}
```

## Appel

```rust
let result = add(10, 20);
```

# Clone / Copy

`Clone` et `Copy` permettent de dupliquer des valeurs.

## Copy

```rust
let a = 10;
let b = a;

println!("{a} {b}");
```

Les entiers implémentent `Copy`.

## Clone

```rust
let text1 = String::from("Rust");
let text2 = text1.clone();
```

Les deux valeurs restent utilisables.

## Dériver Clone

```rust
#[derive(Clone)]
struct Person {
    name: String,
}
```

## Dériver Copy

```rust
#[derive(Clone, Copy)]
struct Point {
    x: i32,
    y: i32,
}
```

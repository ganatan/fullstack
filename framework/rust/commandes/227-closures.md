# Closures

Les closures sont des fonctions anonymes.

## Exemple simple

```rust
let add = |a: i32, b: i32| a + b;

let result = add(10, 20);
```

## Avec iterator

```rust
let values = vec![1, 2, 3];

let result: Vec<i32> = values
    .iter()
    .map(|x| x * 2)
    .collect();
```

## Capturer une variable

```rust
let factor = 10;

let multiply = |value| value * factor;
```

## Closure move

```rust
let text = String::from("Rust");

let closure = move || println!("{text}");
```

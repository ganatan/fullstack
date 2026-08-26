# Fold

`fold` réduit un iterator en une seule valeur.

## Somme

```rust
let values = vec![1, 2, 3, 4];

let total = values
    .iter()
    .fold(0, |acc, x| acc + x);
```

## Produit

```rust
let result = values
    .iter()
    .fold(1, |acc, x| acc * x);
```

## Concaténation

```rust
let values = vec!["Rust", "Java"];

let result = values
    .iter()
    .fold(String::new(), |mut acc, value| {
        acc.push_str(value);
        acc
    });
```

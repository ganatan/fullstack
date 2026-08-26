# Match

`match` permet de traiter plusieurs cas de manière exhaustive.

## Exemple simple

```rust
let value = 2;

match value {
    1 => println!("Un"),
    2 => println!("Deux"),
    _ => println!("Autre"),
}
```

## Retourner une valeur

```rust
let label = match value {
    1 => "un",
    2 => "deux",
    _ => "autre",
};
```

## Plusieurs valeurs

```rust
match value {
    1 | 2 => println!("Un ou deux"),
    _ => println!("Autre"),
}
```

## Intervalle

```rust
match value {
    1..=10 => println!("Entre 1 et 10"),
    _ => println!("Hors intervalle"),
}
```

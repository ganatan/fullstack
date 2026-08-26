# Find

`find` retourne le premier élément correspondant à une condition.

## Exemple

```rust
let values = vec![10, 20, 30];

let result = values
    .iter()
    .find(|x| **x == 20);
```

Le résultat est :

```text
Option<&i32>
```

## Avec match

```rust
match result {
    Some(value) => println!("{value}"),
    None => println!("Introuvable"),
}
```

## Avec copied

```rust
let result = values
    .iter()
    .find(|x| **x == 20)
    .copied();
```

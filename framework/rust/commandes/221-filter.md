# Filter

`filter` conserve uniquement les éléments correspondant à une condition.

## Exemple

```rust
let values = vec![1, 2, 3, 4, 5];

let result: Vec<&i32> = values
    .iter()
    .filter(|x| **x > 2)
    .collect();
```

## Nombres pairs

```rust
let result: Vec<&i32> = values
    .iter()
    .filter(|x| **x % 2 == 0)
    .collect();
```

## Avec map

```rust
let result: Vec<i32> = values
    .iter()
    .filter(|x| **x > 2)
    .map(|x| x * 10)
    .collect();
```

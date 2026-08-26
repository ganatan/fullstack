# Collect

`collect` transforme un iterator en collection.

## Vers Vector

```rust
let values = 1..=5;

let result: Vec<i32> = values.collect();
```

## Après map

```rust
let result: Vec<i32> = (1..=5)
    .map(|x| x * 2)
    .collect();
```

## Vers HashSet

```rust
use std::collections::HashSet;

let result: HashSet<i32> = vec![1, 1, 2, 3]
    .into_iter()
    .collect();
```

## Depuis des Result

```rust
let values: Result<Vec<_>, _> = results.into_iter().collect();
```

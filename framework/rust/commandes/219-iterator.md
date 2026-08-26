# Iterator

Les iterators permettent de parcourir et transformer des collections.

## Créer un iterator

```rust
let values = vec![1, 2, 3];

let iterator = values.iter();
```

## Parcourir

```rust
for value in values.iter() {
    println!("{value}");
}
```

## Chaîner des opérations

```rust
let result: Vec<i32> = values
    .iter()
    .map(|x| x * 2)
    .filter(|x| *x > 2)
    .collect();
```

## Iterator possédé

```rust
for value in values.into_iter() {
    println!("{value}");
}
```

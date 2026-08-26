# Option

`Option<T>` représente une valeur présente ou absente.

## Variantes

```rust
Some(value)
None
```

## Exemple

```rust
let value: Option<i32> = Some(10);
```

## Match

```rust
match value {
    Some(value) => println!("{value}"),
    None => println!("Aucune valeur"),
}
```

## if let

```rust
if let Some(value) = value {
    println!("{value}");
}
```

## Valeur par défaut

```rust
let result = value.unwrap_or(0);
```

## Transformation

```rust
let result = value.map(|x| x * 2);
```

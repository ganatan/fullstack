# Result

`Result<T, E>` représente un succès ou une erreur.

## Variantes

```rust
Ok(value)
Err(error)
```

## Exemple

```rust
fn divide(a: i32, b: i32) -> Result<i32, String> {
    if b == 0 {
        return Err(String::from("Division par zéro"));
    }

    Ok(a / b)
}
```

## Match

```rust
match divide(10, 2) {
    Ok(value) => println!("{value}"),
    Err(error) => println!("{error}"),
}
```

## Propagation

```rust
let value = divide(10, 2)?;
```

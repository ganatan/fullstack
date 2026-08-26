# References

Les références permettent d'accéder à une valeur sans transfert d'ownership.

## Référence immutable

```rust
let value = 10;
let reference = &value;
```

## Déréférencement

```rust
let copied = *reference;
```

## Référence mutable

```rust
let mut value = 10;
let reference = &mut value;
*reference = 20;
```

## Paramètre

```rust
fn display(value: &i32) {
    println!("{value}");
}
```

## String recommandée

```rust
fn display(value: &str) {
    println!("{value}");
}
```

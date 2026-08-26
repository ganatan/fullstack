# Booléens

Le type booléen Rust est `bool`.

## Déclaration

```rust
let active: bool = true;
let disabled = false;
```

## Négation

```rust
let result = !active;
```

## AND

```rust
let result = active && !disabled;
```

## OR

```rust
let result = active || disabled;
```

## Comparaisons

```rust
let result = 10 > 5;
let equal = 10 == 10;
let different = 10 != 5;
```

## Dans une condition

```rust
if active {
    println!("Actif");
}
```

# If / Else

Utilisation des conditions en Rust.

## Condition simple

```rust
let age = 18;

if age >= 18 {
    println!("Majeur");
}
```

## If / Else

```rust
if age >= 18 {
    println!("Majeur");
} else {
    println!("Mineur");
}
```

## If / Else If

```rust
if age < 18 {
    println!("Mineur");
} else if age < 65 {
    println!("Adulte");
} else {
    println!("Senior");
}
```

## Retourner une valeur

```rust
let status = if age >= 18 { "majeur" } else { "mineur" };
```

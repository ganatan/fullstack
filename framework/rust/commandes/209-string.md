# String

`String` représente une chaîne possédée et modifiable.

## Créer une String

```rust
let name = String::from("Rust");
```

## Depuis &str

```rust
let name = "Rust".to_string();
```

## Ajouter du texte

```rust
let mut text = String::from("Hello");
text.push_str(" Rust");
```

## Ajouter un caractère

```rust
text.push('!');
```

## Concaténation

```rust
let result = format!("{} {}", "Hello", "Rust");
```

## Longueur

```rust
let size = text.len();
```

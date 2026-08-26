# Enum

Une `enum` représente plusieurs variantes possibles.

## Déclaration

```rust
enum Status {
    Active,
    Inactive,
}
```

## Utilisation

```rust
let status = Status::Active;
```

## Avec match

```rust
match status {
    Status::Active => println!("Actif"),
    Status::Inactive => println!("Inactif"),
}
```

## Variante avec données

```rust
enum Message {
    Text(String),
    Code(i32),
}
```

## Exemple

```rust
let message = Message::Text(String::from("Hello"));
```

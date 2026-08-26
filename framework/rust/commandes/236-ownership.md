# Ownership

L'ownership définit qui possède une valeur en Rust.

## Propriétaire

```rust
let text = String::from("Rust");
```

`text` possède la `String`.

## Déplacement

```rust
let text1 = String::from("Rust");
let text2 = text1;
```

Après le déplacement, `text1` n'est plus utilisable.

## Copie

```rust
let a = 10;
let b = a;
```

Les types simples implémentant `Copy` restent utilisables.

## Donner à une fonction

```rust
fn consume(text: String) {
    println!("{text}");
}
```

## Récupérer la valeur

```rust
fn identity(text: String) -> String {
    text
}
```

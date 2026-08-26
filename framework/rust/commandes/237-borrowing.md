# Borrowing

Le borrowing permet d'utiliser une valeur sans en prendre possession.

## Référence immutable

```rust
let text = String::from("Rust");
display(&text);
```

```rust
fn display(text: &String) {
    println!("{text}");
}
```

## Référence mutable

```rust
let mut text = String::from("Rust");
update(&mut text);
```

```rust
fn update(text: &mut String) {
    text.push('!');
}
```

## Règle principale

Plusieurs références immutables sont possibles.

Une référence mutable exclusive est possible.

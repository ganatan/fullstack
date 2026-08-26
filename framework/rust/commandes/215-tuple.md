# Tuple

Un tuple regroupe plusieurs valeurs de types différents.

## Déclaration

```rust
let person = ("Steven", 77, true);
```

## Types explicites

```rust
let person: (&str, i32, bool) = ("Steven", 77, true);
```

## Accès

```rust
let name = person.0;
let age = person.1;
```

## Décomposition

```rust
let (name, age, active) = person;
```

## Retour multiple

```rust
fn values() -> (i32, i32) {
    (10, 20)
}
```

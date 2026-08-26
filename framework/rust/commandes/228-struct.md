# Struct

Une `struct` regroupe des données dans un type.

## Déclaration

```rust
struct Person {
    id: i32,
    name: String,
}
```

## Création

```rust
let person = Person {
    id: 1,
    name: String::from("Steven"),
};
```

## Accès

```rust
println!("{}", person.name);
```

## Structure mutable

```rust
let mut person = Person {
    id: 1,
    name: String::from("Steven"),
};

person.name = String::from("Martin");
```

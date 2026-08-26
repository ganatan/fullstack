# Impl

`impl` permet d'ajouter des méthodes à un type.

## Structure

```rust
struct Person {
    name: String,
}
```

## Méthode

```rust
impl Person {
    fn display(&self) {
        println!("{}", self.name);
    }
}
```

## Constructeur

```rust
impl Person {
    fn new(name: String) -> Self {
        Self { name }
    }
}
```

## Utilisation

```rust
let person = Person::new(String::from("Steven"));
person.display();
```

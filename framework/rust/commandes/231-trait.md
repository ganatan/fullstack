# Trait

Un `trait` définit un comportement partagé.

## Déclaration

```rust
trait Display {
    fn display(&self);
}
```

## Implémentation

```rust
struct Person {
    name: String,
}

impl Display for Person {
    fn display(&self) {
        println!("{}", self.name);
    }
}
```

## Utilisation

```rust
let person = Person {
    name: String::from("Steven"),
};

person.display();
```

## Trait comme paramètre

```rust
fn print(value: &impl Display) {
    value.display();
}
```

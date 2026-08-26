# Modules

Les modules organisent le code Rust.

## Déclarer un module

```rust
mod person;
```

## Module inline

```rust
mod person {
    pub fn hello() {
        println!("Hello");
    }
}
```

## Appeler une fonction

```rust
person::hello();
```

## Rendre public

```rust
pub fn hello() {
}
```

## Sous-module

```rust
mod api {
    pub mod person {
    }
}
```

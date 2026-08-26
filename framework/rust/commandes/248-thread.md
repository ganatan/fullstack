# Thread

Création et gestion des threads avec la bibliothèque standard.

## Créer un thread

```rust
use std::thread;

let handle = thread::spawn(|| {
    println!("Thread");
});
```

## Attendre la fin

```rust
handle.join().unwrap();
```

## Déplacer des données

```rust
let text = String::from("Rust");

let handle = thread::spawn(move || {
    println!("{text}");
});

handle.join().unwrap();
```

## Pause

```rust
use std::time::Duration;

thread::sleep(Duration::from_secs(1));
```

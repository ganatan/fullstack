# Mutex

`Mutex<T>` protège une donnée partagée contre les accès concurrents.

## Création

```rust
use std::sync::Mutex;

let value = Mutex::new(0);
```

## Verrouillage

```rust
{
    let mut data = value.lock().unwrap();
    *data += 1;
}
```

Le verrou est libéré automatiquement à la fin du scope.

## Lecture

```rust
let data = value.lock().unwrap();
println!("{data}");
```

Avec plusieurs threads, `Mutex` est souvent utilisé avec `Arc`.

# Async / Await

`async` et `await` permettent d'exécuter du code asynchrone.

## Fonction async

```rust
async fn load() -> String {
    String::from("data")
}
```

## Await

```rust
let result = load().await;
```

## Avec Tokio

```rust
#[tokio::main]
async fn main() {
    let result = load().await;
    println!("{result}");
}
```

## Plusieurs tâches

```rust
let task1 = load();
let task2 = load();

let (a, b) = tokio::join!(task1, task2);
```

Un runtime async comme Tokio est généralement nécessaire.

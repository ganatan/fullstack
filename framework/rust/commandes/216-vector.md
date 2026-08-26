# Vector

`Vec<T>` représente une collection dynamique.

## Créer un Vector

```rust
let values = vec![10, 20, 30];
```

## Vector vide

```rust
let mut values: Vec<i32> = Vec::new();
```

## Ajouter

```rust
values.push(10);
```

## Supprimer la dernière valeur

```rust
let value = values.pop();
```

## Accéder

```rust
let first = values[0];
```

## Accès sécurisé

```rust
let first = values.get(0);
```

## Parcourir

```rust
for value in &values {
    println!("{value}");
}
```

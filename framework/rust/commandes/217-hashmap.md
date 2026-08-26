# HashMap

`HashMap` stocke des paires clé / valeur.

## Import

```rust
use std::collections::HashMap;
```

## Création

```rust
let mut persons = HashMap::new();
```

## Ajouter

```rust
persons.insert(1, "Steven");
persons.insert(2, "Martin");
```

## Lire

```rust
let person = persons.get(&1);
```

## Tester une clé

```rust
let exists = persons.contains_key(&1);
```

## Supprimer

```rust
persons.remove(&1);
```

## Parcourir

```rust
for (id, name) in &persons {
    println!("{id} {name}");
}
```

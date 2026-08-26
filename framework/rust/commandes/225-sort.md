# Sort

Tri des collections en Rust.

## Trier un Vector

```rust
let mut values = vec![3, 1, 2];
values.sort();
```

## Tri décroissant

```rust
values.sort_by(|a, b| b.cmp(a));
```

## Trier par clé

```rust
persons.sort_by_key(|person| person.id);
```

## Tri flottant

```rust
values.sort_by(|a, b| a.partial_cmp(b).unwrap());
```

## Vérifier le résultat

```rust
println!("{:?}", values);
```

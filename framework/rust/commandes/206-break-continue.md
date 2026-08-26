# Break / Continue

Contrôle du flux dans les boucles.

## Break

```rust
for i in 0..10 {
    if i == 5 {
        break;
    }
}
```

## Continue

```rust
for i in 0..10 {
    if i % 2 == 0 {
        continue;
    }

    println!("{i}");
}
```

## Break avec valeur

```rust
let result = loop {
    break 42;
};
```

## Boucle nommée

```rust
'outer: for i in 0..3 {
    for j in 0..3 {
        if i == 1 && j == 1 {
            break 'outer;
        }
    }
}
```

# Loop

`loop` crée une boucle infinie en Rust.

## Boucle simple

```rust
loop {
    println!("Boucle");
    break;
}
```

## Retourner une valeur

```rust
let mut count = 0;

let result = loop {
    count += 1;

    if count == 5 {
        break count;
    }
};
```

## Boucle nommée

```rust
'outer: loop {
    loop {
        break 'outer;
    }
}
```

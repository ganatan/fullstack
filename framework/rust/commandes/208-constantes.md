# Constantes

Déclaration des constantes en Rust.

## Déclarer une constante

```rust
const MAX_USERS: usize = 100;
```

Le type est obligatoire.

## Convention

Les constantes utilisent généralement :

```text
SCREAMING_SNAKE_CASE
```

## Exemple

```rust
const PORT: u16 = 3000;

fn main() {
    println!("{PORT}");
}
```

## Constante globale

```rust
const APP_NAME: &str = "starter";
```

Les constantes peuvent être déclarées hors des fonctions.

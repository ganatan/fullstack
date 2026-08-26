# JSON

Le JSON est généralement manipulé avec `serde` et `serde_json`.

## Dépendances

```toml
serde = { version = "1", features = ["derive"] }
serde_json = "1"
```

## JSON vers structure

```rust
let person: Person = serde_json::from_str(json)?;
```

## Structure vers JSON

```rust
let json = serde_json::to_string(&person)?;
```

## JSON formaté

```rust
let json = serde_json::to_string_pretty(&person)?;
```

## Valeur JSON dynamique

```rust
let value: serde_json::Value = serde_json::from_str(json)?;
```

## Macro json

```rust
let value = serde_json::json!({
    "id": 1,
    "name": "Steven"
});
```

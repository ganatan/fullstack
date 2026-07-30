# Types de base en Rust

## Entiers signés
- `i8` : `let x: i8 = -10;`
- `i16` : `let x: i16 = -10;`
- `i32` : `let x: i32 = -10;`
- `i64` : `let x: i64 = -10;`
- `i128` : `let x: i128 = -10;`
- `isize` : `let x: isize = -10;`

## Entiers non signés
- `u8` : `let x: u8 = 10;`
- `u16` : `let x: u16 = 10;`
- `u32` : `let x: u32 = 10;`
- `u64` : `let x: u64 = 10;`
- `u128` : `let x: u128 = 10;`
- `usize` : `let x: usize = 10;`

## Nombres à virgule
- `f32` : `let x: f32 = 3.14;`
- `f64` : `let x: f64 = 3.14;`

## Booléen
- `bool` : `let ok: bool = true;`

## Caractère
- `char` : `let c: char = 'A';`

## Chaîne de caractères
- `&str` : `let s: &str = "Bonjour";`
- `String` : `let s: String = String::from("Bonjour");`

## Tuple
- `(T1, T2, ...)` : `let p = ("Danny", 60);`

## Tableau
- `[T; N]` : `let t = [1, 2, 3];`

## Vecteur
- `Vec<T>` : `let v = vec![1, 2, 3];`

## Constante
- `const` : `const PI: f64 = 3.14159;`


## Entiers signés (`i32`)

```rust
fn main() {
    let x: i32 = -10;

    println!("{}", x);
}
```

---

## Entiers non signés (`u32`)

```rust
fn main() {
    let x: u32 = 10;

    println!("{}", x);
}
```

---

## Nombre à virgule (`f64`)

```rust
fn main() {
    let x: f64 = 3.14;

    println!("{}", x);
}
```

---

## Booléen (`bool`)

```rust
fn main() {
    let ok: bool = true;

    println!("{}", ok);
}
```

---

## Caractère (`char`)

```rust
fn main() {
    let c: char = 'A';

    println!("{}", c);
}
```

---

## Chaîne immuable (`&str`)

```rust
fn main() {
    let s: &str = "Bonjour";

    println!("{}", s);
}
```

---

## Chaîne dynamique (`String`)

```rust
fn main() {
    let s: String = String::from("Bonjour");

    println!("{}", s);
}
```

---

## Tuple

```rust
fn main() {
    let p = ("Danny", 60);

    println!("{}", p.0);
}
```

---

## Tableau (`[T; N]`)

```rust
fn main() {
    let t = [10, 20, 30];

    println!("{}", t[0]);
}
```

---

## Vecteur (`Vec<T>`)

```rust
fn main() {
    let v = vec![10, 20, 30];

    println!("{}", v[0]);
}
```

---

## Constante (`const`)

```rust
const PI: f64 = 3.14159;

fn main() {
    println!("{}", PI);
}
```
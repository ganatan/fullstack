# Utilisation de la boucle `while` en Rust

La boucle `while` exécute un bloc tant qu’une condition reste vraie.  
Chaque exemple peut être utilisé directement dans le fichier `src/main.rs`.

Exécution :

```bash
cargo run
```

---

## 1. Compter de 0 à 4

La boucle continue tant que `nombre` est inférieur à `5`.  
La variable doit être modifiable avec le mot-clé `mut`.

```rust
fn main() {
    let mut nombre = 0;

    while nombre < 5 {
        println!("{nombre}");

        nombre += 1;
    }
}
```

Résultat :

```text
0
1
2
3
4
```

---

## 2. Compter de 1 à 5

La condition `nombre <= 5` inclut la valeur finale.  
La variable est incrémentée après chaque affichage.

```rust
fn main() {
    let mut nombre = 1;

    while nombre <= 5 {
        println!("{nombre}");

        nombre += 1;
    }
}
```

Résultat :

```text
1
2
3
4
5
```

---

## 3. Effectuer un compte à rebours

La variable diminue à chaque itération avec l’opérateur `-=`.  
La boucle s’arrête lorsque la valeur atteint zéro.

```rust
fn main() {
    let mut nombre = 5;

    while nombre > 0 {
        println!("{nombre}");

        nombre -= 1;
    }

    println!("Départ");
}
```

Résultat :

```text
5
4
3
2
1
Départ
```

---

## 4. Calculer la somme de plusieurs nombres

La boucle additionne les nombres compris entre `1` et `5`.  
La variable `somme` conserve le résultat cumulé.

```rust
fn main() {
    let mut nombre = 1;
    let mut somme = 0;

    while nombre <= 5 {
        somme += nombre;

        nombre += 1;
    }

    println!("Somme : {somme}");
}
```

Résultat :

```text
Somme : 15
```

---

## 5. Parcourir un tableau avec un index

Une boucle `while` peut parcourir un tableau en utilisant un index.  
La condition vérifie que l’index reste inférieur à la longueur du tableau.

```rust
fn main() {
    let nombres = [10, 20, 30, 40];
    let mut index = 0;

    while index < nombres.len() {
        println!("{}", nombres[index]);

        index += 1;
    }
}
```

Résultat :

```text
10
20
30
40
```

---

## 6. Parcourir un vecteur avec un index

Le principe est identique à celui utilisé avec un tableau.  
Dans du code Rust courant, une boucle `for` reste généralement préférable.

```rust
fn main() {
    let langages = vec!["Rust", "Java", "TypeScript"];
    let mut index = 0;

    while index < langages.len() {
        println!("{}", langages[index]);

        index += 1;
    }
}
```

Résultat :

```text
Rust
Java
TypeScript
```

---

## 7. Afficher uniquement les nombres pairs

L’opérateur `%` permet de calculer le reste d’une division.  
Un nombre est pair lorsque le reste de sa division par `2` vaut zéro.

```rust
fn main() {
    let mut nombre = 1;

    while nombre <= 10 {
        if nombre % 2 == 0 {
            println!("{nombre}");
        }

        nombre += 1;
    }
}
```

Résultat :

```text
2
4
6
8
10
```

---

## 8. Utiliser `continue`

Le mot-clé `continue` passe directement à l’itération suivante.  
L’incrémentation doit être réalisée avant `continue` pour éviter une boucle infinie.

```rust
fn main() {
    let mut nombre = 0;

    while nombre < 6 {
        nombre += 1;

        if nombre == 3 {
            continue;
        }

        println!("{nombre}");
    }
}
```

Résultat :

```text
1
2
4
5
6
```

---

## 9. Utiliser `break`

Le mot-clé `break` interrompt immédiatement la boucle.  
La boucle s’arrête ici lorsque la valeur atteint `5`.

```rust
fn main() {
    let mut nombre = 1;

    while nombre <= 10 {
        if nombre == 5 {
            break;
        }

        println!("{nombre}");

        nombre += 1;
    }
}
```

Résultat :

```text
1
2
3
4
```

---

## 10. Utiliser `while let`

La syntaxe `while let` exécute la boucle tant qu’un motif correspond.  
La méthode `pop()` retire ici les éléments du vecteur depuis la fin.

```rust
fn main() {
    let mut nombres = vec![10, 20, 30, 40];

    while let Some(nombre) = nombres.pop() {
        println!("{nombre}");
    }

    println!("Vecteur vide : {}", nombres.is_empty());
}
```

Résultat :

```text
40
30
20
10
Vecteur vide : true
```

---

# Points essentiels

- `while` exécute une boucle tant que sa condition vaut `true` ;
- les variables modifiées doivent être déclarées avec `mut` ;
- la condition est vérifiée avant chaque itération ;
- une mauvaise gestion de la condition peut provoquer une boucle infinie ;
- `continue` passe à l’itération suivante ;
- `break` interrompt complètement la boucle ;
- `while let` permet de boucler tant qu’un motif correspond ;
- `for` est généralement préférable pour parcourir directement une collection ;
- `while` est utile lorsque le nombre d’itérations n’est pas connu à l’avance.
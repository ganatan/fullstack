# Utilisation de la boucle `loop` en Rust

La boucle `loop` exécute un bloc de code indéfiniment.  
Elle doit généralement être arrêtée avec `break` ou quitter la fonction avec `return`.

Chaque exemple peut être utilisé directement dans le fichier `src/main.rs`.

Exécution :

```bash
cargo run
```

---

## 1. Créer une boucle simple

La boucle `loop` recommence automatiquement après chaque exécution du bloc.  
Le mot-clé `break` permet ici de l’arrêter après cinq passages.

```rust
fn main() {
    let mut nombre = 1;

    loop {
        println!("{nombre}");

        nombre += 1;

        if nombre > 5 {
            break;
        }
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

## 2. Effectuer un compte à rebours

Une variable mutable est diminuée à chaque itération.  
La boucle s’arrête lorsque la valeur atteint zéro.

```rust
fn main() {
    let mut nombre = 5;

    loop {
        println!("{nombre}");

        nombre -= 1;

        if nombre == 0 {
            break;
        }
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

## 3. Retourner une valeur avec `break`

Une boucle `loop` est une expression pouvant retourner une valeur.  
La valeur est placée directement après le mot-clé `break`.

```rust
fn main() {
    let mut nombre = 0;

    let resultat = loop {
        nombre += 1;

        if nombre == 5 {
            break nombre * 10;
        }
    };

    println!("Résultat : {resultat}");
}
```

Résultat :

```text
Résultat : 50
```

---

## 4. Utiliser `continue`

Le mot-clé `continue` ignore la suite de l’itération courante.  
La boucle reprend immédiatement depuis son commencement.

```rust
fn main() {
    let mut nombre = 0;

    loop {
        nombre += 1;

        if nombre == 3 {
            continue;
        }

        println!("{nombre}");

        if nombre == 5 {
            break;
        }
    }
}
```

Résultat :

```text
1
2
4
5
```

---

## 5. Afficher uniquement les nombres pairs

L’opérateur `%` permet de vérifier si un nombre est divisible par deux.  
La boucle s’arrête lorsque la valeur atteint dix.

```rust
fn main() {
    let mut nombre = 0;

    loop {
        nombre += 1;

        if nombre % 2 == 0 {
            println!("{nombre}");
        }

        if nombre == 10 {
            break;
        }
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

## 6. Parcourir un tableau avec un index

Une boucle `loop` peut parcourir un tableau en utilisant un index.  
La condition protège l’accès au tableau contre un dépassement.

```rust
fn main() {
    let langages = ["Rust", "Java", "TypeScript"];
    let mut index = 0;

    loop {
        if index >= langages.len() {
            break;
        }

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

## 7. Retirer les éléments d’un vecteur

La méthode `pop()` retire le dernier élément d’un vecteur.  
La boucle s’arrête lorsque le vecteur ne contient plus aucun élément.

```rust
fn main() {
    let mut nombres = vec![10, 20, 30, 40];

    loop {
        match nombres.pop() {
            Some(nombre) => println!("{nombre}"),
            None => break,
        }
    }
}
```

Résultat :

```text
40
30
20
10
```

---

## 8. Utiliser plusieurs boucles avec des labels

Un label permet de nommer une boucle avec la syntaxe `'nom:`.  
Il permet de quitter une boucle extérieure depuis une boucle intérieure.

```rust
fn main() {
    let mut ligne = 1;

    'exterieur: loop {
        let mut colonne = 1;

        loop {
            println!("Ligne {ligne}, colonne {colonne}");

            if ligne == 2 && colonne == 2 {
                break 'exterieur;
            }

            colonne += 1;

            if colonne > 3 {
                break;
            }
        }

        ligne += 1;
    }
}
```

Résultat :

```text
Ligne 1, colonne 1
Ligne 1, colonne 2
Ligne 1, colonne 3
Ligne 2, colonne 1
Ligne 2, colonne 2
```

---

## 9. Retourner une valeur depuis une boucle nommée

Une boucle nommée peut retourner une valeur avec `break 'label valeur`.  
Cette syntaxe permet de récupérer un résultat depuis une boucle imbriquée.

```rust
fn main() {
    let mut ligne = 0;

    let resultat = 'recherche: loop {
        ligne += 1;

        let mut colonne = 0;

        loop {
            colonne += 1;

            if ligne == 3 && colonne == 2 {
                break 'recherche (ligne, colonne);
            }
        }
    };

    println!("Trouvé à la position : {resultat:?}");
}
```

Résultat :

```text
Trouvé à la position : (3, 2)
```

---

## 10. Quitter une boucle avec `return`

Le mot-clé `return` quitte immédiatement la fonction complète.  
Contrairement à `break`, il ne quitte pas uniquement la boucle.

```rust
fn rechercher_nombre(nombres: &[i32], valeur: i32) {
    let mut index = 0;

    loop {
        if index >= nombres.len() {
            println!("Valeur introuvable");

            return;
        }

        if nombres[index] == valeur {
            println!("Valeur trouvée à l'index {index}");

            return;
        }

        index += 1;
    }
}

fn main() {
    let nombres = [10, 20, 30, 40];

    rechercher_nombre(&nombres, 30);
}
```

Résultat :

```text
Valeur trouvée à l'index 2
```

---

# Différences entre les boucles

## Boucle `for`

La boucle `for` est principalement utilisée pour parcourir une collection ou une plage.

```rust
for nombre in 1..=5 {
    println!("{nombre}");
}
```

## Boucle `while`

La boucle `while` s’exécute tant qu’une condition reste vraie.

```rust
let mut nombre = 1;

while nombre <= 5 {
    println!("{nombre}");

    nombre += 1;
}
```

## Boucle `loop`

La boucle `loop` s’exécute sans condition initiale.  
Elle doit généralement être arrêtée explicitement avec `break`.

```rust
let mut nombre = 1;

loop {
    println!("{nombre}");

    nombre += 1;

    if nombre > 5 {
        break;
    }
}
```

---

# Points essentiels

- `loop` crée une boucle potentiellement infinie ;
- `break` arrête la boucle ;
- `continue` passe directement à l’itération suivante ;
- `break valeur` permet de retourner une valeur depuis une boucle ;
- `return` quitte entièrement la fonction ;
- une boucle peut être nommée avec un label comme `'exterieur:` ;
- `break 'exterieur` permet de quitter une boucle extérieure ;
- `loop` est utile lorsque le nombre d’itérations est inconnu ;
- `for` est généralement préférable pour parcourir une collection ;
- `while` est généralement préférable lorsqu’une condition contrôle directement la boucle.
# Manipulation des chaînes de caractères en Rust

Rust utilise principalement deux types pour manipuler du texte :

- `&str` : référence vers une chaîne de caractères ;
- `String` : chaîne possédée, dynamique et modifiable.

Chaque exemple peut être copié directement dans le fichier `src/main.rs`, puis exécuté avec :

```bash
cargo run
```

---

## 1. Créer une chaîne avec `&str`

Le type `&str` représente une référence vers une chaîne de caractères.  
Une chaîne littérale écrite directement dans le code est généralement de type `&str`.

```rust
fn main() {
    let message: &str = "Bonjour Rust";

    println!("{message}");
}
```

---

## 2. Créer une chaîne avec `String`

Le type `String` représente une chaîne possédée et modifiable.  
La méthode `String::from()` crée une nouvelle chaîne dynamique.

```rust
fn main() {
    let message = String::from("Bonjour Rust");

    println!("{message}");
}
```

---

## 3. Convertir un `&str` en `String`

La méthode `to_string()` transforme un `&str` en `String`.  
La nouvelle chaîne peut ensuite être modifiée.

```rust
fn main() {
    let langage: &str = "Rust";
    let langage_string: String = langage.to_string();

    println!("{langage_string}");
}
```

---

## 4. Créer une chaîne vide

La méthode `String::new()` crée une nouvelle chaîne vide.  
La variable doit être déclarée avec `mut` pour pouvoir être modifiée.

```rust
fn main() {
    let mut message = String::new();

    message.push_str("Bonjour Rust");

    println!("{message}");
}
```

---

## 5. Ajouter un caractère avec `push`

La méthode `push()` ajoute un seul caractère à la fin d’une `String`.  
Un caractère Rust est écrit entre apostrophes et possède le type `char`.

```rust
fn main() {
    let mut langage = String::from("Rus");

    langage.push('t');

    println!("{langage}");
}
```

---

## 6. Ajouter du texte avec `push_str`

La méthode `push_str()` ajoute une chaîne à la fin d’une `String`.  
Elle reçoit une référence de type `&str`.

```rust
fn main() {
    let mut message = String::from("Bonjour");

    message.push_str(" Rust");

    println!("{message}");
}
```

---

## 7. Concaténer avec l’opérateur `+`

L’opérateur `+` permet de concaténer une `String` avec un `&str`.  
La première `String` est déplacée et ne peut plus être utilisée ensuite.

```rust
fn main() {
    let debut = String::from("Bonjour");
    let fin = String::from(" Rust");

    let message = debut + &fin;

    println!("{message}");
}
```

---

## 8. Construire une chaîne avec `format!`

La macro `format!` construit une nouvelle `String`.  
Contrairement à l’opérateur `+`, elle ne déplace pas les variables utilisées.

```rust
fn main() {
    let prenom = "Alice";
    let age = 30;

    let message = format!("{prenom} a {age} ans");

    println!("{message}");
}
```

---

## 9. Calculer la longueur d’une chaîne

La méthode `len()` retourne le nombre d’octets utilisés par la chaîne.  
Pour compter les caractères Unicode, il faut utiliser `chars().count()`.

```rust
fn main() {
    let texte = "école";

    let octets = texte.len();
    let caracteres = texte.chars().count();

    println!("Octets : {octets}");
    println!("Caractères : {caracteres}");
}
```

---

## 10. Vérifier si une chaîne est vide

La méthode `is_empty()` indique si une chaîne ne contient aucun caractère.  
Elle retourne une valeur booléenne `true` ou `false`.

```rust
fn main() {
    let texte = String::new();

    println!("Chaîne vide : {}", texte.is_empty());
}
```

---

## 11. Rechercher du texte avec `contains`

La méthode `contains()` vérifie si une chaîne contient une sous-chaîne.  
Elle retourne `true` lorsque le texte recherché est trouvé.

```rust
fn main() {
    let texte = "Rust est un langage système";

    let contient_rust = texte.contains("Rust");
    let contient_java = texte.contains("Java");

    println!("Contient Rust : {contient_rust}");
    println!("Contient Java : {contient_java}");
}
```

---

## 12. Vérifier le début et la fin d’une chaîne

La méthode `starts_with()` vérifie le début d’une chaîne.  
La méthode `ends_with()` vérifie sa terminaison.

```rust
fn main() {
    let fichier = "document.txt";

    let commence_correctement = fichier.starts_with("document");
    let extension_correcte = fichier.ends_with(".txt");

    println!("Début correct : {commence_correctement}");
    println!("Extension correcte : {extension_correcte}");
}
```

---

## 13. Remplacer une partie d’une chaîne

La méthode `replace()` remplace toutes les occurrences trouvées.  
Elle retourne une nouvelle `String` sans modifier la chaîne originale.

```rust
fn main() {
    let texte = "J'apprends Java";
    let nouveau_texte = texte.replace("Java", "Rust");

    println!("Avant : {texte}");
    println!("Après : {nouveau_texte}");
}
```

---

## 14. Supprimer les espaces inutiles avec `trim`

La méthode `trim()` retire les espaces au début et à la fin d’une chaîne.  
Elle ne supprime pas les espaces situés entre les mots.

```rust
fn main() {
    let texte = "   Bonjour Rust   ";
    let texte_nettoye = texte.trim();

    println!("Avant : '{texte}'");
    println!("Après : '{texte_nettoye}'");
}
```

---

## 15. Convertir en majuscules et minuscules

La méthode `to_uppercase()` retourne une nouvelle chaîne en majuscules.  
La méthode `to_lowercase()` retourne une nouvelle chaîne en minuscules.

```rust
fn main() {
    let texte = "Bonjour Rust";

    let majuscules = texte.to_uppercase();
    let minuscules = texte.to_lowercase();

    println!("Majuscules : {majuscules}");
    println!("Minuscules : {minuscules}");
}
```

---

## 16. Découper une chaîne avec `split`

La méthode `split()` découpe une chaîne selon un séparateur.  
Elle retourne un itérateur pouvant être parcouru avec une boucle.

```rust
fn main() {
    let technologies = "Rust,Angular,Node.js";

    for technologie in technologies.split(',') {
        println!("{technologie}");
    }
}
```

---

## 17. Découper une phrase en mots

La méthode `split_whitespace()` découpe une chaîne selon les espaces.  
Elle gère également les tabulations et les espaces multiples.

```rust
fn main() {
    let phrase = "Rust est un langage rapide";

    for mot in phrase.split_whitespace() {
        println!("{mot}");
    }
}
```

---

## 18. Regrouper plusieurs chaînes avec `join`

La méthode `join()` assemble plusieurs chaînes avec un séparateur.  
Elle retourne une nouvelle valeur de type `String`.

```rust
fn main() {
    let mots = ["Rust", "est", "rapide"];
    let phrase = mots.join(" ");

    println!("{phrase}");
}
```

---

## 19. Parcourir les caractères avec `chars`

La méthode `chars()` retourne les caractères Unicode de la chaîne.  
Elle permet de parcourir correctement les caractères accentués.

```rust
fn main() {
    let texte = "école";

    for caractere in texte.chars() {
        println!("{caractere}");
    }
}
```

---

## 20. Convertir une chaîne en nombre avec `parse`

La méthode `parse()` tente de convertir une chaîne vers un type donné.  
Elle retourne un `Result` contenant la valeur convertie ou une erreur.

```rust
fn main() {
    let texte = "42";
    let resultat = texte.parse::<i32>();

    match resultat {
        Ok(nombre) => println!("Nombre : {nombre}"),
        Err(erreur) => println!("Erreur : {erreur}"),
    }
}
```

---

## 21. Insérer un caractère avec `insert`

La méthode `insert()` ajoute un caractère à une position précise.  
La position correspond à un indice d’octet valide dans la chaîne UTF-8.

```rust
fn main() {
    let mut texte = String::from("Bonjour Rust");

    texte.insert(7, ',');

    println!("{texte}");
}
```

---

## 22. Supprimer un caractère avec `remove`

La méthode `remove()` supprime le caractère situé à une position précise.  
Elle retourne le caractère qui a été retiré.

```rust
fn main() {
    let mut texte = String::from("Bonjour, Rust");

    let caractere = texte.remove(7);

    println!("Caractère retiré : {caractere}");
    println!("Résultat : {texte}");
}
```

---

## 23. Vider complètement une chaîne avec `clear`

La méthode `clear()` supprime tout le contenu d’une `String`.  
La variable existe toujours, mais elle devient vide.

```rust
fn main() {
    let mut texte = String::from("Bonjour Rust");

    texte.clear();

    println!("Contenu : '{texte}'");
    println!("Chaîne vide : {}", texte.is_empty());
}
```

---

## 24. Extraire une partie d’une chaîne avec `get`

La méthode `get()` extrait une partie d’une chaîne selon une plage d’octets.  
Elle retourne `None` lorsque les indices ne sont pas valides en UTF-8.

```rust
fn main() {
    let texte = "Bonjour Rust";

    match texte.get(0..7) {
        Some(extrait) => println!("Extrait : {extrait}"),
        None => println!("Découpage invalide"),
    }
}
```

---

## 25. Extraire plusieurs caractères Unicode

La méthode `chars()` permet d’extraire des caractères sans manipuler les octets.  
La méthode `take()` limite le nombre de caractères récupérés.

```rust
fn main() {
    let texte = "école";
    let extrait: String = texte.chars().take(2).collect();

    println!("{extrait}");
}
```

---

# Points essentiels

- `&str` représente une référence vers une chaîne ;
- `String` représente une chaîne possédée et modifiable ;
- `len()` retourne un nombre d’octets ;
- `chars().count()` retourne un nombre de caractères Unicode ;
- une `String` doit être déclarée avec `mut` pour être modifiée ;
- Rust n’autorise pas l’accès direct avec une syntaxe comme `texte[0]` ;
- les chaînes Rust utilisent l’encodage UTF-8.
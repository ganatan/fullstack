Analyse les trois captures JMeter suivantes.

* Image 1 : backend Rust compilé en `release`
* Image 2 : backend Rust lancé avec `cargo run`
* Image 3 : backend Python
* Même endpoint : `GET /persons`
* Même base PostgreSQL
* Même configuration JMeter

Conditions du benchmark :

```text
Threads / Users : 100
Ramp-up : 0 seconde
Loop Count : Infinite
Duration : 60 secondes
Timer : aucun
KeepAlive : activé
Action en cas d'erreur : Continue
```

Backends :

```text
Rust Release
Axum
Tokio
SQLx
PostgreSQL
cargo build --release
```

```text
Rust Debug
Axum
Tokio
SQLx
PostgreSQL
cargo run
```

```text
Python
FastAPI
Uvicorn
asyncpg
PostgreSQL
```

Je veux une analyse courte, claire et accessible à un lecteur non expert.

## Conditions du benchmark

Présente un tableau :

```text
Paramètre | Valeur | Explication simple
```

Explique brièvement :

* Threads / Users
* Ramp-up
* Loop Count
* Duration
* Timer
* KeepAlive

## Backends testés

Présente rapidement :

### Rust Release

```text
Axum
Tokio
SQLx
PostgreSQL
cargo build --release
```

Précise que cette version est compilée avec les optimisations Rust.

### Rust Debug

```text
Axum
Tokio
SQLx
PostgreSQL
cargo run
```

Précise qu'il s'agit du profil de développement.

### Python

```text
FastAPI
Uvicorn
asyncpg
PostgreSQL
```

Ajoute une phrase simple sur chaque technologie.

## Résultats

Lis précisément les trois captures et crée un tableau :

```text
Mesure | Rust Release | Rust Debug | Python | Explication
```

Inclure :

* Samples
* Throughput
* Average
* Min
* Max
* Std. Dev.
* Error %

Explications simples :

```text
Samples : nombre total de requêtes
Throughput : requêtes traitées par seconde
Average : temps moyen de réponse
Max : réponse la plus lente
Std. Dev. : régularité des temps de réponse
Error % : pourcentage d'erreurs
```

## Comparaison

Compare principalement :

1. Rust Release vs Rust Debug
2. Rust Release vs Python

Calcule uniquement les écarts utiles :

```text
Rust Release traite X fois plus de requêtes par seconde que Rust Debug.
Rust Release traite X fois plus de requêtes par seconde que Python.
Python répond X fois plus lentement en moyenne que Rust Release.
```

Signale clairement si un résultat paraît incohérent ou inhabituel.

## Conclusion

Termine par une synthèse très lisible :

```text
Rust Release
X req/s
X ms
X % erreur

Rust Debug
X req/s
X ms
X % erreur

Python
X req/s
X ms
X % erreur
```

Puis une conclusion courte :

```text
Sur ce benchmark précis, Rust Release est environ X fois plus performant en débit que Python.
```

Ne généralise pas à Rust ou Python dans l'absolu.

La conclusion concerne uniquement :

* ces implémentations ;
* leur configuration actuelle ;
* ce scénario JMeter ;
* cette machine ;
* cette base PostgreSQL.

Reste concis : peu de texte, tableaux lisibles, chiffres faciles à comparer.

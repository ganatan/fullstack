Analyse les trois fichiers de benchmark oha suivants.

- Fichier 1 : rust-release.json
  Backend Rust compilé avec cargo build --release

- Fichier 2 : rust-debug.json
  Backend Rust lancé avec cargo run

- Fichier 3 : python.json
  Backend Python lancé avec python -m src.main

Les trois tests utilisent :

Endpoint : GET http://localhost:3000/persons
Connections : 100
Duration : 60 secondes
KeepAlive : activé
Rate limit : aucune
Même machine
Même base PostgreSQL
Même jeu de données
Même version de oha

Je veux une analyse courte, claire et accessible à un lecteur non expert.

## Conditions du benchmark

Présente un tableau :

Paramètre | Valeur | Explication simple

## Backends testés

Présente rapidement :

Rust Release
- Axum
- Tokio
- SQLx
- PostgreSQL
- cargo build --release

Rust Debug
- Axum
- Tokio
- SQLx
- PostgreSQL
- cargo run

Python
- FastAPI
- Uvicorn
- asyncpg
- PostgreSQL

## Résultats

Lis directement les valeurs présentes dans les trois fichiers JSON.

Crée un tableau :

Mesure | Rust Release | Rust Debug | Python | Explication

Utilise notamment, si présents dans les fichiers :

- Total requests
- Requests/sec
- Average
- Fastest
- Slowest
- P50
- P90
- P95
- P99
- Success rate
- Status codes

Explique simplement :

Requests/sec : nombre de requêtes traitées par seconde
Average : temps moyen de réponse
Fastest : réponse la plus rapide
Slowest : réponse la plus lente
P95 : 95 % des requêtes répondent sous cette valeur
P99 : 99 % des requêtes répondent sous cette valeur
Success rate : pourcentage de requêtes réussies

## Comparaison

Compare principalement :

1. Rust Release vs Rust Debug
2. Rust Release vs Python

Calcule uniquement les écarts utiles.

Exemples :

Rust Release traite X fois plus de requêtes par seconde que Rust Debug.

Rust Release traite X fois plus de requêtes par seconde que Python.

Python répond X fois plus lentement en moyenne que Rust Release.

## Conclusion

Termine par :

Rust Release
X req/s
X ms moyen
X % succès

Rust Debug
X req/s
X ms moyen
X % succès

Python
X req/s
X ms moyen
X % succès

Puis une conclusion courte :

Sur ce benchmark précis, Rust Release est environ X fois plus performant en débit que Python.

Ne généralise pas à Rust ou Python dans l'absolu.

La conclusion concerne uniquement :
- ces implémentations ;
- leur configuration actuelle ;
- ce scénario oha ;
- cette machine ;
- cette base PostgreSQL.

Reste concis, avec des tableaux et des chiffres faciles à comparer.
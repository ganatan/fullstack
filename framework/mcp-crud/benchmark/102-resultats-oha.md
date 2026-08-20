# Benchmark Rust Release vs Rust Debug vs Python avec oha

Comparaison des performances de trois backends utilisant le même endpoint REST et la même base PostgreSQL.

---

## Conditions du benchmark

| Paramètre       |         Valeur | Explication simple                                  |
| --------------- | -------------: | --------------------------------------------------- |
| Endpoint        | `GET /persons` | Même requête pour les trois tests                   |
| Connexions      |        **100** | 100 connexions peuvent être utilisées simultanément |
| Durée           |       **60 s** | Charge continue pendant 1 minute                    |
| KeepAlive       |         Activé | Les connexions HTTP sont réutilisées                |
| Rate limit      |          Aucun | `oha` envoie les requêtes aussi vite que possible   |
| Base de données |     PostgreSQL | Même base et mêmes données                          |
| Machine         |      Identique | Même environnement matériel                         |

## Les trois fichiers correspondent bien à environ 60 secondes de test.

## Backends testés

### Rust Release

```text
Axum
Tokio
SQLx
PostgreSQL
cargo build --release
```

Version Rust compilée avec les optimisations `release`.

### Rust Debug

```text
Axum
Tokio
SQLx
PostgreSQL
cargo run
```

Version utilisée principalement pour le développement.

### Python

```text
FastAPI
Uvicorn
asyncpg
PostgreSQL
```

FastAPI fournit l'API, Uvicorn exécute le serveur et `asyncpg` gère les accès PostgreSQL.

---

## Résultats

| Mesure             | Rust Release | Rust Debug |      Python | Explication                                   |
| ------------------ | -----------: | ---------: | ----------: | --------------------------------------------- |
| **Total requests** |  **823 804** |    366 820 |      24 496 | Nombre total de requêtes terminées            |
| **Requests/sec**   |   **13 727** |      6 112 |         407 | Requêtes traitées chaque seconde              |
| **Average**        |  **7,28 ms** |   16,36 ms |   245,30 ms | Temps moyen de réponse                        |
| **Fastest**        |  **0,45 ms** |    7,89 ms |    11,42 ms | Réponse la plus rapide                        |
| **Slowest**        | **61,39 ms** |  172,67 ms | 1 090,53 ms | Réponse la plus lente                         |
| **P50**            |  **7,06 ms** |   16,11 ms |   238,69 ms | 50 % des requêtes répondent sous cette valeur |
| **P90**            |  **8,10 ms** |   18,75 ms |   311,51 ms | 90 % des requêtes répondent sous cette valeur |
| **P95**            |  **8,58 ms** |   19,83 ms |   337,92 ms | 95 % des requêtes répondent sous cette valeur |
| **P99**            | **12,89 ms** |   23,21 ms |   408,23 ms | 99 % des requêtes répondent sous cette valeur |
| **Success rate**   |    **100 %** |  **100 %** |   **100 %** | Toutes les requêtes réussissent               |
| **HTTP 200**       |      823 804 |    366 820 |      24 496 | Toutes les réponses HTTP sont correctes       |

Rust Release atteint **13 727 req/s avec 7,28 ms de moyenne**.
Rust Debug atteint **6 112 req/s avec 16,36 ms de moyenne**.
Python atteint **407 req/s avec 245,30 ms de moyenne**.

## Les trois backends affichent un taux de réussite de **100 %**, sans erreur, uniquement des réponses HTTP `200`.

## Comparaison

### Rust Release vs Rust Debug

```text
Rust Release : 13 727 req/s
Rust Debug   :  6 112 req/s
```

**Rust Release traite environ 2,25 fois plus de requêtes par seconde.**

Temps moyen :

```text
Rust Release :  7,28 ms
Rust Debug   : 16,36 ms
```

La version `release` répond donc nettement plus rapidement.

---

### Rust Release vs Python

```text
Rust Release : 13 727 req/s
Python       :    407 req/s
```

**Rust Release traite environ 33,7 fois plus de requêtes par seconde.**

Temps moyen :

```text
Rust Release :   7,28 ms
Python       : 245,30 ms
```

Python répond ici environ **33,7 fois plus lentement en moyenne**.

Le P95 montre également un écart important :

```text
Rust Release :   8,58 ms
Python       : 337,92 ms
```

---

## Conclusion

```text
Rust Release
13 727 req/s
7,28 ms moyen
100 % succès

Rust Debug
6 112 req/s
16,36 ms moyen
100 % succès

Python
407 req/s
245,30 ms moyen
100 % succès
```

### Impact du mode Release

**Rust Release est environ 2,25 fois plus performant en débit que Rust Debug.**

### Comparaison finale

**Sur ce benchmark précis, Rust Release atteint environ 33,7 fois le débit du backend Python, avec un temps moyen également environ 34 fois plus faible.**

Ces résultats concernent uniquement :

* ces implémentations ;
* leurs configurations actuelles ;
* ce scénario `oha` ;
* cette machine ;
* cette base PostgreSQL.

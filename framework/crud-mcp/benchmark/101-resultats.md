# Benchmark Rust vs Python avec JMeter

Comparaison des performances de deux backends utilisant la même API REST et la même base de données PostgreSQL.

---

## Conditions du benchmark

Le même scénario JMeter est utilisé pour les deux backends.

| Paramètre               |                          Valeur |
| ----------------------- | ------------------------------: |
| Endpoint                |                  `GET /persons` |
| URL                     | `http://localhost:3000/persons` |
| Utilisateurs simultanés |                         **100** |
| Ramp-up                 |                   **0 seconde** |
| Loop Count              |                    **Infinite** |
| Durée                   |                 **60 secondes** |
| Timer                   |                       **Aucun** |
| KeepAlive               |                      **Activé** |
| Base de données         |                  **PostgreSQL** |
| Action en cas d'erreur  |                      `Continue` |

Le principe du test est simple :

```text
100 utilisateurs
        ↓
GET /persons
        ↓
nouvelle requête immédiatement
        ↓
GET /persons
        ↓
...
        ↓
pendant 60 secondes
```

Chaque utilisateur exécute donc continuellement la requête pendant toute la durée du benchmark.

L'objectif est de soumettre les deux backends à exactement la même charge et de mesurer leur capacité à répondre.

---

## Backends testés

### Rust

```text
Axum
Tokio
SQLx
PostgreSQL
```

Architecture :

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
PostgreSQL
```

---

### Python

```text
FastAPI
Uvicorn
asyncpg
PostgreSQL
```

Architecture :

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
PostgreSQL
```

---

## Résultats

| Mesure            |            Rust |    Python |
| ----------------- | --------------: | --------: |
| Requêtes traitées |     **374 167** |    25 535 |
| Débit             | **6 233 req/s** | 424 req/s |
| Temps moyen       |       **13 ms** |    196 ms |
| Temps minimum     |        **0 ms** |      1 ms |
| Temps maximum     |      **141 ms** |    683 ms |
| Écart-type        |     **4,63 ms** |  78,69 ms |
| Erreurs           |         **0 %** |   **0 %** |

---

## Lecture des résultats

### Rust

```text
374 167 requêtes traitées

6 233 requêtes / seconde

13 ms de temps de réponse moyen

141 ms de temps de réponse maximum

0 % d'erreur
```

### Python

```text
25 535 requêtes traitées

424 requêtes / seconde

196 ms de temps de réponse moyen

683 ms de temps de réponse maximum

0 % d'erreur
```

---

## Comparaison

### Débit

Rust :

```text
6 233 req/s
```

Python :

```text
424 req/s
```

Rust traite donc environ :

```text
14,7 fois plus de requêtes par seconde
```

---

### Temps de réponse moyen

Rust :

```text
13 ms
```

Python :

```text
196 ms
```

Le temps de réponse moyen de Python est environ :

```text
15 fois supérieur
```

---

### Stabilité

Écart-type Rust :

```text
4,63 ms
```

Écart-type Python :

```text
78,69 ms
```

Rust produit donc des temps de réponse beaucoup plus réguliers pendant le benchmark.

---

### Erreurs

Rust :

```text
0 %
```

Python :

```text
0 %
```

Les deux backends ont correctement supporté la charge sans générer d'erreur HTTP.

---

## Conclusion

Les deux backends terminent le benchmark avec :

```text
0 % d'erreur
```

La différence apparaît principalement au niveau des performances.

Rust traite environ :

```text
15 fois plus de requêtes par seconde
```

et répond environ :

```text
15 fois plus rapidement en moyenne
```

que Python dans ce scénario.

### Résultat global

```text
Rust
6 233 req/s
13 ms

Python
424 req/s
196 ms
```

**Sur ce benchmark précis, le backend Rust est environ 15 fois plus performant que le backend Python.**

Ce résultat concerne uniquement les deux implémentations testées, leur configuration actuelle et ce scénario JMeter précis.

# Benchmark Rust Release vs Rust Debug vs Python avec JMeter

Comparaison des performances de trois backends utilisant le même endpoint REST et la même base de données PostgreSQL.

---

## Conditions du benchmark

Les trois backends sont soumis exactement au même scénario.

| Paramètre           |         Valeur | Explication simple                           |
| ------------------- | -------------: | -------------------------------------------- |
| **Threads / Users** |            100 | 100 utilisateurs virtuels sollicitent l'API  |
| **Ramp-up**         |            0 s | Les 100 utilisateurs démarrent immédiatement |
| **Loop Count**      |       Infinite | Les requêtes sont répétées sans limite       |
| **Duration**        |           60 s | Le test dure une minute                      |
| **Timer**           |          Aucun | Aucune pause entre deux requêtes             |
| **KeepAlive**       |         Activé | Les connexions HTTP sont réutilisées         |
| **Endpoint**        | `GET /persons` | Même opération pour les trois tests          |
| **Database**        |     PostgreSQL | Même base de données                         |

En pratique :

```text
100 utilisateurs
      ↓
GET /persons en continu
      ↓
pendant 60 secondes
```

---

## Backends testés

### Rust Release

```text
Axum
Tokio
SQLx
PostgreSQL
cargo build --release
```

Version Rust compilée avec les optimisations du profil `release`.

### Rust Debug

```text
Axum
Tokio
SQLx
PostgreSQL
cargo run
```

Version de développement, utilisée principalement pendant le codage et le débogage.

### Python

```text
FastAPI
Uvicorn
asyncpg
PostgreSQL
```

FastAPI fournit l'API HTTP, Uvicorn exécute le serveur et `asyncpg` assure les accès PostgreSQL asynchrones.

---

## Résultats

| Mesure         |       Rust Release |    Rust Debug |      Python | Explication                       |
| -------------- | -----------------: | ------------: | ----------: | --------------------------------- |
| **Samples**    |        **754 772** |       351 280 |      24 464 | Requêtes traitées pendant le test |
| **Throughput** | **12 575,8 req/s** | 5 852,1 req/s | 406,7 req/s | Requêtes traitées par seconde     |
| **Average**    |           **6 ms** |         14 ms |      205 ms | Temps moyen de réponse            |
| **Min**        |               0 ms |          0 ms |        1 ms | Réponse la plus rapide            |
| **Max**        |          **48 ms** |        134 ms |      552 ms | Réponse la plus lente             |
| **Std. Dev.**  |        **2,75 ms** |       5,07 ms |    74,26 ms | Variation des temps de réponse    |
| **Error %**    |            **0 %** |       **0 %** |     **0 %** | Requêtes ayant échoué             |

Les `Samples` et les `Throughput` sont cohérents avec une durée d'environ 60 secondes pour les trois tests.

---

## Comparaison

### Rust Release vs Rust Debug

```text
Rust Release : 12 575,8 req/s
Rust Debug   :  5 852,1 req/s
```

**Rust Release traite environ 2,15 fois plus de requêtes par seconde.**

Le temps moyen passe également de :

```text
14 ms → 6 ms
```

La compilation `release` apporte donc ici un gain très net.

---

### Rust Release vs Python

```text
Rust Release : 12 575,8 req/s
Python       :    406,7 req/s
```

**Rust Release traite environ 31 fois plus de requêtes par seconde.**

Pour le temps moyen :

```text
Rust Release :   6 ms
Python       : 205 ms
```

Python répond ici environ **34 fois plus lentement en moyenne**.

Les trois tests restent néanmoins à :

```text
0 % d'erreur
```

---

## Conclusion

```text
Rust Release
12 575,8 req/s
6 ms
0 % erreur

Rust Debug
5 852,1 req/s
14 ms
0 % erreur

Python
406,7 req/s
205 ms
0 % erreur
```

### Impact du mode Release

**Rust Release est environ 2,15 fois plus performant en débit que Rust lancé avec `cargo run`.**

### Comparaison finale

**Sur ce benchmark précis, Rust Release atteint environ 31 fois le débit du backend Python.**

Le résultat concerne uniquement :

* ces implémentations ;
* leurs configurations actuelles ;
* ce scénario JMeter ;
* cette machine ;
* cette base PostgreSQL.

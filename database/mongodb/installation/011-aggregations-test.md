# MongoDB Compass — Premiers tests d’agrégation sur la collection `Declencheur`

## Objectif

Faire les premiers tests d’agrégation dans **MongoDB Compass** sur la collection :

- base : `local`
- collection : `Declencheur`

L’objectif est de comprendre concrètement :
- comment ajouter un stage
- comment lancer un pipeline
- comment lire le résultat
- comment manipuler un tableau comme `services`

---

# 1) Préparation

Dans MongoDB Compass :

- ouvrir la connexion `localhost:27017`
- ouvrir la base `local`
- cliquer sur la collection `Declencheur`
- cliquer sur l’onglet **Aggregations**

Tu arrives sur un écran avec :
- un bouton **Add stage**
- un bouton **Run**
- un aperçu des documents

---

# 2) Principe d’une agrégation

Une agrégation MongoDB est un **pipeline**.

Un pipeline est une suite d’étapes.
Chaque étape transforme le résultat de l’étape précédente.

Exemple simple :

```text
documents d’origine
-> stage 1
-> stage 2
-> stage 3
-> résultat final
```

Dans Compass :
- tu ajoutes une étape avec **Add stage**
- tu choisis un type de stage
- tu colles la configuration
- tu cliques sur **Run**

---

# 3) Structure de la collection

D’après tes documents, tu as des champs du type :

- `_id`
- `code`
- `libelleCourt`
- `libelleLong`
- `services`
- `codeCr`
- `dateDebutValidite`

Le champ important ici est :

```text
services
```

car c’est un **tableau**.

Exemple :
- premier document : `services` contient 1 élément
- second document : `services` contient 2 éléments

C’est parfait pour apprendre :
- `$project`
- `$size`
- `$unwind`
- `$group`
- `$sort`

---

# 4) Test 1 — Afficher seulement quelques champs

## But

Afficher uniquement :
- `code`
- `libelleCourt`
- `codeCr`

sans afficher `_id`.

## Étapes dans Compass

- cliquer sur **Add stage**
- choisir le stage **`$project`**
- coller ceci :

```javascript
{
  _id: 0,
  code: 1,
  libelleCourt: 1,
  codeCr: 1
}
```

- cliquer sur **Run**

## Explication

`$project` sert à choisir les champs à afficher.

Dans ce pipeline :

- `_id: 0` = on masque `_id`
- `code: 1` = on garde `code`
- `libelleCourt: 1` = on garde `libelleCourt`
- `codeCr: 1` = on garde `codeCr`

## Résultat attendu

Chaque document affichera seulement :

- `code`
- `libelleCourt`
- `codeCr`

---

# 5) Test 2 — Calculer le nombre de services par document

## But

Afficher pour chaque document :
- son `code`
- le nombre d’éléments dans `services`

## Étapes dans Compass

- cliquer sur **Create New** pour repartir de zéro
- cliquer sur **Add stage**
- choisir **`$project`**
- coller ceci :

```javascript
{
  _id: 0,
  code: 1,
  nbServices: { $size: "$services" }
}
```

- cliquer sur **Run**

## Explication

Ici :

- `code: 1` garde le code
- `nbServices` est un nouveau champ calculé
- `$size: "$services"` compte le nombre d’éléments dans le tableau `services`

## Résultat attendu

Tu devrais obtenir quelque chose du genre :

```json
[
  {
    "code": "DEC00002BBBB",
    "nbServices": 1
  },
  {
    "code": "DEC00003CCCC",
    "nbServices": 2
  }
]
```

## Ce que tu apprends

- `$project` ne sert pas seulement à afficher
- il peut aussi créer de nouveaux champs calculés

---

# 6) Test 3 — Éclater le tableau `services`

## But

Transformer chaque élément du tableau `services` en ligne séparée.

## Étapes dans Compass

- cliquer sur **Create New**
- cliquer sur **Add stage**
- choisir **`$unwind`**
- coller ceci :

```javascript
"$services"
```

- cliquer sur **Run**

## Explication

`$unwind` prend un tableau et produit un document par élément du tableau.

Exemple :

### Avant

Document 1 :
- `services = ["REC00002BBBB"]`

Document 2 :
- `services = ["REC00003CCCC", "REC00004DDDD"]`

### Après `$unwind`

Tu obtiens :
- 1 ligne pour `REC00002BBBB`
- 1 ligne pour `REC00003CCCC`
- 1 ligne pour `REC00004DDDD`

Donc 3 lignes au total.

## Résultat attendu

Le nombre total de lignes affichées devient égal au nombre total d’éléments dans tous les tableaux `services`.

---

# 7) Test 4 — Compter combien de fois chaque service apparaît

## But

Compter les occurrences de chaque valeur de `services`.

## Étapes dans Compass

### Stage 1

- cliquer sur **Create New**
- cliquer sur **Add stage**
- choisir **`$unwind`**
- coller :

```javascript
"$services"
```

### Stage 2

- cliquer sur **Add stage**
- choisir **`$group`**
- coller :

```javascript
{
  _id: "$services",
  total: { $sum: 1 }
}
```

### Stage 3

- cliquer sur **Add stage**
- choisir **`$sort`**
- coller :

```javascript
{
  total: -1
}
```

### Exécution

- cliquer sur **Run**

## Explication

### Stage 1 — `$unwind`

On transforme le tableau en lignes simples.

### Stage 2 — `$group`

On groupe par valeur de `services`.

- `_id: "$services"` = la clé de groupement est la valeur du service
- `total: { $sum: 1 }` = on ajoute 1 pour chaque ligne

### Stage 3 — `$sort`

On trie par `total` décroissant.

## Résultat attendu

Un résultat du type :

```json
[
  {
    "_id": "REC00002BBBB",
    "total": 1
  },
  {
    "_id": "REC00003CCCC",
    "total": 1
  },
  {
    "_id": "REC00004DDDD",
    "total": 1
  }
]
```

Si un même service apparaît plusieurs fois dans plusieurs documents, son total augmente.

---

# 8) Test 5 — Compter le nombre total de documents

## But

Compter combien de documents il y a dans la collection.

## Étapes dans Compass

- cliquer sur **Create New**
- cliquer sur **Add stage**
- choisir **`$count`**
- coller :

```javascript
"total"
```

- cliquer sur **Run**

## Résultat attendu

```json
[
  {
    "total": 2
  }
]
```

## Explication

`$count` crée un document de sortie contenant le nombre total de documents passés dans le pipeline.

---

# 9) Test 6 — Trier les documents par code

## But

Afficher les documents triés par `code`.

## Étapes dans Compass

- cliquer sur **Create New**
- cliquer sur **Add stage**
- choisir **`$sort`**
- coller :

```javascript
{
  code: 1
}
```

- cliquer sur **Run**

## Explication

- `1` = ordre croissant
- `-1` = ordre décroissant

---

# 10) Test 7 — Filtrer les documents à partir d’une date

## But

Garder seulement les documents dont `dateDebutValidite` est supérieure ou égale au 1er janvier 2024.

## Étapes dans Compass

- cliquer sur **Create New**
- cliquer sur **Add stage**
- choisir **`$match`**
- coller :

```javascript
{
  dateDebutValidite: {
    $gte: ISODate("2024-01-01T00:00:00.000Z")
  }
}
```

- cliquer sur **Run**

## Explication

`$match` sert à filtrer.

Ici :
- `$gte` = greater than or equal
- on garde les documents à partir de cette date

---

# 11) Test 8 — Filtrer puis projeter

## But

Garder seulement les documents à partir de 2024, puis afficher seulement certains champs.

## Étapes dans Compass

### Stage 1 — `$match`

```javascript
{
  dateDebutValidite: {
    $gte: ISODate("2024-01-01T00:00:00.000Z")
  }
}
```

### Stage 2 — `$project`

```javascript
{
  _id: 0,
  code: 1,
  libelleCourt: 1,
  dateDebutValidite: 1
}
```

### Exécution

- cliquer sur **Run**

## Ce que tu apprends

- on peut chaîner plusieurs stages
- le résultat du stage 1 devient l’entrée du stage 2

---

# 12) Test 9 — Afficher le premier service avec `$arrayElemAt`

## But

Récupérer explicitement le premier élément du tableau `services`.

## Étapes dans Compass

- cliquer sur **Create New**
- cliquer sur **Add stage**
- choisir **`$project`**
- coller :

```javascript
{
  _id: 0,
  code: 1,
  premierService: { $arrayElemAt: ["$services", 0] }
}
```

- cliquer sur **Run**

## Explication

`$arrayElemAt` permet de récupérer un élément précis dans un tableau.

Ici :
- `0` = premier élément

---

# 13) Test 10 — Afficher code + nombre de services + premier service

## But

Faire un pipeline un peu plus riche, mais encore simple.

## Étapes dans Compass

- cliquer sur **Create New**
- cliquer sur **Add stage**
- choisir **`$project`**
- coller :

```javascript
{
  _id: 0,
  code: 1,
  nbServices: { $size: "$services" },
  premierService: { $arrayElemAt: ["$services", 0] },
  codeCr: 1
}
```

- cliquer sur **Run**

## Résultat attendu

Tu obtiens pour chaque document :
- `code`
- `nbServices`
- `premierService`
- `codeCr`

---

# 14) Résumé des opérateurs utilisés

## `$project`

Permet de :
- sélectionner des champs
- masquer des champs
- calculer des champs

## `$size`

Permet de :
- compter le nombre d’éléments d’un tableau

## `$unwind`

Permet de :
- transformer un tableau en plusieurs lignes

## `$group`

Permet de :
- regrouper des documents
- compter
- sommer
- agréger

## `$sum`

Permet de :
- compter ou sommer

Exemple :
- `{ $sum: 1 }` = compter

## `$sort`

Permet de :
- trier les résultats

## `$count`

Permet de :
- compter le nombre total de documents d’un pipeline

## `$match`

Permet de :
- filtrer

## `$arrayElemAt`

Permet de :
- récupérer un élément dans un tableau

---

# 15) Ordre logique recommandé pour apprendre

Je te conseille de faire les tests dans cet ordre :

1. `$project`
2. `$size`
3. `$sort`
4. `$match`
5. `$unwind`
6. `$group`
7. pipeline multi-stages

C’est l’ordre le plus pédagogique.

---

# 16) Méthode de travail recommandée

Pour apprendre proprement :

1. partir d’un pipeline très simple
2. lancer avec **Run**
3. lire le résultat
4. modifier une seule chose à la fois
5. refaire **Run**
6. passer ensuite à un pipeline à 2 stages
7. puis à 3 stages

C’est beaucoup mieux que de vouloir faire un gros pipeline d’un coup.

---

# 17) Erreurs classiques

## 1. Oublier les guillemets sur un champ tableau

Correct :

```javascript
"$services"
```

Pas :

```javascript
services
```

## 2. Confondre document et tableau

`$size` fonctionne sur un tableau, pas sur un objet simple.

## 3. Oublier que `$unwind` multiplie les lignes

Après `$unwind`, tu n’as plus exactement la structure d’origine.

## 4. Faire un `$group` sans comprendre `_id`

Dans `$group`, `_id` représente la clé de regroupement.

Exemple :

```javascript
{
  _id: "$services",
  total: { $sum: 1 }
}
```

Ici, on groupe par service.

## 5. Oublier de cliquer sur `Run`

Compass ne relance pas toujours automatiquement comme tu l’imagines.
Cliquer sur **Run** reste le bon réflexe.

---

# 18) Ce que tu dois retenir

Sur ta collection `Declencheur`, les meilleurs premiers tests sont :

## Test A — nombre de services par document

```javascript
{
  _id: 0,
  code: 1,
  nbServices: { $size: "$services" }
}
```

## Test B — éclater le tableau

```javascript
"$services"
```

## Test C — compter les services

```javascript
{
  _id: "$services",
  total: { $sum: 1 }
}
```

C’est exactement le trio qui te fait comprendre :
- structure d’un document
- structure d’un tableau
- différence entre lecture simple et agrégation

---

# 19) Pipelines complets prêts à coller

## Pipeline 1 — projection simple

```javascript
[
  {
    $project: {
      _id: 0,
      code: 1,
      libelleCourt: 1,
      codeCr: 1
    }
  }
]
```

## Pipeline 2 — nombre de services par document

```javascript
[
  {
    $project: {
      _id: 0,
      code: 1,
      nbServices: { $size: "$services" }
    }
  }
]
```

## Pipeline 3 — éclater les services

```javascript
[
  {
    $unwind: "$services"
  }
]
```

## Pipeline 4 — compter chaque service

```javascript
[
  {
    $unwind: "$services"
  },
  {
    $group: {
      _id: "$services",
      total: { $sum: 1 }
    }
  },
  {
    $sort: {
      total: -1
    }
  }
]
```

## Pipeline 5 — compter les documents

```javascript
[
  {
    $count: "total"
  }
]
```

## Pipeline 6 — filtrer sur la date

```javascript
[
  {
    $match: {
      dateDebutValidite: {
        $gte: ISODate("2024-01-01T00:00:00.000Z")
      }
    }
  }
]
```

## Pipeline 7 — filtrer puis projeter

```javascript
[
  {
    $match: {
      dateDebutValidite: {
        $gte: ISODate("2024-01-01T00:00:00.000Z")
      }
    }
  },
  {
    $project: {
      _id: 0,
      code: 1,
      libelleCourt: 1,
      dateDebutValidite: 1
    }
  }
]
```

## Pipeline 8 — premier service + nombre de services

```javascript
[
  {
    $project: {
      _id: 0,
      code: 1,
      nbServices: { $size: "$services" },
      premierService: { $arrayElemAt: ["$services", 0] },
      codeCr: 1
    }
  }
]
```

---

# 20) Conclusion

Tu as maintenant une base très solide pour faire tes premiers tests d’agrégation dans Compass.

Sur ta collection `Declencheur`, tu peux déjà apprendre énormément avec seulement :

- `$project`
- `$size`
- `$unwind`
- `$group`
- `$sort`
- `$match`
- `$count`

La bonne méthode est simple :

- tester dans Compass
- comprendre visuellement
- valider le résultat
- ensuite seulement passer à `mongosh` ou à Spring Boot

C’est exactement la bonne façon d’apprendre MongoDB proprement.
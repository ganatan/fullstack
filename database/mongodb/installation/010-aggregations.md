# MongoDB — Agrégations

## Objectif

Comprendre en profondeur le mécanisme d’agrégation de MongoDB :
- le concept
- l’historique
- la logique d’exécution
- les principaux stages
- les cas d’usage réels
- les performances
- les pièges
- les exemples pratiques en Mongo Shell et en Spring Boot

---

# 1) Introduction

L’agrégation dans MongoDB permet de :
- transformer des documents
- filtrer
- grouper
- calculer
- trier
- enrichir
- restructurer
- joindre des collections
- produire un résultat analytique

En clair :
- `find()` sert surtout à lire des documents
- `aggregate()` sert à construire un pipeline de traitement de données

L’agrégation est l’un des points les plus puissants de MongoDB.

---

# 2) Idée générale

MongoDB traite les données via un **pipeline**.

Chaque étape du pipeline :
- reçoit des documents en entrée
- les transforme
- transmet le résultat à l’étape suivante

On parle de **pipeline d’agrégation**.

Exemple simple :

```javascript
db.declencheurs.aggregate([
  { $match: { actif: true } },
  { $group: { _id: "$actif", total: { $sum: 1 } } }
])
```

Lecture :
- on filtre les documents actifs
- on groupe
- on compte

---

# 3) Pourquoi utiliser l’agrégation

Tu utilises l’agrégation quand tu veux :
- faire des statistiques
- faire des regroupements
- calculer des sommes
- faire des moyennes
- générer un reporting
- transformer la structure d’un résultat
- simuler des jointures
- préparer une API de dashboard
- faire des traitements complexes côté base

---

# 4) Historique

## Début

Au départ, MongoDB était surtout vu comme une base documentaire simple :
- stockage JSON/BSON
- lecture rapide
- flexibilité de schéma

Les besoins analytiques ont vite émergé :
- compter
- regrouper
- trier
- sommer
- produire des tableaux de bord

## Ancienne approche : MapReduce

MongoDB a d’abord proposé :
- **MapReduce**

Mais MapReduce était :
- plus lourd
- plus lent
- plus complexe
- moins pratique

## Évolution vers le pipeline d’agrégation

MongoDB a progressivement poussé le modèle :
- `aggregate()`
- pipeline structuré
- operators spécialisés
- meilleure optimisation moteur

Aujourd’hui :
- le pipeline d’agrégation est la solution standard
- MapReduce est devenu marginal

---

# 5) Différence entre `find()` et `aggregate()`

## `find()`

Utilisé pour :
- lire des documents
- filtrer simplement
- trier
- limiter
- projeter quelques champs

Exemple :

```javascript
db.declencheurs.find({ actif: true })
```

## `aggregate()`

Utilisé pour :
- filtrer
- transformer
- calculer
- grouper
- joindre
- restructurer

Exemple :

```javascript
db.declencheurs.aggregate([
  { $match: { actif: true } },
  { $group: { _id: "$actif", total: { $sum: 1 } } }
])
```

---

# 6) Vision SQL simplifiée

MongoDB agrégation peut être vu comme l’équivalent de :

- `WHERE`
- `GROUP BY`
- `ORDER BY`
- `JOIN`
- `SELECT`
- `COUNT`
- `SUM`
- `AVG`

Correspondances approximatives :

- `$match` ≈ `WHERE`
- `$group` ≈ `GROUP BY`
- `$sort` ≈ `ORDER BY`
- `$project` ≈ `SELECT`
- `$lookup` ≈ `JOIN`

Ce n’est pas exactement SQL, mais ça aide à comprendre.

---

# 7) Structure d’un pipeline

Un pipeline est un tableau d’étapes :

```javascript
db.collection.aggregate([
  { stage1 },
  { stage2 },
  { stage3 }
])
```

Exemple :

```javascript
db.declencheurs.aggregate([
  { $match: { actif: true } },
  { $project: { code: 1, libelle: 1, _id: 0 } },
  { $sort: { code: 1 } }
])
```

---

# 8) Jeu de données d’exemple

On va utiliser une collection `declencheurs`.

```javascript
use Declencheur

db.declencheurs.insertMany([
  {
    code: "DEC001",
    libelle: "Déclencheur principal",
    actif: true,
    type: "ALERTE",
    niveau: 1,
    montant: 100,
    dateCreation: ISODate("2026-03-01T10:00:00Z")
  },
  {
    code: "DEC002",
    libelle: "Déclencheur secondaire",
    actif: false,
    type: "ALERTE",
    niveau: 2,
    montant: 250,
    dateCreation: ISODate("2026-03-02T10:00:00Z")
  },
  {
    code: "DEC003",
    libelle: "Déclencheur sécurité",
    actif: true,
    type: "SECURITE",
    niveau: 1,
    montant: 180,
    dateCreation: ISODate("2026-03-03T10:00:00Z")
  },
  {
    code: "DEC004",
    libelle: "Déclencheur supervision",
    actif: true,
    type: "SECURITE",
    niveau: 3,
    montant: 300,
    dateCreation: ISODate("2026-03-04T10:00:00Z")
  }
])
```

---

# 9) Le stage `$match`

`$match` sert à filtrer les documents.

Exemple :

```javascript
db.declencheurs.aggregate([
  { $match: { actif: true } }
])
```

Équivalent simple :
- récupérer uniquement les déclencheurs actifs

Autre exemple :

```javascript
db.declencheurs.aggregate([
  { $match: { type: "SECURITE", actif: true } }
])
```

Bon réflexe :
- placer `$match` tôt dans le pipeline pour réduire le volume traité

---

# 10) Le stage `$project`

`$project` sert à :
- choisir les champs
- renommer
- calculer de nouveaux champs
- supprimer certains champs

Exemple :

```javascript
db.declencheurs.aggregate([
  {
    $project: {
      _id: 0,
      code: 1,
      libelle: 1
    }
  }
])
```

Exemple avec renommage :

```javascript
db.declencheurs.aggregate([
  {
    $project: {
      _id: 0,
      codeDeclencheur: "$code",
      nom: "$libelle"
    }
  }
])
```

Exemple avec calcul :

```javascript
db.declencheurs.aggregate([
  {
    $project: {
      _id: 0,
      code: 1,
      montant: 1,
      montantDouble: { $multiply: ["$montant", 2] }
    }
  }
])
```

---

# 11) Le stage `$group`

`$group` sert à :
- regrouper des documents
- calculer des agrégats

Il utilise un champ `_id` qui représente la clé de groupement.

## Compter par type

```javascript
db.declencheurs.aggregate([
  {
    $group: {
      _id: "$type",
      total: { $sum: 1 }
    }
  }
])
```

Résultat attendu :
- `ALERTE` -> 2
- `SECURITE` -> 2

## Somme par type

```javascript
db.declencheurs.aggregate([
  {
    $group: {
      _id: "$type",
      montantTotal: { $sum: "$montant" }
    }
  }
])
```

## Moyenne par type

```javascript
db.declencheurs.aggregate([
  {
    $group: {
      _id: "$type",
      montantMoyen: { $avg: "$montant" }
    }
  }
])
```

## Min / Max

```javascript
db.declencheurs.aggregate([
  {
    $group: {
      _id: "$type",
      minMontant: { $min: "$montant" },
      maxMontant: { $max: "$montant" }
    }
  }
])
```

---

# 12) Accumulateurs fréquents dans `$group`

Les plus utiles :

- `$sum`
- `$avg`
- `$min`
- `$max`
- `$push`
- `$addToSet`
- `$first`
- `$last`

## Exemple avec `$push`

```javascript
db.declencheurs.aggregate([
  {
    $group: {
      _id: "$type",
      codes: { $push: "$code" }
    }
  }
])
```

Résultat :
- pour chaque type, une liste des codes

## Exemple avec `$addToSet`

```javascript
db.declencheurs.aggregate([
  {
    $group: {
      _id: "$type",
      niveaux: { $addToSet: "$niveau" }
    }
  }
])
```

Différence :
- `$push` garde les doublons
- `$addToSet` élimine les doublons

---

# 13) Le stage `$sort`

Tri ascendant :

```javascript
db.declencheurs.aggregate([
  { $sort: { code: 1 } }
])
```

Tri descendant :

```javascript
db.declencheurs.aggregate([
  { $sort: { montant: -1 } }
])
```

Après un `$group`, on trie souvent le résultat :

```javascript
db.declencheurs.aggregate([
  {
    $group: {
      _id: "$type",
      montantTotal: { $sum: "$montant" }
    }
  },
  { $sort: { montantTotal: -1 } }
])
```

---

# 14) `$limit` et `$skip`

## Limiter

```javascript
db.declencheurs.aggregate([
  { $sort: { montant: -1 } },
  { $limit: 2 }
])
```

## Sauter

```javascript
db.declencheurs.aggregate([
  { $sort: { montant: -1 } },
  { $skip: 1 },
  { $limit: 2 }
])
```

Pratique pour :
- pagination simple
- top N

---

# 15) `$unwind`

`$unwind` sert à éclater un tableau en plusieurs documents.

Exemple de données :

```javascript
db.alertes.insertMany([
  {
    code: "ALT001",
    tags: ["urgent", "infra", "prod"]
  },
  {
    code: "ALT002",
    tags: ["infra", "monitoring"]
  }
])
```

Sans `$unwind`, `tags` reste un tableau.

Avec `$unwind` :

```javascript
db.alertes.aggregate([
  { $unwind: "$tags" }
])
```

Résultat :
- un document par élément du tableau

Très utile pour :
- compter des éléments de tableau
- regrouper par valeur contenue dans un tableau

Exemple :

```javascript
db.alertes.aggregate([
  { $unwind: "$tags" },
  {
    $group: {
      _id: "$tags",
      total: { $sum: 1 }
    }
  },
  { $sort: { total: -1 } }
])
```

---

# 16) `$lookup`

`$lookup` sert à faire une jointure entre collections.

Exemple :
- collection `declencheurs`
- collection `typesDeclencheur`

Jeu de données :

```javascript
db.typesDeclencheur.insertMany([
  { codeType: "ALERTE", libelleType: "Type alerte" },
  { codeType: "SECURITE", libelleType: "Type sécurité" }
])
```

Jointure :

```javascript
db.declencheurs.aggregate([
  {
    $lookup: {
      from: "typesDeclencheur",
      localField: "type",
      foreignField: "codeType",
      as: "typeInfos"
    }
  }
])
```

Résultat :
- chaque document contient un tableau `typeInfos`

Si tu veux aplatir :

```javascript
db.declencheurs.aggregate([
  {
    $lookup: {
      from: "typesDeclencheur",
      localField: "type",
      foreignField: "codeType",
      as: "typeInfos"
    }
  },
  { $unwind: "$typeInfos" }
])
```

---

# 17) `$addFields`

`$addFields` sert à ajouter de nouveaux champs sans devoir tout reprojeter.

Exemple :

```javascript
db.declencheurs.aggregate([
  {
    $addFields: {
      montantTTC: { $multiply: ["$montant", 1.2] }
    }
  }
])
```

---

# 18) `$count`

Pour compter simplement :

```javascript
db.declencheurs.aggregate([
  { $match: { actif: true } },
  { $count: "totalActifs" }
])
```

Résultat :

```json
[
  { "totalActifs": 3 }
]
```

---

# 19) `$sortByCount`

C’est un raccourci pratique.

Exemple :

```javascript
db.declencheurs.aggregate([
  { $sortByCount: "$type" }
])
```

C’est proche de :

```javascript
db.declencheurs.aggregate([
  {
    $group: {
      _id: "$type",
      count: { $sum: 1 }
    }
  },
  { $sort: { count: -1 } }
])
```

---

# 20) `$facet`

`$facet` permet d’exécuter plusieurs sous-pipelines en parallèle sur la même entrée.

Exemple :

```javascript
db.declencheurs.aggregate([
  {
    $facet: {
      actifs: [
        { $match: { actif: true } },
        { $count: "total" }
      ],
      parType: [
        { $group: { _id: "$type", total: { $sum: 1 } } }
      ],
      topMontants: [
        { $sort: { montant: -1 } },
        { $limit: 2 }
      ]
    }
  }
])
```

Très puissant pour :
- alimenter un dashboard
- produire plusieurs vues en une requête

---

# 21) `$replaceRoot` et `$replaceWith`

Permet de remplacer complètement la structure du document courant.

Exemple plus avancé, surtout utile après un `$lookup` ou un `$group`.

---

# 22) Expressions utiles

Dans `$project`, `$addFields`, `$group`, etc., tu peux utiliser beaucoup d’expressions.

Quelques classiques :

- `$multiply`
- `$divide`
- `$add`
- `$subtract`
- `$concat`
- `$toUpper`
- `$toLower`
- `$ifNull`
- `$cond`
- `$eq`
- `$gt`
- `$lt`

## Exemple avec condition

```javascript
db.declencheurs.aggregate([
  {
    $project: {
      _id: 0,
      code: 1,
      montant: 1,
      categorie: {
        $cond: {
          if: { $gte: ["$montant", 200] },
          then: "HAUT",
          else: "BAS"
        }
      }
    }
  }
])
```

---

# 23) Agrégations sur les dates

MongoDB fournit beaucoup d’opérateurs de date.

Exemples :
- `$year`
- `$month`
- `$dayOfMonth`
- `$hour`
- `$dateToString`

## Grouper par mois

```javascript
db.declencheurs.aggregate([
  {
    $group: {
      _id: { $month: "$dateCreation" },
      total: { $sum: 1 }
    }
  },
  { $sort: { _id: 1 } }
])
```

## Formatter une date

```javascript
db.declencheurs.aggregate([
  {
    $project: {
      _id: 0,
      code: 1,
      dateFormatee: {
        $dateToString: {
          format: "%Y-%m-%d",
          date: "$dateCreation"
        }
      }
    }
  }
])
```

---

# 24) Exemple pratique 1 — Compter les déclencheurs actifs par type

```javascript
db.declencheurs.aggregate([
  { $match: { actif: true } },
  {
    $group: {
      _id: "$type",
      total: { $sum: 1 }
    }
  },
  { $sort: { total: -1 } }
])
```

Lecture :
- on filtre les actifs
- on groupe par type
- on compte
- on trie

---

# 25) Exemple pratique 2 — Montant total et moyen par type

```javascript
db.declencheurs.aggregate([
  {
    $group: {
      _id: "$type",
      totalMontant: { $sum: "$montant" },
      moyenneMontant: { $avg: "$montant" },
      minMontant: { $min: "$montant" },
      maxMontant: { $max: "$montant" }
    }
  },
  { $sort: { totalMontant: -1 } }
])
```

---

# 26) Exemple pratique 3 — Liste des codes par type

```javascript
db.declencheurs.aggregate([
  {
    $group: {
      _id: "$type",
      codes: { $push: "$code" }
    }
  }
])
```

---

# 27) Exemple pratique 4 — Préparer un résultat API propre

```javascript
db.declencheurs.aggregate([
  { $match: { actif: true } },
  {
    $project: {
      _id: 0,
      code: 1,
      libelle: 1,
      type: 1,
      montant: 1,
      criticite: {
        $cond: {
          if: { $gte: ["$montant", 200] },
          then: "ELEVEE",
          else: "NORMALE"
        }
      }
    }
  },
  { $sort: { code: 1 } }
])
```

---

# 28) Exemple pratique 5 — Top 2 des plus gros montants

```javascript
db.declencheurs.aggregate([
  { $sort: { montant: -1 } },
  { $limit: 2 },
  {
    $project: {
      _id: 0,
      code: 1,
      libelle: 1,
      montant: 1
    }
  }
])
```

---

# 29) Exemple pratique 6 — Jointure avec une autre collection

```javascript
db.declencheurs.aggregate([
  {
    $lookup: {
      from: "typesDeclencheur",
      localField: "type",
      foreignField: "codeType",
      as: "typeInfo"
    }
  },
  { $unwind: "$typeInfo" },
  {
    $project: {
      _id: 0,
      code: 1,
      libelle: 1,
      type: 1,
      libelleType: "$typeInfo.libelleType"
    }
  }
])
```

---

# 30) Exemple pratique 7 — Pipeline pour tableau de bord

```javascript
db.declencheurs.aggregate([
  {
    $facet: {
      total: [
        { $count: "nb" }
      ],
      totalActifs: [
        { $match: { actif: true } },
        { $count: "nb" }
      ],
      repartitionParType: [
        { $group: { _id: "$type", total: { $sum: 1 } } },
        { $sort: { total: -1 } }
      ],
      topMontants: [
        { $sort: { montant: -1 } },
        { $limit: 3 },
        { $project: { _id: 0, code: 1, montant: 1 } }
      ]
    }
  }
])
```

---

# 31) Bon ordre des stages

Souvent, le bon ordre est :

1. `$match`
2. `$project`
3. `$unwind`
4. `$group`
5. `$sort`
6. `$skip`
7. `$limit`

Ce n’est pas absolu, mais c’est une bonne base.

Idée :
- filtrer tôt
- réduire tôt
- grouper après
- trier à la fin

---

# 32) Performance

L’agrégation peut être très performante, mais elle peut aussi coûter cher si elle est mal pensée.

## Conseils

- mettre `$match` tôt
- utiliser des index sur les champs filtrés
- éviter des `$lookup` massifs inutiles
- éviter de projeter trop tard des champs énormes
- limiter les volumes
- penser au coût mémoire

---

# 33) Importance des index

Si tu fais souvent :

```javascript
{ $match: { type: "SECURITE", actif: true } }
```

alors il peut être pertinent d’avoir des index sur :
- `type`
- `actif`
- ou un index composé selon le besoin réel

Exemple :

```javascript
db.declencheurs.createIndex({ type: 1, actif: 1 })
```

L’agrégation profite souvent des index au début du pipeline, surtout via `$match` et parfois `$sort`.

---

# 34) `explain()` pour comprendre

Tu peux analyser un pipeline avec `explain()`.

Exemple :

```javascript
db.declencheurs.aggregate([
  { $match: { actif: true } },
  { $group: { _id: "$type", total: { $sum: 1 } } }
]).explain("executionStats")
```

Ça permet de voir :
- l’usage des index
- le nombre de documents lus
- le coût global

Très utile pour les gros volumes.

---

# 35) Pièges classiques

## 1. Confondre `find()` et `aggregate()`
`find()` lit.
`aggregate()` traite.

## 2. Oublier que `$group` change la structure
Après un `$group`, le document n’a plus la structure d’origine.

Exemple :
- avant : `code`, `libelle`, `type`
- après : `_id`, `total`

## 3. Utiliser `$push` au lieu de `$addToSet`
Tu risques de garder des doublons sans le vouloir.

## 4. Mettre `$sort` trop tôt
Tu tries beaucoup trop de documents avant d’avoir réduit le volume.

## 5. Oublier `$unwind` après `$lookup`
Tu récupères un tableau alors que tu pensais avoir un seul objet.

## 6. Travailler sur des champs non indexés avec gros volume
Ça peut coûter cher.

## 7. Croire que MongoDB remplace un vrai moteur OLAP
MongoDB peut faire de l’analytique utile, mais ce n’est pas un data warehouse complet.

---

# 36) Bonnes pratiques

- pipeline court et lisible
- `$match` tôt
- `$project` pour réduire les champs inutiles
- noms de champs de sortie clairs
- éviter les pipelines monstres si un découpage métier est plus clair
- tester les pipelines dans `mongosh`
- analyser avec `explain()`
- indexer les champs filtrés fréquemment
- documenter les pipelines complexes côté backend

---

# 37) Utilisation dans Spring Boot

Spring Data MongoDB permet de faire des agrégations via :
- `MongoTemplate`
- `Aggregation`
- `AggregationResults`

---

# 38) Dépendance Maven

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-mongodb</artifactId>
</dependency>
```

---

# 39) Configuration Spring Boot

```yaml
spring:
  application:
    name: springboot-starter
  data:
    mongodb:
      uri: mongodb://localhost:27017/Declencheur

server:
  port: 3000
```

---

# 40) Entité Java

```java
package com.ganatan.starter.api.declencheur;

import java.time.Instant;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "declencheurs")
public class Declencheur {

  @Id
  private String id;

  private String code;
  private String libelle;
  private Boolean actif;
  private String type;
  private Integer niveau;
  private Double montant;
  private Instant dateCreation;

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getCode() {
    return code;
  }

  public void setCode(String code) {
    this.code = code;
  }

  public String getLibelle() {
    return libelle;
  }

  public void setLibelle(String libelle) {
    this.libelle = libelle;
  }

  public Boolean getActif() {
    return actif;
  }

  public void setActif(Boolean actif) {
    this.actif = actif;
  }

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }

  public Integer getNiveau() {
    return niveau;
  }

  public void setNiveau(Integer niveau) {
    this.niveau = niveau;
  }

  public Double getMontant() {
    return montant;
  }

  public void setMontant(Double montant) {
    this.montant = montant;
  }

  public Instant getDateCreation() {
    return dateCreation;
  }

  public void setDateCreation(Instant dateCreation) {
    this.dateCreation = dateCreation;
  }
}
```

---

# 41) DTO de sortie pour agrégation

## Statistique par type

```java
package com.ganatan.starter.api.declencheur;

public class DeclencheurStatType {

  private String type;
  private Long total;
  private Double montantTotal;
  private Double montantMoyen;

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }

  public Long getTotal() {
    return total;
  }

  public void setTotal(Long total) {
    this.total = total;
  }

  public Double getMontantTotal() {
    return montantTotal;
  }

  public void setMontantTotal(Double montantTotal) {
    this.montantTotal = montantTotal;
  }

  public Double getMontantMoyen() {
    return montantMoyen;
  }

  public void setMontantMoyen(Double montantMoyen) {
    this.montantMoyen = montantMoyen;
  }
}
```

---

# 42) Service Spring Boot avec `MongoTemplate`

```java
package com.ganatan.starter.api.declencheur;

import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.stereotype.Service;

@Service
public class DeclencheurAggregationService {

  private final MongoTemplate mongoTemplate;

  public DeclencheurAggregationService(MongoTemplate mongoTemplate) {
    this.mongoTemplate = mongoTemplate;
  }

  public List<DeclencheurStatType> getStatsParType() {
    Aggregation aggregation = Aggregation.newAggregation(
      Aggregation.group("type")
        .count().as("total")
        .sum("montant").as("montantTotal")
        .avg("montant").as("montantMoyen"),
      Aggregation.project("total", "montantTotal", "montantMoyen")
        .and("_id").as("type"),
      Aggregation.sort(Sort.Direction.DESC, "montantTotal")
    );

    AggregationResults<DeclencheurStatType> results =
      mongoTemplate.aggregate(aggregation, "declencheurs", DeclencheurStatType.class);

    return results.getMappedResults();
  }
}
```

---

# 43) Explication du code Spring

## `Aggregation.newAggregation(...)`
Construit le pipeline.

## `Aggregation.group("type")`
Équivalent d’un groupement par champ `type`.

## `.count().as("total")`
Compte les documents du groupe.

## `.sum("montant").as("montantTotal")`
Somme les montants.

## `.avg("montant").as("montantMoyen")`
Calcule la moyenne.

## `Aggregation.project(...)`
Remappe la sortie.

Après un `group`, Mongo met la clé de groupe dans `_id`.
Ici on remet ce `_id` dans `type`.

## `mongoTemplate.aggregate(...)`
Exécute réellement le pipeline.

---

# 44) Controller Spring Boot

```java
package com.ganatan.starter.api.declencheur;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/declencheurs")
public class DeclencheurAggregationController {

  private final DeclencheurAggregationService service;

  public DeclencheurAggregationController(DeclencheurAggregationService service) {
    this.service = service;
  }

  @GetMapping("/stats/par-type")
  public List<DeclencheurStatType> getStatsParType() {
    return service.getStatsParType();
  }
}
```

Test :
```text
GET http://localhost:3000/api/declencheurs/stats/par-type
```

---

# 45) Exemple Spring — compter uniquement les actifs

```java
package com.ganatan.starter.api.declencheur;

import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.stereotype.Service;

@Service
public class DeclencheurAggregationService {

  private final MongoTemplate mongoTemplate;

  public DeclencheurAggregationService(MongoTemplate mongoTemplate) {
    this.mongoTemplate = mongoTemplate;
  }

  public List<DeclencheurStatType> getStatsActifsParType() {
    Aggregation aggregation = Aggregation.newAggregation(
      Aggregation.match(org.springframework.data.mongodb.core.query.Criteria.where("actif").is(true)),
      Aggregation.group("type")
        .count().as("total")
        .sum("montant").as("montantTotal")
        .avg("montant").as("montantMoyen"),
      Aggregation.project("total", "montantTotal", "montantMoyen")
        .and("_id").as("type"),
      Aggregation.sort(Sort.Direction.DESC, "total")
    );

    AggregationResults<DeclencheurStatType> results =
      mongoTemplate.aggregate(aggregation, "declencheurs", DeclencheurStatType.class);

    return results.getMappedResults();
  }
}
```

---

# 46) Exemple Spring — top des plus gros montants

## DTO

```java
package com.ganatan.starter.api.declencheur;

public class DeclencheurTopMontant {

  private String code;
  private String libelle;
  private Double montant;

  public String getCode() {
    return code;
  }

  public void setCode(String code) {
    this.code = code;
  }

  public String getLibelle() {
    return libelle;
  }

  public void setLibelle(String libelle) {
    this.libelle = libelle;
  }

  public Double getMontant() {
    return montant;
  }

  public void setMontant(Double montant) {
    this.montant = montant;
  }
}
```

## Service

```java
package com.ganatan.starter.api.declencheur;

import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.stereotype.Service;

@Service
public class DeclencheurAggregationService {

  private final MongoTemplate mongoTemplate;

  public DeclencheurAggregationService(MongoTemplate mongoTemplate) {
    this.mongoTemplate = mongoTemplate;
  }

  public List<DeclencheurTopMontant> getTopMontants() {
    Aggregation aggregation = Aggregation.newAggregation(
      Aggregation.sort(Sort.Direction.DESC, "montant"),
      Aggregation.limit(3),
      Aggregation.project("code", "libelle", "montant")
    );

    AggregationResults<DeclencheurTopMontant> results =
      mongoTemplate.aggregate(aggregation, "declencheurs", DeclencheurTopMontant.class);

    return results.getMappedResults();
  }
}
```

---

# 47) Exemple Spring — jointure avec `$lookup`

Pour des jointures avancées, Spring Data peut devenir plus verbeux. Sur les cas simples, ça reste faisable, sinon beaucoup de devs préfèrent :
- soit rester en pipeline Mongo shell pour concevoir
- soit utiliser des opérations custom

Exemple de logique :
- collection principale : `declencheurs`
- collection secondaire : `typesDeclencheur`

On peut construire une agrégation avec :
- `match`
- `lookup`
- `unwind`
- `project`

Sur les jointures simples, MongoDB le fait bien.  
Mais il faut rester lucide :
- si tu multiplies les `$lookup`, tu t’approches d’un modèle SQL-like
- parfois un modèle documentaire bien pensé évite ces jointures

---

# 48) Cas d’usage réels

Les agrégations servent très bien pour :

- dashboard métier
- statistiques par type
- regroupements par jour, mois, année
- top N
- reporting financier simple
- histogrammes
- calcul de KPI
- transformation de données avant retour API
- analyse de contenu d’un tableau

---

# 49) Quand MongoDB agrégation est un bon choix

Bon choix si :
- données déjà stockées dans MongoDB
- reporting léger à moyen
- besoin d’analyse proche des documents
- besoin d’API analytics directement depuis la base
- besoin de transformations rapides sans data warehouse séparé

---

# 50) Quand ce n’est pas le meilleur choix

Moins bon choix si :
- reporting massivement analytique
- agrégations géantes multi-dimensions
- besoins BI complexes
- besoin OLAP lourd
- nombreuses jointures métier structurées
- fortes exigences de requêtes relationnelles complexes

Dans ces cas :
- SQL
- data warehouse
- moteur analytique spécialisé
peuvent être plus adaptés

---

# 51) Modélisation et agrégation

Une bonne agrégation dépend souvent d’une bonne modélisation.

## Si tu imbriques intelligemment
Tu peux éviter des jointures.

## Si tu éclates tout dans trop de collections
Tu vas surutiliser `$lookup`.

Donc avant de faire des pipelines compliqués, il faut se poser la question :
- est-ce que le modèle documentaire est bien conçu ?

---

# 52) Méthode de travail recommandée

1. définir le besoin métier
2. écrire d’abord le pipeline en `mongosh`
3. valider le résultat brut
4. optimiser l’ordre des stages
5. vérifier les index
6. passer ensuite en `MongoTemplate`
7. mapper le résultat dans un DTO dédié
8. exposer via un endpoint propre

C’est la méthode la plus saine.

---

# 53) Exemple de méthode complète

## Étape 1 — besoin
“Je veux le nombre de déclencheurs actifs par type, avec montant total et montant moyen.”

## Étape 2 — `mongosh`

```javascript
db.declencheurs.aggregate([
  { $match: { actif: true } },
  {
    $group: {
      _id: "$type",
      total: { $sum: 1 },
      montantTotal: { $sum: "$montant" },
      montantMoyen: { $avg: "$montant" }
    }
  },
  { $sort: { montantTotal: -1 } }
])
```

## Étape 3 — Spring Boot
Traduire ce pipeline en `Aggregation.newAggregation(...)`

## Étape 4 — DTO propre
Créer `DeclencheurStatType`

## Étape 5 — endpoint
Retourner un JSON propre à l’API

---

# 54) Comparaison shell / Spring

## Shell

Avantages :
- rapide à tester
- visuel
- très direct

Inconvénients :
- pas intégré à l’application
- pas typé Java

## Spring Boot + MongoTemplate

Avantages :
- intégré au backend
- testable
- réutilisable
- branché à l’API

Inconvénients :
- plus verbeux
- parfois un peu lourd sur les pipelines complexes

---

# 55) Piège courant en Spring

Après un `group`, la clé est dans `_id`.

Si tu oublies de la reprojeter :

```java
Aggregation.project("total").and("_id").as("type")
```

ton DTO risque de ne pas matcher correctement.

C’est une erreur ultra classique.

---

# 56) DTO dédié ou `Document` brut

## DTO dédié
Mieux pour :
- API claire
- typage fort
- maintenance

## `Document` brut
Mieux pour :
- debug
- expérimentation
- résultat très variable

Exemple brut :

```java
List<org.bson.Document> results =
  mongoTemplate.aggregate(aggregation, "declencheurs", org.bson.Document.class).getMappedResults();
```

---

# 57) Tests HTTP possibles

## Statistiques par type

```text
GET http://localhost:3000/api/declencheurs/stats/par-type
```

## Top montants

```text
GET http://localhost:3000/api/declencheurs/top-montants
```

---

# 58) Ce qu’il faut retenir

- MongoDB agrégation = pipeline de transformation
- chaque stage traite le résultat du précédent
- `$match`, `$group`, `$project`, `$sort`, `$lookup`, `$unwind` sont les piliers
- commencer en shell
- finaliser en Spring Boot avec `MongoTemplate`
- penser performance et index
- ne pas confondre analytics utile et usine à gaz analytique

---

# 59) Résumé ultra simple

L’agrégation MongoDB est le mécanisme qui permet de transformer des documents en résultats analytiques ou structurés.

Elle repose sur :
- un pipeline
- des stages successifs
- des opérateurs de calcul
- des regroupements
- des projections
- des jointures

Pour la pratique :
- concevoir en `mongosh`
- intégrer avec `MongoTemplate`
- mapper vers des DTO propres

C’est un outil très puissant, à condition de garder :
- des pipelines lisibles
- un bon ordre des stages
- des index pertinents
- une vraie intention métier

---

# 60) Commandes de base à retenir

## Compter par type

```javascript
db.declencheurs.aggregate([
  { $group: { _id: "$type", total: { $sum: 1 } } }
])
```

## Filtrer puis grouper

```javascript
db.declencheurs.aggregate([
  { $match: { actif: true } },
  { $group: { _id: "$type", total: { $sum: 1 } } }
])
```

## Trier

```javascript
db.declencheurs.aggregate([
  { $sort: { montant: -1 } }
])
```

## Top 3

```javascript
db.declencheurs.aggregate([
  { $sort: { montant: -1 } },
  { $limit: 3 }
])
```

## Jointure

```javascript
db.declencheurs.aggregate([
  {
    $lookup: {
      from: "typesDeclencheur",
      localField: "type",
      foreignField: "codeType",
      as: "typeInfo"
    }
  }
])
```

## Déplier un tableau

```javascript
db.alertes.aggregate([
  { $unwind: "$tags" }
])
```

## Pipeline Spring Boot

```java
Aggregation aggregation = Aggregation.newAggregation(
  Aggregation.match(Criteria.where("actif").is(true)),
  Aggregation.group("type").count().as("total"),
  Aggregation.project("total").and("_id").as("type")
);
```

---

# 61) Conclusion

MongoDB sans agrégation, c’est utile.  
MongoDB avec agrégation, ça devient un vrai outil de traitement de données.

C’est une brique très forte pour :
- API analytiques
- reporting simple à intermédiaire
- statistiques métier
- transformations de documents
- dashboards

Le vrai niveau consiste à savoir :
- quand l’utiliser
- comment structurer le pipeline
- comment optimiser
- et quand il vaut mieux changer d’approche.
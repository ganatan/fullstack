# MongoTemplate avec Spring Boot

## Objectif

Comprendre ce qu’est `MongoTemplate`, son historique, son fonctionnement interne, ses usages, ses avantages, ses limites, et voir des exemples concrets dans une application Spring Boot.

---

# 1) Qu’est-ce que `MongoTemplate`

`MongoTemplate` est l’API bas niveau fournie par **Spring Data MongoDB** pour manipuler MongoDB depuis Java.

C’est l’équivalent Mongo de ce que `JdbcTemplate` représente pour JDBC :
- une couche plus proche du moteur
- plus souple
- plus explicite
- moins magique qu’un repository Spring Data

Avec `MongoTemplate`, tu peux :
- insérer
- lire
- modifier
- supprimer
- faire des requêtes complexes
- construire des agrégations
- paginer
- trier
- faire des recherches dynamiques
- cibler explicitement une collection

---

# 2) Positionnement par rapport aux repositories

En Spring Data MongoDB, tu as 2 approches principales :

## Approche 1 — `MongoRepository`

Très simple, rapide, déclarative.

Exemple :

```java
public interface DeclencheurRepository extends MongoRepository<Declencheur, String> {
}
```

Pratique pour :
- `findAll()`
- `findById()`
- `save()`
- `deleteById()`
- requêtes simples dérivées du nom de méthode

Limite :
- moins souple sur les cas avancés
- moins précis quand tu veux piloter finement la requête

## Approche 2 — `MongoTemplate`

Plus technique, plus puissante, plus précise.

Pratique pour :
- requêtes dynamiques
- filtres complexes
- update partiel
- agrégations
- projection
- pagination avancée
- code explicite
- debugging plus clair

---

# 3) Historique

## Avant Spring Data

Au début, pour accéder à MongoDB en Java, on utilisait directement le **driver Java MongoDB** :
- code assez bas niveau
- gestion manuelle des collections
- mapping plus verbeux
- moins intégré à l’écosystème Spring

## Arrivée de Spring Data

Spring a ensuite proposé **Spring Data MongoDB** pour simplifier :
- l’intégration avec Spring
- le mapping objet-document
- la gestion des repositories
- les conversions automatiques
- la configuration

## Rôle de `MongoTemplate`

`MongoTemplate` a été introduit comme couche de travail plus explicite et plus souple que les repositories automatiques.

L’idée :
- garder la puissance du driver MongoDB
- mais avec l’intégration Spring
- les converters
- la gestion de la configuration
- une API cohérente avec les autres templates Spring

En résumé :
- `MongoRepository` = simple et rapide
- `MongoTemplate` = précis et flexible

---

# 4) Où se situe `MongoTemplate` dans l’architecture

Quand tu utilises `MongoTemplate`, tu es dans cette logique :

```text
Ton code Java
   -> MongoTemplate
      -> Spring Data MongoDB
         -> Driver Java MongoDB
            -> Serveur MongoDB
```

Donc `MongoTemplate` ne parle pas à MongoDB “par magie”.
Il s’appuie sur :
- la configuration Spring
- le mapping Spring Data
- le driver MongoDB officiel

---

# 5) Fonctionnement général

`MongoTemplate` fonctionne autour de quelques concepts :

- une **database**
- une **collection**
- un **document**
- une **classe Java**
- un **mapping**
- des **Query**
- des **Criteria**
- des **Update**
- des **Aggregation**

## Exemple logique

Si tu écris :

```java
mongoTemplate.findAll(Declencheur.class, "declencheurs");
```

Spring fait globalement ceci :
- se connecte à la database configurée
- cible la collection `declencheurs`
- lit les documents Mongo
- convertit chaque document en objet `Declencheur`

---

# 6) Différence entre database, collection et classe Java

Il faut bien séparer les niveaux.

## Database

Exemple :
- `Declencheur`

## Collection

Exemple :
- `declencheurs`

## Classe Java

Exemple :
- `Declencheur`

Tu peux avoir :

- database : `Declencheur`
- collection : `declencheurs`
- classe Java : `Declencheur`

Ce sont 3 choses différentes.

---

# 7) Configuration Spring Boot

## Dépendance Maven

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-mongodb</artifactId>
</dependency>
```

## application.yml

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

Ici :
- MongoDB écoute sur `localhost:27017`
- la database utilisée est `Declencheur`

---

# 8) Entité simple

```java
package com.ganatan.starter.api.declencheur;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "declencheurs")
public class Declencheur {

  @Id
  private String id;

  private String code;
  private String libelle;
  private Boolean actif;

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
}
```

---

# 9) Injection de `MongoTemplate`

`MongoTemplate` est un bean Spring.

Tu peux l’injecter dans un service ou un controller.

```java
package com.ganatan.starter.api.declencheur;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

@Service
public class DeclencheurService {

  private final MongoTemplate mongoTemplate;

  public DeclencheurService(MongoTemplate mongoTemplate) {
    this.mongoTemplate = mongoTemplate;
  }
}
```

---

# 10) Lire tous les documents

```java
package com.ganatan.starter.api.declencheur;

import java.util.List;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

@Service
public class DeclencheurService {

  private final MongoTemplate mongoTemplate;

  public DeclencheurService(MongoTemplate mongoTemplate) {
    this.mongoTemplate = mongoTemplate;
  }

  public List<Declencheur> findAll() {
    return mongoTemplate.findAll(Declencheur.class, "declencheurs");
  }
}
```

---

# 11) Controller simple

```java
package com.ganatan.starter.api.declencheur;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/declencheurs")
public class DeclencheurController {

  private final DeclencheurService service;

  public DeclencheurController(DeclencheurService service) {
    this.service = service;
  }

  @GetMapping
  public List<Declencheur> getAll() {
    return service.findAll();
  }
}
```

---

# 12) Insérer un document

## Avec `insert`

```java
public Declencheur insert(Declencheur declencheur) {
  return mongoTemplate.insert(declencheur, "declencheurs");
}
```

`insert` :
- ajoute un nouveau document
- échoue si l’identifiant existe déjà

## Avec `save`

```java
public Declencheur save(Declencheur declencheur) {
  return mongoTemplate.save(declencheur, "declencheurs");
}
```

`save` :
- insère si l’objet n’existe pas
- met à jour si l’objet existe déjà

---

# 13) Lire par identifiant

```java
public Declencheur findById(String id) {
  return mongoTemplate.findById(id, Declencheur.class, "declencheurs");
}
```

---

# 14) Requête simple avec `Query` et `Criteria`

## Chercher tous les déclencheurs actifs

```java
package com.ganatan.starter.api.declencheur;

import java.util.List;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

@Service
public class DeclencheurService {

  private final MongoTemplate mongoTemplate;

  public DeclencheurService(MongoTemplate mongoTemplate) {
    this.mongoTemplate = mongoTemplate;
  }

  public List<Declencheur> findActifs() {
    Query query = new Query();
    query.addCriteria(Criteria.where("actif").is(true));
    return mongoTemplate.find(query, Declencheur.class, "declencheurs");
  }
}
```

---

# 15) Plusieurs critères

```java
public List<Declencheur> findActifsByCode(String code) {
  Query query = new Query();
  query.addCriteria(
    Criteria.where("actif").is(true).and("code").is(code)
  );
  return mongoTemplate.find(query, Declencheur.class, "declencheurs");
}
```

---

# 16) Recherche avec `regex`

```java
public List<Declencheur> searchByLibelle(String motCle) {
  Query query = new Query();
  query.addCriteria(Criteria.where("libelle").regex(motCle, "i"));
  return mongoTemplate.find(query, Declencheur.class, "declencheurs");
}
```

Le `"i"` signifie :
- recherche insensible à la casse

---

# 17) Tri

```java
import org.springframework.data.domain.Sort;

public List<Declencheur> findAllSorted() {
  Query query = new Query();
  query.with(Sort.by(Sort.Direction.ASC, "code"));
  return mongoTemplate.find(query, Declencheur.class, "declencheurs");
}
```

---

# 18) Pagination

```java
import org.springframework.data.domain.Sort;

public List<Declencheur> findPage(int page, int size) {
  Query query = new Query();
  query.with(Sort.by(Sort.Direction.ASC, "code"));
  query.skip((long) page * size);
  query.limit(size);
  return mongoTemplate.find(query, Declencheur.class, "declencheurs");
}
```

Exemple :
- page `0`, size `10` = 10 premiers
- page `1`, size `10` = 10 suivants

---

# 19) Compter

```java
public long countAll() {
  Query query = new Query();
  return mongoTemplate.count(query, Declencheur.class, "declencheurs");
}
```

Ou plus directement :

```java
public long countActifs() {
  Query query = new Query();
  query.addCriteria(Criteria.where("actif").is(true));
  return mongoTemplate.count(query, Declencheur.class, "declencheurs");
}
```

---

# 20) Vérifier l’existence d’un document

```java
public boolean existsByCode(String code) {
  Query query = new Query();
  query.addCriteria(Criteria.where("code").is(code));
  return mongoTemplate.exists(query, Declencheur.class, "declencheurs");
}
```

---

# 21) Lire un seul document

```java
public Declencheur findOneByCode(String code) {
  Query query = new Query();
  query.addCriteria(Criteria.where("code").is(code));
  return mongoTemplate.findOne(query, Declencheur.class, "declencheurs");
}
```

Si plusieurs documents matchent :
- un seul sera renvoyé

---

# 22) Mettre à jour un document

## Update simple

```java
import org.springframework.data.mongodb.core.query.Update;

public long updateLibelleByCode(String code, String nouveauLibelle) {
  Query query = new Query();
  query.addCriteria(Criteria.where("code").is(code));

  Update update = new Update();
  update.set("libelle", nouveauLibelle);

  return mongoTemplate.updateFirst(query, update, Declencheur.class, "declencheurs")
    .getModifiedCount();
}
```

---

# 23) Mettre à jour plusieurs documents

```java
public long disableAllActifs() {
  Query query = new Query();
  query.addCriteria(Criteria.where("actif").is(true));

  Update update = new Update();
  update.set("actif", false);

  return mongoTemplate.updateMulti(query, update, Declencheur.class, "declencheurs")
    .getModifiedCount();
}
```

---

# 24) Supprimer un document

## Par id

```java
public Declencheur deleteById(String id) {
  Declencheur declencheur = mongoTemplate.findById(id, Declencheur.class, "declencheurs");
  if (declencheur != null) {
    mongoTemplate.remove(declencheur, "declencheurs");
  }
  return declencheur;
}
```

## Par critère

```java
public long deleteByCode(String code) {
  Query query = new Query();
  query.addCriteria(Criteria.where("code").is(code));
  return mongoTemplate.remove(query, Declencheur.class, "declencheurs").getDeletedCount();
}
```

---

# 25) Créer explicitement une collection

Souvent inutile, car MongoDB crée la collection à la première insertion.

Mais c’est possible :

```java
public void createCollectionIfNotExists() {
  if (!mongoTemplate.collectionExists("declencheurs")) {
    mongoTemplate.createCollection("declencheurs");
  }
}
```

---

# 26) Voir les collections

```java
import java.util.Set;

public Set<String> getCollections() {
  return mongoTemplate.getCollectionNames();
}
```

---

# 27) Lire la database courante

```java
public String getDatabaseName() {
  return mongoTemplate.getDb().getName();
}
```

Très utile pour le debug.

---

# 28) Exemple de composant de debug

```java
package com.ganatan.starter.config;

import jakarta.annotation.PostConstruct;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

@Component
public class MongoDebug {

  private final MongoTemplate mongoTemplate;

  public MongoDebug(MongoTemplate mongoTemplate) {
    this.mongoTemplate = mongoTemplate;
  }

  @PostConstruct
  public void init() {
    System.out.println("Mongo database = " + mongoTemplate.getDb().getName());
    System.out.println("Mongo collections = " + mongoTemplate.getCollectionNames());
  }
}
```

---

# 29) Requêtes dynamiques

C’est un énorme avantage de `MongoTemplate`.

Exemple :
- si `code` est renseigné, on filtre dessus
- si `actif` est renseigné, on filtre dessus
- sinon on ne filtre pas

```java
package com.ganatan.starter.api.declencheur;

import java.util.ArrayList;
import java.util.List;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

@Service
public class DeclencheurService {

  private final MongoTemplate mongoTemplate;

  public DeclencheurService(MongoTemplate mongoTemplate) {
    this.mongoTemplate = mongoTemplate;
  }

  public List<Declencheur> search(String code, Boolean actif) {
    List<Criteria> criteres = new ArrayList<>();

    if (code != null && !code.isBlank()) {
      criteres.add(Criteria.where("code").is(code));
    }

    if (actif != null) {
      criteres.add(Criteria.where("actif").is(actif));
    }

    Query query = new Query();

    if (!criteres.isEmpty()) {
      query.addCriteria(new Criteria().andOperator(criteres.toArray(new Criteria[0])));
    }

    return mongoTemplate.find(query, Declencheur.class, "declencheurs");
  }
}
```

---

# 30) Exemple avec endpoint de recherche

```java
package com.ganatan.starter.api.declencheur;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/declencheurs")
public class DeclencheurController {

  private final DeclencheurService service;

  public DeclencheurController(DeclencheurService service) {
    this.service = service;
  }

  @GetMapping("/search")
  public List<Declencheur> search(
    @RequestParam(required = false) String code,
    @RequestParam(required = false) Boolean actif
  ) {
    return service.search(code, actif);
  }
}
```

Exemples :
- `/api/declencheurs/search`
- `/api/declencheurs/search?code=DEC001`
- `/api/declencheurs/search?actif=true`
- `/api/declencheurs/search?code=DEC001&actif=true`

---

# 31) Agrégation

MongoDB est très fort sur les pipelines d’agrégation.

Avec `MongoTemplate`, tu peux construire ces pipelines.

Exemple simple : compter le nombre de déclencheurs par valeur `actif`.

```java
package com.ganatan.starter.api.declencheur;

public class DeclencheurStat {

  private Boolean actif;
  private Integer total;

  public Boolean getActif() {
    return actif;
  }

  public void setActif(Boolean actif) {
    this.actif = actif;
  }

  public Integer getTotal() {
    return total;
  }

  public void setTotal(Integer total) {
    this.total = total;
  }
}
```

```java
import java.util.List;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;

public List<DeclencheurStat> countByActif() {
  Aggregation aggregation = Aggregation.newAggregation(
    Aggregation.group("actif").count().as("total"),
    Aggregation.project("total").and("_id").as("actif")
  );

  AggregationResults<DeclencheurStat> results =
    mongoTemplate.aggregate(aggregation, "declencheurs", DeclencheurStat.class);

  return results.getMappedResults();
}
```

---

# 32) Utiliser `Document` brut

Parfois tu veux lire des documents sans mapping Java fort.

```java
import java.util.List;
import org.bson.Document;

public List<Document> findRaw() {
  return mongoTemplate.findAll(Document.class, "declencheurs");
}
```

C’est utile pour :
- debug
- structure variable
- payload flexible
- migration

---

# 33) Gestion des dates

MongoDB stocke souvent des dates de type BSON Date.

Exemple :

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

  public Instant getDateCreation() {
    return dateCreation;
  }

  public void setDateCreation(Instant dateCreation) {
    this.dateCreation = dateCreation;
  }
}
```

Spring Data sait généralement mapper correctement :
- `Date`
- `Instant`
- `LocalDateTime` selon configuration et converters

---

# 34) Index

Il est souvent plus propre de déclarer les index sur l’entité.

Exemple :

```java
package com.ganatan.starter.api.declencheur;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "declencheurs")
public class Declencheur {

  @Id
  private String id;

  @Indexed(unique = true)
  private String code;

  private String libelle;
  private Boolean actif;

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
}
```

---

# 35) `MongoTemplate` vs `MongoRepository`

## `MongoRepository`

Avantages :
- rapide à mettre en place
- peu de code
- idéal pour CRUD simple
- lisible pour les cas standards

Inconvénients :
- moins souple pour les requêtes complexes
- peut devenir pénible sur les cas dynamiques
- moins explicite pour certains besoins avancés

## `MongoTemplate`

Avantages :
- très flexible
- requêtes complexes faciles à construire
- bon contrôle sur les collections
- pratique pour agrégations, updates ciblés, pipelines
- excellent pour du code métier précis

Inconvénients :
- plus verbeux
- plus technique
- moins rapide à écrire au début
- demande de bien comprendre Mongo

---

# 36) Quand utiliser `MongoTemplate`

Utilise `MongoTemplate` si :
- tu as des filtres dynamiques
- tu fais de l’agrégation
- tu veux du tri/paging complexe
- tu veux piloter précisément la requête
- tu veux éviter des signatures de repository énormes
- tu fais des updates partielles ciblées

---

# 37) Quand ne pas l’utiliser partout

Si ton besoin est juste :
- `findAll`
- `findById`
- `save`
- `deleteById`

un repository suffit largement.

Il ne faut pas utiliser `MongoTemplate` juste pour faire “plus expert”.
Il faut l’utiliser quand il apporte un vrai gain.

---

# 38) Service complet d’exemple

```java
package com.ganatan.starter.api.declencheur;

import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

@Service
public class DeclencheurService {

  private final MongoTemplate mongoTemplate;

  public DeclencheurService(MongoTemplate mongoTemplate) {
    this.mongoTemplate = mongoTemplate;
  }

  public List<Declencheur> findAll() {
    Query query = new Query();
    query.with(Sort.by(Sort.Direction.ASC, "code"));
    return mongoTemplate.find(query, Declencheur.class, "declencheurs");
  }

  public Declencheur findById(String id) {
    return mongoTemplate.findById(id, Declencheur.class, "declencheurs");
  }

  public Declencheur findByCode(String code) {
    Query query = new Query();
    query.addCriteria(Criteria.where("code").is(code));
    return mongoTemplate.findOne(query, Declencheur.class, "declencheurs");
  }

  public List<Declencheur> findActifs() {
    Query query = new Query();
    query.addCriteria(Criteria.where("actif").is(true));
    query.with(Sort.by(Sort.Direction.ASC, "code"));
    return mongoTemplate.find(query, Declencheur.class, "declencheurs");
  }

  public Declencheur create(Declencheur declencheur) {
    return mongoTemplate.insert(declencheur, "declencheurs");
  }

  public Declencheur save(Declencheur declencheur) {
    return mongoTemplate.save(declencheur, "declencheurs");
  }

  public long updateLibelle(String code, String libelle) {
    Query query = new Query();
    query.addCriteria(Criteria.where("code").is(code));

    Update update = new Update();
    update.set("libelle", libelle);

    return mongoTemplate.updateFirst(query, update, Declencheur.class, "declencheurs")
      .getModifiedCount();
  }

  public long deleteByCode(String code) {
    Query query = new Query();
    query.addCriteria(Criteria.where("code").is(code));
    return mongoTemplate.remove(query, Declencheur.class, "declencheurs").getDeletedCount();
  }

  public long count() {
    return mongoTemplate.count(new Query(), Declencheur.class, "declencheurs");
  }
}
```

---

# 39) Controller complet d’exemple

```java
package com.ganatan.starter.api.declencheur;

import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/declencheurs")
public class DeclencheurController {

  private final DeclencheurService service;

  public DeclencheurController(DeclencheurService service) {
    this.service = service;
  }

  @GetMapping
  public List<Declencheur> getAll() {
    return service.findAll();
  }

  @GetMapping("/{id}")
  public Declencheur getById(@PathVariable String id) {
    return service.findById(id);
  }

  @PostMapping
  public Declencheur create(@RequestBody Declencheur declencheur) {
    return service.create(declencheur);
  }

  @PutMapping
  public Declencheur save(@RequestBody Declencheur declencheur) {
    return service.save(declencheur);
  }

  @DeleteMapping("/code/{code}")
  public long deleteByCode(@PathVariable String code) {
    return service.deleteByCode(code);
  }
}
```

---

# 40) Jeu de données de test MongoDB

Dans `mongosh` :

```javascript
use Declencheur

db.declencheurs.insertMany([
  {
    code: "DEC001",
    libelle: "Déclencheur principal",
    actif: true
  },
  {
    code: "DEC002",
    libelle: "Déclencheur secondaire",
    actif: false
  },
  {
    code: "DEC003",
    libelle: "Déclencheur sécurité",
    actif: true
  }
])
```

---

# 41) Requêtes HTTP de test

## Lire tous les documents

```text
GET http://localhost:3000/api/declencheurs
```

## Lire un document par id

```text
GET http://localhost:3000/api/declencheurs/{id}
```

## Créer un document

```text
POST http://localhost:3000/api/declencheurs
Content-Type: application/json
```

```json
{
  "code": "DEC004",
  "libelle": "Déclencheur alerte",
  "actif": true
}
```

## Mettre à jour ou sauvegarder

```text
PUT http://localhost:3000/api/declencheurs
Content-Type: application/json
```

```json
{
  "id": "ID_MONGO",
  "code": "DEC004",
  "libelle": "Déclencheur alerte modifié",
  "actif": false
}
```

---

# 42) Pièges classiques

## 1. Confondre database et collection

Exemple faux :
- database = `Declencheur`
- collection supposée = `Declencheur`

Exemple correct :
- database = `Declencheur`
- collection = `declencheurs`

## 2. Oublier `@Document(collection = "...")`

Sans mapping explicite, tu peux lire une mauvaise collection.

## 3. Remplir `local` au lieu de la vraie base métier

Éviter :
- `local`
- `admin`
- `config`

Utiliser une vraie base applicative :
- `Declencheur`

## 4. Utiliser `save` en croyant toujours faire un insert

`save` peut faire :
- insert
- update

## 5. Ne pas vérifier la base réellement chargée

Toujours utile :

```java
mongoTemplate.getDb().getName()
mongoTemplate.getCollectionNames()
```

---

# 43) Bonnes pratiques

- utiliser une vraie base métier
- nommer les collections en minuscule pluriel
- expliciter `@Document(collection = "...")`
- isoler `MongoTemplate` dans un service
- réserver le controller à l’HTTP
- utiliser `MongoTemplate` pour les cas complexes
- utiliser les repositories pour le CRUD basique
- logguer la base et les collections au démarrage en phase de debug
- indexer les champs recherchés souvent
- éviter d’exposer directement des requêtes trop libres au client

---

# 44) Exemple de structure projet

```text
src/main/java/com/ganatan/starter
├── StarterApplication.java
├── config
│   └── MongoDebug.java
└── api
    └── declencheur
        ├── Declencheur.java
        ├── DeclencheurController.java
        └── DeclencheurService.java
```

---

# 45) Résumé ultra simple

`MongoTemplate` est l’outil Spring Data MongoDB le plus souple pour travailler proprement avec MongoDB.

Il permet :
- des lectures simples
- des requêtes dynamiques
- des updates ciblés
- des suppressions fines
- des agrégations
- un bon contrôle sur la database et la collection

Il est plus verbeux qu’un repository, mais bien plus puissant sur les besoins réels un peu sérieux.

---

# 46) Commandes et méthodes les plus utiles

## Lecture

```java
mongoTemplate.findAll(Declencheur.class, "declencheurs");
mongoTemplate.findById(id, Declencheur.class, "declencheurs");
mongoTemplate.find(query, Declencheur.class, "declencheurs");
mongoTemplate.findOne(query, Declencheur.class, "declencheurs");
```

## Écriture

```java
mongoTemplate.insert(declencheur, "declencheurs");
mongoTemplate.save(declencheur, "declencheurs");
```

## Update

```java
mongoTemplate.updateFirst(query, update, Declencheur.class, "declencheurs");
mongoTemplate.updateMulti(query, update, Declencheur.class, "declencheurs");
```

## Suppression

```java
mongoTemplate.remove(query, Declencheur.class, "declencheurs");
```

## Métadonnées

```java
mongoTemplate.getDb().getName();
mongoTemplate.getCollectionNames();
mongoTemplate.collectionExists("declencheurs");
```

---

# 47) Conclusion

Si tu débutes avec MongoDB dans Spring Boot :
- commence par comprendre la différence entre database, collection et document
- utilise `MongoRepository` pour les cas ultra simples
- passe à `MongoTemplate` dès que tu veux du vrai contrôle

Pour un développeur backend qui veut comprendre ce qu’il fait, `MongoTemplate` est souvent la meilleure porte d’entrée sérieuse sur Spring Data MongoDB.
# SQL vs NoSQL — Référence documentaire

## Historique et dates clés (idées par ligne)

1. 1970 : Edgar F. Codd formalise le modèle relationnel (IBM).
2. Années 1970–80 : premières bases relationnelles industrielles.
3. 1986 : standard SQL ANSI, interopérabilité et adoption massive.
4. Années 1990 : SQL domine les systèmes d’information d’entreprise.
5. 1995 : MySQL démocratise le relationnel open source.
6. 1996 : PostgreSQL introduit extensibilité et robustesse avancée.
7. Début 2000 : le web révèle les limites du scale vertical SQL.
8. 2006 : publication de BigTable par Google (fondation NoSQL).
9. 2007 : Amazon Dynamo inspire les bases distribuées clé-valeur.
10. 2009 : le terme NoSQL est popularisé.
11. 2009 : MongoDB démocratise le modèle document JSON.
12. 2010 : Cassandra (Facebook) cible haute disponibilité et distribution.
13. 2010–2012 : le théorème CAP structure les choix NoSQL.
14. Années 2010 : NoSQL explose avec big data et microservices.
15. 2015 : retour du SQL à grande échelle via le cloud (NewSQL).
16. 2015–2020 : coexistence SQL / NoSQL dans les architectures modernes.
17. Cloud era : généralisation des bases managées.
18. Aujourd’hui : SQL reste central pour le cœur métier critique.
19. Aujourd’hui : NoSQL est un outil ciblé orienté usage.
20. Standard moderne : polyglot persistence.

---

## Principes fondamentaux

### SQL (relationnel)

Données structurées en tables avec schéma strict, contraintes fortes (PK, FK, UNIQUE), intégrité référentielle, transactions ACID, jointures natives, langage SQL standardisé, cohérence forte, adapté aux domaines métier complexes, aux règles strictes et au reporting.

### NoSQL

Famille de modèles (document, clé-valeur, colonne, graphe), schéma flexible, dénormalisation fréquente, jointures rares, cohérence souvent éventuelle, scalabilité horizontale native, optimisé pour volume, latence et patterns d’accès spécifiques.

### Principe d’architecture en mission

Le choix est fonctionnel, pas idéologique :
SQL pour la cohérence et les relations métier,
NoSQL pour la performance, la flexibilité et l’échelle.
Approche recommandée : polyglot persistence.

---

## Bases de données SQL (relationnelles)

- PostgreSQL
- MySQL
- MariaDB
- Oracle Database
- Microsoft SQL Server
- IBM Db2
- SQLite

---

## Bases de données NoSQL

### Document
- MongoDB
- Couchbase

### Clé-valeur
- Redis
- DynamoDB

### Colonnes (wide-column)
- Cassandra
- HBase

### Graphe
- Neo4j

### Search / analytics
- Elasticsearch

### Time-series
- InfluxDB

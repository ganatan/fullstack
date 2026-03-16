# Conduktor — aide technique rapide

## Définition

Conduktor est un outil autour de Kafka.
Il ne remplace pas Kafka.
Il sert surtout à :

- voir les clusters
- lire les topics
- produire des messages
- suivre les consumer groups
- gérer les accès
- administrer plus facilement un environnement Kafka

En pratique :

- **Kafka** = transport des messages
- **Conduktor** = interface et gouvernance autour de Kafka

---

## Historique

Conduktor a été créé pour simplifier l’usage de Kafka en entreprise.
Le besoin vient d’un problème classique :

- Kafka est puissant
- mais son exploitation quotidienne devient vite complexe
- surtout avec plusieurs équipes, plusieurs clusters et des règles de sécurité

Le produit a évolué d’un outil de gestion pratique vers une plateforme plus large avec :

- une **Console**
- une **Gateway**
- de l’automatisation via API / CLI / Terraform

---

## Les composants

## 1. Console

La Console est l’interface principale.

Elle permet de :

- connecter un ou plusieurs clusters Kafka
- parcourir les topics
- lire les messages
- produire des messages
- voir les partitions
- surveiller les consumer groups
- gérer Kafka Connect
- centraliser l’accès pour les équipes

---

## 2. Gateway

Gateway est un proxy placé entre les clients Kafka et le cluster.

Elle sert à :

- contrôler les accès
- sécuriser les connexions
- appliquer des règles
- éviter de donner un accès direct trop large au cluster

Idée simple :

- sans Gateway, les applications parlent directement à Kafka
- avec Gateway, les applications passent par un point de contrôle

---

## Fonctionnement

## 1. Connexion aux clusters

Conduktor se connecte à un cluster Kafka existant.

Il peut être utilisé avec :

- Kafka self-managed
- Confluent
- Amazon MSK
- Redpanda
- autres solutions compatibles Kafka

---

## 2. Exploration des topics

Tu peux :

- voir la liste des topics
- inspecter leur configuration
- lire les messages
- filtrer les messages
- produire des messages de test

Cas classique :

- un service ne consomme plus
- tu regardes si les messages arrivent bien dans le topic

---

## 3. Analyse des consumer groups

Tu peux vérifier :

- les groupes de consommateurs
- leur état
- leur lag
- les offsets

Très utile pour savoir si :

- un consumer est bloqué
- un service est en retard
- une application ne lit plus correctement

---

## 4. Gestion de Kafka Connect

Conduktor peut aussi aider à visualiser et gérer les connecteurs.

Exemples :

- base de données vers Kafka
- Kafka vers Elasticsearch
- Kafka vers S3

---

## 5. Gouvernance et sécurité

Avec Gateway et la plateforme, tu peux mieux gérer :

- qui lit quoi
- qui écrit quoi
- quels services ont accès à quels topics
- comment éviter l’accès admin à tout le monde

---

## Cas d’usage techniques

## 1. Debug d’un flux

Exemple :

- `order-service` produit dans `orders.created`
- `billing-service` consomme ce topic
- le service aval ne reçoit rien

Vérifications dans Conduktor :

1. le topic existe
2. des messages sont bien présents
3. le consumer group est actif
4. il n’y a pas un lag anormal
5. la config du consumer est cohérente

---

## 2. Test rapide d’un topic

Tu peux utiliser Conduktor pour :

- produire un message JSON de test
- vérifier qu’il arrive bien
- contrôler qu’un consumer le lit

Exemple de message :

```json
{
  "id": "1001",
  "type": "ORDER_CREATED",
  "customerId": "C001"
}
```

---

## 3. Contrôle des accès

Exemple de règle métier :

- les applis `dev-*` peuvent écrire dans `dev.*`
- seules certaines applis peuvent lire `prod.payment.*`

Conduktor aide à centraliser ce contrôle au lieu de tout gérer à la main.

---

## Exemple d’architecture

```text
Applications
    |
    v
Conduktor Gateway
    |
    v
Kafka Cluster
    |
    +--> Topics
    +--> Consumer Groups
    +--> Kafka Connect
    +--> Schema Registry
```

Autre variante sans Gateway :

```text
Développeur / Ops
      |
      v
Conduktor Console
      |
      v
Kafka Cluster
```

---

## Exemples concrets

## Exemple 1 — lecture d’un topic

Topic :

```text
orders.created
```

Message :

```json
{
  "orderId": "ORD-001",
  "amount": 120.50,
  "status": "CREATED"
}
```

Utilité :

- vérifier que le producer publie bien
- vérifier le format
- voir rapidement si le flux est vivant

---

## Exemple 2 — diagnostic d’un consumer group

Consumer group :

```text
billing-service-group
```

Symptôme :

- le lag monte
- le backlog grossit
- le service ne suit plus

Analyse :

- vérifier si toutes les partitions sont consommées
- vérifier si une instance est morte
- vérifier si le traitement applicatif est lent

---

## Exemple 3 — environnement multi-clusters

Tu peux avoir dans Conduktor :

- cluster `local`
- cluster `dev`
- cluster `preprod`
- cluster `prod`

Avantage :

- une seule interface
- vision plus claire
- moins d’erreurs d’exploitation

---

## Démarrage rapide conceptuel

En local, tu peux lancer un environnement de démo basé sur Docker Compose si tu veux tester l’outil rapidement.

Ensuite la logique générale est :

1. démarrer Kafka
2. démarrer Conduktor
3. déclarer le cluster dans l’interface
4. ouvrir les topics
5. tester lecture / production / consumer groups

---

## Quand utiliser Conduktor

Conduktor est utile si tu as :

- plusieurs topics
- plusieurs équipes
- plusieurs environnements
- des besoins de sécurité
- des besoins de debug rapide
- du Kafka Connect
- du self-service pour les développeurs

Pour un mini POC Kafka local, ce n’est pas obligatoire.
Pour une plateforme Kafka un peu sérieuse, c’est beaucoup plus intéressant.

---

## Avantages

- interface plus simple que les outils Kafka bruts
- meilleur debug
- meilleure visibilité
- centralisation
- gouvernance
- sécurité
- exploitation plus propre en équipe

---

## Limites

- ce n’est pas Kafka
- il faut toujours comprendre Kafka
- ce n’est pas un remède à une mauvaise architecture
- il ajoute un composant de plus à exploiter

---

## Résumé

Conduktor est une couche technique autour de Kafka pour :

- administrer
- observer
- tester
- sécuriser
- gouverner

À retenir :

- **Kafka transporte**
- **Conduktor aide à piloter**
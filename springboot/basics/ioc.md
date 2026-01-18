# Spring Boot – Component Scan & IoC

---

## Principe

Spring Boot fonctionne par scan automatique des classes.

Il repère :
- les classes qui ont besoin de quelque chose
- les classes qui peuvent fournir quelque chose
et les relie automatiquement.

---

## Point de départ

```java
package com.ganatan.starter;

@SpringBootApplication
public class StarterApplication {
  public static void main(String[] args) {
    SpringApplication.run(StarterApplication.class, args);
  }
}
```

---

## Package racine

Le package :

```text
com.ganatan.starter
```

est le point de départ du scan.

Spring scanne :
- ce package
- tous ses sous-packages

---

## Exemple de structure valide

```text
com.ganatan.starter
├── StarterApplication
├── continents
│   ├── ContinentService
│   ├── ContinentRepository
│   └── InMemoryContinentRepository
└── root
    └── RootController
```

Tout est automatiquement détecté.

---

## Classes détectées par Spring

Spring transforme en beans les classes annotées avec :

- @Service
- @Repository
- @Component
- @Controller
- @RestController
- @Configuration

---

## Exemple : besoin déclaré

```java
@Service
public class ContinentService {

  private final ContinentRepository repository;

  public ContinentService(ContinentRepository repository) {
    this.repository = repository;
  }
}
```

Le service dit :
J’ai besoin d’un ContinentRepository.

---

## Exemple : implémentation fournie

```java
@Repository
@Profile("inmemory")
public class InMemoryContinentRepository
  implements ContinentRepository {
}
```

Le repository dit :
Je peux fournir un ContinentRepository.

---

## Rôle de Spring

Spring :
1. scanne les packages
2. détecte les annotations
3. crée les instances
4. injecte les dépendances

Aucun new dans le code métier.

---

## Cas où ça ne marche pas

Si une classe est hors du package racine :

```java
package com.ganatan.other;
```

Spring ne la voit pas.

---

## Solution (rarement nécessaire)

```java
@SpringBootApplication
@ComponentScan("com.ganatan")
```

---

## Résumé

- Spring part du package de @SpringBootApplication
- Il scanne tous les sous-packages
- Il détecte les classes annotées
- Il relie besoins et implémentations automatiquement

---

## Phrase clé

On n’instancie pas les dépendances.
On exprime des besoins.
Spring fait l’assemblage.

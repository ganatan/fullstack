# Fonctionnement d’un DTO

Ce document explique **ce qu’est un DTO** avec un exemple **très simple**,
en **JavaScript**, sans framework complexe, sans TypeScript.

Objectif : comprendre le **concept**, pas la techno.

---

## Définition simple

> **Un DTO (Data Transfer Object) est un objet volontairement construit  
> pour ce que l’API expose vers l’extérieur.**

Ce n’est **pas** l’objet interne.
Ce n’est **pas** l’objet base de données.
C’est un **objet intermédiaire**.

---

## Exemple minimal avec Express

Fichier unique : `app.js`

```js
const express = require('express');
const app = express();

app.use(express.json());

let continents = [
  { id: 1, name: 'Europe', internalCode: 'EU', createdAt: '2020-01-01' },
  { id: 2, name: 'Asia', internalCode: 'AS', createdAt: '2020-01-01' },
];
```

---

## API SANS DTO

```js
app.get('/continents-without-dto', (req, res) => {
  res.json(continents);
});
```

### Appel

```
GET /continents-without-dto
```

### Réponse

```json
[
  {
    "id": 1,
    "name": "Europe",
    "internalCode": "EU",
    "createdAt": "2020-01-01"
  },
  {
    "id": 2,
    "name": "Asia",
    "internalCode": "AS",
    "createdAt": "2020-01-01"
  }
]
```

### Problèmes

- champs internes exposés
- API couplée à la structure interne
- changement interne = API cassée

---

## API AVEC DTO

```js
app.get('/continents-with-dto', (req, res) => {
  const continentDtos = continents.map(c => ({
    id: c.id,
    name: c.name,
  }));

  res.json(continentDtos);
});
```

### Appel

```
GET /continents-with-dto
```

### Réponse

```json
[
  { "id": 1, "name": "Europe" },
  { "id": 2, "name": "Asia" }
]
```

---

## Ce qui a changé

- les données internes sont **transformées**
- seuls les champs utiles sont exposés
- l’API devient indépendante de l’interne

👉 Cette transformation **est le DTO**.

---

## DTO en une phrase

> **Un DTO, c’est ce que tu montres.  
> Le reste ne sort jamais.**

---

## Pourquoi c’est important

Sans DTO :
- fuite de données
- dette technique immédiate
- évolution dangereuse

Avec DTO :
- API stable
- données maîtrisées
- évolution sans casse

---

## Lien avec les frameworks modernes

- NestJS → DTO en `class`
- Spring Boot → DTO + mapping
- Angular → DTO côté client

Mais le **concept est le même** partout.

---

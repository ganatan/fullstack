# Fonctionnement d’un DTO

Ce document explique **ce qu’est un DTO** avec un exemple **très simple**,  
en **JavaScript**, sans TypeScript, sans framework complexe.

Objectif : comprendre **le concept**, pas la techno.

---

## Définition simple

> **Un DTO (Data Transfer Object) est un objet volontairement construit  
> pour représenter ce que l’API expose vers l’extérieur.**

Ce n’est **pas** l’objet interne.  
Ce n’est **pas** l’objet de la base de données.  
C’est un **objet intermédiaire**, contrôlé.

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

## API sans DTO

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
- toute modification interne peut casser l’API

---

## API avec DTO

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
- l’API devient **indépendante** de la structure interne

👉 **Cette transformation est le DTO.**

---

## DTO et mapping (point clé)

Dans cet exemple, cette ligne :

```js
continents.map(c => ({ id: c.id, name: c.name }))
```

fait deux choses :
- elle **sélectionne** les champs
- elle **reconstruit** un nouvel objet

👉 **C’est du mapping.**

> **Dès qu’on utilise un DTO, on fait forcément du mapping**,  
> même en JavaScript pur.

---

## DTO en une phrase

> **Un DTO, c’est ce que tu choisis de montrer.  
> Le reste ne sort jamais.**

---

## Pourquoi c’est important

Sans DTO :
- fuite de données
- API fragile
- dette technique immédiate

Avec DTO :
- API stable
- données maîtrisées
- évolution interne sans casser les clients

---

## Lien avec les frameworks modernes

- NestJS → DTO en `class`
- Spring Boot → DTO + mapping (manuel ou MapStruct)
- Angular → DTO côté client

La **techno change**,  
le **concept reste exactement le même**.

---

### Conclusion

Si tu comprends cet exemple Express :
- tu comprends les DTO
- tu comprends le mapping
- tu comprends les questions d’entretien Spring Boot / NestJS

# 007 — Continent CRUD : validation minimale (sans DTO)

Cette étape durcit légèrement le CRUD **sans introduire de DTO** :
- validation minimale côté service (`name` requis à la création)
- erreurs HTTP cohérentes (`400` / `404`)
- `id` strictement numérique via `ParseIntPipe`
- `POST` : impossible d’écraser l’`id` généré

---

## Prérequis

- Node.js LTS
- npm
- Projet NestJS existant (structure déjà en place jusqu’à `006-continent-crud.md`)

---

## Objectif

Exposer un CRUD complet sur `/continents` avec un stockage **InMemory**, mais en évitant les incohérences évidentes.

---

## Routes

| Méthode | URL | Body | Réponse |
|---|---|---|---|
| GET | `/continents` | - | `200` + liste |
| GET | `/continents/:id` | - | `200` + item, ou `404` |
| POST | `/continents` | `{ "name": "Europe" }` | `201` + item, ou `400` |
| PUT | `/continents/:id` | `{ "name": "..." }` | `200` + item, ou `404` |
| DELETE | `/continents/:id` | - | `200` + `true`, ou `404` |

---

## Fichiers concernés

```
src/modules/continent/
├── continent.controller.ts
├── continent.service.ts
└── continent.repository.ts
```

---

## 1) Controller

Fichier : `src/modules/continent/continent.controller.ts`

```ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ContinentService } from './continent.service';

@Controller('continents')
export class ContinentController {
  constructor(private readonly continentService: ContinentService) {}

  @Get()
  getAll() {
    return this.continentService.getAll();
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.continentService.getById(id);
  }

  @Post()
  create(@Body() body: any) {
    return this.continentService.create(body);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.continentService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.continentService.delete(id);
  }
}
```

---

## 2) Service (validation minimale + erreurs)

Fichier : `src/modules/continent/continent.service.ts`

```ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ContinentRepository } from './continent.repository';

@Injectable()
export class ContinentService {
  constructor(private readonly continentRepository: ContinentRepository) {}

  getAll() {
    return this.continentRepository.findAll();
  }

  getById(id: number) {
    const continent = this.continentRepository.findById(id);
    if (!continent) {
      throw new NotFoundException(`Continent ${id} not found`);
    }
    return continent;
  }

  create(data: any) {
    if (!data?.name) {
      throw new BadRequestException('name is required');
    }
    return this.continentRepository.create({ name: data.name });
  }

  update(id: number, data: any) {
    const updated = this.continentRepository.update(id, data);
    if (!updated) {
      throw new NotFoundException(`Continent ${id} not found`);
    }
    return updated;
  }

  delete(id: number) {
    const deleted = this.continentRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Continent ${id} not found`);
    }
    return true;
  }
}
```

---

## 3) Repository (InMemory, id non écrasable)

Fichier : `src/modules/continent/continent.repository.ts`

```ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class ContinentRepository {
  private continents = [
    { id: 1, name: 'Europe' },
    { id: 2, name: 'Asia' },
    { id: 3, name: 'Africa' },
    { id: 4, name: 'America' },
    { id: 5, name: 'Oceania' },
    { id: 6, name: 'Antarctica' },
  ];

  private currentId = 7;

  findAll() {
    return this.continents;
  }

  findById(id: number) {
    return this.continents.find((c) => c.id === id);
  }

  create(data: any) {
    const newContinent = {
      ...data,
      id: this.currentId++,
    };
    this.continents.push(newContinent);
    return newContinent;
  }

  update(id: number, data: any) {
    const index = this.continents.findIndex((c) => c.id === id);
    if (index === -1) return undefined;

    this.continents[index] = { ...this.continents[index], ...data };
    return this.continents[index];
  }

  delete(id: number) {
    const index = this.continents.findIndex((c) => c.id === id);
    if (index === -1) return false;

    this.continents.splice(index, 1);
    return true;
  }
}
```

---

## Lancer l’application

À la racine du projet :

```bash
npm install
npm run start:dev
```

Par défaut :
- API : `http://localhost:3000`
- Base : InMemory (dans `ContinentRepository`)

---

## Tester l’API avec Postman (simple)

Base URL locale :

```
http://localhost:3000
```

---

## GET — Liste des continents

- Méthode : `GET`
- URL :

```
http://localhost:3000/continents
```

Résultat attendu :
- `200`
- tableau JSON

---

## GET — Continent par id

- Méthode : `GET`
- URL :

```
http://localhost:3000/continents/1
```

Résultat attendu :
- `200`
- objet JSON

Erreur :
```
http://localhost:3000/continents/999
```
- `404`

---

## POST — Créer un continent

- Méthode : `POST`
- URL :

```
http://localhost:3000/continents
```

Headers :
```
Content-Type: application/json
```

Body (raw / JSON) :
```json
{
  "name": "Test Continent"
}
```

Résultat attendu :
- `201`
- continent créé avec `id` auto

Erreur :
```json
{}
```
- `400`
- `name is required`

---

## PUT — Modifier un continent

- Méthode : `PUT`
- URL :

```
http://localhost:3000/continents/1
```

Headers :
```
Content-Type: application/json
```

Body :
```json
{
  "name": "Europe Updated"
}
```

Résultat attendu :
- `200`
- continent modifié

Erreur :
```
http://localhost:3000/continents/999
```
- `404`

---

## DELETE — Supprimer un continent

- Méthode : `DELETE`
- URL :

```
http://localhost:3000/continents/1
```

Résultat attendu :
- `200`
- `true`

Erreur :
```
http://localhost:3000/continents/999
```
- `404`

---

## Résumé express

- Base URL : `http://localhost:3000`
- Routes : `/continents`
- Body en JSON uniquement
- Stockage InMemory

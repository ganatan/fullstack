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

## Installer Postman

### Option A — Windows (winget)

```bash
winget install Postman.Postman
```

### Option B — macOS (brew)

```bash
brew install --cask postman
```

### Option C — Linux (snap)

```bash
sudo snap install postman
```

---

## Utiliser Postman

### 1) Créer un environnement

Dans Postman :
- **Environments** → **Create environment**
- Nom : `local`
- Variable : `baseUrl`
- Initial value : `http://localhost:3000`
- Save
- Sélectionner l’environnement `local` en haut à droite

### 2) Créer une collection

- **Collections** → **New collection**
- Nom : `continents`

### 3) Ajouter les requêtes

Dans chaque requête :
- utiliser `{{baseUrl}}` au lieu de l’URL complète
- Headers pour POST/PUT : `Content-Type: application/json`

---

## Tests CRUD complets dans Postman

### GET all

- Method : `GET`
- URL : `{{baseUrl}}/continents`

Attendu : `200` + tableau JSON

---

### GET one

- Method : `GET`
- URL : `{{baseUrl}}/continents/1`

Attendu : `200` + objet JSON

Cas erreur :
- URL : `{{baseUrl}}/continents/999`
- Attendu : `404`

---

### POST create

- Method : `POST`
- URL : `{{baseUrl}}/continents`
- Body → raw → JSON

```json
{
  "name": "Test Continent"
}
```

Attendu : `201` + objet créé (id auto)

Cas erreur :
- Body `{}` ou sans `name`
- Attendu : `400` + message `name is required`

---

### PUT update

- Method : `PUT`
- URL : `{{baseUrl}}/continents/1`
- Body → raw → JSON

```json
{
  "name": "Europe Updated"
}
```

Attendu : `200` + objet modifié

Cas erreur :
- URL : `{{baseUrl}}/continents/999`
- Attendu : `404`

---

### DELETE

- Method : `DELETE`
- URL : `{{baseUrl}}/continents/1`

Attendu : `200` + `true`

Cas erreur :
- URL : `{{baseUrl}}/continents/999`
- Attendu : `404`

---

## Vérifs rapides (sans Postman)

### GET all

```bash
curl -s http://localhost:3000/continents
```

### POST create

```bash
curl -s -X POST http://localhost:3000/continents \
  -H "Content-Type: application/json" \
  -d '{ "name": "Test Continent" }'
```

---

## Résultat attendu

- CRUD complet opérationnel
- erreurs HTTP cohérentes
- création impossible sans `name`
- stockage InMemory

---

## Prochaine étape

**008-continent-dto**

Objectif :
- typage strict des entrées/sorties
- validation structurée
- stabilisation du contrat API

# 004 — Continent Repository (version simple)

Cette étape introduit le **Repository pattern de façon minimale**.  
Objectif : séparer légèrement les responsabilités **sans complexité inutile**.

Pas d’interface, pas de token, pas de module dédié.  
Juste **Controller → Service → Repository**.

---

## Structure du projet

```
src/
├── app.controller.ts
├── app.module.ts
├── app.service.ts
├── continent.controller.ts
├── continent.service.ts
├── continent.repository.ts
├── main.ts
```

---

## Repository

Le repository contient **les données** et expose une méthode `findAll()`.

### `src/continent.repository.ts`

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

  findAll() {
    return this.continents;
  }
}
```

---

## Service

Le service **appelle le repository**.  
Il ne connaît pas les détails des données.

### `src/continent.service.ts`

```ts
import { Injectable } from '@nestjs/common';
import { ContinentRepository } from './continent.repository';

@Injectable()
export class ContinentService {
  constructor(private readonly continentRepository: ContinentRepository) {}

  getAll() {
    return this.continentRepository.findAll();
  }
}
```

---

## Controller

Le controller gère uniquement la **route HTTP**.

### `src/continent.controller.ts`

```ts
import { Controller, Get } from '@nestjs/common';
import { ContinentService } from './continent.service';

@Controller('continents')
export class ContinentController {
  constructor(private readonly continentService: ContinentService) {}

  @Get()
  getAll() {
    return this.continentService.getAll();
  }
}
```

---

## Module

Le module déclare simplement le repository comme provider.

### `src/app.module.ts`

```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContinentController } from './continent.controller';
import { ContinentService } from './continent.service';
import { ContinentRepository } from './continent.repository';

@Module({
  controllers: [AppController, ContinentController],
  providers: [AppService, ContinentService, ContinentRepository],
})
export class AppModule {}
```

---

## Flux de données

```
GET /continents
    ↓
ContinentController.getAll()
    ↓
ContinentService.getAll()
    ↓
ContinentRepository.findAll()
    ↓
Retour des données
```

---

## Résultat

```
GET http://localhost:3000/continents
```

```json
[
  { "id": 1, "name": "Europe" },
  { "id": 2, "name": "Asia" },
  { "id": 3, "name": "Africa" },
  { "id": 4, "name": "America" },
  { "id": 5, "name": "Oceania" },
  { "id": 6, "name": "Antarctica" }
]
```

---

## Pourquoi cette version

- simple
- lisible
- pédagogique
- évolutive plus tard (DB, interface, module)

C’est la **bonne étape intermédiaire**, sans sur-architecture.

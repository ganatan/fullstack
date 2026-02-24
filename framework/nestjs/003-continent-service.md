# 003 — Continent Service

Introduction d’un **service NestJS** pour séparer la logique métier du contrôleur.

Objectif :  
passer d’un controller autonome à une **architecture controller + service**, sans complexité inutile.

---

## Contexte

Jusqu’à présent, le controller `ContinentController` contenait directement les données.  
Cette étape introduit un **service dédié** pour :

- clarifier les responsabilités
- préparer l’évolution (tests, in-memory, base de données)
- rester aligné avec les bonnes pratiques NestJS

---

## Structure impactée

```
src/
├── app.controller.ts
├── app.module.ts
├── app.service.ts
├── continent.controller.ts
├── continent.service.ts
├── main.ts
```

---

## Service Continent

### Fichier : `src/continent.service.ts`

```ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class ContinentService {
  getAll() {
    return [
      { id: 1, name: 'Europe' },
      { id: 2, name: 'Asia' },
      { id: 3, name: 'Africa' },
      { id: 4, name: 'America' },
      { id: 5, name: 'Oceania' },
      { id: 6, name: 'Antarctica' },
    ];
  }
}
```

---

## Controller Continent

### Fichier : `src/continent.controller.ts`

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

## Enregistrement dans le module

### Fichier : `src/app.module.ts`

```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContinentController } from './continent.controller';
import { ContinentService } from './continent.service';

@Module({
  controllers: [AppController, ContinentController],
  providers: [AppService, ContinentService],
})
export class AppModule {}
```

---

## Endpoint exposé

### Requête

```
GET /continents
```

### Réponse

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

## Lancement

```bash
npm run start:dev
```

URL locale :

```
http://localhost:3000/continents
```

---

## Choix techniques

- controller = gestion HTTP uniquement
- service = source de données
- aucune dépendance externe
- aucune persistance pour l’instant

---

## Évolutions possibles

- test unitaire du service
- `GET /continents/:id`
- passage à un repository in-memory
- introduction d’un module `ContinentModule`

Cette étape pose une **base saine** pour les évolutions futures.

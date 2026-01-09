# 002 — Continent Controller

Ajout d’un **controller NestJS simple** exposant l’URL `/continents`.

Objectif :  
introduire une **nouvelle route HTTP** sans complexité (pas de service, pas de base de données).

---

## Contexte

Le projet dispose déjà :
- d’un `AppController` pour `/`
- d’une structure NestJS minimale et fonctionnelle
- d’une configuration de port par variable d’environnement

Cette étape ajoute une **feature isolée** : la gestion des continents (statique).

---

## Structure impactée

```
src/
├── app.controller.ts
├── app.module.ts
├── app.service.ts
├── continents.controller.ts
├── main.ts
```

---

## Nouveau controller

### Fichier : `src/continents.controller.ts`

```ts
import { Controller, Get } from '@nestjs/common';

@Controller('continents')
export class ContinentsController {
  @Get()
  getAll() {
    return [
      { id: 1, name: 'Europe' },
      { id: 2, name: 'Asie' },
      { id: 3, name: 'Afrique' },
      { id: 4, name: 'Amérique' },
      { id: 5, name: 'Océanie' },
      { id: 6, name: 'Antarctique' },
    ];
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
import { ContinentsController } from './continents.controller';

@Module({
  controllers: [AppController, ContinentsController],
  providers: [AppService],
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
  { "id": 2, "name": "Asie" },
  { "id": 3, "name": "Afrique" },
  { "id": 4, "name": "Amérique" },
  { "id": 5, "name": "Océanie" },
  { "id": 6, "name": "Antarctique" }
]
```

---

## Lancement

```bash
npm run start:dev
```

URL locale par défaut :

```
http://localhost:3000/continents
```

---

## Choix techniques

- pas de service
- données statiques
- controller autonome
- aucune abstraction prématurée

---

## Évolutions possibles

- `GET /continents/:id`
- extraction vers un service
- passage en in-memory
- ajout de tests unitaires et e2e
- ajout d’un prefix `/api`

Cette feature sert de **base propre** pour la suite.

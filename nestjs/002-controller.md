# 002 — Continent Controller

Ajout d’un **controller NestJS simple** exposant l’URL `/continents`.

Objectif :  
introduire une **nouvelle route HTTP** de manière volontairement simple  
(**pas de service, pas de base de données, pas de DI inutile**).

---

## Contexte

Le projet dispose déjà :

- d’un `AppController` exposant `/`
- d’une structure NestJS minimale et fonctionnelle
- d’une configuration de port par variable d’environnement

Cette étape ajoute une **feature isolée** :  
la gestion d’une ressource `Continent`, avec des données **statiques**.

---

## Convention de nommage

- **Fichier** : singulier  
  `continent.controller.ts`
- **Route HTTP** : pluriel  
  `/continents`

Cette convention est standard et cohérente avec NestJS.

---

## Structure impactée

```
src/
├── app.controller.ts
├── app.controller.spec.ts
├── app.module.ts
├── continent.controller.ts
├── main.ts
```

> Le fichier `app.service.ts` n’est **plus utilisé** à ce stade.

---

## AppController (simplifié)

### Fichier : `src/app.controller.ts`

```ts
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getStatus() {
    return { status: 'ok' };
  }
}
```

---

## Test du AppController (refactor)

Le test généré par NestJS suppose souvent l’existence d’un `AppService`.
Comme on a supprimé le service, le test doit être simplifié.

### Fichier : `src/app.controller.spec.ts`

```ts
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = module.get<AppController>(AppController);
  });

  it('should return status ok', () => {
    expect(appController.getStatus()).toEqual({ status: 'ok' });
  });
});
```

---

## Nouveau controller

### Fichier : `src/continent.controller.ts`

```ts
import { Controller, Get } from '@nestjs/common';

@Controller('continents')
export class ContinentController {
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

Ce controller :

- expose une seule route
- contient toute la logique
- ne dépend d’aucun service
- est entièrement lisible en un seul fichier

---

## Enregistrement dans le module

### Fichier : `src/app.module.ts`

```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ContinentController } from './continent.controller';

@Module({
  controllers: [AppController, ContinentController],
})
export class AppModule {}
```

À ce stade :

- aucun `provider`
- aucune injection
- le module ne fait que **déclarer les routes**

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

URL locale :

```
http://localhost:3000/continents
```

---

## Tests

Lancer les tests :

```bash
npm run test
```

---

## Choix techniques assumés

- pas de service
- pas de repository
- pas de base de données
- données statiques
- controllers autonomes

👉 **Objectif : comprendre le rôle des controllers et du routing HTTP, sans abstraction.**

---

## Évolutions possibles

Les évolutions se feront **sans casser ces routes** :

- `GET /continents/:id`
- extraction vers un service
- passage en in-memory
- ajout de tests unitaires pour `ContinentController`
- ajout de tests e2e
- ajout d’un prefix global `/api`

Cette étape constitue une **base volontairement naïve**, saine et contrôlée,  
sur laquelle les abstractions seront ajoutées **progressivement et consciemment**.

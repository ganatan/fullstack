# 004 — Continent Repository

Introduction d’un **repository in-memory** pour isoler l’accès aux données.

Objectif :  
séparer clairement **controller / service / accès aux données**,  
sans base de données, en préparant les évolutions futures.

---

## Contexte

Après l’introduction :
- d’un `ContinentController`
- d’un `ContinentService`

le service contenait encore directement les données.

Cette étape introduit un **repository** pour :
- sortir les données du service
- préparer un futur switch (DB, API externe)
- améliorer la testabilité

---

## Architecture cible

```
Controller  →  Service  →  Repository
```

- Controller : HTTP uniquement
- Service : logique applicative
- Repository : source des données

---

## Structure impactée

```
src/
├── continent.controller.ts
├── continent.service.ts
├── continent.repository.ts
├── continent.repository.inmemory.ts
```

---

## Contrat du repository

### Fichier : `src/continent.repository.ts`

```ts
export type Continent = {
  id: number;
  name: string;
};

export interface ContinentRepository {
  findAll(): Continent[];
}
```

---

## Implémentation in-memory

### Fichier : `src/continent.repository.inmemory.ts`

```ts
import { Continent, ContinentRepository } from './continent.repository';

export class InMemoryContinentRepository implements ContinentRepository {
  private readonly items: Continent[] = [
    { id: 1, name: 'Europe' },
    { id: 2, name: 'Asia' },
    { id: 3, name: 'Africa' },
    { id: 4, name: 'America' },
    { id: 5, name: 'Oceania' },
    { id: 6, name: 'Antarctica' },
  ];

  findAll(): Continent[] {
    return this.items;
  }
}
```

---

## Service utilisant le repository

### Fichier : `src/continent.service.ts`

```ts
import { Inject, Injectable } from '@nestjs/common';
import { ContinentRepository } from './continent.repository';

export const CONTINENT_REPOSITORY = 'CONTINENT_REPOSITORY';

@Injectable()
export class ContinentService {
  constructor(
    @Inject(CONTINENT_REPOSITORY)
    private readonly repository: ContinentRepository,
  ) {}

  getAll() {
    return this.repository.findAll();
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
import { ContinentService, CONTINENT_REPOSITORY } from './continent.service';
import { InMemoryContinentRepository } from './continent.repository.inmemory';

@Module({
  controllers: [AppController, ContinentController],
  providers: [
    AppService,
    ContinentService,
    { provide: CONTINENT_REPOSITORY, useClass: InMemoryContinentRepository },
  ],
})
export class AppModule {}
```

---

## Endpoint inchangé

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

## Choix techniques

- repository comme **contrat**
- implémentation in-memory
- injection via token NestJS
- aucune dépendance à une DB

---

## Évolutions possibles

- `findById(id)`
- CRUD complet
- remplacement par repository DB
- tests unitaires isolés (repo / service)

Cette étape solidifie l’architecture sans alourdir le projet.

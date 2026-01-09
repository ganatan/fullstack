# 005 — Continent Module (migration vers modules/continent)

Cette étape migre la feature **Continent** vers une architecture **modulaire**,
prévue pour accueillir plusieurs entités (`continent`, `country`, `city`, `person`)
sans alourdir `AppModule`.

Objectif :
- isoler la feature Continent
- préparer les dépendances inter-modules
- garder une implémentation simple (in-memory)

---

## Architecture cible

```
src/
├── main.ts
├── app.module.ts
├── app.controller.ts
├── app.service.ts
└── modules/
    └── continent/
        ├── continent.module.ts
        ├── continent.controller.ts
        ├── continent.service.ts
        └── continent.repository.ts
```

---

## Étape 1 — Créer le dossier feature

```bash
mkdir -p src/modules/continent
```

---

## Étape 2 — Déplacer les fichiers existants

```bash
mv src/continent.controller.ts src/modules/continent/
mv src/continent.service.ts src/modules/continent/
mv src/continent.repository.ts src/modules/continent/
```

---

## Étape 3 — Mettre à jour les imports internes

### `src/modules/continent/continent.controller.ts`

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

### `src/modules/continent/continent.service.ts`

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

### `src/modules/continent/continent.repository.ts`

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

## Étape 4 — Créer le module Continent

### `src/modules/continent/continent.module.ts`

```ts
import { Module } from '@nestjs/common';
import { ContinentController } from './continent.controller';
import { ContinentService } from './continent.service';
import { ContinentRepository } from './continent.repository';

@Module({
  controllers: [ContinentController],
  providers: [ContinentService, ContinentRepository],
  exports: [ContinentService],
})
export class ContinentModule {}
```

---

## Étape 5 — Alléger AppModule

### `src/app.module.ts`

```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContinentModule } from './modules/continent/continent.module';

@Module({
  imports: [ContinentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

---

## Résultat

- `AppModule` reste léger
- la feature Continent est totalement isolée
- l’API reste inchangée

```
GET /continents
```

---

## Pourquoi cette structure

- scalable (country, city, person suivent le même pattern)
- testable par feature
- alignée avec les bonnes pratiques NestJS
- compatible avec une future base de données

Cette étape marque le passage vers une **architecture modulaire propre**.

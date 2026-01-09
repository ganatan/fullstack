# backend-nest

Projet **NestJS minimal**.  
Pas de base de données, pas de Swagger.  
Un serveur HTTP qui démarre et retourne du JSON.

---

## Prérequis

- Node.js ≥ 18
- npm

---

## Création du projet

Option A (sans installation globale) :

```bash
npx @nestjs/cli new backend-nest
cd backend-nest
```

Option B (CLI global) :

```bash
npm install -g @nestjs/cli
nest --version
nest new backend-nest
cd backend-nest
```

---

## Port configurable en local

Installer `cross-env` :

```bash
npm install --save-dev cross-env
```

Extrait de `package.json` :

```json
{
  "scripts": {
    "start:dev": "nest start --watch",
    "start:local": "cross-env PORT=4000 npm run start:dev",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  }
}
```

---

## Structure du projet

```
src/
├── main.ts
├── app.module.ts
├── app.controller.ts
├── app.service.ts
├── app.controller.spec.ts
test/
└── app.e2e-spec.ts
```

---

## Code

### `src/main.ts`

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

---

### `src/app.module.ts`

```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

---

### `src/app.service.ts`

```ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatus() {
    return { status: 'ok' };
  }
}
```

---

### `src/app.controller.ts`

```ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  get() {
    return this.appService.getStatus();
  }
}
```

---

## Tests unitaires

### `src/app.controller.spec.ts`

```ts
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getStatus: () => ({ status: 'ok' }),
          },
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
  });

  it('should return status ok', () => {
    expect(appController.get()).toEqual({ status: 'ok' });
  });
});
```

---

## Tests end-to-end

### `test/app.e2e-spec.ts`

```ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', async () => {
    await request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect({ status: 'ok' });
  });
});
```

---

## Lancer l'application

Port par défaut :

```bash
npm run start:dev
```

URL :

```
http://localhost:3000/
```

Port configuré :

```bash
npm run start:local
```

URL :

```
http://localhost:4000/
```

---

## Lancer les tests

Tests unitaires :

```bash
npm test
```

Mode watch :

```bash
npm run test:watch
```

Couverture :

```bash
npm run test:cov
```

Tests end-to-end :

```bash
npm run test:e2e
```

---

## Résultat attendu

```json
{
  "status": "ok"
}
```

# backend-nest --- version minimale

Projet **NestJS volontairement minimal**.\
Pas de base de données, pas de Swagger, pas de logique métier.\
Juste un serveur HTTP qui démarre et retourne du JSON.

------------------------------------------------------------------------

## Prérequis

-   Node.js ≥ 18
-   npm

------------------------------------------------------------------------

## Création du projet

``` bash
npx @nestjs/cli new backend-nest
cd backend-nest
```

------------------------------------------------------------------------

## Dépendance locale utile

``` bash
npm install --save-dev cross-env
```

------------------------------------------------------------------------

## Structure du projet

    src/
    ├── main.ts
    ├── app.module.ts
    └── app.controller.ts

------------------------------------------------------------------------

## Code

### `src/main.ts`

``` ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

------------------------------------------------------------------------

### `src/app.module.ts`

``` ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

@Module({
  controllers: [AppController],
})
export class AppModule {}
```

------------------------------------------------------------------------

### `src/app.controller.ts`

``` ts
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  get() {
    return { status: 'ok' };
  }
}
```

------------------------------------------------------------------------

## Scripts npm

Extrait de `package.json` :

``` json
{
  "scripts": {
    "start:dev": "nest start --watch",
    "start:local": "cross-env PORT=4000 npm run start:dev"
  }
}
```

------------------------------------------------------------------------

## Lancer l'application

### Port par défaut

``` bash
npm run start:dev
```

URL :

    http://localhost:3000/

------------------------------------------------------------------------

### Port configuré

``` bash
npm run start:local
```

URL :

    http://localhost:4000/

------------------------------------------------------------------------

## Comportement

-   le port est lu via `process.env.PORT`
-   en local : injecté par `cross-env`
-   en production : injecté par l'environnement (ConfigMap, etc.)
-   le code ne change pas

------------------------------------------------------------------------

## Résultat attendu

``` json
{
  "status": "ok"
}
```

------------------------------------------------------------------------

Base validée.\
On peut maintenant ajouter ce qu'on veut, étape par étape.

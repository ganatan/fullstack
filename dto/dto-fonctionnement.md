# 008 — Continent DTO (minimal et pragmatique)

Cette étape introduit des **DTO minimalistes** pour sécuriser l’API et préparer
l’utilisation d’un ORM (Prisma, TypeORM…) avec PostgreSQL ou MySQL.

Objectif unique :
- supprimer `any`
- figer le contrat d’entrée HTTP
- valider automatiquement les données
- découpler l’API de la base de données

Aucune sur‑architecture. Aucun mapping inutile.

---

## Pré-requis

- CRUD fonctionnel (étapes 001 → 007)
- NestJS
- Module `continent` existant

---

## Installation des dépendances

```bash
npm install class-validator class-transformer
```

---

## Principe

- Le **Controller** reçoit uniquement des DTO
- Le **Service** ne valide plus manuellement
- Le **Repository** reste inchangé
- Les routes HTTP ne changent pas
- La validation est faite automatiquement par NestJS

---

## Activation de la validation globale

Fichier : `src/main.ts`

```ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();
```

Effets :
- champs inconnus rejetés
- erreurs `400` automatiques
- suppression de la validation manuelle

---

## DTOs

Fichier : `src/modules/continent/continent.dto.ts`

```ts
import { IsOptional, IsString, Length } from 'class-validator';

export class CreateContinentDto {
  @IsString()
  @Length(2, 60)
  name: string;
}

export class UpdateContinentDto {
  @IsOptional()
  @IsString()
  @Length(2, 60)
  name?: string;
}
```

---

## Controller

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
import { CreateContinentDto, UpdateContinentDto } from './continent.dto';

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
  create(@Body() dto: CreateContinentDto) {
    return this.continentService.create(dto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateContinentDto,
  ) {
    return this.continentService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.continentService.delete(id);
  }
}
```

---

## Service

Fichier : `src/modules/continent/continent.service.ts`

```ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { ContinentRepository } from './continent.repository';
import { CreateContinentDto, UpdateContinentDto } from './continent.dto';

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

  create(dto: CreateContinentDto) {
    return this.continentRepository.create(dto);
  }

  update(id: number, dto: UpdateContinentDto) {
    const updated = this.continentRepository.update(id, dto);
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

## Repository (rappel)

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
      id: this.currentId++,
      ...data,
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

## Comportement obtenu

- `{}` → `400 Bad Request`
- `{ "name": "" }` → `400 Bad Request`
- `{ "name": "A" }` → `400 Bad Request`
- `{ "name": "Europe", "id": 99 }` → `400 Bad Request`
- données valides → OK

---

## Ce que cette étape apporte

- API sécurisée
- contrat stable
- validation automatique
- préparation ORM / base relationnelle
- aucune modification des routes

---

## Étape suivante

**009-continent-prisma-postgresql**

Objectif :
- brancher Prisma
- connecter PostgreSQL ou MySQL
- remplacer uniquement le repository

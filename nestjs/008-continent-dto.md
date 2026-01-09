# 008 — Continent DTO (version simple)

Cette étape introduit des **DTO simples**, sans validation automatique.

Objectif :
- supprimer `any`
- typer clairement les entrées
- préparer l’utilisation d’un ORM (Prisma, PostgreSQL, MySQL)
- rester lisible et explicite

Aucune magie. Aucune dépendance supplémentaire.

---

## Principe

- Les DTO sont de **simples interfaces TypeScript**
- La validation reste **manuelle et minimale** dans le service
- L’architecture ne change pas
- Les routes HTTP restent identiques

---

## DTO simples

Fichier : `src/modules/continent/continent.dto.ts`

```ts
export interface CreateContinentDto {
  name: string;
}

export interface UpdateContinentDto {
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

## Service (validation explicite minimale)

Fichier : `src/modules/continent/continent.service.ts`

```ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    if (!dto.name) {
      throw new BadRequestException('name is required');
    }
    return this.continentRepository.create({ name: dto.name });
  }

  update(id: number, dto: UpdateContinentDto) {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('at least one field is required');
    }

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

## Repository (inchangé)

Le repository reste **strictement identique** à l’étape précédente.
Il pourra être remplacé plus tard par une implémentation Prisma ou SQL
sans toucher aux controllers ni aux services.

---

## Ce que cette version apporte

- plus de `any`
- contrat clair et lisible
- aucune dépendance
- validation explicite
- compréhension immédiate
- ORM prêt à être branché

---

## Ce que cette version n’impose pas

- pas de validation automatique
- pas de décorateurs
- pas de pipeline global
- pas de complexité cachée

---

## Étape suivante possible

- **009-continent-prisma-postgresql**  
ou
- **009-continent-dto-validation** (si tu veux ajouter la validation plus tard)

Cette étape 008 est **volontairement simple** et **parfaitement saine**.

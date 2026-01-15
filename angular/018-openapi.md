# angular-openapi

---

## Commandes

```bash
npm i -D @openapitools/openapi-generator-cli
```

```bash
npx @openapitools/openapi-generator-cli generate \
  -i contracts/continent-api.yaml \
  -g typescript-angular \
  -o src/app/api
```

---

## Contrat

### contracts/continent-api.yaml

```yaml
openapi: 3.0.3
info:
  title: Continent API
  version: 1.0.0

paths:
  /continents:
    get:
      operationId: getContinents
      responses:
        '200':
          description: ok
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Continent'

components:
  schemas:
    Continent:
      type: object
      required:
        - id
        - name
      properties:
        id:
          type: integer
        name:
          type: string
```

---

## Structure générée

```text
src/app/api/
├── api.module.ts
├── configuration.ts
├── index.ts
├── model/
│   └── continent.ts
└── api/
    └── continent.service.ts
```

---

## Code généré

### src/app/api/model/continent.ts

```ts
export interface Continent {
  id: number;
  name: string;
}
```

---

### src/app/api/api/continent.service.ts

```ts
public getContinents(): Observable<Array<Continent>> {
  return this.httpClient.get<Array<Continent>>(
    `${this.basePath}/continents`
  );
}
```

---

## Utilisation

### src/app/app.ts

```ts
import { Component, signal } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ContinentService, Continent } from './api';

@Component({
  selector: 'app-root',
  imports: [HttpClientModule, CommonModule],
  templateUrl: './app.html'
})
export class App {
  readonly continents = signal<Continent[]>([]);
  readonly error = signal('');

  constructor(private api: ContinentService) {}

  onLoadContinents() {
    this.error.set('');
    this.api.getContinents().subscribe({
      next: data => this.continents.set(data),
      error: () => this.error.set('Erreur API')
    });
  }
}
```

---

### src/app/app.html

```html
<h1>angular-openapi</h1>

<button (click)="onLoadContinents()">Load</button>

<div *ngIf="error()">{{ error() }}</div>

<ul>
  @for (c of continents(); track c.id) {
    <li>{{ c.id }} - {{ c.name }}</li>
  }
</ul>
```

---

## Script

### package.json

```json
{
  "scripts": {
    "gen:api": "openapi-generator-cli generate -i contracts/continent-api.yaml -g typescript-angular -o src/app/api"
  }
}
```

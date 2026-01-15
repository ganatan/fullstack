# angular-continent-api

Consommation d'une API REST `/continents` avec Angular, en utilisant :
- HttpClient
- Observable
- DTO
- Mapping vers un modèle UI
- Signals pour l'état

---

## Commandes

```bash
ng g service services/continents-api
```

---

## Backend attendu

```http
GET http://localhost:3000/continents
```

Réponse :

```json
[
  { "id": 1, "name": "Africa" },
  { "id": 2, "name": "Europe" }
]
```

---

## Structure

```text
src/app/
├── services/
│   └── continents-api.ts
├── app.ts
└── app.html
```

---

## Code

### src/app/services/continents-api.ts

```ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export type ContinentDTO = { id: number; name: string };
export type Continent = { id: number; label: string };

@Injectable({ providedIn: 'root' })
export class ContinentsApi {
  private readonly baseUrl = 'http://localhost:3000/continents';

  constructor(private http: HttpClient) {}

  list$(): Observable<Continent[]> {
    return this.http.get<ContinentDTO[]>(this.baseUrl).pipe(
      map(dtos => dtos.map(dto => ({ id: dto.id, label: dto.name })))
    );
  }
}
```

---

### src/app/app.ts

```ts
import { Component, signal } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ContinentsApi, Continent } from './services/continents-api';

@Component({
  selector: 'app-root',
  imports: [HttpClientModule, CommonModule],
  templateUrl: './app.html'
})
export class App {
  readonly continents = signal<Continent[]>([]);
  readonly error = signal('');

  constructor(private api: ContinentsApi) {}

  onLoadContinents() {
    this.error.set('');
    this.api.list$().subscribe({
      next: (data) => this.continents.set(data),
      error: () => this.error.set('Erreur API /continents')
    });
  }
}
```

---

### src/app/app.html

```html
<h1>angular-continent-api</h1>

<button (click)="onLoadContinents()">Load</button>

<div *ngIf="error()">{{ error() }}</div>

<ul>
  @for (c of continents(); track c.id) {
    <li>{{ c.id }} - {{ c.label }}</li>
  }
</ul>
```

---

## Points clés d'architecture

- DTO = contrat API
- Mapping DTO → modèle UI dans le service
- Observable pour l'I/O
- Signal pour l'état UI
- Composant découplé du backend

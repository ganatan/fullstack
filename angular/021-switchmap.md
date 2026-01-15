# angular-switchmap

---

## Backend attendu

```http
GET http://localhost:3000/continents?search=eu
```

Réponse :

```json
[
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
import { Observable } from 'rxjs';

export type Continent = { id: number; name: string };

@Injectable({ providedIn: 'root' })
export class ContinentsApi {
  private readonly baseUrl = 'http://localhost:3000/continents';

  constructor(private http: HttpClient) {}

  search$(term: string): Observable<Continent[]> {
    return this.http.get<Continent[]>(`${this.baseUrl}?search=${term}`);
  }
}
```

---

### src/app/app.ts

```ts
import { Component, signal } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Subject, switchMap, debounceTime } from 'rxjs';
import { ContinentsApi } from './services/continents-api';

@Component({
  selector: 'app-root',
  imports: [HttpClientModule, CommonModule],
  templateUrl: './app.html'
})
export class App {
  readonly continents = signal<string[]>([]);
  readonly error = signal('');

  private readonly search$ = new Subject<string>();

  constructor(private api: ContinentsApi) {
    this.search$
      .pipe(
        debounceTime(300),
        switchMap(term => this.api.search$(term))
      )
      .subscribe({
        next: list => this.continents.set(list.map(c => c.name)),
        error: () => this.error.set('Erreur API')
      });
  }

  onSearch(value: string) {
    this.search$.next(value);
  }
}
```

---

### src/app/app.html

```html
<h1>angular-switchmap</h1>

<input
  type="text"
  placeholder="search continent"
  (input)="onSearch($any($event.target).value)"
>

<ul>
  @for (name of continents(); track name) {
    <li>{{ name }}</li>
  }
</ul>
```

---

## Lecture du flux

```text
input utilisateur
  ↓
Subject<string>
  ↓
debounceTime
  ↓
switchMap (annule l’appel précédent)
  ↓
HTTP GET
  ↓
Observable émet Continent[]
```

---

## Point clé

- un seul flux d’entrée
- switchMap annule les appels précédents
- seul le dernier résultat est pris en compte
- adapté à la recherche et l’autocomplete
